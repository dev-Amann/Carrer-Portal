@echo off
REM Simple Database Setup for CarrerPortal
REM Double-click this file to run

echo ============================================================
echo CarrerPortal Database Setup
echo ============================================================
echo.

REM Prompt for MySQL password
set /p MYSQL_PASSWORD="Enter MySQL root password: "

echo.
echo Step 1: Creating database...
mysql -u root -p%MYSQL_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS carrerportal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to create database. Please check your password.
    pause
    exit /b 1
)
echo [OK] Database created/verified

echo.
echo Step 2: Running schema.sql...
mysql -u root -p%MYSQL_PASSWORD% carrerportal < backend\data\schema.sql
echo [OK] Schema executed

echo.
echo Step 3: Running migration...
mysql -u root -p%MYSQL_PASSWORD% carrerportal < backend\data\migration_add_expert_fields.sql
echo [OK] Migration executed

echo.
echo Step 4: Seeding skills...
if exist backend\data\seed_skills.sql (
    mysql -u root -p%MYSQL_PASSWORD% carrerportal < backend\data\seed_skills.sql
    echo [OK] Skills seeded
)

echo.
echo Step 5: Seeding careers...
if exist backend\data\seed.sql (
    mysql -u root -p%MYSQL_PASSWORD% carrerportal < backend\data\seed.sql
    echo [OK] Careers seeded
)

echo.
echo Step 6: Seeding experts...
mysql -u root -p%MYSQL_PASSWORD% carrerportal < backend\data\seed_experts_complete.sql
if %ERRORLEVEL% EQU 0 (
    echo [OK] Experts seeded successfully
) else (
    echo [ERROR] Failed to seed experts
)

echo.
echo ============================================================
echo Verification
echo ============================================================

echo.
echo Checking experts...
mysql -u root -p%MYSQL_PASSWORD% carrerportal -e "SELECT id, specialization, status FROM experts;"

echo.
echo ============================================================
echo Setup Complete!
echo ============================================================
echo.
echo Test Experts (password: password123):
echo   - john.expert@example.com
echo   - sarah.expert@example.com
echo   - michael.expert@example.com
echo   - emily.expert@example.com
echo   - david.expert@example.com
echo.
echo Start backend: cd backend ^&^& python app.py
echo.

pause
