# Database Setup Guide

## Prerequisites
- MySQL installed and running
- Database `carrerportal` created

## Step-by-Step Setup

### 1. Create Database (if not exists)
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS carrerportal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 2. Run Initial Schema
```bash
mysql -u root -p carrerportal < backend/data/schema.sql
```

### 3. Run Migration for New Expert Fields
```bash
mysql -u root -p carrerportal < backend/data/migration_add_expert_fields.sql
```

### 4. Seed Initial Data
```bash
# Seed skills
mysql -u root -p carrerportal < backend/data/seed_skills.sql

# Seed careers
mysql -u root -p carrerportal < backend/data/seed.sql

# Seed experts with complete data
mysql -u root -p carrerportal < backend/data/seed_experts_complete.sql
```

## Quick Setup (All in One)

### For Windows (PowerShell):
```powershell
# Set your MySQL password
$password = "your_password"

# Run all commands
mysql -u root -p$password -e "CREATE DATABASE IF NOT EXISTS carrerportal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p$password carrerportal < backend/data/schema.sql
mysql -u root -p$password carrerportal < backend/data/migration_add_expert_fields.sql
mysql -u root -p$password carrerportal < backend/data/seed_skills.sql
mysql -u root -p$password carrerportal < backend/data/seed.sql
mysql -u root -p$password carrerportal < backend/data/seed_experts_complete.sql
```

### For Linux/Mac (Bash):
```bash
# You'll be prompted for password
mysql -u root -p carrerportal < backend/data/schema.sql
mysql -u root -p carrerportal < backend/data/migration_add_expert_fields.sql
mysql -u root -p carrerportal < backend/data/seed_skills.sql
mysql -u root -p carrerportal < backend/data/seed.sql
mysql -u root -p carrerportal < backend/data/seed_experts_complete.sql
```

## Verify Setup

### Check if experts table has new columns:
```sql
mysql -u root -p carrerportal -e "DESCRIBE experts;"
```

You should see these columns:
- linkedin_url
- github_url
- portfolio_url
- other_documents
- specialization
- years_of_experience
- email_for_communication

### Check if experts are seeded:
```sql
mysql -u root -p carrerportal -e "SELECT id, specialization, status FROM experts;"
```

You should see 6 experts (5 approved, 1 pending).

## Troubleshooting

### If migration fails with "column already exists":
The columns might already be added. You can skip the migration or drop and recreate:
```sql
-- Check existing columns
DESCRIBE experts;

-- If needed, drop the table and start fresh
DROP TABLE IF EXISTS experts;
-- Then run schema.sql again
```

### If you get "table doesn't exist":
Make sure you ran schema.sql first:
```bash
mysql -u root -p carrerportal < backend/data/schema.sql
```

### If foreign key errors occur:
Make sure users table exists and has data:
```sql
SELECT * FROM users LIMIT 5;
```

## Test Data Credentials

All test users have the same password: `password123`

**Test Experts:**
- john.expert@example.com - Full-Stack Development
- sarah.expert@example.com - Data Science & ML
- michael.expert@example.com - Product Management
- emily.expert@example.com - UX/UI Design
- david.expert@example.com - DevOps & Cloud
- pending.expert@example.com - Cybersecurity (Pending Approval)

## Reset Database

If you want to start fresh:
```bash
mysql -u root -p -e "DROP DATABASE carrerportal; CREATE DATABASE carrerportal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
# Then run all setup steps again
```
