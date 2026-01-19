@echo off
echo ========================================
echo Fix Login Password Issue
echo ========================================
echo.
echo The backend shows 401 error, which means:
echo - User exists in database
echo - Password is incorrect
echo.
echo SOLUTION: Reset the password
echo.
echo Option 1: Use Python script (Recommended)
echo   python reset_user_password.py
echo.
echo Option 2: Use SQL script (Quick)
echo   mysql -u root carrerportal ^< reset_password.sql
echo   This will set password to: password123
echo.
echo Option 3: Manual SQL command
echo   mysql -u root carrerportal
echo   Then run:
echo   UPDATE users SET password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYfQRX.dWXC' WHERE email = 'your@email.com';
echo   Password will be: password123
echo.
echo ========================================
echo.
choice /C 12 /M "Choose option (1=Python script, 2=SQL quick fix)"

if errorlevel 2 goto sql_fix
if errorlevel 1 goto python_fix

:python_fix
echo.
echo Running Python password reset script...
python reset_user_password.py
goto end

:sql_fix
echo.
set /p email="Enter your email address: "
echo.
echo Resetting password for: %email%
echo New password will be: password123
echo.
mysql -u root carrerportal -e "UPDATE users SET password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYfQRX.dWXC' WHERE email = '%email%'; SELECT 'Password reset successful!' AS message;"
echo.
echo ✓ Done! Try logging in with:
echo   Email: %email%
echo   Password: password123
goto end

:end
echo.
pause
