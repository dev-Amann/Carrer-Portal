"""
Booking model
Represents consultation bookings between users and experts
"""
from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from . import Base


class Booking(Base):
    """Booking model for expert consultation sessions"""
    
    __tablename__ = 'bookings'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    expert_id = Column(Integer, ForeignKey('experts.id', ondelete='CASCADE'), nullable=False, index=True)
    slot_start = Column(DateTime, nullable=False)
    slot_end = Column(DateTime, nullable=False)
    jitsi_room = Column(String(255), nullable=False)
    status = Column(
        Enum('pending', 'confirmed', 'completed', 'cancelled', name='booking_status'),
        default='pending',
        nullable=False
    )
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    # Relationships
    user = relationship('User', back_populates='bookings')
    expert = relationship('Expert', back_populates='bookings')
    transaction = relationship('Transaction', back_populates='booking', uselist=False, cascade='all, delete-orphan')
    feedbacks = relationship('Feedback', back_populates='booking', cascade='all, delete-orphan')
    
    def to_dict(self, include_relations=False):
        """Convert booking to dictionary representation"""
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'expert_id': self.expert_id,
            'slot_start': self.slot_start.isoformat() if self.slot_start else None,
            'slot_end': self.slot_end.isoformat() if self.slot_end else None,
            'jitsi_room': self.jitsi_room,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_relations:
            if self.user:
                data['user'] = {
                    'name': self.user.name,
                    'email': self.user.email
                }
            if self.expert and self.expert.user:
                data['expert'] = {
                    'name': self.expert.user.name,
                    'bio': self.expert.bio,
                    'rate_per_hour': float(self.expert.rate_per_hour) if self.expert.rate_per_hour else None,
                    'specialization': self.expert.specialization,
                    'years_of_experience': self.expert.years_of_experience
                }
            
            # Include feedback if available
            if self.feedbacks:
                # We assume one feedback per user per booking for now, or just take the most recent
                # Since feedbacks is a list, we check if it's not empty
                data['has_feedback'] = True
                data['feedback'] = self.feedbacks[0].to_dict()
            else:
                data['has_feedback'] = False
        
        return data
    
    def __repr__(self):
        return f"<Booking(id={self.id}, user_id={self.user_id}, expert_id={self.expert_id}, status='{self.status}')>"
