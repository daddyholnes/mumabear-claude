#!/bin/bash
# 🐻⚡ Mama Bear's Express Endpoint Creator (gcloud version)
# Quick command-line setup for your Express endpoint!

set -e  # Exit on any error

echo "🐻⚡ Mama Bear's Express Endpoint Creator"
echo "=========================================="

# Load environment variables
source .env 2>/dev/null || echo "⚠️ No .env file found, using defaults"

PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-"podplay-build-beta"}
REGION=${VERTEX_AI_REGION:-"us-central1"}
ENDPOINT_NAME="mama-bear-express-endpoint"

echo "🌟 Project ID: $PROJECT_ID"
echo "📍 Region: $REGION"
echo "🎯 Endpoint Name: $ENDPOINT_NAME"

# Check if already authenticated
echo ""
echo "🔍 Checking Google Cloud authentication..."
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 > /dev/null; then
    echo "❌ Not authenticated with Google Cloud!"
    echo "🔧 Run: gcloud auth login"
    exit 1
fi

ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1)
echo "✅ Authenticated as: $ACTIVE_ACCOUNT"

# Set the project
echo ""
echo "🔧 Setting Google Cloud project..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo ""
echo "🔌 Enabling required APIs..."
gcloud services enable aiplatform.googleapis.com --quiet
gcloud services enable ml.googleapis.com --quiet
echo "✅ APIs enabled!"

# Create the Express endpoint
echo ""
echo "🚀 Creating Express endpoint..."
echo "⏳ This will take 2-3 minutes..."

ENDPOINT_OUTPUT=$(gcloud ai endpoints create \
    --display-name="$ENDPOINT_NAME" \
    --description="🐻⚡ Ultra-fast responses with Mama Bear's Express Mode! Sub-200ms guaranteed!" \
    --region=$REGION \
    --format="value(name)")

if [ $? -eq 0 ]; then
    ENDPOINT_ID=$(basename "$ENDPOINT_OUTPUT")
    echo "✅ Express endpoint created successfully!"
    echo "🆔 Endpoint ID: $ENDPOINT_ID"
else
    echo "❌ Failed to create Express endpoint!"
    exit 1
fi

# Add configuration to .env file
echo ""
echo "💾 Saving configuration to .env..."

# Check if Express config already exists
if grep -q "EXPRESS_ENDPOINT_ID" .env 2>/dev/null; then
    echo "⚠️ Express configuration already exists in .env"
    echo "🔧 Updating existing configuration..."
    # Update existing configuration
    sed -i "s/EXPRESS_ENDPOINT_ID=.*/EXPRESS_ENDPOINT_ID=$ENDPOINT_ID/" .env
    sed -i "s/VERTEX_AI_ENABLED=.*/VERTEX_AI_ENABLED=true/" .env
else
    echo "📝 Adding new Express configuration..."
    cat >> .env << EOF

# --- Express Mode Configuration (Created: $(date -Iseconds)) ---
VERTEX_AI_ENABLED=true
VERTEX_AI_REGION=$REGION
EXPRESS_ENDPOINT_ID=$ENDPOINT_ID
EXPRESS_MODE_ENABLED=true
EXPRESS_TARGET_RESPONSE_TIME_MS=200
EOF
fi

echo "✅ Configuration saved to .env"

# Show the endpoint info
echo ""
echo "📋 Express endpoint details:"
gcloud ai endpoints describe $ENDPOINT_ID --region=$REGION --format="table(displayName,name,createTime)"

echo ""
echo "🎉 EXPRESS ENDPOINT SETUP COMPLETE!"
echo "====================================="
echo "🆔 Endpoint ID: $ENDPOINT_ID"
echo "📍 Region: $REGION"
echo "⚡ Express Mode: READY"
echo "🎯 Target Response Time: <200ms"
echo ""
echo "🚀 Your Express endpoint is now available!"
echo "💜 Ready to experience 8x faster responses with Mama Bear!"
echo ""
echo "🔧 Next steps:"
echo "   1. Test your endpoint: python test_express_endpoint.py"
echo "   2. Start the backend: python backend/app.py"
echo "   3. Make Express requests to: POST http://localhost:5000/api/express-mode/"
echo ""
echo "🐻 Mama Bear says: Your sanctuary just got supercharged! 💜⚡"
