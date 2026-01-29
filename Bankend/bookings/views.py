from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from rest_framework import viewsets
from .models import Booking
from .forms import BookingForm
from .serializers import BookingSerializer

def booking_create(request):
    if request.method == 'POST':
        form = BookingForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Booking created successfully!')
            return redirect('booking_list')
    else:
        form = BookingForm()
    return render(request, 'forms/booking_form.html', {'form': form, 'title': 'Create Booking'})

def booking_list(request):
    bookings = Booking.objects.all().order_by('-booking_date')
    return render(request, 'forms/booking_list.html', {'bookings': bookings})

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-booking_date')
    serializer_class = BookingSerializer

    @action(detail=True, methods=['post'])
    def convert_to_job(self, request, pk=None):
        booking = self.get_object()
        try:
            job_card = booking.convert_to_job_card()
            return Response({
                'status': 'success',
                'job_card_id': job_card.id,
                'job_card_number': job_card.job_card_number
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
