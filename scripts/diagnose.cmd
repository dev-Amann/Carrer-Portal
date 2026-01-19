@echo off
REM Quick Diagnostic Script for CarrerPortal
REM This will check common issues

echo ============================================================
echo CarrerPortal Diagnostic Tool
echo ============================================================
echo.

REM Check MySQL
echo [1/6] Checking MySQL...
mysql --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] MySQL is installed
) else (
    echo [ERROR] MySQL is not installed or not in PATH
    goto :end
)

REM Prompt for password
set /p MYSQL_PASSWORD="Enter MySQL root password: "

REM Check Database
echo.
echo [2/6] Checking database...
mysql -u root -p%MYSQL_PASSWORD% -e "USE carrerportal;" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Database 'carrerportal' exists
) else (
    echo [ERROR] Database 'carrerportal' does not exist
    echo [FIX] Run: setup_db.cmd
    goto :end
)

REM Check Tables
echo.
echo [3/6] Checking tables...
mysql -u root -p%MYSQL_PASSWORD% carrerportal -e "DESCRIBE experts;" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Table 'experts' exists
) else (
    echo [ERROR] Table 'experts' does not exist
    echo [FIX] Run: mysql -u root -p carrerportal ^< backend\data\schema.sql
    goto :end
)

REM Check Expert Columns
echo.
echo [4/6] Checking expert table structure...
mysql -u root -p%MYSQL_PASSWORD% carrerportal -e "DESCRIBE experts;" | findstr "specialization" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Expert table has new columns
) else (
    echo [ERROR] Expert table missing new columns
    echo [FIX] Run: mysql -u root -p carrerportal ^< backend\data\migration_add_expert_fields.sql
    goto :end
)

REM Check Expert Data
echo.
echo [5/6] Checking expert data...
for /f %%i in ('mysql -u root -p%MYSQL_PASSWORD% carrerportal -se "SELECT COUNT(*) FROM experts WHERE status='approved';"') do set EXPERT_COUNT=%%i
if %EXPERT_COUNT% GTR 0 (
    echo [OK] Found %EXPERT_COUNT% approved experts
) else (
    echo [WARNING] No approved experts found
    echo [FIX] Run: mysql -u root -p carrerportal ^< backend\data\seed_experts_complete.sql
)

REM Check Backend
echo.
echo [6/6] Checking if backend is running...
curl -s http://localhost:5000/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Backend is running on port 5000
) else (
    echo [WARNING] Backend is not running
    echo [FIX] Run: cd backend ^&^& python app.py
)

echo.
echo ============================================================
echo Diagnostic Complete
echo ============================================================
echo.
echo Summary:
echo - MySQL: OK
echo - Database: OK
echo - Tables: OK
echo - Expert Data: %EXPERT_COUNT% approved experts
echo.
echo Next Steps:
echo 1. Make sure backend is running: cd backend ^&^& python app.py
echo 2. Make sure frontend is running: cd frontend ^&^& npm run dev
echo 3. Visit: http://localhost:5173/experts
echo.

:end
pause
