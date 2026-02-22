import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from django.contrib.auth.models import User
for name in ['radhir', 'ravit']:
    try:
        u = User.objects.get(username=name)
        u.set_password('adhirHAS@123')
        u.is_superuser=True
        u.is_staff=True
        u.is_active=True
        u.save()
        print(name, 'DONE')
    except User.DoesNotExist:
        print(name, 'NOT FOUND')