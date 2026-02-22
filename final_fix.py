from django.contrib.auth.models import User
from django.db.utils import IntegrityError

admins = [
    ('radhir', 'adhirHAS@123'),
    ('ravit', 'adhirHAS@123'),
    ('ruchika', 'ruchika@ELITE123'),
    ('afsar', 'afsar@ELITE123'),
    ('ankit', 'ankit@ELITE123'),
]

print('STARTING RESET...')

for username, password in admins:
    try:
        try:
            u = User.objects.get(username=username)
            u.set_password(password)
            u.is_superuser = True
            u.is_staff = True
            u.is_active = True
            u.save()
            print(f'UPDATED {username}')
        except User.DoesNotExist:
            u = User.objects.create_user(username=username, email=f'{username}@eliteshine.com', password=password)
            u.is_superuser = True
            u.is_staff = True
            u.is_active = True
            u.save()
            print(f'CREATED {username}')
    except Exception as e:
        print(f'ERROR {username}: {e}')

print('ALL FINISHED')