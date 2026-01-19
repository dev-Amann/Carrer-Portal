-- Create user with email: user@example.com
-- Password: password123
-- This is the bcrypt hash for "password123"

INSERT INTO users (name, email, password_hash, is_admin, created_at)
VALUES (
    'Aman Singh',
    'user@example.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYfQRX.dWXC',
    0,
    NOW()
);

-- Verify the user was created
SELECT id, name, email, is_admin, created_at 
FROM users 
WHERE email = 'user@example.com';

-- Show login credentials
SELECT 'User created successfully!' AS message;
SELECT 'Login with:' AS info;
SELECT '  Email: user@example.com' AS email;
SELECT '  Password: password123' AS password;
