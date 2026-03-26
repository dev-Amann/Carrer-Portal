"""
Expert dashboard helper utilities
Extracted from routes/expert_dashboard.py for reusability
"""
from flask import jsonify, g
from models import Expert
from utils.jwt_utils import verify_token
import logging

logger = logging.getLogger(__name__)


def verify_expert():
    """Decorator to verify expert access"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            # First verify token
            verify_token()(lambda: None)()
            
            # Check if expert_id is in token (set by verify_token)
            if not getattr(g, 'expert_id', None):
                db = g.db
                expert = db.query(Expert).filter_by(user_id=g.user_id).first()
            else:
                db = g.db
                expert = db.query(Expert).filter_by(id=g.expert_id).first()
            
            if not expert:
                return jsonify({
                    'success': False,
                    'error': 'Expert profile not found',
                    'code': 'NOT_EXPERT'
                }), 403
            
            # Sanity check: ensure expert belongs to the authenticated user
            if expert.user_id != g.user_id:
                 return jsonify({
                    'success': False,
                    'error': 'Expert profile mismatch',
                    'code': 'INVALID_TOKEN'
                }), 403

            # Store expert in g for use in route
            g.expert = expert
            
            return f(*args, **kwargs)
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator
