from django import forms
from .models import JobCard, JobCardPhoto, JobCardTask

# Comprehensive Car Brands (Classic to Modern)
CAR_BRANDS = [
    ('Abarth', 'Abarth'), ('Acura', 'Acura'), ('Alfa Romeo', 'Alfa Romeo'), ('Aston Martin', 'Aston Martin'),
    ('Audi', 'Audi'), ('Bentley', 'Bentley'), ('BMW', 'BMW'), ('Bugatti', 'Bugatti'),
    ('Buick', 'Buick'), ('Cadillac', 'Cadillac'), ('Chevrolet', 'Chevrolet'), ('Chrysler', 'Chrysler'),
    ('Citroën', 'Citroën'), ('Dacia', 'Dacia'), ('Daewoo', 'Daewoo'), ('Daihatsu', 'Daihatsu'),
    ('Dodge', 'Dodge'), ('Ferrari', 'Ferrari'), ('Fiat', 'Fiat'), ('Ford', 'Ford'),
    ('Genesis', 'Genesis'), ('GMC', 'GMC'), ('Honda', 'Honda'), ('Hummer', 'Hummer'),
    ('Hyundai', 'Hyundai'), ('Infiniti', 'Infiniti'), ('Isuzu', 'Isuzu'), ('Jaguar', 'Jaguar'),
    ('Jeep', 'Jeep'), ('Kia', 'Kia'), ('Koenigsegg', 'Koenigsegg'), ('Lamborghini', 'Lamborghini'),
    ('Lancia', 'Lancia'), ('Land Rover', 'Land Rover'), ('Lexus', 'Lexus'), ('Lincoln', 'Lincoln'),
    ('Lotus', 'Lotus'), ('Maserati', 'Maserati'), ('Maybach', 'Maybach'), ('Mazda', 'Mazda'),
    ('McLaren', 'McLaren'), ('Mercedes-Benz', 'Mercedes-Benz'), ('MG', 'MG'), ('Mini', 'Mini'),
    ('Mitsubishi', 'Mitsubishi'), ('Nissan', 'Nissan'), ('Opel', 'Opel'), ('Pagani', 'Pagani'),
    ('Peugeot', 'Peugeot'), ('Pontiac', 'Pontiac'), ('Porsche', 'Porsche'), ('RAM', 'RAM'),
    ('Renault', 'Renault'), ('Rolls-Royce', 'Rolls-Royce'), ('Saab', 'Saab'), ('Saturn', 'Saturn'),
    ('Scion', 'Scion'), ('SEAT', 'SEAT'), ('Skoda', 'Skoda'), ('Smart', 'Smart'),
    ('SsangYong', 'SsangYong'), ('Subaru', 'Subaru'), ('Suzuki', 'Suzuki'), ('Tesla', 'Tesla'),
    ('Toyota', 'Toyota'), ('Volkswagen', 'Volkswagen'), ('Volvo', 'Volvo'), ('Other', 'Other'),
]

# Model Years (Classic to Current)
YEAR_CHOICES = [(str(year), str(year)) for year in range(2026, 1949, -1)]

# UAE Plate Codes (A to ZZ for all Emirates)
PLATE_CODES_ALPHA = []
for first in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
    PLATE_CODES_ALPHA.append((first, first))
    for second in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
        PLATE_CODES_ALPHA.append((first + second, first + second))

# Sharjah Numeric Codes (1-99)
PLATE_CODES_SHARJAH = [(str(i), str(i)) for i in range(1, 100)]

# All UAE Emirates + GCC
PLATE_EMIRATES = [
    ('Abu Dhabi', 'Abu Dhabi'),
    ('Dubai', 'Dubai'),
    ('Sharjah', 'Sharjah'),
    ('Ajman', 'Ajman'),
    ('Umm Al Quwain', 'Umm Al Quwain'),
    ('Ras Al Khaimah', 'Ras Al Khaimah'),
    ('Fujairah', 'Fujairah'),
    ('Saudi Arabia', 'Saudi Arabia'),
    ('Oman', 'Oman'),
]

# Combined Plate Codes (Alpha + Sharjah Numeric)
PLATE_CODES = PLATE_CODES_ALPHA + PLATE_CODES_SHARJAH

class JobCardReceptionForm(forms.ModelForm):
    brand = forms.ChoiceField(
        choices=CAR_BRANDS,
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    year = forms.ChoiceField(
        choices=YEAR_CHOICES,
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    plate_code = forms.ChoiceField(
        choices=PLATE_CODES,
        required=False,
        widget=forms.Select(attrs={'class': 'form-select', 'placeholder': 'Plate Code (A-ZZ or 1-99)'})
    )
    plate_emirate = forms.ChoiceField(
        choices=PLATE_EMIRATES,
        required=False,
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    
    class Meta:
        model = JobCard
        fields = [
            'job_card_number', 'date', 'customer_name', 'phone', 'address',
            'registration_number', 'vin', 'brand', 'model', 'year', 'color', 
            'kilometers', 'service_advisor', 'initial_inspection_notes'
        ]
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'address': forms.Textarea(attrs={'rows': 2, 'class': 'form-control'}),
            'initial_inspection_notes': forms.Textarea(attrs={'rows': 3, 'class': 'form-control'}),
            'job_card_number': forms.TextInput(attrs={'class': 'form-control'}),
            'customer_name': forms.TextInput(attrs={'class': 'form-control'}),
            'phone': forms.TextInput(attrs={'class': 'form-control'}),
            'registration_number': forms.TextInput(attrs={'class': 'form-control'}),
            'vin': forms.TextInput(attrs={'class': 'form-control'}),
            'model': forms.TextInput(attrs={'class': 'form-control'}),
            'color': forms.TextInput(attrs={'class': 'form-control'}),
            'kilometers': forms.NumberInput(attrs={'class': 'form-control'}),
            'service_advisor': forms.TextInput(attrs={'class': 'form-control'}),
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

