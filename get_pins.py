import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from django.contrib.auth.models import User
print("Employee Name | PIN Number")
print("---|---")
for u in User.objects.all():
    if not u.is_superuser:
        name = u.username.replace('.', ' ').title()
        pin = f"{u.id:04}"
        print(f"| **{name}** | `{pin}` |")
