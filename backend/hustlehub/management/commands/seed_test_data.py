from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from hustlehub.models import (
    Job, JobApplication, Badge, UserBadge, CommissionLog, XPLog, Referral, LoyaltyPointLog, JobCategory
)
from decimal import Decimal
from django.utils import timezone

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with specific test data for gamification features.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Seeding specific test data...'))
        self.clear_data()
        self.create_test_data()
        self.stdout.write(self.style.SUCCESS('Test data seeding completed!'))

    def clear_data(self):
        self.stdout.write('Clearing specific test data...')
        User.objects.filter(email__in=['testfreelancer@example.com', 'testemployer@example.com', 'referredfriend@example.com', 'passwordresetuser@example.com']).delete()
        # Clearing related objects to avoid integrity errors
        UserBadge.objects.all().delete()
        CommissionLog.objects.all().delete()
        XPLog.objects.all().delete()
        Referral.objects.all().delete()
        LoyaltyPointLog.objects.all().delete()
        JobApplication.objects.all().delete()
        Job.objects.filter(category__name='Testing').delete()
        Badge.objects.filter(name='Test Achievement').delete()
        JobCategory.objects.filter(name='Testing').delete()
        self.stdout.write('Specific test data cleared.')

    def create_test_data(self):
        self.stdout.write('Creating test users...')
        freelancer, _ = User.objects.get_or_create(
            email='testfreelancer@example.com',
            defaults={
                'password': 'testpassword',
                'full_name': 'Test Freelancer',
                'role': 'freelancer',
                'username': 'testfreelancer'
            }
        )
        employer, _ = User.objects.get_or_create(
            email='testemployer@example.com',
            defaults={
                'password': 'testpassword',
                'full_name': 'Test Employer',
                'role': 'employer',
                'username': 'testemployer'
            }
        )
        referred_user, _ = User.objects.get_or_create(
            email='referredfriend@example.com',
            defaults={
                'password': 'testpassword',
                'full_name': 'Referred Friend',
                'role': 'freelancer',
                'username': 'referredfriend'
            }
        )
        password_reset_user, _ = User.objects.get_or_create(
            email='passwordresetuser@example.com',
            defaults={
                'password': 'oldpassword',
                'full_name': 'Password Reset User',
                'role': 'freelancer',
                'username': 'resetuser'
            }
        )
        self.stdout.write('Test users created.')

        self.stdout.write('Creating and completing a test job...')
        testing_category, _ = JobCategory.objects.get_or_create(name='Testing')
        job = Job.objects.create(
            employer=employer,
            title='Test Job for Gamification',
            description='A job to test badge, xp, and commission creation.',
            category=testing_category,
            job_type='remote',
            budget=Decimal('150.00'),
            status='open'
        )
        JobApplication.objects.create(job=job, freelancer=freelancer, status='accepted')
        job.status = 'completed'
        job.save()
        self.stdout.write('Test job created and marked as completed.')

        # Explicitly add XP to trigger level-up for the seeded user
        # This mimics the behavior that would typically be handled by signals in the app
        freelancer.add_xp(100) # Add XP equivalent to a completed job
        freelancer.refresh_from_db()
        self.stdout.write(f'Freelancer XP (after explicit add_xp): {freelancer.xp_points}')
        self.stdout.write(f'Freelancer Level (after explicit add_xp): {freelancer.level}')

        self.stdout.write('Creating test badge and assigning to freelancer...')
        badge, _ = Badge.objects.get_or_create(
            name='Test Achievement',
            defaults={
                'description': 'This is a badge for testing purposes.',
                'badge_type': 'achievement'
            }
        )
        UserBadge.objects.create(user=freelancer, badge=badge)
        self.stdout.write('Test badge created and assigned.')

        self.stdout.write('Creating test XP log for freelancer...')
        XPLog.objects.create(user=freelancer, points=100, source_job=job)
        self.stdout.write('Test XP log created.')

        self.stdout.write('Creating test referral and loyalty points...')
        Referral.objects.create(referrer=freelancer, referred_user=referred_user, is_successful=True)
        LoyaltyPointLog.objects.create(user=freelancer, points=50, source='referral')
        self.stdout.write('Test referral and loyalty points created.')
