from django import forms
from .models import LeaveApplication

class LeaveApplicationForm(forms.ModelForm):
    class Meta:
        model = LeaveApplication
        fields = ['employee_name', 'position', 'leave_type', 'leave_period_from', 'leave_period_to']
        widgets = {
            'leave_period_from': forms.DateInput(attrs={'type': 'date'}),
            'leave_period_to': forms.DateInput(attrs={'type': 'date'}),
        }
