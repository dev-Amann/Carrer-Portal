@echo off
echo ========================================
echo CarrerPortal Login Diagnostic Tool
echo ========================================
echo.

echo [1/6] Checking if frontend .env file exists...
if exist "frontend\.env" (
    echo ✓ frontend\.env exists
    echo.
    echo Content:
    type frontend\.env
) else (
    echo ✗ frontend\.env NOT FOUND!
    echo.
    echo SOLUTION: Run this command:
    echo   copy frontend\.env.example frontend\.env
    echo.
)
echo.

echo [2/6] Checking if backend .env file exists...
if exist "backend\.env" (
    echo ✓ backend\.env exists
) else (
    echo ✗ backend\.env NOT FOUND!
    echo.
    echo SOLUTION: Run this command:
    echo   copy backend\.env.example backend\.env
    echo.
)
echo.

echo [3/6] Checking if backend is running...
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Backend is running on port 5000
    curl -s http://localhost:5000/health
) else (
    echo ✗ Backend is NOT running!
    echo.
    echo SOLUTION: Start the backend:
    echo   cd backend
    echo   python app.py
)
echo.

echo [4/6] Checking if MySQL is running...
mysql -u root -e "SELECT 1" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MySQL is running
) else (
    echo ✗ MySQL is NOT running or credentials are wrong!
    echo.
    echo SOLUTION: Start MySQL service or check credentials
)
echo.

echo [5/6] Checking if database exists...
mysql -u root -e "USE carrerportal; SELECT 1" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Database 'carrerportal' exists
) else (
    echo ✗ Database 'carrerportal' NOT FOUND!
    echo.
    echo SOLUTION: Run database setup:
    echo   setup_db.cmd
)
echo.

echo [6/6] Checking if users exist in database...
mysql -u root carrerportal -e "SELECT COUNT(*) as user_count FROM users" 2>nul
if %errorlevel% equ 0 (
    echo ✓ Users table accessible
) else (
    echo ✗ Cannot access users table!
    echo.
    echo SOLUTION: Run database setup:
    echo   setup_db.cmd
)
echo.

echo ========================================
echo Diagnostic Complete
echo ========================================
echo.
echo If all checks passed but login still fails:
echo 1. Clear browser cache and localStorage
echo 2. Restart both frontend and backend servers
echo 3. Try in incognito/private browsing mode
echo 4. Check browser console (F12) for errors
echo.
pause
