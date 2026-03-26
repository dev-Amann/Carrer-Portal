"""
Email sub-modules package
Re-exports all email functions for backward compatibility
"""
from utils.emails.contact_emails import send_contact_email, _send_via_flask_mail, _send_via_sendgrid
from utils.emails.auth_emails import send_otp_email, send_email_with_attachment
from utils.emails.expert_emails import send_expert_approval_email, send_expert_rejection_email
from utils.emails.booking_emails import send_booking_confirmation_email, send_expert_booking_notification_email

__all__ = [
    'send_contact_email',
    'send_otp_email',
    'send_email_with_attachment',
    'send_expert_approval_email',
    'send_expert_rejection_email',
    'send_booking_confirmation_email',
    'send_expert_booking_notification_email',
]
