#!/bin/bash
echo "🚀 Setting up the AI-Profiler project..."

# Backend Setup
echo "🐍 Setting up Python environment..."
pip install -r requirements.txt

# Frontend Setup
echo "⚛️ Setting up Frontend..."
cd frontend
npm install
cd ..

echo "✅ Setup complete!"
