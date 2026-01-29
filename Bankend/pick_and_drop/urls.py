from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'trips', views.PickAndDropViewSet)

urlpatterns = [
    path('', views.pick_and_drop_list, name='pick_and_drop_list'),
    path('create/', views.pick_and_drop_create, name='pick_and_drop_create'),
    # API
    path('api/', include(router.urls)),
]
