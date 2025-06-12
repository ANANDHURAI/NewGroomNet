from rest_framework import serializers
from .models import Portfolio , BarberService
from adminsite.serializers import ServiceSerializer

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = '__all__' 
       

class BarberServiceSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)
    service_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = BarberService
        fields = ['id', 'service', 'service_id', 'is_active', 'created_at']
    
    def create(self, validated_data):
        validated_data['barber'] = self.context['request'].user
        return super().create(validated_data)