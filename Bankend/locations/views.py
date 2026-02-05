from rest_framework import viewsets, permissions
from .models import Branch
from .serializers import BranchSerializer

class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.filter(is_active=True)
    serializer_class = BranchSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    # Optional: Only admins can create/delete branches?
    # For now, open to authenticated users
