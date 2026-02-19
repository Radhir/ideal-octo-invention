import os
import django
import sys
import random

# Setup Django environment
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BANKEND_DIR = os.path.dirname(SCRIPT_DIR) # R:\webplot\Bankend

sys.path.insert(0, BANKEND_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from hr.models import Employee, Department, Company
from locations.models import Branch

raw_data = """
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

def import_employees():
    company, _ = Company.objects.get_or_create(name="Elite Shine")
    branch = Branch.objects.first()
    if not branch:
        branch = Branch.objects.create(name="Main Branch", code="HO-001", company=company)

    lines = raw_data.strip().split('\n')
    created_count = 0
    updated_count = 0

    for line in lines:
        try:
            parts = [p.strip() for p in line.split('|')]
            if len(parts) < 8:
                continue
            
            username = parts[0].lower()
            role = parts[2]
            dept_name = parts[3]
            salary = float(parts[4])
            
            dept = None
            if dept_name and dept_name != ' ':
                dept, _ = Department.objects.get_or_create(name=dept_name)

            user, _ = User.objects.get_or_create(
                username=username,
                defaults={
                    'first_name': username.split('.')[0].capitalize(),
                    'last_name': username.split('.')[-1].capitalize() if '.' in username else ''
                }
            )
            if not user.password:
                user.set_password('Elite@123')
                user.save()

            employee, created = Employee.objects.update_or_create(
                user=user,
                defaults={
                    'company': company,
                    'department': dept,
                    'branch': branch,
                    'role': role,
                    'basic_salary': salary,
                    'is_active': True,
                    'full_name_passport': username.replace('.', ' ').title()
                }
            )
            
            # Ensure required fields if newly created
            if not employee.employee_id:
                employee.employee_id = f"ES-{random.randint(1000, 9999)}"
            if not employee.pin_code:
                employee.pin_code = "".join([str(random.randint(0,9)) for _ in range(6)])
            if not employee.date_joined:
                employee.date_joined = django.utils.timezone.now().date()
            employee.save()

            if created: created_count += 1
            else: updated_count += 1
        except Exception as e:
            print(f"Error importing {line}: {e}")

    print(f"Import complete: {created_count} created, {updated_count} updated.")

if __name__ == "__main__":
    import_employees()
