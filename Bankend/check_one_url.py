
import os
import django
import sys
from django.urls import resolve

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def check():
    path = '/hr/api/notifications/'
    try:
        match = resolve(path)
        print(f"SUCCESS: {path} -> {match.view_name}")
    except Exception as e:
        print(f"FAILURE: {path} -> {e}")

if __name__ == "__main__":
    check()
