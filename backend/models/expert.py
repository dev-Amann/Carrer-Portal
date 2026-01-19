"""
Expert model
Represents expert profiles for consultation services
"""
from sqlalchemy import Column, Integer, String, Text, Numeric, Enum, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from . import Base


class Expert(Base):
    """Expert model for professionals offering consultation services"""
    
    __tablename__ = 'experts'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    bio = Column(Text, nullable=False)
    resume_url = Column(String(500))
    certificate_urls = Column(JSON)  # Store as JSON array
    rate_per_hour = Column(Numeric(10, 2), nullable=False)
    status = Column(
        Enum('pending', 'approved', 'rejected', name='expert_status'),
        default='pending',
        nullable=False
    )
    # Additional fields for expert registration
    linkedin_url = Column(String(500))
    github_url = Column(String(500))
    portfolio_url = Column(String(500))
    other_documents = Column(JSON)  # Store as JSON array
    specialization = Column(String(255))
    years_of_experience = Column(Integer)
    email_for_communication = Column(String(255))
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    # Relationships
    user = relationship('User', back_populates='expert_profile')
    bookings = relationship('Booking', back_populates='expert', cascade='all, delete-orphan')
    
    def to_dict(self, include_user=False):
        """Convert expert to dictionary representation"""
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'bio': self.bio,
            'resume_url': self.resume_url,
            'certificate_urls': self.certificate_urls,
            'rate_per_hour': float(self.rate_per_hour) if self.rate_per_hour else None,
            'status': self.status,
            'linkedin_url': self.linkedin_url,
            'github_url': self.github_url,
            'portfolio_url': self.portfolio_url,
            'other_documents': self.other_documents,
            'specialization': self.specialization,
            'years_of_experience': self.years_of_experience,
            'email_for_communication': self.email_for_communication,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_user and self.user:
            data['user'] = {
                'name': self.user.name,
                'email': self.user.email
            }
        
        return data
    
    def __repr__(self):
        return f"<Expert(id={self.id}, user_id={self.user_id}, status='{self.status}')>"
