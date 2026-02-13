"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from .views import MaintenanceView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('', lambda request: redirect('admin:index', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/health/', lambda request: JsonResponse({"status": "ok"}), name='health-check'),
    path('api/auth/', include('authentication.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/maintenance/', MaintenanceView.as_view(), name='maintenance'),
    path('forms/ppf/', include('ppf_warranty.urls')),
    path('forms/ceramic/', include('ceramic_warranty.urls')),
    path('forms/job-cards/', include('job_cards.urls')),
    path('forms/bookings/', include('bookings.urls')),
    path('forms/leads/', include('leads.urls')),
    path('forms/invoices/', include('invoices.urls')),
    path('forms/operations/', include('operations.urls')),
    path('forms/checklists/', include('checklists.urls')),
    path('forms/requests/', include('service_requests.urls')),
    path('forms/stock/', include('stock.urls')),
    path('forms/leaves/', include('leaves.urls')),
    path('forms/pick-and-drop/', include('pick_and_drop.urls')),
    path('forms/attendance/', include('attendance.urls')),
    path('finance/', include('finance.urls')),
    path('hr/', include('hr.urls')),
    path('customers/', include('customers.urls')),
    path('forms/scheduling/', include('scheduling.urls')),
    path('forms/notifications/', include('notifications.urls')),
    path('marketing/', include('marketing.urls')),
    path('logistics/', include('logistics.urls')),
    path('projects/', include('projects.urls')),
    path('api/projects/', include('projects.urls')),
    path('workshop/', include('workshop.urls')),
    path('risk-management/', include('risk_management.urls')),
    path('reports/', include('reports.urls')),
    
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Customer Portal
    path('api/customer-portal/', include('customers.portal.urls')),

    # Contracts & SLA
    path('api/contracts/', include('contracts.urls')),

    # Documents
    path('api/documents/', include('documents.urls')),

    # Payments
    path('api/payments/', include('payments.urls')),

    # Subscriptions
    path('api/subscriptions/', include('subscriptions.urls')),

    # Locations
    path('api/locations/', include('locations.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
