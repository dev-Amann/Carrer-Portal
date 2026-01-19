"""
Jitsi Meet helper utilities
Provides functions for generating unique Jitsi room identifiers
"""
import uuid
import logging

logger = logging.getLogger(__name__)


def generate_jitsi_room():
    """
    Generate a unique Jitsi room identifier
    
    Creates a unique room ID using UUID4 for Jitsi Meet video conferencing.
    The room ID is formatted as a string without hyphens for cleaner URLs.
    
    Returns:
        str: A unique room identifier (UUID without hyphens)
    
    Example:
        >>> room_id = generate_jitsi_room()
        >>> print(room_id)
        'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
    """
    try:
        # Generate UUID4 (random UUID)
        room_uuid = uuid.uuid4()
        
        # Convert to string and remove hyphens for cleaner room ID
        room_id = str(room_uuid).replace('-', '')
        
        logger.info(f"Generated Jitsi room ID: {room_id}")
        
        return room_id
        
    except Exception as e:
        logger.error(f"Error generating Jitsi room ID: {str(e)}")
        raise


def generate_jitsi_url(room_id):
    """
    Generate a full Jitsi Meet URL for a given room ID
    
    Args:
        room_id (str): The unique room identifier
    
    Returns:
        str: The full Jitsi Meet URL
    
    Example:
        >>> url = generate_jitsi_url('a1b2c3d4e5f6g7h8')
        >>> print(url)
        'https://meet.jit.si/a1b2c3d4e5f6g7h8'
    """
    return f"https://meet.jit.si/{room_id}"
