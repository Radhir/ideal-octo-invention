from rest_framework import serializers
from .models import Document, DocumentCategory, DocumentVersion, DocumentAccessLog, DocumentShareLink, DocumentTag, DocumentWorkflow, WorkflowStep

class DocumentSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Document
        fields = '__all__'

class DocumentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentCategory
        fields = '__all__'

class DocumentVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentVersion
        fields = '__all__'

class DocumentShareLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentShareLink
        fields = '__all__'

class DocumentWorkflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentWorkflow
        fields = '__all__'
