"""
Payment Helper Utilities
Handles Razorpay interactions
"""
import razorpay
import hmac
import hashlib
import os
import logging

logger = logging.getLogger(__name__)

def get_razorpay_client():
    """Initialize and return Razorpay client"""
    key_id = os.getenv('RAZORPAY_KEY_ID')
    key_secret = os.getenv('RAZORPAY_KEY_SECRET')
    
    if not key_id or not key_secret:
        raise ValueError("Razorpay credentials not found in environment variables")
        
    return razorpay.Client(auth=(key_id, key_secret))

def create_razorpay_order(amount, currency='INR', receipt=None, notes=None):
    """
    Create a Razorpay order
    
    Args:
        amount (float): Amount in currency units (e.g. Rupee)
        currency (str): Currency code (default: INR)
        receipt (str): Receipt ID
        notes (dict): Optional notes
        
    Returns:
        dict: Razorpay order details
    """
    try:
        client = get_razorpay_client()
        
        # Convert amount to paise (integer)
        amount_paise = int(amount * 100)
        
        data = {
            'amount': amount_paise,
            'currency': currency,
            'receipt': receipt,
            'notes': notes or {},
            'payment_capture': 1  # Auto capture
        }
        
        order = client.order.create(data=data)
        return order
        
    except Exception as e:
        logger.error(f"Error creating Razorpay order: {str(e)}")
        raise

def verify_razorpay_signature(razorpay_order_id, razorpay_payment_id, razorpay_signature):
    """
    Verify Razorpay payment signature
    
    Args:
        razorpay_order_id (str): Order ID from Razorpay
        razorpay_payment_id (str): Payment ID from Razorpay
        razorpay_signature (str): Signature from Razorpay
        
    Returns:
        bool: True if signature is valid, False otherwise
    """
    try:
        client = get_razorpay_client()
        
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        
        # Verify signature
        # verify_payment_signature returns None on success, raises Error on failure
        # documentation: https://razorpay.com/docs/api/python/#verify-payment-signature
        
        client.utility.verify_payment_signature(params_dict)
        return True
        
    except razorpay.errors.SignatureVerificationError as e:
        logger.warning(f"Razorpay signature verification failed: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Error verifying Razorpay signature: {str(e)}")
        raise
