from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .maintenance import perform_cache_maintenance
from .permissions import IsAdminOrOwner

class MaintenanceView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOwner]

    def post(self, request):
        result = perform_cache_maintenance()
        return Response({"status": result})
