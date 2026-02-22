from django.contrib.auth.models import User
admins = [('ravit', 'adhirHAS@123'), ('radhir', 'adhirHAS@123')]
print('--- RESETTING ---')
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
print('--- DONE ---')