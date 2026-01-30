from django.urls import path
from . import views

urlpatterns = [
    path('api/trigger-daily-report/', views.TriggerDailyReportView.as_view(), name='trigger-daily-report'),
]
