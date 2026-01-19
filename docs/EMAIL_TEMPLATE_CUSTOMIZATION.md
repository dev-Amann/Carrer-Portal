# Email Template Customization Guide

## Overview
Email templates are now stored as separate HTML and text files in `backend/templates/email/`, making them easy to customize without touching Python code.

## Template Files

### Booking Confirmation (User)
- **HTML**: `backend/templates/email/booking_confirmation.html`
- **Text**: `backend/templates/email/booking_confirmation.txt`
- **Purpose**: Sent to users after successful booking payment

### Expert Notification
- **HTML**: `backend/templates/email/expert_booking_notification.html`
- **Text**: `backend/templates/email/expert_booking_notification.txt`
- **Purpose**: Sent to experts when they receive a new booking

## Available Template Variables

Both templates have access to these Jinja2 variables:

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `user_name` | string | User's full name | "John Doe" |
| `expert_name` | string | Expert's full name | "Dr. Jane Smith" |
| `formatted_date` | string | Session date | "January 15, 2024" |
| `formatted_start_time` | string | Session start time | "02:00 PM" |
| `formatted_end_time` | string | Session end time | "03:00 PM" |
| `booking_id` | integer | Unique booking ID | 123 |
| `razorpay_payment_id` | string | Razorpay transaction ID | "pay_abc123xyz" |
| `meeting_url` | string | Jitsi meeting link | "https://meet.jit.si/room-123" |
| `dashboard_url` | string | Dashboard link | "http://localhost:5173/dashboard" |

## Using Variables in Templates

### In HTML Templates
```html
<h2>Hello {{ user_name }}!</h2>
<p>Your booking with <strong>{{ expert_name }}</strong> is confirmed.</p>
<p>Date: {{ formatted_date }}</p>
<p>Time: {{ formatted_start_time }} - {{ formatted_end_time }}</p>
<a href="{{ meeting_url }}">Join Meeting</a>
```

### In Text Templates
```
Hello {{ user_name }}!

Your booking with {{ expert_name }} is confirmed.

Date: {{ formatted_date }}
Time: {{ formatted_start_time }} - {{ formatted_end_time }}

Meeting Link: {{ meeting_url }}
```

## Customization Examples

### 1. Change Colors

**Current gradient (User emails):**
```css
background: linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%);
```

**Change to purple gradient:**
```css
background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%);
```

**Current gradient (Expert emails):**
```css
background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%);
```

### 2. Add Company Logo

Add to the header section:
```html
<div class="header">
    <img src="https://your-domain.com/logo.png" alt="CarrerPortal" style="max-width: 150px; margin-bottom: 10px;">
    <h1>🎉 Booking Confirmed!</h1>
    <p>Your consultation session is all set</p>
</div>
```

### 3. Add Additional Information

Add a new section in the content area:
```html
<div class="content">
    <!-- Existing content -->
    
    <!-- New section -->
    <div style="background: #e0f2fe; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>📝 Preparation Tips</h3>
        <ul>
            <li>Test your camera and microphone before the session</li>
            <li>Prepare any questions you'd like to discuss</li>
            <li>Have a notebook ready for taking notes</li>
        </ul>
    </div>
</div>
```

### 4. Customize Footer

**Current footer:**
```html
<div class="footer">
    <p>© 2024 CarrerPortal. All rights reserved.</p>
    <p>This is an automated email. Please do not reply.</p>
</div>
```

**Add social links:**
```html
<div class="footer">
    <p>© 2024 CarrerPortal. All rights reserved.</p>
    <p>
        <a href="https://twitter.com/carrerportal">Twitter</a> |
        <a href="https://linkedin.com/company/carrerportal">LinkedIn</a> |
        <a href="https://carrerportal.com">Website</a>
    </p>
    <p>This is an automated email. Please do not reply.</p>
</div>
```

### 5. Add Conditional Content

Use Jinja2 conditionals:
```html
{% if booking_id > 100 %}
<div class="special-offer">
    <p>🎉 Congratulations! You're our 100+ customer. Enjoy 10% off your next booking!</p>
</div>
{% endif %}
```

### 6. Format Currency

If you add amount to template variables:
```html
<p>Amount Paid: ${{ "%.2f"|format(amount) }}</p>
```

### 7. Add Cancellation Policy

```html
<div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <h3>📋 Cancellation Policy</h3>
    <p>Free cancellation up to 24 hours before the session. 
       Cancellations within 24 hours are subject to a 50% fee.</p>
</div>
```

## Testing Your Changes

After modifying templates:

1. **Save the template file**
2. **Restart the Flask backend** (if running)
3. **Run the test script:**
   ```bash
   cd backend
   python test_booking_email.py
   ```
4. **Check your email inbox** for the updated template

## Best Practices

### HTML Templates

1. **Inline CSS**: Use inline styles for maximum email client compatibility
   ```html
   <p style="color: #333; font-size: 16px;">Text</p>
   ```

2. **Tables for Layout**: Use tables instead of divs for complex layouts
   ```html
   <table width="100%">
       <tr>
           <td>Content</td>
       </tr>
   </table>
   ```

3. **Absolute URLs**: Always use absolute URLs for images and links
   ```html
   <img src="https://your-domain.com/image.png" alt="Description">
   ```

4. **Test Across Clients**: Test in Gmail, Outlook, Apple Mail, etc.

5. **Keep It Simple**: Avoid complex CSS, JavaScript, or external stylesheets

### Text Templates

1. **Keep It Readable**: Use clear formatting with line breaks
2. **Include All Links**: Provide full URLs since they won't be clickable
3. **Use ASCII Art Sparingly**: Some email clients may not display it correctly
4. **Match HTML Content**: Ensure text version has same information as HTML

## Common Styling Patterns

### Button Styles
```html
<a href="{{ meeting_url }}" style="
    background: linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%);
    color: white;
    padding: 15px 30px;
    text-decoration: none;
    border-radius: 5px;
    display: inline-block;
    font-weight: bold;
">Join Meeting</a>
```

### Info Box
```html
<div style="
    background: #f9f9f9;
    border-left: 4px solid #3B82F6;
    padding: 20px;
    margin: 20px 0;
    border-radius: 4px;
">
    <h3 style="margin-top: 0;">Information</h3>
    <p>Your content here</p>
</div>
```

### Warning Box
```html
<div style="
    background: #fff3cd;
    border-left: 4px solid #ffc107;
    padding: 15px;
    margin: 20px 0;
    border-radius: 4px;
">
    <strong>⚠️ Important:</strong> Your message here
</div>
```

## Adding New Template Variables

If you need to pass additional data to templates:

1. **Update the email function** in `backend/utils/email_sender.py`:
   ```python
   template_context = {
       'user_name': user_name,
       'expert_name': expert_name,
       # ... existing variables ...
       'new_variable': new_value  # Add your new variable
   }
   ```

2. **Use in template**:
   ```html
   <p>{{ new_variable }}</p>
   ```

## Troubleshooting

### Template Not Updating
- Restart Flask backend
- Clear browser cache
- Check file was saved

### Variables Not Showing
- Check variable name spelling
- Ensure variable is in `template_context` dict
- Check for typos in template file

### Styling Not Working
- Use inline styles instead of CSS classes
- Test in multiple email clients
- Avoid complex CSS properties

### Images Not Loading
- Use absolute URLs (https://...)
- Check image is publicly accessible
- Test image URL in browser first

## Advanced Customization

### Multiple Languages

Create language-specific templates:
```
backend/templates/email/
├── booking_confirmation_en.html
├── booking_confirmation_es.html
├── booking_confirmation_fr.html
```

Update email function to select template based on user language:
```python
template_name = f'email/booking_confirmation_{user_language}.html'
msg.html = render_template(template_name, **template_context)
```

### Dynamic Content Blocks

Use Jinja2 includes for reusable sections:
```html
<!-- In booking_confirmation.html -->
{% include 'email/partials/header.html' %}
{% include 'email/partials/footer.html' %}
```

### Template Inheritance

Create a base template:
```html
<!-- base_email.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        /* Common styles */
    </style>
</head>
<body>
    {% block content %}{% endblock %}
</body>
</html>
```

Extend in specific templates:
```html
<!-- booking_confirmation.html -->
{% extends "email/base_email.html" %}
{% block content %}
    <!-- Your specific content -->
{% endblock %}
```

## Resources

- **Jinja2 Documentation**: https://jinja.palletsprojects.com/
- **Email Design Guide**: https://www.campaignmonitor.com/dev-resources/
- **HTML Email Best Practices**: https://www.emailonacid.com/blog/
- **Test Your Emails**: https://www.mail-tester.com/

## Support

If you need help customizing templates:
1. Check this guide for examples
2. Review Jinja2 documentation for template syntax
3. Test changes with `python test_booking_email.py`
4. Check email in multiple clients before deploying
