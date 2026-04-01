import asyncio
import cv2
import httpx
import numpy as np
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from config import LARAVEL_API_URL, LARAVEL_API_TOKEN, FACE_SIMILARITY_THRESHOLD, FACE_DETECT_INTERVAL
from services import arcface
from database.connection import load_all_embeddings

router = APIRouter()

# In-memory cache of employee embeddings, keyed by company_id
_embeddings_cache = {}

# Camera proxy WebSocket URL
PROXY_URL = "ws://localhost:8501"


def log(msg):
    print(msg, flush=True)


def get_embeddings(company_id: int) -> dict:
    """Get cached embeddings or load from DB."""
    if company_id not in _embeddings_cache:
        _embeddings_cache[company_id] = load_all_embeddings(company_id)
    return _embeddings_cache[company_id]


def refresh_embeddings(company_id: int):
    """Force refresh embeddings from DB."""
    _embeddings_cache[company_id] = load_all_embeddings(company_id)


async def fetch_device_company(device_id: str) -> int:
    """Fetch company_id for a device from Laravel API."""
    try:
        headers = {}
        if LARAVEL_API_TOKEN and LARAVEL_API_TOKEN.strip():
            headers["Authorization"] = f"Bearer {LARAVEL_API_TOKEN}"

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{LARAVEL_API_URL}/camera/{device_id}/credentials",
                headers=headers,
            )
            data = response.json()
            if data.get("status"):
                return data["data"].get("company_id") or 1
    except Exception as e:
        log(f"Error fetching device info: {e}")
    return 1


@router.websocket("/detect/{device_id}")
async def detect_stream(websocket: WebSocket, device_id: str):
    """Detection via camera proxy frames — no separate RTSP connection needed.

    Connects to the camera-proxy WebSocket to receive JPEG frames,
    runs ArcFace detection on them, and sends results back to the client.
    This avoids the Hikvision RTSP session limit issue.
    """
    await websocket.accept()
    log(f"=== Detection connected for device {device_id} ===")

    proxy_ws = None
    try:
        await websocket.send_json({"status": "connecting", "message": "Loading face data..."})

        # Get company_id and load embeddings
        company_id = await fetch_device_company(device_id)
        stored = get_embeddings(company_id)
        log(f"Loaded embeddings for company {company_id}: {len(stored)} employees")

        await websocket.send_json({"status": "connecting", "message": "Connecting to camera..."})

        # Connect to camera proxy WebSocket to get frames
        import websockets
        proxy_ws = await websockets.connect(
            f"{PROXY_URL}/stream/{device_id}",
            max_size=10 * 1024 * 1024,  # 10MB max frame size
        )

        await websocket.send_json({"status": "detecting", "message": "Face detection active"})
        log("Detection stream active — reading frames from camera proxy")

        frame_count = 0
        loop = asyncio.get_event_loop()

        async for message in proxy_ws:
            # Proxy sends binary JPEG frames
            if isinstance(message, bytes):
                frame_count += 1

                if frame_count % FACE_DETECT_INTERVAL != 0:
                    continue

                # Decode JPEG to OpenCV frame
                img_array = np.frombuffer(message, dtype=np.uint8)
                frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
                if frame is None:
                    continue

                # Run ArcFace detection in background thread
                faces = await loop.run_in_executor(None, arcface.detect_faces, frame)

                detections = []
                for face in faces:
                    embedding = arcface.get_embedding(face)
                    bbox = arcface.face_to_bbox(face)

                    match = arcface.compare_embedding(
                        embedding, stored, FACE_SIMILARITY_THRESHOLD
                    )

                    if match:
                        detections.append({
                            "name": match["name"],
                            "employee_id": match["employee_id"],
                            "confidence": match["confidence"],
                            "bbox": bbox,
                            "recognized": True,
                        })
                    else:
                        detections.append({
                            "name": "Unknown",
                            "employee_id": None,
                            "confidence": 0.0,
                            "bbox": bbox,
                            "recognized": False,
                        })

                await websocket.send_json({
                    "detections": detections,
                    "count": len(detections),
                    "frameWidth": frame.shape[1],
                    "frameHeight": frame.shape[0],
                })

                if frame_count % 30 == 0:
                    recognized = sum(1 for d in detections if d["recognized"])
                    log(f"Frame #{frame_count}: {len(detections)} faces ({recognized} recognized)")

            elif isinstance(message, str):
                # Text message from proxy (error/info)
                log(f"Proxy message: {message}")

    except WebSocketDisconnect:
        log("Detection client disconnected")
    except Exception as e:
        log(f"Detection error: {type(e).__name__}: {e}")
        try:
            await websocket.send_json({"error": str(e)})
        except:
            pass
    finally:
        if proxy_ws is not None:
            await proxy_ws.close()
        log("=== Detection stream closed ===")
