# Interactive Database Setup Script for CarrerPortal
# PowerShell script with password prompt

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "CarrerPortal Database Setup" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Prompt for MySQL password
$password = Read-Host "Enter MySQL root password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host ""
Write-Host "Step 1: Creating database..." -ForegroundColor Yellow
$createDb = "CREATE DATABASE IF NOT EXISTS carrerportal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
$result = mysql -u root -p"$plainPassword" -e $createDb 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database created/verified successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to create database. Please check your password." -ForegroundColor Red
    Write-Host $result
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 2: Running schema.sql..." -ForegroundColor Yellow
Get-Content "backend\data\schema.sql" | mysql -u root -p"$plainPassword" carrerportal 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Schema executed successfully" -ForegroundColor Green
} else {
    Write-Host "⚠ Schema execution had warnings (might be okay if tables exist)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 3: Running migration for expert fields..." -ForegroundColor Yellow
Get-Content "backend\data\migration_add_expert_fields.sql" | mysql -u root -p"$plainPassword" carrerportal 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Migration executed successfully" -ForegroundColor Green
} else {
    Write-Host "⚠ Migration had warnings (might be okay if columns exist)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 4: Seeding skills..." -ForegroundColor Yellow
if (Test-Path "backend\data\seed_skills.sql") {
    Get-Content "backend\data\seed_skills.sql" | mysql -u root -p"$plainPassword" carrerportal 2>&1
    Write-Host "✓ Skills seeded" -ForegroundColor Green
} else {
    Write-Host "⚠ seed_skills.sql not found, skipping..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 5: Seeding careers..." -ForegroundColor Yellow
if (Test-Path "backend\data\seed.sql") {
    Get-Content "backend\data\seed.sql" | mysql -u root -p"$plainPassword" carrerportal 2>&1
    Write-Host "✓ Careers seeded" -ForegroundColor Green
} else {
    Write-Host "⚠ seed.sql not found, skipping..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 6: Seeding experts..." -ForegroundColor Yellow
Get-Content "backend\data\seed_experts_complete.sql" | mysql -u root -p"$plainPassword" carrerportal 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Experts seeded successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to seed experts" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Verification" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Checking experts table structure..." -ForegroundColor Yellow
mysql -u root -p"$plainPassword" carrerportal -e "DESCRIBE experts;" 2>&1

Write-Host ""
Write-Host "Checking seeded experts..." -ForegroundColor Yellow
mysql -u root -p"$plainPassword" carrerportal -e "SELECT id, specialization, status FROM experts;" 2>&1

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test Expert Credentials (password: password123):" -ForegroundColor Yellow
Write-Host "  - john.expert@example.com - Full-Stack Development"
Write-Host "  - sarah.expert@example.com - Data Science & ML"
Write-Host "  - michael.expert@example.com - Product Management"
Write-Host "  - emily.expert@example.com - UX/UI Design"
Write-Host "  - david.expert@example.com - DevOps & Cloud"
Write-Host ""
Write-Host "You can now start the Flask backend:" -ForegroundColor Yellow
Write-Host "  cd backend"
Write-Host "  python app.py"
Write-Host ""

Read-Host "Press Enter to exit"
