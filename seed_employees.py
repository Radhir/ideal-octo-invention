
import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee, Department

employee_data = [
    ("Radhir", "Owner", ""),
    ("abdul.saboor", "Team Member", "Detailing/Ceramic Coating"),
    ("ali.ahmed.laskar", "Team Member", "Detailing/Ceramic Coating"),
    ("ali.shan", "Team Member", "Detailing/Ceramic Coating"),
    ("azan.idrees", "Team Member", "Detailing/Ceramic Coating"),
    ("brijinder", "Team Member", "Detailing/Ceramic Coating"),
    ("dhiraj.kumar", "Team Member", "Detailing/Ceramic Coating"),
    ("emmanuel.botwe", "Team Member", "Detailing/Ceramic Coating"),
    ("ghulam.farid", "Team Member", "Detailing/Ceramic Coating"),
    ("iftikhar.muhammad", "Team Member", "Detailing/Ceramic Coating"),
    ("jahan.uddin", "Team Member", "Detailing/Ceramic Coating"),
    ("jalal.ahmed.laskar", "Team Member", "Detailing/Ceramic Coating"),
    ("jan.said.awranag.zaib", "Team Member", "Detailing/Ceramic Coating"),
    ("maznzul.ahmed.choudhury", "Team Member", "Detailing/Ceramic Coating"),
    ("masuk.ahmed.laskar", "Quality Control", "Detailing/Ceramic Coating"),
    ("mohammed.imran", "Team Member", "Detailing/Ceramic Coating"),
    ("muhammad.ibrar", "Team Member", "Detailing/Ceramic Coating"),
    ("muhammad.latif", "Head of Department", "Detailing/Ceramic Coating"),
    ("muhammad.rahim.malik", "Team Member", "Detailing/Ceramic Coating"),
    ("mursaleen", "Team Member", "Detailing/Ceramic Coating"),
    ("nizam.uddin.laskar", "Team Member", "Detailing/Ceramic Coating"),
    ("nur.ahmed.choudhury", "Team Member", "Detailing/Ceramic Coating"),
    ("saddam.hussain", "Team Member", "Detailing/Ceramic Coating"),
    ("stephan.nii.boye", "Team Member", "Detailing/Ceramic Coating"),
    ("yahaya.salisu", "Team Member", "Detailing/Ceramic Coating"),
    ("zareen.mohd", "Team Member", "Detailing/Ceramic Coating"),
    ("akhma.jan", "Driver", "Driver/Cleaner"),
    ("ashok.kumar", "Driver", "Driver/Cleaner"),
    ("bhola.singh", "Driver", "Driver/Cleaner"),
    ("mera.rao", "Driver", "Driver/Cleaner"),
    ("mohammed.sahedul.haque.chowdhury", "Driver", "Driver/Cleaner"),
    ("rajen.pradhan", "Driver", "Driver/Cleaner"),
    ("siddappa", "Driver", "Driver/Cleaner"),
    ("sudhir.kumar.singh", "Driver", "Driver/Cleaner"),
    ("anish", "Service Advisor", "Front Office"),
    ("ankit", "General Manager", "Front Office"),
    ("elmma.song.yoh", "Floor Incharge", "Front Office"),
    ("farhan.ali", "Operation Incharge", "Front Office"),
    ("mohammad.usman", "Service Advisor", "Front Office"),
    ("nomaanuddin.mohammed", "Accounts", "Front Office"),
    ("rashid.abdulrahman", "Outdoor Sales", "Front Office"),
    ("suraj.upadhya", "Service Advisor", "Front Office"),
    ("tamer", "Branch Manager", "Front Office"),
    ("tariq.abdullah", "Accounts", "Front Office"),
    ("abid.hussain.tanveer.hussain", "Team Member", "Painting/Denting"),
    ("ahmed.allah.ditta", "Team Member", "Painting/Denting"),
    ("alex.osei", "Team Member", "Painting/Denting"),
    ("amimuddin.shaikh", "Team Member", "Painting/Denting"),
    ("atif.ehsan", "Team Member", "Painting/Denting"),
    ("fahad.azeem", "Team Member", "Painting/Denting"),
    ("habibullah", "Team Member", "Painting/Denting"),
    ("irfan.khan.ejaj", "Team Member", "Painting/Denting"),
    ("mohammad.iliash", "Team Member", "Painting/Denting"),
    ("mohammad.sohrab", "Team Member", "Painting/Denting"),
    ("mohammad.ushman", "Team Member", "Painting/Denting"),
    ("mohammed.asif", "Team Member", "Painting/Denting"),
    ("mohd.imran.ansari", "Team Member", "Painting/Denting"),
    ("mohd.irfan.siraj.ahmed", "Team Member", "Painting/Denting"),
    ("muhammad.imran.akram", "Team Member", "Painting/Denting"),
    ("muhammad.iqbal", "Team Member", "Painting/Denting"),
    ("muhammad.nadeem", "Team Member", "Painting/Denting"),
    ("muhammad.qasim", "Team Member", "Painting/Denting"),
    ("muhammad.saleem", "Head of Department", "Painting/Denting"),
    ("muhammad.shafiq", "Team Member", "Painting/Denting"),
    ("pervez", "Team Member", "Painting/Denting"),
    ("rahul.prakash", "Team Member", "Painting/Denting"),
    ("rey", "Team Member", "Painting/Denting"),
    ("shaikh.sharfuddin", "Team Member", "Painting/Denting"),
    ("ajig.ahmed.laskar", "Team Member", "Tinting/Wrapping/PPF"),
    ("aminul.islam", "Team Member", "Tinting/Wrapping/PPF"),
    ("amzadul.haque.laskar", "Team Member", "Tinting/Wrapping/PPF"),
    ("azad.hussain.barbhuiya", "Team Member", "Tinting/Wrapping/PPF"),
    ("ikbal.hussain.barbhuiya", "Head of Department", "Tinting/Wrapping/PPF"),
    ("jalal.uddin", "Team Member", "Tinting/Wrapping/PPF"),
    ("jayed.ahmed.laskar", "Team Member", "Tinting/Wrapping/PPF"),
    ("kajal.ahmed", "Team Member", "Tinting/Wrapping/PPF"),
    ("mazumder.suhed.alom", "Team Member", "Tinting/Wrapping/PPF"),
    ("moin.uddin", "Team Member", "Tinting/Wrapping/PPF"),
    ("musim.khan", "Team Member", "Tinting/Wrapping/PPF"),
    ("muzafar.hussain", "Team Member", "Tinting/Wrapping/PPF"),
    ("rahul.phodder", "Team Member", "Tinting/Wrapping/PPF"),
    ("sahid.hussain.laskar", "Team Member", "Tinting/Wrapping/PPF"),
    ("shamim", "Team Member", "Tinting/Wrapping/PPF"),
    ("thuvan.asith.thuvanaheel", "Team Member", "Tinting/Wrapping/PPF"),
]

def seed_employees():
    from django.db import transaction
    
    with transaction.atomic():
        pin_counter = 1000
        for username, role, dept_name in employee_data:
            # Create/Get Department
            dept = None
            if dept_name:
                dept, _ = Department.objects.get_or_create(name=dept_name)
            
            # Create/Get User
            user, u_created = User.objects.get_or_create(username=username, defaults={
                'email': f"{username}@eliteshine.com",
                'is_active': True
            })
            if u_created:
                user.set_password("Elite123!")
                user.save()
            
            # Use deterministic but safely unique employee ID and PIN if creating
            emp_id_base = f"ES-{username.upper().replace('.', '')[:5]}"
            
            # Check if employee exists
            emp = Employee.objects.filter(user=user).first()
            if not emp:
                # Find unique employee_id
                final_emp_id = emp_id_base
                counter = 1
                while Employee.objects.filter(employee_id=final_emp_id).exists():
                    final_emp_id = f"{emp_id_base}{counter}"
                    counter += 1
                
                # Find unique pin
                final_pin = str(pin_counter).zfill(6)
                while Employee.objects.filter(pin_code=final_pin).exists():
                    pin_counter += 1
                    final_pin = str(pin_counter).zfill(6)
                
                Employee.objects.create(
                    user=user,
                    employee_id=final_emp_id,
                    department=dept,
                    role=role,
                    pin_code=final_pin,
                    date_joined='2024-01-01'
                )
                print(f"Created employee profile for: {username}")
            else:
                emp.department = dept
                emp.role = role
                emp.save()
                print(f"Updated employee profile for: {username}")
            
            pin_counter += 1

if __name__ == "__main__":
    seed_employees()
