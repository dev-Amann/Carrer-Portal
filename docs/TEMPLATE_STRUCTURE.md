# Email Template Structure

## Directory Layout

```
backend/
├── templates/
│   └── email/
│       ├── booking_confirmation.html          ← User confirmation (HTML)
│       ├── booking_confirmation.txt           ← User confirmation (plain text)
│       ├── expert_booking_notification.html   ← Expert notification (HTML)
│       ├── expert_booking_notification.txt    ← Expert notification (plain text)
│       ├── contact.html                       ← Contact form (HTML)
│       ├── contact.txt                        ← Contact form (plain text)
│       ├── expert_approval.html               ← Expert approval (HTML)
│       ├── expert_approval.txt                ← Expert approval (plain text)
│       ├── expert_rejection.html              ← Expert rejection (HTML)
│       └── expert_rejection.txt               ← Expert rejection (plain text)
└── utils/
    └── email_sender.py                        ← Email sending functions
```

## Template Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Payment Verified                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│         send_booking_confirmation_email()                    │
│         (in email_sender.py)                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    Prepare context:
                    {
                      user_name,
                      expert_name,
                      formatted_date,
                      formatted_start_time,
                      formatted_end_time,
                      booking_id,
                      meeting_url,
                      dashboard_url
                    }
                            ↓
        ┌───────────────────────────────────────┐
        │   render_template()                   │
        └───────────────────────────────────────┘
                ↓                       ↓
    ┌──────────────────┐    ┌──────────────────┐
    │  HTML Template   │    │  Text Template   │
    │  .html file      │    │  .txt file       │
    └──────────────────┘    └──────────────────┘
                ↓                       ↓
            msg.html              msg.body
                            ↓
                    ┌──────────────┐
                    │  mail.send() │
                    └──────────────┘
                            ↓
                    📧 Email Sent!
```

## Template Anatomy

### HTML Template Structure

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Title</title>
    <style>
        /* Inline CSS styles */
        body { ... }
        .container { ... }
        .header { ... }
        /* etc. */
    </style>
</head>
<body>
    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <h1>🎉 Title</h1>
            <p>Subtitle</p>
        </div>
        
        <!-- Content Section -->
        <div class="content">
            <h2>Hello {{ user_name }}!</h2>
            
            <!-- Booking Details Box -->
            <div class="booking-details">
                <h3>📅 Details</h3>
                <div class="detail-row">
                    <span class="label">Label:</span>
                    <span class="value">{{ variable }}</span>
                </div>
            </div>
            
            <!-- Call to Action Button -->
            <div class="button-container">
                <a href="{{ meeting_url }}" class="meeting-link">
                    Join Meeting
                </a>
            </div>
            
            <!-- Additional Info -->
            <p>More information...</p>
        </div>
        
        <!-- Footer Section -->
        <div class="footer">
            <p>© 2024 CarrerPortal</p>
            <p>Automated email</p>
        </div>
    </div>
</body>
</html>
```

### Text Template Structure

```
CarrerPortal - Email Title

Hello {{ user_name }}!

Main message content here.

SECTION HEADING
---------------
Label: {{ variable }}
Label: {{ variable }}

Additional information.

Link: {{ meeting_url }}

Closing message.

Best regards,
The CarrerPortal Team

© 2024 CarrerPortal. All rights reserved.
```

## Color Schemes

### User Emails (Booking Confirmation)
```css
/* Primary gradient - Green to Blue */
background: linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%);

/* Accent color - Blue */
border-left: 4px solid #3B82F6;
```

### Expert Emails (Booking Notification)
```css
/* Primary gradient - Purple to Blue */
background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%);

/* Accent color - Purple */
border-left: 4px solid #8B5CF6;
```

### Common Colors
```css
/* Background */
background-color: #f4f4f4;

/* Container */
background: white;

/* Text */
color: #333;

/* Labels */
color: #555;

/* Info boxes */
background: #f9f9f9;

/* Warning boxes */
background: #fff3cd;
border-left: 4px solid #ffc107;
```

## Component Breakdown

### 1. Header Component
```html
<div class="header">
    <h1>🎉 Booking Confirmed!</h1>
    <p>Your consultation session is all set</p>
</div>
```
**Purpose**: Eye-catching title with gradient background

### 2. Greeting
```html
<h2>Hello {{ user_name }}!</h2>
<p>Great news! Your booking with <strong>{{ expert_name }}</strong> has been confirmed.</p>
```
**Purpose**: Personalized welcome message

### 3. Details Box
```html
<div class="booking-details">
    <h3>📅 Booking Details</h3>
    <div class="detail-row">
        <span class="label">Expert:</span>
        <span class="value">{{ expert_name }}</span>
    </div>
    <!-- More rows -->
</div>
```
**Purpose**: Structured information display

### 4. Important Notice
```html
<div class="important">
    <strong>⏰ Important:</strong> Please join at the scheduled time.
</div>
```
**Purpose**: Highlight critical information

### 5. Call-to-Action Button
```html
<div class="button-container">
    <a href="{{ meeting_url }}" class="meeting-link">
        Join Video Meeting
    </a>
</div>
```
**Purpose**: Primary action for user

### 6. Footer
```html
<div class="footer">
    <p>© 2024 CarrerPortal. All rights reserved.</p>
    <p>This is an automated email. Please do not reply.</p>
</div>
```
**Purpose**: Legal and informational footer

## Responsive Design

### Mobile-Friendly Styles
```css
.container {
    max-width: 600px;  /* Limits width on desktop */
    margin: 20px auto; /* Centers on desktop */
}

/* Buttons are full-width on mobile */
.meeting-link {
    display: inline-block;
    padding: 15px 30px;
}

/* Text is readable on small screens */
body {
    font-size: 16px;
    line-height: 1.6;
}
```

## Variable Reference

### User Confirmation Email
| Variable | Example | Used In |
|----------|---------|---------|
| `user_name` | "John Doe" | Greeting, content |
| `expert_name` | "Dr. Jane Smith" | Details, subject |
| `formatted_date` | "January 15, 2024" | Details |
| `formatted_start_time` | "02:00 PM" | Details |
| `formatted_end_time` | "03:00 PM" | Details |
| `booking_id` | 123 | Details |
| `razorpay_payment_id` | "pay_abc123xyz" | Details (optional) |
| `meeting_url` | "https://meet.jit.si/..." | Button, link |
| `dashboard_url` | "http://localhost:5173/dashboard" | Link |

### Expert Notification Email
| Variable | Example | Used In |
|----------|---------|---------|
| `expert_name` | "Dr. Jane Smith" | Greeting |
| `user_name` | "John Doe" | Details, subject |
| `formatted_date` | "January 15, 2024" | Details, subject |
| `formatted_start_time` | "02:00 PM" | Details |
| `formatted_end_time` | "03:00 PM" | Details |
| `booking_id` | 123 | Details |
| `meeting_url` | "https://meet.jit.si/..." | Button, link |
| `dashboard_url` | "http://localhost:5173/expert/dashboard" | Link |

## Editing Workflow

```
1. Identify Template
   ↓
2. Open Template File
   backend/templates/email/[template_name].html
   ↓
3. Make Changes
   - Edit HTML structure
   - Modify CSS styles
   - Update content
   - Add/remove sections
   ↓
4. Save File
   ↓
5. Restart Flask Backend
   (if running)
   ↓
6. Test Changes
   python backend/test_booking_email.py
   ↓
7. Check Email Inbox
   ↓
8. Verify Appearance
   - Desktop view
   - Mobile view
   - Different email clients
   ↓
9. Deploy
```

## Best Practices

### ✅ Do
- Use inline CSS styles
- Test in multiple email clients
- Keep HTML simple
- Use absolute URLs for images
- Provide plain text alternative
- Use semantic HTML
- Test on mobile devices

### ❌ Don't
- Use external stylesheets
- Use JavaScript
- Use complex CSS (flexbox, grid)
- Use relative URLs
- Forget plain text version
- Use only images for content
- Assume all clients support HTML

## Quick Customization Checklist

- [ ] Update colors to match brand
- [ ] Add company logo
- [ ] Customize header text
- [ ] Modify button styles
- [ ] Add/remove sections
- [ ] Update footer information
- [ ] Test in Gmail
- [ ] Test in Outlook
- [ ] Test on mobile
- [ ] Verify all links work
- [ ] Check plain text version
- [ ] Deploy changes

---

**Related Documentation:**
- 📖 [Customization Guide](EMAIL_TEMPLATE_CUSTOMIZATION.md)
- 🔧 [Troubleshooting](EMAIL_TROUBLESHOOTING.md)
- 📊 [Documentation Index](DOCUMENTATION_INDEX.md)
