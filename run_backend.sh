#!/bin/bash
echo "🚀 Starting Podplay Sanctuary Backend..."
echo "==========================================="

# Activate virtual environment
if [ -d "venv" ]; then
    echo "🔧 Activating virtual environment..."
    source venv/bin/activate
else
    echo "⚠️ Virtual environment not found. Please run setup.sh"
    exit 1
fi

# Set PYTHONPATH to include the project root
export PYTHONPATH=$(pwd)

# Run the Flask app as a module
echo "🚀 Starting Mama Bear Backend on http://localhost:5001"
echo "📊 Health endpoint: http://localhost:5001/api/health"
echo "🔄 Press Ctrl+C to stop"
python -m backend.app