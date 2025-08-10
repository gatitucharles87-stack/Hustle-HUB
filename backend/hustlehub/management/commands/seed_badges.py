from django.core.management.base import BaseCommand
from hustlehub.models import Badge

class Command(BaseCommand):
    help = 'Seeds the database with initial badges'

    def handle(self, *args, **options):
        self.stdout.write('Seeding initial badges...')

        badges = [
            # Level Badges
            {'name': 'Rookie', 'description': 'Just getting started. Welcome to HustleHub!', 'icon': '🐣', 'badge_type': 'level'},
            {'name': 'Hustle Initiate', 'description': 'First steps on the hustle path.', 'icon': '🎯', 'badge_type': 'level'},
            {'name': 'Skill Sprinter', 'description': 'Moving fast and learning quickly.', 'icon': '🚀', 'badge_type': 'level'},
            {'name': 'Task Tackler', 'description': 'Completed key tasks like a pro.', 'icon': '🔧', 'badge_type': 'level'},
            {'name': 'Smart Hustler', 'description': 'Mastered the basics.', 'icon': '🧩', 'badge_type': 'level'},
            {'name': 'Certified Doer', 'description': 'Gained trust from clients.', 'icon': '🎓', 'badge_type': 'level'},
            {'name': 'Work Warrior', 'description': 'Reliable and consistent service provider.', 'icon': '🛠️', 'badge_type': 'level'},
            {'name': 'Pro Performer', 'description': 'Your name is getting known.', 'icon': '🏆', 'badge_type': 'level'},
            {'name': 'Local Legend', 'description': 'Dominating your area with skill.', 'icon': '🔥', 'badge_type': 'level'},
            {'name': 'Trusted Hustler', 'description': 'Excellent ratings and reviews.', 'icon': '⭐', 'badge_type': 'level'},
            {'name': 'Efficiency Expert', 'description': 'Fast, efficient, and on time.', 'icon': '⚡', 'badge_type': 'level'},
            {'name': 'Skill Barter Champ', 'description': 'Actively exchanging services with great results.', 'icon': '🧠', 'badge_type': 'level'},
            {'name': 'Client Magnet', 'description': 'Clients keep coming back.', 'icon': '🧲', 'badge_type': 'level'},
            {'name': 'Consistency King/Queen', 'description': 'You\'ve never missed a deadline.', 'icon': '🦾', 'badge_type': 'level'},
            {'name': '5-Star Streak', 'description': 'Maintained multiple 5-star ratings in a row.', 'icon': '💎', 'badge_type': 'level'},
            {'name': 'Hustle Architect', 'description': 'Built an elite reputation and XP.', 'icon': '🧱', 'badge_type': 'level'},
            {'name': 'Elite Hustler', 'description': 'Among the top 10% on the platform.', 'icon': '🥇', 'badge_type': 'level'},
            {'name': 'Hustler Royalty', 'description': 'Admired, respected, and referenced by peers.', 'icon': '👑', 'badge_type': 'level'},
            {'name': 'Hustle Guardian', 'description': 'Helping grow the community and upholding platform values.', 'icon': '🛡️', 'badge_type': 'level'},
            {'name': 'Hustle Legend', 'description': 'You are now the face of HustleHub.', 'icon': '🌟', 'badge_type': 'level'},

            # Achievement Badges
            {'name': 'Top Rated Freelancer', 'description': 'Maintain a 5-star rating across 10+ jobs', 'icon': '⭐', 'badge_type': 'achievement'},
            {'name': 'Job Completionist', 'description': 'Successfully complete 25 jobs', 'icon': '✅', 'badge_type': 'achievement'},
            {'name': 'Category Expert', 'description': 'Complete 10 jobs in the same category', 'icon': '🎯', 'badge_type': 'achievement'},
            {'name': 'Community Helper', 'description': 'Receive 5 helpful votes in the Skill Barter exchange', 'icon': '🤝', 'badge_type': 'achievement'},
        ]

        for badge_data in badges:
            badge, created = Badge.objects.get_or_create(
                name=badge_data['name'],
                defaults={'description': badge_data['description'], 'icon': badge_data['icon'], 'badge_type': badge_data['badge_type']}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Successfully created badge: {badge_data["name"]}'))
            else:
                self.stdout.write(self.style.WARNING(f'Badge already exists: {badge_data["name"]}'))
