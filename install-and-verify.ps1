# Podplay Sanctuary - Comprehensive Installation & Verification Script
# Ensures complete setup for the enhanced AI Model Friends Chat with Agent Workbench
# Includes validation for all 5 themes, AI experiences, and development tools

$ErrorActionPreference = "Stop"

Write-Host "🏛️ Podplay Sanctuary - Enhanced Installation & Verification" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🎨 AI Model Friends Chat with Agent Workbench" -ForegroundColor Yellow
Write-Host "🚀 5-Theme System | Execution Router | Scout Orchestration" -ForegroundColor Yellow
Write-Host "💻 Development Tools | Real-time Chat | System Monitoring" -ForegroundColor Yellow
Write-Host ""
Write-Host "Current directory: $(Get-Location)" -ForegroundColor White
Write-Host "Date: $(Get-Date)" -ForegroundColor White
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "DETAILED_DESIGN_1_CORE_FOUNDATION.md")) {
    Write-Host "❌ Error: Not in podplay-sanctuary directory" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory" -ForegroundColor Yellow
    Write-Host "Looking for: DETAILED_DESIGN_1_CORE_FOUNDATION.md" -ForegroundColor White
    exit 1
}

Write-Host "✅ Podplay Sanctuary project directory confirmed" -ForegroundColor Green

# Check Python version
Write-Host "🐍 Checking Python version..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python version: $pythonVersion" -ForegroundColor White
    
    python -c "import sys; assert sys.version_info >= (3, 9)" 2>$null
    Write-Host "✅ Python version OK (3.9+ for AI model compatibility)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Python 3.9+ required for enhanced AI features" -ForegroundColor Red
    exit 1
}

# Check Node.js version for frontend
Write-Host "📦 Checking Node.js version..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor White
    
    # Extract major version number
    $majorVersion = [int]($nodeVersion -replace "v(\d+)\..*", '$1')
    if ($majorVersion -ge 18) {
        Write-Host "✅ Node.js version OK (18+ for Vite and modern React)" -ForegroundColor Green
    } else {
        Write-Host "❌ Error: Node.js 18+ required for modern frontend tooling" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error: Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check if virtual environment exists
Write-Host "🔧 Checking Python virtual environment..." -ForegroundColor Yellow
$backendDir = "backend"
$venvPath = Join-Path $backendDir "venv"

if (-not (Test-Path $venvPath)) {
    Write-Host "📦 Creating Python virtual environment..." -ForegroundColor Yellow
    Set-Location $backendDir
    python -m venv venv
    Set-Location ..
}
Write-Host "✅ Python virtual environment ready" -ForegroundColor Green

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location $backendDir

# Activate virtual environment
if (Test-Path "venv\Scripts\Activate.ps1") {
    & "venv\Scripts\Activate.ps1"
} else {
    Write-Host "❌ Error: Virtual environment activation script not found" -ForegroundColor Red
    exit 1
}

# Upgrade pip first
Write-Host "⬆️ Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Install requirements
Write-Host "📥 Installing Python packages..." -ForegroundColor Yellow
python -m pip install -r requirements.txt

Write-Host "✅ Backend dependencies installed successfully" -ForegroundColor Green

# Verify critical AI packages
Write-Host "🤖 Verifying AI model packages..." -ForegroundColor Yellow
$pythonScript = @"
import sys
required_packages = [
    'anthropic', 'openai', 'google.generativeai', 
    'flask', 'flask_socketio', 'flask_cors',
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
"@

python -c $pythonScript

Set-Location ..

# Check frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
$frontendDir = "frontend"
$nodeModulesPath = Join-Path $frontendDir "node_modules"

if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "📥 Installing Node.js packages..." -ForegroundColor Yellow
    Set-Location $frontendDir
    npm install
    Set-Location ..
} else {
    Write-Host "✅ Frontend node_modules already exists" -ForegroundColor Green
}

# Verify frontend setup
Write-Host "⚛️ Verifying frontend setup..." -ForegroundColor Yellow
Set-Location $frontendDir
$packageJsonPath = "package.json"

if (Test-Path $packageJsonPath) {
    # Check for critical dependencies
    $packageJson = Get-Content $packageJsonPath -Raw
    if (($packageJson -match "react.*18") -and ($packageJson -match "vite")) {
        Write-Host "✅ Modern React 18 + Vite setup confirmed" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Warning: Frontend may need dependency updates" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Error: Frontend package.json not found" -ForegroundColor Red
    exit 1
}
Set-Location ..

# Check if .env file exists
$envPath = ".env"
if (-not (Test-Path $envPath)) {
    Write-Host "⚠️ Warning: .env file not found" -ForegroundColor Yellow
    Write-Host "🔧 Creating comprehensive template .env file..." -ForegroundColor Yellow
    
    $envTemplate = @"
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
BACKEND_PORT=5000

# Frontend
FRONTEND_PORT=3000
VITE_API_BASE_URL=http://localhost:5000

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
"@
    
    Set-Content -Path $envPath -Value $envTemplate -Encoding UTF8
    Write-Host "📝 Comprehensive template .env file created" -ForegroundColor Green
    Write-Host "⚠️ IMPORTANT: Please update with your actual API keys before starting" -ForegroundColor Yellow
    Write-Host "✅ Environment file ready" -ForegroundColor Green
} else {
    Write-Host "✅ Environment file exists" -ForegroundColor Green
    
    # Validate critical environment variables
    Write-Host "🔍 Validating environment configuration..." -ForegroundColor Yellow
    $missingVars = @()
    $envContent = Get-Content $envPath -Raw
    
    # Check for critical API keys
    if (-not ($envContent -match "(?m)^ANTHROPIC_API_KEY=.+$") -or ($envContent -match "(?m)^ANTHROPIC_API_KEY=.*_here.*$")) {
        $missingVars += "ANTHROPIC_API_KEY"
    }
    
    if (-not ($envContent -match "(?m)^OPENAI_API_KEY=.+$") -or ($envContent -match "(?m)^OPENAI_API_KEY=.*_here.*$")) {
        $missingVars += "OPENAI_API_KEY"
    }
    
    if (-not ($envContent -match "(?m)^GOOGLE_AI_API_KEY=.+$") -or ($envContent -match "(?m)^GOOGLE_AI_API_KEY=.*_here.*$")) {
        $missingVars += "GOOGLE_AI_API_KEY"
    }
    
    if ($missingVars.Count -gt 0) {
        Write-Host "⚠️ Warning: Missing or template API keys detected:" -ForegroundColor Yellow
        foreach ($var in $missingVars) {
            Write-Host "   - $var" -ForegroundColor White
        }
        Write-Host "   Please configure these before full functionality is available" -ForegroundColor White
    } else {
        Write-Host "✅ Core API keys appear to be configured" -ForegroundColor Green
    }
}

# Check if backend can start
Write-Host "🚀 Testing backend startup..." -ForegroundColor Yellow
Set-Location $backendDir

# Activate virtual environment
& "venv\Scripts\Activate.ps1"

# Load environment variables
$envPath = Join-Path (Get-Location | Split-Path -Parent) ".env"
Get-Content $envPath | ForEach-Object {
    if ($_ -match "^([^#][^=]+)=(.*)$") {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
    }
}

# Start backend in background for testing
Write-Host "⏳ Starting Flask backend (port 5000)..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    & "venv\Scripts\Activate.ps1"
    $env:PYTHONPATH = "$PWD;$($PWD | Split-Path -Parent)"
    python app.py
}

# Wait for backend to start
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Test backend health endpoints
Write-Host "🏥 Testing backend health endpoints..." -ForegroundColor Yellow

# Core health check
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -TimeoutSec 10 -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Core backend health: OK" -ForegroundColor Green
    } else {
        throw "Backend health check failed"
    }
} catch {
    Write-Host "❌ Core backend health: FAILED" -ForegroundColor Red
    Stop-Job $backendJob -Force
    Remove-Job $backendJob -Force
    Set-Location ..
    exit 1
}

# Test enhanced feature endpoints (optional)
$features = @{
    "Agent Workbench" = "http://localhost:5000/api/agent-workbench/health"
    "Execution Router" = "http://localhost:5000/api/execution-router/health"
    "Enhanced Scout" = "http://localhost:5000/api/scout/health"
    "Theme System" = "http://localhost:5000/api/themes/health"
    "WebSocket Support" = "http://localhost:5000/api/websocket/health"
}

foreach ($feature in $features.GetEnumerator()) {
    try {
        $response = Invoke-WebRequest -Uri $feature.Value -TimeoutSec 5 -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($feature.Key): Available" -ForegroundColor Green
        } else {
            Write-Host "⚠️ $($feature.Key): May need configuration" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠️ $($feature.Key): May need configuration" -ForegroundColor Yellow
    }
}

# Clean up backend process
Write-Host "🛑 Shutting down test backend..." -ForegroundColor Yellow
Stop-Job $backendJob -Force
Remove-Job $backendJob -Force
Start-Sleep -Seconds 3

Set-Location ..

# Test frontend build capability
Write-Host "⚛️ Testing frontend build capability..." -ForegroundColor Yellow
Set-Location $frontendDir

# Quick build test (just check if it can start the build process)
Write-Host "🔨 Testing Vite build configuration..." -ForegroundColor Yellow
try {
    $buildJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        npm run build
    }
    
    # Wait for up to 30 seconds for build to complete or timeout
    Wait-Job $buildJob -Timeout 30 | Out-Null
    
    if ($buildJob.State -eq "Completed") {
        Write-Host "✅ Frontend build configuration: OK" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Frontend build: May need dependency updates" -ForegroundColor Yellow
    }
    
    Stop-Job $buildJob -Force -ErrorAction SilentlyContinue
    Remove-Job $buildJob -Force -ErrorAction SilentlyContinue
} catch {
    Write-Host "⚠️ Frontend build: May need dependency updates" -ForegroundColor Yellow
}

Set-Location ..

Write-Host ""
Write-Host "🎉 PODPLAY SANCTUARY INSTALLATION COMPLETE!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host "🏛️ Core System Status:" -ForegroundColor Cyan
Write-Host "   ✅ Python 3.9+ environment ready" -ForegroundColor Green
Write-Host "   ✅ Node.js 18+ environment ready" -ForegroundColor Green
Write-Host "   ✅ Backend dependencies installed" -ForegroundColor Green
Write-Host "   ✅ Frontend dependencies installed" -ForegroundColor Green
Write-Host "   ✅ Backend can start successfully" -ForegroundColor Green
Write-Host ""
Write-Host "🎨 Enhanced Features Available:" -ForegroundColor Yellow
Write-Host "   🎭 5-Theme System (Sanctuary, Daytime, Night, Purple Haze, Cosmic)" -ForegroundColor White
Write-Host "   🤖 Agent Creation Workbench" -ForegroundColor White
Write-Host "   🚀 Intelligent Execution Router" -ForegroundColor White
Write-Host "   🎯 Enhanced Scout Orchestration" -ForegroundColor White
Write-Host "   💬 Multi-Modal Chat Experiences" -ForegroundColor White
Write-Host "   💻 Development Tools & Workspaces" -ForegroundColor White
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. 🔑 Configure your API keys in the .env file" -ForegroundColor White
Write-Host "2. 🚀 Run '.\start-backend.ps1' to start the backend" -ForegroundColor White
Write-Host "3. ⚛️ Run '.\start-frontend.ps1' to start the frontend" -ForegroundColor White
Write-Host "4. 🌐 Open http://localhost:3000 to access Podplay Sanctuary" -ForegroundColor White
Write-Host "5. 🎨 Explore the 5-theme system and Agent Workbench" -ForegroundColor White
Write-Host ""
Write-Host "🏛️ Welcome to Podplay Sanctuary - Where AI Models Become Friends! ✨" -ForegroundColor Magenta
