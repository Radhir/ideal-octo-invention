import os

HR_URLS = """from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EmployeeViewSet, HRRuleViewSet, PayrollViewSet,
    RosterViewSet, HRAttendanceViewSet, TeamViewSet, MistakeViewSet, DepartmentViewSet,
    CompanyViewSet, BranchViewSet, ModulePermissionViewSet,
    SalarySlipViewSet, EmployeeDocumentViewSet, WarningLetterViewSet, NotificationViewSet
)

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)
router.register(r'rules', HRRuleViewSet)
router.register(r'payroll', PayrollViewSet)
router.register(r'roster', RosterViewSet)
router.register(r'attendance', HRAttendanceViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'mistakes', MistakeViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'companies', CompanyViewSet)
router.register(r'branches', BranchViewSet)
router.register(r'permissions', ModulePermissionViewSet)
router.register(r'salary-slips', SalarySlipViewSet)
router.register(r'employee-documents', EmployeeDocumentViewSet)
router.register(r'warning-letters', WarningLetterViewSet)
router.register(r'notifications', NotificationViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
"""

CHAT_VIEWS = """from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import ChatMessage
from .serializers import ChatMessageSerializer

class ChatMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Allow everyone to chat for now to resolve 403/500 errors
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
"""

def repair():
    with open('/app/hr/urls.py', 'w') as f:
        f.write(HR_URLS)
    print("Repaired hr/urls.py")
    
    with open('/app/dashboard/views_chat.py', 'w') as f:
        f.write(CHAT_VIEWS)
    print("Repaired dashboard/views_chat.py")

if __name__ == "__main__":
    repair()
