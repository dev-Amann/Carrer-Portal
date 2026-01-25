from app import app
from models import Career, CareerSkill, UserSkill
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import Config

def simulate_gap_analysis(user_id=1, career_id=5):
    print(f"Simulating Skill Gap for User {user_id}, Career {career_id}")
    engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # 1. Fetch Career
        career = session.query(Career).filter_by(id=career_id).first()
        if not career:
            print("Career not found")
            return
            
        # 2. Fetch User Skills
        user_skills = session.query(UserSkill).filter_by(user_id=user_id).all()
        user_skill_map = {us.skill_id: us.proficiency for us in user_skills}
        print(f"User Skill Map: {user_skill_map}")
        
        # 3. Fetch Career Skills
        career_skills = session.query(CareerSkill).filter_by(career_id=career_id).all()
        if not career_skills:
            print("No career skills required")
            return

        proficiency_order = ['beginner', 'intermediate', 'advanced', 'expert']
        
        for cs in career_skills:
            print(f"Checking Skill {cs.skill_id} (Req: {cs.required_level})")
            if cs.skill_id in user_skill_map:
                current = user_skill_map[cs.skill_id]
                try:
                    curr_idx = proficiency_order.index(current.lower())
                    req_idx = proficiency_order.index(cs.required_level.lower())
                    print(f" - Found: {current} (Idx: {curr_idx}) vs Required (Idx: {req_idx})")
                except ValueError as ve:
                    print(f" - ERROR: Invalid proficiency value: {ve}")
            else:
                print(" - Missing")
                
        print("Simulation Complete - No crashes.")

    except Exception as e:
        print(f"CRITICAL ERROR during simulation: {e}")
        import traceback
        traceback.print_exc()
    finally:
        session.close()

if __name__ == "__main__":
    simulate_gap_analysis()
