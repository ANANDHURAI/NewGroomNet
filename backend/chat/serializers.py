from rest_framework import serializers
from .models import ChatMessage
from authservice.models import User

class UserSerializer(serializers.ModelSerializer):
    profileimage = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'profileimage']

    def get_profileimage(self, obj):
        request = self.context.get('request')
        if obj.profileimage and hasattr(obj.profileimage, 'url'):
            if request:
                return request.build_absolute_uri(obj.profileimage.url)
            return f"http://localhost:8000{obj.profileimage.url}"
        return None

class ChatMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    
    class Meta:
        model = ChatMessage
        fields = ['id', 'message', 'sender', 'timestamp', 'is_read']