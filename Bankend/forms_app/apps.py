from django.apps import AppConfig

class FormsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'forms_app'
    
    def ready(self):
        # Optional: import signals here if needed
        # import forms_app.signals
        pass
