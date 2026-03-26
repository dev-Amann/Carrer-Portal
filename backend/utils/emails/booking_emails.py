"""
Booking-related email functions (confirmation, expert notification)
"""
from flask import current_app, render_template
from flask_mail import Message
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


def send_booking_confirmation_email(user_email, user_name, expert_name, slot_start, slot_end, jitsi_room, booking_id, razorpay_payment_id=None, mail=None):
    """
    Send booking confirmation email to user after successful payment
    """
    try:
        frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
        dashboard_url = f"{frontend_url}/dashboard"
        
        if isinstance(slot_start, str):
            slot_start = datetime.fromisoformat(slot_start.replace('Z', '+00:00'))
        if isinstance(slot_end, str):
            slot_end = datetime.fromisoformat(slot_end.replace('Z', '+00:00'))
        
        formatted_date = slot_start.strftime('%B %d, %Y')
        formatted_start_time = slot_start.strftime('%I:%M %p')
        formatted_end_time = slot_end.strftime('%I:%M %p')
        
        msg = Message(
            subject=f"🎉 Booking Confirmed with {expert_name}",
            sender=current_app.config.get('MAIL_DEFAULT_SENDER'),
            recipients=[user_email]
        )
        
        template_context = {
            'user_name': user_name,
            'expert_name': expert_name,
            'formatted_date': formatted_date,
            'formatted_start_time': formatted_start_time,
            'formatted_end_time': formatted_end_time,
            'booking_id': booking_id,
            'dashboard_url': dashboard_url,
            'razorpay_payment_id': razorpay_payment_id
        }
        
        try:
            msg.html = render_template('email/booking_confirmation.html', **template_context)
            msg.body = render_template('email/booking_confirmation.txt', **template_context)
        except Exception as e:
            logger.warning(f"Failed to render booking confirmation templates: {str(e)}")
            msg.body = f"Booking confirmed with {expert_name} on {formatted_date} at {formatted_start_time}. Please join via your dashboard: {dashboard_url}"
        
        mail.send(msg)
        logger.info(f"Booking confirmation email sent successfully to {user_email} for booking #{booking_id}")
        return True, "Booking confirmation email sent successfully"
    
    except Exception as e:
        error_msg = f"Failed to send booking confirmation email: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return False, error_msg


def send_expert_booking_notification_email(expert_email, expert_name, user_name, slot_start, slot_end, jitsi_room, booking_id, mail=None):
    """
    Send booking notification email to expert after successful payment
    """
    try:
        frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
        dashboard_url = f"{frontend_url}/expert/dashboard"
        
        if isinstance(slot_start, str):
            slot_start = datetime.fromisoformat(slot_start.replace('Z', '+00:00'))
        if isinstance(slot_end, str):
            slot_end = datetime.fromisoformat(slot_end.replace('Z', '+00:00'))
        
        formatted_date = slot_start.strftime('%B %d, %Y')
        formatted_start_time = slot_start.strftime('%I:%M %p')
        formatted_end_time = slot_end.strftime('%I:%M %p')
        
        msg = Message(
            subject=f"📅 New Booking: {user_name} - {formatted_date}",
            sender=current_app.config.get('MAIL_DEFAULT_SENDER'),
            recipients=[expert_email]
        )
        
        template_context = {
            'expert_name': expert_name,
            'user_name': user_name,
            'formatted_date': formatted_date,
            'formatted_start_time': formatted_start_time,
            'formatted_end_time': formatted_end_time,
            'booking_id': booking_id,
            'dashboard_url': dashboard_url
        }
        
        try:
            msg.html = render_template('email/expert_booking_notification.html', **template_context)
            msg.body = render_template('email/expert_booking_notification.txt', **template_context)
        except Exception as e:
            logger.warning(f"Failed to render expert booking notification templates: {str(e)}")
            msg.body = f"New booking from {user_name} on {formatted_date} at {formatted_start_time}. Please join via your dashboard: {dashboard_url}"
        
        mail.send(msg)
        logger.info(f"Expert booking notification email sent successfully to {expert_email} for booking #{booking_id}")
        return True, "Expert notification email sent successfully"
    
    except Exception as e:
        error_msg = f"Failed to send expert booking notification email: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return False, error_msg
