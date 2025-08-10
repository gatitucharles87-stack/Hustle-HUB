from django.apps import AppConfig


class HustlehubConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'hustlehub'

    def ready(self):
        import hustlehub.signals
