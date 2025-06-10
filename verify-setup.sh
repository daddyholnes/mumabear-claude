#!/bin/bash

echo "🔍 Verifying Podplay Sanctuary Setup..."
echo "========================================"

# Check Python
echo "🐍 Checking Python..."
if command -v python3 &> /dev/null; then
    echo "✅ Python3 found: $(python3 --version)"
else
    echo "❌ Python3 not found. Please install Python 3.8+"
fi

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js found: $(node --version)"
else
    echo "❌ Node.js not found. Please install Node.js 18+"
fi

# Check npm
echo "📦 Checking npm..."
if command -v npm &> /dev/null; then
    echo "✅ npm found: $(npm --version)"
else
    echo "❌ npm not found. Please install npm"
fi

# Check .env file
echo "🔧 Checking configuration..."
if [ -f ".env" ]; then
    echo "✅ .env file found"
    if grep -q "your_.*_key_here" .env; then
        echo "⚠️  Please update .env with your actual API keys"
    else
        echo "✅ .env appears to be configured"
    fi
else
    echo "❌ .env file not found"
fi

# Check backend structure
echo "🐍 Checking backend structure..."
if [ -d "backend" ] && [ -f "backend/app.py" ]; then
    echo "✅ Backend structure looks good"
else
    echo "❌ Backend structure incomplete"
fi

# Check frontend structure
echo "⚛️ Checking frontend structure..."
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
    echo "✅ Frontend structure looks good"
else
    echo "❌ Frontend structure incomplete"
fi

echo "========================================"
echo "🚀 Setup Verification Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Update .env with your API keys"
echo "2. Run ./start-backend.sh in one terminal"
echo "3. Run ./start-frontend.sh in another terminal"
echo "4. Open http://localhost:3000 in your browser"
echo "5. View marketing site: podplay-sanctuary-final.html"
echo ""
echo "📚 Need help? Check README.md for detailed instructions"