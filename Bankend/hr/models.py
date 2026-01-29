from django.db import models
from django.utils import timezone
from django.db.models.functions import Now
from django.contrib.auth.models import User

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

class Branch(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='branches', null=True)
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255, blank=True)
    contact_number = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='hr_profile')
    employee_id = models.CharField(max_length=20, unique=True)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees')
    department = models.ForeignKey('Department', on_delete=models.SET_NULL, null=True, blank=True, related_name='employees')
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

    # Enhanced Personal Details
    medical_history = models.TextField(blank=True, null=True, help_text="Past medical history and conditions.")
    family_members_count = models.IntegerField(default=0, help_text="Number of immediate family members in home country.")
    visa_start_date = models.DateField(null=True, blank=True)
    experience_summary = models.TextField(blank=True, null=True, help_text="Summary of past experience and skills.")

    # Emergency Contact 1
    emergency_contact_1_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_contact_1_phone = models.CharField(max_length=20, blank=True, null=True)
    emergency_contact_1_relation = models.CharField(max_length=50, blank=True, null=True)
    emergency_contact_1_photo = models.ImageField(upload_to='emergency_contacts/', blank=True, null=True)

    # Emergency Contact 2
    emergency_contact_2_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_contact_2_phone = models.CharField(max_length=20, blank=True, null=True)
    emergency_contact_2_relation = models.CharField(max_length=50, blank=True, null=True)
    emergency_contact_2_photo = models.ImageField(upload_to='emergency_contacts/', blank=True, null=True)

    @property
    def full_name(self):
        return self.user.get_full_name()

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
    month = models.DateField()
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)
    is_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Slip {self.employee.full_name} - {self.month.strftime('%Y-%m')}"

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
