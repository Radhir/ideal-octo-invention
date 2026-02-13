import os
import django
import json
from django.test import RequestFactory
from rest_framework_simplejwt.views import TokenObtainPairView

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def test_login():
    factory = RequestFactory()
    data = {
        'username': 'radhir',
        'password': 'Elite123!'
    }
    request = factory.post('/api/auth/login/', data=json.dumps(data), content_type='application/json')
    
    view = TokenObtainPairView.as_view()
    try:
        response = view(request)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.rendered_content}")
    except Exception as e:
        import traceback
        print(f"Caught Exception: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    test_login()
