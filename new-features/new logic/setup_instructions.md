# 🌟 Complete Setup Guide: Vertex AI + Gemini API Integration

## **Prerequisites** ✅

1. **Google Cloud Project** with billing enabled
2. **Google Cloud credits** (which you mentioned you have!)
3. **Vertex AI API** enabled
4. **Gemini API key** (which you already have)

## **Step 1: Enable Required APIs** 🔧

```bash
# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com

# Enable Gemini API (if not already done)
gcloud services enable generativelanguage.googleapis.com

# Enable Model Garden APIs
gcloud services enable modelgarden.googleapis.com
```

## **Step 2: Set Up Authentication** 🔐

### **Option A: Service Account (Recommended for production)**

```bash
# Create service account
gcloud iam service-accounts create mama-bear-vertex \
    --display-name="Mama Bear Vertex AI Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:mama-bear-vertex@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:mama-bear-vertex@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/ml.developer"

# Create and download key
gcloud iam service-accounts keys create mama-bear-vertex-key.json \
    --iam-account=mama-bear-vertex@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### **Option B: User Account (Easy for development)**

```bash
# Authenticate with your Google account
gcloud auth application-default login

# Set your project
gcloud config set project YOUR_PROJECT_ID
```

## **Step 3: Install Dependencies** 📦

```bash
# Install required packages
pip install google-cloud-aiplatform
pip install vertexai
pip install google-generativeai
pip install google-auth
```

## **Step 4: Environment Configuration** ⚙️

Create/update your `.env` file:

```env
# Existing configuration
GOOGLE_API_KEY=your_existing_gemini_api_key

# New Vertex AI configuration
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/mama-bear-vertex-key.json

# Optional: Vertex AI specific settings
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_STAGING_BUCKET=gs://your-bucket-name  # Optional
```

## **Step 5: Integrate with Your Existing App** 🔗

Replace your existing Mama Bear initialization in `app.py`:

```python
# backend/app.py

# Add these imports
from services.enhanced_mama_bear_vertex_integration import integrate_vertex_mama_bear

# In your app initialization (replace existing mama bear setup)
async def initialize_enhanced_mama_bear():
    """Initialize Enhanced Mama Bear with Vertex AI"""
    
    # Your Google Cloud project ID
    project_id = os.getenv('GOOGLE_CLOUD_PROJECT', 'your-project-id')
    
    # Path to service account key (optional if using default credentials)
    service_account_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    
    # Integrate with your Flask app
    enhanced_agent = integrate_vertex_mama_bear(
        app, 
        google_cloud_project=project_id,
        service_account_path=service_account_path
    )
    
    logger.info("🌟 Enhanced Mama Bear with Vertex AI ready!")
    return enhanced_agent

# Call this in your existing initialization
if __name__ == '__main__':
    # Your existing initialization code...
    
    # Add this
    asyncio.run(initialize_enhanced_mama_bear())
    
    # Start your app as usual
    socketio.run(app, ...)
```

## **Step 6: Test the Integration** 🧪

```python
# Test script: test_vertex_integration.py

import asyncio
import os
from services.enhanced_mama_bear_vertex_integration import EnhancedMamaBearVertexAgent

async def test_integration():
    """Test the Vertex AI + Gemini API integration"""
    
    # Initialize agent
    agent = EnhancedMamaBearVertexAgent(
        google_cloud_project=os.getenv('GOOGLE_CLOUD_PROJECT'),
        service_account_path=os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    )
    
    await agent.initialize()
    
    print("🧪 Testing quick chat (Gemini API - cheap & fast)...")
    quick_result = await agent.quick_chat("Hello Mama Bear!")
    print(f"✅ Quick chat: {quick_result['response'][:100]}...")
    print(f"💰 Cost: ${quick_result['cost_info']['estimated_cost']:.6f}")
    
    print("\n🧪 Testing deep research (Claude via Vertex AI)...")
    research_result = await agent.deep_research_mode(
        "What are the latest developments in AI model efficiency?"
    )
    print(f"✅ Research: {research_result['research_response'][:100]}...")
    print(f"💰 Cost: ${research_result['cost_info']:.6f}")
    
    print("\n📊 Cost Report:")
    cost_report = agent.get_cost_report()
    print(f"Total estimated cost: ${cost_report['total_estimated_cost']:.6f}")
    print(f"Requests today: {cost_report['requests_today']}")
    
    print("\n🎯 Model Status:")
    status = agent.get_model_status()
    print(f"Available models: {status['total_models']}")
    print(f"Providers: {status['providers']}")

if __name__ == "__main__":
    asyncio.run(test_integration())
```

## **Step 7: Update Your Frontend** 🎨

Add new endpoints to your frontend:

```javascript
// frontend/src/api/mamaBeear.js

// Enhanced chat with intelligent routing
export const enhancedChat = async (message, variant = 'scout_commander', userId = 'default') => {
  const response = await fetch('/api/mama-bear/chat-vertex', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      variant,
      user_id: userId
    })
  });
  return response.json();
};

// Deep research mode
export const deepResearch = async (query, userId = 'default') => {
  const response = await fetch('/api/mama-bear/deep-research', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      user_id: userId
    })
  });
  return response.json();
};

// Cost monitoring
export const getCostReport = async () => {
  const response = await fetch('/api/mama-bear/cost-report');
  return response.json();
};
```

## **Step 8: Model Garden Access** 🏪

### **Enable Claude Models in Vertex AI Model Garden:**

1. Go to [Vertex AI Model Garden](https://console.cloud.google.com/vertex-ai/model-garden)
2. Search for "Claude"
3. Enable Claude 3.5 Sonnet and Claude 4 (when available)
4. Accept terms and configure billing

### **Configure Model Access:**

```python
# The system will automatically detect available models
# No additional configuration needed - the orchestrator handles it!
```

## **Cost Optimization Settings** 💰

```python
# In your app configuration
MAMA_BEAR_COST_OPTIMIZATION = {
    'budget_conscious': True,  # Prefer cheaper models when possible
    'daily_limit': 10.0,       # $10 daily limit
    'auto_fallback': True,     # Fall back to cheaper models if expensive ones fail
    'cost_alerts': True        # Alert when approaching limits
}
```

## **Monitoring and Alerts** 📊

```python
# Set up cost monitoring (optional)
@app.route('/api/mama-bear/usage-stats')
def usage_stats():
    """Monitor usage and costs"""
    agent = app.mama_bear_agent
    
    return {
        'cost_report': agent.get_cost_report(),
        'model_status': agent.get_model_status(),
        'optimization_tips': [
            "Use efficiency_bear for quick chats",
            "Use research_specialist for deep analysis",
            "Enable budget_conscious mode",
            "Monitor daily spend limits"
        ]
    }
```

## **Troubleshooting** 🔧

### **Common Issues:**

1. **Authentication Error:**
   ```bash
   # Check credentials
   gcloud auth list
   gcloud config get-value project
   ```

2. **API Not Enabled:**
   ```bash
   # Re-enable APIs
   gcloud services enable aiplatform.googleapis.com
   ```

3. **Quota Issues:**
   - Check your Google Cloud credits
   - Monitor usage in Cloud Console
   - Adjust cost limits in code

4. **Model Access:**
   - Ensure Model Garden access is enabled
   - Check billing account is linked
   - Verify Claude models are available in your region

## **What You Get** 🎁

✅ **Unified access** to both Gemini API and Vertex AI  
✅ **Cost optimization** with intelligent routing  
✅ **Claude 3.5/4 access** via Vertex AI Model Garden  
✅ **All existing Mama Bear variants** enhanced  
✅ **Automatic fallbacks** for reliability  
✅ **Budget controls** and monitoring  
✅ **Uses your Google Cloud credits!** 💰  

## **Next Steps** 🚀

1. **Run the test script** to verify everything works
2. **Update your frontend** to use new endpoints
3. **Monitor costs** and adjust settings as needed
4. **Enjoy Claude 4 access** without Anthropic billing! 🎉

---

**You're going to LOVE this setup!** It gives you the best of both worlds: lightning-fast Gemini API for quick chats and powerful Claude models for deep research, all using your Google Cloud credits! 🌟