from django import forms
from .models import RequestForm

class RequestFormForm(forms.ModelForm):
    class Meta:
        model = RequestForm
        fields = '__all__'
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
        }
