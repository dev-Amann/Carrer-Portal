# Email System Troubleshooting Guide

## Quick Diagnostics

### 1. Check Email Configuration
Verify these settings in `backend/.env`:
```bash
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=user@example.com
MAIL_PASSWORD=***REDACTED_PWD***
MAIL_DEFAULT_SENDER=user@example.com
ADMIN_EMAIL=user@example.com
FRONTEND_URL=http://localhost:5173
```

### 2. Test Email Functionality
```bash
cd backend
python test_booking_email.py
```

Expected output:
```
✅ SUCCESS: Booking confirmation email sent successfully
✅ SUCCESS: Expert notification email sent successfully
```

## Common Issues & Solutions

### Issue 1: "Authentication Failed" Error
**Symptoms**: Email sending fails with authentication error

**Solutions**:
1. **Check Gmail App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Generate new App Password
   - Update `MAIL_PASSWORD` in `.env`

2. **Enable 2-Factor Authentication**
   - Gmail requires 2FA to use App Passwords
   - Enable at: https://myaccount.google.com/security

3. **Check "Less Secure Apps"**
   - If not using App Password, enable less secure apps
   - Not recommended for production

### Issue 2: Emails Not Received
**Symptoms**: No error but emails don't arrive

**Solutions**:
1. **Check Spam Folder**
   - Automated emails often go to spam
   - Mark as "Not Spam" to whitelist

2. **Verify Email Address**
   - Check user/expert email in database
   - Ensure no typos

3. **Check Email Logs**
   - Look for: `Booking confirmation email sent successfully`
   - If present, email was sent (check spam)

4. **Test with Different Email**
   - Try sending to different email provider
   - Gmail, Outlook, Yahoo, etc.

### Issue 3: "Connection Refused" Error
**Symptoms**: Cannot connect to SMTP server

**Solutions**:
1. **Check Internet Connection**
   - Ensure server has internet access

2. **Verify SMTP Settings**
   - Server: `smtp.gmail.com`
   - Port: `587`
   - TLS: `True`

3. **Check Firewall**
   - Ensure port 587 is not blocked
   - Check corporate/network firewall

### Issue 4: "Sender Address Rejected"
**Symptoms**: Email rejected by SMTP server

**Solutions**:
1. **Match Sender Email**
   - `MAIL_USERNAME` and `MAIL_DEFAULT_SENDER` should match
   - Both should be the same Gmail address

2. **Verify Email Ownership**
   - Ensure you own the email account
   - Cannot send from arbitrary addresses

### Issue 5: Payment Succeeds but No Email
**Symptoms**: Booking confirmed but no emails sent

**Solutions**:
1. **Check Backend Logs**
   ```bash
   # Look for these messages:
   "Payment verified successfully"
   "Booking confirmation email sent to user"
   "Booking notification email sent to expert"
   ```

2. **Verify Email Function Import**
   - Check `backend/routes/payments.py`
   - Should import: `send_booking_confirmation_email`, `send_expert_booking_notification_email`

3. **Check User/Expert Data**
   - Ensure user and expert records exist
   - Verify email fields are populated

4. **Review Error Logs**
   - Look for: `"Error sending booking confirmation emails"`
   - Check exception details

## Testing Checklist

### ✅ Pre-Flight Checks
- [ ] Backend server is running
- [ ] `.env` file has all email settings
- [ ] Gmail App Password is valid
- [ ] Internet connection is active

### ✅ Email Function Test
```bash
cd backend
python test_booking_email.py
```
- [ ] Test script runs without errors
- [ ] Email received in inbox (or spam)
- [ ] Email displays correctly (HTML)

### ✅ Integration Test
1. [ ] Start backend: `flask run`
2. [ ] Start frontend: `npm run dev`
3. [ ] Create test booking
4. [ ] Complete payment (test mode)
5. [ ] Check user email inbox
6. [ ] Check expert email inbox
7. [ ] Verify email content is correct

## Monitoring Email Delivery

### Backend Logs
Watch for these log messages:
```
INFO: Payment verified successfully: transaction_id=X, payment_id=Y
INFO: Booking confirmation email sent successfully to user@email.com
INFO: Booking notification email sent successfully to expert@email.com
```

### Warning Messages
```
WARNING: Failed to send booking confirmation email to user: [error]
WARNING: Could not send booking emails: user=True, expert=True, expert_user=False
```

### Error Messages
```
ERROR: Error sending booking confirmation emails: [exception]
ERROR: Failed to send booking confirmation email: [error]
```

## Email Content Verification

### User Confirmation Email Should Include:
- ✅ Subject: "🎉 Booking Confirmed with [Expert Name]"
- ✅ Expert name
- ✅ Date and time of session
- ✅ Booking ID
- ✅ Jitsi meeting link
- ✅ Dashboard link
- ✅ CarrerPortal branding

### Expert Notification Email Should Include:
- ✅ Subject: "📅 New Booking: [User Name] - [Date]"
- ✅ Client name
- ✅ Date and time of session
- ✅ Booking ID
- ✅ Jitsi meeting link
- ✅ Expert dashboard link
- ✅ CarrerPortal branding

## Advanced Debugging

### Enable Flask-Mail Debug Mode
In `backend/app.py`, add:
```python
app.config['MAIL_DEBUG'] = True
```

### Test SMTP Connection Manually
```python
import smtplib
from email.mime.text import MIMEText

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login('your_email@gmail.com', 'your_app_password')

msg = MIMEText('Test email')
msg['Subject'] = 'Test'
msg['From'] = 'your_email@gmail.com'
msg['To'] = 'recipient@email.com'

server.send_message(msg)
server.quit()
print("Email sent successfully!")
```

### Check Flask-Mail Installation
```bash
pip show Flask-Mail
```

Should show version 0.9.1 or higher.

## Alternative Email Providers

### Using SendGrid (Optional)
1. Get API key from SendGrid
2. Add to `.env`:
   ```
   SENDGRID_API_KEY=your_sendgrid_api_key
   ```
3. Install: `pip install sendgrid`
4. System will automatically use SendGrid if configured

### Using Other SMTP Providers
Update `.env` with provider settings:

**Outlook/Hotmail**:
```
MAIL_SERVER=smtp-mail.outlook.com
MAIL_PORT=587
```

**Yahoo**:
```
MAIL_SERVER=smtp.mail.yahoo.com
MAIL_PORT=587
```

**Custom SMTP**:
```
MAIL_SERVER=your.smtp.server
MAIL_PORT=587
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
```

## Production Considerations

### Security
- ✅ Use environment variables for credentials
- ✅ Never commit `.env` to version control
- ✅ Use App Passwords, not account passwords
- ✅ Enable 2FA on email account

### Reliability
- ✅ Implement email queue for high volume
- ✅ Add retry logic for failed sends
- ✅ Monitor email delivery rates
- ✅ Set up email delivery webhooks

### Performance
- ✅ Send emails asynchronously (background tasks)
- ✅ Use email service with good deliverability
- ✅ Implement rate limiting
- ✅ Cache email templates

## Support Resources

### Gmail Help
- App Passwords: https://support.google.com/accounts/answer/185833
- 2FA Setup: https://support.google.com/accounts/answer/185839
- SMTP Settings: https://support.google.com/mail/answer/7126229

### Flask-Mail Documentation
- Official Docs: https://pythonhosted.org/Flask-Mail/
- GitHub: https://github.com/mattupstate/flask-mail

### SendGrid Documentation
- Getting Started: https://docs.sendgrid.com/for-developers/sending-email
- Python Library: https://github.com/sendgrid/sendgrid-python

## Contact
If issues persist after following this guide:
1. Check backend logs for detailed error messages
2. Verify all configuration settings
3. Test with the provided test script
4. Review the BOOKING_EMAIL_FIX.md for implementation details
