import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

creds = [
    ('ravit', 'adhirHAS@123'),
    ('radhir', 'adhirHAS@123'),
    ('ruchika', 'ruchika@ELITE123'),
    ('afsar', 'afsar@ELITE123'),
    ('ankit', 'ankit@ELITE123'),
    ('anish', 'eliteoffice@UAE123')
]

print('--- CREDENTIAL VERIFICATION REPORT ---')
for username, password in creds:
    try:
        user = authenticate(username=username, password=password)
        if user is not None:
            print(f'[SUCCESS] {username}: Authenticated successfully (Superuser: {user.is_superuser})')
        else:
            # Check if user exists to give better error
            try:
                u = User.objects.get(username=username)
                print(f'[FAILED]  {username}: Password mismatch (User exists)')
            except User.DoesNotExist:
                print(f'[FAILED]  {username}: User does not exist')
    except Exception as e:
        print(f'[ERROR]   {username}: {e}')
print('-------------------------------------')