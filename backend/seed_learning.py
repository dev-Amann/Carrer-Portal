"""
Seed learning_resources table with roadmap.sh links for each career.
Run once: python seed_learning.py
"""
from app import app, SessionLocal
from models import Career, LearningResource
import logging

logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)

# Mapping: career title -> list of (title, url, resource_type)
CAREER_RESOURCES = {
    'Full Stack Developer': [
        ('Full Stack Developer Roadmap', 'https://roadmap.sh/full-stack', 'course'),
        ('Frontend Developer Roadmap', 'https://roadmap.sh/frontend', 'course'),
        ('Backend Developer Roadmap', 'https://roadmap.sh/backend', 'course'),
    ],
    'Data Scientist': [
        ('Data Science Roadmap', 'https://roadmap.sh/data-analyst', 'course'),
        ('Python Developer Roadmap', 'https://roadmap.sh/python', 'course'),
        ('SQL Roadmap', 'https://roadmap.sh/sql', 'course'),
    ],
    'DevOps Engineer': [
        ('DevOps Roadmap', 'https://roadmap.sh/devops', 'course'),
        ('Docker Roadmap', 'https://roadmap.sh/docker', 'course'),
        ('Kubernetes Roadmap', 'https://roadmap.sh/kubernetes', 'course'),
    ],
    'Mobile App Developer': [
        ('Android Developer Roadmap', 'https://roadmap.sh/android', 'course'),
        ('React Native Roadmap', 'https://roadmap.sh/react-native', 'course'),
        ('Flutter Developer Roadmap', 'https://roadmap.sh/flutter', 'course'),
    ],
    'Machine Learning Engineer': [
        ('AI & Data Scientist Roadmap', 'https://roadmap.sh/ai-data-scientist', 'course'),
        ('MLOps Roadmap', 'https://roadmap.sh/mlops', 'course'),
        ('Python Developer Roadmap', 'https://roadmap.sh/python', 'course'),
    ],
    'Cloud Architect': [
        ('AWS Roadmap', 'https://roadmap.sh/aws', 'course'),
        ('DevOps Roadmap', 'https://roadmap.sh/devops', 'course'),
        ('System Design Roadmap', 'https://roadmap.sh/system-design', 'course'),
    ],
    'Frontend Developer': [
        ('Frontend Developer Roadmap', 'https://roadmap.sh/frontend', 'course'),
        ('React Roadmap', 'https://roadmap.sh/react', 'course'),
        ('JavaScript Roadmap', 'https://roadmap.sh/javascript', 'course'),
    ],
    'Backend Developer': [
        ('Backend Developer Roadmap', 'https://roadmap.sh/backend', 'course'),
        ('Node.js Roadmap', 'https://roadmap.sh/nodejs', 'course'),
        ('Python Developer Roadmap', 'https://roadmap.sh/python', 'course'),
    ],
    'UI/UX Designer': [
        ('UX Design Roadmap', 'https://roadmap.sh/ux-design', 'course'),
        ('Design System Roadmap', 'https://roadmap.sh/design-system', 'course'),
        ('Frontend Developer Roadmap', 'https://roadmap.sh/frontend', 'course'),
    ],
    'Cybersecurity Analyst': [
        ('Cyber Security Roadmap', 'https://roadmap.sh/cyber-security', 'course'),
        ('Backend Developer Roadmap', 'https://roadmap.sh/backend', 'course'),
        ('DevOps Roadmap', 'https://roadmap.sh/devops', 'course'),
    ],
}


def seed():
    with app.app_context():
        session = SessionLocal()
        try:
            # Check if already seeded
            existing = session.query(LearningResource).count()
            if existing > 0:
                print(f"Table already has {existing} resources. Skipping seed.")
                return

            careers = session.query(Career).all()
            added = 0

            for career in careers:
                resources = CAREER_RESOURCES.get(career.title, [])
                if not resources:
                    print(f"  No mapping for '{career.title}', skipping.")
                    continue

                for title, url, res_type in resources:
                    lr = LearningResource(
                        career_id=career.id,
                        title=title,
                        url=url,
                        resource_type=res_type
                    )
                    session.add(lr)
                    added += 1

            session.commit()
            print(f"✅ Successfully added {added} learning resources!")

        except Exception as e:
            session.rollback()
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()
        finally:
            session.close()


if __name__ == "__main__":
    seed()
