# CarrerPortal

A modern, accessible, production-ready multi-page web application that provides skill-based career recommendations.

## Project Structure

```
carrerportal/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and API client
│   │   ├── data/            # Static data files
│   │   ├── App.jsx          # Root component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
├── backend/                 # Flask backend API
│   ├── routes/              # API route handlers
│   ├── models/              # Database models
│   ├── utils/               # Helper functions
│   ├── templates/           # Email templates
│   ├── data/                # Log files
│   ├── app.py               # Flask application
│   ├── config.py            # Configuration
│   ├── requirements.txt
│   └── .env.example
├── docs/                    # Project documentation
├── scripts/                 # Utility scripts
└── .kiro/                   # Kiro spec files
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- MySQL 8.0+

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
flask run
```

### Database Setup

```bash
mysql -u root -p
CREATE DATABASE carrerportal;
# Schema and seed files will be created in task 2
```

## Technology Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS
- React Router v6
- Formik + Yup
- Axios
- Framer Motion

**Backend:**
- Flask
- SQLAlchemy
- MySQL
- JWT Authentication
- Razorpay Integration

## Email Notification System

The application includes a comprehensive email notification system for booking confirmations.

### Features
- ✅ User booking confirmation emails
- ✅ Expert booking notification emails
- ✅ Professional HTML email templates
- ✅ Plain text fallback for compatibility
- ✅ Gmail SMTP integration
- ✅ Non-blocking email sending

### Quick Test
```bash
cd backend
python test_booking_email.py
```

### Configuration
Email settings in `backend/.env`:
```env
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_DEFAULT_SENDER=your_email@gmail.com
FRONTEND_URL=http://localhost:5173
```

### Documentation
- 🚀 **[Quick Reference](docs/QUICK_REFERENCE.md)** - Quick start and commands
- 📖 **[Implementation Guide](docs/BOOKING_EMAIL_FIX.md)** - Detailed documentation
- 🎨 **[Template Customization](docs/EMAIL_TEMPLATE_CUSTOMIZATION.md)** - Edit email templates
- 🔧 **[Troubleshooting](docs/EMAIL_TROUBLESHOOTING.md)** - Problem solving
- 📊 **[Complete Index](docs/DOCUMENTATION_INDEX.md)** - All documentation

## Development

- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run lint` - Lint frontend code
- `npm run format` - Format frontend code
- `flask run` - Start backend development server
- `python backend/test_booking_email.py` - Test email system

## License

Private project - All rights reserved
