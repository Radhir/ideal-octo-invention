from django.db import models
from hr.models import Employee, Department

class Project(models.Model):
    STATUS_CHOICES = [
        ('PLANNING', 'Planning'),
        ('ACTIVE', 'Active'),
        ('ON_HOLD', 'On Hold'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='projects')
    manager = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='managed_projects')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PLANNING')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM')
    
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    estimated_completion = models.DateField(null=True, blank=True)
    
    budget = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    actual_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    progress = models.IntegerField(default=0)
    risk_score = models.IntegerField(default=0)
    forecast_accuracy = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def budget_variance(self):
        if self.budget > 0:
            return round(((self.actual_cost - self.budget) / self.budget) * 100, 2)
        return 0

    @property
    def is_over_budget(self):
        return self.actual_cost > self.budget

    @property
    def days_remaining(self):
        if self.end_date:
            from datetime import date
            delta = self.end_date - date.today()
            return delta.days
        return None

    def __str__(self):
        return self.name

class ProjectMilestone(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='milestones')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    due_date = models.DateField()
    is_completed = models.BooleanField(default=False)
    completion_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.project.name} - {self.title}"

class ProjectTask(models.Model):
    STATUS_CHOICES = [
        ('TODO', 'To Do'),
        ('WIP', 'In Progress'),
        ('DONE', 'Done'),
        ('BLOCKED', 'Blocked'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    milestone = models.ForeignKey(ProjectMilestone, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    description = models.TextField()
    assigned_to = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='project_tasks')
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='TODO')
    priority = models.CharField(max_length=20, choices=Project.PRIORITY_CHOICES, default='MEDIUM')
    
    def __str__(self):
        return f"{self.project.name} Task: {self.description[:50]}"

class ProjectResource(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='resources')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='assigned_projects')
    role_in_project = models.CharField(max_length=100, blank=True)
    allocation_percentage = models.IntegerField(default=100)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.employee.full_name} on {self.project.name}"

class ProjectBudget(models.Model):
    CATEGORY_CHOICES = [
        ('LABOR', 'Labor'),
        ('MATERIALS', 'Materials'),
        ('EQUIPMENT', 'Equipment'),
        ('OVERHEAD', 'Overhead'),
        ('OTHER', 'Other'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='budget_items')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    estimated_amount = models.DecimalField(max_digits=12, decimal_places=2)
    actual_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    @property
    def variance(self):
        return self.actual_amount - self.estimated_amount
    
    def __str__(self):
        return f"{self.project.name} - {self.get_category_display()}"

class ProjectForecast(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='forecasts')
    forecast_date = models.DateField(auto_now_add=True)
    predicted_completion = models.DateField()
    predicted_cost = models.DecimalField(max_digits=12, decimal_places=2)
    confidence_level = models.IntegerField(default=50)
    factors = models.JSONField(default=dict)
    
    def __str__(self):
        return f"Forecast for {self.project.name} on {self.forecast_date}"
