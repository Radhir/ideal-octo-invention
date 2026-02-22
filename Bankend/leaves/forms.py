from django import forms
from .models import LeaveApplication

class LeaveApplicationForm(forms.ModelForm):
    class Meta:
        model = LeaveApplication
        fields = ['employee', 'leave_type_ref', 'leave_period_from', 'leave_period_to', 'reason']
        widgets = {
            'leave_period_from': forms.DateInput(attrs={'type': 'date'}),
            'leave_period_to': forms.DateInput(attrs={'type': 'date'}),
        }
