from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'v_registration_no', 'service_category', 'booking_date', 'status', 'advisor']
    list_filter = ['status', 'booking_date', 'advisor']
    search_fields = ['customer_name', 'v_registration_no', 'phone']
