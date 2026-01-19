# 🔧 Troubleshooting Guide - Common Issues

## Issues You're Experiencing:
1. ❌ Can't log in / Page refreshes on login
2. ❌ OTP is not coming
3. ❌ Can't create account
4. ❌ Experts are not visible on expert page
5. ❌ API requests failing / Network errors

---

## Quick Fixes (Try These First)

### 1️⃣ Check if Backend is Running

**Open a terminal in the backend folder and run:**
```bash
cd backend
python app.py
```

**You should see:**
```
* Running on http://127.0.0.1:5000
* Database connection established successfully
```

**If you see errors**, check:
- MySQL is running
- Database credentials in `.env` file are correct

---

### 2️⃣ Check if Frontend .env File Exists

**IMPORTANT: This is a common cause of login issues!**

**Check if the file exists:**
```bash
cd frontend
dir .env
```

**If the file doesn't exist, create it:**
```bash
copy .env.example .env
```

**Verify the content of frontend/.env:**
```
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

**After creating/updating .env, restart the frontend:**
```bash
# Stop the frontend server (Ctrl+C)
# Then restart it:
npm run dev
```

---

### 3️⃣ Check if Database is Set Up

**Run this command to verify:**
```bash
mysql -u root -p carrerportal -e "SELECT COUNT(*) FROM experts;"
```

**If you get an error**, run the database setup:
```bash
# Option 1: Double-click this file
setup_db.cmd

# Option 2: Manual setup
mysql -u root -p carrerportal < backend/data/schema.sql
mysql -u root -p carrerportal < backend/data/migration_add_expert_fields.sql
mysql -u root -p carrerportal < backend/data/seed_experts_complete.sql
```

---

### 3️⃣ Check Frontend is Running

**Open another terminal in the frontend folder:**
```bash
cd frontend
npm run dev
```

**You should see:**
```
Local: http://localhost:5173/
```

---

## Detailed Troubleshooting

### Issue: Can't Log In / Can't Create Account

**Possible Causes:**

#### A) Backend Not Running
**Check:** Is `python app.py` running in backend folder?
**Fix:** Start the backend:
```bash
cd backend
python app.py
```

#### B) Database Connection Error
**Check:** Look for this error in backend logs:
```
Database connection failed
```
**Fix:** Update `backend/.env` with correct MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=carrerportal
```

#### C) CORS Error
**Check:** Browser console shows:
```
Access to XMLHttpRequest blocked by CORS policy
```
**Fix:** Make sure backend `.env` has:
```env
CORS_ORIGINS=http://localhost:5173
```

---

### Issue: OTP Not Coming

**Possible Causes:**

#### A) Email Not Configured
**Check:** Backend logs show:
```
Admin email not configured
```
**Fix:** Add to `backend/.env`:
```env
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_DEFAULT_SENDER=your_email@gmail.com
ADMIN_EMAIL=your_email@gmail.com
```

#### B) Gmail App Password Not Set
**Fix:** 
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Generate App Password
4. Use that password in `MAIL_PASSWORD`

#### C) OTP Function Not Implemented
**Temporary Workaround:** Check backend logs for the OTP code (it's logged in development mode)

---

### Issue: Experts Not Visible

**Possible Causes:**

#### A) No Experts in Database
**Check:**
```bash
mysql -u root -p carrerportal -e "SELECT id, specialization, status FROM experts;"
```

**Fix:** Run seed data:
```bash
mysql -u root -p carrerportal < backend/data/seed_experts_complete.sql
```

#### B) API Endpoint Error
**Check:** Browser console (F12) shows:
```
GET http://localhost:5000/api/experts?status=approved 404
```

**Fix:** Make sure backend is running and routes are registered

#### C) All Experts are Pending
**Check:** Run this query:
```bash
mysql -u root -p carrerportal -e "SELECT status, COUNT(*) FROM experts GROUP BY status;"
```

**Fix:** If all are pending, approve them manually:
```bash
mysql -u root -p carrerportal -e "UPDATE experts SET status='approved' WHERE status='pending';"
```

---

## Step-by-Step Verification

### Step 1: Verify MySQL is Running
```bash
mysql --version
mysql -u root -p -e "SELECT 1;"
```

### Step 2: Verify Database Exists
```bash
mysql -u root -p -e "SHOW DATABASES LIKE 'carrerportal';"
```

### Step 3: Verify Tables Exist
```bash
mysql -u root -p carrerportal -e "SHOW TABLES;"
```

### Step 4: Verify Experts Data
```bash
mysql -u root -p carrerportal -e "SELECT * FROM experts;"
```

### Step 5: Check Backend Logs
Look for errors in the terminal where you ran `python app.py`

### Step 6: Check Browser Console
Press F12 → Console tab → Look for red errors

---

## Common Error Messages & Fixes

### Error: "Access denied for user 'root'@'localhost'"
**Fix:** Wrong MySQL password in `.env` file

### Error: "Table 'experts' doesn't exist"
**Fix:** Run schema.sql:
```bash
mysql -u root -p carrerportal < backend/data/schema.sql
```

### Error: "Column 'specialization' doesn't exist"
**Fix:** Run migration:
```bash
mysql -u root -p carrerportal < backend/data/migration_add_expert_fields.sql
```

### Error: "Failed to load experts"
**Fix:** Check if experts exist and are approved:
```bash
mysql -u root -p carrerportal -e "UPDATE experts SET status='approved';"
```

### Error: "Cannot connect to backend"
**Fix:** 
1. Check backend is running on port 5000
2. Check `VITE_API_URL` in frontend `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Complete Reset (If Nothing Works)

### 1. Stop Everything
- Close all terminals
- Stop MySQL if needed

### 2. Reset Database
```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS carrerportal; CREATE DATABASE carrerportal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 3. Run Complete Setup
```bash
# Run the setup script
setup_db.cmd

# OR manually:
mysql -u root -p carrerportal < backend/data/schema.sql
mysql -u root -p carrerportal < backend/data/migration_add_expert_fields.sql
mysql -u root -p carrerportal < backend/data/seed_experts_complete.sql
```

### 4. Start Backend
```bash
cd backend
python app.py
```

### 5. Start Frontend
```bash
cd frontend
npm run dev
```

### 6. Test
- Visit http://localhost:5173/experts
- You should see 5 experts

---

## Need More Help?

### Collect This Information:

1. **Backend logs** (copy the terminal output where you ran `python app.py`)
2. **Browser console errors** (F12 → Console → screenshot red errors)
3. **Database status:**
```bash
mysql -u root -p carrerportal -e "SELECT COUNT(*) as total_experts, SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END) as approved FROM experts;"
```

4. **Backend .env file** (remove passwords before sharing):
```bash
# Show your .env (without sensitive data)
cat backend/.env | grep -v PASSWORD
```

---

## Quick Test Commands

**Test if everything is working:**

```bash
# 1. Test MySQL
mysql -u root -p -e "SELECT 1;"

# 2. Test Database
mysql -u root -p carrerportal -e "SELECT COUNT(*) FROM experts WHERE status='approved';"

# 3. Test Backend (in another terminal)
curl http://localhost:5000/health

# 4. Test Experts API
curl http://localhost:5000/api/experts?status=approved
```

If all these work, your system is set up correctly!


---

## 🔍 Detailed Issue: 404 Email Not Registered

### Symptoms:
- Backend console shows: `"POST /api/auth/send-otp HTTP/1.1" 404 -`
- Login fails with "Invalid email or password"
- OTP request fails with "Email not registered"
- User lookup returns None

### Root Cause:
The user account was never created in the database. Registration failed due to OTP verification requirements.

### Solution:

**Create user account directly:**
```bash
# Run the SQL script
Get-Content create_user.sql | mysql -u root -pYourPassword carrerportal
```

**Or manually:**
```sql
INSERT INTO users (name, email, password_hash, is_admin)
VALUES (
    'Your Name',
    'your@email.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYfQRX.dWXC',
    0
);
```
This creates a user with password: **password123**

**Verify user exists:**
```bash
mysql -u root -pYourPassword carrerportal -e "SELECT * FROM users WHERE email='your@email.com';"
```

---

## 🔍 Detailed Issue: 401 Unauthorized - Password Incorrect

### Symptoms:
- Backend console shows: `"POST /api/auth/login HTTP/1.1" 401 -`
- User exists in database (SELECT query succeeds)
- Database ROLLBACK occurs
- Frontend shows "Invalid email or password"

### Root Cause:
The password you're entering doesn't match the hashed password stored in the database.

### Solutions:

#### Quick Fix: Reset Password to "password123"
```bash
fix_login_password.cmd
```
Choose option 2 for quick SQL fix.

#### Option 1: Python Script (Recommended)
```bash
python reset_user_password.py
```
This will prompt you to:
1. Enter email address
2. Enter new password
3. Confirm password

#### Option 2: SQL Command (Quick)
```bash
mysql -u root carrerportal
```
Then run:
```sql
UPDATE users 
SET password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYfQRX.dWXC' 
WHERE email = 'your@email.com';
```
This sets password to: **password123**

#### Option 3: Register New Account
If you can't reset the password, register a new account through the registration flow.

---

## 🔍 Detailed Issue: Login Page Refreshes Without Authentication

### Symptoms:
- Click login button → page refreshes
- No error messages shown
- Stay on login page
- Browser console shows errors

### Root Causes & Solutions:

#### Cause 1: Missing frontend/.env file ⚠️ MOST COMMON
**Solution:**
```bash
cd frontend
copy .env.example .env
# Then restart frontend: npm run dev
```

#### Cause 2: Backend not running
**Check:**
```bash
curl http://localhost:5000/health
```
**If it fails, start backend:**
```bash
cd backend
python app.py
```

#### Cause 3: Wrong API URL
**Check frontend/.env:**
```
VITE_API_URL=http://localhost:5000/api
```
**NOT:**
- ~~http://localhost:5000~~ (missing /api)
- ~~http://localhost:3000/api~~ (wrong port)

#### Cause 4: Browser console errors
**Open Developer Tools (F12) → Console tab**

**If you see:**
- `Failed to fetch` → Backend not running
- `CORS error` → Check backend CORS settings
- `undefined` in API URL → Missing .env file
- `401 Unauthorized` → Wrong credentials

### Testing Login Manually:

**Test with curl:**
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@carrerportal.com\",\"password\":\"admin123\"}"
```

**Expected response:**
```json
{
  "success": true,
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "user": {
    "id": 1,
    "email": "admin@carrerportal.com",
    "name": "Admin User",
    "is_admin": true
  }
}
```

### Still Not Working?

1. **Clear browser cache and localStorage:**
   - Open Developer Tools (F12)
   - Application tab → Storage → Clear site data
   - Refresh page

2. **Check both servers are running:**
   - Backend: http://localhost:5000/health
   - Frontend: http://localhost:5173 (or 3000)

3. **Verify database has users:**
   ```bash
   mysql -u root -p carrerportal -e "SELECT id, email, name, is_admin FROM users;"
   ```

4. **Check backend logs for errors:**
   - Look at the terminal where backend is running
   - Should show incoming requests and responses

5. **Try different browser or incognito mode:**
   - Sometimes browser extensions interfere

---

## 📧 Email/OTP Issues

If OTP emails are not arriving, check backend/.env:
```
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_app_specific_password
```

**Note:** Gmail requires an "App Password", not your regular password.
Generate one at: https://myaccount.google.com/apppasswords

---

## 🎯 Quick Diagnostic Checklist

Run through this checklist:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173 or 3000
- [ ] MySQL service running
- [ ] Database `carrerportal` exists
- [ ] frontend/.env file exists with correct VITE_API_URL
- [ ] backend/.env file exists with database credentials
- [ ] Can access http://localhost:5000/health
- [ ] Browser console shows no errors
- [ ] At least one user exists in database

If all checked and still not working, check the backend terminal for error messages.

