"""
OTP Manager for email verification
Handles OTP generation, storage, and verification
"""
import random
import string
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

# In-memory OTP storage (in production, use Redis or database)
otp_storage = {}


def generate_otp(length=6):
    """
    Generate a random OTP
    
    Args:
        length (int): Length of OTP (default: 6)
    
    Returns:
        str: Generated OTP
    """
    return ''.join(random.choices(string.digits, k=length))


def store_otp(email, otp, purpose='verification', expiry_minutes=10):
    """
    Store OTP with expiry time
    
    Args:
        email (str): User's email address
        otp (str): Generated OTP
        purpose (str): Purpose of OTP (verification, login, etc.)
        expiry_minutes (int): OTP validity in minutes
    
    Returns:
        bool: True if stored successfully
    """
    try:
        key = f"{email}:{purpose}"
        expiry_time = datetime.utcnow() + timedelta(minutes=expiry_minutes)
        
        otp_storage[key] = {
            'otp': otp,
            'expiry': expiry_time,
            'attempts': 0
        }
        
        logger.info(f"OTP stored for {email} (purpose: {purpose})")
        return True
    except Exception as e:
        logger.error(f"Failed to store OTP: {str(e)}")
        return False


def verify_otp(email, otp, purpose='verification', max_attempts=3, consume=True):
    """
    Verify OTP
    
    Args:
        email (str): User's email address
        otp (str): OTP to verify
        purpose (str): Purpose of OTP
        max_attempts (int): Maximum verification attempts
        consume (bool): Whether to delete OTP after successful verification
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        key = f"{email}:{purpose}"
        
        if key not in otp_storage:
            return False, "OTP not found or expired"
        
        stored_data = otp_storage[key]
        
        # Check if OTP has expired
        if datetime.utcnow() > stored_data['expiry']:
            del otp_storage[key]
            return False, "OTP has expired"
        
        # Check attempts
        if stored_data['attempts'] >= max_attempts:
            del otp_storage[key]
            return False, "Maximum verification attempts exceeded"
        
        # Verify OTP
        if stored_data['otp'] == otp:
            if consume:
                del otp_storage[key]
            logger.info(f"OTP verified successfully for {email}")
            return True, "OTP verified successfully"
        else:
            stored_data['attempts'] += 1
            remaining = max_attempts - stored_data['attempts']
            return False, f"Invalid OTP. {remaining} attempts remaining"
    
    except Exception as e:
        logger.error(f"Failed to verify OTP: {str(e)}")
        return False, "OTP verification failed"


def clear_otp(email, purpose='verification'):
    """
    Clear OTP from storage
    
    Args:
        email (str): User's email address
        purpose (str): Purpose of OTP
    
    Returns:
        bool: True if cleared successfully
    """
    try:
        key = f"{email}:{purpose}"
        if key in otp_storage:
            del otp_storage[key]
            logger.info(f"OTP cleared for {email} (purpose: {purpose})")
        return True
    except Exception as e:
        logger.error(f"Failed to clear OTP: {str(e)}")
        return False


def cleanup_expired_otps():
    """
    Remove expired OTPs from storage
    Should be called periodically
    
    Returns:
        int: Number of OTPs removed
    """
    try:
        current_time = datetime.utcnow()
        expired_keys = [
            key for key, data in otp_storage.items()
            if current_time > data['expiry']
        ]
        
        for key in expired_keys:
            del otp_storage[key]
        
        if expired_keys:
            logger.info(f"Cleaned up {len(expired_keys)} expired OTPs")
        
        return len(expired_keys)
    except Exception as e:
        logger.error(f"Failed to cleanup expired OTPs: {str(e)}")
        return 0
