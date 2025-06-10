#!/bin/bash

# 🏛️ Podplay Sanctuary - Enhanced Frontend Startup Script
# AI Model Friends Chat with Agent Workbench & 5-Theme System
# Modern React 18 + Vite + Comprehensive UI Components

set -e  # Exit on any error

echo "🏛️ Starting Podplay Sanctuary Frontend..."
echo "=========================================="
echo "⚛️ AI Model Friends Chat with Agent Workbench"
echo "🎨 5-Theme System | Real-time Chat | Development Tools"
echo ""

# Change to frontend directory
cd "$(dirname "$0")/frontend"

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📥 Please install Node.js 18+ from: https://nodejs.org/"
    echo "🔧 Or use the installation script: ./install-and-verify.sh"
    exit 1
fi

node_version=$(node --version)
echo "📦 Using Node.js: $node_version"

# Check if minimum Node version for modern features
major_version=$(echo $node_version | cut -d'.' -f1 | sed 's/v//')
if [ "$major_version" -lt 18 ]; then
    echo "❌ Error: Node.js 18+ required for Vite and modern React features"
    echo "📥 Current version: $node_version"
    echo "📥 Please upgrade to Node.js 18+"
    exit 1
fi

echo "✅ Node.js version compatible with modern tooling"

# Check if dependencies are installed
echo "📦 Checking frontend dependencies..."
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.install_complete" ]; then
    echo "📥 Installing frontend dependencies..."
    
    # Prefer bun for faster installation if available
    if command -v bun &> /dev/null; then
        echo "🚀 Using Bun for faster installation..."
        bun install
    else
        echo "📦 Using npm for installation..."
        npm install
    fi
    
    touch node_modules/.install_complete
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Validate critical frontend packages
echo "🧪 Validating critical frontend packages..."
if [ -f "package.json" ]; then
    # Check for critical dependencies
    critical_packages=("react" "vite" "@vitejs/plugin-react")
    missing_packages=()
    
    for package in "${critical_packages[@]}"; do
        if ! grep -q "\"$package\"" package.json; then
            missing_packages+=("$package")
        fi
    done
    
    if [[ ${#missing_packages[@]} -gt 0 ]]; then
        echo "⚠️ Warning: Missing critical packages: ${missing_packages[*]}"
        echo "🔄 Try reinstalling dependencies"
    else
        echo "✅ Critical packages present"
    fi
else
    echo "❌ package.json not found"
    exit 1
fi

# Check backend connection and validate enhanced features
echo ""
echo "🔍 Checking backend connection and enhanced features..."
backend_status="❌"
agent_workbench_status="❌"
execution_router_status="❌"
theme_system_status="❌"

if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    backend_status="✅"
    echo "✅ Backend: Connected (http://localhost:5001)"
    
    # Test enhanced feature endpoints
    if curl -s http://localhost:5001/api/agent-workbench/health > /dev/null 2>&1; then
        agent_workbench_status="✅"
    fi
    
    if curl -s http://localhost:5001/api/execution-router/health > /dev/null 2>&1; then
        execution_router_status="✅"
    fi
    
    if curl -s http://localhost:5001/api/themes/health > /dev/null 2>&1; then
        theme_system_status="✅"
    fi
else
    echo "⚠️ Backend not detected at http://localhost:5001"
    echo "💡 Start the backend first with: ./start-backend.sh"
    echo "🔄 Frontend will start but enhanced features may not work"
fi

echo ""
echo "🎨 Enhanced Features Status:"
echo "   $backend_status Core Backend"
echo "   $agent_workbench_status Agent Creation Workbench"
echo "   $execution_router_status Execution Router (E2B/Scrapybara)"
echo "   $theme_system_status 5-Theme System"
echo ""

# Check if port is available
echo "🌐 Checking port availability..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️ Port 3000 is already in use. Attempting to free it..."
    pkill -f "vite.*3000" || pkill -f "node.*3000" || true
    sleep 2
    
    # Check again
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "❌ Unable to free port 3000. Please check running processes:"
        echo "   lsof -i :3000"
        exit 1
    fi
fi

echo "✅ Port 3000 is available"

# Final pre-flight check
echo ""
echo "🚁 Frontend pre-flight checklist:"
echo "   ✅ Node.js 18+: Ready"
echo "   ✅ Dependencies: Installed"
echo "   ✅ Package validation: Complete"
echo "   ✅ Port 3000: Available"
echo "   $backend_status Backend connectivity"
echo ""

# Start the frontend with enhanced logging
echo "🏛️ Starting Podplay Sanctuary Frontend..."
echo "========================================="
echo "⚛️ React 18 + Vite Development Server"
echo "🌐 Frontend URL: http://localhost:3000"
echo "🎨 Theme System: 5 beautiful themes available"
echo "🤖 Agent Workbench: Create and manage AI agents"
echo "💬 Enhanced Chat: Multi-modal conversations"
echo "💻 Development Tools: Integrated workspaces"
echo ""
echo "🔄 Press Ctrl+C to stop the frontend"
echo "🌟 Opening Podplay Sanctuary in your browser..."
echo ""

# Start with enhanced configuration
echo "⏰ Frontend starting at: $(date)"
echo "🏛️ Welcome to Podplay Sanctuary - Where AI Models Become Friends!"
echo ""

# Use bun if available, otherwise npm
if command -v bun &> /dev/null; then
    echo "🚀 Using Bun for optimal performance..."
    bun run dev --host --open
else
    echo "📦 Using npm for development server..."
    npm run dev -- --host --open
fi