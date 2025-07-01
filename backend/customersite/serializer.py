from rest_framework import serializers
from adminsite.models import CategoryModel, ServiceModel
from .models import Booking , PaymentModel
from authservice.models import User
from barbersite.models import BarberSlot
from profileservice.models import Address
from .utils import get_lat_lng_from_address
from django.db import transaction


class BarberSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'phone', 'profileimage']
    

class AvailableSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = BarberSlot
        fields = ['id', 'date', 'start_time', 'end_time']

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'name', 'mobile', 'building', 'street', 'city', 'district', 'state', 'pincode', 'is_default']
        
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        address = super().create(validated_data)

        # Construct full address for geocoding
        full_address = f"{address.building}, {address.street}, {address.city}, {address.district}, {address.state}, {address.pincode}"
        lat, lng = get_lat_lng_from_address(full_address)
        print("latitude and langitut",lat,lng)

        if lat and lng:
            profile, _ = user.profile.get_or_create(user=user)
            profile.latitude = lat
            profile.longitude = lng
            profile.address = address
            profile.save()
        
        return address

    

from rest_framework import serializers
from .models import Booking, PaymentModel

class BookingCreateSerializer(serializers.ModelSerializer):
    payment_method = serializers.CharField(write_only=True)
    booking_type = serializers.CharField(write_only=True)

    class Meta:
        model = Booking
        fields = ['service', 'barber', 'slot', 'address', 'payment_method', 'booking_type']

    def validate_address(self, value):
        request = self.context.get('request')
        if request and value.user != request.user:
            raise serializers.ValidationError("Address does not belong to the current user")
        return value

    def validate_payment_method(self, value):
        valid_methods = ['COD', 'STRIPE', 'WALLET']
        if value not in valid_methods:
            raise serializers.ValidationError(f"Invalid payment method. Must be one of: {valid_methods}")
        return value

    def validate_booking_type(self, value):
        valid_types = ['INSTANT_BOOKING', 'SCHEDULE_BOOKING']
        if value not in valid_types:
            raise serializers.ValidationError(f"Invalid booking type. Must be one of: {valid_types}")
        return value

    def create(self, validated_data):
        request = self.context['request']
        customer = request.user
        payment_method = validated_data.pop('payment_method')
        booking_type = validated_data.pop('booking_type')
        service = validated_data['service']
        slot = validated_data['slot']
        
        # Ensure service has a price
        if not hasattr(service, 'price') or service.price is None:
            raise serializers.ValidationError("Service price is not set")
        
        # Convert to Decimal for precise calculations
        from decimal import Decimal
        service_amount = Decimal(str(service.price))
        platform_fee = (service_amount * Decimal('0.05')).quantize(Decimal('0.01'))
        total_amount = service_amount + platform_fee

        if slot.is_booked:
            raise serializers.ValidationError("This slot is already booked")

        with transaction.atomic():
            slot.is_booked = True
            slot.save()

            booking = Booking.objects.create(
                customer=customer,
                total_amount=total_amount,
                is_payment_done=(payment_method in ['COD', 'WALLET']),
                status='CONFIRMED',
                booking_type=booking_type,
                **validated_data
            )

            # Set payment status based on method
            if payment_method == 'COD':
                payment_status = 'PENDING'
            elif payment_method == 'WALLET':
                payment_status = 'SUCCESS'
            elif payment_method == 'STRIPE':
                payment_status = 'PENDING'
            else:
                payment_status = 'PENDING'

            PaymentModel.objects.create(
                booking=booking,
                payment_method=payment_method,
                payment_status=payment_status,
                service_amount=service_amount,
                platform_fee=platform_fee
            )

        return booking

class BookingSummarySerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='service.name', read_only=True)
    barber_name = serializers.CharField(source='barber.name', read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    slot_date = serializers.DateField(source='slot.date', read_only=True)
    slot_time = serializers.CharField(source='slot.start_time', read_only=True)
    address_full = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = [
            'id', 'service_name', 'barber_name', 'customer_name', 
            'slot_date', 'slot_time', 'total_amount', 'payment_method', 
            'status', 'address_full', 'created_at'
        ]
    
    def get_address_full(self, obj):
        return f"{obj.address.building}, {obj.address.street}, {obj.address.city}, {obj.address.state} - {obj.address.pincode}"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryModel
        fields = ['id', 'name', 'image']


class ServiceSerializer(serializers.ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = ServiceModel
        fields = ['id', 'name', 'description', 'price', 'duration_minutes', 'image', 'category']


class HomeSerializer(serializers.Serializer):
    greeting_message = serializers.CharField()
    categories = CategorySerializer(many=True)
    services = ServiceSerializer(many=True)

class PaymentSerializer(serializers.ModelSerializer):
    booking_id = serializers.IntegerField(source='booking.id', read_only=True)
    customer_name = serializers.CharField(source='booking.customer.name', read_only=True)
    service_name = serializers.CharField(source='booking.service.name', read_only=True)
    
    class Meta:
        model = PaymentModel
        fields = [
            'id', 'transaction_id', 'payment_status',
            'created_at', 'updated_at',
            'booking_id', 'customer_name', 'service_name'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']