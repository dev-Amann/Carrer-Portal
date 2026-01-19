# Quick Reference - Booking Email System

## 🚀 Quick Start

### Test Emails Now
```bash
cd backend
python test_booking_email.py
```

### Start Development
```bash
# Terminal 1 - Backend
cd backend
flask run

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📧 Email Configuration

### Location
`backend/.env`

### Required Settings
```env
MAIL_USERNAME=user@example.com
MAIL_PASSWORD=***REDACTED_PWD***
MAIL_DEFAULT_SENDER=user@example.com
FRONTEND_URL=http://localhost:5173
```

## 🔍 Check Email Status

### Backend Logs - Success
```
INFO: Payment verified successfully
INFO: Booking confirmation email sent successfully to user@email.com
INFO: Booking notification email sent successfully to expert@email.com
```

### Backend Logs - Warning
```
WARNING: Failed to send booking confirmation email
```

## 🐛 Quick Troubleshooting

### Emails Not Sending?
1. Check `.env` has all email settings
2. Verify Gmail App Password is correct
3. Run test script: `python test_booking_email.py`
4. Check backend logs for errors

### Emails Not Received?
1. Check spam folder
2. Verify email address in database
3. Look for "sent successfully" in logs
4. Try different email address

### Authentication Error?
1. Regenerate Gmail App Password
2. Update `MAIL_PASSWORD` in `.env`
3. Restart backend server

## 📁 Key Files

### Implementation
- `backend/utils/email_sender.py` - Email functions
- `backend/routes/payments.py` - Payment + email integration
- `backend/config.py` - Configuration loading

### Testing
- `backend/test_booking_email.py` - Test script

### Documentation
- `QUICK_FIX_SUMMARY.md` - Overview
- `BOOKING_EMAIL_FIX.md` - Detailed guide
- `EMAIL_TROUBLESHOOTING.md` - Troubleshooting
- `SESSION_SUMMARY.md` - Complete summary

## 🎯 What Happens When?

### User Completes Payment
1. Payment verified ✅
2. Booking status → 'confirmed' ✅
3. User gets confirmation email 📧
4. Expert gets notification email 📧
5. Both can join via Jitsi link 🎥

### Email Contains
- Booking details (date, time, ID)
- Expert/Client name
- Jitsi meeting link
- Dashboard link
- Professional HTML design

## ⚡ Common Commands

```bash
# Test emails
python backend/test_booking_email.py

# Start backend
cd backend && flask run

# Start frontend
cd frontend && npm run dev

# Check logs
# (Watch terminal where flask run is running)

# Restart backend (if config changed)
# Ctrl+C then flask run again
```

## 📞 Need Help?

1. **Quick Issues**: Check `QUICK_FIX_SUMMARY.md`
2. **Detailed Help**: Read `BOOKING_EMAIL_FIX.md`
3. **Troubleshooting**: See `EMAIL_TROUBLESHOOTING.md`
4. **Complete Info**: Review `SESSION_SUMMARY.md`

## ✅ Success Checklist

- [ ] Test script runs successfully
- [ ] Emails received in inbox
- [ ] HTML formatting looks good
- [ ] Links work (Jitsi, dashboard)
- [ ] Complete booking flow works
- [ ] Both user and expert get emails
- [ ] Backend logs show success

## 🎉 Status

**Implementation**: ✅ Complete
**Testing**: 🔄 Ready
**Documentation**: ✅ Complete

---

**Last Updated**: Current Session
**Status**: Ready for Testing
