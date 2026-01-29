from django.shortcuts import render, redirect
from rest_framework import viewsets
from .models import RequestForm
from .forms import RequestFormForm
from .serializers import RequestSerializer

def request_create(request):
    if request.method == 'POST':
        form = RequestFormForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('request_list')
    else:
        form = RequestFormForm()
    
    return render(request, 'forms/request_form.html', {'form': form, 'title': 'Request Form'})

def request_list(request):
    requests = RequestForm.objects.all().order_by('-created_at')
    return render(request, 'forms/request_list.html', {'requests': requests})

class RequestViewSet(viewsets.ModelViewSet):
    queryset = RequestForm.objects.all().order_by('-created_at')
    serializer_class = RequestSerializer
