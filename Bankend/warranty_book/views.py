from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import WarrantyRegistration
from .serializers import WarrantyRegistrationSerializer

class WarrantyRegistrationViewSet(viewsets.ModelViewSet):
    queryset = WarrantyRegistration.objects.all()
    serializer_class = WarrantyRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = WarrantyRegistration.objects.all()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset

    @action(detail=False, methods=['get'])
    def public_verify(self, request):
        token = request.query_params.get('token')
        if not token:
            return Response({'error': 'Token required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            warranty = WarrantyRegistration.objects.get(portal_token=token)
            serializer = self.get_serializer(warranty)
            return Response(serializer.data)
        except WarrantyRegistration.DoesNotExist:
            return Response({'error': 'Invalid warranty token'}, status=status.HTTP_404_NOT_FOUND)
