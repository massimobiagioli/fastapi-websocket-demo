from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import logging
import os


BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"


app = FastAPI()

logger_name = os.getenv("APP_LOGGER", __name__)
logger = logging.getLogger(logger_name)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            try:
                data = await websocket.receive_text()
                logger.debug("Received message: %s", data)
            except WebSocketDisconnect:
                logger.info("WebSocket client disconnected")
                break
            await websocket.send_text(f"Message text was: {data}")
    except Exception:
        logger.exception("Unhandled exception in websocket handler")
    finally:
        try:
            await websocket.close()
        except Exception:
            logger.debug("Error while closing websocket", exc_info=True)


app.mount(
    "/",
    StaticFiles(directory=str(FRONTEND_DIST), html=True),
    name="frontend",
)