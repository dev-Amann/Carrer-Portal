import logging
from flask import g
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy import func, case
from sqlalchemy.orm import joinedload
from models import Skill, UserSkill, Career, CareerSkill, SavedCareer, User
from utils.pdf_generator import create_career_report_pdf, create_career_comparison_pdf
from utils.email_sender import send_email_with_attachment

logger = logging.getLogger(__name__)

class CareerService:
    @staticmethod
    def get_skills_by_category():
        """Get all skills organized by category"""
        try:
            skills = g.db.query(Skill).order_by(Skill.category, Skill.name).all()
            
            # Group by category
            grouped_skills = {}
            for skill in skills:
                if skill.category not in grouped_skills:
                    grouped_skills[skill.category] = []
                
                grouped_skills[skill.category].append({
                    'id': skill.id,
                    'name': skill.name
                })
            
            return grouped_skills
        except Exception as e:
            logger.error(f"Error fetching skills: {str(e)}")
            raise

    @staticmethod
    def save_user_skills(user_id, skills_data):
        """Save user skills with proficiency levels"""
        try:
            # Delete existing skills
            g.db.query(UserSkill).filter_by(user_id=user_id).delete()
            
            user_skills = []
            for skill_item in skills_data:
                user_skill = UserSkill(
                    user_id=user_id,
                    skill_id=skill_item['skill_id'],
                    proficiency=skill_item['proficiency']
                )
                user_skills.append(user_skill)
            
            g.db.add_all(user_skills)
            g.db.commit()
            return True
        except SQLAlchemyError as e:
            g.db.rollback()
            logger.error(f"Database error saving skills: {str(e)}")
            raise
        except Exception as e:
            g.db.rollback()
            logger.error(f"Error saving skills: {str(e)}")
            raise

    @staticmethod
    def get_user_skills(user_id):
        """Get current user's skills with proficiency levels"""
        try:
            user_skills = g.db.query(UserSkill).options(joinedload(UserSkill.skill)).filter_by(user_id=user_id).all()
            return [{
                'skill_id': us.skill_id,
                'name': us.skill.name,
                'category': us.skill.category,
                'proficiency': us.proficiency
            } for us in user_skills]
        except Exception as e:
            logger.error(f"Error fetching user skills: {str(e)}")
            raise

    @staticmethod
    def recommend_careers(user_id):
        """Recommend careers based on user's saved skills"""
        try:
            # Get user skills
            user_skills = g.db.query(UserSkill).filter_by(user_id=user_id).all()
            if not user_skills:
                return []
            
            user_skill_ids = [us.skill_id for us in user_skills]
            user_skill_map = {us.skill_id: us.proficiency for us in user_skills}
            
            # Find matching careers
            careers = g.db.query(Career).all()
            recommendations = []
            
            proficiency_weights = {
                'beginner': 1,
                'intermediate': 2,
                'advanced': 3,
                'expert': 4
            }
            
            for career in careers:
                # Get required skills for career
                required_skills = g.db.query(CareerSkill).filter_by(career_id=career.id).all()
                if not required_skills:
                    continue
                
                total_skills = len(required_skills)
                matching_skills = 0
                weighted_score = 0
                total_possible_score = 0
                
                for req_skill in required_skills:
                    # Fix: use required_level from CareerSkill model
                    req_weight = proficiency_weights.get(req_skill.required_level.lower(), 1)
                    total_possible_score += (req_weight * 2) # Max possible score per skill
                    
                    if req_skill.skill_id in user_skill_map:
                        matching_skills += 1
                        user_level = user_skill_map[req_skill.skill_id]
                        user_weight = proficiency_weights.get(user_level.lower(), 1)
                        
                        # Score calculation
                        if user_weight >= req_weight:
                            weighted_score += (req_weight * 2)
                        else:
                            weighted_score += user_weight
                
                match_percentage = (matching_skills / total_skills) * 100
                score_percentage = (weighted_score / total_possible_score) * 100 if total_possible_score > 0 else 0
                
                final_score = (match_percentage * 0.4) + (score_percentage * 0.6)
                
                if final_score > 10: # Lowered threshold and added logging
                    logger.info(f"Career {career.title}: Match {match_percentage}%, Score {score_percentage}%, Final {final_score}")
                    recommendations.append({
                        'id': career.id,
                        'title': career.title,
                        'description': career.description,
                        'salary_range': career.salary_range,
                        'demand_level': career.demand_level, # Included demand_level
                        'match_score': round(final_score),
                        'matched_skills': matching_skills, # Renamed from matching_skills_count
                        'total_required_skills': total_skills # Renamed from total_skills_count
                    })
            
            recommendations.sort(key=lambda x: x['match_score'], reverse=True)
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            raise

    @staticmethod
    def get_career_detail(career_id):
        """Get full career details including required skills"""
        try:
            career = g.db.query(Career).get(career_id)
            if not career:
                return None
            
            skills = []
            for cs in career.career_skills:
                skills.append({
                    'id': cs.skill.id,
                    'name': cs.skill.name,
                    'category': cs.skill.category,
                    'required_level': cs.required_level
                })
            
            return {
                'id': career.id,
                'title': career.title,
                'description': career.description,
                'salary_range': career.salary_range,
                'demand_level': career.demand_level,
                'roadmap': career.roadmap,
                'required_skills': skills,
                'learning_resources': [lr.to_dict() for lr in career.learning_resources]
            }
        except Exception as e:
            logger.error(f"Error fetching career details: {str(e)}")
            raise

    @staticmethod
    def calculate_skill_gap(user_id, career_id):
        """Calculate skill gaps between user skills and career requirements"""
        try:
            # Fetch Career details first for title
            career = g.db.query(Career).get(career_id)
            if not career:
                raise ValueError("Career not found")

            user_skills = g.db.query(UserSkill).filter_by(user_id=user_id).all()
            user_skill_map = {us.skill_id: us.proficiency for us in user_skills}
            
            career_skills = g.db.query(CareerSkill).options(joinedload(CareerSkill.skill)).filter_by(career_id=career_id).all()
            
            gaps = []
            met_requirements = []
            
            proficiency_levels = ['beginner', 'intermediate', 'advanced', 'expert']
            
            for cs in career_skills:
                req_level_idx = proficiency_levels.index(cs.required_level.lower()) if cs.required_level.lower() in proficiency_levels else 0
                
                if cs.skill_id not in user_skill_map:
                    # Missing skill
                    gaps.append({
                        'skill_id': cs.skill.id,
                        'skill_name': cs.skill.name,
                        'category': cs.skill.category,
                        'current_level': 'Not acquired',
                        'required_level': cs.required_level,
                        'gap': req_level_idx + 1
                    })
                else:
                    user_level = user_skill_map[cs.skill_id]
                    user_level_idx = proficiency_levels.index(user_level.lower()) if user_level.lower() in proficiency_levels else 0
                    
                    if user_level_idx < req_level_idx:
                        gaps.append({
                            'skill_id': cs.skill.id,
                            'skill_name': cs.skill.name,
                            'category': cs.skill.category,
                            'current_level': user_level,
                            'required_level': cs.required_level,
                            'gap': req_level_idx - user_level_idx
                        })
                    else:
                        met_requirements.append({
                            'skill_id': cs.skill.id,
                            'skill_name': cs.skill.name,
                            'current_level': user_level,
                            'required_level': cs.required_level
                        })
            
            total_required = len(career_skills)
            met_count = len(met_requirements)
            readiness = (met_count / total_required * 100) if total_required > 0 else 0
            
            return {
                'career_title': career.title,
                'met_requirements': met_requirements,
                'gaps': gaps,
                'total_required_skills': total_required,
                'met_skills_count': met_count,
                'readiness_percentage': round(readiness)
            }
        except Exception as e:
            logger.error(f"Error calculating skill gap: {str(e)}")
            raise

    @staticmethod
    def save_career(user_id, career_id):
        """Save a career to user's profile"""
        try:
            existing = g.db.query(SavedCareer).filter_by(user_id=user_id, career_id=career_id).first()
            if existing:
                return False
            
            saved_career = SavedCareer(user_id=user_id, career_id=career_id)
            g.db.add(saved_career)
            g.db.commit()
            return True
        except Exception as e:
            g.db.rollback()
            logger.error(f"Error saving career: {str(e)}")
            raise

    @staticmethod
    def unsave_career(user_id, career_id):
        """Remove a career from user's saved careers"""
        try:
            saved_career = g.db.query(SavedCareer).filter_by(user_id=user_id, career_id=career_id).first()
            if saved_career:
                g.db.delete(saved_career)
                g.db.commit()
                return True
            return False
        except Exception as e:
            g.db.rollback()
            logger.error(f"Error unsaving career: {str(e)}")
            raise

    @staticmethod
    def get_saved_careers(user_id):
        """Get all saved careers for the current user"""
        try:
            saved_careers = g.db.query(SavedCareer).options(joinedload(SavedCareer.career)).filter_by(user_id=user_id).order_by(SavedCareer.saved_at.desc()).all()
            
            return [{
                'id': sc.career.id,
                'title': sc.career.title,
                'description': sc.career.description,
                'salary_range': sc.career.salary_range,
                'demand_level': sc.career.demand_level,
                'saved_at': sc.saved_at.isoformat()
            } for sc in saved_careers]
        except Exception as e:
            logger.error(f"Error fetching saved careers: {str(e)}")
            raise

    @staticmethod
    def download_career_report(user_id, career_id):
        """Generate PDF report and return buffer for download"""
        from services.career_report_service import CareerReportService
        return CareerReportService.download_career_report(user_id, career_id, CareerService.calculate_skill_gap)

    @staticmethod
    def generate_career_report(user_id, career_id):
        """Generate PDF report and email it"""
        from services.career_report_service import CareerReportService
        return CareerReportService.generate_career_report(user_id, career_id, CareerService.calculate_skill_gap)

    @staticmethod
    def generate_comparison_report(user_id, career_ids):
        """Generate comparison PDF and email it"""
        from services.career_report_service import CareerReportService
        return CareerReportService.generate_comparison_report(user_id, career_ids, CareerService.calculate_skill_gap)

    @staticmethod
    def download_comparison_report(user_id, career_ids):
        """Generate comparison PDF and return buffer for download"""
        from services.career_report_service import CareerReportService
        return CareerReportService.download_comparison_report_buffer(user_id, career_ids, CareerService.calculate_skill_gap)
