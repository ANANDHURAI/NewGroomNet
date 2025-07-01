from django.urls import path
from .views import CreateStripeCheckoutSession, VerifyPayment

urlpatterns = [
    path('create-checkout-session/', CreateStripeCheckoutSession.as_view(), name='create_checkout_session'),
    path('verify-payment/', VerifyPayment.as_view()),
]
