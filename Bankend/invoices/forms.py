from django import forms
from .models import Invoice

class InvoiceForm(forms.ModelForm):
    class Meta:
        model = Invoice
        fields = '__all__'
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
            'items': forms.Textarea(attrs={'rows': 5, 'placeholder': 'Item|Qty|Price'}),
        }
