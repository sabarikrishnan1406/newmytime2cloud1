"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCameraStatus } from "@/lib/endpoint/live-camera";
import { parseApiError } from "@/lib/utils";

const PROXY_URL = process.env.NEXT_PUBLIC_CAMERA_PROXY_URL || "ws://localhost:8501";
const DETECT_URL = process.env.NEXT_PUBLIC_CAMERA_SERVICE_URL || "ws://localhost:8500";

export default function Stream({ deviceId }) {
  const router = useRouter();
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const latestBitmapRef = useRef(null);
  const detectionsRef = useRef({ dets: [], srcW: 1, srcH: 1 });
  const rafRef = useRef(null);
  const canvasSizeRef = useRef({ w: 0, h: 0 });

  const [cameraInfo, setCameraInfo] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [detections, setDetections] = useState([]);
  const [faceCount, setFaceCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const result = await getCameraStatus(deviceId);
        if (result?.status) {
          setCameraInfo(result.data);
        }
      } catch (err) {
        setError(parseApiError(err));
      }
    };
    fetchInfo();
  }, [deviceId]);

  // Render loop: paints latest video frame + detection overlays at screen refresh rate
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const bitmap = latestBitmapRef.current;

    if (canvas && bitmap) {
      const ctx = canvas.getContext("2d");

      if (canvasSizeRef.current.w !== bitmap.width || canvasSizeRef.current.h !== bitmap.height) {
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        canvasSizeRef.current = { w: bitmap.width, h: bitmap.height };

        // Match overlay canvas size
        if (overlayRef.current) {
          overlayRef.current.width = bitmap.width;
          overlayRef.current.height = bitmap.height;
        }
      }

      ctx.drawImage(bitmap, 0, 0);
      bitmap.close();
      latestBitmapRef.current = null;
    }

    // Draw detection overlays on separate canvas
    const overlay = overlayRef.current;
    if (overlay && overlay.width > 0) {
      const octx = overlay.getContext("2d");
      octx.clearRect(0, 0, overlay.width, overlay.height);

      const { dets, srcW, srcH } = detectionsRef.current;
      if (dets.length > 0) {
        // Scale from detection source frame to overlay canvas
        const scaleX = overlay.width / srcW;
        const scaleY = overlay.height / srcH;

        dets.forEach((det) => {
          const [bx, by, bw, bh] = det.bbox;
          const dx = bx * scaleX;
          const dy = by * scaleY;
          const dw = bw * scaleX;
          const dh = bh * scaleY;

          const isRecognized = det.recognized !== false && det.name !== "Unknown";

          // Green for recognized, red for unknown
          const color = isRecognized ? "#22c55e" : "#ef4444";

          octx.strokeStyle = color;
          octx.lineWidth = 3;
          octx.strokeRect(dx, dy, dw, dh);

          // Label background
          const label = isRecognized
            ? `${det.name} (${Math.round(det.confidence * 100)}%)`
            : "Unknown";
          octx.font = "bold 16px sans-serif";
          const textWidth = octx.measureText(label).width;
          octx.fillStyle = isRecognized ? "rgba(34, 197, 94, 0.85)" : "rgba(239, 68, 68, 0.85)";
          octx.fillRect(dx, dy - 28, textWidth + 16, 28);

          // Label text
          octx.fillStyle = "#ffffff";
          octx.fillText(label, dx + 8, dy - 8);
        });
      }
    }

    rafRef.current = requestAnimationFrame(renderFrame);
  }, []);

  // Video stream from camera-proxy (binary JPEG, smooth)
  useEffect(() => {
    if (!cameraInfo) return;

    const ws = new WebSocket(`${PROXY_URL}/stream/${deviceId}`);
    ws.binaryType = "blob";

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
      rafRef.current = requestAnimationFrame(renderFrame);
    };

    ws.onmessage = async (event) => {
      try {
        if (event.data instanceof Blob) {
          const bitmap = await createImageBitmap(event.data);
          if (latestBitmapRef.current) {
            latestBitmapRef.current.close();
          }
          latestBitmapRef.current = bitmap;
        } else {
          const data = JSON.parse(event.data);
          if (data.error) setError(data.error);
        }
      } catch (err) {
        console.error("Stream error:", err);
      }
    };

    ws.onerror = () => {
      setError("Connection to camera failed");
      setIsConnected(false);
    };

    ws.onclose = () => setIsConnected(false);

    return () => {
      ws.close();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (latestBitmapRef.current) {
        latestBitmapRef.current.close();
        latestBitmapRef.current = null;
      }
    };
  }, [cameraInfo, deviceId, renderFrame]);

  // Face detection from Python service (separate channel, doesn't affect video)
  useEffect(() => {
    if (!cameraInfo) return;

    let ws = null;
    let cancelled = false;
    let reconnectTimer = null;

    const connect = () => {
      if (cancelled) return;

      ws = new WebSocket(`${DETECT_URL}/detect/${deviceId}`);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.error) {
            console.warn("Detection error:", data.error);
            return;
          }
          if (data.detections) {
            detectionsRef.current = {
              dets: data.detections,
              srcW: data.frameWidth || 1280,
              srcH: data.frameHeight || 720,
            };
            setDetections(data.detections);
            setFaceCount(data.count || data.detections.length);
          }
        } catch (err) {
          console.error("Detection parse error:", err);
        }
      };

      ws.onerror = () => console.warn("Detection WebSocket failed — video continues");

      ws.onclose = () => {
        // Auto-reconnect after 2 seconds unless component unmounted
        if (!cancelled) {
          reconnectTimer = setTimeout(connect, 2000);
        }
      };
    };

    // Delay initial connection to avoid React strict mode double-mount race
    const startTimer = setTimeout(connect, 1500);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, [cameraInfo, deviceId]);

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/live-camera")}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors rounded-full p-1"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-600 dark:text-gray-300">
            {cameraInfo?.name || "Live Camera"}
          </h1>
          <p className="text-sm text-slate-400">
            {cameraInfo?.camera_rtsp_ip || "Loading..."}
          </p>
        </div>
        <span
          className={`ml-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isConnected
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          ></span>
          {isConnected ? "Live" : "Disconnected"}
        </span>
        {faceCount > 0 && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            <span className="material-symbols-outlined text-[14px]">face</span>
            {faceCount} {faceCount === 1 ? "face" : "faces"} detected
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Video Stream with Detection Overlay */}
        <div className="lg:col-span-3">
          <div className="bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center relative">
            {isConnected ? (
              <>
                <canvas ref={canvasRef} className="w-full h-full object-contain" />
                <canvas
                  ref={overlayRef}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
              </>
            ) : (
              <div className="text-slate-400 text-center">
                <span className="material-symbols-outlined text-6xl mb-2 block">videocam_off</span>
                <p>Waiting for camera connection...</p>
              </div>
            )}
          </div>
        </div>

        {/* Detection Log */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-white/10 p-4">
            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-3">
              Detected Faces
            </h3>
            {detections.length === 0 ? (
              <p className="text-xs text-slate-400">No faces detected yet</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {detections.map((det, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      det.recognized !== false && det.name !== "Unknown"
                        ? "bg-green-50 dark:bg-green-900/10"
                        : "bg-red-50 dark:bg-red-900/10"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${
                      det.recognized !== false && det.name !== "Unknown"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}>
                      {det.recognized !== false && det.name !== "Unknown" ? "person" : "person_off"}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {det.name}
                      </p>
                      {det.confidence > 0 && (
                        <p className="text-xs text-slate-400">
                          {(det.confidence * 100).toFixed(1)}% match
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
