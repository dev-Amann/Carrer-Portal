"""
Script to reset a user's password
Usage: python reset_user_password.py
"""
import bcrypt
import mysql.connector
from getpass import getpass

def hash_password(password):
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def main():
    print("=" * 50)
    print("CarrerPortal - Password Reset Tool")
    print("=" * 50)
    print()
    
    # Get user email
    email = input("Enter user email: ").strip().lower()
    
    if not email:
        print("Error: Email is required")
        return
    
    # Get new password
    password = getpass("Enter new password (min 8 chars, must have letter and number): ")
    password_confirm = getpass("Confirm new password: ")
    
    if password != password_confirm:
        print("Error: Passwords don't match")
        return
    
    if len(password) < 8:
        print("Error: Password must be at least 8 characters long")
        return
    
    # Connect to database
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',  # Update if you have a password
            database='carrerportal'
        )
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT id, name, email FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        if not user:
            print(f"Error: No user found with email: {email}")
            return
        
        user_id, name, user_email = user
        print(f"\nFound user: {name} ({user_email})")
        
        # Hash new password
        password_hash = hash_password(password)
        
        # Update password
        cursor.execute(
            "UPDATE users SET password_hash = %s WHERE id = %s",
            (password_hash, user_id)
        )
        conn.commit()
        
        print(f"\n✓ Password updated successfully for {email}")
        print(f"You can now login with:")
        print(f"  Email: {email}")
        print(f"  Password: {password}")
        
    except mysql.connector.Error as e:
        print(f"Database error: {e}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == '__main__':
    main()
