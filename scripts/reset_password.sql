-- Reset password for a user
-- This sets the password to "password123" for the specified email
-- The hash below is bcrypt hash of "password123"

-- Update this email to match your user
SET @user_email = 'user@example.com';

-- This is the bcrypt hash for "password123"
-- Generated with: bcrypt.hashpw(b'password123', bcrypt.gensalt(rounds=12))
UPDATE users 
SET password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYfQRX.dWXC'
WHERE email = @user_email;

-- Verify the update
SELECT id, name, email, is_admin, created_at 
FROM users 
WHERE email = @user_email;

-- Show success message
SELECT CONCAT('Password reset successful for: ', @user_email) AS message;
SELECT 'You can now login with password: password123' AS info;
