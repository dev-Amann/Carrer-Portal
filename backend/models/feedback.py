"""
Feedback model
Represents user feedback and ratings for bookings
"""
from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from . import Base


class Feedback(Base):
    """Feedback model for user ratings and comments"""
    
    __tablename__ = 'feedbacks'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    booking_id = Column(Integer, ForeignKey('bookings.id', ondelete='SET NULL'))
    rating = Column(Integer, CheckConstraint('rating >= 1 AND rating <= 5'))
    comment = Column(Text)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    # Relationships
    user = relationship('User', back_populates='feedbacks')
    booking = relationship('Booking', back_populates='feedbacks')
    
    def to_dict(self, include_relations=False):
        """Convert feedback to dictionary representation"""
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'booking_id': self.booking_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_relations:
            if self.user:
                data['user_name'] = self.user.name
            if self.booking:
                data['booking_info'] = {
                    'id': self.booking.id,
                    'status': self.booking.status
                }
        
        return data
    
    def __repr__(self):
        return f"<Feedback(id={self.id}, user_id={self.user_id}, rating={self.rating})>"
