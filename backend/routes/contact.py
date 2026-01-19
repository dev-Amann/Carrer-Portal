"""
Contact form routes
Handles contact form submissions with validation, spam prevention, and email notifications
"""
from flask import Blueprint, request, jsonify, current_app
import bleach
import logging
import json
import os
from datetime import datetime
from utils.email_sender import send_contact_email
from utils.limiter import get_limiter

logger = logging.getLogger(__name__)

contact_bp = Blueprint('contact', __name__)


def validate_contact_data(data):
    """
    Validate contact form data
    
    Args:
        data (dict): Contact form data
    
    Returns:
        tuple: (is_valid: bool, errors: dict)
    """
    errors = {}
    
    # Required fields validation
    required_fields = ['fullName', 'email', 'message', 'consent']
    for field in required_fields:
        if not data.get(field):
            errors[field] = f"{field} is required"
    
    # Email format validation (basic)
    email = data.get('email', '')
    if email and '@' not in email:
        errors['email'] = "Invalid email format"
    
    # Consent validation
    if not data.get('consent'):
        errors['consent'] = "Consent is required to submit the form"
    
    # Message length validation
    message = data.get('message', '')
    if message and len(message) < 10:
        errors['message'] = "Message must be at least 10 characters long"
    
    if message and len(message) > 5000:
        errors['message'] = "Message must not exceed 5000 characters"
    
    # Full name validation
    full_name = data.get('fullName', '')
    if full_name and len(full_name) < 2:
        errors['fullName'] = "Full name must be at least 2 characters long"
    
    if full_name and len(full_name) > 100:
        errors['fullName'] = "Full name must not exceed 100 characters"
    
    return len(errors) == 0, errors


def sanitize_input(text):
    """
    Sanitize user input to prevent XSS attacks
    
    Args:
        text (str): Input text to sanitize
    
    Returns:
        str: Sanitized text
    """
    if not text:
        return text
    
    # Use bleach to strip all HTML tags and attributes
    sanitized = bleach.clean(
        text,
        tags=[],  # No tags allowed
        attributes={},  # No attributes allowed
        strip=True  # Strip tags instead of escaping
    )
    
    return sanitized.strip()


def log_contact_submission(contact_data):
    """
    Log contact form submission to file in development mode
    
    Args:
        contact_data (dict): Contact form data
    """
    try:
        if current_app.config['FLASK_ENV'] == 'development':
            log_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
            log_file = os.path.join(log_dir, 'contacts.log')
            
            # Ensure directory exists
            os.makedirs(log_dir, exist_ok=True)
            
            # Prepare log entry
            log_entry = {
                'timestamp': datetime.utcnow().isoformat(),
                'data': contact_data
            }
            
            # Append to log file
            with open(log_file, 'a', encoding='utf-8') as f:
                f.write(json.dumps(log_entry) + '\n')
            
            logger.info(f"Contact submission logged to {log_file}")
    
    except Exception as e:
        logger.error(f"Failed to log contact submission: {str(e)}", exc_info=True)


@contact_bp.route('', methods=['POST'])
@get_limiter().limit("5 per hour")
def submit_contact():
    """
    Handle contact form submission
    Rate limited to 5 requests per hour per IP address
    
    POST /contact
    Body: {
        fullName: string (required),
        businessName: string (optional),
        email: string (required),
        phone: string (optional),
        budgetRange: string (optional),
        interestedService: string (optional),
        message: string (required),
        consent: boolean (required),
        website: string (honeypot, should be empty)
    }
    
    Returns:
        JSON response with success status and message
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided',
                'code': 'NO_DATA'
            }), 400
        
        # Check honeypot field (spam prevention)
        if data.get('website'):
            logger.warning(f"Honeypot field filled, rejecting submission from {request.remote_addr}")
            # Return success to not alert bots
            return jsonify({
                'success': True,
                'message': 'Thank you for your submission'
            }), 200
        
        # Validate required fields
        is_valid, errors = validate_contact_data(data)
        if not is_valid:
            return jsonify({
                'success': False,
                'error': 'Validation failed',
                'code': 'VALIDATION_ERROR',
                'details': errors
            }), 400
        
        # Sanitize all input fields to prevent XSS
        sanitized_data = {
            'fullName': sanitize_input(data.get('fullName')),
            'businessName': sanitize_input(data.get('businessName', '')),
            'email': sanitize_input(data.get('email')),
            'phone': sanitize_input(data.get('phone', '')),
            'budgetRange': sanitize_input(data.get('budgetRange', '')),
            'interestedService': sanitize_input(data.get('interestedService', '')),
            'message': sanitize_input(data.get('message')),
            'consent': bool(data.get('consent'))
        }
        
        # Log contact submission in development mode
        log_contact_submission(sanitized_data)
        
        # Send email notification
        email_success, email_message = send_contact_email(sanitized_data)
        
        if not email_success:
            logger.error(f"Failed to send contact email: {email_message}")
            # Still return success to user, but log the error
            # In production, you might want to queue this for retry
        
        # Return success response
        return jsonify({
            'success': True,
            'message': 'Thank you for your message. We will get back to you soon!'
        }), 200
    
    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': 'An error occurred while processing your request',
            'code': 'PROCESSING_ERROR'
        }), 500


@contact_bp.route('/test', methods=['GET'])
def test_contact():
    """
    Test endpoint to verify contact route is working
    """
    return jsonify({
        'success': True,
        'message': 'Contact route is working',
        'environment': current_app.config['FLASK_ENV']
    }), 200
