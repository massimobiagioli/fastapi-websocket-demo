#!/usr/bin/env bash
set -euo pipefail

# build.sh - install backend + frontend deps and build the frontend
# Usage: ./build.sh

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "Repo root: ${ROOT_DIR}"

echo "\n== Backend: install dependencies =="
cd "${ROOT_DIR}"

if command -v uv >/dev/null 2>&1; then
  echo "Found 'uv' — running: uv sync"
  uv sync
else
  echo "'uv' not found — creating venv and installing with pip"
  python -m venv .venv
  # shellcheck disable=SC1091
  . .venv/bin/activate
  python -m pip install --upgrade pip
  pip install .
fi

echo "\n== Frontend: install dependencies =="
cd "${ROOT_DIR}/frontend"

if command -v pnpm >/dev/null 2>&1; then
  pnpm install
else
  echo "pnpm not found. Attempting to install pnpm via npm..."
  if command -v npm >/dev/null 2>&1; then
    npm install -g pnpm
    pnpm install
  else
    echo "Error: neither 'pnpm' nor 'npm' are available. Install pnpm and re-run this script."
    exit 1
  fi
fi

echo "\n== Frontend: build =="
pnpm run build

echo "\nBuild complete. Frontend artifact is in: ${ROOT_DIR}/frontend/dist"
