from django.core.management.base import BaseCommand
from django.utils import timezone
from hr.models import Employee
from attendance.models import Attendance
from django.conf import settings

class Command(BaseCommand):
    help = 'Generates and sends the daily attendance report (WhatsApp/Email)'

    def handle(self, *args, **options):
        today = timezone.now().date()
        self.stdout.write(f"Generating Daily Attendance Report for {today}...")

        # 1. Fetch Data
        all_employees = Employee.objects.filter(is_active=True)
        attendance_records = Attendance.objects.filter(date=today)
        
        present_qs = attendance_records.filter(status__in=['PRESENT', 'LATE', 'HALF_DAY'])
        late_qs = attendance_records.filter(status='LATE')
        
        present_ids = present_qs.values_list('employee_id', flat=True)
        absent_employees = all_employees.exclude(id__in=present_ids)

        # 2. Stats
        total_staff = all_employees.count()
        present_count = present_qs.count()
        absent_count = absent_employees.count()
        late_count = late_qs.count()

        # 3. Compose Message
        report_lines = [
            f"📅 *Daily Attendance Report* - {today.strftime('%d %b %Y')}",
            f"🕒 Generated at: {timezone.now().strftime('%H:%M')}",
            "",
            f"👥 Total Staff: {total_staff}",
            f"✅ Present: {present_count}",
            f"❌ Absent: {absent_count}",
            f"⚠️ Late: {late_count}",
            "",
            "*Absentees:*",
        ]
        
        if absent_count > 0:
            for emp in absent_employees:
                report_lines.append(f"- {emp.full_name} ({emp.mobile_number if hasattr(emp, 'mobile_number') else 'No Contact'})")
        else:
            report_lines.append("None (All Present)")

        if late_count > 0:
            report_lines.append("\n*Late Arrivals:*")
            for att in late_qs:
                report_lines.append(f"- {att.employee.full_name} ({att.check_in_time.strftime('%H:%M')})")

        final_message = "\n".join(report_lines)

        # 4. Integrate Sending Logic
        self.send_whatsapp(final_message)
        self.send_email(final_message)
        
        self.stdout.write(self.style.SUCCESS("Report sent successfully!"))

    def send_whatsapp(self, message):
        # Mocking WhatsApp API (Twilio/Meta)
        # requests.post(settings.WHATSAPP_API_URL, json={'text': message, 'to': settings.ADMIN_PHONE})
        print("\n--- [MOCK] Sending WhatsApp ---")
        print(message)
        print("-------------------------------")

    def send_email(self, message):
        # Mocking Email
        # send_mail('Daily Attendance', message, settings.DEFAULT_FROM_EMAIL, [settings.ADMIN_EMAIL])
        print("\n--- [MOCK] Sending Email ---")
        print("Subject: Daily Attendance Report")
        print("Body sent to admin.")
        print("----------------------------")
