from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Checklist
from .forms import ChecklistForm

def checklist_create(request):
    if request.method == 'POST':
        form = ChecklistForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Checklist created successfully!')
            return redirect('checklist_list')
    else:
        form = ChecklistForm()
    
    return render(request, 'forms/checklist_form.html', {'form': form, 'title': 'Installation Checklist'})

def checklist_list(request):
    checklists = Checklist.objects.all().order_by('-created_at')
    return render(request, 'forms/checklist_list.html', {'checklists': checklists})
