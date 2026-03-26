
"""
Feedback routes
Handles creating and retrieving feedback for bookings/experts
"""
from flask import Blueprint, request, jsonify, g
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from models import Feedback, Booking, Expert, User
from utils.jwt_utils import verify_token
import logging

logger = logging.getLogger(__name__)

feedback_bp = Blueprint('feedback', __name__)


@feedback_bp.route('', methods=['POST'])
@verify_token()
def create_feedback():
    """
    Create feedback for a booking
    
    Request body:
        {
            "booking_id": 1,
            "rating": 5,
            "comment": "Great session!"
        }
    """
    try:
        db = g.db
        user_id = g.user_id
        
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'Request body is required', 'code': 'MISSING_DATA'}), 400
            
        required_fields = ['booking_id', 'rating']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'{field} is required', 'code': 'MISSING_FIELD'}), 400
                
        booking_id = data['booking_id']
        rating = int(data['rating'])
        comment = data.get('comment', '')
        
        if not (1 <= rating <= 5):
             return jsonify({'success': False, 'error': 'Rating must be between 1 and 5', 'code': 'INVALID_RATING'}), 400

        # Verify booking exists and belongs to user
        booking = db.query(Booking).filter_by(id=booking_id).first()
        if not booking:
             return jsonify({'success': False, 'error': 'Booking not found', 'code': 'BOOKING_NOT_FOUND'}), 404
             
        if booking.user_id != user_id:
             return jsonify({'success': False, 'error': 'Unauthorized to rate this booking', 'code': 'UNAUTHORIZED'}), 403
             
        # Check if booking is completed (optional, but good practice)
        # if booking.status != 'completed':
        #      return jsonify({'success': False, 'error': 'Cannot rate a booking that is not completed', 'code': 'INVALID_STATUS'}), 400

        # Check if feedback already exists
        existing_feedback = db.query(Feedback).filter_by(booking_id=booking_id).first()
        if existing_feedback:
             return jsonify({'success': False, 'error': 'Feedback already exists for this booking', 'code': 'FEEDBACK_EXISTS'}), 400
             
        feedback = Feedback(
            user_id=user_id,
            booking_id=booking_id,
            rating=rating,
            comment=comment
        )
        
        db.add(feedback)
        db.commit()
        
        logger.info(f"Feedback created for booking {booking_id} by user {user_id}")
        
        return jsonify({
            'success': True,
            'message': 'Feedback submitted successfully',
            'feedback': feedback.to_dict()
        }), 201

    except ValueError:
        return jsonify({'success': False, 'error': 'Invalid rating format', 'code': 'INVALID_FORMAT'}), 400
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Integrity error in create_feedback: {str(e)}")
        return jsonify({'success': False, 'error': 'Database integrity error', 'code': 'INTEGRITY_ERROR'}), 400
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error in create_feedback: {str(e)}")
        return jsonify({'success': False, 'error': 'Database error', 'code': 'DATABASE_ERROR'}), 500
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'success': False, 'error': 'Unexpected error', 'code': 'UNEXPECTED_ERROR'}), 500


@feedback_bp.route('/expert/<int:expert_id>', methods=['GET'])
def get_expert_feedback(expert_id):
    """
    Get all feedback for a specific expert
    """
    try:
        db = g.db
        
        # Verify expert exists
        expert = db.query(Expert).filter_by(id=expert_id).first()
        if not expert:
            return jsonify({'success': False, 'error': 'Expert not found', 'code': 'EXPERT_NOT_FOUND'}), 404
            
        # Join Feedback with Booking to filter by expert_id
        feedbacks = db.query(Feedback).join(Booking).filter(Booking.expert_id == expert_id).order_by(Feedback.created_at.desc()).all()
        
        feedback_list = [f.to_dict(include_relations=True) for f in feedbacks]
        
        # Calculate average rating
        avg_rating = 0
        if feedback_list:
            avg_rating = sum(f['rating'] for f in feedback_list) / len(feedback_list)
            
        return jsonify({
            'success': True,
            'feedbacks': feedback_list,
            'count': len(feedback_list),
            'average_rating': round(avg_rating, 1)
        }), 200

    except SQLAlchemyError as e:
        logger.error(f"Database error in get_expert_feedback: {str(e)}")
        return jsonify({'success': False, 'error': 'Database error', 'code': 'DATABASE_ERROR'}), 500
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'success': False, 'error': 'Unexpected error', 'code': 'UNEXPECTED_ERROR'}), 500


@feedback_bp.route('/booking/<int:booking_id>', methods=['GET'])
@verify_token()
def get_booking_feedback(booking_id):
    """
    Get feedback for a specific booking
    """
    try:
        db = g.db
        user_id = g.user_id
        
        feedback = db.query(Feedback).filter_by(booking_id=booking_id).first()
        
        if not feedback:
            return jsonify({'success': False, 'error': 'Feedback not found', 'code': 'NOT_FOUND'}), 404
            
        # Verify user owns the booking OR is the expert
        booking = db.query(Booking).filter_by(id=booking_id).first()
        if not booking:
             return jsonify({'success': False, 'error': 'Booking not found', 'code': 'BOOKING_NOT_FOUND'}), 404 # Should be caught above logically but good for safety
             
        # Check if user is the booker
        is_booker = booking.user_id == user_id
        
        # Check if user is the expert
        expert = db.query(Expert).filter_by(user_id=user_id).first()
        is_expert = expert and expert.id == booking.expert_id
        
        if not (is_booker or is_expert):
             return jsonify({'success': False, 'error': 'Unauthorized', 'code': 'UNAUTHORIZED'}), 403
             
        return jsonify({
            'success': True,
            'feedback': feedback.to_dict(include_relations=True)
        }), 200

    except SQLAlchemyError as e:
        logger.error(f"Database error in get_booking_feedback: {str(e)}")
        return jsonify({'success': False, 'error': 'Database error', 'code': 'DATABASE_ERROR'}), 500
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'success': False, 'error': 'Unexpected error', 'code': 'UNEXPECTED_ERROR'}), 500
