
import os
import django
import traceback

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from authentication.serializers import UserSerializer
from job_cards.models import JobCard
from job_cards.serializers import JobCardSerializer
from rest_framework.test import APIRequestFactory, force_authenticate

factory = APIRequestFactory()
request = factory.get('/')
user_admin = User.objects.filter(is_superuser=True).first()
if user_admin:
    force_authenticate(request, user=user_admin)
else:
    print("No superuser found for authentication")

print("--- Testing Users ---")
for u in User.objects.all():
    try:
        # Pass the request in context as DRF views do
        data = UserSerializer(u, context={'request': request}).data
        print(f"User {u.username}: OK")
    except Exception as e:
        print(f"User {u.username}: ERROR: {str(e)}")
        traceback.print_exc()

print("\n--- Testing Job Cards ---")
for jc in JobCard.objects.all():
    try:
        data = JobCardSerializer(jc, context={'request': request}).data
        print(f"JobCard {jc.job_card_number}: OK")
    except Exception as e:
        print(f"JobCard {jc.job_card_number}: ERROR: {str(e)}")
        traceback.print_exc()
