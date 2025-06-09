from rest_framework import serializers
from .models import UserProfile, Address
from authservice.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    profileimage = serializers.SerializerMethodField()
    usertype = serializers.CharField(source='user.user_type', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['name', 'email', 'phone', 'profileimage', 'usertype', 'date_of_birth', 'gender', 'bio']
    
    def get_profileimage(self, obj):
        """Return full URL for profile image"""
        if obj.user.profileimage and hasattr(obj.user.profileimage, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.user.profileimage.url)
            else:
                # Fallback if no request context
                return f"http://localhost:8000{obj.user.profileimage.url}"
        return None
    
    def update(self, instance, validated_data):
        # Update only the UserProfile fields
        for attr, value in validated_data.items():
            if not attr.startswith('user.'):
                setattr(instance, attr, value)
        instance.save()
        return instance
