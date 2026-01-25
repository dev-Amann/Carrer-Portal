from app import app
from models import Career, CareerSkill, UserSkill, Skill, User
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import Config

def simulate_gap_analysis_v2(career_id=5):
    print(f"Simulating Skill Gap V2 for Career {career_id}")
    engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # 1. Get/Create User
        user = session.query(User).filter_by(email='test_sim@example.com').first()
        if not user:
            print("Creating test user...")
            user = User(name='Test Sim', email='test_sim@example.com', password_hash='hash', is_admin=False)
            session.add(user)
            session.commit()
            print(f"Created User ID {user.id}")
        else:
            print(f"Using User ID {user.id}")
            
        # 2. Add 'Python' skill to user (Skill ID 1 usually)
        python_skill = session.query(Skill).filter_by(name='Python').first()
        if python_skill:
            print(f"Assigning Python (ID {python_skill.id}) to user with None proficiency...")
            # Clear existing
            session.query(UserSkill).filter_by(user_id=user.id).delete()
            # Add new with None
            us = UserSkill(user_id=user.id, skill_id=python_skill.id, proficiency=None)
            session.add(us)
            session.commit()
        else:
            print("Python skill not found in DB!")
            return

        # 3. Fetch User Skills
        user_skills = session.query(UserSkill).filter_by(user_id=user.id).all()
        user_skill_map = {us.skill_id: us.proficiency for us in user_skills}
        print(f"User Skill Map: {user_skill_map}")
        
        # 4. Fetch Career Skills
        career_skills = session.query(CareerSkill).filter_by(career_id=career_id).all()
        
        proficiency_order = ['beginner', 'intermediate', 'advanced', 'expert']
        
        for cs in career_skills:
            print(f"Checking Skill {cs.skill_id} (Req: {cs.required_level})")
            if cs.skill_id in user_skill_map:
                current = user_skill_map[cs.skill_id]
                
                # THIS IS THE LOGIC COPY FROM THE ROUTE BEFORE FIX (to see if it crashes)
                # Actually, I should check if it crashes using the logic I *think* is there
                # But to test the fix, I should use the logic that IS in the file?
                # No, I want to reproduce the crash. 
                
                try:
                    # Logic without the fix check
                    curr_idx = proficiency_order.index(current.lower()) 
                    req_idx = proficiency_order.index(cs.required_level.lower())
                    print(f" - Found: {current} (Idx: {curr_idx}) vs Required (Idx: {req_idx})")
                        
                except Exception as e:
                    print(f" - CRASHED AS EXPECTED: {e}")
            else:
                print(" - Missing")
                
        print("Simulation V2 Complete.")

    except Exception as e:
        print(f"CRITICAL ERROR during simulation: {e}")
        import traceback
        traceback.print_exc()
    finally:
        session.close()

if __name__ == "__main__":
    simulate_gap_analysis_v2()
