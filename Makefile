# Makefile for Company Research Agent

# Variables
PYTHON=python3
PIP=pip
UV=uv
VENV=.venv
BACKEND_PORT=8000
FRONTEND_DIR=ui

# Detect if uv is available
UV_EXISTS := $(shell command -v uv 2> /dev/null)

.PHONY: setup backend frontend dev clean

setup:
	@if [ -n "$(UV_EXISTS)" ]; then \
		echo "[+] Using uv for Python setup..."; \
		$(UV) venv $(VENV); \
		source $(VENV)/bin/activate && $(UV) pip install -r requirements.txt; \
	else \
		echo "[+] Using pip for Python setup..."; \
		$(PYTHON) -m venv $(VENV); \
		source $(VENV)/bin/activate && $(PIP) install -r requirements.txt; \
	fi
	cd $(FRONTEND_DIR) && npm install

backend:
	@echo "[+] Starting backend (FastAPI with Uvicorn)..."
	. $(VENV)/bin/activate && uvicorn application:app --reload --port $(BACKEND_PORT)

frontend:
	@echo "[+] Starting frontend (Vite dev server)..."
	cd $(FRONTEND_DIR) && npm run dev

dev:
	@echo "[+] Starting backend and frontend (dev mode)..."
	@echo "[!] You will need two terminals for interactive logs."
	@echo "[+] Run 'make backend' in one terminal and 'make frontend' in another."

clean:
	@echo "[+] Cleaning up virtual environment and node_modules..."
	rm -rf $(VENV)
	cd $(FRONTEND_DIR) && rm -rf node_modules
