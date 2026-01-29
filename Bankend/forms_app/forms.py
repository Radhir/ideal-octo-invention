from django import forms
from .models import *

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

class JobCardForm(forms.ModelForm):
    class Meta:
        model = JobCard
        fields = '__all__'
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
            'job_description': forms.Textarea(attrs={'rows': 4}),
            'total_amount': forms.NumberInput(attrs={'step': '0.01'}),
            'vat_amount': forms.NumberInput(attrs={'step': '0.01', 'readonly': 'readonly'}),
            'discount_amount': forms.NumberInput(attrs={'step': '0.01'}),
            'net_amount': forms.NumberInput(attrs={'step': '0.01', 'readonly': 'readonly'}),
            'advance_amount': forms.NumberInput(attrs={'step': '0.01'}),
            'balance_amount': forms.NumberInput(attrs={'step': '0.01', 'readonly': 'readonly'}),
        }
        for field in ['job_card_number', 'customer_name', 'phone', 'registration_number', 'vin', 'brand', 'model', 'color', 'account_name', 'bank_name', 'account_number', 'iban', 'branch']:
            widgets[field] = forms.TextInput(attrs={'class': 'form-control'})

class RequestFormForm(forms.ModelForm):
    class Meta:
        model = RequestForm
        fields = '__all__'
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
        }

class StockFormForm(forms.ModelForm):
    class Meta:
        model = StockForm
        fields = '__all__'
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
        }

class LeaveApplicationForm(forms.ModelForm):
    class Meta:
        model = LeaveApplication
        fields = ['employee_name', 'position', 'leave_type', 'leave_period_from', 'leave_period_to']
        widgets = {
            'leave_period_from': forms.DateInput(attrs={'type': 'date'}),
            'leave_period_to': forms.DateInput(attrs={'type': 'date'}),
        }

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

class ChecklistForm(forms.ModelForm):
    class Meta:
        model = Checklist
        fields = '__all__'
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
        }

class BookingForm(forms.ModelForm):
    class Meta:
        model = Booking
        fields = '__all__'
        widgets = {
            'booking_date': forms.DateInput(attrs={'type': 'date'}),
            'booking_time': forms.TimeInput(attrs={'type': 'time'}),
        }

class LeadForm(forms.ModelForm):
    class Meta:
        model = Lead
        fields = '__all__'

class InvoiceForm(forms.ModelForm):
    class Meta:
        model = Invoice
        fields = '__all__'
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
            'items': forms.Textarea(attrs={'rows': 5, 'placeholder': 'Item|Qty|Price'}),
        }

class OperationForm(forms.ModelForm):
    class Meta:
        model = Operation
        fields = '__all__'
        widgets = {
            'start_date': forms.DateInput(attrs={'type': 'date'}),
            'end_date': forms.DateInput(attrs={'type': 'date'}),
        }
