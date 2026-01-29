from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class DailySalesReport(models.Model):
    """Daily sales summary - auto-generated from invoices"""
    report_date = models.DateField(unique=True, db_index=True)
    
    # Sales Metrics
    total_sales = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_invoices = models.IntegerField(default=0)
    total_jobs_completed = models.IntegerField(default=0)
    
    # Service Breakdown
    detailing_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    ppf_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    ceramic_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    other_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Customer Metrics
    new_customers = models.IntegerField(default=0)
    repeat_customers = models.IntegerField(default=0)
    
    # Payment Metrics
    cash_collected = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    card_collected = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    advance_collected = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Generated
    generated_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-report_date']
        indexes = [
            models.Index(fields=['report_date']),
            models.Index(fields=['-report_date']),
        ]
    
    def __str__(self):
        return f"Sales Report - {self.report_date}"


class MonthlySalesReport(models.Model):
    """Monthly sales summary - aggregated from daily reports"""
    month = models.CharField(max_length=7, unique=True, db_index=True)  # YYYY-MM format
    year = models.IntegerField()
    month_number = models.IntegerField()  # 1-12
    
    # Sales Metrics
    total_sales = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_invoices = models.IntegerField(default=0)
    total_jobs_completed = models.IntegerField(default=0)
    
    # Service Breakdown
    detailing_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    ppf_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    ceramic_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    other_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Customer Metrics
    new_customers_total = models.IntegerField(default=0)
    repeat_customers_total = models.IntegerField(default=0)
    
    # Payment Metrics
    cash_collected = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    card_collected = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    advance_collected = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Department Performance (if tracked)
    marketing_leads = models.IntegerField(default=0)
    conversion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)  # Percentage
    
    # Generated
    generated_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-year', '-month_number']
        indexes = [
            models.Index(fields=['year', 'month_number']),
            models.Index(fields=['-year', '-month_number']),
        ]
    
    def __str__(self):
        return f"Monthly Sales - {self.month}"


class SalesTarget(models.Model):
    """Monthly sales targets for tracking performance"""
    TARGET_TYPE_CHOICES = [
        ('COMPANY', 'Company-wide'),
        ('DEPARTMENT', 'Department'),
        ('EMPLOYEE', 'Employee'),
    ]
    
    target_type = models.CharField(max_length=20, choices=TARGET_TYPE_CHOICES)
    month = models.CharField(max_length=7)  # YYYY-MM
    
    # Target Reference
    department = models.ForeignKey('hr.Department', on_delete=models.CASCADE, null=True, blank=True)
    employee = models.ForeignKey('hr.Employee', on_delete=models.CASCADE, null=True, blank=True)
    
    # Targets
    revenue_target = models.DecimalField(max_digits=12, decimal_places=2)
    jobs_target = models.IntegerField(default=0)
    new_customers_target = models.IntegerField(default=0)
    
    # Actual (updated dynamically)
    revenue_achieved = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    jobs_achieved = models.IntegerField(default=0)
    new_customers_achieved = models.IntegerField(default=0)
    
    # Status
    achievement_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-month']
        unique_together = ['target_type', 'month', 'department', 'employee']
    
    def __str__(self):
        if self.employee:
            return f"{self.employee} - {self.month} Target"
        elif self.department:
            return f"{self.department} - {self.month} Target"
        return f"Company Target - {self.month}"
