import pytest
import os
from django.contrib.auth.models import User
from model_bakery import baker

@pytest.fixture
def user(db):
    return baker.make(User)

@pytest.fixture
def superuser(db):
    return baker.make(User, is_superuser=True, is_staff=True)

@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()

@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client

@pytest.fixture
def admin_client(api_client, superuser):
    api_client.force_authenticate(user=superuser)
    return api_client

@pytest.fixture(autouse=True)
def mock_twilio(requests_mock):
    """Mock Twilio WhatsApp/SMS API."""
    requests_mock.post(
        'https://api.twilio.com/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXX/Messages.json',
        json={'sid': 'SM123'}, 
        status_code=201
    )
    yield
