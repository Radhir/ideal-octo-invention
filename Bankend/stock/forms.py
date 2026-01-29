from django import forms
from .models import StockForm

class StockFormForm(forms.ModelForm):
    class Meta:
        model = StockForm
        fields = '__all__'
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
        }
