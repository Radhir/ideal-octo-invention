import os
import django
from django.urls import resolve, Resolver404

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

path = '/api/auth/login/'
try:
    match = resolve(path)
    print(f"Found: {match.view_name} -> {match.func}")
except Resolver404:
    print(f"Not Found: {path}")

# List top level patterns
from django.urls import get_resolver
resolver = get_resolver()
print("\nTop level patterns:")
for p in resolver.url_patterns:
    print(p)
