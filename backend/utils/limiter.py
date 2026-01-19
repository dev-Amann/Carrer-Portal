"""
Rate limiter instance shared across the application
"""
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# This will be initialized in app.py
limiter = None

def init_limiter(app):
    """
    Initialize Flask-Limiter with app configuration
    
    Args:
        app: Flask application instance
    
    Returns:
        Limiter: Configured limiter instance
    """
    global limiter
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        storage_uri=app.config['RATELIMIT_STORAGE_URL'],
        default_limits=[]  # No rate limits for development
    )
    return limiter


def get_limiter():
    """
    Get the limiter instance
    
    Returns:
        Limiter: The limiter instance
    """
    return limiter
