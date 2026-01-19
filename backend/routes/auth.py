"""
Authentication routes with OTP verification
Handles user registration, login, token refresh, and logout
"""
from flask import Blueprint, request, jsonify, g
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
import bcrypt
import re
import logging

from models import User, Expert
from utils.jwt_utils import create_access_token, create_refresh_token, verify_token
from utils.otp_manager import generate_otp, store_otp, verify_otp, clear_otp
from utils.email_sender import send_otp_email

logger = logging.getLogger(__name__)

# Create blueprint
auth_bp = Blueprint('auth', __name__)


def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password_strength(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Za-z]', password):
        return False, "Password must contain at least one letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    return True, ""


def hash_password(password):
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(password, password_hash):
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))


@auth_bp.route('/send-otp', methods=['POST'])
def send_otp():
    """
    Send OTP to email for verification
    
    Request Body:
        {
            "email": "user@example.com",
            "purpose": "verification" | "login"
        }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400
        
        email = data.get('email', '').strip().lower()
        purpose = data.get('purpose', 'verification')
        
        if not email:
            return jsonify({
                'success': False,
                'error': 'Email is required'
            }), 400
        
        if not validate_email(email):
            return jsonify({
                'success': False,
                'error': 'Invalid email format'
            }), 400
        
        # For signup verification, check if email already exists
        if purpose == 'verification':
            existing_user = g.db.query(User).filter_by(email=email).first()
            if existing_user:
                return jsonify({
                    'success': False,
                    'error': 'Email already registered'
                }), 409
        
        # For login OTP, check if user exists
        if purpose == 'login':
            user = g.db.query(User).filter_by(email=email).first()
            if not user:
                return jsonify({
                    'success': False,
                    'error': 'Email not registered'
                }), 404
        
        # Generate and store OTP
        otp = generate_otp()
        store_otp(email, otp, purpose=purpose)
        
        # Send OTP email
        success, message = send_otp_email(email, otp, purpose=purpose)
        
        if not success:
            return jsonify({
                'success': False,
                'error': 'Failed to send OTP email'
            }), 500
        
        logger.info(f"OTP sent to {email} for {purpose}")
        
        return jsonify({
            'success': True,
            'message': 'OTP sent successfully to your email'
        }), 200
        
    except Exception as e:
        logger.error(f"Error sending OTP: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': 'Failed to send OTP'
        }), 500


@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp_endpoint():
    """
    Verify OTP code
    
    Request Body:
        {
            "email": "user@example.com",
            "otp": "123456",
            "purpose": "verification" | "login"
        }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400
        
        email = data.get('email', '').strip().lower()
        otp = data.get('otp', '').strip()
        purpose = data.get('purpose', 'verification')
        
        if not email or not otp:
            return jsonify({
                'success': False,
                'error': 'Email and OTP are required'
            }), 400
        
        # Verify OTP
        success, message = verify_otp(email, otp, purpose=purpose)
        
        if not success:
            return jsonify({
                'success': False,
                'error': message
            }), 400
        
        logger.info(f"OTP verified for {email} (purpose: {purpose})")
        
        return jsonify({
            'success': True,
            'message': message
        }), 200
        
    except Exception as e:
        logger.error(f"Error verifying OTP: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': 'OTP verification failed'
        }), 500


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user (requires OTP verification first)
    
    Request Body:
        {
            "name": "User Name",
            "email": "user@example.com",
            "password": "password123",
            "otp": "123456"
        }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        otp = data.get('otp', '').strip()
        
        # Validate required fields
        if not name or not email or not password or not otp:
            return jsonify({
                'success': False,
                'error': 'All fields are required'
            }), 400
        
        # Validate email format
        if not validate_email(email):
            return jsonify({
                'success': False,
                'error': 'Invalid email format'
            }), 400
        
        # Validate password strength
        is_valid, error_message = validate_password_strength(password)
        if not is_valid:
            return jsonify({
                'success': False,
                'error': error_message
            }), 400
        
        # Verify OTP
        otp_success, otp_message = verify_otp(email, otp, purpose='verification')
        if not otp_success:
            return jsonify({
                'success': False,
                'error': otp_message
            }), 400
        
        # Check if email already exists
        existing_user = g.db.query(User).filter_by(email=email).first()
        if existing_user:
            return jsonify({
                'success': False,
                'error': 'Email already registered'
            }), 409
        
        # Hash password
        password_hash = hash_password(password)
        
        # Create new user
        new_user = User(
            name=name,
            email=email,
            password_hash=password_hash,
            is_admin=False
        )
        
        g.db.add(new_user)
        g.db.commit()
        g.db.refresh(new_user)
        
        # Generate tokens
        access_token = create_access_token(new_user.id, new_user.is_admin)
        refresh_token = create_refresh_token(new_user.id)
        
        logger.info(f"New user registered: {email} (ID: {new_user.id})")
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': new_user.to_dict()
        }), 201
        
    except IntegrityError:
        g.db.rollback()
        return jsonify({
            'success': False,
            'error': 'Email already registered'
        }), 409
    except Exception as e:
        g.db.rollback()
        logger.error(f"Registration error: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': 'Registration failed'
        }), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login user with password or OTP
    
    Request Body:
        {
            "email": "user@example.com",
            "password": "password123"  // OR
            "otp": "123456"
        }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        otp = data.get('otp', '').strip()
        
        if not email:
            return jsonify({
                'success': False,
                'error': 'Email is required'
            }), 400
        
        if not password and not otp:
            return jsonify({
                'success': False,
                'error': 'Password or OTP is required'
            }), 400
        
        # Find user by email
        user = g.db.query(User).filter_by(email=email).first()
        
        if not user:
            return jsonify({
                'success': False,
                'error': 'Invalid email or password'
            }), 401
        
        # Verify with password or OTP
        if password:
            if not verify_password(password, user.password_hash):
                return jsonify({
                    'success': False,
                    'error': 'Invalid email or password'
                }), 401
        elif otp:
            otp_success, otp_message = verify_otp(email, otp, purpose='login')
            if not otp_success:
                return jsonify({
                    'success': False,
                    'error': otp_message
                }), 401
        
        # Check if user has expert profile
        expert = g.db.query(Expert).filter_by(user_id=user.id).first()
        expert_id = expert.id if expert else None
        role = 'expert' if expert else None
        
        # Generate tokens
        access_token = create_access_token(user.id, user.is_admin, expert_id=expert_id, role=role)
        refresh_token = create_refresh_token(user.id)
        
        logger.info(f"User logged in: {email} (ID: {user.id})")
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Login error: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': 'Login failed'
        }), 500


@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    """Generate new access token using refresh token"""
    try:
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({
                'success': False,
                'error': 'Authorization header is missing'
            }), 401
        
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({
                'success': False,
                'error': 'Invalid authorization header format'
            }), 401
        
        refresh_token = parts[1]
        
        from utils.jwt_utils import verify_refresh_token
        user_id = verify_refresh_token(refresh_token)
        
        user = g.db.query(User).filter_by(id=user_id).first()
        
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        # Check if user has expert profile
        expert = g.db.query(Expert).filter_by(user_id=user.id).first()
        expert_id = expert.id if expert else None
        role = 'expert' if expert else None

        access_token = create_access_token(user.id, user.is_admin, expert_id=expert_id, role=role)
        
        return jsonify({
            'success': True,
            'message': 'Token refreshed successfully',
            'access_token': access_token
        }), 200
        
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': 'Token refresh failed'
        }), 500


@auth_bp.route('/logout', methods=['POST'])
@verify_token()
def logout():
    """Logout user"""
    try:
        user_id = g.user_id
        logger.info(f"User logged out: ID {user_id}")
        
        return jsonify({
            'success': True,
            'message': 'Logout successful'
        }), 200
        
    except Exception as e:
        logger.error(f"Logout error: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': 'Logout failed'
        }), 500
