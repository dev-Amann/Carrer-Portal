"""
Transaction model
Represents payment transactions for bookings
"""
from sqlalchemy import Column, Integer, String, Numeric, Enum, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from . import Base

class Transaction(Base):
    """Transaction model for payment processing via Razorpay"""
    
    __tablename__ = 'transactions'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    booking_id = Column(Integer, ForeignKey('bookings.id', ondelete='CASCADE'), nullable=False)
    razorpay_order_id = Column(String(255), nullable=False, index=True)
    razorpay_payment_id = Column(String(255))
    razorpay_signature = Column(String(255))
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(10), default='INR', nullable=False)
    status = Column(
        Enum('created', 'completed', 'failed', name='transaction_status'),
        default='created',
        nullable=False
    )
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    # Relationships
    booking = relationship('Booking', back_populates='transaction')
    
    def to_dict(self, include_booking=False):
        """Convert transaction to dictionary representation"""
        data = {
            'id': self.id,
            'booking_id': self.booking_id,
            'razorpay_order_id': self.razorpay_order_id,
            'razorpay_payment_id': self.razorpay_payment_id,
            'amount': float(self.amount) if self.amount else None,
            'currency': self.currency,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_booking and self.booking:
            data['booking'] = self.booking.to_dict()
        
        return data

    def __repr__(self):
        return f"<Transaction(id={self.id}, booking_id={self.booking_id}, status='{self.status}')>"
