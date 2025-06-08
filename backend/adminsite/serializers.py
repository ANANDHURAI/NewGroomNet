from rest_framework import serializers
from authservice.models import User

class UsersListSerializer(serializers.ModelSerializer):
    profileimage_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'phone', 'profileimage_url', 'user_type', 'is_blocked', 'created_at', 'is_active']
    
    def get_profileimage_url(self, obj):
        if obj.profileimage:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profileimage.url)
            return obj.profileimage.url
        return None
    
class BarbersListSerializer(serializers.ModelSerializer):
    profileimage_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'phone', 'profileimage_url', 'user_type', 'is_blocked', 'created_at', 'is_active']
    
    def get_profileimage_url(self, obj):
        if obj.profileimage:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profileimage.url)
            return obj.profileimage.url
        return None
    
    
