"""
JWT utilities for token generation and validation
Provides functions for creating and verifying JWT tokens
"""
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, g, current_app
import logging

logger = logging.getLogger(__name__)


def create_access_token(user_id, is_admin=False, expert_id=None, role=None):
    """
    Create a JWT access token for a user
    
    Args:
        user_id (int): The user's ID
        is_admin (bool): Whether the user is an admin
        expert_id (int, optional): The expert's ID if user is an expert
        role (str, optional): User role (e.g. 'expert')
    
    Returns:
        str: The encoded JWT access token
    """
    try:
        payload = {
            'user_id': user_id,
            'is_admin': is_admin,
            'type': 'access',
            'exp': datetime.utcnow() + timedelta(seconds=current_app.config['JWT_ACCESS_TOKEN_EXPIRES']),
            'iat': datetime.utcnow()
        }

        if expert_id:
            payload['expert_id'] = expert_id
        if role:
            payload['role'] = role
        
        
        token = jwt.encode(
            payload,
            current_app.config['JWT_SECRET_KEY'],
            algorithm='HS256'
        )
        
        return token
    except Exception as e:
        logger.error(f"Error creating access token: {str(e)}")
        raise


def create_refresh_token(user_id):
    """
    Create a JWT refresh token for a user
    
    Args:
        user_id (int): The user's ID
    
    Returns:
        str: The encoded JWT refresh token
    """
    try:
        payload = {
            'user_id': user_id,
            'type': 'refresh',
            'exp': datetime.utcnow() + timedelta(seconds=current_app.config['JWT_REFRESH_TOKEN_EXPIRES']),
            'iat': datetime.utcnow()
        }
        
        token = jwt.encode(
            payload,
            current_app.config['JWT_SECRET_KEY'],
            algorithm='HS256'
        )
        
        return token
    except Exception as e:
        logger.error(f"Error creating refresh token: {str(e)}")
        raise


def decode_token(token):
    """
    Decode and validate a JWT token
    
    Args:
        token (str): The JWT token to decode
    
    Returns:
        dict: The decoded token payload
    
    Raises:
        jwt.ExpiredSignatureError: If the token has expired
        jwt.InvalidTokenError: If the token is invalid
    """
    try:
        payload = jwt.decode(
            token,
            current_app.config['JWT_SECRET_KEY'],
            algorithms=['HS256']
        )
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("Token has expired")
        raise
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid token: {str(e)}")
        raise


def verify_token(required_admin=False):
    """
    Decorator to verify JWT token and protect routes
    
    Args:
        required_admin (bool): Whether admin privileges are required
    
    Returns:
        function: The decorated function
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Get token from Authorization header
            auth_header = request.headers.get('Authorization')
            
            if not auth_header:
                return jsonify({
                    'success': False,
                    'error': 'Authorization header is missing',
                    'code': 'MISSING_TOKEN'
                }), 401
            
            # Extract token from "Bearer <token>" format
            parts = auth_header.split()
            if len(parts) != 2 or parts[0].lower() != 'bearer':
                return jsonify({
                    'success': False,
                    'error': 'Invalid authorization header format. Expected: Bearer <token>',
                    'code': 'INVALID_HEADER'
                }), 401
            
            token = parts[1]
            
            try:
                # Decode and validate token
                payload = decode_token(token)
                
                # Check token type
                if payload.get('type') != 'access':
                    return jsonify({
                        'success': False,
                        'error': 'Invalid token type. Access token required',
                        'code': 'INVALID_TOKEN_TYPE'
                    }), 401
                
                # Check admin requirement
                if required_admin and not payload.get('is_admin', False):
                    return jsonify({
                        'success': False,
                        'error': 'Admin privileges required',
                        'code': 'INSUFFICIENT_PRIVILEGES'
                    }), 403
                
                # Store user info in Flask's g object for access in route
                g.user_id = payload.get('user_id')
                g.is_admin = payload.get('is_admin', False)
                g.expert_id = payload.get('expert_id')
                g.role = payload.get('role')
                
                return f(*args, **kwargs)
                
            except jwt.ExpiredSignatureError:
                return jsonify({
                    'success': False,
                    'error': 'Token has expired',
                    'code': 'TOKEN_EXPIRED'
                }), 401
            except jwt.InvalidTokenError:
                return jsonify({
                    'success': False,
                    'error': 'Invalid token',
                    'code': 'INVALID_TOKEN'
                }), 401
            except Exception as e:
                logger.error(f"Error verifying token: {str(e)}")
                return jsonify({
                    'success': False,
                    'error': 'Token verification failed',
                    'code': 'VERIFICATION_FAILED'
                }), 401
        
        return decorated_function
    return decorator


def verify_refresh_token(token):
    """
    Verify a refresh token and return the user_id
    
    Args:
        token (str): The refresh token to verify
    
    Returns:
        int: The user_id from the token
    
    Raises:
        jwt.ExpiredSignatureError: If the token has expired
        jwt.InvalidTokenError: If the token is invalid
        ValueError: If the token type is not 'refresh'
    """
    try:
        payload = decode_token(token)
        
        # Check token type
        if payload.get('type') != 'refresh':
            raise ValueError('Invalid token type. Refresh token required')
        
        return payload.get('user_id')
        
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError) as e:
        logger.warning(f"Refresh token verification failed: {str(e)}")
        raise
