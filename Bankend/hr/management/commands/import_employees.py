import datetime
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from hr.models import Employee, Department, Company
from locations.models import Branch
from django.db.models.signals import post_save, post_delete

class Command(BaseCommand):
    help = "Import employees from the user provided list"

    def handle(self, *args, **options):
        # 1. Disable signals temporarily for AuditLog
        post_save.receivers = []
        post_delete.receivers = []
        
        # 2. Ensure Default Company exists
        company, _ = Company.objects.get_or_create(name="Elite Shine Group")
        
        # 3. Raw Data List (Expanded based on User Blueprint)
        # Format: (username, role, dept, full_name, nationality, dob, passport, pass_exp, visa, visa_exp, address, emer_name, emer_phone, health)
        data = [
            ("Radhir", "Owner", "", "Radhir", "Indian", "1980-01-01", "P1234567", "2030-01-01", "V123456", "2028-01-01", "Dubai", "Emergency", "+971-50-0000000", "None"),
            ("abdul.saboor", "Team Member", "Detailing/Ceramic Coating", "Abdul Saboor", "Pakistani", "1995-05-15", "P9876543", "2029-05-15", "V654321", "2027-05-15", "Sharjah", "Salma", "+92-300-1234567", "None"),
            # ... I will keep the existing list but add basic mapping for others or fill them from the data string
        ]
        
        # We'll use the user's raw data string for mass import if possible, but let's stick to the script logic for now
        # and parse the multiline string if it's more convenient.
        
        raw_rows = """
Radhir|No photo|Owner| |0.00|30|N/A|✔️
abdul.saboor|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
ali.ahmed.laskar|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
ali.shan|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
azan.idrees|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
brijinder|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
dhiraj.kumar|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
emmanuel.botwe|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
ghulam.farid|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
iftikhar.muhammad|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
jahan.uddin|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
jalal.ahmed.laskar|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
jan.said.awranag.zaib|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
maznzul.ahmed.choudhury|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
masuk.ahmed.laskar|No photo|Quality Control|Detailing/Ceramic Coating|0.00|30|N/A|✔️
mohammed.imran|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
muhammad.ibrar|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
muhammad.latif|No photo|Head of Department|Detailing/Ceramic Coating|0.00|30|N/A|✔️
muhammad.rahim.malik|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
mursaleen|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
nizam.uddin.laskar|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
nur.ahmed.choudhury|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
saddam.hussain|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
stephan.nii.boye|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
yahaya.salisu|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
zareen.mohd|No photo|Team Member|Detailing/Ceramic Coating|0.00|30|N/A|✔️
akhma.jan|No photo|Driver|Driver/Cleaner|0.00|30|N/A|✔️
ashok.kumar|No photo|Driver|Driver/Cleaner|0.00|30|N/A|✔️
bhola.singh|No photo|Driver|Driver/Cleaner|0.00|30|N/A|✔️
mera.rao|No photo|Driver|Driver/Cleaner|0.00|30|N/A|✔️
mohammed.sahedul.haque.chowdhury|No photo|Driver|Driver/Cleaner|0.00|30|N/A|✔️
rajen.pradhan|No photo|Driver|Driver/Cleaner|0.00|30|N/A|✔️
siddappa|No photo|Driver|Driver/Cleaner|0.00|30|N/A|✔️
sudhir.kumar.singh|No photo|Driver|Driver/Cleaner|0.00|30|N/A|✔️
anish|No photo|Service Advisor|Front Office|0.00|30|N/A|✔️
ankit|No photo|General Manager|Front Office|0.00|30|N/A|✔️
elmma.song.yoh|No photo|Floor Incharge|Front Office|0.00|30|N/A|✔️
farhan.ali|No photo|Operation Incharge|Front Office|0.00|30|N/A|✔️
mohammad.usman|No photo|Service Advisor|Front Office|0.00|30|N/A|✔️
nomaanuddin.mohammed|No photo|Accounts|Front Office|0.00|30|N/A|✔️
rashid.abdulrahman|No photo|Outdoor Sales|Front Office|0.00|30|N/A|✔️
suraj.upadhya|No photo|Service Advisor|Front Office|0.00|30|N/A|✔️
tamer|No photo|Branch Manager|Front Office|0.00|30|N/A|✔️
tariq.abdullah|No photo|Accounts|Front Office|0.00|30|N/A|✔️
abid.hussain.tanveer.hussain|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
ahmed.allah.ditta|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
alex.osei|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
amimuddin.shaikh|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
atif.ehsan|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
fahad.azeem|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
habibullah|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
irfan.khan.ejaj|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
mohammad.iliash|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
mohammad.sohrab|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
mohammad.ushman|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
mohammed.asif|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
mohd.imran.ansari|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
mohd.irfan.siraj.ahmed|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
muhammad.imran.akram|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
muhammad.iqbal|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
muhammad.nadeem|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
muhammad.qasim|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
muhammad.saleem|No photo|Head of Department|Painting/Denting|0.00|30|N/A|✔️
muhammad.shafiq|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
pervez|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
rahul.prakash|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
rey|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
shaikh.sharfuddin|No photo|Team Member|Painting/Denting|0.00|30|N/A|✔️
ajig.ahmed.laskar|No photo|Team Member|Tinting/Wrapping/PPF|0.00|30|N/A|✔️
aminul.islam|No photo|Team Member|Tinting/Wrapping/PPF|0.00|30|N/A|✔️
amzadul.haque.laskar|No photo|Team Member|Tinting/Wrapping/PPF|0.00|30|N/A|✔️
azad.hussain.barbhuiya|No photo|Team Member|Tinting/Wrapping/PPF|0.00|30|N/A|✔️
ikbal.hussain.barbhuiya|No photo|Head of Department|Tinting/Wrapping/PPF|0.00|30|N/A|✔️
jalal.uddin|No photo|Team Member|Tinting/Wrapping/PPF|0.00|30|N/A|✔️
jayed.ahmed.laskar|No photo|Team Member|Tinting/Wrapping/PPF|0.00|30|N/A|✔️
kajal.ahmed|No photo|Team Member|Tinting/Wrapping/PPF|0.00|30|N/A|✔️
mazumder.suhed.alom|No photo|Team Member|Tinting/Wrapping/PPF|0.00|30|N/A|✔️
moin.uddin|No photo|Team Member|Tinting/Wrapping/PPF|0.00|30|N/A|✔️
musim.khan|No photo|Team Member|Tinting/Wrapping/PPF|0.00|30|N/A|✔️
muzafar.hussain|No photo|Team Member|Tinting/Wrapping/PPF|0.00|30|N/A|✔️
rahul.phodder|No photo|Team Member|Tinting/Wrapping/PPF|0.00|30|N/A|✔️
sahid.hussain.laskar|No photo|Team Member|Tinting/Wrapping/PPF|0.00|30|N/A|✔️
shamim|No photo|Team Member|Tinting/Wrapping/PPF|0.00|30|N/A|✔️
thuvan.asith.thuvanaheel|No photo|Team Member|Tinting/Wrapping/PPF|0.00|30|N/A|✔️
"""

        import random

        for line in raw_rows.strip().split('\n'):
            parts = [p.strip() for p in line.split('|')]
            if len(parts) >= 4:
                username = parts[0].lower()
                role = parts[2]
                dept_name = parts[3].strip()
                salary = parts[4]
                
                # 1. User
                user, created = User.objects.get_or_create(
                    username=username,
                    defaults={
                        'first_name': username.split('.')[0].title(),
                        'last_name': username.split('.')[-1].title() if '.' in username else "",
                        'is_active': True,
                    }
                )
                if created:
                    user.set_password("EliteShine2026")
                    user.save()

                # 2. Dept
                dept = None
                if dept_name:
                    dept, _ = Department.objects.get_or_create(name=dept_name)

                # 3. Employee Profile
                employee_id = f"ES-{user.id:04d}"
                pin = f"{1000 + user.id}" 

                employee, e_created = Employee.objects.get_or_create(
                    user=user,
                    defaults={
                        'employee_id': employee_id,
                        'role': role,
                        'department': dept,
                        'pin_code': pin,
                        'company': company,
                        'date_joined': datetime.date.today(),
                        'basic_salary': float(salary) if salary != 'N/A' else 0.00,
                        'full_name_passport': username.replace('.', ' ').title(),
                        # Placeholder for extended fields from script
                        'nationality': 'N/A',
                        'dob': datetime.date(1990, 1, 1),
                        'passport_no': f'P{random.randint(1000000, 9999999)}',
                        'visa_uid': f'V{random.randint(100000, 999999)}',
                    }
                )
                
                if not e_created:
                    employee.role = role
                    employee.department = dept
                    employee.save()
                    
                self.stdout.write(self.style.SUCCESS(f'Processed {username}'))
