from django import forms
from .models import Operation

class OperationForm(forms.ModelForm):
    class Meta:
        model = Operation
        fields = '__all__'
        widgets = {
            'start_date': forms.DateInput(attrs={'type': 'date'}),
            'end_date': forms.DateInput(attrs={'type': 'date'}),
        }
