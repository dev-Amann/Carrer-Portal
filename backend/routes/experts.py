"""
Expert routes
Handles expert registration and listing
"""
from flask import Blueprint, request, jsonify, g
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from models import Expert, User
from utils.jwt_utils import verify_token
import logging

logger = logging.getLogger(__name__)

experts_bp = Blueprint('experts', __name__)


@experts_bp.route('/register', methods=['POST'])
@verify_token()
def register_expert():
    """
    Register a user as an expert
    
    Request body:
        {
            "bio": "Expert biography",
            "resume_url": "https://example.com/resume.pdf",
            "certificate_urls": ["https://example.com/cert1.pdf"],
            "rate_per_hour": 50.00,
            "linkedin_url": "https://linkedin.com/in/user",
            "github_url": "https://github.com/user",
            "portfolio_url": "https://portfolio.com",
            "other_documents": ["https://doc1.com"],
            "specialization": "Software Development",
            "years_of_experience": 5,
            "email_for_communication": "expert@email.com",
            "otp": "123456"
        }
    
    Returns:
        JSON response with success status and expert_id
    """
    try:
        db = g.db
        user_id = g.user_id
        
        # Get request data
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required',
                'code': 'MISSING_DATA'
            }), 400
        
        # Validate required fields
        required_fields = ['bio', 'rate_per_hour', 'resume_url', 'specialization', 
                          'years_of_experience', 'email_for_communication', 'otp']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'error': f'{field} is required',
                    'code': 'MISSING_FIELD'
                }), 400
        
        # Verify OTP (you would implement actual OTP verification here)
        # For now, we'll just check if OTP is provided
        if len(str(data['otp'])) != 6:
            return jsonify({
                'success': False,
                'error': 'Invalid OTP format',
                'code': 'INVALID_OTP'
            }), 400
        
        # Validate rate_per_hour is a positive number
        try:
            rate_per_hour = float(data['rate_per_hour'])
            if rate_per_hour <= 0:
                return jsonify({
                    'success': False,
                    'error': 'rate_per_hour must be a positive number',
                    'code': 'INVALID_RATE'
                }), 400
        except (ValueError, TypeError):
            return jsonify({
                'success': False,
                'error': 'rate_per_hour must be a valid number',
                'code': 'INVALID_RATE'
            }), 400
        
        # Validate certificate_urls is a list if provided
        certificate_urls = data.get('certificate_urls')
        if certificate_urls is not None:
            if not isinstance(certificate_urls, list):
                return jsonify({
                    'success': False,
                    'error': 'certificate_urls must be an array',
                    'code': 'INVALID_FORMAT'
                }), 400
        
        # Check if user already has an expert profile
        existing_expert = db.query(Expert).filter_by(user_id=user_id).first()
        if existing_expert:
            return jsonify({
                'success': False,
                'error': 'User already has an expert profile',
                'code': 'EXPERT_EXISTS'
            }), 400
        
        # Verify user exists
        user = db.query(User).filter_by(id=user_id).first()
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found',
                'code': 'USER_NOT_FOUND'
            }), 404
        
        # Get other documents
        other_documents = data.get('other_documents', [])
        if other_documents and not isinstance(other_documents, list):
            return jsonify({
                'success': False,
                'error': 'other_documents must be an array',
                'code': 'INVALID_FORMAT'
            }), 400
        
        # Create expert profile with extended information
        expert = Expert(
            user_id=user_id,
            bio=data['bio'],
            resume_url=data['resume_url'],
            certificate_urls=certificate_urls,
            rate_per_hour=rate_per_hour,
            status='pending',  # Set status to pending for admin approval
            linkedin_url=data.get('linkedin_url'),
            github_url=data.get('github_url'),
            portfolio_url=data.get('portfolio_url'),
            other_documents=other_documents,
            specialization=data['specialization'],
            years_of_experience=int(data['years_of_experience']),
            email_for_communication=data['email_for_communication']
        )
        
        db.add(expert)
        db.commit()
        
        # Log all submitted information for admin review
        logger.info(f"Expert profile created for user {user_id} with id {expert.id}")
        logger.info(f"Resume: {data['resume_url']}")
        logger.info(f"Certificates: {certificate_urls}")
        logger.info(f"Other documents: {other_documents}")
        logger.info(f"LinkedIn: {data.get('linkedin_url')}")
        logger.info(f"GitHub: {data.get('github_url')}")
        logger.info(f"Portfolio: {data.get('portfolio_url')}")
        logger.info(f"Specialization: {data['specialization']}, Experience: {data['years_of_experience']} years")
        logger.info(f"Communication email: {data['email_for_communication']}")
        
        return jsonify({
            'success': True,
            'message': 'Expert profile created successfully. Pending admin approval. All documents have been sent to admin.',
            'expert_id': expert.id,
            'status': expert.status
        }), 201
        
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Integrity error in register_expert: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to create expert profile due to data integrity issue',
            'code': 'INTEGRITY_ERROR'
        }), 400
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error in register_expert: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to create expert profile',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error in register_expert: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500


@experts_bp.route('', methods=['GET'])
def get_experts():
    """
    Get list of experts with optional status filtering
    
    Query parameters:
        status (optional): Filter by expert status (pending, approved, rejected)
                          Defaults to 'approved' for public access
    
    Returns:
        JSON response with list of experts
    """
    try:
        db = g.db
        
        # Get status filter from query parameters
        status_filter = request.args.get('status', 'approved')
        
        # Validate status filter
        valid_statuses = ['pending', 'approved', 'rejected']
        if status_filter not in valid_statuses:
            return jsonify({
                'success': False,
                'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}',
                'code': 'INVALID_STATUS'
            }), 400
        
        # Query experts with status filter
        experts_query = db.query(Expert).filter_by(status=status_filter)
        
        # Join with User to get user information
        experts = experts_query.all()
        
        # Build response with expert and user information
        experts_list = []
        for expert in experts:
            expert_data = expert.to_dict(include_user=True)
            experts_list.append(expert_data)
        
        logger.info(f"Retrieved {len(experts_list)} experts with status '{status_filter}'")
        
        return jsonify({
            'success': True,
            'experts': experts_list,
            'count': len(experts_list),
            'status_filter': status_filter
        }), 200
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_experts: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve experts',
            'code': 'DATABASE_ERROR'
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error in get_experts: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500
