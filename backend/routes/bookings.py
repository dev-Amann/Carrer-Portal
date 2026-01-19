"""
Booking routes
Handles consultation booking creation and retrieval
"""
from flask import Blueprint, request, jsonify, g
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from datetime import datetime
from models import Booking, Expert, User
from utils.jwt_utils import verify_token
from utils.jitsi_helper import generate_jitsi_room
import logging

logger = logging.getLogger(__name__)

bookings_bp = Blueprint('bookings', __name__)


@bookings_bp.route('/create', methods=['POST'])
@verify_token()
def create_booking():
    """
    Create a new booking for expert consultation
    
    Request body:
        {
            "expert_id": 1,
            "slot_start": "2024-12-01T10:00:00",
            "slot_end": "2024-12-01T11:00:00"
        }
    
    Returns:
        JSON response with booking details including Jitsi room ID
    """
    try:
        db = g.db
        user_id = g.user_id
        
        # Get request data
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required',
                'code': 'MISSING_DATA'
            }), 400
        
        # Validate required fields
        required_fields = ['expert_id', 'slot_start', 'slot_end']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'error': f'{field} is required',
                    'code': 'MISSING_FIELD'
                }), 400
        
        expert_id = data['expert_id']
        
        # Verify expert exists and is approved
        expert = db.query(Expert).filter_by(id=expert_id).first()
        if not expert:
            return jsonify({
                'success': False,
                'error': 'Expert not found',
                'code': 'EXPERT_NOT_FOUND'
            }), 404
        
        if expert.status != 'approved':
            return jsonify({
                'success': False,
                'error': 'Expert is not available for bookings',
                'code': 'EXPERT_NOT_APPROVED'
            }), 400
        
        # Parse datetime strings
        try:
            slot_start = datetime.fromisoformat(data['slot_start'].replace('Z', '+00:00'))
            slot_end = datetime.fromisoformat(data['slot_end'].replace('Z', '+00:00'))
            
            # Remove timezone info to make them naive (since database stores naive datetimes)
            if slot_start.tzinfo is not None:
                slot_start = slot_start.replace(tzinfo=None)
            if slot_end.tzinfo is not None:
                slot_end = slot_end.replace(tzinfo=None)
        except (ValueError, AttributeError) as e:
            return jsonify({
                'success': False,
                'error': 'Invalid datetime format. Use ISO 8601 format (e.g., 2024-12-01T10:00:00)',
                'code': 'INVALID_DATETIME'
            }), 400
        
        # Validate slot_end is after slot_start
        if slot_end <= slot_start:
            return jsonify({
                'success': False,
                'error': 'slot_end must be after slot_start',
                'code': 'INVALID_TIME_RANGE'
            }), 400
        
        # Validate booking is in the future (use naive datetime for comparison)
        if slot_start < datetime.utcnow():
            return jsonify({
                'success': False,
                'error': 'Cannot book slots in the past',
                'code': 'PAST_BOOKING'
            }), 400
        
        # Check for conflicting bookings for the expert
        conflicting_booking = db.query(Booking).filter(
            Booking.expert_id == expert_id,
            Booking.status.in_(['pending', 'confirmed']),
            Booking.slot_start < slot_end,
            Booking.slot_end > slot_start
        ).first()
        
        if conflicting_booking:
            return jsonify({
                'success': False,
                'error': 'Expert is not available for the selected time slot',
                'code': 'SLOT_CONFLICT'
            }), 400
        
        # Generate unique Jitsi room ID
        jitsi_room = generate_jitsi_room()
        
        # Create booking
        booking = Booking(
            user_id=user_id,
            expert_id=expert_id,
            slot_start=slot_start,
            slot_end=slot_end,
            jitsi_room=jitsi_room,
            status='pending'
        )
        
        db.add(booking)
        db.commit()
        
        logger.info(f"Booking created: id={booking.id}, user={user_id}, expert={expert_id}, room={jitsi_room}")
        
        # Return booking details
        booking_data = booking.to_dict(include_relations=True)
        
        return jsonify({
            'success': True,
            'message': 'Booking created successfully',
            'booking_id': booking.id,
            'jitsi_room': jitsi_room,
            'booking': booking_data
        }), 201
        
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Integrity error in create_booking: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to create booking due to data integrity issue',
            'code': 'INTEGRITY_ERROR'
        }), 400
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error in create_booking: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to create booking',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error in create_booking: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500


@bookings_bp.route('/user', methods=['GET'])
@verify_token()
def get_user_bookings():
    """
    Get all bookings for the authenticated user
    
    Query parameters:
        status (optional): Filter by booking status (pending, confirmed, completed, cancelled)
    
    Returns:
        JSON response with list of user bookings
    """
    try:
        db = g.db
        user_id = g.user_id
        
        # Get status filter from query parameters
        status_filter = request.args.get('status')
        
        # Build query
        query = db.query(Booking).filter_by(user_id=user_id)
        
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
        
        # Order by slot_start descending (most recent first)
        bookings = query.order_by(Booking.slot_start.desc()).all()
        
        # Build response with booking details
        bookings_list = []
        for booking in bookings:
            booking_data = booking.to_dict(include_relations=True)
            bookings_list.append(booking_data)
        
        logger.info(f"Retrieved {len(bookings_list)} bookings for user {user_id}")
        
        return jsonify({
            'success': True,
            'bookings': bookings_list,
            'count': len(bookings_list)
        }), 200
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_user_bookings: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve bookings',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error in get_user_bookings: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500
