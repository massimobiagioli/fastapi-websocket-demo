# fastapi-websocket-demo

A small demo project that shows a FastAPI backend exposing a WebSocket endpoint and a Qwik frontend (SPA) that can connect to it.

This repository contains:
- `app/` - FastAPI backend (WebSocket endpoint at `/ws`).
- `frontend/` - Qwik single-page application (SPA) built with Vite.

---

## Prerequisites

- Python 3.11 or newer
- Node.js matching the engines in `frontend/package.json` (recommended: Node 18.17.x or Node 20.3.x+)
- `pnpm` (for frontend). Install with `npm i -g pnpm` or via Homebrew on macOS.
- Optional: `uv` (a small Python workspace manager) if you prefer to install backend deps with it. A plain virtual environment + pip also works.

On macOS you can install common tools with Homebrew, for example:

```bash
# install Node if needed
brew install node

# install pnpm
npm install -g pnpm
```

---

## Backend (FastAPI)

The backend lives in `app/` and the main app object is `app.main:app`. It exposes a WebSocket at `ws://<host>:8000/ws` and serves the built frontend from `frontend/dist` when available.

There are two suggested ways to install backend dependencies.

Option A — Using `uv` (if you use the `uv` tool)

1. Install `uv` if you don't have it (optional but useful):

```bash
# using pipx (recommended)
pipx install uv

# or with pip into an existing environment
pip install uv
```

2. From the project root, run:

```bash
uv install
```

This will create a virtual environment (usually `.venv`) and install the dependencies declared in `pyproject.toml` using the included `uv.lock` file.

Option B — Using a standard virtual environment + pip

```bash
# create and activate a venv
python -m venv .venv
source .venv/bin/activate

# upgrade pip and install the project dependencies from pyproject
python -m pip install --upgrade pip
pip install .
```

Run the backend with Uvicorn (from the project root):

```bash
# activate your venv first if needed
. .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server will start on port `8000` by default and expose the WebSocket at `ws://localhost:8000/ws`.

---

## Frontend (Qwik + Vite)

The frontend is in `frontend/` and uses `pnpm` as the package manager.

Install and run development server:

```bash
cd frontend
pnpm install
pnpm run dev
```

By default Vite will show the dev URL in the console (commonly `http://localhost:5173`). Open `/testws` to reach the WebSocket test page (e.g. `http://localhost:5173/testws`).

Build frontend for production (outputs into `frontend/dist`):

```bash
cd frontend
pnpm run build
```

The backend is configured to serve the built SPA from `frontend/dist` when present. After building, you can browse the frontend via the backend server (e.g. `http://localhost:8000/testws`).

---

## Test WebSocket

1. Start the backend (see above).
2. Start the frontend dev server (`pnpm run dev`) or build the frontend and open it via the backend.
3. Open the `Test WebSocket` page at `/testws` and use the UI to connect to `ws://localhost:8000/ws`.

The demo frontend uses a vanilla browser `WebSocket` client (no extra dependency) to keep the example small and dependency-free.

---

## Notes & Troubleshooting

- If you get errors in the frontend build about incompatible Qwik exports (for example from third-party packages), make sure your `@builder.io/qwik` version is compatible with any Qwik-specific libraries you installed.
- If the WebSocket connection fails from the browser, check the backend console for a traceback and ensure the backend is running and accessible at the URL you specified.
- If you use a reverse proxy or run backend on a different origin than the frontend dev server, ensure WebSocket connections are proxied correctly and CORS/WS proxy settings are correct.

If you want, I can add a minimal automated `Makefile` or `scripts` to make starting both services easier (one command to start backend + frontend). Tell me which approach you prefer.
