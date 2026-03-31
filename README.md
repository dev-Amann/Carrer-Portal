# AI CareerPortal 🚀

A modern, production-ready AI-driven career recommendation and expert booking platform. CareerPortal empowers users with personalized career guidance and connects them directly with industry experts through instant video consultations.

## ✨ Features

- **🤖 AI Career Recommendations:** Get skill-based, personalized career paths.
- **📅 Expert Booking System:** Browse experts, view their availability, and schedule 1-on-1 consultations.
- **🎥 Integrated Video Meetings:** Secure video calls powered by Jitsi for instant, seamless consultations.
- **🔐 Secure Authentication:** Robust OTP-based user registration, login, and password reset workflows.
- **📧 Advanced Email Notifications:** Automated booking confirmations, expert approvals/rejections, and OTP verifications with professional HTML templates.
- **👨‍💼 Admin Dashboard:** Comprehensive tool for managing users, approving pending experts, and monitoring platform metrics.
- **🎨 Modern UI/UX:** Responsive, premium design utilizing Tailwind CSS, Framer Motion, and beautiful glassmorphism aesthetics.

## 🛠️ Technology Stack

**Frontend:**
- React 18 (Vite)
- Tailwind CSS & Framer Motion
- React Router v6
- Formik + Yup
- Axios

**Backend:**
- Python 3.10+ & Flask
- SQLAlchemy ORM & MySQL 8.0+
- JWT Authentication

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- MySQL 8.0+

### Database Setup
```bash
mysql -u root -p
CREATE DATABASE carrerportal;
```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your configuration (Database URL, JWT Secret, Mail configuration, etc.).
5. Run the application:
   ```bash
   flask run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Copy `.env.example` to `.env` and set your `VITE_API_URL` to point to the Flask backend (default `http://localhost:5000`).
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```text
CarrerPortal/
├── frontend/                 # React frontend app
│   ├── src/                  # React components, pages, contexts, hooks
│   └── public/               # Static assets
└── backend/                  # Flask backend API
    ├── routes/               # API endpoint handlers (admin, auth, bookings)
    ├── models/               # SQLAlchemy database models
    ├── templates/email/      # Professional HTML email templates
    └── utils/                # Helper functions (email, jitsi integration, etc.)
```

## 📄 License

Private project - All rights reserved.
