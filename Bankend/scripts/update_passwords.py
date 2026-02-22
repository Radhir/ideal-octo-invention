
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User

def update_passwords():
    admin_users = {
        'radhir': 'Elite123!',
        'ruchika': 'ruchika@ELITE123',
        'afsar': 'afsar@ELITE123',
        'ankit': 'ankit@ELITE123',
    }
    
    for username, password in admin_users.items():
        try:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': f'{username}@eliteshine.com',
                    'is_active': True,
                    'is_staff': True,
                    'is_superuser': True,
                }
            )
            user.set_password(password)
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True
            user.save()
            status = 'CREATED' if created else 'UPDATED'
            print(f'[ADMIN] {username} => {status}')
        except Exception as e:
            print(f'[ERROR] {username} => {e}')
    
    try:
        others = User.objects.exclude(username__in=list(admin_users.keys()))
        c = 0
        for user in others:
            try:
                user.set_password('eliteoffice@UAE123')
                user.is_active = True
                user.save()
                c += 1
            except Exception as e:
                print(f'[ERROR] bulk {user.username} => {e}')
        print(f'[BULK] Updated {c} other users')
    except Exception as e:
        print(f'[ERROR] bulk update => {e}')
    
    print('Done.')

if __name__ == '__main__':
    update_passwords()
