from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    advisor_name = serializers.ReadOnlyField(source='advisor.user.get_full_name')
    service_category_name = serializers.ReadOnlyField(source='service_category.name')
    class Meta:
        model = Booking
        fields = '__all__'
