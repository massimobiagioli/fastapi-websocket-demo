from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"


app = FastAPI()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            try:
                data = await websocket.receive_text()
                print (f"Received message: {data}")
            except WebSocketDisconnect:
                # client disconnected gracefully
                break
            await websocket.send_text(f"Message text was: {data}")
    except Exception:
        import traceback

        traceback.print_exc()
    finally:
        try:
            await websocket.close()
        except Exception:
            pass


# Mount SPA static files after registering websocket routes so websocket scopes are
# handled by the websocket route instead of being intercepted by StaticFiles.
app.mount(
    "/",
    StaticFiles(directory=str(FRONTEND_DIST), html=True),
    name="frontend",
)