from rest_framework import serializers
from .models import User
import re

class HomeSerializer(serializers.Serializer):
    great_massage = serializers.CharField()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    user_type = serializers.ChoiceField(
        choices=[('customer', 'Customer')], 
        default='customer'
    )
    
    class Meta:
        model = User
        fields = ['name', 'email', 'phone', 'password', 'user_type']
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()


class OtpSerializer(serializers.Serializer):
    otp = serializers.IntegerField(min_value=1000, max_value=9999)
    
    def validate_otp(self, value):
        if not (1000 <= value <= 9999):
            raise serializers.ValidationError("OTP must be a 4-digit number.")
        return value


class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    



