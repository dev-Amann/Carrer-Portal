from app import app
from models import CareerSkill, Skill, Career
from config import Config
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

def check_data():
    print("Checking Database Data...")
    engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        skills_count = session.query(Skill).count()
        careers_count = session.query(Career).count()
        cs_count = session.query(CareerSkill).count()
        
        print(f"Skills count: {skills_count}")
        print(f"Careers count: {careers_count}")
        print(f"CareerSkills count: {cs_count}")
        
        if cs_count == 0:
            print("WARNING: No CareerSkills found! Seed data might be missing.")
        else:
            print("\nSample Career Skills:")
            for cs in session.query(CareerSkill).limit(5).all():
                print(f"Career {cs.career_id} requires Skill {cs.skill_id} ({cs.required_level})")
                
    except Exception as e:
        print(f"Error checking DB: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    check_data()
