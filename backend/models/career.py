"""
Career models
Represents careers, career-skill relationships, and saved careers
"""
from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from . import Base


class Career(Base):
    """Career model for career paths in the system"""
    
    __tablename__ = 'careers'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    salary_range = Column(String(100))
    demand_level = Column(
        Enum('low', 'medium', 'high', 'very_high', name='demand_level'),
        nullable=False
    )
    roadmap = Column(Text)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    # Relationships
    career_skills = relationship('CareerSkill', back_populates='career', cascade='all, delete-orphan')
    saved_by_users = relationship('SavedCareer', back_populates='career', cascade='all, delete-orphan')
    learning_resources = relationship('LearningResource', back_populates='career', cascade='all, delete-orphan')
    
    def to_dict(self, include_skills=False):
        """Convert career to dictionary representation"""
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'salary_range': self.salary_range,
            'demand_level': self.demand_level,
            'roadmap': self.roadmap,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_skills:
            data['required_skills'] = [cs.to_dict() for cs in self.career_skills]
        
        return data
    
    def __repr__(self):
        return f"<Career(id={self.id}, title='{self.title}', demand_level='{self.demand_level}')>"


class CareerSkill(Base):
    """Junction table for career-skill relationships with required levels"""
    
    __tablename__ = 'career_skills'
    
    career_id = Column(Integer, ForeignKey('careers.id', ondelete='CASCADE'), primary_key=True)
    skill_id = Column(Integer, ForeignKey('skills.id', ondelete='CASCADE'), primary_key=True)
    required_level = Column(
        Enum('beginner', 'intermediate', 'advanced', 'expert', name='required_level'),
        nullable=False
    )
    
    # Relationships
    career = relationship('Career', back_populates='career_skills')
    skill = relationship('Skill', back_populates='career_skills')
    
    def to_dict(self):
        """Convert career skill to dictionary representation"""
        return {
            'career_id': self.career_id,
            'skill_id': self.skill_id,
            'skill_name': self.skill.name if self.skill else None,
            'category': self.skill.category if self.skill else None,
            'required_level': self.required_level
        }
    
    def __repr__(self):
        return f"<CareerSkill(career_id={self.career_id}, skill_id={self.skill_id}, required_level='{self.required_level}')>"


class SavedCareer(Base):
    """Junction table for users saving careers to their profile"""
    
    __tablename__ = 'saved_careers'
    
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    career_id = Column(Integer, ForeignKey('careers.id', ondelete='CASCADE'), primary_key=True)
    saved_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    # Relationships
    user = relationship('User', back_populates='saved_careers')
    career = relationship('Career', back_populates='saved_by_users')
    
    def to_dict(self):
        """Convert saved career to dictionary representation"""
        return {
            'user_id': self.user_id,
            'career_id': self.career_id,
            'career_title': self.career.title if self.career else None,
            'saved_at': self.saved_at.isoformat() if self.saved_at else None
        }
    
    def __repr__(self):
        return f"<SavedCareer(user_id={self.user_id}, career_id={self.career_id})>"
