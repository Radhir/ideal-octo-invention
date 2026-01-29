from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from rest_framework import viewsets
from .models import Invoice
from .forms import InvoiceForm
from .serializers import InvoiceSerializer

def invoice_create(request):
    if request.method == 'POST':
        form = InvoiceForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Invoice generated successfully!')
            return redirect('invoice_list')
    else:
        form = InvoiceForm()
    return render(request, 'forms/invoice_form.html', {'form': form, 'title': 'Generate Invoice'})

def invoice_list(request):
    invoices = Invoice.objects.all().order_by('-date')
    return render(request, 'forms/invoice_list.html', {'invoices': invoices})

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by('-date')
    serializer_class = InvoiceSerializer
