# 🗄️ Database Setup Instructions

## Quick Start (Easiest Method)

### **Option 1: Double-Click Setup (Windows)**

1. **Double-click** `setup_db.cmd` in the project root
2. **Enter your MySQL root password** when prompted
3. **Wait** for the setup to complete
4. **Done!** You should see 5-6 experts listed

### **Option 2: PowerShell Script (Windows)**

1. **Right-click** `setup_db_interactive.ps1`
2. **Select** "Run with PowerShell"
3. **Enter your MySQL root password** when prompted
4. **Wait** for the setup to complete

### **Option 3: Manual Commands (Any OS)**

Open your terminal/command prompt and run:

```bash
# 1. Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS carrerportal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Run schema
mysql -u root -p carrerportal < backend/data/schema.sql

# 3. Run migration
mysql -u root -p carrerportal < backend/data/migration_add_expert_fields.sql

# 4. Seed experts
mysql -u root -p carrerportal < backend/data/seed_experts_complete.sql
```

You'll be prompted for your MySQL password after each command.

---

## What Gets Set Up

### ✅ Database Structure
- Creates `carrerportal` database
- Creates all necessary tables (users, experts, bookings, etc.)
- Adds new expert fields (linkedin_url, github_url, specialization, etc.)

### ✅ Test Data
**6 Expert Profiles:**

1. **John Smith** - Full-Stack Development (₹1500/hr) ✅ Approved
2. **Sarah Johnson** - Data Science & ML (₹2000/hr) ✅ Approved
3. **Michael Chen** - Product Management (₹1800/hr) ✅ Approved
4. **Emily Davis** - UX/UI Design (₹1200/hr) ✅ Approved
5. **David Wilson** - DevOps & Cloud (₹1600/hr) ✅ Approved
6. **Pending Expert** - Cybersecurity (₹1400/hr) ⏳ Pending Approval

**All test users have password:** `password123`

---

## Verify Setup

### Check if experts are loaded:

```bash
mysql -u root -p carrerportal -e "SELECT id, specialization, status FROM experts;"
```

You should see 6 experts (5 approved, 1 pending).

### Check table structure:

```bash
mysql -u root -p carrerportal -e "DESCRIBE experts;"
```

You should see columns like `linkedin_url`, `github_url`, `specialization`, etc.

---

## Test the Application

### 1. Start Backend
```bash
cd backend
python app.py
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Experts Page
- Visit: `http://localhost:5173/experts`
- You should see 5 approved experts

### 4. Test Admin Dashboard
- Login as admin (you'll need to create an admin user or modify a user)
- Visit: `http://localhost:5173/admin/dashboard`
- You should see 1 pending expert for approval

### 5. Test Expert Registration
- Login as any user
- Visit: `http://localhost:5173/expert/register`
- Fill out the form and submit

---

## Troubleshooting

### ❌ "Access denied for user 'root'"
**Solution:** Check your MySQL password. The default is often empty or "root".

### ❌ "Database 'carrerportal' doesn't exist"
**Solution:** Run the create database command first:
```bash
mysql -u root -p -e "CREATE DATABASE carrerportal;"
```

### ❌ "Table 'experts' doesn't exist"
**Solution:** Run schema.sql first:
```bash
mysql -u root -p carrerportal < backend/data/schema.sql
```

### ❌ "Column 'specialization' doesn't exist"
**Solution:** Run the migration:
```bash
mysql -u root -p carrerportal < backend/data/migration_add_expert_fields.sql
```

### ❌ "Duplicate entry" errors when seeding
**Solution:** The data might already exist. You can either:
- Skip it (it's fine)
- Or reset the database:
```bash
mysql -u root -p -e "DROP DATABASE carrerportal; CREATE DATABASE carrerportal;"
# Then run all setup steps again
```

---

## Reset Database (Start Fresh)

If you want to completely reset and start over:

```bash
# Drop and recreate database
mysql -u root -p -e "DROP DATABASE IF EXISTS carrerportal; CREATE DATABASE carrerportal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run all setup steps again
mysql -u root -p carrerportal < backend/data/schema.sql
mysql -u root -p carrerportal < backend/data/migration_add_expert_fields.sql
mysql -u root -p carrerportal < backend/data/seed_experts_complete.sql
```

---

## Common MySQL Passwords

If you're not sure what your MySQL password is, try these common defaults:
- Empty (just press Enter)
- `root`
- `password`
- `admin`
- `mysql`

Or reset your MySQL password following MySQL documentation.

---

## Need Help?

If you're still having issues:

1. **Check MySQL is running:**
   ```bash
   mysql --version
   ```

2. **Check you can connect:**
   ```bash
   mysql -u root -p
   ```

3. **Check the backend logs** when starting the Flask app

4. **Check browser console** for any API errors

---

## Files Created

- ✅ `setup_db.cmd` - Windows batch script
- ✅ `setup_db_interactive.ps1` - PowerShell script
- ✅ `backend/data/migration_add_expert_fields.sql` - Database migration
- ✅ `backend/data/seed_experts_complete.sql` - Expert seed data
- ✅ `backend/data/SETUP_DATABASE.md` - Detailed documentation

---

## Success Indicators

After successful setup, you should see:

✅ Database `carrerportal` exists  
✅ Table `experts` has new columns  
✅ 6 experts in database (5 approved, 1 pending)  
✅ `/experts` page shows 5 experts  
✅ Admin dashboard shows 1 pending expert  
✅ Expert registration form works  

**You're all set! 🎉**
