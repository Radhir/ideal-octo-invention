from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import ChatMessage
from .serializers import ChatMessageSerializer


from core.permissions import IsManager, IsAdminOrOwner, IsTechnician

class ChatMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Enforce Write Access: Only Managers/Admins can post global messages or initiate
        # Technician can only reply if we want? Or just strictly Read Only per user request "Read-Only for lower roles"
        # User request: "Roles with write access: Director, Manager... Roles with read-only access: Service Advisor, others."
        
        user_role = getattr(self.request.user.hr_profile, 'role', '').lower()
        allowed_writers = ['owner', 'director', 'manager', 'admin', 'head', 'lead', 'incharge']
        
        if not any(r in user_role for r in allowed_writers) and not self.request.user.is_superuser:
             from rest_framework.exceptions import PermissionDenied
             raise PermissionDenied("You have Read-Only access to the comms channel.")
             
        serializer.save(sender=self.request.user)

    def get_queryset(self):
        user = self.request.user
        return ChatMessage.objects.filter(
            sender=user
        ) | ChatMessage.objects.filter(
            receiver=user
        ) | ChatMessage.objects.filter(
            receiver__isnull=True
        )

    @action(detail=False, methods=['get'])
    def colleagues(self, request):
        """List users available to chat with."""
        users = User.objects.exclude(id=request.user.id).filter(is_active=True)
        data = [
            {
                'id': u.id,
                'name': u.get_full_name() or u.username,
                'username': u.username,
            }
            for u in users
        ]
        return Response(data)

    @action(detail=False, methods=['get'])
    def conversation(self, request):
        """Get messages between current user and a specific colleague."""
        other_id = request.query_params.get('user_id')
        if not other_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        messages = ChatMessage.objects.filter(
            sender=request.user, receiver_id=other_id
        ) | ChatMessage.objects.filter(
            sender_id=other_id, receiver=request.user
        )
        serializer = self.get_serializer(messages.order_by('created_at'), many=True)
        return Response(serializer.data)
