from django import forms
from .models import JobCard, JobCardPhoto, JobCardTask

class JobCardReceptionForm(forms.ModelForm):
    class Meta:
        model = JobCard
        fields = [
            'job_card_number', 'date', 'customer_name', 'phone', 'address',
            'registration_number', 'vin', 'brand', 'model', 'year', 'color', 
            'kilometers', 'service_advisor', 'initial_inspection_notes'
        ]
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
            'address': forms.Textarea(attrs={'rows': 2}),
            'initial_inspection_notes': forms.Textarea(attrs={'rows': 3}),
        }

class JobCardEstimationForm(forms.ModelForm):
    class Meta:
        model = JobCard
        fields = ['job_description', 'total_amount', 'discount_amount', 'advance_amount']
        widgets = {
            'job_description': forms.Textarea(attrs={'rows': 4}),
        }

class JobCardAssignmentForm(forms.ModelForm):
    class Meta:
        model = JobCard
        fields = ['assigned_technician', 'assigned_bay', 'estimated_timeline']
        widgets = {
            'estimated_timeline': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
        }

class JobCardQCForm(forms.ModelForm):
    class Meta:
        model = JobCard
        fields = [
            'qc_sign_off', 'pre_work_head_sign_off', 'post_work_tl_sign_off', 
            'post_work_head_sign_off', 'floor_incharge_sign_off'
        ]

class JobCardDeliveryForm(forms.ModelForm):
    class Meta:
        model = JobCard
        fields = ['customer_signature', 'loyalty_points', 'feedback_notes']
        widgets = {
            'feedback_notes': forms.Textarea(attrs={'rows': 3}),
        }
