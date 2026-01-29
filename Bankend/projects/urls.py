from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet, ProjectMilestoneViewSet, ProjectTaskViewSet,
    ProjectResourceViewSet, ProjectBudgetViewSet, ProjectForecastViewSet
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'milestones', ProjectMilestoneViewSet)
router.register(r'tasks', ProjectTaskViewSet)
router.register(r'resources', ProjectResourceViewSet)
router.register(r'budgets', ProjectBudgetViewSet)
router.register(r'forecasts', ProjectForecastViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
