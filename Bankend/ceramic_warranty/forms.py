from django import forms
from .models import CeramicWarrantyRegistration

class CeramicWarrantyRegistrationForm(forms.ModelForm):
    class Meta:
        model = CeramicWarrantyRegistration
        fields = '__all__'
        widgets = {
            'installation_date': forms.DateInput(attrs={'type': 'date'}),
            'm1_date': forms.DateInput(attrs={'type': 'date'}),
            'm2_date': forms.DateInput(attrs={'type': 'date'}),
            'm3_date': forms.DateInput(attrs={'type': 'date'}),
            'm4_date': forms.DateInput(attrs={'type': 'date'}),
        }
        for field in ['full_name', 'contact_number', 'invoice_number', 'email', 'vehicle_brand', 'vehicle_model', 'vehicle_year', 'vehicle_color', 'license_plate', 'vin', 'coating_brand', 'warranty_period']:
            widgets[field] = forms.TextInput(attrs={'class': 'form-control'})
