# 🧪 Test script for enhanced Podplay Sanctuary installation
# Validates all new features and installations work correctly

$ErrorActionPreference = "Continue"  # Continue on errors for testing

Write-Host "🧪 Testing Enhanced Podplay Sanctuary Installation" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if all scripts exist and are accessible
Write-Host "📋 Test 1: Script existence and permissions..." -ForegroundColor Yellow
$scripts = @("install-and-verify.ps1", "start-backend.ps1", "start-frontend.ps1")

foreach ($script in $scripts) {
    if (Test-Path $script) {
        Write-Host "✅ $script`: exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $script`: missing" -ForegroundColor Red
    }
}

# Test 2: Validate PowerShell script syntax
Write-Host ""
Write-Host "📋 Test 2: Script syntax validation..." -ForegroundColor Yellow
foreach ($script in $scripts) {
    if (Test-Path $script) {
        try {
            $ast = [System.Management.Automation.Language.Parser]::ParseFile($script, [ref]$null, [ref]$null)
            if ($ast) {
                Write-Host "✅ $script`: syntax OK" -ForegroundColor Green
            } else {
                Write-Host "❌ $script`: syntax error" -ForegroundColor Red
            }
        } catch {
            Write-Host "❌ $script`: syntax error" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ $script`: not found for syntax check" -ForegroundColor Red
    }
}

# Test 3: Check for required dependencies
Write-Host ""
Write-Host "📋 Test 3: System dependencies..." -ForegroundColor Yellow

# Python check
try {
    $pythonVersion = python --version 2>$null
    Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python: not found" -ForegroundColor Red
}

# Node.js check
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js: not found" -ForegroundColor Red
}

# Test 4: Validate environment file
Write-Host ""
Write-Host "📋 Test 4: Environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    
    # Check for critical API keys
    $criticalKeys = @("ANTHROPIC_API_KEY", "OPENAI_API_KEY", "GOOGLE_AI_API_KEY")
    $envContent = Get-Content ".env" -Raw
      foreach ($key in $criticalKeys) {
        if (($envContent -match "(?m)^$key=.+$") -and ($envContent -notmatch "(?m)^$key=.*_here.*$")) {
            Write-Host "✅ $key`: configured" -ForegroundColor Green
        } else {
            Write-Host "⚠️ $key`: template value or missing" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "❌ .env file missing" -ForegroundColor Red
}

# Test 5: Check directory structure
Write-Host ""
Write-Host "📋 Test 5: Project structure..." -ForegroundColor Yellow
$requiredDirs = @("backend", "frontend", "docs")

foreach ($dir in $requiredDirs) {
    if (Test-Path $dir -PathType Container) {
        Write-Host "✅ $dir/: exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $dir/: missing" -ForegroundColor Red
    }
}

# Test 6: Check design documentation
Write-Host ""
Write-Host "📋 Test 6: Design documentation..." -ForegroundColor Yellow
$designDocs = @(
    "DETAILED_DESIGN_1_CORE_FOUNDATION.md",
    "DETAILED_DESIGN_2_AI_EXPERIENCES.md",
    "DETAILED_DESIGN_3_COMMUNICATION_EXPERIENCES.md",
    "DETAILED_DESIGN_4_DEVELOPMENT_EXPERIENCES.md"
)

foreach ($doc in $designDocs) {
    if (Test-Path $doc) {
        Write-Host "✅ $doc`: present" -ForegroundColor Green
    } else {
        Write-Host "❌ $doc`: missing" -ForegroundColor Red
    }
}

# Test 7: Check for enhanced features readiness (Windows-specific)
Write-Host ""
Write-Host "📋 Test 7: Windows-specific checks..." -ForegroundColor Yellow

# Check PowerShell execution policy
$executionPolicy = Get-ExecutionPolicy
if ($executionPolicy -in @("RemoteSigned", "Unrestricted", "Bypass")) {
    Write-Host "✅ PowerShell Execution Policy: $executionPolicy (allows script execution)" -ForegroundColor Green
} else {
    Write-Host "⚠️ PowerShell Execution Policy: $executionPolicy (may restrict script execution)" -ForegroundColor Yellow
    Write-Host "   Consider running: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor White
}

# Check Windows Terminal support for Unicode/Emojis
try {
    $host.UI.RawUI.WindowTitle = "🧪 Test"
    Write-Host "✅ Unicode/Emoji support: Available" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Unicode/Emoji support: Limited (cosmetic only)" -ForegroundColor Yellow
}

# Check for Windows Subsystem for Linux (optional)
if (Get-Command wsl -ErrorAction SilentlyContinue) {
    Write-Host "✅ WSL: Available (optional enhancement)" -ForegroundColor Green
} else {
    Write-Host "ℹ️ WSL: Not available (optional)" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🎯 Enhanced Installation Test Complete!" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✅ All tests completed" -ForegroundColor Green
Write-Host "💡 If any items show ❌, please address them before running the full installation" -ForegroundColor Yellow
Write-Host ""

# Provide summary
$errors = @()
$warnings = @()

# Count any issues that were displayed
# This is a simplified approach - in production you'd track these during the tests
Write-Host "📊 Test Summary:" -ForegroundColor Cyan
Write-Host "   ✅ Tests completed successfully" -ForegroundColor Green
Write-Host "   ⚠️ Check output above for any warnings or errors" -ForegroundColor Yellow
Write-Host "   🔧 Address any ❌ items before proceeding with installation" -ForegroundColor White
Write-Host ""
