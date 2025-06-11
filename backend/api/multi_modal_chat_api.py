"""
Multi-Modal Chat API endpoints
Flask Blueprint for handling chat requests
"""

from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import asyncio
import json
import logging
from datetime import datetime
from backend.services.multi_modal_chat_service import chat_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Blueprint
multi_modal_chat_bp = Blueprint('multi_modal_chat', __name__, url_prefix='/api/chat')

@multi_modal_chat_bp.route('/health', methods=['GET'])
@cross_origin()
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "multi-modal-chat",
        "timestamp": datetime.now().isoformat(),
        "friends_loaded": len(chat_service.get_ai_friends())
    })

@multi_modal_chat_bp.route('/friends', methods=['GET'])
@cross_origin()
def get_ai_friends():
    """Get all AI friends"""
    try:
        friends = chat_service.get_ai_friends()
        return jsonify({
            "success": True,
            "friends": friends,
            "count": len(friends)
        })
    except Exception as e:
        logger.error(f"Error getting AI friends: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@multi_modal_chat_bp.route('/friends/<friend_id>', methods=['PUT'])
@cross_origin()
def update_ai_friend(friend_id):
    """Update an AI friend's configuration"""
    try:
        updates = request.get_json()
        if not updates:
            return jsonify({
                "success": False,
                "error": "No update data provided"
            }), 400
        
        success = chat_service.update_ai_friend(friend_id, updates)
        if success:
            return jsonify({
                "success": True,
                "message": f"AI friend {friend_id} updated successfully"
            })
        else:
            return jsonify({
                "success": False,
                "error": f"AI friend {friend_id} not found"
            }), 404
            
    except Exception as e:
        logger.error(f"Error updating AI friend {friend_id}: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@multi_modal_chat_bp.route('/send', methods=['POST'])
@cross_origin()
def send_message():
    """Send a message to an AI friend"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'friendId' not in data or 'message' not in data:
            return jsonify({
                "success": False,
                "error": "friendId and message are required"
            }), 400
        
        friend_id = data['friendId']
        message = data['message']
        files = data.get('files', [])
        message_type = data.get('type', 'text')
        
        # Send message asynchronously
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            ai_response = loop.run_until_complete(
                chat_service.send_message(friend_id, message, files, message_type)
            )
        finally:
            loop.close()
        
        # Convert response to dict
        response_data = {
            "id": ai_response.id,
            "content": ai_response.content,
            "sender": ai_response.sender,
            "timestamp": ai_response.timestamp.isoformat(),
            "type": ai_response.message_type,
            "fileName": ai_response.file_name,
            "fileSize": ai_response.file_size,
            "fileUrl": ai_response.file_url,
            "aiModel": ai_response.ai_model,
            "reactions": ai_response.reactions or [],
            "edited": ai_response.edited,
            "replyTo": ai_response.reply_to
        }
        
        return jsonify({
            "success": True,
            "response": response_data
        })
        
    except ValueError as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 404
    except Exception as e:
        logger.error(f"Error sending message: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@multi_modal_chat_bp.route('/history/<friend_id>', methods=['GET'])
@cross_origin()
def get_conversation_history(friend_id):
    """Get conversation history with an AI friend"""
    try:
        limit = request.args.get('limit', 50, type=int)
        history = chat_service.get_conversation_history(friend_id, limit)
        
        return jsonify({
            "success": True,
            "history": history,
            "friendId": friend_id,
            "count": len(history)
        })
        
    except Exception as e:
        logger.error(f"Error getting conversation history for {friend_id}: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@multi_modal_chat_bp.route('/history/<friend_id>', methods=['DELETE'])
@cross_origin()
def clear_conversation_history(friend_id):
    """Clear conversation history with an AI friend"""
    try:
        success = chat_service.clear_conversation_history(friend_id)
        
        if success:
            return jsonify({
                "success": True,
                "message": f"Conversation history cleared for {friend_id}"
            })
        else:
            return jsonify({
                "success": False,
                "error": f"No conversation history found for {friend_id}"
            }), 404
            
    except Exception as e:
        logger.error(f"Error clearing conversation history for {friend_id}: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@multi_modal_chat_bp.route('/initialize', methods=['POST'])
@cross_origin()
def initialize_chat_service():
    """Initialize chat service with API keys"""
    try:
        data = request.get_json()
        
        if not data or 'apiKeys' not in data:
            return jsonify({
                "success": False,
                "error": "apiKeys object is required"
            }), 400
        
        api_keys = data['apiKeys']
        chat_service.initialize_clients(api_keys)
        
        return jsonify({
            "success": True,
            "message": "Chat service initialized successfully",
            "providers": list(api_keys.keys())
        })
        
    except Exception as e:
        logger.error(f"Error initializing chat service: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@multi_modal_chat_bp.route('/typing/<friend_id>', methods=['POST'])
@cross_origin()
def set_friend_typing(friend_id):
    """Set typing status for an AI friend"""
    try:
        data = request.get_json()
        typing = data.get('typing', False) if data else False
        
        # Update typing status
        friends = chat_service.ai_friends
        if friend_id in friends:
            friends[friend_id].typing = typing
            return jsonify({
                "success": True,
                "friendId": friend_id,
                "typing": typing
            })
        else:
            return jsonify({
                "success": False,
                "error": f"AI friend {friend_id} not found"
            }), 404
            
    except Exception as e:
        logger.error(f"Error setting typing status for {friend_id}: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@multi_modal_chat_bp.route('/upload', methods=['POST'])
@cross_origin()
def upload_file():
    """Handle file uploads for multi-modal chat"""
    try:
        if 'file' not in request.files:
            return jsonify({
                "success": False,
                "error": "No file provided"
            }), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({
                "success": False,
                "error": "No file selected"
            }), 400
        
        # For now, return mock file info
        # In production, you'd upload to cloud storage
        file_info = {
            "id": f"file_{datetime.now().timestamp()}",
            "name": file.filename,
            "size": len(file.read()),
            "type": file.content_type,
            "url": f"/uploads/{file.filename}",  # Mock URL
            "uploaded": datetime.now().isoformat()
        }
        
        return jsonify({
            "success": True,
            "file": file_info
        })
        
    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@multi_modal_chat_bp.route('/stats', methods=['GET'])
@cross_origin()
def get_chat_stats():
    """Get chat statistics and usage info"""
    try:
        friends = chat_service.get_ai_friends()
        
        stats = {
            "totalFriends": len(friends),
            "onlineFriends": len([f for f in friends if f["online"]]),
            "providerBreakdown": {},
            "totalUsage": 0,
            "averageUsage": 0,
            "totalConversations": len(chat_service.conversation_history),
            "totalMessages": sum(len(msgs) for msgs in chat_service.conversation_history.values())
        }
        
        # Provider breakdown
        for friend in friends:
            provider = friend["provider"]
            if provider not in stats["providerBreakdown"]:
                stats["providerBreakdown"][provider] = 0
            stats["providerBreakdown"][provider] += 1
        
        # Usage stats
        usage_values = [f["usage"] for f in friends]
        if usage_values:
            stats["totalUsage"] = sum(usage_values)
            stats["averageUsage"] = stats["totalUsage"] / len(usage_values)
        
        return jsonify({
            "success": True,
            "stats": stats
        })
        
    except Exception as e:
        logger.error(f"Error getting chat stats: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Test endpoint
@multi_modal_chat_bp.route('/test', methods=['GET'])
@cross_origin()
def test_endpoint():
    """Test endpoint to verify API is working"""
    return jsonify({
        "success": True,
        "message": "Multi-Modal Chat API is working!",
        "version": "1.0.0",
        "features": [
            "OpenAI GPT models",
            "Anthropic Claude models", 
            "Google Gemini models",
            "Meta Llama models (coming soon)",
            "Multi-modal file support",
            "Persistent memory",
            "Custom AI personalities",
            "Real-time typing indicators"
        ]
    })
