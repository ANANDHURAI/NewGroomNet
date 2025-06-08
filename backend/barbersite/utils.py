from django.core.mail import send_mail
from django.conf import settings

def send_otp_email(email, otp_code, name=""):
    subject = 'Your Login OTP'
    message = f'''
Hello {name},

Your login OTP is: {otp_code}

This code will expire in 5 minutes.

Best regards,
Barber App Team
    '''.strip()
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        return True
    except:
        return False