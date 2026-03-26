"""
Expert-related email functions (approval, rejection)
"""
from flask import current_app, render_template
from flask_mail import Message
import logging

logger = logging.getLogger(__name__)


def send_expert_approval_email(email, name, specialization, mail=None):
    """
    Send expert approval notification email
    """
    try:
        dashboard_url = f"{current_app.config.get('FRONTEND_URL', 'http://localhost:5173')}/expert/login"
        
        msg = Message(
            subject="🎉 Your Expert Application Has Been Approved!",
            sender=current_app.config.get('MAIL_DEFAULT_SENDER'),
            recipients=[email]
        )
        
        try:
            msg.html = render_template('email/expert_approval.html', 
                                      name=name, 
                                      specialization=specialization,
                                      dashboard_url=dashboard_url)
            msg.body = render_template('email/expert_approval.txt',
                                      name=name,
                                      specialization=specialization,
                                      dashboard_url=dashboard_url)
        except Exception as e:
            logger.warning(f"Failed to render template: {str(e)}, using fallback")
            msg.body = f"Hello {name},\n\nYour expert application for {specialization} has been approved!\n\nAccess your dashboard at: {dashboard_url}"
            msg.html = f"<p>Hello {name},</p><p>Your expert application for <strong>{specialization}</strong> has been approved!</p><p><a href='{dashboard_url}'>Access Dashboard</a></p>"
        
        mail.send(msg)
        logger.info(f"Expert approval email sent successfully to {email}")
        return True, "Approval email sent successfully"
    
    except Exception as e:
        error_msg = f"Failed to send expert approval email: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return False, error_msg


def send_expert_rejection_email(email, name, mail=None):
    """
    Send expert rejection notification email
    """
    try:
        reapply_url = f"{current_app.config.get('FRONTEND_URL', 'http://localhost:5173')}/expert/register"
        
        msg = Message(
            subject="Update on Your Expert Application",
            sender=current_app.config.get('MAIL_DEFAULT_SENDER'),
            recipients=[email]
        )
        
        try:
            msg.html = render_template('email/expert_rejection.html',
                                      name=name,
                                      reapply_url=reapply_url)
            msg.body = render_template('email/expert_rejection.txt',
                                      name=name,
                                      reapply_url=reapply_url)
        except Exception as e:
            logger.warning(f"Failed to render template: {str(e)}, using fallback")
            msg.body = f"Hello {name},\n\nThank you for your interest. We are unable to approve your expert application at this time.\n\nYou can reapply at: {reapply_url}"
            msg.html = f"<p>Hello {name},</p><p>Thank you for your interest. We are unable to approve your expert application at this time.</p><p><a href='{reapply_url}'>Reapply Here</a></p>"
        
        mail.send(msg)
        logger.info(f"Expert rejection email sent successfully to {email}")
        return True, "Rejection email sent successfully"
    
    except Exception as e:
        error_msg = f"Failed to send expert rejection email: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return False, error_msg
