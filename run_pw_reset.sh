#!/bin/bash
cd /root/eliteshine_erp

# Write the Python script with proper Unix line endings
cat > /tmp/reset_all_pw.py << 'PYEOF'
import os, django, sys, traceback
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from django.contrib.auth.models import User

results = []

# Admin accounts with individual passwords
admins = {
    'radhir': 'adhirHAS@123',
    'ravit': 'adhirHAS@123',
    'ruchika': 'ruchika@ELITE123',
    'afsar': 'afsar@ELITE123',
    'ankit': 'ankit@ELITE123',
}

for username, password in admins.items():
    try:
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': username + '@eliteshine.com',
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
        results.append(f'ADMIN {username} => {status} pw={password}')
    except Exception as e:
        results.append(f'ADMIN-ERROR {username} => {e}')

# All other users
try:
    others = User.objects.exclude(username__in=list(admins.keys()))
    count = 0
    for u in others:
        try:
            u.set_password('eliteoffice@UAE123')
            u.is_active = True
            u.save()
            count += 1
        except Exception as e:
            results.append(f'BULK-ERROR {u.username} => {e}')
    results.append(f'BULK => Updated {count} users with eliteoffice@UAE123')
except Exception as e:
    results.append(f'BULK-FATAL => {e}')
    traceback.print_exc()

for r in results:
    print(r)
print('ALL DONE')
PYEOF

# Copy into container and run
docker cp /tmp/reset_all_pw.py eliteshine_erp-backend-1:/app/reset_all_pw.py
docker exec eliteshine_erp-backend-1 python /app/reset_all_pw.py > /tmp/pw_results.log 2>&1
echo "=== RESULTS ==="
cat /tmp/pw_results.log
echo "=== EXIT CODE: cho \True ==="