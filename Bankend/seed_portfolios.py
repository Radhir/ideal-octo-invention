import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee

def seed_portfolios():
    # Define portfolio data for key members
    portfolios = {
        'ruchika': {
            'role': 'OWNER & MANAGING DIRECTOR',
            'bio': 'Architecting the future of automotive digital ecosystems through high-performance leadership.',
            'accent': '#b08d57',
            'image_name': 'ruchika.jpg'
        },
        'afsar': {
            'role': 'CHIEF EXECUTIVE OFFICER',
            'bio': 'Driving operational excellence and strategic growth across the Elite Shine industrial network.',
            'accent': '#3b82f6',
            'image_name': 'afsar.jpg'
        },
        'ankit': {
            'role': 'GROUP MANAGER',
            'bio': 'Optimizing workshop workflows and managing mission-critical logistics for the team.',
            'accent': '#f59e0b',
            'image_name': 'ankit.jpg'
        },
        'radhir': {
            'role': 'SYSTEM ARCHITECT | ADMIN',
            'bio': 'Building the engine that powers the business. Bridging the gap between strategy and silicon.',
            'accent': '#8400ff',
            'image_name': 'radhir.jpg'
        }
    }

    # Ensure media/profiles exists
    profile_dir = os.path.join('media', 'profiles')
    if not os.path.exists(profile_dir):
        os.makedirs(profile_dir, exist_ok=True)

    for username, data in portfolios.items():
        try:
            user = User.objects.get(username=username)
            employee, created = Employee.objects.get_or_create(user=user, defaults={'employee_id': f'EMP-{user.id}', 'date_joined': django.utils.timezone.now().date()})
            
            employee.role = data['role']
            employee.bio = data['bio']
            employee.accent_color = data['accent']
            
            # Simple link to existing images in public/ if we reference them as static, 
            # but for true serialization we should ideally move them to media.
            # For now, let's just set the path string if we aren't handling actual file uploads.
            # But standard Django ImageField expects a path relative to MEDIA_ROOT.
            employee.profile_image = f'profiles/{data["image_name"]}'
            employee.save()
            print(f"Updated portfolio for {username}")
        except User.DoesNotExist:
            print(f"User {username} not found, skipping.")

if __name__ == '__main__':
    seed_portfolios()
