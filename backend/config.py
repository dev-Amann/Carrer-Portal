"""
Configuration file for environment variables
Loads and validates environment variables for the Flask application
"""
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

# Load environment variables from .env file
load_dotenv()


class Config:
    """Base configuration class"""
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    
    # Database Configuration
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '3306')
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_NAME = os.getenv('DB_NAME', 'carrerportal')
    
    # Construct SQLAlchemy database URI (URL-encode password to handle special characters)
    encoded_password = quote_plus(DB_PASSWORD) if DB_PASSWORD else ''
    SQLALCHEMY_DATABASE_URI = f"mysql+mysqlconnector://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = FLASK_ENV == 'development'
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 900))  # 15 minutes
    JWT_REFRESH_TOKEN_EXPIRES = int(os.getenv('JWT_REFRESH_TOKEN_EXPIRES', 604800))  # 7 days
    
    # Email Configuration
    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
    MAIL_USERNAME = os.getenv('MAIL_USERNAME', '')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD', '')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', '')
    ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'admin@carrerportal.com')
    
    # Frontend URL for email links
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
    
    # Optional: SendGrid Configuration
    SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY', '')
    
    # Razorpay Configuration
    RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID', '')
    RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET', '')
    
    # Optional: reCAPTCHA Configuration
    RECAPTCHA_SECRET_KEY = os.getenv('RECAPTCHA_SECRET_KEY', '')
    
    # CORS Configuration
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(',')
    
    # Rate Limiting
    RATELIMIT_STORAGE_URL = os.getenv('RATELIMIT_STORAGE_URL', 'memory://')
    
    @staticmethod
    def validate():
        """Validate required configuration values"""
        required_vars = []
        
        if not Config.SECRET_KEY or Config.SECRET_KEY == 'dev-secret-key-change-in-production':
            if Config.FLASK_ENV == 'production':
                required_vars.append('SECRET_KEY')
        
        if not Config.JWT_SECRET_KEY or Config.JWT_SECRET_KEY == 'dev-jwt-secret-change-in-production':
            if Config.FLASK_ENV == 'production':
                required_vars.append('JWT_SECRET_KEY')
        
        if required_vars and Config.FLASK_ENV == 'production':
            raise ValueError(f"Missing required environment variables: {', '.join(required_vars)}")
        
        return True
