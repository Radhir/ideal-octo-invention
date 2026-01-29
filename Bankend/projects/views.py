from rest_framework import viewsets
from .models import (
    Project, ProjectMilestone, ProjectTask, 
    ProjectResource, ProjectBudget, ProjectForecast
)
from .serializers import (
    ProjectSerializer, ProjectListSerializer, ProjectMilestoneSerializer,
    ProjectTaskSerializer, ProjectResourceSerializer, ProjectBudgetSerializer,
    ProjectForecastSerializer
)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer

class ProjectMilestoneViewSet(viewsets.ModelViewSet):
    queryset = ProjectMilestone.objects.all().order_by('due_date')
    serializer_class = ProjectMilestoneSerializer

class ProjectTaskViewSet(viewsets.ModelViewSet):
    queryset = ProjectTask.objects.all().order_by('-due_date')
    serializer_class = ProjectTaskSerializer

class ProjectResourceViewSet(viewsets.ModelViewSet):
    queryset = ProjectResource.objects.all()
    serializer_class = ProjectResourceSerializer

class ProjectBudgetViewSet(viewsets.ModelViewSet):
    queryset = ProjectBudget.objects.all()
    serializer_class = ProjectBudgetSerializer

class ProjectForecastViewSet(viewsets.ModelViewSet):
    queryset = ProjectForecast.objects.all().order_by('-forecast_date')
    serializer_class = ProjectForecastSerializer
