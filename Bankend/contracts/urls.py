from django.urls import path, include

urlpatterns = [
    path('sla/', include('contracts.sla.urls')),
]
