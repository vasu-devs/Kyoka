#!/bin/bash
echo "🎬 Starting AI-Profiler..."

# Start Backend
echo "📡 Starting FastAPI Backend..."
python3 -m backend.main &
BACKEND_PID=$!

# Start Frontend
echo "💻 Starting Vite Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!

# Handle shutdown
cleanup() {
    echo "🛑 Shutting down..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

trap cleanup SIGINT SIGTERM

wait
