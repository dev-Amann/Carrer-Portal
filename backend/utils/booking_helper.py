from datetime import datetime
from models import Booking
import logging

logger = logging.getLogger(__name__)

def update_booking_statuses(db, user_id=None, expert_id=None):
    """
    Updates the status of past confirmed bookings to 'completed'.
    
    Args:
        db: SQLAlchemy database session
        user_id (int, optional): ID of the user to update bookings for
        expert_id (int, optional): ID of the expert to update bookings for
    """
    try:
        now = datetime.utcnow()
        
        # Base query for confirmed bookings that have ended
        query = db.query(Booking).filter(
            Booking.status == 'confirmed',
            Booking.slot_end < now
        )
        
        # Apply filters if provided
        if user_id:
            query = query.filter(Booking.user_id == user_id)
        if expert_id:
            query = query.filter(Booking.expert_id == expert_id)
            
        past_bookings = query.all()
        
        if past_bookings:
            count = 0
            for booking in past_bookings:
                booking.status = 'completed'
                count += 1
            
            db.commit()
            logger.info(f"Automatically marked {count} bookings as completed (User: {user_id}, Expert: {expert_id})")
            
    except Exception as e:
        logger.error(f"Error in update_booking_statuses: {str(e)}")
        # Don't raise, just log
