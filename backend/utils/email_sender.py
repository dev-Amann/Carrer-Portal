"""
Email utility functions for sending contact form notifications
Supports Flask-Mail (Gmail SMTP) and optional SendGrid fallback
"""
from flask import current_app, render_template
from flask_mail import Mail, Message
import logging

logger = logging.getLogger(__name__)

# Initialize Flask-Mail (will be configured from app config)
mail = Mail()


def init_mail(app):
    """Initialize Flask-Mail with app configuration"""
    mail.init_app(app)
    logger.info("Flask-Mail initialized")


def send_contact_email(contact_data):
    """
    Send contact form notification email to admin
    
    Args:
        contact_data (dict): Contact form data containing:
            - fullName: Contact's full name
            - businessName: Contact's business name (optional)
            - email: Contact's email address
            - phone: Contact's phone number (optional)
            - budgetRange: Selected budget range (optional)
            - interestedService: Service they're interested in (optional)
            - message: Contact message
            - consent: Boolean indicating consent given
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        # Check if SendGrid is configured and try it first
        if current_app.config.get('SENDGRID_API_KEY'):
            success, message = _send_via_sendgrid(contact_data)
            if success:
                return success, message
            logger.warning(f"SendGrid failed, falling back to Flask-Mail: {message}")
        
        # Use Flask-Mail (Gmail SMTP)
        return _send_via_flask_mail(contact_data)
    
    except Exception as e:
        error_msg = f"Failed to send contact email: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return False, error_msg


def _send_via_flask_mail(contact_data):
    """
    Send email using Flask-Mail (Gmail SMTP)
    
    Args:
        contact_data (dict): Contact form data
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        admin_email = current_app.config.get('ADMIN_EMAIL')
        
        if not admin_email:
            return False, "Admin email not configured"
        
        # Create email message
        msg = Message(
            subject=f"New Contact Form Submission from {contact_data.get('fullName')}",
            sender=current_app.config.get('MAIL_DEFAULT_SENDER'),
            recipients=[admin_email]
        )
        
        # Render HTML template
        try:
            msg.html = render_template('email/contact.html', **contact_data)
        except Exception as e:
            logger.warning(f"Failed to render HTML template: {str(e)}")
            msg.html = None
        
        # Render plain text template as fallback
        msg.body = "New contact form submission received. Please view this email in an HTML-compatible client."
        
        # Send email
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
    
    Args:
        contact_data (dict): Contact form data
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail as SGMail, Email, To, Content
        
        api_key = current_app.config.get('SENDGRID_API_KEY')
        admin_email = current_app.config.get('ADMIN_EMAIL')
        sender_email = current_app.config.get('MAIL_DEFAULT_SENDER')
        
        if not api_key or not admin_email or not sender_email:
            return False, "SendGrid configuration incomplete"
        
        # Render HTML content
        try:
            html_content = render_template('email/contact.html', **contact_data)
        except Exception as e:
            logger.warning(f"Failed to render HTML template for SendGrid: {str(e)}")
            html_content = "<p>New contact form submission received.</p>"
        
        # Render plain text content
        text_content = "New contact form submission received. Please view the HTML version for full details."
        
        # Create SendGrid message
        message = SGMail(
            from_email=Email(sender_email),
            to_emails=To(admin_email),
            subject=f"New Contact Form Submission from {contact_data.get('fullName')}",
            plain_text_content=Content("text/plain", text_content),
            html_content=Content("text/html", html_content)
        )
        
        # Send email
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


def send_otp_email(email, otp, purpose='verification'):
    """
    Send OTP verification email to user
    
    Args:
        email (str): Recipient email address
        otp (str): OTP code
        purpose (str): Purpose of OTP (verification, login)
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        purpose_text = {
            'verification': 'Email Verification',
            'login': 'Login Verification',
            'password_reset': 'Password Reset'
        }.get(purpose, 'Verification')
        
        # Create email message
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
        
        # Create HTML content
        try:
            msg.html = render_template('email/otp_verification.html', **template_context)
        except Exception as e:
            logger.warning(f"Failed to render OTP HTML template: {str(e)}")
            msg.html = f"<p>Your verification code is: <strong>{otp}</strong></p>"

        # Create plain text content
        msg.body = f"Your CarrerPortal verification code is: {otp}"
        
        # Send email
        mail.send(msg)
        logger.info(f"OTP email sent successfully to {email}")
        return True, "OTP email sent successfully"
    
    except Exception as e:
        error_msg = f"Failed to send OTP email: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return False, error_msg


def send_expert_approval_email(email, name, specialization):
    """
    Send expert approval notification email
    
    Args:
        email (str): Expert's email address
        name (str): Expert's name
        specialization (str): Expert's specialization
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        dashboard_url = f"{current_app.config.get('FRONTEND_URL', 'http://localhost:5173')}/expert/login"
        
        # Create email message
        msg = Message(
            subject="🎉 Your Expert Application Has Been Approved!",
            sender=current_app.config.get('MAIL_DEFAULT_SENDER'),
            recipients=[email]
        )
        
        # Render templates
        try:
            msg.html = render_template('email/expert_approval.html', 
                                      name=name, 
                                      specialization=specialization,
                                      dashboard_url=dashboard_url)
            msg.body = f"Hello {name}, your expert application for {specialization} has been approved! Log in at: {dashboard_url}"
        except Exception as e:
            logger.warning(f"Failed to render template: {str(e)}, using fallback")
            msg.body = f"Hello {name},\n\nYour expert application for {specialization} has been approved!\n\nAccess your dashboard at: {dashboard_url}"
            msg.html = f"<p>Hello {name},</p><p>Your expert application for <strong>{specialization}</strong> has been approved!</p><p><a href='{dashboard_url}'>Access Dashboard</a></p>"
        
        # Send email
        mail.send(msg)
        logger.info(f"Expert approval email sent successfully to {email}")
        return True, "Approval email sent successfully"
    
    except Exception as e:
        error_msg = f"Failed to send expert approval email: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return False, error_msg


def send_expert_rejection_email(email, name):
    """
    Send expert rejection notification email
    
    Args:
        email (str): Expert's email address
        name (str): Expert's name
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        reapply_url = f"{current_app.config.get('FRONTEND_URL', 'http://localhost:5173')}/expert/register"
        
        # Create email message
        msg = Message(
            subject="Update on Your Expert Application",
            sender=current_app.config.get('MAIL_DEFAULT_SENDER'),
            recipients=[email]
        )
        
        # Render templates
        try:
            msg.html = render_template('email/expert_rejection.html',
                                      name=name,
                                      reapply_url=reapply_url)
            msg.body = f"Hello {name}, regarding your expert application: we are unable to approve it at this time. You can reapply at: {reapply_url}"
        except Exception as e:
            logger.warning(f"Failed to render template: {str(e)}, using fallback")
            msg.body = f"Hello {name},\n\nThank you for your interest. We are unable to approve your expert application at this time.\n\nYou can reapply at: {reapply_url}"
            msg.html = f"<p>Hello {name},</p><p>Thank you for your interest. We are unable to approve your expert application at this time.</p><p><a href='{reapply_url}'>Reapply Here</a></p>"
        
        # Send email
        mail.send(msg)
        logger.info(f"Expert rejection email sent successfully to {email}")
        return True, "Rejection email sent successfully"
    
    except Exception as e:
        error_msg = f"Failed to send expert rejection email: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return False, error_msg


def send_booking_confirmation_email(user_email, user_name, expert_name, slot_start, slot_end, jitsi_room, booking_id, razorpay_payment_id=None):
    """
    Send booking confirmation email to user after successful payment
    
    Args:
        user_email (str): User's email address
        user_name (str): User's name
        expert_name (str): Expert's name
        slot_start (datetime): Booking start time
        slot_end (datetime): Booking end time
        jitsi_room (str): Jitsi room ID
        booking_id (int): Booking ID
        razorpay_payment_id (str, optional): Razorpay payment/transaction ID
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
        dashboard_url = f"{frontend_url}/dashboard"
        
        # Format datetime
        from datetime import datetime
        if isinstance(slot_start, str):
            slot_start = datetime.fromisoformat(slot_start.replace('Z', '+00:00'))
        if isinstance(slot_end, str):
            slot_end = datetime.fromisoformat(slot_end.replace('Z', '+00:00'))
        
        formatted_date = slot_start.strftime('%B %d, %Y')
        formatted_start_time = slot_start.strftime('%I:%M %p')
        formatted_end_time = slot_end.strftime('%I:%M %p')
        
        # Create email message
        msg = Message(
            subject=f"🎉 Booking Confirmed with {expert_name}",
            sender=current_app.config.get('MAIL_DEFAULT_SENDER'),
            recipients=[user_email]
        )
        
        # Prepare template context
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
        
        # Render templates
        try:
            msg.html = render_template('email/booking_confirmation.html', **template_context)
            msg.body = f"Your booking with {expert_name} is confirmed for {formatted_date}. View details: {dashboard_url}"
        except Exception as e:
            logger.warning(f"Failed to render booking confirmation templates: {str(e)}")
            # Fallback to basic text
            msg.body = f"Booking confirmed with {expert_name} on {formatted_date} at {formatted_start_time}. Please join via your dashboard: {dashboard_url}"
        
        # Send email
        mail.send(msg)
        logger.info(f"Booking confirmation email sent successfully to {user_email} for booking #{booking_id}")
        return True, "Booking confirmation email sent successfully"
    
    except Exception as e:
        error_msg = f"Failed to send booking confirmation email: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return False, error_msg


def send_expert_booking_notification_email(expert_email, expert_name, user_name, slot_start, slot_end, jitsi_room, booking_id):
    """
    Send booking notification email to expert after successful payment
    
    Args:
        expert_email (str): Expert's email address
        expert_name (str): Expert's name
        user_name (str): User's name
        slot_start (datetime): Booking start time
        slot_end (datetime): Booking end time
        jitsi_room (str): Jitsi room ID
        booking_id (int): Booking ID
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
        dashboard_url = f"{frontend_url}/expert/dashboard"
        
        # Format datetime
        from datetime import datetime
        if isinstance(slot_start, str):
            slot_start = datetime.fromisoformat(slot_start.replace('Z', '+00:00'))
        if isinstance(slot_end, str):
            slot_end = datetime.fromisoformat(slot_end.replace('Z', '+00:00'))
        
        formatted_date = slot_start.strftime('%B %d, %Y')
        formatted_start_time = slot_start.strftime('%I:%M %p')
        formatted_end_time = slot_end.strftime('%I:%M %p')
        
        # Create email message
        msg = Message(
            subject=f"📅 New Booking: {user_name} - {formatted_date}",
            sender=current_app.config.get('MAIL_DEFAULT_SENDER'),
            recipients=[expert_email]
        )
        
        # Prepare template context
        template_context = {
            'expert_name': expert_name,
            'user_name': user_name,
            'formatted_date': formatted_date,
            'formatted_start_time': formatted_start_time,
            'formatted_end_time': formatted_end_time,
            'booking_id': booking_id,
            'dashboard_url': dashboard_url
        }
        
        # Render templates
        try:
            msg.html = render_template('email/expert_booking_notification.html', **template_context)
            msg.body = f"New booking from {user_name} for {formatted_date}. Check your dashboard: {dashboard_url}"
        except Exception as e:
            logger.warning(f"Failed to render expert booking notification templates: {str(e)}")
            # Fallback to basic text
            msg.body = f"New booking from {user_name} on {formatted_date} at {formatted_start_time}. Please join via your dashboard: {dashboard_url}"
        
        # Send email
        mail.send(msg)
        logger.info(f"Expert booking notification email sent successfully to {expert_email} for booking #{booking_id}")
        return True, "Expert notification email sent successfully"
    
    except Exception as e:
        error_msg = f"Failed to send expert booking notification email: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return False, error_msg


def send_email_with_attachment(recipient, subject, body, attachment_file, attachment_filename="report.pdf"):
    """
    Send email with a single PDF attachment
    
    Args:
        recipient (str): Email address of recipient
        subject (str): Email subject
        body (str): Email body text
        attachment_file (BytesIO or bytes): File object or bytes content
        attachment_filename (str): Name of the attachment file
    
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
        
        # Read file content if it's a file object
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

