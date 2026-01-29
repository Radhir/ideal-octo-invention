from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    WorkTeamViewSet, ScheduleAssignmentViewSet, 
    AdvisorSheetViewSet, DailyClosingViewSet,
    EmployeeDailyReportViewSet
)

router = DefaultRouter()
router.register(r'teams', WorkTeamViewSet)
router.register(r'assignments', ScheduleAssignmentViewSet)
router.register(r'advisor-sheets', AdvisorSheetViewSet)
router.register(r'daily-closing', DailyClosingViewSet)
router.register(r'employee-reports', EmployeeDailyReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
