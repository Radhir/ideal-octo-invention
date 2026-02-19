import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from django.core.files import File
from hr.models import Employee

def update_profile_image(username, image_name):
    try:
        user = User.objects.get(username=username)
        employee = user.hr_profile
        image_path = f"/app/{image_name}"
        
        if os.path.exists(image_path):
            with open(image_path, 'rb') as f:
                employee.profile_image.save(image_name, File(f), save=True)
            print(f"SUCCESS: Updated {username} with {image_name}")
        else:
            print(f"ERROR: Image not found at {image_path}")
    except Exception as e:
        print(f"ERROR updating {username}: {str(e)}")

if __name__ == "__main__":
    mappings = [
        ('afsar', 'afsar.jpg'),
        ('ruchika', 'ruchika.jpg'),
        ('ankit', 'ankit.jpg'),
    ]
    
    for username, img_name in mappings:
        update_profile_image(username, img_name)
