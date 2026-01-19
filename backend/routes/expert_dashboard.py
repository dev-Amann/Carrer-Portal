"""
Expert Dashboard routes
Handles expert-specific operations like viewing bookings and earnings
"""
from flask import Blueprint, request, jsonify, g
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
from datetime import datetime
from models import Expert, Booking, Transaction
from utils.jwt_utils import verify_token
import logging

logger = logging.getLogger(__name__)

expert_dashboard_bp = Blueprint('expert_dashboard', __name__)



def verify_expert():
    """Decorator to verify expert access"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            # First verify token
            verify_token()(lambda: None)()
            
            # Check if expert_id is in token (set by verify_token)
            if not getattr(g, 'expert_id', None):
                # Fallback: Check if user has an expert profile via user_id
                # This handles cases where token might be old or logic needs fallback
                # But user preferred using expert_id. 
                # If we want to force re-login for better security/performance:
                # return jsonify({'success': False, 'error': 'Expert access required. Please login again.'}), 403
                
                # Let's support both for now, but prioritize expert_id
                db = g.db
                expert = db.query(Expert).filter_by(user_id=g.user_id).first()
            else:
                # Use expert_id from token
                db = g.db
                expert = db.query(Expert).filter_by(id=g.expert_id).first()
            
            if not expert:
                return jsonify({
                    'success': False,
                    'error': 'Expert profile not found',
                    'code': 'NOT_EXPERT'
                }), 403
            
            # Additional check: If verifying by ID, ensure it matches the user (sanity check)
            if expert.user_id != g.user_id:
                 return jsonify({
                    'success': False,
                    'error': 'Expert profile mismatch',
                    'code': 'INVALID_TOKEN'
                }), 403

            # Store expert in g for use in route
            g.expert = expert
            
            return f(*args, **kwargs)
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator



@expert_dashboard_bp.route('/bookings', methods=['GET'])
@verify_token()
@verify_expert()
def get_expert_bookings():
    """
    Get all bookings for the authenticated expert
    
    Query parameters:
        status (optional): Filter by booking status
        upcoming (optional): If 'true', only return upcoming bookings
    
    Returns:
        JSON response with list of expert bookings
    """
    try:
        db = g.db
        expert = g.expert
        
        # Get query parameters
        status_filter = request.args.get('status')
        upcoming_only = request.args.get('upcoming', '').lower() == 'true'
        
        # Build query
        query = db.query(Booking).filter_by(expert_id=expert.id)
        
        # Apply status filter if provided
        if status_filter:
            valid_statuses = ['pending', 'confirmed', 'completed', 'cancelled']
            if status_filter not in valid_statuses:
                return jsonify({
                    'success': False,
                    'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}',
                    'code': 'INVALID_STATUS'
                }), 400
            query = query.filter_by(status=status_filter)
        
        # Filter for upcoming bookings if requested
        if upcoming_only:
            query = query.filter(Booking.slot_start >= datetime.utcnow())
        
        # Order by slot_start ascending (soonest first)
        bookings = query.order_by(Booking.slot_start.asc()).all()
        
        # Build response with booking details
        bookings_list = []
        for booking in bookings:
            booking_data = booking.to_dict()
            
            # Add user information
            if booking.user:
                booking_data['user'] = {
                    'id': booking.user.id,
                    'name': booking.user.name,
                    'email': booking.user.email
                }
            
            # Add transaction information
            transaction = db.query(Transaction).filter_by(booking_id=booking.id).first()
            if transaction:
                booking_data['payment'] = {
                    'amount': float(transaction.amount),
                    'status': transaction.status,
                    'razorpay_payment_id': transaction.razorpay_payment_id
                }
            
            bookings_list.append(booking_data)
        
        logger.info(f"Retrieved {len(bookings_list)} bookings for expert {expert.id}")
        
        return jsonify({
            'success': True,
            'bookings': bookings_list,
            'count': len(bookings_list)
        }), 200
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_expert_bookings: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve bookings',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error in get_expert_bookings: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500


@expert_dashboard_bp.route('/earnings', methods=['GET'])
@verify_token()
@verify_expert()
def get_expert_earnings():
    """
    Get earnings summary for the authenticated expert
    
    Returns:
        JSON response with earnings statistics
    """
    try:
        db = g.db
        expert = g.expert
        
        # Get all completed bookings for this expert
        completed_bookings = db.query(Booking).filter_by(
            expert_id=expert.id,
            status='completed'
        ).all()
        
        # Calculate total earnings from completed transactions
        total_earnings = 0
        completed_transactions = 0
        pending_earnings = 0
        
        for booking in completed_bookings:
            transaction = db.query(Transaction).filter_by(booking_id=booking.id).first()
            if transaction:
                if transaction.status == 'completed':
                    total_earnings += float(transaction.amount)
                    completed_transactions += 1
                elif transaction.status == 'created':
                    pending_earnings += float(transaction.amount)
        
        # Get total number of bookings
        total_bookings = db.query(func.count(Booking.id)).filter_by(expert_id=expert.id).scalar()
        
        # Get upcoming bookings count
        upcoming_bookings = db.query(func.count(Booking.id)).filter(
            Booking.expert_id == expert.id,
            Booking.slot_start >= datetime.utcnow(),
            Booking.status.in_(['pending', 'confirmed'])
        ).scalar()
        
        earnings_data = {
            'total_earnings': total_earnings,
            'pending_earnings': pending_earnings,
            'completed_transactions': completed_transactions,
            'total_bookings': total_bookings,
            'upcoming_bookings': upcoming_bookings,
            'rate_per_hour': float(expert.rate_per_hour),
            'currency': 'INR'
        }
        
        logger.info(f"Retrieved earnings for expert {expert.id}")
        
        return jsonify({
            'success': True,
            'earnings': earnings_data
        }), 200
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_expert_earnings: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve earnings',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error in get_expert_earnings: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500


@expert_dashboard_bp.route('/profile', methods=['GET'])
@verify_token()
@verify_expert()
def get_expert_profile():
    """
    Get expert profile information
    
    Returns:
        JSON response with expert profile
    """
    try:
        expert = g.expert
        
        expert_data = expert.to_dict(include_user=True)
        
        logger.info(f"Retrieved profile for expert {expert.id}")
        
        return jsonify({
            'success': True,
            'expert': expert_data
        }), 200
        
    except Exception as e:
        logger.error(f"Unexpected error in get_expert_profile: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500


@expert_dashboard_bp.route('/profile', methods=['PUT'])
@verify_token()
@verify_expert()
def update_expert_profile():
    """
    Update expert profile (bio and rate_per_hour only)
    
    Request Body:
        {
            "bio": "Updated bio text",
            "rate_per_hour": 1500.00
        }
    
    Returns:
        JSON response with updated profile
    """
    try:
        db = g.db
        expert = g.expert
        
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400
        
        # Update bio if provided
        if 'bio' in data:
            bio = data['bio'].strip()
            if not bio:
                return jsonify({
                    'success': False,
                    'error': 'Bio cannot be empty'
                }), 400
            if len(bio) > 1000:
                return jsonify({
                    'success': False,
                    'error': 'Bio must be less than 1000 characters'
                }), 400
            expert.bio = bio
        
        # Update rate_per_hour if provided
        if 'rate_per_hour' in data:
            try:
                rate = float(data['rate_per_hour'])
                if rate <= 0:
                    return jsonify({
                        'success': False,
                        'error': 'Hourly rate must be greater than 0'
                    }), 400
                if rate > 100000:
                    return jsonify({
                        'success': False,
                        'error': 'Hourly rate must be less than 100,000'
                    }), 400
                expert.rate_per_hour = rate
            except (ValueError, TypeError):
                return jsonify({
                    'success': False,
                    'error': 'Invalid hourly rate format'
                }), 400
        
        # Commit changes
        db.commit()
        db.refresh(expert)
        
        logger.info(f"Expert profile updated: {expert.id}")
        
        # Return updated profile
        from models import User
        user = db.query(User).filter_by(id=expert.user_id).first()
        
        profile_data = {
            'id': expert.id,
            'user_id': expert.user_id,
            'name': user.name if user else None,
            'email': user.email if user else None,
            'bio': expert.bio,
            'rate_per_hour': float(expert.rate_per_hour),
            'status': expert.status,
            'resume_url': expert.resume_url,
            'certificate_urls': expert.certificate_urls,
            'created_at': expert.created_at.isoformat() if expert.created_at else None
        }
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'expert': profile_data
        }), 200
        
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error in update_expert_profile: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to update profile',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error in update_expert_profile: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500
