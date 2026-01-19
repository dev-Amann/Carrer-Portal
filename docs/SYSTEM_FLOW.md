# CarrerPortal - System Flow & User Interactions

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [User Roles](#user-roles)
3. [User Journey](#user-journey)
4. [Expert Journey](#expert-journey)
5. [Admin Journey](#admin-journey)
6. [Feature Flows](#feature-flows)
7. [Technical Architecture](#technical-architecture)

---

## 🎯 System Overview

CarrerPortal is an AI-powered career guidance platform that connects job seekers with industry experts for personalized career development. The platform offers free career recommendations and skill gap analysis, with paid expert consultations available.

### Core Features
- **Free Services**: Career recommendations, skill gap analysis, learning resources
- **Paid Services**: 1-on-1 video consultations with industry experts
- **Authentication**: Email OTP verification for signup, dual login (password/OTP)
- **Video Consultations**: Integrated Jitsi Meet for video calls
- **Payment Processing**: Razorpay integration for booking payments

---

## 👥 User Roles

### 1. **Regular Users (Job Seekers)**
- Primary users seeking career guidance
- Can access free career tools
- Can book and pay for expert consultations
- Can manage their bookings

### 2. **Experts (Career Consultants)**
- Industry professionals offering guidance
- Must register and get admin approval
- Set their own hourly rates
- Conduct video consultations with users
- Receive payments for their services

### 3. **Admins (Platform Managers)**
- Manage platform operations
- Approve/reject expert applications
- Monitor bookings and transactions
- Handle user support issues

---

## 🚀 User Journey

### Phase 1: Discovery & Registration

#### Step 1: Landing Page
```
User visits homepage → Sees "How It Works" section
├── Step 1: Share Your Skills (FREE)
├── Step 2: Get Recommendations (FREE)
└── Step 3: Bridge Skill Gaps (FREE)
```

#### Step 2: Sign Up
```
Click "Sign Up" button
├── Enter: Name, Email, Password
├── Click "Continue"
├── Receive OTP via email (6-digit code, expires in 10 minutes)
├── Enter OTP
├── Click "Create Account"
└── Automatically logged in → Redirected to homepage
```

**Email Verification:**
- Beautiful HTML email with CarrerPortal branding
- 6-digit OTP code
- Valid for 10 minutes
- Maximum 3 verification attempts

### Phase 2: Using Free Services

#### Career Recommendation (FREE)
```
Navigate to Services page
├── Click "Get Started Free" on Career Recommendation
├── Fill out skills assessment form
│   ├── Technical skills
│   ├── Soft skills
│   ├── Interests
│   └── Experience level
├── Submit form
├── AI analyzes profile
└── Receive career suggestions with match percentages
```

#### Skill Gap Analysis (FREE)
```
Select target career from recommendations
├── System compares current skills vs required skills
├── Identifies skill gaps
├── Provides prioritized learning path
└── Access curated learning resources
```

### Phase 3: Expert Consultation (PAID)

#### Step 1: Browse Experts
```
Navigate to "Experts" page
├── View expert profiles
│   ├── Name, photo, level (e.g., "Senior Architect")
│   ├── Years of experience
│   ├── Expertise areas (tags)
│   ├── Certifications (collapsible)
│   ├── Rating (stars) and review count
│   ├── Recent user reviews
│   └── Hourly rate (₹999 - ₹5,000/hour)
└── Click "Book Now" on desired expert
```

#### Step 2: Book Consultation
```
Select expert → Redirected to booking page
├── Choose date and time slot
├── Select duration (30 min or 60 min)
├── Review booking details
│   ├── Expert name and rate
│   ├── Date and time
│   ├── Total cost
│   └── Session details
├── Proceed to payment
└── Razorpay payment gateway
    ├── Enter payment details
    ├── Complete payment
    └── Receive booking confirmation
```

#### Step 3: Attend Consultation
```
Navigate to "Bookings" page
├── View all bookings (past and upcoming)
├── See booking details
│   ├── Expert info
│   ├── Date/time
│   ├── Status (pending/confirmed/completed)
│   └── Jitsi room link
├── Click "Join Video Call" (when confirmed)
├── Opens Jitsi Meet interface
│   ├── Camera and microphone access
│   ├── Full-screen video call
│   ├── Screen sharing capability
│   └── Chat functionality
└── Click "Leave Call" when done
```

### Phase 4: Post-Consultation

```
After consultation ends
├── Booking status updated to "completed"
├── Option to rate and review expert
├── Access consultation notes (if provided)
└── Receive follow-up resources via email
```

---

## 👨‍🏫 Expert Journey

### Phase 1: Registration

#### Step 1: Apply as Expert
```
Homepage → Click "Apply as Expert" (bottom of Experts page)
├── Redirected to contact form
├── Fill application form
│   ├── Full name
│   ├── Email
│   ├── Phone
│   ├── Professional background
│   ├── Areas of expertise
│   ├── Certifications
│   ├── Years of experience
│   └── Desired hourly rate
├── Submit application
└── Receive confirmation email
```

#### Step 2: Admin Review
```
Application submitted
├── Admin receives notification
├── Admin reviews credentials
│   ├── Verifies experience
│   ├── Checks certifications
│   └── Assesses expertise areas
├── Admin decision
│   ├── APPROVED → Expert account created
│   └── REJECTED → Applicant notified with reason
└── Expert receives approval/rejection email
```

#### Step 3: Profile Setup
```
After approval
├── Expert logs in (password or OTP)
├── Complete profile
│   ├── Upload professional photo
│   ├── Write detailed bio
│   ├── Add certifications
│   ├── Set availability schedule
│   ├── Set hourly rate
│   └── Add portfolio/credentials
└── Profile goes live on Experts page
```

### Phase 2: Receiving Bookings

```
User books consultation
├── Expert receives email notification
│   ├── User details
│   ├── Booking date/time
│   ├── Session duration
│   └── Payment confirmation
├── Expert confirms availability
├── Jitsi room automatically created
│   └── Unique room ID generated
└── Booking status → "confirmed"
```

### Phase 3: Conducting Consultations

```
Scheduled consultation time
├── Expert navigates to their bookings dashboard
├── Clicks "Join Video Call"
├── Jitsi Meet opens
│   ├── Professional video interface
│   ├── Screen sharing for presentations
│   ├── Chat for sharing links/resources
│   └── Recording option (with consent)
├── Conducts consultation
│   ├── Career guidance
│   ├── Resume review
│   ├── Interview preparation
│   ├── Skill development advice
│   └── Industry insights
└── Ends call → Booking marked "completed"
```

### Phase 4: Post-Consultation

```
After consultation
├── Expert can add session notes
├── Share additional resources with user
├── Receive payment (minus platform fee)
├── User reviews appear on profile
│   ├── Rating (1-5 stars)
│   └── Written review
└── Build reputation and get more bookings
```

---

## 👨‍💼 Admin Journey

### Phase 1: Dashboard Access

```
Admin logs in
├── Access admin dashboard
├── View key metrics
│   ├── Total users
│   ├── Total experts
│   ├── Active bookings
│   ├── Revenue statistics
│   └── Pending approvals
└── Navigate to management sections
```

### Phase 2: Expert Management

#### Review Applications
```
Navigate to "Expert Applications"
├── View pending applications
├── Click on application to review
│   ├── View applicant details
│   ├── Check credentials
│   ├── Verify certifications
│   └── Assess expertise
├── Make decision
│   ├── APPROVE
│   │   ├── Create expert account
│   │   ├── Send approval email
│   │   └── Expert can set up profile
│   └── REJECT
│       ├── Provide rejection reason
│       └── Send rejection email
└── Application processed
```

#### Manage Active Experts
```
Navigate to "Experts Management"
├── View all experts
│   ├── Active experts
│   ├── Suspended experts
│   └── Pending experts
├── Expert actions
│   ├── View profile
│   ├── Edit details
│   ├── Suspend account (if policy violation)
│   ├── Reactivate account
│   └── View performance metrics
│       ├── Total consultations
│       ├── Average rating
│       ├── Revenue generated
│       └── User feedback
└── Monitor expert quality
```

### Phase 3: User Management

```
Navigate to "Users Management"
├── View all registered users
├── User actions
│   ├── View user profile
│   ├── View booking history
│   ├── Handle support tickets
│   ├── Suspend account (if needed)
│   └── Reset password
└── Monitor user activity
```

### Phase 4: Booking Management

```
Navigate to "Bookings Management"
├── View all bookings
│   ├── Upcoming bookings
│   ├── Completed bookings
│   ├── Cancelled bookings
│   └── Disputed bookings
├── Booking actions
│   ├── View booking details
│   ├── Handle cancellations
│   ├── Process refunds
│   ├── Resolve disputes
│   └── Monitor consultation quality
└── Generate reports
```

### Phase 5: Platform Management

#### Content Management
```
├── Manage career database
│   ├── Add new careers
│   ├── Update career information
│   ├── Add skill requirements
│   └── Update salary data
├── Manage learning resources
│   ├── Add courses
│   ├── Update resource links
│   └── Categorize by skill
└── Manage platform content
    ├── Update homepage content
    ├── Manage blog posts
    └── Update FAQs
```

#### Financial Management
```
├── View revenue dashboard
│   ├── Total revenue
│   ├── Platform fees collected
│   ├── Expert payouts
│   └── Pending payments
├── Process expert payouts
├── Handle refunds
└── Generate financial reports
```

---

## 🔄 Feature Flows

### 1. Authentication Flow

#### Sign Up Flow
```
User → Sign Up Page
├── Enter details (name, email, password)
├── Click "Continue"
├── Backend generates 6-digit OTP
├── OTP stored in memory (10 min expiry)
├── Email sent via Gmail SMTP
│   └── Beautiful HTML template with OTP
├── User receives email
├── User enters OTP
├── Backend verifies OTP
│   ├── Check if OTP matches
│   ├── Check if not expired
│   └── Check attempt count (max 3)
├── If valid:
│   ├── Create user account
│   ├── Hash password (bcrypt)
│   ├── Generate JWT tokens
│   │   ├── Access token (15 min)
│   │   └── Refresh token (7 days)
│   └── User logged in
└── If invalid:
    └── Show error, allow retry
```

#### Login Flow (Password)
```
User → Login Page → Select "Password"
├── Enter email and password
├── Click "Sign In"
├── Backend validates credentials
│   ├── Find user by email
│   ├── Verify password hash
│   └── Check account status
├── If valid:
│   ├── Generate JWT tokens
│   └── User logged in
└── If invalid:
    └── Show error message
```

#### Login Flow (OTP)
```
User → Login Page → Select "OTP"
├── Enter email
├── Click "Send OTP"
├── Backend generates OTP
├── OTP sent via email
├── User enters OTP
├── Backend verifies OTP
├── If valid:
│   ├── Generate JWT tokens
│   └── User logged in
└── If invalid:
    └── Show error, allow retry
```

### 2. Career Recommendation Flow

```
User → Services Page → Career Recommendation
├── Click "Get Started Free"
├── Fill skills assessment form
│   ├── Select technical skills (checkboxes)
│   ├── Select soft skills (checkboxes)
│   ├── Choose interests (dropdown)
│   └── Set experience level (slider)
├── Submit form
├── Backend processes
│   ├── Store user skills in database
│   ├── AI algorithm analyzes profile
│   │   ├── Match skills to careers
│   │   ├── Calculate match percentages
│   │   └── Consider market demand
│   └── Generate recommendations
├── Display results
│   ├── Top 5 career matches
│   ├── Match percentage for each
│   ├── Salary range
│   ├── Job market outlook
│   └── Required skills
└── User can:
    ├── View detailed career info
    ├── Save favorite careers
    └── Proceed to skill gap analysis
```

### 3. Skill Gap Analysis Flow

```
User selects target career
├── Backend retrieves
│   ├── User's current skills
│   └── Career's required skills
├── Algorithm compares
│   ├── Identifies missing skills
│   ├── Identifies weak skills
│   └── Prioritizes by importance
├── Generate learning path
│   ├── Beginner skills first
│   ├── Intermediate skills next
│   └── Advanced skills last
├── Display results
│   ├── Visual skill gap chart
│   ├── Prioritized skill list
│   ├── Estimated learning time
│   └── Curated resources
│       ├── Online courses
│       ├── Books
│       ├── Practice projects
│       └── Certifications
└── User can:
    ├── Track learning progress
    ├── Mark skills as learned
    └── Update skill proficiency
```

### 4. Expert Consultation Booking Flow

```
User → Experts Page → Select Expert → Book Now
├── Redirected to booking page
├── Select consultation details
│   ├── Choose date (calendar)
│   ├── Choose time slot (dropdown)
│   └── Select duration (30/60 min)
├── Review booking summary
│   ├── Expert: [Name]
│   ├── Date: [Selected date]
│   ├── Time: [Selected time]
│   ├── Duration: [30/60 min]
│   ├── Rate: ₹[rate]/hour
│   └── Total: ₹[calculated amount]
├── Click "Proceed to Payment"
├── Razorpay payment gateway opens
│   ├── Enter card details / UPI / Net Banking
│   ├── Complete payment
│   └── Payment verification
├── Backend processes
│   ├── Create booking record
│   ├── Generate unique Jitsi room ID
│   ├── Send confirmation emails
│   │   ├── To user (booking details)
│   │   └── To expert (new booking alert)
│   └── Update expert's calendar
└── Booking confirmed
    ├── Status: "confirmed"
    ├── User can view in "My Bookings"
    └── Expert can view in their dashboard
```

### 5. Video Consultation Flow

```
Consultation time arrives
├── User navigates to "My Bookings"
├── Finds upcoming consultation
├── Clicks "Join Video Call"
├── Frontend loads JitsiEmbed component
│   └── iframe src: https://meet.jit.si/[room_id]
├── Jitsi Meet interface loads
│   ├── Request camera/microphone permissions
│   ├── User grants permissions
│   └── Video call starts
├── Expert joins from their end
├── Both parties in video call
│   ├── Video and audio streaming
│   ├── Screen sharing available
│   ├── Chat functionality
│   ├── Recording option (with consent)
│   └── Participant controls
│       ├── Mute/unmute
│       ├── Camera on/off
│       ├── Screen share
│       └── Leave call
├── Consultation conducted
│   ├── Career guidance discussion
│   ├── Resume review
│   ├── Mock interview
│   ├── Skill development advice
│   └── Q&A session
├── Either party clicks "Leave Call"
├── Video call ends
├── Backend updates booking
│   └── Status: "completed"
└── Post-consultation actions
    ├── User can rate and review
    ├── Expert can add notes
    └── Both receive summary email
```

---

## 🏗️ Technical Architecture

### Frontend (React + Vite)
```
src/
├── pages/
│   ├── Home.jsx (Landing page with "How It Works")
│   ├── Login.jsx (Dual login: password/OTP)
│   ├── Signup.jsx (2-step: details → OTP verification)
│   ├── Services.jsx (Free services showcase)
│   ├── Experts.jsx (Expert profiles with ratings)
│   ├── Bookings.jsx (User bookings + video call)
│   ├── About.jsx
│   ├── Blog.jsx
│   └── Contact.jsx
├── components/
│   ├── Nav.jsx (Login/Signup buttons)
│   ├── Footer.jsx
│   ├── JitsiEmbed.jsx (Video call component)
│   ├── ServiceCard.jsx (Free/Paid service cards)
│   ├── Toast.jsx (Notifications)
│   └── Modal.jsx
├── contexts/
│   ├── AuthContext.jsx (User authentication state)
│   └── ThemeContext.jsx (Dark mode)
├── lib/
│   └── api.js (Axios instance + API endpoints)
└── routes.jsx (React Router configuration)
```

### Backend (Flask + Python)
```
backend/
├── routes/
│   ├── auth.py (Authentication endpoints)
│   │   ├── POST /api/auth/send-otp
│   │   ├── POST /api/auth/verify-otp
│   │   ├── POST /api/auth/register
│   │   ├── POST /api/auth/login
│   │   ├── POST /api/auth/refresh
│   │   └── POST /api/auth/logout
│   ├── careers.py (Career recommendations)
│   ├── experts.py (Expert management)
│   ├── bookings.py (Booking management)
│   ├── payments.py (Razorpay integration)
│   └── contact.py (Contact form)
├── models/
│   ├── user.py (User model)
│   ├── expert.py (Expert model)
│   ├── booking.py (Booking model)
│   ├── career.py (Career model)
│   ├── skill.py (Skill model)
│   └── transaction.py (Payment model)
├── utils/
│   ├── email_sender.py (Gmail SMTP + OTP emails)
│   ├── otp_manager.py (OTP generation/verification)
│   ├── jwt_utils.py (JWT token management)
│   ├── jitsi_helper.py (Jitsi room generation)
│   └── payment_helper.py (Razorpay integration)
├── app.py (Flask application entry point)
└── config.py (Environment configuration)
```

### Database (MySQL)
```
Tables:
├── users (id, name, email, password_hash, is_admin, created_at)
├── experts (id, user_id, bio, expertise, rate_per_hour, status, certifications)
├── bookings (id, user_id, expert_id, slot_start, slot_end, status, jitsi_room)
├── careers (id, title, description, salary_range, required_skills)
├── skills (id, name, category, proficiency_level)
├── user_skills (user_id, skill_id, proficiency)
├── transactions (id, booking_id, amount, status, razorpay_order_id)
└── reviews (id, booking_id, rating, comment, created_at)
```

### External Services
```
├── Gmail SMTP (Email delivery)
│   └── OTP emails, booking confirmations, notifications
├── Jitsi Meet (Video conferencing)
│   └── Embedded video calls via iframe
├── Razorpay (Payment processing)
│   └── Booking payments, refunds
└── MySQL Database (Data storage)
    └── User data, bookings, transactions
```

---

## 🔐 Security Features

### Authentication
- ✅ Email OTP verification for signup
- ✅ Bcrypt password hashing (12 rounds)
- ✅ JWT tokens (access + refresh)
- ✅ Token expiry (15 min access, 7 days refresh)
- ✅ Dual login (password or OTP)

### Data Protection
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ XSS protection (input sanitization)
- ✅ CORS configuration
- ✅ Rate limiting (Flask-Limiter)
- ✅ Password strength validation

### Payment Security
- ✅ Razorpay secure payment gateway
- ✅ Payment verification
- ✅ Transaction logging
- ✅ Refund handling

---

## 📊 User Interaction Summary

### Regular User Interactions
1. **Sign up** with email OTP verification
2. **Login** with password or OTP
3. **Complete** free skills assessment
4. **Receive** AI-powered career recommendations
5. **Analyze** skill gaps with learning resources
6. **Browse** expert profiles with ratings
7. **Book** paid consultations with payment
8. **Join** video calls via Jitsi Meet
9. **Rate** and review experts
10. **Track** booking history

### Expert Interactions
1. **Apply** to become an expert
2. **Wait** for admin approval
3. **Set up** professional profile
4. **Receive** booking notifications
5. **Confirm** availability
6. **Join** video consultations
7. **Conduct** career guidance sessions
8. **Receive** payments
9. **Build** reputation through reviews
10. **Manage** schedule and availability

### Admin Interactions
1. **Review** expert applications
2. **Approve/reject** experts
3. **Monitor** platform activity
4. **Manage** users and experts
5. **Handle** booking disputes
6. **Process** refunds
7. **Update** career database
8. **Manage** learning resources
9. **Generate** reports
10. **Ensure** platform quality

---

## 🎯 Key Success Metrics

### For Users
- Career recommendation accuracy
- Skill gap identification effectiveness
- Expert consultation satisfaction
- Learning resource quality
- Platform ease of use

### For Experts
- Booking volume
- Average rating
- Revenue generated
- Client retention
- Profile visibility

### For Platform
- User registration rate
- Free service usage
- Paid consultation conversion
- Expert approval rate
- Revenue growth
- User satisfaction (NPS)

---

## 📞 Support & Contact

### User Support
- Email: support@carrerportal.com
- Contact form on website
- FAQ section
- Live chat (future)

### Expert Support
- Dedicated expert helpdesk
- Onboarding assistance
- Technical support for video calls
- Payment queries

### Admin Contact
- Internal admin dashboard
- System monitoring tools
- Analytics and reporting
- Issue tracking system

---

**Last Updated**: November 18, 2024  
**Version**: 1.0  
**Platform**: CarrerPortal - AI-Powered Career Guidance Platform
