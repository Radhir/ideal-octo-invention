import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from django.contrib.auth.models import User
u = User.objects.get(username='radhir')
u.set_password('adhirHAS@123')
u.is_superuser=True
u.is_staff=True
u.is_active=True
u.save()
print('radhir password reset to adhirHAS@123')