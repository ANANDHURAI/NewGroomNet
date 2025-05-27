

from rest_framework import serializers

class BarberLoginSerliasers(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()  
