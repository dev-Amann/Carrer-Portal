"""
Skill models
Represents skills and user-skill relationships
"""
from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from . import Base


class Skill(Base):
    """Skill model for available skills in the system"""
    
    __tablename__ = 'skills'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    
    # Relationships
    user_skills = relationship('UserSkill', back_populates='skill', cascade='all, delete-orphan')
    career_skills = relationship('CareerSkill', back_populates='skill', cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert skill to dictionary representation"""
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category
        }
    
    def __repr__(self):
        return f"<Skill(id={self.id}, name='{self.name}', category='{self.category}')>"


class UserSkill(Base):
    """Junction table for user-skill relationships with proficiency levels"""
    
    __tablename__ = 'user_skills'
    
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    skill_id = Column(Integer, ForeignKey('skills.id', ondelete='CASCADE'), primary_key=True)
    proficiency = Column(
        Enum('beginner', 'intermediate', 'advanced', 'expert', name='proficiency_level'),
        nullable=False
    )
    
    # Relationships
    user = relationship('User', back_populates='user_skills')
    skill = relationship('Skill', back_populates='user_skills')
    
    def to_dict(self):
        """Convert user skill to dictionary representation"""
        return {
            'user_id': self.user_id,
            'skill_id': self.skill_id,
            'skill_name': self.skill.name if self.skill else None,
            'proficiency': self.proficiency
        }
    
    def __repr__(self):
        return f"<UserSkill(user_id={self.user_id}, skill_id={self.skill_id}, proficiency='{self.proficiency}')>"
