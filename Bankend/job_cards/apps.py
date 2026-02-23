from django.apps import AppConfig

class JobCardsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'job_cards'

    def ready(self):
        import job_cards.signals
