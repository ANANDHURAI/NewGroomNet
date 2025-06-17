from rest_framework import serializers
from adminsite.models import CategoryModel, ServiceModel
from .models import Booking , PaymentModel
from authservice.models import User
from barbersite.models import BarberSlot
from profileservice.models import Address

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
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    

from rest_framework import serializers
from .models import Booking, PaymentModel

class BookingCreateSerializer(serializers.ModelSerializer):
    payment_method = serializers.ChoiceField(choices=PaymentModel.PAYMENT_METHODS)

    class Meta:
        model = Booking
        fields = ['service', 'barber', 'slot', 'address', 'payment_method']

    def validate_service(self, value):
        if not value:
            raise serializers.ValidationError("Service is required")
        return value

    def validate_barber(self, value):
        if not value:
            raise serializers.ValidationError("Barber is required")
        if value.user_type != 'barber':
            raise serializers.ValidationError("Selected user is not a barber")
        return value

    def validate_slot(self, value):
        if not value:
            raise serializers.ValidationError("Slot is required")
        if value.is_booked:
            raise serializers.ValidationError("This slot is already booked")
        return value

    def validate_address(self, value):
        if not value:
            raise serializers.ValidationError("Address is required")
        # Check if address belongs to the requesting user
        request = self.context.get('request')
        if request and value.user != request.user:
            raise serializers.ValidationError("Address does not belong to the current user")
        return value

    def validate(self, data):
        # Check if slot belongs to the selected barber
        if data['slot'].barber != data['barber']:
            raise serializers.ValidationError("Selected slot doesn't belong to the selected barber")
        
        # Check payment method
        payment_method = data.get('payment_method')
        if payment_method != 'COD':
            raise serializers.ValidationError("Currently only COD payments are accepted")
            
        return data

    def create(self, validated_data):
        payment_method = validated_data.pop('payment_method')
        customer = self.context['request'].user
        
        # Calculate total amount
        service = validated_data['service']
        total_amount = getattr(service, 'price', 100.00)  # Default price if no price field
        
        # Create booking
        booking = Booking.objects.create(
            customer=customer, 
            total_amount=total_amount,
            **validated_data
        )

        # Mark slot as booked
        slot = validated_data['slot']
        slot.is_booked = True
        slot.save()

        # Create payment record
        PaymentModel.objects.create(
            booking=booking,
            payment_method=payment_method,
            payment_status='SUCCESS'
        )
        
        # Mark payment as done for COD
        booking.is_payment_done = True
        booking.save()

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

