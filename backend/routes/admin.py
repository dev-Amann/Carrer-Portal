"""
Admin routes
Handles admin-specific operations like user management, expert approval, and statistics
"""
from flask import Blueprint, request, jsonify, g
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func, case
from models import User, Expert, Booking, Transaction
from utils.jwt_utils import verify_token
import logging

logger = logging.getLogger(__name__)

admin_bp = Blueprint('admin', __name__)


def verify_admin():
    """Decorator to verify admin access"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            # First verify token
            verify_token()(lambda: None)()
            
            # Check if user is admin
            db = g.db
            user = db.query(User).filter_by(id=g.user_id).first()
            
            if not user or not user.is_admin:
                return jsonify({
                    'success': False,
                    'error': 'Admin access required',
                    'code': 'FORBIDDEN'
                }), 403
            
            return f(*args, **kwargs)
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator


@admin_bp.route('/stats', methods=['GET'])
@verify_token()
@verify_admin()
def get_admin_stats():
    """
    Get admin dashboard statistics
    
    Returns:
        JSON response with various statistics
    """
    try:
        db = g.db
        
        # Total users count
        total_users = db.query(func.count(User.id)).scalar()
        
        # Total experts count by status
        total_experts = db.query(func.count(Expert.id)).scalar()
        pending_experts = db.query(func.count(Expert.id)).filter_by(status='pending').scalar()
        approved_experts = db.query(func.count(Expert.id)).filter_by(status='approved').scalar()
        rejected_experts = db.query(func.count(Expert.id)).filter_by(status='rejected').scalar()
        
        # Total bookings count by status
        total_bookings = db.query(func.count(Booking.id)).scalar()
        pending_bookings = db.query(func.count(Booking.id)).filter_by(status='pending').scalar()
        confirmed_bookings = db.query(func.count(Booking.id)).filter_by(status='confirmed').scalar()
        completed_bookings = db.query(func.count(Booking.id)).filter_by(status='completed').scalar()
        cancelled_bookings = db.query(func.count(Booking.id)).filter_by(status='cancelled').scalar()
        
        # Total revenue (completed transactions)
        total_revenue = db.query(func.sum(Transaction.amount)).filter_by(status='completed').scalar() or 0
        
        # Transaction statistics
        total_transactions = db.query(func.count(Transaction.id)).scalar()
        completed_transactions = db.query(func.count(Transaction.id)).filter_by(status='completed').scalar()
        failed_transactions = db.query(func.count(Transaction.id)).filter_by(status='failed').scalar()
        
        stats = {
            'users': {
                'total': total_users
            },
            'experts': {
                'total': total_experts,
                'pending': pending_experts,
                'approved': approved_experts,
                'rejected': rejected_experts
            },
            'bookings': {
                'total': total_bookings,
                'pending': pending_bookings,
                'confirmed': confirmed_bookings,
                'completed': completed_bookings,
                'cancelled': cancelled_bookings
            },
            'revenue': {
                'total': float(total_revenue),
                'currency': 'INR'
            },
            'transactions': {
                'total': total_transactions,
                'completed': completed_transactions,
                'failed': failed_transactions
            }
        }
        
        logger.info(f"Admin stats retrieved by user {g.user_id}")
        
        return jsonify({
            'success': True,
            'stats': stats
        }), 200
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_admin_stats: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve statistics',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error in get_admin_stats: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500


@admin_bp.route('/users', methods=['GET'])
@verify_token()
@verify_admin()
def get_all_users():
    """
    Get all users with their booking and payment information
    
    Returns:
        JSON response with list of users
    """
    try:
        db = g.db
        
        # Get all users
        users = db.query(User).all()
        
        users_list = []
        for user in users:
            user_data = user.to_dict()
            
            # Get user's bookings with expert and payment info
            bookings = db.query(Booking).filter_by(user_id=user.id).all()
            bookings_data = []
            
            for booking in bookings:
                booking_info = booking.to_dict()
                
                # Get expert info
                if booking.expert:
                    booking_info['expert'] = {
                        'id': booking.expert.id,
                        'name': booking.expert.user.name if booking.expert.user else None,
                        'rate_per_hour': float(booking.expert.rate_per_hour)
                    }
                
                # Get transaction info
                transaction = db.query(Transaction).filter_by(booking_id=booking.id).first()
                if transaction:
                    booking_info['payment'] = {
                        'amount': float(transaction.amount),
                        'status': transaction.status,
                        'razorpay_payment_id': transaction.razorpay_payment_id
                    }
                
                bookings_data.append(booking_info)
            
            user_data['bookings'] = bookings_data
            user_data['total_bookings'] = len(bookings_data)
            
            users_list.append(user_data)
        
        logger.info(f"Retrieved {len(users_list)} users for admin {g.user_id}")
        
        return jsonify({
            'success': True,
            'users': users_list,
            'count': len(users_list)
        }), 200
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_all_users: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve users',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error in get_all_users: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500


@admin_bp.route('/experts/pending', methods=['GET'])
@verify_token()
@verify_admin()
def get_pending_experts():
    """
    Get all pending expert approvals
    
    Returns:
        JSON response with list of pending experts
    """
    try:
        db = g.db
        
        # Get pending experts
        experts = db.query(Expert).filter_by(status='pending').all()
        
        experts_list = []
        for expert in experts:
            expert_data = expert.to_dict(include_user=True)
            experts_list.append(expert_data)
        
        logger.info(f"Retrieved {len(experts_list)} pending experts for admin {g.user_id}")
        
        return jsonify({
            'success': True,
            'experts': experts_list,
            'count': len(experts_list)
        }), 200
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_pending_experts: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve pending experts',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error in get_pending_experts: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500


@admin_bp.route('/experts/<int:expert_id>/approve', methods=['POST'])
@verify_token()
@verify_admin()
def approve_expert(expert_id):
    """
    Approve an expert application
    
    Args:
        expert_id: ID of the expert to approve
    
    Returns:
        JSON response with success status
    """
    try:
        db = g.db
        
        # Get expert
        expert = db.query(Expert).filter_by(id=expert_id).first()
        
        if not expert:
            return jsonify({
                'success': False,
                'error': 'Expert not found',
                'code': 'EXPERT_NOT_FOUND'
            }), 404
        
        # Update status to approved
        expert.status = 'approved'
        db.commit()
        
        logger.info(f"Expert {expert_id} approved by admin {g.user_id}")
        
        # Send approval email
        try:
            from utils.email_sender import send_expert_approval_email
            send_expert_approval_email(
                expert.email_for_communication or expert.user.email,
                expert.user.name,
                expert.specialization
            )
        except Exception as e:
            logger.error(f"Failed to send approval email: {str(e)}")
        
        return jsonify({
            'success': True,
            'message': 'Expert approved successfully. Approval email sent.',
            'expert': expert.to_dict(include_user=True)
        }), 200
        
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error in approve_expert: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to approve expert',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error in approve_expert: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500


@admin_bp.route('/experts/<int:expert_id>/reject', methods=['POST'])
@verify_token()
@verify_admin()
def reject_expert(expert_id):
    """
    Reject an expert application
    
    Args:
        expert_id: ID of the expert to reject
    
    Returns:
        JSON response with success status
    """
    try:
        db = g.db
        
        # Get expert
        expert = db.query(Expert).filter_by(id=expert_id).first()
        
        if not expert:
            return jsonify({
                'success': False,
                'error': 'Expert not found',
                'code': 'EXPERT_NOT_FOUND'
            }), 404
        
        # Update status to rejected
        expert.status = 'rejected'
        db.commit()
        
        logger.info(f"Expert {expert_id} rejected by admin {g.user_id}")
        
        # Send rejection email
        try:
            from utils.email_sender import send_expert_rejection_email
            send_expert_rejection_email(
                expert.email_for_communication or expert.user.email,
                expert.user.name
            )
        except Exception as e:
            logger.error(f"Failed to send rejection email: {str(e)}")
        
        return jsonify({
            'success': True,
            'message': 'Expert rejected. Rejection email sent.',
            'expert': expert.to_dict(include_user=True)
        }), 200
        
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error in reject_expert: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to reject expert',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error in reject_expert: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500
