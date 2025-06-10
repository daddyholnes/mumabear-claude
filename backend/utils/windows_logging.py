"""
Windows-compatible logging utilities for Podplay Sanctuary
Handles Unicode emoji characters gracefully on Windows systems
"""

import logging
import sys
import os


class WindowsCompatibleFormatter(logging.Formatter):
    """Custom formatter that handles emoji characters for Windows compatibility"""
    
    # Emoji to ASCII mappings for Windows fallback
    EMOJI_FALLBACKS = {
        '🐻': '[BEAR]',
        '✅': '[OK]',
        '❌': '[ERROR]',
        '⚠️': '[WARNING]',
        '🎭': '[THEATER]',
        '🏛️': '[BUILDING]',
        '🎯': '[TARGET]',
        '🚀': '[ROCKET]',
        '🌟': '[STAR]',
        '🔗': '[LINK]',
        '💻': '[COMPUTER]',
        '📊': '[CHART]',
        '🔄': '[REFRESH]',
        '⏰': '[CLOCK]',
        '🎨': '[ART]',
        '🤖': '[ROBOT]',
        '🌐': '[GLOBE]',
        '📝': '[MEMO]',
        '🔍': '[SEARCH]',
        '📦': '[PACKAGE]',
        '🔧': '[WRENCH]',
        '📥': '[INBOX]',
        '🐍': '[SNAKE]',
        '🧪': '[TEST_TUBE]',
        '🚁': '[HELICOPTER]',
        '💡': '[BULB]',
        '👋': '[WAVE]',
        '📋': '[CLIPBOARD]',
        '🏥': '[HOSPITAL]',
        '🎪': '[CIRCUS]',
        '🏛': '[CLASSICAL_BUILDING]',
        '🎬': '[CLAPPER]',
        '🔊': '[SPEAKER]',
        '💬': '[SPEECH_BALLOON]',
        '📺': '[TV]',
        '🖥️': '[DESKTOP]',
        '📱': '[MOBILE]',
        '⚡': '[ZAP]',
        '🌈': '[RAINBOW]',
        '🎵': '[MUSICAL_NOTE]',
        '🎶': '[NOTES]',
        '🎪': '[CIRCUS_TENT]',
        '🔔': '[BELL]',
        '🔕': '[NO_BELL]',
        '📢': '[LOUDSPEAKER]',
        '📣': '[MEGAPHONE]',
        '🔊': '[LOUD_SOUND]',
        '🔉': '[SOUND]',
        '🔈': '[SPEAKER_LOW]',
        '🔇': '[MUTED]',
        '🎧': '[HEADPHONES]',
        '📻': '[RADIO]',
        '🎤': '[MICROPHONE]',
        '🎼': '[MUSICAL_SCORE]',
        '🎹': '[MUSICAL_KEYBOARD]',
        '🥁': '[DRUM]',
        '🎷': '[SAXOPHONE]',
        '🎺': '[TRUMPET]',
        '🎸': '[GUITAR]',
        '🎻': '[VIOLIN]'
    }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.use_emoji_fallback = sys.platform.startswith('win')
    
    def format(self, record):
        # Get the formatted message
        formatted = super().format(record)
        
        # Replace emojis with ASCII fallbacks on Windows if needed
        if self.use_emoji_fallback:
            for emoji, fallback in self.EMOJI_FALLBACKS.items():
                formatted = formatted.replace(emoji, fallback)
        
        return formatted


def setup_windows_compatible_logging():
    """Set up logging that works properly on Windows with Unicode characters"""
    
    # Create custom formatter
    formatter = WindowsCompatibleFormatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # File handler with UTF-8 encoding
    file_handler = logging.FileHandler(
        os.getenv('LOG_FILE', 'mama_bear.log'), 
        encoding='utf-8'
    )
    file_handler.setFormatter(formatter)
    
    # Console handler with proper encoding
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    
    # For Windows, try to enable UTF-8 mode
    if sys.platform.startswith('win'):
        try:
            # Try to set environment variable for UTF-8 mode
            os.environ['PYTHONIOENCODING'] = 'utf-8'
            
            # Try to reconfigure stdout for UTF-8 if possible
            if hasattr(sys.stdout, 'reconfigure'):
                sys.stdout.reconfigure(encoding='utf-8', errors='replace')
            if hasattr(sys.stderr, 'reconfigure'):
                sys.stderr.reconfigure(encoding='utf-8', errors='replace')
        except Exception:
            # If UTF-8 setup fails, the formatter will handle emoji fallbacks
            pass
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.handlers.clear()  # Clear any existing handlers
    root_logger.addHandler(file_handler)
    root_logger.addHandler(console_handler)
    root_logger.setLevel(getattr(logging, os.getenv('LOG_LEVEL', 'INFO')))
    
    return root_logger


def get_windows_compatible_logger(name):
    """Get a logger that works properly on Windows"""
    return logging.getLogger(name)


# Auto-setup when module is imported
if __name__ != '__main__':
    setup_windows_compatible_logging()
