"""
Database models package
Exports all SQLAlchemy models for the CarrerPortal application
"""
from sqlalchemy.ext.declarative import declarative_base

# Create base class for all models
Base = declarative_base()

# Import all models
from .user import User
from .skill import Skill, UserSkill
from .career import Career, CareerSkill, SavedCareer
from .expert import Expert
from .booking import Booking
from .transaction import Transaction
from .learning_resource import LearningResource
from .feedback import Feedback

__all__ = [
    'Base',
    'User',
    'Skill',
    'UserSkill',
    'Career',
    'CareerSkill',
    'SavedCareer',
    'Expert',
    'Booking',
    'Transaction',
    'LearningResource',
    'Feedback'
]
