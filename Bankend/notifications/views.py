from rest_framework import viewsets
from .models import NotificationLog
from .serializers import NotificationLogSerializer

class NotificationLogViewSet(viewsets.ModelViewSet):
    queryset = NotificationLog.objects.all().order_by('-sent_at')
    serializer_class = NotificationLogSerializer
    permission_classes = [] # Allow viewing for mock inbox testing
