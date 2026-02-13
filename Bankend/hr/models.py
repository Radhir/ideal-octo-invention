from django.db import models
from django.utils import timezone
from django.db.models.functions import Now
from django.contrib.auth.models import User
from locations.models import Branch

class Company(models.Model):
    name = models.CharField(max_length=100, unique=True)
    legal_name = models.CharField(max_length=255, blank=True)
    trn = models.CharField(max_length=50, blank=True, verbose_name="TAX Registration Number")
    parent_company = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subsidiaries')
    company_type = models.CharField(max_length=50, choices=[
        ('PARENT', 'Parent Company'),
        ('SUBSIDIARY', 'Subsidiary'),
        ('DIVISION', 'Division/Department'),
    ], default='PARENT', blank=True)
    address = models.TextField(blank=True)
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    website = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# Refactored: Branch moved to locations app
# class Branch(models.Model):
#     company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='branches', null=True)
#     name = models.CharField(max_length=100)
#     location = models.CharField(max_length=255, blank=True)
#     contact_number = models.CharField(max_length=20, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#
#     def __str__(self):
#         return self.name

class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='hr_profile')
    employee_id = models.CharField(max_length=20, unique=True)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees')
    department = models.ForeignKey('Department', on_delete=models.SET_NULL, null=True, blank=True, related_name='employees')
    # Updated to point to locations.Branch
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees')
    pin_code = models.CharField(max_length=6, unique=True)
    role = models.CharField(max_length=100)
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    housing_allowance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    transport_allowance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    date_joined = models.DateField()
    is_active = models.BooleanField(default=True)
    bio = models.TextField(blank=True, null=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    accent_color = models.CharField(max_length=7, default='#b08d57')
    
    # Financial/Accounting Fields
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, help_text="Default commission percentage (e.g. 5.00)")
    total_commissions_earned = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    # Onboarding Fields
    nationality = models.CharField(max_length=100, blank=True, null=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')], default='Male')
    dob = models.DateField(null=True, blank=True)
    marital_status = models.CharField(max_length=20, default='Single')
    salary_type = models.CharField(max_length=50, choices=[
        ('MONTHLY', 'Monthly'),
        ('DAILY', 'Daily (Attendance Based)'),
        ('HOURLY', 'Hourly'),
    ], default='MONTHLY')
    
    # Compliance & ID
    passport_no = models.CharField(max_length=50, blank=True, null=True)
    passport_expiry = models.DateField(null=True, blank=True)
    visa_uid = models.CharField(max_length=50, blank=True, null=True)
    visa_expiry = models.DateField(null=True, blank=True)
    skills = models.TextField(blank=True, null=True)

    # Location & Address
    uae_address = models.TextField(blank=True, null=True)
    uae_mobile = models.CharField(max_length=20, blank=True, null=True)
    home_country = models.CharField(max_length=100, blank=True, null=True)
    home_address = models.TextField(blank=True, null=True)
    home_mobile = models.CharField(max_length=20, blank=True, null=True)

    # Enhanced Personal Details
    medical_history = models.TextField(blank=True, null=True, help_text="Past medical history and conditions.")
    family_members_count = models.IntegerField(default=0, help_text="Number of immediate family members in home country.")
    visa_start_date = models.DateField(null=True, blank=True)
    experience_summary = models.TextField(blank=True, null=True, help_text="Summary of past experience and skills.")

    # Emergency Contact - UAE
    uae_emer_name = models.CharField(max_length=100, blank=True, null=True)
    uae_emer_phone = models.CharField(max_length=20, blank=True, null=True)
    uae_emer_relation = models.CharField(max_length=50, blank=True, null=True)

    # Emergency Contact - Home
    home_emer_name = models.CharField(max_length=100, blank=True, null=True)
    home_emer_phone = models.CharField(max_length=20, blank=True, null=True)
    home_emer_relation = models.CharField(max_length=50, blank=True, null=True)

    # Master Permissions (MongoDB-style dynamic configuration)
    permissions_config = models.JSONField(default=dict, blank=True, help_text="Dynamic JSON for granular portfolio and system access.")
    full_name_passport = models.CharField(max_length=255, blank=True, null=True, help_text="Official name as per passport.")

    @property
    def full_name(self):
        return self.full_name_passport or f"{self.user.first_name} {self.user.last_name}"

    class Meta:
        permissions = [
            ('view_financials', 'Can view employee financial details'),
        ]

    def __str__(self):
        return f"{self.full_name} ({self.employee_id})"

class Mistake(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='mistakes')
    date = models.DateField(default=models.functions.Now)
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Amount to be deducted.")
    description = models.TextField(help_text="Description of the mistake or breakage.")
    evidence_photo = models.ImageField(upload_to='mistakes/', help_text="Photo evidence of the mistake.")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Mistake by {self.employee.full_name} on {self.date} - AED {self.amount}"

class HRRule(models.Model):
    rule_name = models.CharField(max_length=100)
    rule_value = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.rule_name

class Payroll(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    month = models.DateField() # Represented by first day of month
    basic_paid = models.DecimalField(max_digits=10, decimal_places=2)
    overtime_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    incentives = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('PENDING', 'Pending'), ('PROCESSED', 'Processed')], default='PENDING')

    def delete(self, *args, **kwargs):
        raise PermissionError("Financial records in the Master Ledger cannot be deleted. Archive or Cancel instead.")

    def __str__(self):
        return f"{self.employee} - {self.month.strftime('%B %Y')}"

class Roster(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    shift_start = models.DateTimeField()
    shift_end = models.DateTimeField()
    task_notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.employee} - {self.shift_start.strftime('%Y-%m-%d %H:%M')}"

class HRAttendance(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    date = models.DateField()
    clock_in = models.TimeField()
    clock_out = models.TimeField(null=True, blank=True)
    total_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    class Meta:
        unique_together = ('employee', 'date')

    def __str__(self):
        return f"{self.employee} - {self.date}"

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    head = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_departments')
    
    # Financial Targets (Null until confirmed)
    monthly_sales_target = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, default=0.00)
    monthly_expense_budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, default=0.00)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='teams')
    description = models.TextField(blank=True)
    leader = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='led_teams')
    members = models.ManyToManyField(Employee, blank=True, related_name='teams')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @property
    def member_count(self):
        return self.members.count()

class ModulePermission(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='module_permissions')
    module_name = models.CharField(max_length=100) # e.g., 'Inventory', 'Job Cards'
    can_view = models.BooleanField(default=True)
    can_create = models.BooleanField(default=False)
    can_edit = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)

    class Meta:
        unique_together = ('employee', 'module_name')

    def __str__(self):
        return f'{self.employee.full_name} - {self.module_name}'
class SalarySlip(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='salary_slips')
    month = models.CharField(max_length=7, help_text="Format: YYYY-MM")
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bonuses = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Auto-Calculated Fields
    days_present = models.IntegerField(default=30)
    overtime_hours = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    overtime_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    commissions_earned = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    late_deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    total_additions = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)
    
    payment_status = models.CharField(max_length=20, choices=[('PENDING', 'Pending'), ('PAID', 'Paid')], default='PENDING')
    generated_at = models.DateTimeField(auto_now_add=True)
    is_sent = models.BooleanField(default=False)

    def calculate_salary(self):
        from attendance.models import Attendance
        from django.db.models import Sum
        
        # 1. Fetch Attendance for the Month
        attendance_qs = Attendance.objects.filter(
            employee=self.employee, 
            date__month=int(self.month.split('-')[1]),
            date__year=int(self.month.split('-')[0])
        )
        
        # 2. Aggregates
        agg = attendance_qs.aggregate(
            total_logged=Sum('total_hours'),
            total_ot=Sum('overtime_hours')
        )
        total_hours = float(agg['total_logged'] or 0)
        total_ot = float(agg['total_ot'] or 0)
        
        # 3. Rate Logic
        if self.employee.salary_type == 'DAILY' or self.employee.salary_type == 'HOURLY':
            # For Daily/Hourly, basic_salary is the 'Rate per Hour' or 'Rate per Day/10'
            hourly_rate = float(self.basic_salary) / 10 if self.employee.salary_type == 'DAILY' else float(self.basic_salary)
            ot_rate = hourly_rate * 1.25
            
            basic_earned = (total_hours - total_ot) * hourly_rate
            ot_earned = total_ot * ot_rate
            
            earnings = basic_earned + ot_earned + float(self.allowances) + float(self.bonuses)
        else:
            # Monthly Standard
            per_day_rate = float(self.basic_salary) / 30
            hourly_rate = per_day_rate / 10 
            ot_rate = hourly_rate * 1.25
            
            ot_earned = total_ot * ot_rate
            earnings = float(self.basic_salary) + float(self.allowances) + ot_earned + float(self.bonuses)
        
        # 4. Final Totals
        deductions = float(self.deductions) + float(self.late_deductions)
        self.overtime_hours = total_ot
        self.overtime_amount = ot_earned
        
        self.total_additions = self.overtime_amount + float(self.bonuses) + float(self.commissions_earned)
        self.total_deductions = deductions
        
        self.net_salary = earnings - deductions
        self.save()

    def save(self, *args, **kwargs):
        if not self.net_salary:
            self.net_salary = (float(self.basic_salary) + float(self.allowances)) - float(self.deductions)
        
        # Detect status change to PAID
        if self.pk:
            old_instance = SalarySlip.objects.get(pk=self.pk)
            if old_instance.payment_status != 'PAID' and self.payment_status == 'PAID':
                self.record_expense_transaction()
        elif self.payment_status == 'PAID':
            super().save(*args, **kwargs)
            self.record_expense_transaction()
            return

        super().save(*args, **kwargs)

    def record_expense_transaction(self):
        from finance.models import Account, Transaction
        # Find or create a default Expense account (5000)
        expense_acc, _ = Account.objects.get_or_create(
            code='5000', 
            defaults={'name': 'Payroll Expenses', 'category': 'EXPENSE'}
        )
        
        # Create DEBIT transaction (Expense increases with Debit)
        Transaction.objects.create(
            account=expense_acc,
            department_ref=self.employee.department,
            amount=self.net_salary,
            transaction_type='DEBIT',
            description=f"Payroll Payout - {self.employee.full_name} ({self.month})",
            reference=f"SLIP-{self.id}"
        )

    def delete(self, *args, **kwargs):
        raise PermissionError("Finalized Salary Slips are immutable and cannot be deleted from the archive.")

    def __str__(self):
        return f"Slip {self.employee.full_name} - {self.month}"

class EmployeeDocument(models.Model):
    DOC_TYPES = [
        ('PASSPORT', 'Passport'),
        ('VISA', 'Visa'),
        ('ID', 'Emirates ID'),
        ('CONTRACT', 'Labor Contract'),
        ('LICENSE', 'Driving License'),
        ('OTHER', 'Other'),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=20, choices=DOC_TYPES)
    document_number = models.CharField(max_length=50)
    expiry_date = models.DateField()
    file = models.FileField(upload_to='employee_docs/')
    notified_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.document_type} - {self.employee.full_name}"

class WarningLetter(models.Model):
    WARNING_LEVELS = [
        ('VERBAL', 'Verbal Warning'),
        ('FIRST', 'First Written Warning'),
        ('SECOND', 'Second Written Warning'),
        ('FINAL', 'Final Warning'),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='warnings')
    date_issued = models.DateField(auto_now_add=True)
    warning_level = models.CharField(max_length=20, choices=WARNING_LEVELS)
    reason = models.TextField()
    consequences = models.TextField(blank=True)
    is_signed_by_employee = models.BooleanField(default=False)
    signed_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.warning_level} - {self.employee.full_name} ({self.date_issued})"

class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} for {self.recipient.username}"

    class Meta:
        ordering = ['-created_at']
