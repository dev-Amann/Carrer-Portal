"""
Contact-related email functions
"""
from flask import current_app, render_template
from flask_mail import Message
import logging

logger = logging.getLogger(__name__)


def send_contact_email(contact_data, mail):
    """
    Send contact form notification email to admin
    
    Args:
        contact_data (dict): Contact form data
        mail: Flask-Mail instance
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        if current_app.config.get('SENDGRID_API_KEY'):
            success, message = _send_via_sendgrid(contact_data)
            if success:
                return success, message
            logger.warning(f"SendGrid failed, falling back to Flask-Mail: {message}")
        
        return _send_via_flask_mail(contact_data, mail)
    
    except Exception as e:
        error_msg = f"Failed to send contact email: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return False, error_msg


def _send_via_flask_mail(contact_data, mail):
    """
    Send email using Flask-Mail (Gmail SMTP)
    """
    try:
        admin_email = current_app.config.get('ADMIN_EMAIL')
        
        if not admin_email:
            return False, "Admin email not configured"
        
        msg = Message(
            subject=f"New Contact Form Submission from {contact_data.get('fullName')}",
            sender=current_app.config.get('MAIL_DEFAULT_SENDER'),
            recipients=[admin_email]
        )
        
        try:
            msg.html = render_template('email/contact.html', **contact_data)
        except Exception as e:
            logger.warning(f"Failed to render HTML template: {str(e)}")
            msg.html = None
        
        try:
            msg.body = render_template('email/contact.txt', **contact_data)
        except Exception as e:
            logger.warning(f"Failed to render text template: {str(e)}")
            msg.body = "New contact form submission received. Please check the dashboard."
        
        mail.send(msg)
        logger.info(f"Contact email sent successfully to {admin_email}")
        return True, "Email sent successfully via Flask-Mail"
    
    except Exception as e:
        error_msg = f"Flask-Mail error: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return False, error_msg


def _send_via_sendgrid(contact_data):
    """
    Send email using SendGrid API
    """
    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail as SGMail, Email, To, Content
        
        api_key = current_app.config.get('SENDGRID_API_KEY')
        admin_email = current_app.config.get('ADMIN_EMAIL')
        sender_email = current_app.config.get('MAIL_DEFAULT_SENDER')
        
        if not api_key or not admin_email or not sender_email:
            return False, "SendGrid configuration incomplete"
        
        try:
            html_content = render_template('email/contact.html', **contact_data)
        except Exception as e:
            logger.warning(f"Failed to render HTML template for SendGrid: {str(e)}")
            html_content = "<p>New contact form submission received.</p>"
        
        try:
            text_content = render_template('email/contact.txt', **contact_data)
        except Exception as e:
            logger.warning(f"Failed to render text template for SendGrid: {str(e)}")
            text_content = "New contact form submission received."
        
        message = SGMail(
            from_email=Email(sender_email),
            to_emails=To(admin_email),
            subject=f"New Contact Form Submission from {contact_data.get('fullName')}",
            plain_text_content=Content("text/plain", text_content),
            html_content=Content("text/html", html_content)
        )
        
        sg = SendGridAPIClient(api_key)
        response = sg.send(message)
        
        if response.status_code in [200, 201, 202]:
            logger.info(f"Contact email sent successfully via SendGrid to {admin_email}")
            return True, "Email sent successfully via SendGrid"
        else:
            return False, f"SendGrid returned status code {response.status_code}"
    
    except ImportError:
        logger.warning("SendGrid library not installed")
        return False, "SendGrid library not available"
    except Exception as e:
        error_msg = f"SendGrid error: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return False, error_msg
