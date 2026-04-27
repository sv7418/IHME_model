#!/usr/bin/env bash
set -e

# Copy .env.example to .env if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example — please add your ANTHROPIC_API_KEY"
  exit 1
fi

# Install dependencies if needed
pip install -r requirements.txt -q

# Start the server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
