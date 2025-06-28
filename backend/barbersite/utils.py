import logging
import requests
from django.conf import settings
from twilio.rest import Client
import firebase_admin
from firebase_admin import messaging


if not firebase_admin._apps:
    firebase_admin.initialize_app()

logger = logging.getLogger(__name__)

def send_push_notification(user_id, title, message, data=None):
    try:
        from authservice.models import User, FCMToken

        user = User.objects.get(id=user_id)
        fcm_tokens = FCMToken.objects.filter(user=user, is_active=True)

        if not fcm_tokens.exists():
            logger.warning(f"No FCM tokens found for user {user_id}")
            return False
        notification = messaging.Notification(
            title=title,
            body=message
        )

        success_count = 0
        for fcm_token in fcm_tokens:
            try:
                message_obj = messaging.Message(
                    notification=notification,
                    data=data or {},
                    token=fcm_token.token
                )

                response = messaging.send(message_obj)
                logger.info(f"Push notification sent to {user.username}: {response}")
                success_count += 1

            except Exception as e:
                logger.error(f"Failed to send notification to token {fcm_token.token}: {str(e)}")

        return success_count > 0

    except User.DoesNotExist:
        logger.error(f"User with ID {user_id} does not exist.")
        return False

    except Exception as e:
        logger.exception(f"Unexpected error in send_push_notification: {str(e)}")
        return False
