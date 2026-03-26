"""
Careers and Skills routes
Handles skill management, career recommendations, and career details
"""
from flask import Blueprint, request, jsonify, g, send_file
from utils.jwt_utils import verify_token
from services.career_service import CareerService
import logging

logger = logging.getLogger(__name__)

careers_bp = Blueprint('careers', __name__)

@careers_bp.route('/skills', methods=['GET'])
def get_skills():
    """Get all skills organized by category"""
    try:
        skills = CareerService.get_skills_by_category()
        return jsonify({'success': True, 'skills': skills}), 200
    except Exception as e:
        logger.error(f"Error in get_skills: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@careers_bp.route('/skills/user', methods=['POST'])
@verify_token()
def save_user_skills():
    """Save user skills with proficiency levels"""
    try:
        user_id = g.user_id
        data = request.get_json()
        
        if not data or 'skills' not in data:
            return jsonify({'success': False, 'error': 'Skills data is required'}), 400
            
        CareerService.save_user_skills(user_id, data['skills'])
        return jsonify({'success': True, 'message': 'Skills saved successfully'}), 200
    except Exception as e:
        logger.error(f"Error in save_user_skills: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@careers_bp.route('/skills/user', methods=['GET'])
@verify_token()
def get_user_skills():
    """Get current user's skills"""
    try:
        user_id = g.user_id
        skills = CareerService.get_user_skills(user_id)
        return jsonify({'success': True, 'skills': skills}), 200
    except Exception as e:
        logger.error(f"Error in get_user_skills: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@careers_bp.route('/careers/recommend', methods=['POST'])
@verify_token()
def recommend_careers():
    """Recommend careers based on user's saved skills"""
    try:
        user_id = g.user_id
        recommendations = CareerService.recommend_careers(user_id)
        return jsonify({'success': True, 'careers': recommendations}), 200
    except Exception as e:
        logger.error(f"Error in recommend_careers: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@careers_bp.route('/careers/<int:career_id>', methods=['GET'])
def get_career_detail(career_id):
    """Get full career details"""
    try:
        career = CareerService.get_career_detail(career_id)
        if not career:
            return jsonify({'success': False, 'error': 'Career not found'}), 404
        return jsonify({'success': True, 'career': career}), 200
    except Exception as e:
        logger.error(f"Error in get_career_detail: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@careers_bp.route('/careers/<int:career_id>/skill-gap', methods=['GET'])
@verify_token()
def get_skill_gap(career_id):
    """Calculate skill gaps"""
    try:
        user_id = g.user_id
        gap_analysis = CareerService.calculate_skill_gap(user_id, career_id)
        return jsonify({'success': True, **gap_analysis}), 200
    except Exception as e:
        logger.error(f"Error in get_skill_gap: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@careers_bp.route('/careers/save', methods=['POST'])
@verify_token()
def save_career():
    """Save a career to user's profile"""
    try:
        user_id = g.user_id
        data = request.get_json()
        if not data or 'career_id' not in data:
            return jsonify({'success': False, 'error': 'career_id is required'}), 400
            
        result = CareerService.save_career(user_id, data['career_id'])
        if not result:
            return jsonify({'success': False, 'error': 'Career already saved'}), 400
            
        return jsonify({'success': True, 'message': 'Career saved successfully'}), 200
    except Exception as e:
        logger.error(f"Error in save_career: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@careers_bp.route('/careers/saved', methods=['GET'])
@verify_token()
def get_saved_careers():
    """Get all saved careers"""
    try:
        user_id = g.user_id
        careers = CareerService.get_saved_careers(user_id)
        return jsonify({'success': True, 'careers': careers}), 200
    except Exception as e:
        logger.error(f"Error in get_saved_careers: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@careers_bp.route('/careers/save/<int:career_id>', methods=['DELETE'])
@verify_token()
def unsave_career(career_id):
    """Remove a career from saved careers"""
    try:
        user_id = g.user_id
        result = CareerService.unsave_career(user_id, career_id)
        if not result:
            return jsonify({'success': False, 'error': 'Career not found in saved list'}), 404
            
        return jsonify({'success': True, 'message': 'Career removed'}), 200
    except Exception as e:
        logger.error(f"Error in unsave_career: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@careers_bp.route('/careers/<int:career_id>/email-report', methods=['POST'])
@verify_token()
def email_career_report(career_id):
    """Email career report"""
    try:
        user_id = g.user_id
        success = CareerService.generate_career_report(user_id, career_id)
        if success:
            return jsonify({'success': True, 'message': 'Report emailed successfully'}), 200
        return jsonify({'success': False, 'error': 'Failed to send email'}), 500
    except Exception as e:
        logger.error(f"Error in email_career_report: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@careers_bp.route('/careers/compare/email', methods=['POST'])
@verify_token()
def email_career_comparison():
    """Email comparison report"""
    try:
        user_id = g.user_id
        data = request.get_json()
        if not data or 'career_ids' not in data:
            return jsonify({'success': False, 'error': 'career_ids required'}), 400
            
        success = CareerService.generate_comparison_report(user_id, data['career_ids'])
        if success:
            return jsonify({'success': True, 'message': 'Comparison report emailed successfully'}), 200
        return jsonify({'success': False, 'error': 'Failed to send email'}), 500
    except Exception as e:
        logger.error(f"Error in email_career_comparison: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500
@careers_bp.route('/careers/<int:career_id>/download-pdf', methods=['GET'])
@verify_token()
def download_career_pdf(career_id):
    """Download career report PDF"""
    try:
        user_id = g.user_id
        pdf_buffer = CareerService.download_career_report(user_id, career_id)
        
        pdf_buffer.seek(0)
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'career_report_{career_id}.pdf'
        )
    except Exception as e:
        logger.error(f"Error in download_career_pdf: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500
