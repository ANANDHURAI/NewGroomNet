from rest_framework import serializers
from adminsite.models import CategoryModel, ServiceModel
from .models import Booking
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
    

class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['service', 'barber', 'slot', 'address', 'payment_method']
    
    def validate_slot(self, value):
        if value.is_booked:
            raise serializers.ValidationError("This slot is already booked.")
        return value
    
def validate_address(self, value):
        
        if value.user != self.context['request'].user:
            raise serializers.ValidationError("You can only use your own addresses.")
        return value


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


