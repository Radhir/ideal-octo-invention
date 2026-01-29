from django import forms
from .models import PPFWarrantyRegistration

class PPFWarrantyRegistrationForm(forms.ModelForm):
    class Meta:
        model = PPFWarrantyRegistration
        fields = '__all__'
        widgets = {
            'installation_date': forms.DateInput(attrs={'type': 'date'}),
            'first_checkup_date': forms.DateInput(attrs={'type': 'date'}),
            'second_checkup_date': forms.DateInput(attrs={'type': 'date'}),
            'third_checkup_date': forms.DateInput(attrs={'type': 'date'}),
            'fourth_checkup_date': forms.DateInput(attrs={'type': 'date'}),
            'fifth_checkup_date': forms.DateInput(attrs={'type': 'date'}),
            'full_name': forms.TextInput(attrs={'class': 'form-control'}),
            'contact_number': forms.TextInput(attrs={'class': 'form-control'}),
            'invoice_number': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'vehicle_brand': forms.TextInput(attrs={'class': 'form-control'}),
            'vehicle_model': forms.TextInput(attrs={'class': 'form-control'}),
            'vehicle_year': forms.NumberInput(attrs={'class': 'form-control'}),
            'vehicle_color': forms.TextInput(attrs={'class': 'form-control'}),
            'license_plate': forms.TextInput(attrs={'class': 'form-control'}),
            'vin': forms.TextInput(attrs={'class': 'form-control'}),
            'branch_location': forms.Select(attrs={'class': 'form-select'}),
            'film_brand': forms.TextInput(attrs={'class': 'form-control'}),
            'film_type': forms.Select(attrs={'class': 'form-select'}),
            'coverage_area': forms.TextInput(attrs={'class': 'form-control'}),
            'first_checkup_notes': forms.Textarea(attrs={'class': 'form-control', 'rows': 2}),
            'second_checkup_notes': forms.Textarea(attrs={'class': 'form-control', 'rows': 2}),
            'third_checkup_notes': forms.Textarea(attrs={'class': 'form-control', 'rows': 2}),
            'fourth_checkup_notes': forms.Textarea(attrs={'class': 'form-control', 'rows': 2}),
            'fifth_checkup_notes': forms.Textarea(attrs={'class': 'form-control', 'rows': 2}),
        }
