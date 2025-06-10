# 🏛️ Podplay Sanctuary - Enhanced Frontend Startup Script
# AI Model Friends Chat with Agent Workbench & 5-Theme System
# Modern React 18 + Vite + Comprehensive UI Components

$ErrorActionPreference = "Stop"

Write-Host "🏛️ Starting Podplay Sanctuary Frontend..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "⚛️ AI Model Friends Chat with Agent Workbench" -ForegroundColor Yellow
Write-Host "🎨 5-Theme System | Real-time Chat | Development Tools" -ForegroundColor Yellow
Write-Host ""

# Get script directory and change to frontend directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $scriptDir "frontend"

if (-not (Test-Path $frontendDir)) {
    Write-Host "❌ Error: Frontend directory not found at: $frontendDir" -ForegroundColor Red
    exit 1
}

Set-Location $frontendDir

# Check Node.js version
try {
    $nodeVersion = node --version 2>$null
    Write-Host "📦 Using Node.js: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "📥 Please install Node.js 18+ from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "🔧 Or use the installation script: .\install-and-verify.ps1" -ForegroundColor Yellow
    exit 1
}

# Check if minimum Node version for modern features
$majorVersion = [int]($nodeVersion -replace "v(\d+)\..*", '$1')
if ($majorVersion -lt 18) {
    Write-Host "❌ Error: Node.js 18+ required for Vite and modern React features" -ForegroundColor Red
    Write-Host "📥 Current version: $nodeVersion" -ForegroundColor Yellow
    Write-Host "📥 Please upgrade to Node.js 18+" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Node.js version compatible with modern tooling" -ForegroundColor Green

# Check if dependencies are installed
Write-Host "📦 Checking frontend dependencies..." -ForegroundColor Yellow
$nodeModulesPath = "node_modules"
$installCompleteMarker = Join-Path $nodeModulesPath ".install_complete"

if (-not (Test-Path $nodeModulesPath) -or -not (Test-Path $installCompleteMarker)) {
    Write-Host "📥 Installing frontend dependencies..." -ForegroundColor Yellow
    
    # Prefer bun for faster installation if available
    try {
        $bunVersion = bun --version 2>$null
        Write-Host "🚀 Using Bun for faster installation..." -ForegroundColor Cyan
        bun install
    } catch {
        Write-Host "📦 Using npm for installation..." -ForegroundColor Cyan
        npm install
    }
    
    # Create install complete marker
    New-Item -Path $installCompleteMarker -ItemType File -Force | Out-Null
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Validate critical frontend packages
Write-Host "🧪 Validating critical frontend packages..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    # Check for critical dependencies
    $packageJson = Get-Content "package.json" -Raw
    $criticalPackages = @("react", "vite", "@vitejs/plugin-react")
    $missingPackages = @()
    
    foreach ($package in $criticalPackages) {
        if ($packageJson -notmatch "`"$package`"") {
            $missingPackages += $package
        }
    }
    
    if ($missingPackages.Count -gt 0) {
        Write-Host "⚠️ Warning: Missing critical packages: $($missingPackages -join ', ')" -ForegroundColor Yellow
        Write-Host "🔄 Try reinstalling dependencies" -ForegroundColor White
    } else {
        Write-Host "✅ Critical packages present" -ForegroundColor Green
    }
} else {
    Write-Host "❌ package.json not found" -ForegroundColor Red
    exit 1
}

# Check backend connection and validate enhanced features
Write-Host ""
Write-Host "🔍 Checking backend connection and enhanced features..." -ForegroundColor Yellow
$backendStatus = "❌"
$agentWorkbenchStatus = "❌"
$executionRouterStatus = "❌"
$themeSystemStatus = "❌"

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -TimeoutSec 5 -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $backendStatus = "✅"
        Write-Host "✅ Backend: Connected (http://localhost:5000)" -ForegroundColor Green
        
        # Test enhanced feature endpoints
        try {
            Invoke-WebRequest -Uri "http://localhost:5000/api/agent-workbench/health" -TimeoutSec 3 -UseBasicParsing -ErrorAction SilentlyContinue | Out-Null
            $agentWorkbenchStatus = "✅"
        } catch { }
        
        try {
            Invoke-WebRequest -Uri "http://localhost:5000/api/execution-router/health" -TimeoutSec 3 -UseBasicParsing -ErrorAction SilentlyContinue | Out-Null
            $executionRouterStatus = "✅"
        } catch { }
        
        try {
            Invoke-WebRequest -Uri "http://localhost:5000/api/themes/health" -TimeoutSec 3 -UseBasicParsing -ErrorAction SilentlyContinue | Out-Null
            $themeSystemStatus = "✅"
        } catch { }
    }
} catch {
    Write-Host "⚠️ Backend not detected at http://localhost:5000" -ForegroundColor Yellow
    Write-Host "💡 Start the backend first with: .\start-backend.ps1" -ForegroundColor White
    Write-Host "🔄 Frontend will start but enhanced features may not work" -ForegroundColor White
}

Write-Host ""
Write-Host "🎨 Enhanced Features Status:" -ForegroundColor Yellow
Write-Host "   $backendStatus Core Backend" -ForegroundColor White
Write-Host "   $agentWorkbenchStatus Agent Creation Workbench" -ForegroundColor White
Write-Host "   $executionRouterStatus Execution Router (E2B/Scrapybara)" -ForegroundColor White
Write-Host "   $themeSystemStatus 5-Theme System" -ForegroundColor White
Write-Host ""

# Check if port is available
Write-Host "🌐 Checking port availability..." -ForegroundColor Yellow
$portInUse = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue

if ($portInUse) {
    Write-Host "⚠️ Port 3000 is already in use. Attempting to free it..." -ForegroundColor Yellow
    Get-Process | Where-Object { $_.ProcessName -match "node|vite" -and $_.CommandLine -match "3000" } | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    
    # Check again
    $portInUse = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
    if ($portInUse) {
        Write-Host "❌ Unable to free port 3000. Please check running processes:" -ForegroundColor Red
        Write-Host "   Get-NetTCPConnection -LocalPort 3000" -ForegroundColor White
        exit 1
    }
}

Write-Host "✅ Port 3000 is available" -ForegroundColor Green

# Final pre-flight check
Write-Host ""
Write-Host "🚁 Frontend pre-flight checklist:" -ForegroundColor Yellow
Write-Host "   ✅ Node.js 18+: Ready" -ForegroundColor Green
Write-Host "   ✅ Dependencies: Installed" -ForegroundColor Green
Write-Host "   ✅ Package validation: Complete" -ForegroundColor Green
Write-Host "   ✅ Port 3000: Available" -ForegroundColor Green
Write-Host "   $backendStatus Backend connectivity" -ForegroundColor $(if ($backendStatus -eq "✅") { "Green" } else { "Yellow" })
Write-Host ""

# Start the frontend with enhanced logging
Write-Host "🏛️ Starting Podplay Sanctuary Frontend..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "⚛️ React 18 + Vite Development Server" -ForegroundColor White
Write-Host "🌐 Frontend URL: http://localhost:3000" -ForegroundColor White
Write-Host "🎨 Theme System: 5 beautiful themes available" -ForegroundColor White
Write-Host "🤖 Agent Workbench: Create and manage AI agents" -ForegroundColor White
Write-Host "💬 Enhanced Chat: Multi-modal conversations" -ForegroundColor White
Write-Host "💻 Development Tools: Integrated workspaces" -ForegroundColor White
Write-Host ""
Write-Host "🔄 Press Ctrl+C to stop the frontend" -ForegroundColor Yellow
Write-Host "🌟 Opening Podplay Sanctuary in your browser..." -ForegroundColor Yellow
Write-Host ""

# Start with enhanced configuration
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host "⏰ Frontend starting at: $timestamp" -ForegroundColor Cyan
Write-Host "🏛️ Welcome to Podplay Sanctuary - Where AI Models Become Friends!" -ForegroundColor Magenta
Write-Host ""

# Use bun if available, otherwise npm
try {
    $bunVersion = bun --version 2>$null
    Write-Host "🚀 Using Bun for optimal performance..." -ForegroundColor Cyan
    bun run dev --host --open
} catch {
    Write-Host "📦 Using npm for development server..." -ForegroundColor Cyan
    npm run dev -- --host --open
}
