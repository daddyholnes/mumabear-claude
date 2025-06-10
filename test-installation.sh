#!/bin/bash

# 🧪 Podplay Sanctuary - Installation Test Script
# Tests the complete installation process

set -e

echo "🧪 Testing Podplay Sanctuary Installation"
echo "========================================"

# Test 1: Check if .env.example exists
echo "1️⃣ Checking environment template..."
if [ ! -f ".env.example" ]; then
    echo "❌ .env.example not found"
    exit 1
fi
echo "✅ .env.example found"

# Test 2: Test backend setup
echo ""
echo "2️⃣ Testing backend setup..."
cd backend

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    exit 1
fi
python_version=$(python3 --version)
echo "✅ Python available: $python_version"

# Check requirements.txt
if [ ! -f "requirements.txt" ]; then
    echo "❌ requirements.txt not found"
    exit 1
fi
echo "✅ requirements.txt found"

# Test virtual environment creation (quick test)
echo "🔧 Testing virtual environment creation..."
python3 -m venv test_venv_quick
source test_venv_quick/bin/activate
pip install flask > /dev/null 2>&1
deactivate
rm -rf test_venv_quick
echo "✅ Virtual environment test passed"

cd ..

# Test 3: Test frontend setup  
echo ""
echo "3️⃣ Testing frontend setup..."
cd frontend

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi
node_version=$(node --version)
echo "✅ Node.js available: $node_version"

# Check package.json
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found"
    exit 1
fi
echo "✅ package.json found"

# Test npm/bun availability
if command -v bun &> /dev/null; then
    echo "✅ bun available for fast installs"
elif command -v npm &> /dev/null; then
    echo "✅ npm available"
else
    echo "❌ Neither npm nor bun available"
    exit 1
fi

cd ..

# Test 4: Check start scripts
echo ""
echo "4️⃣ Testing start scripts..."
if [ ! -f "start-backend.sh" ]; then
    echo "❌ start-backend.sh not found"
    exit 1
fi

if [ ! -f "start-frontend.sh" ]; then
    echo "❌ start-frontend.sh not found"
    exit 1
fi

chmod +x start-backend.sh start-frontend.sh
echo "✅ Start scripts found and made executable"

# Test 5: Validate key files
echo ""
echo "5️⃣ Validating project structure..."

key_files=(
    "backend/app.py"
    "backend/services"
    "frontend/src/App.tsx"
    "frontend/src/main.tsx"
    "frontend/vite.config.ts"
    "README.md"
)

for file in "${key_files[@]}"; do
    if [ ! -e "$file" ]; then
        echo "❌ Missing: $file"
        exit 1
    fi
done
echo "✅ All key files present"

# Final summary
echo ""
echo "🎉 INSTALLATION TEST PASSED!"
echo "=========================="
echo ""
echo "📋 Next Steps:"
echo "1. Copy environment: cp .env.example .env"
echo "2. Add your API keys to .env"
echo "3. Start backend: ./start-backend.sh"
echo "4. Start frontend: ./start-frontend.sh (new terminal)"
echo "5. Visit: http://localhost:3000"
echo ""
echo "🔑 Required API Keys:"
echo "   • OpenAI: https://platform.openai.com/api-keys"
echo "   • Anthropic: https://console.anthropic.com/"
echo "   • Gemini: https://makersuite.google.com/app/apikey"
echo "   • Scrapybara: https://scrapybara.com/dashboard"
echo "   • Mem0 (optional): https://app.mem0.ai/"
echo ""
echo "🐻 Welcome to your AI Sanctuary!"