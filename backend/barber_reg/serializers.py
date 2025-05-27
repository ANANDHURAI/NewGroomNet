from rest_framework import serializers
from authservice.models import User
from .models import BarberRequest

class PersonalDetailsSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField(read_only=True)
    phone = serializers.CharField(max_length=15)
    gender = serializers.ChoiceField(choices=User.GENDER_CHOICES)

    def validate_phone(self, value):
        
        if len(value) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 digits")
        return value

class ApprovelRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BarberRequest
        fields = ['licence', 'certificate']

    def validate_licence(self, value):
        allowed_types = ['pdf', 'jpg', 'jpeg', 'png']
        file_extension = value.name.split('.')[-1].lower()
        if file_extension not in allowed_types:
            raise serializers.ValidationError("Only PDF and image files are allowed for licence.")
        return value

    def validate_certificate(self, value):
        
        allowed_types = ['pdf', 'jpg', 'jpeg', 'png']
        file_extension = value.name.split('.')[-1].lower()
        if file_extension not in allowed_types:
            raise serializers.ValidationError("Only PDF and image files are allowed for certificate.")
        return value