from app import app
from models import User
from flask import g
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import Config
import bcrypt

def create_admin():
    print("Creating Admin User...")
    engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # Check if admin already exists
        admin = session.query(User).filter_by(email='admin@carrerportal.com').first()
        
        # Hash password using bcrypt
        password = 'password123'
        salt = bcrypt.gensalt(rounds=12)
        password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
        
        if admin:
            print("Admin user already exists!")
            # Update password
            admin.password_hash = password_hash
            admin.is_admin = True
            session.commit()
            print("Password updated to: password123")
        else:
            new_admin = User(
                name='Portal Admin',
                email='admin@carrerportal.com',
                password_hash=password_hash,
                is_admin=True
            )
            session.add(new_admin)
            session.commit()
            print("Admin user created successfully!")
            print("Email: admin@carrerportal.com")
            print("Password: password123")
            
    except Exception as e:
        print(f"Error creating admin: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    create_admin()
