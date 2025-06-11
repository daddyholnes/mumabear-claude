# ================================================================
# 🚀 Express Mode + ADK Setup Script for Podplay Sanctuary
# ================================================================

param(
    [switch]$SkipDependencies,
    [switch]$SkipGCloudSetup,
    [switch]$SkipTest
)

Write-Host "🚀 Express Mode + ADK Setup for Podplay Sanctuary" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Function to create .env template
function Create-EnvTemplate {
    if (-not (Test-Path ".env")) {
        Write-Host "`n📝 Creating .env template..." -ForegroundColor Yellow
        
        $envTemplate = @"
# Google Cloud Configuration (Required)
GOOGLE_CLOUD_PROJECT=your-project-id-here
GOOGLE_API_KEY=your-gemini-api-key-here

# Optional: Service Account (for production)
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Express Mode Settings
VERTEX_EXPRESS_MODE=true
VERTEX_ADK_ENABLED=true
VERTEX_AI_LOCATION=us-central1

# Performance Settings
EXPRESS_MODE_DEFAULT_TIER=fast
ADK_AUTO_AGENT_CREATION=true
PERFORMANCE_MONITORING=true

# Existing API Keys (keep your current values)
ANTHROPIC_API_KEY=your-existing-anthropic-key
OPENAI_API_KEY=your-existing-openai-key
"@
        
        $envTemplate | Out-File -FilePath ".env" -Encoding UTF8
        Write-Host "✅ Created .env template - please fill in your values!" -ForegroundColor Green
    } else {
        Write-Host "📝 .env file already exists - checking for Express Mode settings..." -ForegroundColor Yellow
        
        $envContent = Get-Content ".env" -Raw
        $expressSettings = @(
            "VERTEX_EXPRESS_MODE=true",
            "VERTEX_ADK_ENABLED=true", 
            "VERTEX_AI_LOCATION=us-central1"
        )
        
        $modified = $false
        foreach ($setting in $expressSettings) {
            $settingName = $setting.Split('=')[0]
            if ($envContent -notmatch "$settingName=") {
                Add-Content ".env" "`n$setting"
                $modified = $true
                Write-Host "➕ Added: $setting" -ForegroundColor Green
            }
        }
        
        if ($modified) {
            Write-Host "✅ Updated .env with Express Mode settings!" -ForegroundColor Green
        } else {
            Write-Host "✅ Express Mode settings already present!" -ForegroundColor Green
        }
    }
}

# Step 1: Install Dependencies
if (-not $SkipDependencies) {
    Write-Host "`n📦 Installing Express Mode Dependencies..." -ForegroundColor Yellow
    
    if (Test-Path "backend/requirements_express_upgrade.txt") {
        Write-Host "Installing Express Mode packages..." -ForegroundColor Cyan
        python -m pip install -r backend/requirements_express_upgrade.txt
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Express Mode dependencies installed successfully!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Some packages may have failed to install - continuing..." -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Express Mode requirements file not found!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "`n⏭️  Skipping dependency installation..." -ForegroundColor Yellow
}

# Step 2: Create environment template
Create-EnvTemplate

# Step 3: Google Cloud Setup
if (-not $SkipGCloudSetup) {
    Write-Host "`n☁️  Setting up Google Cloud APIs..." -ForegroundColor Yellow
    
    # Check if gcloud is installed
    try {
        $gcloudVersion = gcloud version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Google Cloud CLI detected" -ForegroundColor Green
            
            # Enable required APIs
            Write-Host "Enabling required Google Cloud APIs..." -ForegroundColor Cyan
            gcloud services enable aiplatform.googleapis.com
            gcloud services enable generativelanguage.googleapis.com
            
            # Setup application default credentials
            Write-Host "Setting up authentication..." -ForegroundColor Cyan
            gcloud auth application-default login
            
            Write-Host "✅ Google Cloud setup completed!" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  Google Cloud CLI not found - manual setup required" -ForegroundColor Yellow
        Write-Host "   Install from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Cyan
    }
} else {
    Write-Host "`n⏭️  Skipping Google Cloud setup..." -ForegroundColor Yellow
}

# Step 4: Test Installation
if (-not $SkipTest) {
    Write-Host "`n🧪 Testing Express Mode Integration..." -ForegroundColor Yellow
    
    # Create and run test script
    python -c "
import sys
import os
sys.path.append('backend')

def test_imports():
    success_count = 0
    total_tests = 0
    
    # Test basic imports
    tests = [
        ('vertexai', 'Vertex AI'),
        ('google.generativeai', 'Google Generative AI'),
        ('backend.services.vertex_express_integration', 'Express Integration'),
        ('backend.services.adk_agent_workbench', 'ADK Workbench'),
        ('backend.services.supercharged_mama_bear_v3', 'Supercharged Mama Bear')
    ]
    
    for module, name in tests:
        total_tests += 1
        try:
            __import__(module)
            print(f'✅ {name} import successful')
            success_count += 1
        except ImportError as e:
            print(f'⚠️  {name} import failed: {str(e)[:50]}...')
    
    print(f'\n📊 Test Results: {success_count}/{total_tests} imports successful')
    
    # Check environment
    project_id = os.getenv('GOOGLE_CLOUD_PROJECT')
    if project_id and project_id != 'your-project-id-here':
        print(f'✅ Google Cloud Project configured: {project_id}')
    else:
        print('⚠️  Please configure GOOGLE_CLOUD_PROJECT in .env file')
    
    return success_count >= (total_tests * 0.6)  # 60% success rate

if __name__ == '__main__':
    test_imports()
"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Express Mode integration test completed!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Some tests failed - check configuration" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n⏭️  Skipping integration test..." -ForegroundColor Yellow
}

# Final Summary
Write-Host "`n🎉 Express Mode Setup Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. 📝 Edit .env file with your Google Cloud project ID and API key" -ForegroundColor White
Write-Host "2. 🚀 Start the backend: python backend/app.py" -ForegroundColor White
Write-Host "3. 🌐 Start the frontend: npm run dev" -ForegroundColor White
Write-Host "4. 🧪 Test Express Mode endpoints at http://localhost:5000/api/mama-bear/express-chat" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation: EXPRESS_MODE_SETUP_GUIDE.md" -ForegroundColor Yellow
Write-Host ""
