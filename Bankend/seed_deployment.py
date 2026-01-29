
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee, Department, Company, Branch

def seed_deployment_data():
    from django.db import transaction
    
    with transaction.atomic():
        print("Cleaning up existing data...")
        Employee.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()
        Department.objects.all().delete()
        Branch.objects.all().delete()
        Company.objects.all().delete()

        shine, _ = Company.objects.get_or_create(name="Elite Shine", defaults={'trn': '100XXXXXXXXXXXX'})
        trading, _ = Company.objects.get_or_create(name="ElitePro Trading", defaults={'trn': '100YYYYYYYYYYYY'})
        
        Branch.objects.get_or_create(name="Elite Shine Main", company=shine)
        Branch.objects.get_or_create(name="ElitePro Trading Main", company=trading)

        admin_data = [
            ("radhir", "Owner", shine),
            ("ruchika", "Administrator", shine),
            ("afsar", "Administrator", shine),
        ]

        employee_data = [
            ("abdul.saboor", "Team Member", "Detailing/Ceramic Coating", shine),
            ("ali.ahmed.laskar", "Team Member", "Detailing/Ceramic Coating", shine),
            ("ali.shan", "Team Member", "Detailing/Ceramic Coating", shine),
            ("azan.idrees", "Team Member", "Detailing/Ceramic Coating", shine),
            ("brijinder", "Team Member", "Detailing/Ceramic Coating", shine),
            ("dhiraj.kumar", "Team Member", "Detailing/Ceramic Coating", shine),
            ("emmanuel.botwe", "Team Member", "Detailing/Ceramic Coating", shine),
            ("ghulam.farid", "Team Member", "Detailing/Ceramic Coating", shine),
            ("iftikhar.muhammad", "Team Member", "Detailing/Ceramic Coating", shine),
            ("jahan.uddin", "Team Member", "Detailing/Ceramic Coating", shine),
            ("jalal.ahmed.laskar", "Team Member", "Detailing/Ceramic Coating", shine),
            ("jan.said.awranag.zaib", "Team Member", "Detailing/Ceramic Coating", shine),
            ("maznzul.ahmed.choudhury", "Team Member", "Detailing/Ceramic Coating", shine),
            ("masuk.ahmed.laskar", "Quality Control", "Detailing/Ceramic Coating", shine),
            ("mohammed.imran", "Team Member", "Detailing/Ceramic Coating", shine),
            ("muhammad.ibrar", "Team Member", "Detailing/Ceramic Coating", shine),
            ("muhammad.latif", "Head of Department", "Detailing/Ceramic Coating", shine),
            ("muhammad.rahim.malik", "Team Member", "Detailing/Ceramic Coating", shine),
            ("mursaleen", "Team Member", "Detailing/Ceramic Coating", shine),
            ("nizam.uddin.laskar", "Team Member", "Detailing/Ceramic Coating", shine),
            ("nur.ahmed.choudhury", "Team Member", "Detailing/Ceramic Coating", shine),
            ("saddam.hussain", "Team Member", "Detailing/Ceramic Coating", shine),
            ("stephan.nii.boye", "Team Member", "Detailing/Ceramic Coating", shine),
            ("yahaya.salisu", "Team Member", "Detailing/Ceramic Coating", shine),
            ("zareen.mohd", "Team Member", "Detailing/Ceramic Coating", shine),
            ("akhma.jan", "Driver", "Driver/Cleaner", shine),
            ("ashok.kumar", "Driver", "Driver/Cleaner", shine),
            ("bhola.singh", "Driver", "Driver/Cleaner", shine),
            ("mera.rao", "Driver", "Driver/Cleaner", shine),
            ("mohammed.sahedul.haque.chowdhury", "Driver", "Driver/Cleaner", shine),
            ("rajen.pradhan", "Driver", "Driver/Cleaner", shine),
            ("siddappa", "Driver", "Driver/Cleaner", shine),
            ("sudhir.kumar.singh", "Driver", "Driver/Cleaner", shine),
            ("anish", "Service Advisor", "Front Office", shine),
            ("ankit", "General Manager", "Front Office", shine),
            ("elmma.song.yoh", "Floor Incharge", "Front Office", shine),
            ("farhan.ali", "Operation Incharge", "Front Office", shine),
            ("mohammad.usman", "Service Advisor", "Front Office", shine),
            ("nomaanuddin.mohammed", "Accounts", "Front Office", shine),
            ("rashid.abdulrahman", "Outdoor Sales", "Front Office", shine),
            ("suraj.upadhya", "Service Advisor", "Front Office", shine),
            ("tamer", "Branch Manager", "Front Office", shine),
            ("tariq.abdullah", "Accounts", "Front Office", shine),
            ("abid.hussain.tanveer.hussain", "Team Member", "Painting/Denting", shine),
            ("ahmed.allah.ditta", "Team Member", "Painting/Denting", shine),
            ("alex.osei", "Team Member", "Painting/Denting", shine),
            ("amimuddin.shaikh", "Team Member", "Painting/Denting", shine),
            ("atif.ehsan", "Team Member", "Painting/Denting", shine),
            ("fahad.azeem", "Team Member", "Painting/Denting", shine),
            ("habibullah", "Team Member", "Painting/Denting", shine),
            ("irfan.khan.ejaj", "Team Member", "Painting/Denting", shine),
            ("mohammad.iliash", "Team Member", "Painting/Denting", shine),
            ("mohammad.sohrab", "Team Member", "Painting/Denting", shine),
            ("mohammad.ushman", "Team Member", "Painting/Denting", shine),
            ("mohammed.asif", "Team Member", "Painting/Denting", shine),
            ("mohd.imran.ansari", "Team Member", "Painting/Denting", shine),
            ("mohd.irfan.siraj.ahmed", "Team Member", "Painting/Denting", shine),
            ("muhammad.imran.akram", "Team Member", "Painting/Denting", shine),
            ("muhammad.iqbal", "Team Member", "Painting/Denting", shine),
            ("muhammad.nadeem", "Team Member", "Painting/Denting", shine),
            ("muhammad.qasim", "Team Member", "Painting/Denting", shine),
            ("muhammad.saleem", "Head of Department", "Painting/Denting", shine),
            ("muhammad.shafiq", "Team Member", "Painting/Denting", shine),
            ("pervez", "Team Member", "Painting/Denting", shine),
            ("rahul.prakash", "Team Member", "Painting/Denting", shine),
            ("rey", "Team Member", "Painting/Denting", shine),
            ("shaikh.sharfuddin", "Team Member", "Painting/Denting", shine),
            ("ajig.ahmed.laskar", "Team Member", "Tinting/Wrapping/PPF", shine),
            ("aminul.islam", "Team Member", "Tinting/Wrapping/PPF", shine),
            ("amzadul.haque.laskar", "Team Member", "Tinting/Wrapping/PPF", shine),
            ("azad.hussain.barbhuiya", "Team Member", "Tinting/Wrapping/PPF", shine),
            ("ikbal.hussain.barbhuiya", "Head of Department", "Tinting/Wrapping/PPF", shine),
            ("jalal.uddin", "Team Member", "Tinting/Wrapping/PPF", shine),
            ("jayed.ahmed.laskar", "Team Member", "Tinting/Wrapping/PPF", shine),
            ("kajal.ahmed", "Team Member", "Tinting/Wrapping/PPF", shine),
            ("mazumder.suhed.alom", "Team Member", "Tinting/Wrapping/PPF", shine),
            ("moin.uddin", "Team Member", "Tinting/Wrapping/PPF", shine),
            ("musim.khan", "Team Member", "Tinting/Wrapping/PPF", shine),
            ("muzafar.hussain", "Team Member", "Tinting/Wrapping/PPF", shine),
            ("rahul.phodder", "Team Member", "Tinting/Wrapping/PPF", shine),
            ("sahid.hussain.laskar", "Team Member", "Tinting/Wrapping/PPF", shine),
            ("shamim", "Team Member", "Tinting/Wrapping/PPF", shine),
            ("thuvan.asith.thuvanaheel", "Team Member", "Tinting/Wrapping/PPF", shine),
        ]

        pin_counter = 5000
        used_emp_ids = set()

        def get_unique_emp_id(base):
            final = base
            counter = 1
            while final in used_emp_ids:
                final = f"{base[:7]}{counter}"
                counter += 1
            used_emp_ids.add(final)
            return final

        for u, r, c in admin_data:
            user, _ = User.objects.get_or_create(username=u.lower(), defaults={
                'email': f"{u}@eliteshine.com",
                'is_active': True,
                'is_staff': True
            })
            Employee.objects.create(
                user=user,
                employee_id=get_unique_emp_id(f"ES-ADM-{u.upper()}"),
                company=c,
                role=r,
                pin_code=str(pin_counter).zfill(6),
                date_joined='2024-01-01'
            )
            pin_counter += 1

        for username, role, dept_name, company in employee_data:
            dept, _ = Department.objects.get_or_create(name=dept_name)
            user, _ = User.objects.get_or_create(username=username, defaults={
                'email': f"{username}@eliteshine.com",
                'is_active': True
            })
            Employee.objects.create(
                user=user,
                employee_id=get_unique_emp_id(f"ES-{username.upper().replace('.', '')[:5]}"),
                department=dept,
                company=company,
                role=role,
                pin_code=str(pin_counter).zfill(6),
                date_joined='2024-01-01'
            )
            pin_counter += 1
                
        print(f"Clean deployment data seeded successfully. {len(used_emp_ids)} employees created.")

if __name__ == "__main__":
    seed_deployment_data()
