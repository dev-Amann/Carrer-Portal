@echo off
echo Testing Login Endpoint...
echo.

echo Test 1: Health Check
curl -X GET http://localhost:5000/health
echo.
echo.

echo Test 2: Login with test credentials
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
echo.
echo.

echo Test 3: Check if users exist in database
mysql -u root carrerportal -e "SELECT id, email, name, is_admin FROM users LIMIT 5;"
echo.

pause
