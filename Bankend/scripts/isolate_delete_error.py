
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from hr.models import Employee, Branch, Company, Department
from django.contrib.auth.models import User

def isolate_error():
    models_to_clear = [
        ("Employee", Employee),
        ("User", User),
        ("Department", Department),
        ("Branch", Branch),
        ("Company", Company),
    ]
    
    for name, model in models_to_clear:
        print(f"Clearing {name}...")
        try:
            if name == "User":
                model.objects.exclude(is_superuser=True).delete()
            else:
                model.objects.all().delete()
            print(f"✅ {name} cleared.")
        except Exception as e:
            print(f"❌ {name} FAILED: {type(e).__name__}: {e}")
            import traceback
            traceback.print_exc()
            # Don't stop, check others
            print("-" * 20)

if __name__ == "__main__":
    isolate_error()
