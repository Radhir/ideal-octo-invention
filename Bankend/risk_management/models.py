from django.db import models
from hr.models import Employee, Department

class Risk(models.Model):
    IMPACT_CHOICES = [
        (1, 'Low'),
        (2, 'Medium'),
        (3, 'High'),
        (4, 'Critical'),
    ]
    PROBABILITY_CHOICES = [
        (1, 'Rare'),
        (2, 'Possible'),
        (3, 'Likely'),
        (4, 'Certain'),
    ]
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('MITIGATING', 'Mitigating'),
        ('MITIGATED', 'Mitigated'),
        ('CLOSED', 'Closed'),
    ]
    ESCALATION_CHOICES = [
        ('NONE', 'None'),
        ('MANAGER', 'Manager'),
        ('DIRECTOR', 'Director'),
        ('EXECUTIVE', 'Executive'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    impact = models.IntegerField(choices=IMPACT_CHOICES, default=2)
    probability = models.IntegerField(choices=PROBABILITY_CHOICES, default=2)
    
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='risks')
    owner = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='owned_risks')
    linked_project = models.ForeignKey('projects.Project', on_delete=models.SET_NULL, null=True, blank=True, related_name='risks')
    
    mitigation_plan = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    escalation_level = models.CharField(max_length=20, choices=ESCALATION_CHOICES, default='NONE')
    residual_risk = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def severity_score(self):
        return self.impact * self.probability
    
    @property
    def severity_level(self):
        score = self.severity_score
        if score >= 12:
            return 'CRITICAL'
        elif score >= 8:
            return 'HIGH'
        elif score >= 4:
            return 'MEDIUM'
        return 'LOW'
    
    @property
    def severity_color(self):
        level = self.severity_level
        colors = {
            'CRITICAL': '#ef4444',
            'HIGH': '#f97316',
            'MEDIUM': '#eab308',
            'LOW': '#22c55e',
        }
        return colors.get(level, '#94a3b8')

    def __str__(self):
        return f"{self.title} ({self.get_impact_display()})"

class RiskMitigationAction(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    risk = models.ForeignKey(Risk, on_delete=models.CASCADE, related_name='mitigation_actions')
    action_description = models.TextField()
    assigned_to = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='mitigation_tasks')
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    effectiveness_rating = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    completion_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.risk.title} - {self.action_description[:30]}"

class Incident(models.Model):
    risk = models.ForeignKey(Risk, on_delete=models.CASCADE, related_name='incidents')
    title = models.CharField(max_length=255)
    description = models.TextField()
    impact_description = models.TextField()
    
    reported_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='reported_incidents')
    occurred_at = models.DateTimeField()
    
    resolution = models.TextField(blank=True)
    is_resolved = models.BooleanField(default=False)
    resolution_date = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.occurred_at.date()}"
