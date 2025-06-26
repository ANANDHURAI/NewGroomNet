from django.urls import path
from .views import CreateStripeCheckoutSession, stripe_webhook

urlpatterns = [
    path('create-checkout-session/', CreateStripeCheckoutSession.as_view(), name='create_checkout_session'),
    path('webhook/', stripe_webhook, name='stripe_webhook'),
]
