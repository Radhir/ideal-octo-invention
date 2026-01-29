from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('generate-pdf/<str:model_name>/<int:pk>/', views.generate_pdf, name='generate_pdf'),
]
