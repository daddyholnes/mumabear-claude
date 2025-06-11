"""
Multi-Modal AI Chat Service
Handles all AI model integrations for the messenger app
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any, Union
import openai
import anthropic
import google.generativeai as genai
from dataclasses import dataclass
from enum import Enum

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIProvider(Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic" 
    GOOGLE = "google"
    META = "meta"
    CUSTOM = "custom"

@dataclass
class AIFriend:
    id: str
    name: str
    display_name: str
    avatar: str
    custom_avatar: Optional[str] = None
    online: bool = True
    typing: bool = False
    token_count: int = 4096
    price_per_minute: float = 0.02
    usage: int = 0
    description: str = ""
    capabilities: List[str] = None
    last_active: str = "Now"
    personality: str = ""
    memory_enabled: bool = True
    voice_id: Optional[str] = None
    provider: AIProvider = AIProvider.OPENAI
    model: str = ""
    temperature: float = 0.7
    max_tokens: int = 4096
    system_prompt: str = ""

@dataclass
class ChatMessage:
    id: str
    content: str
    sender: str  # "user" or "ai"
    timestamp: datetime
    message_type: str = "text"  # "text", "image", "file", "audio", "video"
    file_name: Optional[str] = None
    file_size: Optional[str] = None
    file_url: Optional[str] = None
    ai_model: Optional[str] = None
    reactions: List[str] = None
    edited: bool = False
    reply_to: Optional[str] = None

class MultiModalChatService:
    """
    Service to handle all AI model interactions for the multi-modal chat
    """
    
    def __init__(self):
        self.ai_friends: Dict[str, AIFriend] = {}
        self.conversation_history: Dict[str, List[ChatMessage]] = {}
        
        # Initialize AI clients
        self.openai_client = None
        self.anthropic_client = None
        self.google_client = None
        
        # Load default AI friends
        self._initialize_default_friends()
    
    def _initialize_default_friends(self):
        """Initialize the default AI friends configuration"""
        
        default_friends = [
            # OpenAI Models
            AIFriend(
                id="gpt-4o",
                name="GPT-4o",
                display_name="Alex",
                avatar="🤖",
                description="Latest and most capable OpenAI model with vision and reasoning",
                capabilities=["Text", "Vision", "Code", "Analysis", "Math", "Creative Writing"],
                personality="Helpful, analytical, and creative. Loves solving complex problems.",
                provider=AIProvider.OPENAI,
                model="gpt-4o",
                temperature=0.7,
                max_tokens=4096,
                system_prompt="You are Alex, a helpful and intelligent AI assistant.",
                price_per_minute=0.03,
                token_count=128000
            ),
            AIFriend(
                id="gpt-4o-mini", 
                name="GPT-4o Mini",
                display_name="Sam",
                avatar="⚡",
                description="Fast and efficient OpenAI model for quick responses",
                capabilities=["Text", "Vision", "Code", "Quick Analysis"],
                personality="Quick-thinking, efficient, and always ready to help with rapid responses.",
                provider=AIProvider.OPENAI,
                model="gpt-4o-mini",
                temperature=0.6,
                max_tokens=2048,
                system_prompt="You are Sam, a quick and efficient AI assistant.",
                price_per_minute=0.015,
                token_count=128000
            ),
            AIFriend(
                id="gpt-4-turbo",
                name="GPT-4 Turbo", 
                display_name="Nova",
                avatar="🚀",
                description="Powerful GPT-4 with enhanced performance and capabilities",
                capabilities=["Text", "Vision", "Code", "Analysis", "Research"],
                personality="Thorough, detail-oriented, and excellent at complex reasoning tasks.",
                provider=AIProvider.OPENAI,
                model="gpt-4-turbo",
                temperature=0.7,
                max_tokens=4096,
                system_prompt="You are Nova, a thorough and detail-oriented AI assistant.",
                price_per_minute=0.025,
                token_count=128000
            ),
            
            # Anthropic Models
            AIFriend(
                id="claude-3.5-sonnet",
                name="Claude 3.5 Sonnet",
                display_name="Claude",
                avatar="🧠", 
                description="Anthropic's most capable model with excellent reasoning",
                capabilities=["Text", "Analysis", "Math", "Coding", "Research", "Creative Writing"],
                personality="Thoughtful, ethical, and excellent at nuanced understanding.",
                provider=AIProvider.ANTHROPIC,
                model="claude-3-5-sonnet-20241022",
                temperature=0.7,
                max_tokens=4096,
                system_prompt="You are Claude, a thoughtful and helpful AI assistant.",
                price_per_minute=0.025,
                token_count=200000
            ),
            AIFriend(
                id="claude-3-haiku",
                name="Claude 3 Haiku",
                display_name="Haiku",
                avatar="🎋",
                description="Fast and efficient Claude model for quick tasks",
                capabilities=["Text", "Quick Analysis", "Coding", "Summaries"],
                personality="Concise, poetic, and efficient. Speaks in thoughtful, measured responses.",
                provider=AIProvider.ANTHROPIC,
                model="claude-3-haiku-20240307",
                temperature=0.6,
                max_tokens=2048,
                system_prompt="You are Haiku, a concise and poetic AI assistant.",
                price_per_minute=0.01,
                token_count=200000
            ),
            
            # Google Models
            AIFriend(
                id="gemini-pro",
                name="Gemini Pro",
                display_name="Gemini",
                avatar="💎",
                description="Google's powerful multimodal AI model",
                capabilities=["Text", "Images", "Video", "Audio", "Code", "Analysis"],
                personality="Versatile, innovative, and excellent with multimodal content.",
                provider=AIProvider.GOOGLE,
                model="gemini-pro", 
                temperature=0.7,
                max_tokens=4096,
                system_prompt="You are Gemini, a versatile and innovative AI assistant.",
                price_per_minute=0.02,
                token_count=32000
            ),
            AIFriend(
                id="gemini-pro-vision",
                name="Gemini Pro Vision",
                display_name="Vision",
                avatar="👁️",
                description="Specialized in visual understanding and analysis",
                capabilities=["Vision", "Image Analysis", "OCR", "Visual Reasoning"],
                personality="Observant, detailed, and exceptional at understanding visual content.",
                provider=AIProvider.GOOGLE,
                model="gemini-pro-vision",
                temperature=0.6,
                max_tokens=2048,
                system_prompt="You are Vision, an AI assistant specialized in visual understanding.",
                price_per_minute=0.025,
                token_count=32000
            ),
            
            # Meta Models  
            AIFriend(
                id="llama-3.1-405b",
                name="Llama 3.1 405B",
                display_name="Llama",
                avatar="🦙",
                online=False,  # Might be offline depending on hosting
                description="Meta's most powerful open-source language model",
                capabilities=["Text", "Code", "Analysis", "Research", "Math"],
                personality="Open, straightforward, and excellent at reasoning through complex problems.",
                provider=AIProvider.META,
                model="llama-3.1-405b",
                temperature=0.7,
                max_tokens=4096,
                system_prompt="You are Llama, an open and straightforward AI assistant.",
                price_per_minute=0.02,
                token_count=128000,
                last_active="2 hours ago"
            )
        ]
        
        for friend in default_friends:
            self.ai_friends[friend.id] = friend
            self.conversation_history[friend.id] = []
    
    def initialize_clients(self, api_keys: Dict[str, str]):
        """Initialize AI service clients with API keys"""
        try:
            if "openai" in api_keys:
                self.openai_client = openai.OpenAI(api_key=api_keys["openai"])
                logger.info("OpenAI client initialized")
            
            if "anthropic" in api_keys:
                self.anthropic_client = anthropic.Anthropic(api_key=api_keys["anthropic"])
                logger.info("Anthropic client initialized")
            
            if "google" in api_keys:
                genai.configure(api_key=api_keys["google"])
                self.google_client = genai
                logger.info("Google AI client initialized")
                
        except Exception as e:
            logger.error(f"Error initializing AI clients: {e}")
    
    async def send_message(
        self, 
        friend_id: str, 
        message: str, 
        files: List[Dict] = None,
        message_type: str = "text"
    ) -> ChatMessage:
        """Send a message to an AI friend and get response"""
        
        if friend_id not in self.ai_friends:
            raise ValueError(f"AI friend {friend_id} not found")
        
        friend = self.ai_friends[friend_id]
        
        # Create user message
        user_message = ChatMessage(
            id=f"user_{datetime.now().timestamp()}",
            content=message,
            sender="user",
            timestamp=datetime.now(),
            message_type=message_type
        )
        
        # Add to conversation history
        if friend_id not in self.conversation_history:
            self.conversation_history[friend_id] = []
        
        self.conversation_history[friend_id].append(user_message)
        
        # Generate AI response based on provider
        try:
            ai_response_content = await self._generate_ai_response(friend, message, files)
            
            # Create AI response message
            ai_message = ChatMessage(
                id=f"ai_{datetime.now().timestamp()}",
                content=ai_response_content,
                sender="ai",
                timestamp=datetime.now(),
                message_type="text",
                ai_model=friend.name
            )
            
            self.conversation_history[friend_id].append(ai_message)
            
            # Update friend usage
            friend.usage = min(100, friend.usage + 1)
            friend.last_active = "Now"
            
            return ai_message
            
        except Exception as e:
            logger.error(f"Error generating AI response: {e}")
            # Return error message
            error_message = ChatMessage(
                id=f"error_{datetime.now().timestamp()}",
                content=f"Sorry, I'm having trouble responding right now. Error: {str(e)}",
                sender="ai",
                timestamp=datetime.now(),
                message_type="text",
                ai_model=friend.name
            )
            return error_message
    
    async def _generate_ai_response(
        self, 
        friend: AIFriend, 
        message: str, 
        files: List[Dict] = None
    ) -> str:
        """Generate response from appropriate AI provider"""
        
        # Get conversation context if memory enabled
        context_messages = []
        if friend.memory_enabled and friend.id in self.conversation_history:
            # Get last 10 messages for context
            recent_messages = self.conversation_history[friend.id][-10:]
            for msg in recent_messages:
                role = "user" if msg.sender == "user" else "assistant"
                context_messages.append({
                    "role": role,
                    "content": msg.content
                })
        
        # Add current message
        context_messages.append({
            "role": "user", 
            "content": message
        })
        
        # Generate response based on provider
        if friend.provider == AIProvider.OPENAI:
            return await self._generate_openai_response(friend, context_messages, files)
        elif friend.provider == AIProvider.ANTHROPIC:
            return await self._generate_anthropic_response(friend, context_messages, files)
        elif friend.provider == AIProvider.GOOGLE:
            return await self._generate_google_response(friend, context_messages, files)
        elif friend.provider == AIProvider.META:
            return await self._generate_meta_response(friend, context_messages, files)
        else:
            return f"I'm {friend.display_name}, but I'm not properly configured yet. Please check my settings!"
    
    async def _generate_openai_response(
        self, 
        friend: AIFriend, 
        messages: List[Dict], 
        files: List[Dict] = None
    ) -> str:
        """Generate response using OpenAI models"""
        
        if not self.openai_client:
            return "OpenAI client not initialized. Please check API key configuration."
        
        try:
            # Prepare messages with system prompt
            api_messages = [{"role": "system", "content": friend.system_prompt}]
            api_messages.extend(messages)
            
            # Handle vision models if files are provided
            if files and any(f.get("type", "").startswith("image") for f in files):
                # For vision-capable models, add image content
                for file_info in files:
                    if file_info.get("type", "").startswith("image"):
                        api_messages[-1]["content"] = [
                            {"type": "text", "text": api_messages[-1]["content"]},
                            {"type": "image_url", "image_url": {"url": file_info.get("url", "")}}
                        ]
            
            response = self.openai_client.chat.completions.create(
                model=friend.model,
                messages=api_messages,
                temperature=friend.temperature,
                max_tokens=friend.max_tokens
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            return f"Sorry, I'm having trouble connecting to OpenAI right now. ({str(e)})"
    
    async def _generate_anthropic_response(
        self, 
        friend: AIFriend, 
        messages: List[Dict], 
        files: List[Dict] = None
    ) -> str:
        """Generate response using Anthropic models"""
        
        if not self.anthropic_client:
            return "Anthropic client not initialized. Please check API key configuration."
        
        try:
            # Anthropic has different message format
            api_messages = []
            for msg in messages:
                if msg["role"] != "system":  # Anthropic handles system separately
                    api_messages.append(msg)
            
            response = self.anthropic_client.messages.create(
                model=friend.model,
                system=friend.system_prompt,
                messages=api_messages,
                temperature=friend.temperature,
                max_tokens=friend.max_tokens
            )
            
            return response.content[0].text
            
        except Exception as e:
            logger.error(f"Anthropic API error: {e}")
            return f"Sorry, I'm having trouble connecting to Anthropic right now. ({str(e)})"
    
    async def _generate_google_response(
        self, 
        friend: AIFriend, 
        messages: List[Dict], 
        files: List[Dict] = None
    ) -> str:
        """Generate response using Google models"""
        
        if not self.google_client:
            return "Google AI client not initialized. Please check API key configuration."
        
        try:
            model = self.google_client.GenerativeModel(friend.model)
            
            # Combine system prompt with user message
            prompt = f"{friend.system_prompt}\n\nUser: {messages[-1]['content']}"
            
            response = model.generate_content(
                prompt,
                generation_config=self.google_client.types.GenerationConfig(
                    temperature=friend.temperature,
                    max_output_tokens=friend.max_tokens
                )
            )
            
            return response.text
            
        except Exception as e:
            logger.error(f"Google AI API error: {e}")
            return f"Sorry, I'm having trouble connecting to Google AI right now. ({str(e)})"
    
    async def _generate_meta_response(
        self, 
        friend: AIFriend, 
        messages: List[Dict], 
        files: List[Dict] = None
    ) -> str:
        """Generate response using Meta models (placeholder for now)"""
        
        # This would integrate with Together AI, Replicate, or local Llama deployment
        return f"Hi! I'm {friend.display_name} (Llama). Meta model integration is coming soon! For now, I'm just a friendly placeholder."
    
    def get_ai_friends(self) -> List[Dict]:
        """Get all AI friends as dictionaries"""
        return [
            {
                "id": friend.id,
                "name": friend.name,
                "displayName": friend.display_name,
                "avatar": friend.avatar,
                "customAvatar": friend.custom_avatar,
                "online": friend.online,
                "typing": friend.typing,
                "tokenCount": friend.token_count,
                "pricePerMinute": friend.price_per_minute,
                "usage": friend.usage,
                "description": friend.description,
                "capabilities": friend.capabilities or [],
                "lastActive": friend.last_active,
                "personality": friend.personality,
                "memoryEnabled": friend.memory_enabled,
                "voiceId": friend.voice_id,
                "provider": friend.provider.value,
                "model": friend.model,
                "temperature": friend.temperature,
                "maxTokens": friend.max_tokens,
                "systemPrompt": friend.system_prompt
            }
            for friend in self.ai_friends.values()
        ]
    
    def update_ai_friend(self, friend_id: str, updates: Dict) -> bool:
        """Update an AI friend's configuration"""
        
        if friend_id not in self.ai_friends:
            return False
        
        friend = self.ai_friends[friend_id]
        
        # Update allowed fields
        if "displayName" in updates:
            friend.display_name = updates["displayName"]
        if "avatar" in updates:
            friend.avatar = updates["avatar"]
        if "customAvatar" in updates:
            friend.custom_avatar = updates["customAvatar"]
        if "personality" in updates:
            friend.personality = updates["personality"]
        if "systemPrompt" in updates:
            friend.system_prompt = updates["systemPrompt"]
        if "temperature" in updates:
            friend.temperature = max(0, min(2, float(updates["temperature"])))
        if "maxTokens" in updates:
            friend.max_tokens = max(1, min(32000, int(updates["maxTokens"])))
        if "capabilities" in updates:
            friend.capabilities = updates["capabilities"]
        if "memoryEnabled" in updates:
            friend.memory_enabled = bool(updates["memoryEnabled"])
        
        return True
    
    def get_conversation_history(self, friend_id: str, limit: int = 50) -> List[Dict]:
        """Get conversation history with an AI friend"""
        
        if friend_id not in self.conversation_history:
            return []
        
        messages = self.conversation_history[friend_id][-limit:]
        
        return [
            {
                "id": msg.id,
                "content": msg.content,
                "sender": msg.sender,
                "timestamp": msg.timestamp.isoformat(),
                "type": msg.message_type,
                "fileName": msg.file_name,
                "fileSize": msg.file_size,
                "fileUrl": msg.file_url,
                "aiModel": msg.ai_model,
                "reactions": msg.reactions or [],
                "edited": msg.edited,
                "replyTo": msg.reply_to
            }
            for msg in messages
        ]
    
    def clear_conversation_history(self, friend_id: str) -> bool:
        """Clear conversation history with an AI friend"""
        
        if friend_id in self.conversation_history:
            self.conversation_history[friend_id] = []
            return True
        return False

# Global service instance
chat_service = MultiModalChatService()

async def main():
    """Test the service"""
    
    # Initialize with dummy API keys for testing
    api_keys = {
        "openai": "your-openai-key",
        "anthropic": "your-anthropic-key", 
        "google": "your-google-key"
    }
    
    chat_service.initialize_clients(api_keys)
    
    # Test sending a message
    print("Testing multi-modal chat service...")
    
    friends = chat_service.get_ai_friends()
    print(f"Loaded {len(friends)} AI friends")
    
    for friend in friends[:3]:  # Show first 3 friends
        print(f"- {friend['displayName']} ({friend['name']}) - {friend['provider']}")

if __name__ == "__main__":
    asyncio.run(main())
