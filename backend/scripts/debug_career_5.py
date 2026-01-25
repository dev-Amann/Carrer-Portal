from app import app
from models import Career, CareerSkill, Skill
from config import Config
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

def debug_career():
    print("Debugging Career ID 5...")
    engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        c = session.query(Career).filter_by(id=5).first()
        if not c:
            print("Career ID 5 NOT FOUND.")
        else:
            print(f"Career Found: {c.title}")
            skills = session.query(CareerSkill).filter_by(career_id=5).all()
            print(f"Skill Count: {len(skills)}")
            for cs in skills:
                skill = session.query(Skill).filter_by(id=cs.skill_id).first()
                print(f" - Skill: {skill.name} (Required: {cs.required_level})")
                
    except Exception as e:
        print(f"Error: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    debug_career()
