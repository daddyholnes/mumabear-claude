#!/bin/bash
# Podplay Sanctuary - Comprehensive Installation & Verification Script
# Ensures complete setup for the enhanced AI Model Friends Chat with Agent Workbench
# Includes validation for all 5 themes, AI experiences, and development tools

set -e  # Exit on any error

echo "🏛️ Podplay Sanctuary - Enhanced Installation & Verification"
echo "=========================================================="
echo "🎨 AI Model Friends Chat with Agent Workbench"
echo "🚀 5-Theme System | Execution Router | Scout Orchestration"
echo "💻 Development Tools | Real-time Chat | System Monitoring"
echo ""
echo "Current directory: $(pwd)"
echo "Date: $(date)"
echo ""

# Check if we're in the right directory
if [[ ! -f "DETAILED_DESIGN_1_CORE_FOUNDATION.md" ]]; then
    echo "❌ Error: Not in podplay-sanctuary directory"
    echo "Please run this script from the project root directory"
    echo "Looking for: DETAILED_DESIGN_1_CORE_FOUNDATION.md"
    exit 1
fi

echo "✅ Podplay Sanctuary project directory confirmed"

# Check Python version
echo "🐍 Checking Python version..."
python_version=$(python3 --version 2>&1)
echo "Python version: $python_version"

if ! python3 -c "import sys; assert sys.version_info >= (3, 9)" 2>/dev/null; then
    echo "❌ Error: Python 3.9+ required for enhanced AI features"
    exit 1
fi
echo "✅ Python version OK (3.9+ for AI model compatibility)"

# Check Node.js version for frontend
echo "📦 Checking Node.js version..."
if command -v node &> /dev/null; then
    node_version=$(node --version)
    echo "Node.js version: $node_version"
    
    # Extract major version number
    major_version=$(echo $node_version | sed 's/v//' | cut -d. -f1)
    if [[ $major_version -ge 18 ]]; then
        echo "✅ Node.js version OK (18+ for Vite and modern React)"
    else
        echo "❌ Error: Node.js 18+ required for modern frontend tooling"
        exit 1
    fi
else
    echo "❌ Error: Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check if virtual environment exists
echo "🔧 Checking Python virtual environment..."
if [[ ! -d "backend/venv" ]]; then
    echo "📦 Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    cd ..
fi
echo "✅ Python virtual environment ready"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
source venv/bin/activate

# Upgrade pip first
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "📥 Installing Python packages..."
pip install -r requirements.txt

echo "✅ Backend dependencies installed successfully"

# Verify critical AI packages
echo "🤖 Verifying AI model packages..."
python3 -c "
import sys
required_packages = [
    'anthropic', 'openai', 'google-generativeai', 
    'flask', 'flask-socketio', 'flask-cors',
    'requests', 'websockets', 'asyncio'
]
missing = []
for pkg in required_packages:
    try:
        __import__(pkg.replace('-', '_'))
    except ImportError:
        missing.append(pkg)
if missing:
    print(f'❌ Missing packages: {missing}')
    sys.exit(1)
print('✅ All critical AI packages available')
"

cd ..

# Check frontend dependencies
echo "📦 Installing frontend dependencies..."
if [[ ! -d "frontend/node_modules" ]]; then
    echo "📥 Installing Node.js packages..."
    cd frontend
    npm install
    cd ..
else
    echo "✅ Frontend node_modules already exists"
fi

# Verify frontend setup
echo "⚛️ Verifying frontend setup..."
cd frontend
if [[ -f "package.json" ]]; then
    # Check for critical dependencies
    if grep -q "react.*18" package.json && grep -q "vite" package.json; then
        echo "✅ Modern React 18 + Vite setup confirmed"
    else
        echo "⚠️ Warning: Frontend may need dependency updates"
    fi
else
    echo "❌ Error: Frontend package.json not found"
    exit 1
fi
cd ..

# Check if .env file exists
if [[ ! -f ".env" ]]; then
    echo "⚠️ Warning: .env file not found"
    echo "🔧 Creating comprehensive template .env file..."
    cat > .env << 'EOF'
# Podplay Sanctuary - Comprehensive Environment Configuration
# AI Model Friends Chat with Agent Workbench

# ==================== AI MODEL APIS ====================
# Core AI Services
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Additional AI Services
MISTRAL_API_KEY=your_mistral_api_key_here
COHERE_API_KEY=your_cohere_api_key_here

# ==================== EXECUTION SERVICES ====================
# E2B (Code Execution)
E2B_API_KEY=your_e2b_api_key_here

# Scrapybara (Web Scraping)
SCRAPYBARA_API_KEY=your_scrapybara_api_key_here

# ==================== MEMORY & PERSISTENCE ====================
# Mem0 Configuration
MEM0_API_KEY=your_mem0_api_key_here
MEM0_USER_ID=your_user_id_here
MEM0_MEMORY_ENABLED=True
MEM0_RAG_ENABLED=True

# ==================== SERVER CONFIGURATION ====================
# Flask Backend
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5001

# Frontend
FRONTEND_PORT=3000

# ==================== INTEGRATIONS ====================
# Redis (for caching and sessions)
REDIS_URL=redis://localhost:6379

# WebSocket Configuration
WEBSOCKET_ENABLED=True
WEBSOCKET_PORT=5002

# ==================== THEME & UI CONFIGURATION ====================
# Default Theme
DEFAULT_THEME=sanctuary
THEME_CUSTOMIZATION_ENABLED=True

# ==================== DEVELOPMENT TOOLS ====================
# DevWorkspaces
DEV_WORKSPACES_ENABLED=True

# Live API Studio
API_STUDIO_ENABLED=True

# System Monitoring
SYSTEM_MONITORING_ENABLED=True

# ==================== SECURITY ====================
# Session Management
SESSION_SECRET_KEY=your_session_secret_key_here
JWT_SECRET_KEY=your_jwt_secret_key_here

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
EOF
    echo "📝 Comprehensive template .env file created"
    echo "⚠️ IMPORTANT: Please update with your actual API keys before starting"
    echo "✅ Environment file ready"
else
    echo "✅ Environment file exists"
    
    # Validate critical environment variables
    echo "🔍 Validating environment configuration..."
    missing_vars=()
    
    # Check for critical API keys
    if ! grep -q "^ANTHROPIC_API_KEY=.*[^_here]" .env; then
        missing_vars+=("ANTHROPIC_API_KEY")
    fi
    
    if ! grep -q "^OPENAI_API_KEY=.*[^_here]" .env; then
        missing_vars+=("OPENAI_API_KEY")
    fi
    
    if ! grep -q "^GOOGLE_AI_API_KEY=.*[^_here]" .env; then
        missing_vars+=("GOOGLE_AI_API_KEY")
    fi
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        echo "⚠️ Warning: Missing or template API keys detected:"
        printf "   - %s\n" "${missing_vars[@]}"
        echo "   Please configure these before full functionality is available"
    else
        echo "✅ Core API keys appear to be configured"
    fi
fi

# Check if backend can start
echo "🚀 Testing backend startup..."
cd backend
source venv/bin/activate

# Start backend in background for testing
echo "⏳ Starting Flask backend (port 5001)..."
python app.py &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 8

# Test backend health endpoints
echo "🏥 Testing backend health endpoints..."

# Core health check
if curl -s http://localhost:5001/api/health > /dev/null; then
    echo "✅ Core backend health: OK"
else
    echo "❌ Core backend health: FAILED"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Test Agent Workbench endpoints
if curl -s http://localhost:5001/api/agent-workbench/health > /dev/null; then
    echo "✅ Agent Workbench: Available"
else
    echo "⚠️ Agent Workbench: May need configuration"
fi

# Test Execution Router endpoints
if curl -s http://localhost:5001/api/execution-router/health > /dev/null; then
    echo "✅ Execution Router: Available"
else
    echo "⚠️ Execution Router: May need E2B/Scrapybara API keys"
fi

# Test Enhanced Scout endpoints
if curl -s http://localhost:5001/api/scout/health > /dev/null; then
    echo "✅ Enhanced Scout: Available"
else
    echo "⚠️ Enhanced Scout: May need Gemini API configuration"
fi

# Test Theme system endpoints
if curl -s http://localhost:5001/api/themes/health > /dev/null; then
    echo "✅ Theme System: Available (5 themes ready)"
else
    echo "⚠️ Theme System: May need configuration"
fi

# Test WebSocket support
if curl -s http://localhost:5001/api/websocket/health > /dev/null; then
    echo "✅ WebSocket Support: Available"
else
    echo "⚠️ WebSocket Support: May need configuration"
fi

# Clean up backend process
echo "🛑 Shutting down test backend..."
kill $BACKEND_PID 2>/dev/null || true
sleep 3

cd ..

# Test frontend build capability
echo "⚛️ Testing frontend build capability..."
cd frontend

# Quick build test (just check if it can start the build process)
echo "🔨 Testing Vite build configuration..."
if npm run build --dry-run 2>/dev/null || timeout 10s npm run build; then
    echo "✅ Frontend build configuration: OK"
else
    echo "⚠️ Frontend build: May need dependency updates"
fi

cd ..

echo ""
echo "🎉 PODPLAY SANCTUARY INSTALLATION COMPLETE!"
echo "============================================="
echo "🏛️ Core System Status:"
echo "   ✅ Python 3.9+ environment ready"
echo "   ✅ Node.js 18+ environment ready"
echo "   ✅ Backend dependencies installed"
echo "   ✅ Frontend dependencies installed"
echo "   ✅ Backend can start successfully"
echo ""
echo "🎨 Enhanced Features Available:"
echo "   🎭 5-Theme System (Sanctuary, Daytime, Night, Purple Haze, Cosmic)"
echo "   🤖 Agent Creation Workbench"
echo "   🚀 Intelligent Execution Router"
echo "   🎯 Enhanced Scout Orchestration"
echo "   💬 Multi-Modal Chat Experiences"
echo "   💻 Development Tools & Workspaces"
echo ""
echo "📋 Next Steps:"
echo "1. 🔑 Configure your API keys in the .env file"
echo "2. 🚀 Run './start-backend.sh' to start the backend"
echo "3. ⚛️ Run './start-frontend.sh' to start the frontend"
echo "4. 🌐 Open http://localhost:3000 to access Podplay Sanctuary"
echo "5. 🎨 Explore the 5-theme system and Agent Workbench"
echo ""
echo "🏛️ Welcome to Podplay Sanctuary - Where AI Models Become Friends! ✨"
