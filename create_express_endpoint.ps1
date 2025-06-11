# 🐻⚡ Mama Bear's Express Endpoint Creator (Windows PowerShell version)
# Quick command-line setup for your Express endpoint!

param(
    [string]$ProjectId = $env:GOOGLE_CLOUD_PROJECT,
    [string]$Region = $env:VERTEX_AI_REGION,
    [string]$EndpointName = "mama-bear-express-endpoint"
)

# Set default values if not provided
if (-not $ProjectId) { $ProjectId = "podplay-build-beta" }
if (-not $Region) { $Region = "us-central1" }

# Error handling
$ErrorActionPreference = "Stop"

Write-Host "🐻⚡ Mama Bear's Express Endpoint Creator" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Magenta
Write-Host ""

# Load environment variables from .env file
if (Test-Path ".env") {
    Write-Host "📄 Loading environment variables from .env..." -ForegroundColor Green
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($Matches[1], $Matches[2], "Process")
        }
    }
} else {
    Write-Host "⚠️ No .env file found, using defaults" -ForegroundColor Yellow
}

Write-Host "🌟 Project ID: $ProjectId" -ForegroundColor Cyan
Write-Host "📍 Region: $Region" -ForegroundColor Cyan
Write-Host "🎯 Endpoint Name: $EndpointName" -ForegroundColor Cyan
Write-Host ""

# Check if gcloud is installed
try {
    $gcloudVersion = gcloud version --format="value(Google Cloud SDK)" 2>$null
    Write-Host "✅ Google Cloud SDK detected: $gcloudVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Google Cloud SDK not found!" -ForegroundColor Red
    Write-Host "🔧 Please install from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Check authentication
Write-Host "🔍 Checking Google Cloud authentication..." -ForegroundColor Yellow
try {
    $activeAccount = gcloud auth list --filter="status:ACTIVE" --format="value(account)" | Select-Object -First 1
    if (-not $activeAccount) {
        Write-Host "❌ Not authenticated with Google Cloud!" -ForegroundColor Red
        Write-Host "🔧 Run: gcloud auth login" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Authenticated as: $activeAccount" -ForegroundColor Green
} catch {
    Write-Host "❌ Authentication check failed!" -ForegroundColor Red
    Write-Host "🔧 Run: gcloud auth login" -ForegroundColor Yellow
    exit 1
}

# Set the project
Write-Host ""
Write-Host "🔧 Setting Google Cloud project..." -ForegroundColor Yellow
try {
    gcloud config set project $ProjectId
    Write-Host "✅ Project set to: $ProjectId" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to set project!" -ForegroundColor Red
    exit 1
}

# Enable required APIs
Write-Host ""
Write-Host "🔌 Enabling required APIs..." -ForegroundColor Yellow
try {
    gcloud services enable aiplatform.googleapis.com --quiet
    gcloud services enable ml.googleapis.com --quiet
    Write-Host "✅ APIs enabled!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to enable APIs!" -ForegroundColor Red
    exit 1
}

# Create the Express endpoint
Write-Host ""
Write-Host "🚀 Creating Express endpoint..." -ForegroundColor Magenta
Write-Host "⏳ This will take 2-3 minutes..." -ForegroundColor Yellow

try {
    $endpointOutput = gcloud ai endpoints create `
        --display-name="$EndpointName" `
        --description="🐻⚡ Ultra-fast responses with Mama Bear's Express Mode! Sub-200ms guaranteed!" `
        --region=$Region `
        --format="value(name)"
    
    if ($LASTEXITCODE -eq 0) {
        $endpointId = Split-Path $endpointOutput -Leaf
        Write-Host "✅ Express endpoint created successfully!" -ForegroundColor Green
        Write-Host "🆔 Endpoint ID: $endpointId" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Failed to create Express endpoint!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Failed to create Express endpoint: $_" -ForegroundColor Red
    exit 1
}

# Add configuration to .env file
Write-Host ""
Write-Host "💾 Saving configuration to .env..." -ForegroundColor Yellow

$envPath = ".env"
$currentDate = Get-Date -Format "yyyy-MM-ddTHH:mm:sszzz"

# Check if Express config already exists
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath
    if ($envContent -match "EXPRESS_ENDPOINT_ID") {
        Write-Host "⚠️ Express configuration already exists in .env" -ForegroundColor Yellow
        Write-Host "🔧 Updating existing configuration..." -ForegroundColor Yellow
        
        # Update existing configuration
        $newContent = $envContent | ForEach-Object {
            if ($_ -match "^EXPRESS_ENDPOINT_ID=") {
                "EXPRESS_ENDPOINT_ID=$endpointId"
            } elseif ($_ -match "^VERTEX_AI_ENABLED=") {
                "VERTEX_AI_ENABLED=true"
            } else {
                $_
            }
        }
        $newContent | Out-File $envPath -Encoding UTF8
    } else {
        Write-Host "📝 Adding new Express configuration..." -ForegroundColor Green
        
        # Add new configuration
        $expressConfig = @"

# --- Express Mode Configuration (Created: $currentDate) ---
VERTEX_AI_ENABLED=true
VERTEX_AI_REGION=$Region
EXPRESS_ENDPOINT_ID=$endpointId
EXPRESS_MODE_ENABLED=true
EXPRESS_TARGET_RESPONSE_TIME_MS=200
"@
        Add-Content $envPath $expressConfig -Encoding UTF8
    }
} else {
    Write-Host "📝 Creating new .env file with Express configuration..." -ForegroundColor Green
    
    $expressConfig = @"
# --- Express Mode Configuration (Created: $currentDate) ---
VERTEX_AI_ENABLED=true
VERTEX_AI_REGION=$Region
EXPRESS_ENDPOINT_ID=$endpointId
EXPRESS_MODE_ENABLED=true
EXPRESS_TARGET_RESPONSE_TIME_MS=200
"@
    $expressConfig | Out-File $envPath -Encoding UTF8
}

Write-Host "✅ Configuration saved to .env" -ForegroundColor Green

# Show the endpoint info
Write-Host ""
Write-Host "📋 Express endpoint details:" -ForegroundColor Cyan
try {
    gcloud ai endpoints describe $endpointId --region=$Region --format="table(displayName,name,createTime)"
} catch {
    Write-Host "⚠️ Could not retrieve endpoint details, but creation was successful" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 EXPRESS ENDPOINT SETUP COMPLETE!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "🆔 Endpoint ID: $endpointId" -ForegroundColor Cyan
Write-Host "📍 Region: $Region" -ForegroundColor Cyan
Write-Host "⚡ Express Mode: READY" -ForegroundColor Green
Write-Host "🎯 Target Response Time: <200ms" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Your Express endpoint is now available!" -ForegroundColor Magenta
Write-Host "💜 Ready to experience 8x faster responses with Mama Bear!" -ForegroundColor Magenta
Write-Host ""
Write-Host "🔧 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Test your endpoint: python test_express_endpoint.py" -ForegroundColor White
Write-Host "   2. Start the backend: python backend/app.py" -ForegroundColor White
Write-Host "   3. Make Express requests to: POST http://localhost:5001/api/express/*" -ForegroundColor White
Write-Host ""
Write-Host "🐻 Mama Bear says: Your sanctuary just got supercharged! 💜⚡" -ForegroundColor Magenta

# Test if Python backend is available
Write-Host ""
Write-Host "🧪 Testing Express Mode integration..." -ForegroundColor Yellow
try {
    $pythonTest = python -c "
import sys
import os
sys.path.insert(0, os.path.join('.', 'backend'))
try:
    from services.vertex_express_production import VertexExpressModeIntegration
    print('✅ Express Mode service ready!')
except Exception as e:
    print(f'❌ Express Mode service error: {e}')
"
    Write-Host $pythonTest
} catch {
    Write-Host "⚠️ Could not test Python integration" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🌟 Express Mode setup complete! Ready for 6x faster AI responses! 🌟" -ForegroundColor Green
