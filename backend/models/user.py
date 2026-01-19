"""
User model
Represents users in the system
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from . import Base


class User(Base):
    """User model for authentication and profile management"""
    
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    # Relationships
    user_skills = relationship('UserSkill', back_populates='user', cascade='all, delete-orphan')
    saved_careers = relationship('SavedCareer', back_populates='user', cascade='all, delete-orphan')
    expert_profile = relationship('Expert', back_populates='user', uselist=False, cascade='all, delete-orphan')
    bookings = relationship('Booking', back_populates='user', cascade='all, delete-orphan')
    feedbacks = relationship('Feedback', back_populates='user', cascade='all, delete-orphan')
    
    def to_dict(self, include_sensitive=False):
        """Convert user to dictionary representation"""
        data = {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_sensitive:
            data['password_hash'] = self.password_hash
        
        return data
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', name='{self.name}')>"
