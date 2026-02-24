from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EmployeeViewSet, HRRuleViewSet, PayrollViewSet,
    RosterViewSet, HRAttendanceViewSet, TeamViewSet, MistakeViewSet, DepartmentViewSet,
    CompanyViewSet, BranchViewSet, ModulePermissionViewSet,
    SalarySlipViewSet, EmployeeDocumentViewSet, WarningLetterViewSet, NotificationViewSet,
    PerformanceViewSet
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
router.register(r'performance', PerformanceViewSet, basename='performance')

urlpatterns = [
    path('', include(router.urls)),
]
