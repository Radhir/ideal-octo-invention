import os
import django
import sys
from django.utils import timezone

# Set up Django environment
sys.path.append(os.path.join(os.getcwd(), 'Bankend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee, Department

def initialize_employees():
    # Data from images and user request
    data = [
        {
            'username': 'ankit',
            'full_name_passport': 'Ankit Dhamija Narinder Dhamija',
            'first_name': 'Ankit',
            'last_name': 'Dhamija',
            'role': 'Group Manager',
            'nationality': 'India',
            'dob': '1990-03-31',
            'passport_no': '784-1990-2194620-9', # Using Emirates ID as passport_no/ID
            'visa_expiry': '2027-09-05',
        },
        {
            'username': 'suraj.upadhya',
            'full_name_passport': 'Suraj Upadhya Gautam Upadhya',
            'first_name': 'Suraj',
            'last_name': 'Upadhya',
            'role': 'Service Advisor',
            'nationality': 'India',
            'dob': '1996-06-23',
            'passport_no': '784-1996-2773435-5',
            'visa_expiry': '2027-08-07',
        },
        {
            'username': 'anish',
            'full_name_passport': 'Anish Anandhankattuparambil Azeez',
            'first_name': 'Anish',
            'last_name': 'Anandhankattuparambil Azeez',
            'role': 'Service Advisor',
            'nationality': 'India',
            'dob': '1985-12-25',
            'passport_no': '784-1985-1946252-1',
            'visa_expiry': '2025-12-28',
        },
        {
            'username': 'tamer',
            'full_name_passport': 'TAMER DIAAELDIN MOHAMED FAHMY AHMED FARAG',
            'first_name': 'Tamer',
            'last_name': 'Diaaeldin Mohamed Fahmy Ahmed Farag',
            'role': 'Branch Manager',
            'nationality': 'Egypt',
            'dob': '1980-01-01', # Placeholder if not clearly visible
            'visa_uid': '118810490', # Work permit
            'visa_expiry': '2026-10-13',
        },
        {
            'username': 'tariq',
            'full_name_passport': 'TARIQ ABDULLAH',
            'first_name': 'Tariq',
            'last_name': 'Abdullah',
            'role': 'Accounts',
            'nationality': 'Pakistan',
            'dob': '1985-11-20',
            'passport_no': '784-1985-0565863-7',
            'visa_expiry': '2027-01-08',
        }
    ]

    # Get or create Front Office department
    dept, _ = Department.objects.get_or_create(name='Front Office')

    for entry in data:
        user, user_created = User.objects.get_or_create(
            username=entry['username'],
            defaults={
                'first_name': entry['first_name'],
                'last_name': entry['last_name'],
                'is_active': True
            }
        )
        if user_created:
            user.set_password('EliteShine2025!')
            user.save()
            print(f"Created User: {entry['username']}")
        else:
            user.first_name = entry['first_name']
            user.last_name = entry['last_name']
            user.save()
            print(f"Updated User: {entry['username']}")

        employee_id = f"ES-{entry['username'].upper()}" # Temporary ID or update if exists
        
        emp, emp_created = Employee.objects.get_or_create(
            user=user,
            defaults={
                'employee_id': employee_id,
                'department': dept,
                'role': entry['role'],
                'pin_code': '0000', # Change if needed
                'date_joined': timezone.now().date(),
                'nationality': entry['nationality'],
                'dob': entry['dob'],
                'full_name_passport': entry['full_name_passport'],
                'passport_no': entry.get('passport_no', ''),
                'visa_uid': entry.get('visa_uid', ''),
                'visa_expiry': entry.get('visa_expiry'),
                'is_active': True
            }
        )

        if not emp_created:
            emp.role = entry['role']
            emp.nationality = entry['nationality']
            emp.dob = entry['dob']
            emp.full_name_passport = entry['full_name_passport']
            emp.passport_no = entry.get('passport_no', emp.passport_no)
            emp.visa_uid = entry.get('visa_uid', emp.visa_uid)
            emp.visa_expiry = entry.get('visa_expiry', emp.visa_expiry)
            emp.save()
            print(f"Updated Employee Profile: {entry['username']}")
        else:
            print(f"Created Employee Profile: {entry['username']}")

if __name__ == '__main__':
    initialize_employees()
