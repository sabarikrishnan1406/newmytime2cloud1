const { WebSocketServer } = require("ws");
const { spawn } = require("child_process");
const axios = require("axios");
require("dotenv").config();

const PORT = process.env.PROXY_PORT || 8500;
const LARAVEL_API = process.env.LARAVEL_API_URL || "http://localhost:8000/api";
const LARAVEL_TOKEN = process.env.LARAVEL_API_TOKEN || "";

const wss = new WebSocketServer({ port: PORT });

console.log(`Camera proxy running on ws://localhost:${PORT}`);

wss.on("connection", async (ws, req) => {
  const urlParts = req.url.split("/");
  const deviceId = urlParts[urlParts.length - 1];

  if (!deviceId) {
    ws.send(JSON.stringify({ error: "No device ID provided" }));
    ws.close();
    return;
  }

  console.log(`Client connected for device: ${deviceId}`);

  try {
    const { data } = await axios.get(
      `${LARAVEL_API}/camera/${deviceId}/credentials`,
      { headers: { Authorization: `Bearer ${LARAVEL_TOKEN}` } }
    );

    if (!data.status) {
      ws.send(JSON.stringify({ error: "Camera not found" }));
      ws.close();
      return;
    }

    const creds = data.data;
    const ip = creds.camera_rtsp_ip;
    const port = creds.camera_rtsp_port || 554;
    const user = creds.camera_username || "";
    const pass = creds.camera_password || "";

    const encodedUser = encodeURIComponent(user);
    const encodedPass = encodeURIComponent(pass);

    let rtspUrl;
    if (user && pass) {
      rtspUrl = `rtsp://${encodedUser}:${encodedPass}@${ip}:${port}/Streaming/Channels/101`;
    } else {
      rtspUrl = `rtsp://${ip}:${port}/Streaming/Channels/101`;
    }

    console.log(`Connecting to camera at ${ip}:${port}`);

    const ffmpeg = spawn("ffmpeg", [
      "-rtsp_transport", "tcp",
      "-fflags", "nobuffer",
      "-flags", "low_delay",
      "-i", rtspUrl,
      "-f", "mjpeg",
      "-q:v", "3",
      "-r", "20",
      "-vf", "scale=1280:-1",
      "-an",
      "pipe:1",
    ]);

    ffmpeg.on("error", (err) => {
      console.error("FFmpeg spawn error:", err.message);
      if (ws.readyState === 1) {
        ws.send(JSON.stringify({ error: "FFmpeg not found. Please install FFmpeg." }));
        ws.close();
      }
    });

    let buffer = Buffer.alloc(0);
    const SOI = Buffer.from([0xff, 0xd8]);
    const EOI = Buffer.from([0xff, 0xd9]);

    ffmpeg.stdout.on("data", (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);

      while (true) {
        const soiIndex = buffer.indexOf(SOI);
        const eoiIndex = buffer.indexOf(EOI);

        if (soiIndex === -1 || eoiIndex === -1 || eoiIndex < soiIndex) break;

        const frame = buffer.subarray(soiIndex, eoiIndex + 2);
        buffer = buffer.subarray(eoiIndex + 2);

        // Send raw binary JPEG — skip if WebSocket is backed up (backpressure)
        if (ws.readyState === 1 && ws.bufferedAmount < 512 * 1024) {
          ws.send(frame);
        }
      }
    });

    ffmpeg.stderr.on("data", (data) => {
      const msg = data.toString();
      if (msg.includes("Error") || msg.includes("error") || msg.includes("Connection")) {
        console.error(`FFmpeg: ${msg.trim()}`);
      }
    });

    ffmpeg.on("close", (code) => {
      console.log(`FFmpeg exited with code ${code}`);
      if (ws.readyState === 1) {
        ws.send(JSON.stringify({ error: "Camera stream ended" }));
        ws.close();
      }
    });

    ws.on("close", () => {
      console.log(`Client disconnected for device: ${deviceId}`);
      if (ffmpeg && !ffmpeg.killed) ffmpeg.kill("SIGTERM");
    });

    ws.on("error", () => {
      if (ffmpeg && !ffmpeg.killed) ffmpeg.kill("SIGTERM");
    });

  } catch (err) {
    console.error("Failed to fetch camera credentials:", err.message);
    ws.send(JSON.stringify({ error: "Failed to fetch camera credentials" }));
    ws.close();
  }
});
