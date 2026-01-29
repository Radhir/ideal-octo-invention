from django.urls import path
from . import views

urlpatterns = [
    path('', views.checklist_list, name='checklist_list'),
    path('create/', views.checklist_create, name='checklist_create'),
]
