# Expert Registration System - Complete Guide

## Overview
This document describes the comprehensive expert registration system that allows users to register as experts on the CarrerPortal platform.

## Features Implemented

### 1. Expert Registration Page (`/expert/register`)
A multi-step registration form with the following sections:

#### Step 1: Basic Information
- **Professional Bio** (100-1000 characters)
- **Specialization** (e.g., Software Development, Data Science)
- **Years of Experience**
- **Hourly Rate** (₹100 - ₹10,000)

#### Step 2: Documents and Links
- **Resume URL** (Required) - Upload to Google Drive/Dropbox and paste link
- **Certificates** - Multiple certificate URLs can be added
- **Other Documents** - Additional supporting documents
- **LinkedIn Profile** (Optional)
- **GitHub Profile** (Optional)
- **Portfolio Website** (Optional)

#### Step 3: Email Verification
- **Communication Email** - Email for future communications
- **OTP Verification** - 6-digit OTP sent to email for verification

### 2. Database Schema Updates

New fields added to `experts` table:
```sql
- linkedin_url VARCHAR(500)
- github_url VARCHAR(500)
- portfolio_url VARCHAR(500)
- other_documents JSON
- specialization VARCHAR(255)
- years_of_experience INT
- email_for_communication VARCHAR(255)
```

### 3. Admin Dashboard Enhancements

The admin dashboard now displays all expert information including:
- Specialization and years of experience
- Communication email
- All document links (Resume, Certificates, Other Documents)
- Social profiles (LinkedIn, GitHub, Portfolio)
- Easy access to review all submitted materials

### 4. Backend API Updates

#### Expert Registration Endpoint
```
POST /api/experts/register
```

**Request Body:**
```json
{
  "bio": "Professional biography",
  "rate_per_hour": 1000,
  "resume_url": "https://drive.google.com/...",
  "certificate_urls": ["https://cert1.com", "https://cert2.com"],
  "other_documents": ["https://doc1.com"],
  "linkedin_url": "https://linkedin.com/in/user",
  "github_url": "https://github.com/user",
  "portfolio_url": "https://portfolio.com",
  "specialization": "Software Development",
  "years_of_experience": 5,
  "email_for_communication": "expert@email.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Expert profile created successfully. Pending admin approval. All documents have been sent to admin.",
  "expert_id": 1,
  "status": "pending"
}
```

### 5. Email OTP Verification System

- OTP is sent to the communication email
- 6-digit verification code
- Used for future communications
- Ensures email validity

### 6. Document Submission to Admin

All submitted documents are:
- Saved in the database
- Logged in the backend for admin review
- Displayed in the admin dashboard with direct links
- Organized by category (Resume, Certificates, Other Documents, Social Links)

## User Flow

1. **User logs in** to their account
2. **Navigates to Dashboard** and clicks "Become an Expert"
3. **Step 1**: Fills in basic professional information
4. **Step 2**: Uploads documents and adds profile links
5. **Step 3**: Verifies email with OTP
6. **Submits application** - All data sent to admin
7. **Admin reviews** application in admin dashboard
8. **Admin approves/rejects** the application
9. **User receives notification** via email
10. **If approved**, user can access expert dashboard and start offering consultations

## Access Points

### For Users:
- **Dashboard**: "Become an Expert" button in Quick Actions
- **Direct URL**: `/expert/register` (requires login)

### For Admins:
- **Admin Dashboard**: `/admin/dashboard`
- **Pending Experts Tab**: View all pending applications with full details
- **Approve/Reject**: One-click approval or rejection

### For Experts:
- **Expert Login**: `/expert/login`
- **Expert Dashboard**: `/expert/dashboard` (after approval)

## Database Migration

To add the new fields to an existing database, run:

```bash
mysql -u root -p carrerportal < backend/data/migration_add_expert_fields.sql
```

## Security Features

1. **Authentication Required**: Must be logged in to register
2. **OTP Verification**: Email verification before submission
3. **Admin Approval**: All applications reviewed by admin
4. **Data Validation**: All fields validated on frontend and backend
5. **Secure Document Storage**: URLs only, no file uploads to server

## Benefits

### For Users:
- Easy multi-step registration process
- Clear progress indicators
- Comprehensive profile creation
- Email verification for security

### For Admins:
- All information in one place
- Easy document review
- Quick approve/reject workflow
- Complete applicant history

### For the Platform:
- Quality control through admin approval
- Verified expert profiles
- Comprehensive expert information
- Professional presentation

## Future Enhancements

Potential improvements:
1. Direct file upload instead of URL links
2. Automated background verification
3. Expert rating system
4. Skill verification tests
5. Video introduction upload
6. Calendar integration for availability
7. Automated email notifications
8. Expert profile preview before submission

## Support

For issues or questions:
- Check the admin logs for detailed error messages
- Verify all URLs are publicly accessible
- Ensure OTP is received and entered correctly
- Contact admin if application is stuck in pending status
