"""
Authentication-related email functions (OTP, attachments)
"""
from flask import current_app, render_template
from flask_mail import Message
import logging

logger = logging.getLogger(__name__)


def send_otp_email(email, otp, purpose='verification', mail=None):
    """
    Send OTP verification email to user
    
    Args:
        email (str): Recipient email address
        otp (str): OTP code
        purpose (str): Purpose of OTP (verification, login)
        mail: Flask-Mail instance
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        purpose_text = {
            'verification': 'Email Verification',
            'login': 'Login Verification'
        }.get(purpose, 'Verification')
        
        msg = Message(
            subject=f"Your CarrerPortal {purpose_text} Code",
            sender=current_app.config.get('MAIL_DEFAULT_SENDER'),
            recipients=[email]
        )
        
        template_context = {
            'otp': otp,
            'purpose': purpose,
            'purpose_text': purpose_text
        }
        
        try:
            msg.html = render_template('email/otp_verification.html', **template_context)
        except Exception as e:
            logger.warning(f"Failed to render OTP HTML template: {str(e)}")
            msg.html = f"<p>Your verification code is: <strong>{otp}</strong></p>"

        try:
            msg.body = render_template('email/otp_verification.txt', **template_context)
        except Exception as e:
            logger.warning(f"Failed to render OTP text template: {str(e)}")
            msg.body = f"Your verification code is: {otp}"
        
        mail.send(msg)
        logger.info(f"OTP email sent successfully to {email}")
        return True, "OTP email sent successfully"
    
    except Exception as e:
        error_msg = f"Failed to send OTP email: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return False, error_msg


def send_email_with_attachment(recipient, subject, body, attachment_file, attachment_filename="report.pdf", mail=None):
    """
    Send email with a single PDF attachment
    
    Args:
        recipient (str): Email address of recipient
        subject (str): Email subject
        body (str): Email body text
        attachment_file (BytesIO or bytes): File object or bytes content
        attachment_filename (str): Name of the attachment file
        mail: Flask-Mail instance
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        msg = Message(
            subject=subject,
            sender=current_app.config.get('MAIL_DEFAULT_SENDER'),
            recipients=[recipient],
            body=body
        )
        
        if hasattr(attachment_file, 'read'):
            attachment_file.seek(0)
            data = attachment_file.read()
        else:
            data = attachment_file
            
        msg.attach(
            filename=attachment_filename,
            content_type="application/pdf",
            data=data
        )
        
        mail.send(msg)
        logger.info(f"Email with attachment sent using Flask-Mail to {recipient}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email with attachment: {str(e)}")
        return False
