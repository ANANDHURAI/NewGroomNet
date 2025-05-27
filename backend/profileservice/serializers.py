from rest_framework import serializers
from .models import UserProfile, Address
from authservice.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    profileimage = serializers.ImageField(source='user.profileimage')
    usertype = serializers.CharField(source='user.user_type', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['name', 'email', 'phone', 'profileimage', 'usertype', 'date_of_birth', 'gender', 'bio']

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'