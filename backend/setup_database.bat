@echo off
REM Database setup script for CarrerPortal (Windows)
REM Run this from the backend directory

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
    echo Failed to create database. Please check your MySQL password.
    pause
    exit /b 1
)
echo Database created/verified successfully.

echo.
echo Step 2: Running schema.sql...
mysql -u root -p%MYSQL_PASSWORD% carrerportal < data\schema.sql
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Schema execution had issues. Continuing...
)

echo.
echo Step 3: Running migration for expert fields...
mysql -u root -p%MYSQL_PASSWORD% carrerportal < data\migration_add_expert_fields.sql
if %ERRORLEVEL% NEQ 0 (
    echo Note: Migration might fail if columns already exist. That's okay.
)

echo.
echo Step 4: Seeding skills...
if exist data\seed_skills.sql (
    mysql -u root -p%MYSQL_PASSWORD% carrerportal < data\seed_skills.sql
) else (
    echo seed_skills.sql not found, skipping...
)

echo.
echo Step 5: Seeding careers...
if exist data\seed.sql (
    mysql -u root -p%MYSQL_PASSWORD% carrerportal < data\seed.sql
) else (
    echo seed.sql not found, skipping...
)

echo.
echo Step 6: Seeding experts...
mysql -u root -p%MYSQL_PASSWORD% carrerportal < data\seed_experts_complete.sql
if %ERRORLEVEL% NEQ 0 (
    echo Failed to seed experts.
)

echo.
echo ============================================================
echo Verification
echo ============================================================

echo.
echo Checking experts table structure...
mysql -u root -p%MYSQL_PASSWORD% carrerportal -e "DESCRIBE experts;"

echo.
echo Checking seeded experts...
mysql -u root -p%MYSQL_PASSWORD% carrerportal -e "SELECT id, specialization, status FROM experts;"

echo.
echo ============================================================
echo Setup Complete!
echo ============================================================
echo.
echo You can now start the Flask backend:
echo   python app.py
echo.

pause
