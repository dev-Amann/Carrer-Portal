# CarrerPortal - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.11+)
- MySQL (v8.0+)
- Gmail account (for SMTP)

### Installation

#### 1. Clone Repository
```bash
git clone <repository-url>
cd CarrerPortal
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Create database
mysql -u root -p
CREATE DATABASE carrerportal;
exit;

# Run schema
mysql -u root -p carrerportal < data/schema.sql

# Start server
python app.py
```

Backend runs on: **http://localhost:5000**

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: **http://localhost:3000**

---

## 🔑 Environment Configuration

### Backend `.env` File
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=carrerportal

# Email (Gmail SMTP)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=your-email@gmail.com
ADMIN_EMAIL=admin@carrerportal.com

# JWT
JWT_SECRET_KEY=your-secret-key
JWT_ACCESS_TOKEN_EXPIRES=900
JWT_REFRESH_TOKEN_EXPIRES=604800

# Razorpay (Optional)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Flask
SECRET_KEY=your-flask-secret-key
FLASK_ENV=development
```

### Gmail App Password Setup
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Generate password
4. Use this password in `MAIL_PASSWORD`

---

## 👤 User Roles & Access

### Regular User
- **Sign Up**: Email + Password + OTP verification
- **Login**: Email + Password OR Email + OTP
- **Access**: Free services, expert booking, video calls

### Expert
- **Apply**: Via contact form
- **Approval**: Admin reviews and approves
- **Access**: Expert dashboard, booking management, video calls

### Admin
- **Access**: Admin dashboard (requires `is_admin=true` in database)
- **Capabilities**: Approve experts, manage users, handle disputes

---

## 🎯 Quick Feature Test

### Test Authentication
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill form and submit
4. Check email for OTP
5. Enter OTP and create account
6. Try logging out and logging in with password
7. Try logging in with OTP

### Test Free Services
1. Navigate to "Services" page
2. Click "Get Started Free" on Career Recommendation
3. Fill skills assessment
4. View career recommendations
5. Select a career for skill gap analysis
6. View learning resources

### Test Expert Booking
1. Navigate to "Experts" page
2. Browse expert profiles
3. Click "Book Now" on an expert
4. Select date, time, and duration
5. Complete payment (test mode)
6. View booking in "My Bookings"

### Test Video Call
1. Go to "My Bookings"
2. Find a confirmed booking
3. Click "Join Video Call"
4. Grant camera/microphone permissions
5. Test video call interface
6. Click "Leave Call"

---

## 📁 Project Structure

```
CarrerPortal/
├── backend/                 # Flask API
│   ├── routes/             # API endpoints
│   ├── models/             # Database models
│   ├── utils/              # Helper functions
│   ├── data/               # SQL schemas
│   ├── app.py              # Entry point
│   └── config.py           # Configuration
│
├── frontend/               # React app
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── lib/           # API client
│   │   └── routes.jsx     # Routing
│   └── package.json
│
├── SYSTEM_FLOW.md         # Complete system documentation
├── QUICK_START.md         # This file
└── README.md              # Project overview
```

---

## 🔧 Common Issues & Solutions

### Issue: OTP Email Not Received
**Solution:**
- Check Gmail SMTP credentials in `.env`
- Verify app password is correct
- Check spam folder
- Ensure `MAIL_USE_TLS=True`

### Issue: Database Connection Error
**Solution:**
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database `carrerportal` exists
- Check if password has special characters (will be URL-encoded automatically)

### Issue: Frontend Can't Connect to Backend
**Solution:**
- Ensure backend is running on port 5000
- Check CORS configuration in `backend/app.py`
- Verify `VITE_API_URL` in frontend (defaults to http://localhost:5000/api)

### Issue: Video Call Not Loading
**Solution:**
- Check if booking has `jitsi_room` value
- Verify Jitsi Meet is accessible (https://meet.jit.si)
- Grant camera/microphone permissions in browser
- Check browser console for errors

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Careers
- `GET /api/careers/recommend` - Get career recommendations
- `GET /api/careers/:id` - Get career details
- `GET /api/careers/:id/skill-gap` - Get skill gap analysis

### Experts
- `GET /api/experts` - Get all experts
- `POST /api/experts/register` - Register as expert

### Bookings
- `POST /api/bookings/create` - Create booking
- `GET /api/bookings/user` - Get user bookings

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

---

## 🎨 UI Components

### Pages
- **Home**: Landing page with "How It Works"
- **Login**: Dual login (password/OTP)
- **Signup**: 2-step registration with OTP
- **Services**: Free and paid services
- **Experts**: Expert profiles with ratings
- **Bookings**: User bookings + video calls
- **About**: Company information
- **Contact**: Contact form

### Key Components
- **Nav**: Navigation with Login/Signup buttons
- **JitsiEmbed**: Video call component
- **ServiceCard**: Service display with free/paid badges
- **Toast**: Notification system
- **Modal**: Popup dialogs

---

## 🧪 Testing Checklist

### Authentication
- [ ] Sign up with email OTP
- [ ] Login with password
- [ ] Login with OTP
- [ ] Token refresh
- [ ] Logout

### Free Services
- [ ] Career recommendation
- [ ] Skill gap analysis
- [ ] Learning resources

### Expert Booking
- [ ] Browse experts
- [ ] Book consultation
- [ ] Payment processing
- [ ] Booking confirmation

### Video Consultation
- [ ] Join video call
- [ ] Camera/microphone
- [ ] Screen sharing
- [ ] Leave call

### Admin Functions
- [ ] Approve expert
- [ ] Manage users
- [ ] View bookings
- [ ] Handle disputes

---

## 📞 Support

### Documentation
- **System Flow**: See `SYSTEM_FLOW.md` for complete user journeys
- **API Docs**: See `backend/routes/` for endpoint details
- **Component Docs**: See component files for prop documentation

### Contact
- **Email**: support@carrerportal.com
- **Issues**: Create GitHub issue
- **Discussions**: GitHub discussions

---

## 🚀 Deployment

### Backend (Production)
```bash
# Use Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Or use Docker
docker build -t carrerportal-backend .
docker run -p 5000:5000 carrerportal-backend
```

### Frontend (Production)
```bash
# Build for production
npm run build

# Serve with nginx or deploy to Vercel/Netlify
```

### Database (Production)
- Use managed MySQL (AWS RDS, Google Cloud SQL)
- Enable SSL connections
- Set up automated backups
- Configure proper user permissions

---

## 📈 Next Steps

1. **Complete Setup**: Follow installation steps above
2. **Test Features**: Use testing checklist
3. **Read Documentation**: Review `SYSTEM_FLOW.md`
4. **Customize**: Modify branding, colors, content
5. **Deploy**: Follow deployment guide
6. **Monitor**: Set up logging and analytics

---

**Happy Coding! 🎉**
