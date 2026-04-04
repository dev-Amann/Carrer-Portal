"""
Career report generation service
Extracted from services/career_service.py for file size reduction.
Contains PDF report generation and email delivery methods.
"""
import logging
from flask import g
from models import User, Career
from utils.pdf_generator import create_career_report_pdf, create_career_comparison_pdf
from utils.email_sender import send_email_with_attachment

logger = logging.getLogger(__name__)


class CareerReportService:
    """Handles PDF report generation and email delivery for career analysis"""

    @staticmethod
    def download_career_report(user_id, career_id, calculate_skill_gap_fn):
        """Generate PDF report and return buffer for download"""
        try:
            user = g.db.query(User).get(user_id)
            career = g.db.query(Career).get(career_id)
            
            skill_gap = calculate_skill_gap_fn(user_id, career_id)
            
            user_data = user.to_dict()
            career_data = career.to_dict()
            
            pdf_buffer = create_career_report_pdf(user_data, career_data, skill_gap)
            
            if not pdf_buffer:
                raise Exception("Failed to generate PDF")
                
            return pdf_buffer
        except Exception as e:
            logger.error(f"Error generating PDF for download: {str(e)}")
            raise

    @staticmethod
    def generate_career_report(user_id, career_id, calculate_skill_gap_fn):
        """Generate PDF report and email it"""
        try:
            user = g.db.query(User).get(user_id)
            career = g.db.query(Career).get(career_id)
            
            skill_gap = calculate_skill_gap_fn(user_id, career_id)
            
            user_data = user.to_dict()
            career_data = career.to_dict()
            
            pdf_buffer = create_career_report_pdf(user_data, career_data, skill_gap)
            
            if not pdf_buffer:
                raise Exception("Failed to generate PDF")
            
            subject = f"Your Career Analysis Report: {career.title}"
            body = f"""
            Hello {user.name},
            
            Please find attached your detailed career analysis report for the {career.title} position.
            
            This report includes:
            - Role Overview
            - Skill Gap Analysis
            - Recommended Learning Path
            - Market Outlook
            
            Best regards,
            AI Career Coach Team
            """
            
            if send_email_with_attachment(user.email, subject, body, pdf_buffer, f"Career_Report_{career.id}.pdf"):
                return True
            return False
        except Exception as e:
            logger.error(f"Error generating report: {str(e)}")
            raise

    @staticmethod
    def generate_comparison_report(user_id, career_ids, calculate_skill_gap_fn):
        """Generate comparison PDF and email it"""
        try:
            user = g.db.query(User).get(user_id)
            careers = g.db.query(Career).filter(Career.id.in_(career_ids)).all()
            
            if not careers:
                return False
                
            comparison_data = []
            for career in careers:
                skill_gap = calculate_skill_gap_fn(user_id, career.id)
                
                career_dict = career.to_dict()
                comparison_item = {
                    'career': career_dict,
                    'matched_skills': skill_gap['met_skills_count'],
                    'total_skills': skill_gap['total_required_skills'],
                    'readiness_percentage': skill_gap['readiness_percentage']
                }
                comparison_data.append(comparison_item)
            
            user_data = user.to_dict()
            
            pdf_buffer = create_career_comparison_pdf(user_data, comparison_data)
            
            if not pdf_buffer:
                raise Exception("Failed to generate PDF")
                
            subject = "Career Comparison Report"
            body = f"""
            Hello {user.name},
            
            Please find attached your career comparison report.
            
            This report compares the following roles:
            {chr(10).join(['- ' + c.title for c in careers])}
            
            Best regards,
            AI Career Coach Team
            """
            
            if send_email_with_attachment(user.email, subject, body, pdf_buffer, "Career_Comparison_Report.pdf"):
                return True
            return False
        except Exception as e:
            logger.error(f"Error generating comparison report: {str(e)}")
            raise

    @staticmethod
    def download_comparison_report_buffer(user_id, career_ids, calculate_skill_gap_fn):
        """Generate comparison PDF and return buffer for direct browser download"""
        try:
            user = g.db.query(User).get(user_id)
            careers = g.db.query(Career).filter(Career.id.in_(career_ids)).all()

            if not careers:
                raise Exception("No careers found for the given IDs")

            comparison_data = []
            for career in careers:
                skill_gap = calculate_skill_gap_fn(user_id, career.id)
                comparison_data.append({
                    'career': career.to_dict(),
                    'matched_skills': skill_gap['met_skills_count'],
                    'total_skills': skill_gap['total_required_skills'],
                    'readiness_percentage': skill_gap['readiness_percentage']
                })

            user_data = user.to_dict()
            pdf_buffer = create_career_comparison_pdf(user_data, comparison_data)

            if not pdf_buffer:
                raise Exception("Failed to generate PDF")

            return pdf_buffer
        except Exception as e:
            logger.error(f"Error generating comparison PDF for download: {str(e)}")
            raise
