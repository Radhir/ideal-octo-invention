from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from .models import Document, DocumentCategory, DocumentVersion, DocumentAccessLog, DocumentShareLink
from .serializers import DocumentSerializer, DocumentCategorySerializer, DocumentVersionSerializer, DocumentShareLinkSerializer
import hashlib

def log_document_access(document, user, access_type, request=None):
    ip = request.META.get('REMOTE_ADDR') if request else None
    DocumentAccessLog.objects.create(
        document=document,
        user=user,
        access_type=access_type,
        ip_address=ip
    )

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'document_number', 'tags__name', 'description']
    
    def get_queryset(self):
        user = self.request.user
        queryset = Document.objects.all()
        
        # Access Control Logic
        if not user.is_superuser:
            queryset = queryset.filter(
                Q(access_level='PUBLIC') |
                Q(owner=user) |
                Q(access_level='RESTRICTED', category__allowed_groups__user=user)
            ).distinct()
            
        return queryset
    
    @action(detail=True, methods=['post'])
    def new_version(self, request, pk=None):
        document = self.get_object()
        file = request.FILES.get('file')
        change_log = request.data.get('change_log', '')
        
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Archive current version
        DocumentVersion.objects.create(
            document=document,
            file=document.file,
            version_number=document.version,
            created_by=document.owner,
            change_log=change_log
        )
        
        # Update document
        document.file = file
        document.version = str(float(document.version) + 0.1) # Simple increment
        document.save()
        
        log_document_access(document, request.user, 'NEW_VERSION', request)
        
        return Response(DocumentSerializer(document).data)
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        document = self.get_object()
        expiry_days = int(request.data.get('days', 7))
        
        from django.utils import timezone
        import datetime
        
        expiry = timezone.now() + datetime.timedelta(days=expiry_days)
        
        link = DocumentShareLink.objects.create(
            document=document,
            created_by=request.user,
            expires_at=expiry
        )
        
        log_document_access(document, request.user, 'SHARE', request)
        
        return Response({
            'link': f"/documents/shared/{link.token}",
            'expires_at': expiry
        })

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        log_document_access(instance, request.user, 'VIEW', request)
        return super().retrieve(request, *args, **kwargs)

class DocumentCategoryViewSet(viewsets.ModelViewSet):
    queryset = DocumentCategory.objects.all()
    serializer_class = DocumentCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
