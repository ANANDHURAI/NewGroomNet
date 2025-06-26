import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from customersite.models import Booking, PaymentModel
from django.shortcuts import get_object_or_404

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateStripeCheckoutSession(APIView):
    def post(self, request, *args, **kwargs):
        booking_id = request.data.get("booking_id")
        booking = get_object_or_404(Booking, id=booking_id, customer=request.user)

        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'inr',
                        'unit_amount': int(booking.total_amount * 100),
                        'product_data': {
                            'name': booking.service.name,
                        },
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=f"http://localhost:5173/booking-success?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url="http://localhost:5173/payment-cancelled",
                metadata={"booking_id": str(booking.id)}
            )

            return Response({"sessionId": checkout_session.id, "stripe_public_key": settings.STRIPE_PUBLISHABLE_KEY})
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_ENDPOINT_SECRET
        )
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        booking_id = session['metadata']['booking_id']
        booking = Booking.objects.get(id=booking_id)
        booking.is_payment_done = True
        booking.save()

        PaymentModel.objects.filter(booking=booking).update(
            transaction_id=session['id'],
            payment_status='SUCCESS',
            payment_method='STRIPE'
        )

    return HttpResponse(status=200)
