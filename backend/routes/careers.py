"""
Careers and Skills routes
Handles skill management, career recommendations, and career details
"""
from flask import Blueprint, request, jsonify, g
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from models import Skill, UserSkill, Career, CareerSkill, SavedCareer, User
from utils.jwt_utils import verify_token
import logging

logger = logging.getLogger(__name__)

careers_bp = Blueprint('careers', __name__)


@careers_bp.route('/skills', methods=['GET'])
def get_skills():
    """
    Get all skills organized by category
    
    Returns:
        JSON response with skills grouped by category
    """
    try:
        db = g.db
        
        # Query all skills
        skills = db.query(Skill).order_by(Skill.category, Skill.name).all()
        
        # Organize skills by category
        skills_by_category = {}
        for skill in skills:
            category = skill.category
            if category not in skills_by_category:
                skills_by_category[category] = []
            skills_by_category[category].append(skill.to_dict())
        
        return jsonify({
            'success': True,
            'skills': skills_by_category
        }), 200
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_skills: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve skills',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error in get_skills: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500


@careers_bp.route('/skills/user', methods=['POST'])
@verify_token()
def save_user_skills():
    """
    Save user skills with proficiency levels
    
    Request body:
        {
            "skills": [
                {"skill_id": 1, "proficiency": "intermediate"},
                {"skill_id": 2, "proficiency": "advanced"}
            ]
        }
    
    Returns:
        JSON response with success status
    """
    try:
        db = g.db
        user_id = g.user_id
        
        # Get request data
        data = request.get_json()
        if not data or 'skills' not in data:
            return jsonify({
                'success': False,
                'error': 'Skills data is required',
                'code': 'MISSING_DATA'
            }), 400
        
        skills_data = data['skills']
        
        # Validate skills data
        if not isinstance(skills_data, list):
            return jsonify({
                'success': False,
                'error': 'Skills must be an array',
                'code': 'INVALID_FORMAT'
            }), 400
        
        # Valid proficiency levels
        valid_proficiency = ['beginner', 'intermediate', 'advanced', 'expert']
        
        # Validate each skill entry
        for skill_entry in skills_data:
            if not isinstance(skill_entry, dict):
                return jsonify({
                    'success': False,
                    'error': 'Each skill entry must be an object',
                    'code': 'INVALID_FORMAT'
                }), 400
            
            if 'skill_id' not in skill_entry or 'proficiency' not in skill_entry:
                return jsonify({
                    'success': False,
                    'error': 'Each skill must have skill_id and proficiency',
                    'code': 'MISSING_FIELDS'
                }), 400
            
            if skill_entry['proficiency'] not in valid_proficiency:
                return jsonify({
                    'success': False,
                    'error': f'Invalid proficiency level. Must be one of: {", ".join(valid_proficiency)}',
                    'code': 'INVALID_PROFICIENCY'
                }), 400
            
            # Verify skill exists
            skill = db.query(Skill).filter_by(id=skill_entry['skill_id']).first()
            if not skill:
                return jsonify({
                    'success': False,
                    'error': f'Skill with id {skill_entry["skill_id"]} does not exist',
                    'code': 'SKILL_NOT_FOUND'
                }), 404
        
        # Delete existing user skills to replace with new ones
        db.query(UserSkill).filter_by(user_id=user_id).delete()
        
        # Add new user skills
        added_skills = []
        for skill_entry in skills_data:
            user_skill = UserSkill(
                user_id=user_id,
                skill_id=int(skill_entry['skill_id']),
                proficiency=skill_entry['proficiency']
            )
            db.add(user_skill)
            added_skills.append({
                'skill_id': skill_entry['skill_id'],
                'proficiency': skill_entry['proficiency']
            })
        
        db.commit()
        
        logger.info(f"User {user_id} saved {len(added_skills)} skills")
        
        return jsonify({
            'success': True,
            'message': f'Successfully saved {len(added_skills)} skills',
            'skills': added_skills
        }), 200
        
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Integrity error in save_user_skills: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to save skills due to data integrity issue',
            'code': 'INTEGRITY_ERROR'
        }), 400
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error in save_user_skills: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to save skills',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error in save_user_skills: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500



@careers_bp.route('/careers/recommend', methods=['POST'])
@verify_token()
def recommend_careers():
    """
    Recommend careers based on user's saved skills
    Analyzes user skills and returns ranked list of matching careers
    
    Returns:
        JSON response with ranked career recommendations
    """
    try:
        db = g.db
        user_id = g.user_id
        
        # Get user's skills with proficiency levels
        user_skills = db.query(UserSkill).filter_by(user_id=user_id).all()
        
        if not user_skills:
            return jsonify({
                'success': False,
                'error': 'No skills found for user. Please add skills first.',
                'code': 'NO_SKILLS'
            }), 400
        
        # Create a mapping of user's skills with proficiency scores
        proficiency_scores = {
            'beginner': 1,
            'intermediate': 2,
            'advanced': 3,
            'expert': 4
        }
        
        user_skill_map = {}
        for us in user_skills:
            user_skill_map[us.skill_id] = proficiency_scores[us.proficiency]
        
        # Get all careers with their required skills
        careers = db.query(Career).all()
        
        career_matches = []
        
        for career in careers:
            # Get required skills for this career
            career_skills = db.query(CareerSkill).filter_by(career_id=career.id).all()
            
            if not career_skills:
                continue
            
            # Calculate match score
            total_required_skills = len(career_skills)
            matched_skills = 0
            skill_score = 0
            
            for cs in career_skills:
                required_score = proficiency_scores[cs.required_level]
                
                if cs.skill_id in user_skill_map:
                    user_score = user_skill_map[cs.skill_id]
                    matched_skills += 1
                    
                    # Give full points if user meets or exceeds requirement
                    if user_score >= required_score:
                        skill_score += 1.0
                    else:
                        # Partial credit if user has the skill but lower proficiency
                        skill_score += (user_score / required_score) * 0.5
            
            # Calculate overall match percentage
            if total_required_skills > 0:
                match_score = (skill_score / total_required_skills) * 100
            else:
                match_score = 0
            
            # Only include careers with at least some match
            if match_score > 0:
                career_matches.append({
                    'id': career.id,
                    'title': career.title,
                    'description': career.description,
                    'salary_range': career.salary_range,
                    'demand_level': career.demand_level,
                    'match_score': round(match_score, 2),
                    'matched_skills': matched_skills,
                    'total_required_skills': total_required_skills
                })
        
        # Sort by match score (highest first)
        career_matches.sort(key=lambda x: x['match_score'], reverse=True)
        
        logger.info(f"Generated {len(career_matches)} career recommendations for user {user_id}")
        
        return jsonify({
            'success': True,
            'careers': career_matches,
            'total_user_skills': len(user_skills)
        }), 200
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in recommend_careers: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to generate career recommendations',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error in recommend_careers: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500



@careers_bp.route('/careers/<int:career_id>', methods=['GET'])
def get_career_detail(career_id):
    """
    Get full career details including required skills
    
    Args:
        career_id: The ID of the career to retrieve
    
    Returns:
        JSON response with career details
    """
    try:
        db = g.db
        
        # Get career by ID
        career = db.query(Career).filter_by(id=career_id).first()
        
        if not career:
            return jsonify({
                'success': False,
                'error': 'Career not found',
                'code': 'CAREER_NOT_FOUND'
            }), 404
        
        # Get required skills for this career
        career_skills = db.query(CareerSkill).filter_by(career_id=career_id).all()
        
        required_skills = []
        for cs in career_skills:
            required_skills.append({
                'skill_id': cs.skill_id,
                'skill_name': cs.skill.name,
                'category': cs.skill.category,
                'required_level': cs.required_level
            })
        
        # Build career response
        career_data = career.to_dict()
        career_data['required_skills'] = required_skills
        
        return jsonify({
            'success': True,
            'career': career_data
        }), 200
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_career_detail: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve career details',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error in get_career_detail: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500


@careers_bp.route('/careers/<int:career_id>/skill-gap', methods=['GET'])
@verify_token()
def get_skill_gap(career_id):
    """
    Calculate skill gaps between user skills and career requirements
    
    Args:
        career_id: The ID of the career to analyze
    
    Returns:
        JSON response with skill gap analysis
    """
    try:
        db = g.db
        user_id = g.user_id
        
        # Get career by ID
        career = db.query(Career).filter_by(id=career_id).first()
        
        if not career:
            return jsonify({
                'success': False,
                'error': 'Career not found',
                'code': 'CAREER_NOT_FOUND'
            }), 404
        
        # Get user's skills
        user_skills = db.query(UserSkill).filter_by(user_id=user_id).all()
        user_skill_map = {us.skill_id: us.proficiency for us in user_skills}
        
        logger.info(f"Skill Gap Analysis - User {user_id}, Career {career_id}")
        logger.info(f"User Skills: {user_skill_map}")

        # Get required skills for this career
        career_skills = db.query(CareerSkill).filter_by(career_id=career_id).all()
        logger.info(f"Career Skills Required: {[cs.skill_id for cs in career_skills]}")
        
        # Proficiency level ordering
        proficiency_order = ['beginner', 'intermediate', 'advanced', 'expert']
        
        gaps = []
        met_requirements = []
        
        for cs in career_skills:
            skill_info = {
                'skill_id': cs.skill_id,
                'skill_name': cs.skill.name,
                'category': cs.skill.category,
                'required_level': cs.required_level
            }
            
            if cs.skill_id in user_skill_map:
                current_level = user_skill_map[cs.skill_id]
                skill_info['current_level'] = current_level
                
                try:
                    if not current_level:
                         # Handle None proficiency as 'beginner' or treat as missing
                         current_level = 'beginner'
                    
                    # Check if user meets requirement
                    current_index = proficiency_order.index(current_level.lower())
                    required_index = proficiency_order.index(cs.required_level.lower())
                    
                    if current_index >= required_index:
                        skill_info['status'] = 'met'
                        met_requirements.append(skill_info)
                    else:
                        skill_info['status'] = 'insufficient'
                        # Fix: Subtract indices, not strings
                        skill_info['gap'] = required_index - current_index
                        gaps.append(skill_info)
                except (ValueError, AttributeError) as e:
                    logger.error(f"Proficiency error: {e}. Current: {current_level}, Required: {cs.required_level}")
                    skill_info['status'] = 'error'
                    skill_info['error'] = 'Invalid proficiency level'
                    gaps.append(skill_info)
            else:
                skill_info['current_level'] = None
                skill_info['status'] = 'missing'
                gaps.append(skill_info)
        
        # Calculate overall readiness
        total_skills = len(career_skills)
        met_skills = len(met_requirements)
        readiness_percentage = (met_skills / total_skills * 100) if total_skills > 0 else 0
        
        logger.info(f"Analysis Result - Met: {met_skills}, Total: {total_skills}, Readiness: {readiness_percentage}%")

        return jsonify({
            'success': True,
            'career_id': career_id,
            'career_title': career.title,
            'gaps': gaps,
            'met_requirements': met_requirements,
            'readiness_percentage': round(readiness_percentage, 2),
            'total_required_skills': total_skills,
            'met_skills_count': met_skills
        }), 200
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_skill_gap: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to calculate skill gap',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error in get_skill_gap: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'An unexpected error occurred: {str(e)}',
            'code': 'UNEXPECTED_ERROR'
        }), 500


@careers_bp.route('/careers/save', methods=['POST'])
@verify_token()
def save_career():
    """
    Save a career to user's profile
    
    Request body:
        {
            "career_id": 1
        }
    
    Returns:
        JSON response with success status
    """
    try:
        db = g.db
        user_id = g.user_id
        
        # Get request data
        data = request.get_json()
        if not data or 'career_id' not in data:
            return jsonify({
                'success': False,
                'error': 'career_id is required',
                'code': 'MISSING_DATA'
            }), 400
        
        career_id = data['career_id']
        
        # Verify career exists
        career = db.query(Career).filter_by(id=career_id).first()
        if not career:
            return jsonify({
                'success': False,
                'error': 'Career not found',
                'code': 'CAREER_NOT_FOUND'
            }), 404
        
        # Check if already saved
        existing = db.query(SavedCareer).filter_by(
            user_id=user_id,
            career_id=career_id
        ).first()
        
        if existing:
            return jsonify({
                'success': False,
                'error': 'Career already saved to profile',
                'code': 'ALREADY_SAVED'
            }), 400
        
        # Save career
        saved_career = SavedCareer(
            user_id=user_id,
            career_id=career_id
        )
        db.add(saved_career)
        db.commit()
        
        logger.info(f"User {user_id} saved career {career_id}")
        
        return jsonify({
            'success': True,
            'message': 'Career saved successfully',
            'career_id': career_id,
            'career_title': career.title
        }), 200
        
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Integrity error in save_career: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to save career due to data integrity issue',
            'code': 'INTEGRITY_ERROR'
        }), 400
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error in save_career: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to save career',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error in save_career: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500


@careers_bp.route('/careers/saved', methods=['GET'])
@verify_token()
def get_saved_careers():
    """
    Get all saved careers for the current user
    
    Returns:
        JSON response with list of saved careers
    """
    try:
        db = g.db
        user_id = g.user_id
        
        # Get all saved careers for this user
        saved_careers = db.query(SavedCareer).filter_by(user_id=user_id).all()
        
        careers_list = []
        for sc in saved_careers:
            career = sc.career
            if career:
                career_data = career.to_dict()
                career_data['saved_at'] = sc.saved_at.isoformat() if sc.saved_at else None
                careers_list.append(career_data)
        
        logger.info(f"Retrieved {len(careers_list)} saved careers for user {user_id}")
        
        return jsonify({
            'success': True,
            'careers': careers_list,
            'total': len(careers_list)
        }), 200
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_saved_careers: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve saved careers',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error in get_saved_careers: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500


@careers_bp.route('/careers/save/<int:career_id>', methods=['DELETE'])
@verify_token()
def unsave_career(career_id):
    """
    Remove a career from user's saved careers
    
    Args:
        career_id: The ID of the career to unsave
    
    Returns:
        JSON response with success status
    """
    try:
        db = g.db
        user_id = g.user_id
        
        # Find the saved career
        saved_career = db.query(SavedCareer).filter_by(
            user_id=user_id,
            career_id=career_id
        ).first()
        
        if not saved_career:
            return jsonify({
                'success': False,
                'error': 'Career not found in saved careers',
                'code': 'NOT_SAVED'
            }), 404
        
        # Delete the saved career
        db.delete(saved_career)
        db.commit()
        
        logger.info(f"User {user_id} unsaved career {career_id}")
        
        return jsonify({
            'success': True,
            'message': 'Career removed from saved careers',
            'career_id': career_id
        }), 200
        
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error in unsave_career: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to unsave career',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error in unsave_career: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500


@careers_bp.route('/skills/user', methods=['GET'])
@verify_token()
def get_user_skills():
    """
    Get current user's skills with proficiency levels
    
    Returns:
        JSON response with user's skills
    """
    try:
        db = g.db
        user_id = g.user_id
        
        # Get user's skills
        user_skills = db.query(UserSkill).filter_by(user_id=user_id).all()
        
        skills_list = []
        for us in user_skills:
            skill = us.skill
            if skill:
                skills_list.append({
                    'skill_id': us.skill_id,
                    'name': skill.name,
                    'category': skill.category,
                    'proficiency': us.proficiency
                })
        
        logger.info(f"Retrieved {len(skills_list)} skills for user {user_id}")
        
        return jsonify({
            'success': True,
            'skills': skills_list,
            'total': len(skills_list)
        }), 200
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_user_skills: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve user skills',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error in get_user_skills: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500


@careers_bp.route('/careers/<int:career_id>/email-report', methods=['POST'])
@verify_token()
def email_career_report(career_id):
    """
    Email career recommendation report with skill gap analysis
    
    Args:
        career_id: The ID of the career to email
    
    Returns:
        JSON response with success status
    """
    try:
        db = g.db
        user_id = g.user_id
        
        # Get user
        user = db.query(User).filter_by(id=user_id).first()
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found',
                'code': 'USER_NOT_FOUND'
            }), 404
        
        # Get career
        career = db.query(Career).filter_by(id=career_id).first()
        if not career:
            return jsonify({
                'success': False,
                'error': 'Career not found',
                'code': 'CAREER_NOT_FOUND'
            }), 404
        
        # Get user's skills
        user_skills = db.query(UserSkill).filter_by(user_id=user_id).all()
        user_skill_map = {us.skill_id: us.proficiency for us in user_skills}
        
        # Get required skills for this career
        career_skills = db.query(CareerSkill).filter_by(career_id=career_id).all()
        
        # Proficiency level ordering
        proficiency_order = ['beginner', 'intermediate', 'advanced', 'expert']
        
        gaps = []
        met_requirements = []
        
        for cs in career_skills:
            skill_info = {
                'skill_id': cs.skill_id,
                'skill_name': cs.skill.name,
                'category': cs.skill.category,
                'required_level': cs.required_level
            }
            
            if cs.skill_id in user_skill_map:
                current_level = user_skill_map[cs.skill_id]
                skill_info['current_level'] = current_level
                
                # Check if user meets requirement
                current_index = proficiency_order.index(current_level)
                required_index = proficiency_order.index(cs.required_level)
                
                if current_index >= required_index:
                    skill_info['status'] = 'met'
                    met_requirements.append(skill_info)
                else:
                    skill_info['status'] = 'insufficient'
                    gaps.append(skill_info)
            else:
                skill_info['current_level'] = None
                skill_info['status'] = 'missing'
                gaps.append(skill_info)
        
        # Calculate overall readiness
        total_skills = len(career_skills)
        met_skills = len(met_requirements)
        readiness_percentage = (met_skills / total_skills * 100) if total_skills > 0 else 0
        
        skill_gap_data = {
            'gaps': gaps,
            'met_requirements': met_requirements,
            'readiness_percentage': readiness_percentage,
            'total_required_skills': total_skills,
            'met_skills_count': met_skills
        }
        
        # Prepare email data
        from flask import render_template, current_app
        
        email_data = {
            'user_name': user.name,
            'user_email': user.email,
            'career': career.to_dict(),
            'skill_gap': skill_gap_data,
            'dashboard_url': f"{request.host_url}dashboard",
            'experts_url': f"{request.host_url}experts",
            'website_url': request.host_url,
            'contact_url': f"{request.host_url}contact"
        }
        
        # Render email template
        html_content = render_template('email/career_report.html', **email_data)
        
        # Send email
        from flask_mail import Message, Mail
        mail = Mail(current_app)
        
        msg = Message(
            subject=f'Your Career Recommendation: {career.title}',
            recipients=[user.email],
            html=html_content
        )
        
        mail.send(msg)
        
        logger.info(f"Career report emailed to user {user_id} for career {career_id}")
        
        return jsonify({
            'success': True,
            'message': f'Career report sent successfully to {user.email}'
        }), 200
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in email_career_report: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to generate career report',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error in email_career_report: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to send email',
            'code': 'EMAIL_ERROR'
        }), 500


@careers_bp.route('/careers/<int:career_id>/download-pdf', methods=['GET'])
@verify_token()
def download_career_pdf(career_id):
    """
    Download career recommendation report as PDF
    
    Args:
        career_id: The ID of the career to download
    
    Returns:
        PDF file download
    """
    try:
        db = g.db
        user_id = g.user_id
        
        # Get user
        user = db.query(User).filter_by(id=user_id).first()
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found',
                'code': 'USER_NOT_FOUND'
            }), 404
        
        # Get career
        career = db.query(Career).filter_by(id=career_id).first()
        if not career:
            return jsonify({
                'success': False,
                'error': 'Career not found',
                'code': 'CAREER_NOT_FOUND'
            }), 404
        
        # Get user's skills
        user_skills = db.query(UserSkill).filter_by(user_id=user_id).all()
        user_skill_map = {us.skill_id: us.proficiency for us in user_skills}
        
        # Get required skills for this career
        career_skills = db.query(CareerSkill).filter_by(career_id=career_id).all()
        
        # Proficiency level ordering
        proficiency_order = ['beginner', 'intermediate', 'advanced', 'expert']
        
        gaps = []
        met_requirements = []
        
        for cs in career_skills:
            skill_info = {
                'skill_id': cs.skill_id,
                'skill_name': cs.skill.name,
                'category': cs.skill.category,
                'required_level': cs.required_level
            }
            
            if cs.skill_id in user_skill_map:
                current_level = user_skill_map[cs.skill_id]
                skill_info['current_level'] = current_level
                
                # Check if user meets requirement
                current_index = proficiency_order.index(current_level)
                required_index = proficiency_order.index(cs.required_level)
                
                if current_index >= required_index:
                    skill_info['status'] = 'met'
                    met_requirements.append(skill_info)
                else:
                    skill_info['status'] = 'insufficient'
                    gaps.append(skill_info)
            else:
                skill_info['current_level'] = None
                skill_info['status'] = 'missing'
                gaps.append(skill_info)
        
        # Calculate overall readiness
        total_skills = len(career_skills)
        met_skills = len(met_requirements)
        readiness_percentage = (met_skills / total_skills * 100) if total_skills > 0 else 0
        
        skill_gap_data = {
            'gaps': gaps,
            'met_requirements': met_requirements,
            'readiness_percentage': readiness_percentage,
            'total_required_skills': total_skills,
            'met_skills_count': met_skills
        }
        
        # Prepare data for PDF
        user_data = {
            'name': user.name,
            'email': user.email
        }
        
        career_data = career.to_dict()
        
        # Generate PDF
        from utils.pdf_generator import create_career_report_pdf
        pdf_buffer = create_career_report_pdf(user_data, career_data, skill_gap_data)
        
        # Create response
        from flask import send_file
        filename = f"career_report_{career.title.replace(' ', '_')}.pdf"
        
        logger.info(f"PDF generated for user {user_id}, career {career_id}")
        
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=filename
        )
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in download_career_pdf: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to generate PDF',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error in download_career_pdf: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to generate PDF',
            'code': 'PDF_ERROR'
        }), 500


@careers_bp.route('/careers/email-comparison', methods=['POST'])
@verify_token()
def email_career_comparison():
    """
    Email career comparison report for multiple careers
    
    Request body:
        {
            "career_ids": [1, 2, 3]
        }
    
    Returns:
        JSON response with success status
    """
    try:
        db = g.db
        user_id = g.user_id
        
        # Get request data
        data = request.get_json()
        if not data or 'career_ids' not in data:
            return jsonify({
                'success': False,
                'error': 'career_ids is required',
                'code': 'MISSING_DATA'
            }), 400
        
        career_ids = data['career_ids']
        
        if not isinstance(career_ids, list) or len(career_ids) < 2:
            return jsonify({
                'success': False,
                'error': 'At least 2 career IDs are required for comparison',
                'code': 'INVALID_DATA'
            }), 400
        
        # Get user
        user = db.query(User).filter_by(id=user_id).first()
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found',
                'code': 'USER_NOT_FOUND'
            }), 404
        
        # Get careers
        careers = db.query(Career).filter(Career.id.in_(career_ids)).all()
        if len(careers) != len(career_ids):
            return jsonify({
                'success': False,
                'error': 'One or more careers not found',
                'code': 'CAREER_NOT_FOUND'
            }), 404
        
        # Get user's skills
        user_skills = db.query(UserSkill).filter_by(user_id=user_id).all()
        user_skill_map = {us.skill_id: us.proficiency for us in user_skills}
        
        # Prepare comparison data
        comparison_data = []
        for career in careers:
            career_skills = db.query(CareerSkill).filter_by(career_id=career.id).all()
            
            proficiency_order = ['beginner', 'intermediate', 'advanced', 'expert']
            met_skills = 0
            
            for cs in career_skills:
                if cs.skill_id in user_skill_map:
                    current_index = proficiency_order.index(user_skill_map[cs.skill_id])
                    required_index = proficiency_order.index(cs.required_level)
                    if current_index >= required_index:
                        met_skills += 1
            
            total_skills = len(career_skills)
            readiness = (met_skills / total_skills * 100) if total_skills > 0 else 0
            
            comparison_data.append({
                'career': career.to_dict(),
                'matched_skills': met_skills,
                'total_skills': total_skills,
                'readiness_percentage': readiness
            })
        
        # Prepare email data
        from flask import render_template, current_app
        
        email_data = {
            'user_name': user.name,
            'user_email': user.email,
            'careers': comparison_data,
            'dashboard_url': f"{request.host_url}dashboard",
            'experts_url': f"{request.host_url}experts",
            'website_url': request.host_url,
            'contact_url': f"{request.host_url}contact"
        }
        
        # Render email template (create a simple comparison template)
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #34d399 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .career-card {{ background: #f9fafb; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 8px; }}
                .career-title {{ font-size: 20px; font-weight: bold; color: #1e40af; margin-bottom: 10px; }}
                .info-row {{ display: flex; justify-content: space-between; padding: 8px 0; }}
                .footer {{ background: #f9fafb; padding: 20px; text-align: center; color: #666; font-size: 13px; margin-top: 30px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎯 Career Comparison Report</h1>
                    <p>Comparing {len(comparison_data)} Careers</p>
                </div>
                <div style="padding: 20px;">
                    <p>Hi <strong>{user.name}</strong>,</p>
                    <p>Here's your detailed comparison of the selected careers:</p>
                    
                    {''.join([f'''
                    <div class="career-card">
                        <div class="career-title">{c['career']['title']}</div>
                        <p>{c['career']['description']}</p>
                        <div class="info-row">
                            <span>Salary Range:</span>
                            <strong>{c['career'].get('salary_range', 'N/A')}</strong>
                        </div>
                        <div class="info-row">
                            <span>Market Demand:</span>
                            <strong>{c['career'].get('demand_level', 'N/A').replace('_', ' ').upper()}</strong>
                        </div>
                        <div class="info-row">
                            <span>Skills Match:</span>
                            <strong>{c['matched_skills']}/{c['total_skills']}</strong>
                        </div>
                        <div class="info-row">
                            <span>Career Readiness:</span>
                            <strong>{c['readiness_percentage']:.0f}%</strong>
                        </div>
                    </div>
                    ''' for c in comparison_data])}
                    
                    <p style="margin-top: 30px;">
                        <a href="{email_data['dashboard_url']}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 5px;">View Dashboard</a>
                        <a href="{email_data['experts_url']}" style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 5px;">Book Expert</a>
                    </p>
                </div>
                <div class="footer">
                    <p><strong>CareerPortal</strong> - Your Partner in Career Growth</p>
                    <p>© 2025 CareerPortal. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Send email
        from flask_mail import Message, Mail
        mail = Mail(current_app)
        
        msg = Message(
            subject=f'Career Comparison Report - {len(careers)} Careers',
            recipients=[user.email],
            html=html_content
        )
        
        mail.send(msg)
        
        logger.info(f"Career comparison emailed to user {user_id}")
        
        return jsonify({
            'success': True,
            'message': f'Comparison report sent successfully to {user.email}'
        }), 200
        
    except Exception as e:
        logger.error(f"Unexpected error in email_career_comparison: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to send email',
            'code': 'EMAIL_ERROR'
        }), 500


@careers_bp.route('/careers/download-comparison-pdf', methods=['POST'])
@verify_token()
def download_career_comparison_pdf():
    """
    Download career comparison report as PDF
    
    Request body:
        {
            "career_ids": [1, 2, 3]
        }
    
    Returns:
        PDF file download
    """
    try:
        db = g.db
        user_id = g.user_id
        
        # Get request data
        data = request.get_json()
        if not data or 'career_ids' not in data:
            return jsonify({
                'success': False,
                'error': 'career_ids is required',
                'code': 'MISSING_DATA'
            }), 400
        
        career_ids = data['career_ids']
        
        if not isinstance(career_ids, list) or len(career_ids) < 2:
            return jsonify({
                'success': False,
                'error': 'At least 2 career IDs are required for comparison',
                'code': 'INVALID_DATA'
            }), 400
        
        # Get user
        user = db.query(User).filter_by(id=user_id).first()
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found',
                'code': 'USER_NOT_FOUND'
            }), 404
        
        # Get careers
        careers = db.query(Career).filter(Career.id.in_(career_ids)).all()
        if len(careers) != len(career_ids):
            return jsonify({
                'success': False,
                'error': 'One or more careers not found',
                'code': 'CAREER_NOT_FOUND'
            }), 404
        
        # Get user's skills
        user_skills = db.query(UserSkill).filter_by(user_id=user_id).all()
        user_skill_map = {us.skill_id: us.proficiency for us in user_skills}
        
        # Prepare comparison data
        comparison_data = []
        for career in careers:
            career_skills = db.query(CareerSkill).filter_by(career_id=career.id).all()
            
            proficiency_order = ['beginner', 'intermediate', 'advanced', 'expert']
            met_skills = 0
            
            for cs in career_skills:
                if cs.skill_id in user_skill_map:
                    current_index = proficiency_order.index(user_skill_map[cs.skill_id])
                    required_index = proficiency_order.index(cs.required_level)
                    if current_index >= required_index:
                        met_skills += 1
            
            total_skills = len(career_skills)
            readiness = (met_skills / total_skills * 100) if total_skills > 0 else 0
            
            comparison_data.append({
                'career': career.to_dict(),
                'matched_skills': met_skills,
                'total_skills': total_skills,
                'readiness_percentage': readiness
            })
        
        # Generate PDF
        from utils.pdf_generator import create_career_comparison_pdf
        user_data = {'name': user.name, 'email': user.email}
        pdf_buffer = create_career_comparison_pdf(user_data, comparison_data)
        
        # Create response
        from flask import send_file
        
        logger.info(f"Comparison PDF generated for user {user_id}")
        
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='career_comparison_report.pdf'
        )
        
    except Exception as e:
        logger.error(f"Unexpected error in download_career_comparison_pdf: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to generate PDF',
            'code': 'PDF_ERROR'
        }), 500
