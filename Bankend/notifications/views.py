from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import NotificationLog
from .serializers import NotificationLogSerializer

class NotificationLogViewSet(viewsets.ModelViewSet):
    queryset = NotificationLog.objects.all().order_by('-sent_at')
    serializer_class = NotificationLogSerializer
    permission_classes = [] # Allow viewing for mock inbox testing

    @action(detail=True, methods=['post'])
    def mark_delivered(self, request, pk=None):
        """Mark a notification as delivered"""
        notification = self.get_object()
        notification.status = 'DELIVERED'
        notification.save()
        return Response(NotificationLogSerializer(notification).data)

    @action(detail=False, methods=['post'])
    def mark_all_delivered(self, request):
        """Mark all notifications as delivered"""
        updated = NotificationLog.objects.filter(status='SENT').update(status='DELIVERED')
        return Response({'updated': updated})

    @action(detail=False, methods=['get'])
    def by_recipient(self, request):
        """Get notifications for a specific recipient"""
        recipient = request.query_params.get('recipient')
        if not recipient:
            return Response({'error': 'recipient parameter required'}, status=status.HTTP_400_BAD_REQUEST)
        notifications = self.queryset.filter(recipient=recipient)
        return Response(NotificationLogSerializer(notifications, many=True).data)

    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Filter notifications by type (WHATSAPP, EMAIL, SMS)"""
        notification_type = request.query_params.get('type')
        if not notification_type:
            return Response({'error': 'type parameter required'}, status=status.HTTP_400_BAD_REQUEST)
        notifications = self.queryset.filter(notification_type=notification_type.upper())
        return Response(NotificationLogSerializer(notifications, many=True).data)

    @action(detail=False, methods=['get'])
    def failed(self, request):
        """Get all failed notifications"""
        notifications = self.queryset.filter(status='FAILED')
        return Response(NotificationLogSerializer(notifications, many=True).data)
