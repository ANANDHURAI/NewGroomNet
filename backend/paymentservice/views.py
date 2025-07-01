import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from customersite.models import Booking, PaymentModel
from django.shortcuts import get_object_or_404
import logging

logger = logging.getLogger(__name__)
stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateStripeCheckoutSession(APIView):
    def post(self, request, *args, **kwargs):
        try:
            booking_id = request.data.get("booking_id")
            
            if not booking_id:
                logger.error("No booking_id provided")
                return Response(
                    {"error": "booking_id is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get booking and verify ownership
            try:
                booking = get_object_or_404(Booking, id=booking_id, customer=request.user)
                logger.info(f"Found booking {booking_id} for user {request.user.id}")
            except Exception as e:
                logger.error(f"Booking not found: {booking_id}, user: {request.user.id}, error: {str(e)}")
                return Response(
                    {"error": "Booking not found or access denied"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Get payment record
            try:
                payment = PaymentModel.objects.get(booking=booking)
                logger.info(f"Found payment record for booking {booking_id}")
            except PaymentModel.DoesNotExist:
                logger.error(f"PaymentModel not found for booking {booking_id}")
                return Response(
                    {"error": "Payment record not found for this booking"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Calculate amount - use the total_amount property
            try:
                total_amount = payment.total_amount  # This uses the property
                unit_amount = int(total_amount * 100)  # Convert to paisa/cents
                logger.info(f"Calculated unit_amount: {unit_amount} paisa for booking {booking_id}")
                
                if unit_amount <= 0:
                    logger.error(f"Invalid unit_amount: {unit_amount}")
                    return Response(
                        {"error": "Invalid payment amount"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except Exception as e:
                logger.error(f"Error calculating amount: {str(e)}")
                return Response(
                    {"error": "Error calculating payment amount"}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Get barber name safely
            barber_name = "Barber"
            if hasattr(booking.barber, 'name') and booking.barber.name:
                barber_name = booking.barber.name
            elif hasattr(booking.barber, 'username') and booking.barber.username:
                barber_name = booking.barber.username
            
            # Create Stripe checkout session
            try:
                checkout_session = stripe.checkout.Session.create(
                    payment_method_types=['card'], 
                    line_items=[{
                        'price_data': {
                            'currency': 'inr',
                            'unit_amount': unit_amount,
                            'product_data': {
                                'name': booking.service.name,
                                'description': f"Booking with {barber_name} - Service: {booking.service.name}",
                            },
                        },
                        'quantity': 1,
                    }],
                    mode='payment',
                    success_url=f"http://localhost:5173/booking-success?session_id={{CHECKOUT_SESSION_ID}}",
                    cancel_url="http://localhost:5173/payment-cancelled",
                    metadata={
                        "booking_id": str(booking.id),
                        "customer_id": str(request.user.id),
                        "payment_id": str(payment.id),
                    }
                )
                
                logger.info(f"Created Stripe session {checkout_session.id} for booking {booking_id}")
                
                return Response({
                    "sessionId": checkout_session.id, 
                    "stripe_public_key": settings.STRIPE_PUBLISHABLE_KEY,
                    "url": checkout_session.url,
                    "amount": float(total_amount),
                    "currency": "INR"
                })
                
            except stripe.error.StripeError as e:
                logger.error(f"Stripe error: {str(e)}")
                return Response(
                    {"error": f"Payment service error: {str(e)}"}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        except Exception as e:
            logger.error(f"Unexpected error in CreateStripeCheckoutSession: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse


class VerifyPayment(APIView):
    def post(self, request):
        session_id = request.data.get('session_id')
        if not session_id:
            return Response({"error": "session_id is required"}, status=400)
        
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            if session.payment_status == 'paid':
                booking_id = session.metadata.get("booking_id")

                booking = Booking.objects.get(id=booking_id)
                booking.is_payment_done = True
                booking.save()

                PaymentModel.objects.filter(booking=booking).update(
                    transaction_id=session.id,
                    payment_status='SUCCESS',
                    payment_method='STRIPE'
                )

                return Response({"message": "Payment verified and booking updated."})
            else:
                return Response({"message": "Payment not completed yet."}, status=202)
        except Exception as e:
            return Response({"error": str(e)}, status=500)