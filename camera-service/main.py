import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import HOST, PORT
from routers import detect, register, employees

app = FastAPI(title="MyTime2Cloud Camera Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detect.router)
app.include_router(register.router)
app.include_router(employees.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "camera-service", "model": "arcface-buffalo_l"}


def log(msg):
    print(msg, flush=True)


if __name__ == "__main__":
    log(f"Starting camera service on {HOST}:{PORT}")
    uvicorn.run("main:app", host=HOST, port=PORT)
