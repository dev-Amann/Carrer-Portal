"""
Learning Resource model
Represents educational resources associated with careers
"""
from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from . import Base


class LearningResource(Base):
    """Learning resource model for career-related educational content"""
    
    __tablename__ = 'learning_resources'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    career_id = Column(Integer, ForeignKey('careers.id', ondelete='CASCADE'), nullable=False)
    title = Column(String(255), nullable=False)
    url = Column(String(500), nullable=False)
    resource_type = Column(
        Enum('course', 'article', 'video', 'book', name='resource_type'),
        nullable=False
    )
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    # Relationships
    career = relationship('Career', back_populates='learning_resources')
    
    def to_dict(self, include_career=False):
        """Convert learning resource to dictionary representation"""
        data = {
            'id': self.id,
            'career_id': self.career_id,
            'title': self.title,
            'url': self.url,
            'resource_type': self.resource_type,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_career and self.career:
            data['career_title'] = self.career.title
        
        return data
    
    def __repr__(self):
        return f"<LearningResource(id={self.id}, title='{self.title}', type='{self.resource_type}')>"
