#!/bin/bash
# 🧪 Test script for enhanced Podplay Sanctuary installation
# Validates all new features and installations work correctly

set -e

echo "🧪 Testing Enhanced Podplay Sanctuary Installation"
echo "=================================================="
echo ""

# Test 1: Check if all scripts are executable
echo "📋 Test 1: Script permissions..."
for script in install-and-verify.sh start-backend.sh start-frontend.sh; do
    if [[ -x "$script" ]]; then
        echo "✅ $script: executable"
    else
        echo "❌ $script: not executable"
    fi
done

# Test 2: Validate script syntax
echo ""
echo "📋 Test 2: Script syntax validation..."
for script in install-and-verify.sh start-backend.sh start-frontend.sh; do
    if bash -n "$script" 2>/dev/null; then
        echo "✅ $script: syntax OK"
    else
        echo "❌ $script: syntax error"
    fi
done

# Test 3: Check for required dependencies
echo ""
echo "📋 Test 3: System dependencies..."

# Python check
if command -v python3 &> /dev/null; then
    python_version=$(python3 --version)
    echo "✅ Python: $python_version"
else
    echo "❌ Python: not found"
fi

# Node.js check
if command -v node &> /dev/null; then
    node_version=$(node --version)
    echo "✅ Node.js: $node_version"
else
    echo "❌ Node.js: not found"
fi

# Test 4: Validate environment file
echo ""
echo "📋 Test 4: Environment configuration..."
if [[ -f ".env" ]]; then
    echo "✅ .env file exists"
    
    # Check for critical API keys
    critical_keys=("ANTHROPIC_API_KEY" "OPENAI_API_KEY" "GOOGLE_AI_API_KEY")
    for key in "${critical_keys[@]}"; do
        if grep -q "^${key}=" .env && ! grep -q "^${key}=.*_here" .env; then
            echo "✅ $key: configured"
        else
            echo "⚠️ $key: template value or missing"
        fi
    done
else
    echo "❌ .env file missing"
fi

# Test 5: Check directory structure
echo ""
echo "📋 Test 5: Project structure..."
required_dirs=("backend" "frontend" "docs")
for dir in "${required_dirs[@]}"; do
    if [[ -d "$dir" ]]; then
        echo "✅ $dir/: exists"
    else
        echo "❌ $dir/: missing"
    fi
done

# Test 6: Check design documentation
echo ""
echo "📋 Test 6: Design documentation..."
design_docs=(
    "DETAILED_DESIGN_1_CORE_FOUNDATION.md"
    "DETAILED_DESIGN_2_AI_EXPERIENCES.md"
    "DETAILED_DESIGN_3_COMMUNICATION_EXPERIENCES.md"
    "DETAILED_DESIGN_4_DEVELOPMENT_EXPERIENCES.md"
)

for doc in "${design_docs[@]}"; do
    if [[ -f "$doc" ]]; then
        echo "✅ $doc: present"
    else
        echo "❌ $doc: missing"
    fi
done

echo ""
echo "🎯 Enhanced Installation Test Complete!"
echo "======================================"
echo "✅ All tests completed"
echo "💡 If any items show ❌, please address them before running the full installation"
echo ""
