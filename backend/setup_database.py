#!/usr/bin/env python3
"""
Database setup script for CarrerPortal
Runs all necessary SQL files to set up the database
"""
import os
import sys
import subprocess
from pathlib import Path

def run_mysql_command(command, database=None):
    """Run a MySQL command"""
    cmd = ['mysql', '-u', 'root', '-p']
    if database:
        cmd.append(database)
    cmd.extend(['-e', command])
    
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr

def run_sql_file(filepath, database='carrerportal'):
    """Run a SQL file"""
    cmd = ['mysql', '-u', 'root', '-p', database]
    
    try:
        with open(filepath, 'r') as f:
            result = subprocess.run(cmd, stdin=f, check=True, capture_output=True, text=True)
        return True, f"Successfully executed {filepath}"
    except subprocess.CalledProcessError as e:
        return False, f"Error executing {filepath}: {e.stderr}"
    except FileNotFoundError:
        return False, f"File not found: {filepath}"

def main():
    print("=" * 60)
    print("CarrerPortal Database Setup")
    print("=" * 60)
    print()
    
    # Get the data directory
    data_dir = Path(__file__).parent / 'data'
    
    if not data_dir.exists():
        print(f"Error: Data directory not found at {data_dir}")
        sys.exit(1)
    
    # Step 1: Create database
    print("Step 1: Creating database...")
    success, output = run_mysql_command(
        "CREATE DATABASE IF NOT EXISTS carrerportal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    )
    if success:
        print("✓ Database created/verified")
    else:
        print(f"✗ Failed to create database: {output}")
        sys.exit(1)
    
    # Step 2: Run schema
    print("\nStep 2: Running schema.sql...")
    schema_file = data_dir / 'schema.sql'
    success, output = run_sql_file(schema_file)
    if success:
        print(f"✓ {output}")
    else:
        print(f"✗ {output}")
        response = input("Continue anyway? (y/n): ")
        if response.lower() != 'y':
            sys.exit(1)
    
    # Step 3: Run migration
    print("\nStep 3: Running migration for expert fields...")
    migration_file = data_dir / 'migration_add_expert_fields.sql'
    success, output = run_sql_file(migration_file)
    if success:
        print(f"✓ {output}")
    else:
        print(f"✗ {output}")
        print("Note: This might fail if columns already exist. That's okay.")
    
    # Step 4: Seed skills
    print("\nStep 4: Seeding skills...")
    skills_file = data_dir / 'seed_skills.sql'
    if skills_file.exists():
        success, output = run_sql_file(skills_file)
        if success:
            print(f"✓ {output}")
        else:
            print(f"✗ {output}")
    else:
        print("⚠ seed_skills.sql not found, skipping...")
    
    # Step 5: Seed careers
    print("\nStep 5: Seeding careers...")
    seed_file = data_dir / 'seed.sql'
    if seed_file.exists():
        success, output = run_sql_file(seed_file)
        if success:
            print(f"✓ {output}")
        else:
            print(f"✗ {output}")
    else:
        print("⚠ seed.sql not found, skipping...")
    
    # Step 6: Seed experts
    print("\nStep 6: Seeding experts...")
    experts_file = data_dir / 'seed_experts_complete.sql'
    success, output = run_sql_file(experts_file)
    if success:
        print(f"✓ {output}")
    else:
        print(f"✗ {output}")
    
    # Verify
    print("\n" + "=" * 60)
    print("Verification")
    print("=" * 60)
    
    print("\nChecking experts table structure...")
    success, output = run_mysql_command("DESCRIBE experts;", "carrerportal")
    if success:
        print("✓ Experts table structure:")
        print(output)
    
    print("\nChecking seeded experts...")
    success, output = run_mysql_command(
        "SELECT id, specialization, status FROM experts;", 
        "carrerportal"
    )
    if success:
        print("✓ Seeded experts:")
        print(output)
    
    print("\n" + "=" * 60)
    print("Setup Complete!")
    print("=" * 60)
    print("\nYou can now start the Flask backend:")
    print("  cd backend")
    print("  python app.py")
    print()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nSetup cancelled by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nUnexpected error: {e}")
        sys.exit(1)
