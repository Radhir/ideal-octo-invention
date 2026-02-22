import os
from django.conf import settings
from django.contrib.auth.models import User

print('--- DIAGNOSTICS ---')
print(f'DB HOST: {settings.DATABASES["default"]["HOST"]}')
print(f'DB NAME: {settings.DATABASES["default"]["NAME"]}')

print('\n--- EXISTING USERS ---')
for u in User.objects.filter(is_superuser=True):
    print(f'SUPERUSER: {u.username} (active={u.is_active})')

admins = [
    ('radhir', 'adhirHAS@123'),
    ('ravit', 'adhirHAS@123'),
    ('ruchika', 'ruchika@ELITE123'),
    ('afsar', 'afsar@ELITE123'),
    ('ankit', 'ankit@ELITE123'),
]

print('\n--- RESETTING PASSWORDS ---')
for username, password in admins:
    try:
        try:
            u = User.objects.get(username=username)
            u.set_password(password)
            u.is_superuser = True
            u.is_staff = True
            u.is_active = True
            u.save()
            print(f'[OK] UPDATED {username}')
        except User.DoesNotExist:
            u = User.objects.create_user(username=username, email=f'{username}@eliteshine.com', password=password)
            u.is_superuser = True
            u.is_staff = True
            u.is_active = True
            u.save()
            print(f'[OK] CREATED {username}')
    except Exception as e:
        print(f'[ERR] {username}: {e}')

print('\n--- VERIFICATION ---')
from django.contrib.auth import authenticate
for username, password in admins:
    user = authenticate(username=username, password=password)
    result = 'PASS' if user else 'FAIL'
    print(f'LOGIN {username}: {result}')