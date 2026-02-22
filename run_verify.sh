#!/bin/bash
# Copy and run verification script
cat > /tmp/verify_creds.py << 'PYEOF'
import os, django, sys
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

print('\n--- CREDENTIAL VERIFICATION REPORT ---')
for username, password in creds:
    try:
        user = authenticate(username=username, password=password)
        if user is not None:
            print(f'[SUCCESS] {username}: OK  (Superuser: {user.is_superuser})')
        else:
            try:
                u = User.objects.get(username=username)
                print(f'[FAILED]  {username}: Password mismatch (User exists)')
            except User.DoesNotExist:
                print(f'[FAILED]  {username}: User does not exist')
    except Exception as e:
        print(f'[ERROR]   {username}: {e}')
print('-------------------------------------\n')
PYEOF

docker cp /tmp/verify_creds.py eliteshine_erp-backend-1:/app/verify_creds.py
docker exec eliteshine_erp-backend-1 python /app/verify_creds.py > /tmp/verify.log 2>&1
cat /tmp/verify.log