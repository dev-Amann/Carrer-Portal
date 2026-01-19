"""
Flask application entry point
Initializes Flask app with CORS, SQLAlchemy, and error handlers
"""
from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.exc import SQLAlchemyError
from config import Config
import logging

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Validate configuration
Config.validate()

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if app.config['FLASK_ENV'] == 'development' else logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configure CORS
CORS(app, origins=app.config['CORS_ORIGINS'], supports_credentials=True)

# Initialize Flask-Mail
from utils.email_sender import init_mail
init_mail(app)

# Initialize Flask-Limiter for rate limiting
from utils.limiter import init_limiter
limiter = init_limiter(app)
logger.info("Flask-Limiter initialized")

# Initialize SQLAlchemy engine and session
try:
    engine = create_engine(
        app.config['SQLALCHEMY_DATABASE_URI'],
        echo=app.config['SQLALCHEMY_ECHO'],
        pool_pre_ping=True,
        pool_recycle=3600,
        connect_args={
            'charset': 'utf8mb4',
            'use_unicode': True
        }
    )
    SessionLocal = scoped_session(sessionmaker(bind=engine))
    logger.info("Database connection established successfully")
except SQLAlchemyError as e:
    logger.error(f"Database connection failed: {str(e)}")
    SessionLocal = None


# Make session available to routes
@app.before_request
def before_request():
    """Create database session before each request"""
    from flask import g
    if SessionLocal:
        g.db = SessionLocal()


@app.teardown_request
def teardown_request(exception=None):
    """Close database session after each request"""
    from flask import g
    db = g.pop('db', None)
    if db is not None:
        if exception:
            db.rollback()
        db.close()


# Error Handlers
@app.errorhandler(404)
def not_found_error(error):
    """Handle 404 Not Found errors"""
    logger.warning(f"404 error: {error}")
    return jsonify({
        'success': False,
        'error': 'Resource not found',
        'code': 'NOT_FOUND'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 Internal Server errors"""
    logger.error(f"500 error: {error}")
    return jsonify({
        'success': False,
        'error': 'Internal server error',
        'code': 'INTERNAL_ERROR'
    }), 500


@app.errorhandler(429)
def ratelimit_handler(error):
    """Handle rate limit exceeded errors"""
    logger.warning(f"Rate limit exceeded: {error}")
    return jsonify({
        'success': False,
        'error': 'Too many requests. Please try again later.',
        'code': 'RATE_LIMIT_EXCEEDED'
    }), 429


@app.errorhandler(Exception)
def handle_exception(error):
    """Handle all unhandled exceptions"""
    logger.error(f"Unhandled exception: {str(error)}", exc_info=True)
    
    # Check if it's an HTTP exception
    if hasattr(error, 'code'):
        return jsonify({
            'success': False,
            'error': str(error),
            'code': 'HTTP_ERROR'
        }), error.code
    
    # Return 500 for all other exceptions
    return jsonify({
        'success': False,
        'error': 'An unexpected error occurred',
        'code': 'UNEXPECTED_ERROR'
    }), 500


# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    db_status = 'connected'
    try:
        if SessionLocal:
            db = SessionLocal()
            db.execute('SELECT 1')
            db.close()
    except Exception as e:
        db_status = f'disconnected: {str(e)}'
        logger.error(f"Health check failed: {str(e)}")
    
    return jsonify({
        'status': 'healthy' if db_status == 'connected' else 'unhealthy',
        'database': db_status,
        'environment': app.config['FLASK_ENV']
    }), 200 if db_status == 'connected' else 503


# Import and register blueprints
from routes.auth import auth_bp
from routes.contact import contact_bp
from routes.careers import careers_bp
from routes.experts import experts_bp
from routes.bookings import bookings_bp
from routes.payments import payments_bp
from routes.admin import admin_bp
from routes.expert_dashboard import expert_dashboard_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(contact_bp, url_prefix='/api/contact')
app.register_blueprint(careers_bp, url_prefix='/api')
app.register_blueprint(experts_bp, url_prefix='/api/experts')
app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
app.register_blueprint(payments_bp, url_prefix='/api/payments')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(expert_dashboard_bp, url_prefix='/api/expert-dashboard')


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=app.config['FLASK_ENV'] == 'development'
    )
