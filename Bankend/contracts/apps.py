from django.apps import AppConfig

class ContractsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'contracts'
    
    def ready(self):
        # Import models to ensure they are registered
        try:
            import contracts.sla.models
        except ImportError:
            pass
