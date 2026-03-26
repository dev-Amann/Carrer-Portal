# CareerPortal Project Documentation

## 📂 Database Structure (.sql Files)

There are **6** SQL files in the project, serving the following purposes:

1.  **`backend/data/schema.sql`**: 
    - **Purpose**: Defines the database structure (tables, relationships, constraints).
    - **Content**: Creates tables for `users`, `experts`, `skills`, `careers`, `bookings`, etc.

2.  **`backend/data/seed.sql`**:
    - **Purpose**: Populates the database with initial static data.
    - **Content**: Inserts default admin user, basic career categories, etc.

3.  **`backend/data/seed_skills.sql`**:
    - **Purpose**: Seeds the comprehensive list of technical and soft skills.
    - **Content**: Inserts skills like "Python", "React", "Communication", "Leadership".

4.  **`backend/data/seed_experts.sql`**:
    - **Purpose**: Adds initial test expert profiles.
    - **Content**: Dummy expert data for testing the booking flow.

5.  **`backend/data/seed_experts_complete.sql`**:
    - **Purpose**: A more extensive set of expert data.
    - **Content**: Full profiles for specific expert personas (e.g., "Senior DevOps Engineer").

6.  **`backend/data/migration_add_expert_fields.sql`**:
    - **Purpose**: Database schema migration script.
    - **Content**: alter table commands to add new columns (e.g., `github_url`, `portfolio_url`) to the `experts` table without deleting existing data.

---

## 🤖 Career Recommendation Engine

**Type**: **Rule-Based / Weighted Matching Algorithm** (Not AI/ML)

The recommendation logic is implemented in `backend/routes/careers.py`. It works as follows:

1.  **Input**: User's self-assessed skills and proficiency levels (Beginner, Intermediate, Advanced, Expert).
2.  **Mapping**: Proficiency levels are converted to numerical scores (1-4).
3.  **Matching**:
    - The system iterates through all available **Careers**.
    - For each career, it checks the **Required Skills**.
    - **Scoring**:
        - **Full Match (1.0)**: User proficiency >= Required proficiency.
        - **Partial Match (0.5)**: User has the skill but at a lower proficiency.
        - **No Match (0.0)**: User lacks the skill.
4.  **Ranking**: Careers are ranked by the percentage of matched requirements.

**Why Rule-Based?**
- **Deterministic**: Results are predictable and easy to explain.
- **Cold Start**: Works immediately without needing a massive dataset of user behaviors.

---

## 🔄 Core Workflows

### 1. Expert Registration Flow
1.  **User Signup**: User registers a standard account (`/auth/register`).
2.  **Expert Application**: User submits expert profile (`/expert/register`).
    - **Status**: Defaults to `PENDING`.
    - **Visibility**: Hidden from public listings.
3.  **Admin Approval**:
    - Admin logs in to `AdminDashboard`.
    - Reviews Application (Resume/Bio).
    - Clicks **Approve**.
    - **Status**: Updates to `APPROVED`.
    - **Visibility**: Now visible on "Find Expert" page.

### 2. Expert Booking Flow
1.  **Browse**: User selects an approved expert.
2.  **Booking**: User picks a time slot.
3.  **Validation**: Backend checks for conflicts and expert availability.
4.  **Meeting**: A Jitsi Meet room link is auto-generated for the session.
