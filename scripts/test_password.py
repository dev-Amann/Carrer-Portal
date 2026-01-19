"""
Test password hashing and verification
"""
import bcrypt
import mysql.connector

def hash_password(password):
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password, password_hash):
    """Verify password against hash"""
    try:
        result = bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
        return result
    except Exception as e:
        print(f"Verification error: {e}")
        return False

# Test the stored hash
stored_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYfQRX.dWXC'
test_password = 'password123'

print("Testing stored hash...")
print(f"Password: {test_password}")
print(f"Hash: {stored_hash}")
print(f"Verification result: {verify_password(test_password, stored_hash)}")
print()

# Generate new hash
print("Generating new hash...")
new_hash = hash_password(test_password)
print(f"New hash: {new_hash}")
print(f"Verification result: {verify_password(test_password, new_hash)}")
print()

# Update database
try:
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password='***REDACTED_PWD***',
        database='carrerportal'
    )
    cursor = conn.cursor()
    
    # Get current hash from database
    cursor.execute("SELECT password_hash FROM users WHERE email = 'user@example.com'")
    result = cursor.fetchone()
    
    if result:
        db_hash = result[0]
        print(f"Database hash: {db_hash}")
        print(f"Verification with DB hash: {verify_password(test_password, db_hash)}")
        print()
        
        # Update with new hash
        print("Updating database with new hash...")
        cursor.execute(
            "UPDATE users SET password_hash = %s WHERE email = 'user@example.com'",
            (new_hash,)
        )
        conn.commit()
        print("✓ Database updated!")
        
        # Also update admin
        cursor.execute(
            "UPDATE users SET password_hash = %s WHERE email = 'admin@carrerportal.com'",
            (new_hash,)
        )
        conn.commit()
        print("✓ Admin password also updated!")
        
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"Database error: {e}")

print()
print("=" * 50)
print("You can now login with:")
print("  Email: user@example.com")
print("  Password: password123")
print("=" * 50)
