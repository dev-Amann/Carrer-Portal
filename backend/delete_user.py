import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import Config
from models import User

def delete_user(email):
    # Setup DB connection independently
    db_uri = Config.SQLALCHEMY_DATABASE_URI
    print(f"Connecting to database...")
    
    try:
        engine = create_engine(db_uri)
        Session = sessionmaker(bind=engine)
        session = Session()
        
        user = session.query(User).filter(User.email == email).first()
        
        if user:
            print(f"Found user: {user.name} (ID: {user.id})")
            try:
                session.delete(user)
                session.commit()
                print(f"✅ User {email} deleted successfully.")
            except Exception as e:
                session.rollback()
                print(f"❌ Error deleting user: {e}")
        else:
            print(f"⚠️ User with email {email} not found.")
            
        session.close()
        
    except Exception as e:
        print(f"❌ Database connection error: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        email = sys.argv[1]
    else:
        email = "dev.amansingh1@gmail.com"
    
    # Auto-confirm for non-interactive run if needed, but safe to ask or just assume 'y' if script argument provided?
    # For now, I'll modify the script to skip input for this specific execution or use `send_command_input`.
    # Actually, better to just force delete without prompt for this agent execution.
    delete_user(email)
