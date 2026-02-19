import os
import django

def check_users():
    from django.contrib.auth.models import User
    from hr.models import Employee
    users = User.objects.filter(username__in=['afsar', 'ruchika', 'ankit', 'ravit'])
    for u in users:
        img_url = "No Image"
        if hasattr(u, 'hr_profile') and u.hr_profile.profile_image:
            img_url = u.hr_profile.profile_image.url
        print(f"USER: {u.username} | IMAGE: {img_url}")

if __name__ == "__main__":
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    django.setup()
    check_users()
