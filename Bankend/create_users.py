import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from django.core.files import File
from hr.models import Employee
from locations.models import Branch

def create_erp_user(username, password, first_name, last_name, image_path):
    # 1. Create User
    user, created = User.objects.get_or_create(username=username)
    user.set_password(password)
    user.first_name = first_name
    user.last_name = last_name
    user.is_staff = True  # Give staff access
    user.save()
    
    # 2. Create Employee Profile
    employee_id = f"ES-{username.upper()}"
    employee, emp_created = Employee.objects.get_or_create(
        user=user,
        defaults={
            'employee_id': employee_id,
            'role': 'Staff',
            'date_joined': '2026-01-01',
            'branch_id': 1, # Elite Shine Main
            'pin_code': f"123{username[:3]}" # Default pin
        }
    )
    
    if image_path and os.path.exists(image_path):
        with open(image_path, 'rb') as f:
            employee.profile_image.save(os.path.basename(image_path), File(f), save=True)
    
    print(f"{'Created' if created else 'Updated'} user: {username}")

if __name__ == "__main__":
    # Source images from public folder
    public_dir = os.path.join('..', 'frontend', 'public')
    
    users = [
        ('afsar', 'Afsar@Elite2026', 'Afsar', '', 'afsar.jpg'),
        ('ruchika', 'Ruchika@Elite2026', 'Ruchika', '', 'ruchika.jpg'),
        ('ankit', 'Ankit@Elite2026', 'Ankit', '', 'ankit.jpg'),
    ]
    
    for username, password, fn, ln, img_name in users:
        img_path = os.path.join(public_dir, img_name)
        # If running on VPS, we might need a different path or skip image for now
        # Actually, I'll copy the images to the backend/media folder manually or via this script
        create_erp_user(username, password, fn, ln, img_path)
