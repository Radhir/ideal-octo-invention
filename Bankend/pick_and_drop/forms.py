from django import forms
from .models import PickAndDrop

class PickAndDropForm(forms.ModelForm):
    class Meta:
        model = PickAndDrop
        fields = '__all__'
        widgets = {
            'scheduled_time': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
        }
