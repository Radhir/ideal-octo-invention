import os
import django
from django.urls import resolve, get_resolver

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def check_urls():
    print("--- URL Resolution Check ---")
    urls_to_check = [
        '/hr/api/notifications/',
        '/hr/api/employees/',
        '/api/dashboard/chat/'
    ]
    
    for url in urls_to_check:
        try:
            match = resolve(url)
            print(f"SUCCESS: {url} -> {match.view_name} (View: {match.func})")
        except Exception as e:
            print(f"FAILED: {url} -> {e}")

if __name__ == "__main__":
    check_urls()
