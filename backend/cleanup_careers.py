from app import app
from models import Career, CareerSkill
from config import Config
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

def cleanup():
    print("Cleaning up careers with 0 skills...")
    engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        careers = session.query(Career).all()
        deleted_count = 0
        
        for c in careers:
            skill_count = session.query(CareerSkill).filter_by(career_id=c.id).count()
            if skill_count == 0:
                print(f"Deleting Career ID {c.id}: {c.title}")
                session.delete(c)
                deleted_count += 1
        
        if deleted_count > 0:
            session.commit()
            print(f"Successfully deleted {deleted_count} careers.")
        else:
            print("No careers with 0 skills found.")
            
    except Exception as e:
        session.rollback()
        print(f"Error cleaning DB: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    cleanup()
