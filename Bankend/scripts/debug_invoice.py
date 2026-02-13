import os
import django
import sys

# Setup Django environment
sys.path.append(r'r:\webplot\Bankend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from invoices.models import Invoice
from invoices.serializers import InvoiceSerializer
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory

factory = APIRequestFactory()
request = factory.get('/forms/invoices/api/list/4/')

try:
    instance = Invoice.objects.get(id=4)
    serializer = InvoiceSerializer(instance, context={'request': request})
    print("Serialization successful")
    print(serializer.data)
except Exception as e:
    import traceback
    traceback.print_exc()
