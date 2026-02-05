from django.db import models

class Branch(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True) # e.g., DXB-001
    address = models.TextField()
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    
    is_head_office = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} ({self.code})"

    class Meta:
        ordering = ['name']
        verbose_name_plural = "Branches"
