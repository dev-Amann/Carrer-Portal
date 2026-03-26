"""
Payment routes
Handles Razorpay payment order creation and verification
"""
from flask import Blueprint, request, jsonify, g
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from models import Transaction, Booking, User, Expert
from utils.jwt_utils import verify_token
from utils.payment_helper import create_razorpay_order, verify_razorpay_signature
from utils.email_sender import send_booking_confirmation_email, send_expert_booking_notification_email
import logging
import os

logger = logging.getLogger(__name__)

payments_bp = Blueprint('payments', __name__)


@payments_bp.route('/bookings/<int:booking_id>', methods=['DELETE'])
@verify_token()
def cancel_pending_booking(booking_id):
    try:
        user_id = g.user_id
        booking = db.query(Booking).filter_by(id=booking_id, user_id=user_id).first()
        
        if not booking:
            return jsonify({'success': False, 'error': 'Booking not found or unauthorized'}), 404
            
        if booking.status != 'pending':
            return jsonify({'success': False, 'error': 'Cannot cancel non-pending booking via this route'}), 400
            
        # Delete associated transaction(s)
        transactions = db.query(Transaction).filter_by(booking_id=booking_id).all()
        for t in transactions:
            if t.status == 'completed':
                 return jsonify({'success': False, 'error': 'Cannot nuke booking with completed transaction'}), 400
            db.delete(t)
            
        db.delete(booking)
        db.commit()
        
        return jsonify({'success': True, 'message': 'Pending booking cancelled and removed'}), 200
        
    except Exception as e:
        logger.error(f"Error cancelling booking: {str(e)}")
        db.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@payments_bp.route('/create-order', methods=['POST'])
@verify_token()
def create_order():
    """
    Create a Razorpay order for payment processing
    """
    try:
        db = g.db
        user_id = g.user_id
        
        # Get request data
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'Request body is required'}), 400
        
        if 'booking_id' not in data or 'amount' not in data:
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        booking_id = data['booking_id']
        amount = data['amount']
        
        # Validate amount
        try:
            amount = float(amount)
            if amount <= 0:
                raise ValueError
        except:
            return jsonify({'success': False, 'error': 'Invalid amount'}), 400
        
        # Verify booking
        booking = db.query(Booking).filter_by(id=booking_id).first()
        if not booking:
            return jsonify({'success': False, 'error': 'Booking not found'}), 404
        
        if booking.user_id != user_id:
            return jsonify({'success': False, 'error': 'Unauthorized'}), 403
            
        # Check existing transaction
        existing = db.query(Transaction).filter_by(booking_id=booking_id, status='completed').first()
        if existing:
            return jsonify({'success': False, 'error': 'Payment already completed'}), 400
            
        # Create Razorpay order
        try:
            order = create_razorpay_order(
                amount=amount,
                currency='INR',
                receipt=f"booking_{booking_id}",
                notes={'booking_id': booking_id, 'user_id': user_id}
            )
        except Exception as e:
            return jsonify({'success': False, 'error': 'Failed to create payment order'}), 500
            
        # Save transaction
        transaction = Transaction(
            booking_id=booking_id,
            razorpay_order_id=order['id'],
            amount=amount,
            currency=order['currency'],
            status='created'
        )
        db.add(transaction)
        db.commit()
        
        return jsonify({
            'success': True,
            'order_id': order['id'],
            'amount': order['amount'],
            'currency': order['currency'],
            'key_id': os.getenv('RAZORPAY_KEY_ID')
        }), 201

    except Exception as e:
        db.rollback()
        logger.error(f"Error in create_order: {str(e)}")
        return jsonify({'success': False, 'error': 'Internal server error'}), 500


@payments_bp.route('/verify', methods=['POST'])
@verify_token()
def verify_payment():
    """
    Verify Razorpay payment
    """
    try:
        db = g.db
        user_id = g.user_id
        
        data = request.get_json()
        required = ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature']
        if not all(k in data for k in required):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
            
        order_id = data['razorpay_order_id']
        payment_id = data['razorpay_payment_id']
        signature = data['razorpay_signature']
        
        
        transaction = db.query(Transaction).filter_by(razorpay_order_id=order_id).first()
        if not transaction:
            return jsonify({'success': False, 'error': 'Transaction not found'}), 404
            
        # Verify ownership via booking
        booking = db.query(Booking).filter_by(id=transaction.booking_id).first()
        if not booking or booking.user_id != user_id:
            return jsonify({'success': False, 'error': 'Unauthorized'}), 403
            
        if transaction.status == 'completed':
            return jsonify({'success': True, 'message': 'Already verified'}), 200
            
        # Verify signature
        if verify_razorpay_signature(order_id, payment_id, signature):
            transaction.status = 'completed'
            transaction.razorpay_payment_id = payment_id
            transaction.razorpay_signature = signature
            booking.status = 'confirmed'
            db.commit()
            
            # Send emails (fire and forget logic in threading or just call it)
            # Use the existing email logic
            try:
                user = db.query(User).filter_by(id=booking.user_id).first()
                expert = db.query(Expert).filter_by(id=booking.expert_id).first()
                expert_user = db.query(User).filter_by(id=expert.user_id).first() if expert else None
                
                if user and expert_user:
                    send_booking_confirmation_email(
                        user.email, user.name, expert_user.name,
                        booking.slot_start, booking.slot_end,
                        booking.jitsi_room, booking.id, payment_id
                    )
                    send_expert_booking_notification_email(
                        expert_user.email, expert_user.name, user.name,
                        booking.slot_start, booking.slot_end,
                        booking.jitsi_room, booking.id
                    )
            except Exception as e:
                logger.error(f"Email sending failed: {e}")
                
            return jsonify({'success': True, 'message': 'Payment verified'}), 200
        else:
            # Delete the failed transaction to keep DB clean
            db.delete(transaction)
            db.commit()
            logger.warning(f"Payment verification failed for order {order_id}. Transaction deleted.")
            return jsonify({'success': False, 'error': 'Invalid signature'}), 400

    except Exception as e:
        db.rollback()
        logger.error(f"Error in verify_payment: {str(e)}")
        return jsonify({'success': False, 'error': 'Internal server error'}), 500
