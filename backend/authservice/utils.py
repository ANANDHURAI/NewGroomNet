from django.core.mail import send_mail
from django.conf import settings


def send_otp(email, otp):
    subject = 'Your OTP for Password Reset'
    message = f'Your OTP for resetting your password is: {otp}\n\nThis OTP is valid for 5 minutes.'
    from_email = settings.EMAIL_HOST_USER

    try:
        send_mail(subject, message, from_email, [email])
        return True
    except Exception as e:
        print(f"Error sending OTP email: {e}")
        return False
