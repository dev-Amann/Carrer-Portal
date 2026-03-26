"""
Admin route helper utilities
Extracted from routes/admin.py for reusability and file size reduction
"""
from flask import jsonify, g
from models import User, Booking
from utils.jwt_utils import verify_token
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


def _update_all_completed_bookings():
    """
    Helper function to automatically mark ALL past confirmed bookings as completed
    """
    try:
        db = g.db
        now = datetime.utcnow()
        
        # Find all confirmed bookings that have ended
        past_bookings = db.query(Booking).filter(
            Booking.status == 'confirmed',
            Booking.slot_end < now
        ).all()
        
        if past_bookings:
            count = 0
            for booking in past_bookings:
                booking.status = 'completed'
                count += 1
            
            db.commit()
            logger.info(f"Admin auto-completed {count} past bookings")
            
    except Exception as e:
        logger.error(f"Error in _update_all_completed_bookings: {str(e)}")
        # Don't fail the request if this background task fails
        pass


def verify_admin():
    """Decorator to verify admin access"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            # First verify token
            verify_token()(lambda: None)()
            
            # Check if user is admin
            db = g.db
            user = db.query(User).filter_by(id=g.user_id).first()
            
            if not user or not user.is_admin:
                return jsonify({
                    'success': False,
                    'error': 'Admin access required',
                    'code': 'FORBIDDEN'
                }), 403
            
            return f(*args, **kwargs)
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator
