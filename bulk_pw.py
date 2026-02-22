import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from django.contrib.auth.models import User
count=0
for u in User.objects.exclude(username__in=['radhir','ruchika','afsar','ankit']):
    try:
        u.set_password('eliteoffice@UAE123')
        u.is_active=True
        u.save()
        count+=1
    except Exception as e:
        print('err',u.username,e)
print('bulk done',count)