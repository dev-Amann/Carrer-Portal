"""
Fix passwords for ALL users in the database
Sets password to 'password123' for all accounts
"""
import bcrypt
import mysql.connector

def hash_password(password):
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

print("=" * 60)
print("Fixing ALL User Passwords")
print("=" * 60)
print()

# Generate hash for 'password123'
password = 'password123'
password_hash = hash_password(password)

print(f"Generated hash for password: {password}")
print(f"Hash: {password_hash}")
print()

try:
    # Connect to database
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password='***REDACTED_PWD***',
        database='carrerportal'
    )
    cursor = conn.cursor()
    
    # Get all users
    cursor.execute("SELECT id, name, email, is_admin FROM users")
    users = cursor.fetchall()
    
    print(f"Found {len(users)} users in database")
    print()
    
    # Update password for each user
    for user_id, name, email, is_admin in users:
        cursor.execute(
            "UPDATE users SET password_hash = %s WHERE id = %s",
            (password_hash, user_id)
        )
        role = "Admin" if is_admin else "User"
        print(f"✓ Updated: {name} ({email}) - {role}")
    
    conn.commit()
    
    print()
    print("=" * 60)
    print("✓ ALL PASSWORDS UPDATED SUCCESSFULLY!")
    print("=" * 60)
    print()
    print("All users can now login with password: password123")
    print()
    print("Available accounts:")
    print("-" * 60)
    
    for user_id, name, email, is_admin in users:
        role = "ADMIN" if is_admin else "User"
        print(f"  [{role}] {email}")
    
    print("-" * 60)
    
    cursor.close()
    conn.close()
    
except mysql.connector.Error as e:
    print(f"Database error: {e}")
except Exception as e:
    print(f"Error: {e}")

print()
print("You can now login with ANY of the above emails using:")
print("  Password: password123")
print()
