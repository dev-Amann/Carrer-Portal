# Email Flow Diagram

## Complete Booking Flow with Email Notifications

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

1. User browses experts
        ↓
2. User selects expert and time slot
        ↓
3. User clicks "Book Now"
        ↓
4. System creates booking (status: pending)
        ↓
5. Razorpay payment modal opens
        ↓
6. User enters payment details
        ↓
7. User completes payment
        ↓
┌───────────────────────────────────────────────────────────────┐
│                    BACKEND PROCESSING                          │
└───────────────────────────────────────────────────────────────┘

8. Frontend sends payment verification request
   POST /payments/verify
   {
     razorpay_order_id,
     razorpay_payment_id,
     razorpay_signature
   }
        ↓
9. Backend verifies payment signature
        ↓
   ┌─────────────┐
   │  Valid?     │
   └─────────────┘
        │
        ├─── NO ──→ Return error (payment failed)
        │
        └─── YES
             ↓
10. Update transaction status → 'completed'
        ↓
11. Update booking status → 'confirmed'
        ↓
12. Commit to database
        ↓
┌───────────────────────────────────────────────────────────────┐
│                    EMAIL NOTIFICATION                          │
└───────────────────────────────────────────────────────────────┘

13. Fetch user details from database
    - user.name
    - user.email
        ↓
14. Fetch expert details from database
    - expert.user_id → expert_user.name
    - expert_user.email
        ↓
15. Send confirmation email to USER
    ┌──────────────────────────────────────┐
    │  📧 Booking Confirmation Email       │
    │  To: user.email                      │
    │  Subject: 🎉 Booking Confirmed       │
    │                                      │
    │  Content:                            │
    │  - Expert name                       │
    │  - Date & time                       │
    │  - Booking ID                        │
    │  - Jitsi meeting link                │
    │  - Dashboard link                    │
    └──────────────────────────────────────┘
        ↓
   ┌─────────────┐
   │  Success?   │
   └─────────────┘
        │
        ├─── YES ──→ Log: "Email sent to user"
        │
        └─── NO ──→ Log warning (non-blocking)
        ↓
16. Send notification email to EXPERT
    ┌──────────────────────────────────────┐
    │  📧 New Booking Notification        │
    │  To: expert_user.email                │
    │  Subject: 📅 New Booking            │
    │                                      │
    │  Content:                            │
    │  - Client name                       │
    │  - Date & time                       │
    │  - Booking ID                        │
    │  - Jitsi meeting link                │
    │  - Expert dashboard link             │
    └──────────────────────────────────────┘
        ↓
   ┌─────────────┐
   │  Success?   │
   └─────────────┘
        │
        ├─── YES ──→ Log: "Email sent to expert"
        │
        └─── NO ──→ Log warning (non-blocking)
        ↓
17. Return success response to frontend
    {
      success: true,
      message: "Payment verified successfully",
      transaction: {...},
      booking: {...}
    }
        ↓
┌───────────────────────────────────────────────────────────────┐
│                    USER EXPERIENCE                            │
└───────────────────────────────────────────────────────────────┘

18. Frontend shows success message
        ↓
19. User redirected to dashboard
        ↓
20. User receives confirmation email 📧
        ↓
21. Expert receives notification email 📧
        ↓
22. Both can join meeting via Jitsi link 🎥
```

## Email Sending Process Detail

```
┌─────────────────────────────────────────────────────────────────┐
│              send_booking_confirmation_email()                  │
└─────────────────────────────────────────────────────────────────┘

Input Parameters:
  - user_email
  - user_name
  - expert_name
  - slot_start (datetime)
  - slot_end (datetime)
  - jitsi_room (string)
  - booking_id (int)
        ↓
1. Get FRONTEND_URL from config
        ↓
2. Format datetime strings
   - formatted_date: "January 15, 2024"
   - formatted_start_time: "02:00 PM"
   - formatted_end_time: "03:00 PM"
        ↓
3. Generate meeting URL
   - https://meet.jit.si/{jitsi_room}
        ↓
4. Generate dashboard URL
   - {FRONTEND_URL}/dashboard
        ↓
5. Create HTML email content
   - Professional design
   - Gradient header
   - Booking details box
   - Meeting link button
   - Footer
        ↓
6. Create plain text fallback
        ↓
7. Create Flask-Mail Message object
   - Subject
   - Sender
   - Recipients
   - HTML body
   - Text body
        ↓
8. Send via Flask-Mail (Gmail SMTP)
        ↓
   ┌─────────────┐
   │  Success?   │
   └─────────────┘
        │
        ├─── YES ──→ Return (True, "Email sent successfully")
        │
        └─── NO ──→ Return (False, error_message)
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR SCENARIOS                              │
└─────────────────────────────────────────────────────────────────┘

Scenario 1: Email Configuration Missing
    ↓
Check MAIL_USERNAME, MAIL_PASSWORD
    ↓
If missing → Log error → Return failure
    ↓
Payment still succeeds ✅
User can access booking from dashboard


Scenario 2: SMTP Connection Failed
    ↓
Try to connect to smtp.gmail.com:587
    ↓
If fails → Log error → Return failure
    ↓
Payment still succeeds ✅
User can access booking from dashboard


Scenario 3: Authentication Failed
    ↓
Try to authenticate with Gmail
    ↓
If fails → Log error → Return failure
    ↓
Payment still succeeds ✅
User can access booking from dashboard


Scenario 4: User/Expert Not Found
    ↓
Query database for user/expert
    ↓
If not found → Log warning → Skip email
    ↓
Payment still succeeds ✅
Booking is confirmed


Scenario 5: Email Sending Exception
    ↓
Catch exception in try-catch
    ↓
Log error with full traceback
    ↓
Payment still succeeds ✅
User can access booking from dashboard


┌─────────────────────────────────────────────────────────────────┐
│                    KEY PRINCIPLE                                │
│                                                                 │
│  Email failures are NON-BLOCKING                                │
│  Payment verification always succeeds if signature is valid     │
│  Users can always access booking from dashboard                 │
└─────────────────────────────────────────────────────────────────┘
```

## System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  BookingModal.jsx                                          │  │
│  │  - Razorpay integration                                    │  │
│  │  - Payment verification                                    │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                            ↓ HTTP POST
┌──────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  routes/payments.py                                        │  │
│  │  - POST /payments/verify                                   │  │
│  │  - Verify signature                                        │  │
│  │  - Update database                                         │  │
│  │  - Send emails ←─────────────────┐                         │  │
│  └────────────────────────────────────────────────────────────┘  │
│                            ↓                  ↑                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  utils/email_sender.py                                     │  │
│  │  - send_booking_confirmation_email()                       │  │
│  │  - send_expert_booking_notification_email()                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Flask-Mail                                                │  │
│  │  - SMTP connection                                         │  │
│  │  - Email formatting                                        │  │
│  │  - Send via Gmail                                          │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                            ↓ SMTP
┌──────────────────────────────────────────────────────────────────┐
│                    GMAIL SMTP SERVER                             │
│                    smtp.gmail.com:587                            │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│                    EMAIL DELIVER                                 │
│                                                                  │
│  User Inbox ←─── Confirmation Email                              │
│  Expert Inbox ←─── Notification Email                            │
└──────────────────────────────────────────────────────────────────┘
```

## Database Interaction

```
┌──────────────────────────────────────────────────────────────────┐
│                    DATABASE QUERIES                              │
└──────────────────────────────────────────────────────────────────┘

1. Verify Transaction Exists
   SELECT * FROM transactions WHERE razorpay_order_id = ?
        ↓
2. Verify Booking Ownership
   SELECT * FROM bookings WHERE id = ? AND user_id = ?
        ↓
3. Update Transaction
   UPDATE transactions 
   SET status = 'completed',
       razorpay_payment_id = ?,
       razorpay_signature = ?
   WHERE id = ?
        ↓
4. Update Booking
   UPDATE bookings 
   SET status = 'confirmed'
   WHERE id = ?
        ↓
5. Fetch User Details
   SELECT name, email FROM users WHERE id = ?
        ↓
6. Fetch Expert Details
   SELECT user_id FROM experts WHERE id = ?
        ↓
7. Fetch Expert User Details
   SELECT name, email FROM users WHERE id = ?
        ↓
8. Commit Transaction
   COMMIT;
```

## Configuration Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    CONFIGURATION LOADING                         │
└──────────────────────────────────────────────────────────────────┘

1. Load .env file
   backend/.env
        ↓
2. Parse environment variables
   - MAIL_SERVER
   - MAIL_PORT
   - MAIL_USERNAME
   - MAIL_PASSWORD
   - MAIL_DEFAULT_SENDER
   - FRONTEND_URL
        ↓
3. Load into Config class
   backend/config.py
        ↓
4. Initialize Flask app with config
   app.config.from_object(Config)
        ↓
5. Initialize Flask-Mail
   mail.init_app(app)
        ↓
6. Email functions access config
   current_app.config.get('MAIL_USERNAME')
   current_app.config.get('FRONTEND_URL')
```

---

**Legend**:
- ✅ Success path
- ❌ Error path
- 📧 Email action
- 🎥 Video meeting
- ↓ Flow direction
- → Alternative path
