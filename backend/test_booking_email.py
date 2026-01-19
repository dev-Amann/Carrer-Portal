"""
Test script to verify booking confirmation email functionality
Run this to test if emails are being sent correctly
"""
import sys
import os
from datetime import datetime, timedelta

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app
from utils.email_sender import send_booking_confirmation_email, send_expert_booking_notification_email

def test_booking_emails():
    """Test sending booking confirmation emails"""
    with app.app_context():
        print("Testing booking confirmation emails...")
        print("-" * 50)
        
        # Test data
        user_email = "user@example.com"  # Using the configured email
        user_name = "Test User"
        expert_name = "Test Expert"
        slot_start = datetime.now() + timedelta(days=1)
        slot_end = slot_start + timedelta(hours=1)
        jitsi_room = "test-room-12345"
        booking_id = 999
        razorpay_payment_id = "pay_test_1234567890abcdef"  # Test transaction ID
        
        print(f"\nTest 1: Sending booking confirmation to user ({user_email})...")
        success, message = send_booking_confirmation_email(
            user_email=user_email,
            user_name=user_name,
            expert_name=expert_name,
            slot_start=slot_start,
            slot_end=slot_end,
            jitsi_room=jitsi_room,
            booking_id=booking_id,
            razorpay_payment_id=razorpay_payment_id
        )
        
        if success:
            print(f"✅ SUCCESS: {message}")
        else:
            print(f"❌ FAILED: {message}")
        
        print(f"\nTest 2: Sending booking notification to expert ({user_email})...")
        success, message = send_expert_booking_notification_email(
            expert_email=user_email,
            expert_name=expert_name,
            user_name=user_name,
            slot_start=slot_start,
            slot_end=slot_end,
            jitsi_room=jitsi_room,
            booking_id=booking_id
        )
        
        if success:
            print(f"✅ SUCCESS: {message}")
        else:
            print(f"❌ FAILED: {message}")
        
        print("\n" + "-" * 50)
        print("Email test completed!")
        print("Check your inbox at:", user_email)

if __name__ == "__main__":
    test_booking_emails()
