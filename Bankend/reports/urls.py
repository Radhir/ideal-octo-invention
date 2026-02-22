from django.urls import path
from . import views

urlpatterns = [
    path('api/trigger-daily-report/', views.TriggerDailyReportView.as_view(), name='trigger-daily-report'),
    path('api/payroll-performance/', views.PayrollReportView.as_view(), name='payroll-performance-report'),
    path('api/yearly-pl/', views.YearlyPLReportView.as_view(), name='yearly-pl-report'),
    path('api/workshop-diary/', views.WorkshopDiaryReportView.as_view(), name='workshop-diary'),
    path('api/invoice-book/', views.InvoiceBookReportView.as_view(), name='invoice-book'),
    path('api/payroll/export/', views.PayrollExportView.as_view(), name='payroll-export'),
    path('api/employees/details/', views.EmployeeReportView.as_view(), name='employee-reports'),
]
