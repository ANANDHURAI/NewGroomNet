

from rest_framework import serializers
from authservice.models import User
from barber_reg.models import BarberRequest


class ApproveTheBarberRequestSerializer(serializers.ModelSerializer):
    licence = serializers.FileField(source='approval_request.licence', read_only=True)
    certificate = serializers.FileField(source='approval_request.certificate', read_only=True)
    status = serializers.CharField(source='approval_request.status', read_only=True)
    request_date = serializers.DateTimeField(source='approval_request.created_at', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'phone', 'gender', 'licence', 'certificate', 'status', 'request_date']


class BarberApprovalActionSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    action = serializers.ChoiceField(choices=['approve', 'reject'])
    comment = serializers.CharField(required=False, allow_blank=True)



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
    
