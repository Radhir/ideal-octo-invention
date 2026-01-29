from django.shortcuts import render, redirect
from rest_framework import viewsets
from .models import PickAndDrop
from .forms import PickAndDropForm
from .serializers import PickAndDropSerializer

def pick_and_drop_list(request):
    picks = PickAndDrop.objects.all().order_by('-created_at')
    return render(request, 'pick_and_drop/pick_and_drop_list.html', {'picks': picks})

class PickAndDropViewSet(viewsets.ModelViewSet):
    queryset = PickAndDrop.objects.all().order_by('-created_at')
    serializer_class = PickAndDropSerializer

def pick_and_drop_create(request):
    if request.method == 'POST':
        form = PickAndDropForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('pick_and_drop_list')
    else:
        form = PickAndDropForm()
    return render(request, 'forms/pick_and_drop_form.html', {'form': form})
