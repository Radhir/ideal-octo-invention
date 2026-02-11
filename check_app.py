import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from django.apps import apps
print('locations' in [app.name for app in apps.get_app_configs()])
