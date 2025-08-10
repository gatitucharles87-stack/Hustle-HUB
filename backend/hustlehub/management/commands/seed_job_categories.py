from django.core.management.base import BaseCommand
from hustlehub.models import JobCategory

class Command(BaseCommand):
    help = 'Seeds the database with initial job categories'

    def handle(self, *args, **options):
        self.stdout.write('Seeding initial job categories...')

        categories = [
            'Tech', 'Design', 'Home Services', 'Writing', 'Marketing', 
            'Business & Finance', 'Education & Training', 'Health & Wellness'
        ]

        for category_name in categories:
            category, created = JobCategory.objects.get_or_create(name=category_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Successfully created job category: {category_name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Job category already exists: {category_name}'))
