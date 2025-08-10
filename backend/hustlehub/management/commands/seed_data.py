import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from hustlehub.models import (
    Job, JobApplication, SkillBarterPost, SkillBarterOffer, Badge,
    NotificationSettings, Review, UserBadge, CommissionLog, Referral, LoyaltyPointLog,
    CommissionExcuse, Notification, County, SubCounty, Ward, NeighborhoodTag, JobCategory
)
from decimal import Decimal
from faker import Faker
import random
from datetime import date, timedelta
from django.utils import timezone
from django.db.models import Sum, Avg

User = get_user_model()
fake = Faker()

class Command(BaseCommand):
    help = 'Seeds the database with initial data for HustleHub.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Seeding database...'))
        self.clear_data()
        self.create_users()
        self.create_jobs_and_applications()
        self.create_skill_barter_posts_and_offers()
        self.create_reviews()
        self.create_commission_logs_and_excuses()
        self.create_referrals_and_loyalty_points()
        self.create_badges_and_user_badges()
        self.create_notifications()
        self.create_notification_settings()
        self.seed_locations()
        self.stdout.write(self.style.SUCCESS('Database seeding completed!'))

    def clear_data(self):
        self.stdout.write('Clearing existing data...')
        NeighborhoodTag.objects.all().delete()
        Ward.objects.all().delete()
        SubCounty.objects.all().delete()
        County.objects.all().delete()
        NotificationSettings.objects.all().delete()
        UserBadge.objects.all().delete()
        CommissionExcuse.objects.all().delete()
        CommissionLog.objects.all().delete()
        Review.objects.all().delete()
        SkillBarterOffer.objects.all().delete()
        SkillBarterPost.objects.all().delete()
        JobApplication.objects.all().delete()
        Job.objects.all().delete()
        Referral.objects.all().delete()
        LoyaltyPointLog.objects.all().delete()
        Notification.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()
        self.stdout.write('Data cleared.')

    def create_users(self):
        self.stdout.write('Creating users...')
        if not User.objects.filter(email='admin@example.com').exists():
            User.objects.create_superuser(email='admin@example.com', password='password', full_name='Admin User', username='adminuser')
            self.stdout.write('Created admin user: admin@example.com')

        self.referrer_user = User.objects.create_user(
            email='referrer@example.com', full_name='Referrer Jane', role='freelancer',
            password='password123', username='referrerjane', xp_points=1000
        )
        self.referred_freelancer = User.objects.create_user(
            email='referred@example.com', full_name='Referred John', role='freelancer',
            password='password123', username='referredjohn', is_remote_available=True, xp_points=500
        )

        for i in range(15):
            User.objects.create_user(
                email=f'freelancer{i}@example.com', full_name=fake.name(), role='freelancer',
                password='password123', is_remote_available=fake.boolean(),
                service_areas=random.sample(['Kasarani', 'Westlands', 'CBD', 'Karen', 'Thika', 'Nakuru'], k=random.randint(1, 3)),
                xp_points=random.randint(100, 3000),
                username=f'freelanceruser{i}',
                skills=random.sample(['Python', 'Django', 'React', 'Node.js', 'UI/UX', 'Graphic Design', 'Copywriting', 'SEO'], k=random.randint(1,4))
            )
        self.stdout.write('Created 15 freelancers.')

        for i in range(7):
            User.objects.create_user(
                email=f'employer{i}@example.com', full_name=fake.name(), role='employer',
                password='password123',
                username=f'employeruser{i}'
            )
        self.stdout.write('Created 7 employers.')

    def create_jobs_and_applications(self):
        self.stdout.write('Creating jobs and applications...')
        employers = User.objects.filter(role='employer')
        freelancers = User.objects.filter(role='freelancer')
        
        category_names = ['Tech', 'Design', 'Home Services', 'Writing', 'Marketing', 'Business & Finance', 'Education & Training', 'Health & Wellness']
        job_categories = [JobCategory.objects.get_or_create(name=name)[0] for name in category_names]
        
        sample_skills = ['React', 'Python', 'Django', 'Figma', 'Photoshop', 'Copywriting', 'SEO', 'Video Editing', 'UI/UX', 'Mobile Development', 'JavaScript', 'HTML/CSS', 'SQL']
        
        self.jobs = []
        for i in range(40):
            employer = random.choice(employers)
            num_skills = random.randint(1, 4)
            selected_skills = random.sample(sample_skills, num_skills)
            
            job_status = random.choice(['open', 'in_progress', 'completed'])
            budget = Decimal(random.uniform(100, 5000)).quantize(Decimal('0.01'))
            deadline = date.today() + timedelta(days=random.randint(10, 120))

            job = Job.objects.create(
                employer=employer, title=fake.job(), description=fake.paragraph(nb_sentences=5),
                category=random.choice(job_categories), skills=selected_skills,
                job_type=random.choice(['remote', 'local']),
                location=fake.city() if random.choice([True, False]) else None,
                budget=budget,
                deadline=deadline,
                status=job_status
            )
            self.jobs.append(job)

            if job_status == 'completed' or job_status == 'in_progress':
                freelancer = random.choice(freelancers)
                JobApplication.objects.create(job=job, freelancer=freelancer, status='accepted')
                
                other_freelancers = list(freelancers.exclude(id=freelancer.id))
                for _ in range(random.randint(0, 2)):
                    if other_freelancers:
                        applicant = random.choice(other_freelancers)
                        JobApplication.objects.get_or_create(job=job, freelancer=applicant, defaults={'status': random.choice(['pending', 'rejected'])})
                        other_freelancers.remove(applicant)
            elif job_status == 'open':
                for _ in range(random.randint(0, 3)):
                    applicant = random.choice(freelancers)
                    JobApplication.objects.get_or_create(job=job, freelancer=applicant, defaults={'status': 'pending'})

        self.stdout.write(f'Created {len(self.jobs)} jobs with various applications.')

    def create_skill_barter_posts_and_offers(self):
        self.stdout.write('Creating skill barter posts and offers...')
        freelancers = User.objects.filter(role='freelancer')
        self.skill_barter_posts = []
        for freelancer in freelancers:
            post_count = random.randint(0, 3)
            for _ in range(post_count):
                post = SkillBarterPost.objects.create(
                    user=freelancer, title=f"Offering {fake.job()} for {fake.catch_phrase()}",
                    skills_offered=fake.sentence(nb_words=5), skills_wanted=fake.sentence(nb_words=5),
                    is_active=fake.boolean(chance_of_getting_true=80)
                )
                self.skill_barter_posts.append(post)

                for _ in range(random.randint(0, 4)):
                    offered_by = random.choice(list(freelancers.exclude(id=freelancer.id)))
                    offer = SkillBarterOffer.objects.create(
                        post=post, offered_by=offered_by, message=fake.paragraph(nb_sentences=2)
                    )
        self.stdout.write('Created skill barter posts and offers.')

    def create_reviews(self):
        self.stdout.write('Creating reviews...')
        completed_applications = JobApplication.objects.filter(status='accepted', job__status='completed')
        for app in completed_applications:
            Review.objects.get_or_create(
                job=app.job,
                reviewer=app.job.employer,
                reviewee=app.freelancer,
                defaults={
                    'rating': random.randint(3, 5),
                    'comment': fake.paragraph(nb_sentences=2)
                }
            )
            if random.choice([True, False]):
                Review.objects.get_or_create(
                    job=app.job,
                    reviewer=app.freelancer,
                    reviewee=app.job.employer,
                    defaults={
                        'rating': random.randint(3, 5),
                        'comment': fake.paragraph(nb_sentences=2)
                    }
                )
        self.stdout.write(f'Created reviews for {completed_applications.count()} completed jobs.')

    def create_commission_logs_and_excuses(self):
        self.stdout.write('Creating commission logs and excuses...')
        completed_jobs = Job.objects.filter(status='completed')
        self.commission_logs = []
        for job in completed_jobs:
            accepted_application = job.applications.filter(status='accepted').first()
            if not accepted_application:
                continue

            freelancer = accepted_application.freelancer
            
            status = random.choice(['paid', 'due'])
            completion_date = timezone.now().date() - timedelta(days=random.randint(5, 60))
            due_date = completion_date + timedelta(days=random.randint(10, 30)) if status == 'due' else None
            
            total_amount = job.budget
            commission_percentage = Decimal('20.00')
            commission_amount = (commission_percentage / Decimal('100')) * total_amount
            freelancer_earning = total_amount - commission_amount
            
            commission_log, created = CommissionLog.objects.get_or_create(
                job=job,
                defaults={
                    'total_amount': total_amount,
                    'commission_percentage': commission_percentage,
                    'commission_amount': commission_amount,
                    'freelancer_earning': freelancer_earning,
                    'status': status,
                    'completion_date': completion_date,
                    'due_date': due_date
                }
            )
            self.commission_logs.append(commission_log)

            if status == 'due' and random.choice([True, False, False]):
                excuse_status = random.choice(['pending', 'approved', 'rejected'])
                reviewed_at = timezone.now() if excuse_status != 'pending' else None
                reviewed_by = User.objects.filter(role='admin').first() if reviewed_at else None

                CommissionExcuse.objects.create(
                    user=freelancer,
                    commission=commission_log,
                    reason=fake.paragraph(nb_sentences=2),
                    status=excuse_status,
                    created_at=timezone.now() - timedelta(days=random.randint(1, 5)),
                    reviewed_at=reviewed_at,
                    reviewed_by=reviewed_by
                )
                commission_log.has_excuse = True
                commission_log.save()

        self.stdout.write(f'Created {len(self.commission_logs)} commission logs and some excuses.')
    
    def create_referrals_and_loyalty_points(self):
        self.stdout.write('Creating referrals and loyalty points...')
        
        referral_success, created = Referral.objects.get_or_create(
            referrer=self.referrer_user,
            referred_user=self.referred_freelancer,
            defaults={'is_successful': True}
        )
        if created:
            self.stdout.write(f'Created successful referral: {self.referrer_user.email} -> {self.referred_freelancer.email}')
            LoyaltyPointLog.objects.create(user=self.referrer_user, points=100, source='referral')
            self.stdout.write(f'Awarded 100 loyalty points to {self.referrer_user.email} for referral.')

        all_users = list(User.objects.all())
        for _ in range(5):
            referrer = random.choice(all_users)
            referred = random.choice(all_users)
            if referrer != referred and not Referral.objects.filter(referred_user=referred).exists():
                Referral.objects.create(referrer=referrer, referred_user=referred, is_successful=False)
                self.stdout.write(f'Created unsuccessful referral: {referrer.email} -> {referred.email}')

        for _ in range(10):
            user = random.choice(User.objects.filter(role='freelancer'))
            LoyaltyPointLog.objects.create(
                user=user, 
                points=random.randint(10, 50), 
                source='job',
                created_at=timezone.now() - timedelta(days=random.randint(1, 60))
            )
        self.stdout.write('Finished creating referrals and loyalty points.')

    def create_badges_and_user_badges(self):
        self.stdout.write('Creating and awarding badges...')
        badge_data = {
            'Top Rated Freelancer': {'description': 'Maintain a 4.5+ average rating over 5+ reviews.', 'icon': '🏆'},
            'Job Completionist': {'description': 'Successfully complete 10 jobs.', 'icon': '✅'},
            'Category Expert (Web Dev)': {'description': 'Complete 5 Web Development jobs.', 'icon': '💻'},
            'Community Helper': {'description': 'Receive 10+ helpful votes on skill barter offers.', 'icon': '🤝'},
            'Loyalty Champion': {'description': 'Accumulate 500+ loyalty points.', 'icon': '💖'},
            'Referral Master': {'description': 'Successfully refer 3+ users.', 'icon': '🔗'}
        }
        badges = {}
        for name, data in badge_data.items():
            badge, _ = Badge.objects.get_or_create(name=name, defaults={'description': data['description'], 'icon': data['icon']})
            badges[name] = badge

        freelancers = User.objects.filter(role='freelancer')
        for freelancer in freelancers:
            avg_rating = Review.objects.filter(reviewee=freelancer).aggregate(avg=Avg('rating'))['avg'] or 0
            review_count = Review.objects.filter(reviewee=freelancer).count()
            if avg_rating >= 4.5 and review_count >= 5:
                UserBadge.objects.get_or_create(user=freelancer, badge=badges['Top Rated Freelancer'])

            completed_jobs_count = JobApplication.objects.filter(freelancer=freelancer, status='accepted', job__status='completed').count()
            if completed_jobs_count >= 10:
                UserBadge.objects.get_or_create(user=freelancer, badge=badges['Job Completionist'])

            web_dev_jobs = Job.objects.filter(
                applications__freelancer=freelancer, 
                applications__status='accepted', 
                status='completed', 
                category__name='Web Development'
            ).count()
            if web_dev_jobs >= 5:
                UserBadge.objects.get_or_create(user=freelancer, badge=badges['Category Expert (Web Dev)'])

            total_loyalty_points = LoyaltyPointLog.objects.filter(user=freelancer).aggregate(total_points=Sum('points'))['total_points'] or 0
            if total_loyalty_points >= 500:
                UserBadge.objects.get_or_create(user=freelancer, badge=badges['Loyalty Champion'])

            successful_referrals_count = Referral.objects.filter(referrer=freelancer, is_successful=True).count()
            if successful_referrals_count >= 3:
                UserBadge.objects.get_or_create(user=freelancer, badge=badges['Referral Master'])

        self.stdout.write('Finished creating and awarding badges.')

    def create_notifications(self):
        self.stdout.write('Creating notifications...')
        users = User.objects.all()
        for user in users:
            for i in range(random.randint(2, 7)):
                is_read = fake.boolean(chance_of_getting_true=50)
                Notification.objects.create(
                    user=user,
                    title=fake.sentence(nb_words=4),
                    message=fake.sentence(nb_words=10),
                    is_read=is_read,
                    created_at=timezone.now() - timedelta(days=random.randint(1, 30))
                )
        self.stdout.write('Created notifications.')

    def create_notification_settings(self):
        self.stdout.write('Creating notification settings...')
        users = User.objects.all()
        for user in users:
            NotificationSettings.objects.get_or_create(
                user=user,
                defaults={
                    'job_alerts': fake.boolean(),
                    'application_updates': fake.boolean(),
                    'new_message_notifications': fake.boolean()
                }
            )
        self.stdout.write('Created notification settings for all users.')

    def seed_locations(self):
        self.stdout.write('Seeding location data (Counties, SubCounties, Wards, NeighborhoodTags)...')
        location_data = [
            {
                "county": "Nairobi",
                "sub_counties": [
                    {"sub_county": "Ruaraka", "wards": ["Baba Dogo", "Utalii", "Mathare North", "Lucky Summer", "Korogocho"], "popular_neighborhoods": ["Mathare", "Baba Dogo"]},
                    {"sub_county": "Roysambu", "wards": ["Githurai", "Kahawa", "Kahawa West", "Roysambu", "Zimmerman"], "popular_neighborhoods": ["Zimmerman", "Kahawa", "Githurai"]},
                    {"sub_county": "Kasarani", "wards": ["Clay City", "Mwiki", "Kasarani", "Njiru", "Kamulu", "Ruai"], "popular_neighborhoods": ["Njiru", "Kasarani", "Kamulu", "Ruai"]},
                    {"sub_county": "Langata", "wards": ["Karen", "Nairobi West", "Nyayo Highrise", "South C", "Mugumoini"], "popular_neighborhoods": ["Karen", "South C", "Nyayo"]},
                    {"sub_county": "Embakasi South", "wards": ["Imara Daima", "Kwa Njenga", "Pipeline", "Kwa Reuben", "Kware"], "popular_neighborhoods": ["Pipeline", "Kware", "Imara Daima"]},
                    {"sub_county": "Embakasi North", "wards": ["Dandora Area I", "Dandora Area II", "Dandora Area III", "Dandora Area IV", "Kariobangi North"], "popular_neighborhoods": ["Dandora", "Kariobangi"]},
                    {"sub_county": "Embakasi Central", "wards": ["Kayole North", "Kayole South", "Komarock", "Matopeni/Spring Valley", "Kayole Central"], "popular_neighborhoods": ["Kayole", "Komarock"]},
                    {"sub_county": "Embakasi East", "wards": ["Upper Savanna", "Lower Savanna", "Embakasi", "Utawala", "Mihang'o"], "popular_neighborhoods": ["Utawala", "Mihang'o"]},
                    {"sub_county": "Embakasi West", "wards": ["Umoja I", "Umoja II", "Mowlem", "Kariobangi South", "Maringo/Hamza"], "popular_neighborhoods": ["Umoja", "Mowlem"]},
                    {"sub_county": "Starehe", "wards": ["Nairobi Central", "Ngara", "Pangani", "Ziwani/Kariokor", "Landimawe"], "popular_neighborhoods": ["CBD", "Ngara", "Pangani"]},
                    {"sub_county": "Dagoretti North", "wards": ["Kilimani", "Kileleshwa", "Kawangware", "Gatina", "Kabiro"], "popular_neighborhoods": ["Kilimani", "Kawangware"]},
                    {"sub_county": "Dagoretti South", "wards": ["Mutu-ini", "Ngando", "Riruta", "Uthiru/Ruthimitu", "Waithaka"], "popular_neighborhoods": ["Waithaka", "Riruta"]},
                    {"sub_county": "Kibra", "wards": ["Laini Saba", "Makina", "Lindi", "Sarang’ombe", "Woodley/Kenyatta Golf Course"], "popular_neighborhoods": ["Kibera"]},
                    {"sub_county": "Makadara", "wards": ["Harambee", "Makongeni", "Mbotela", "Viwandani", "Maringo/Hamza"], "popular_neighborhoods": ["Makongeni", "Viwandani"]},
                    {"sub_county": "Kamukunji", "wards": ["Pumwani", "Eastleigh North", "Eastleigh South", "Airbase", "California"], "popular_neighborhoods": ["Eastleigh", "Pumwani"]},
                    {"sub_county": "Mathare", "wards": ["Mlango Kubwa", "Ngei", "Huruma", "Mabatini", "Kiamaiko"], "popular_neighborhoods": ["Mathare", "Huruma"]},
                    {"sub_county": "Westlands", "wards": ["Parklands/Highridge", "Kitisuru", "Karura", "Kangemi", "Mountain View"], "popular_neighborhoods": ["Westlands", "Parklands", "Kitisuru"]}
                ]
            },
            {
                "county": "Kisumu",
                "sub_counties": [
                    {"sub_county": "Kisumu Central", "wards": ["Market Milimani", "Nyalenda A", "Nyalenda B", "Railways", "Shauri Moyo Kaloleni"], "popular_neighborhoods": ["Milimani", "Nyalenda", "Railways"]},
                    {"sub_county": "Kisumu East", "wards": ["Kajulu", "Kolwa East", "Manyatta B", "Nyalunya", "Kolwa Central"], "popular_neighborhoods": ["Manyatta", "Kolwa", "Kajulu"]},
                    {"sub_county": "Kisumu West", "wards": ["North West Kisumu", "South West Kisumu", "Kisumu North", "Central Kisumu", "West Kisumu"], "popular_neighborhoods": ["Otonglo", "Obambo"]}
                ]
            },
            {
                "county": "Kiambu",
                "sub_counties": [
                    {"sub_county": "Ruiru", "wards": ["Biashara", "Gitothua", "Gatongora", "Kahawa Sukari", "Kahawa Wendani"], "popular_neighborhoods": ["Ruiru", "Kahawa Sukari", "Kahawa Wendani"]},
                    {"sub_county": "Thika Town", "wards": ["Township", "Kamenu", "Hospital", "Gatuanyaga", "Ngoliba"], "popular_neighborhoods": ["Thika", "Gatuanyaga"]},
                    {"sub_county": "Kiambu Town", "wards": ["Township", "Ndumberi", "Riabai"], "popular_neighborhoods": ["Kiambu", "Ndumberi"]},
                    {"sub_county": "Githunguri", "wards": ["Githunguri", "Githiga", "Ikinu"], "popular_neighborhoods": ["Githunguri"]}
                ]
            },
            {
                "county": "Mombasa",
                "sub_counties": [
                    {"sub_county": "Mvita", "wards": ["Tudor", "Tononoka", "Majengo", "Ganjoni", "Shimanzi/Ganjoni"], "popular_neighborhoods": ["Mombasa CBD", "Tudor", "Tononoka"]},
                    {"sub_county": "Changamwe", "wards": ["Changamwe", "Airport", "Port Reitz", "Miritini", "Kipevu"], "popular_neighborhoods": ["Changamwe", "Miritini", "Port Reitz"]},
                    {"sub_county": "Nyali", "wards": ["Frere Town", "Ziwa La Ng'ombe", "Kongowea", "Mkomani"], "popular_neighborhoods": ["Nyali", "Kongowea", "Frere Town"]},
                    {"sub_county": "Likoni", "wards": ["Mtongwe", "Likoni", "Timbwani", "Bofu"], "popular_neighborhoods": ["Likoni", "Mtongwe"]}
                ]
            },
            {
                "county": "Nakuru",
                "sub_counties": [
                    {"sub_county": "Nakuru Town East", "wards": ["Flamingo", "Kivumbini", "Biashara", "Menengai", "Shabaab"], "popular_neighborhoods": ["Kivumbini", "Flamingo", "Menengai"]},
                    {"sub_county": "Nakuru Town West", "wards": ["Kaptembwa", "London", "Rhoda", "Shaabab", "Barut"], "popular_neighborhoods": ["Kaptembwa", "London", "Rhoda"]},
                    {"sub_county": "Naivasha", "wards": ["Mai Mahiu", "Biashara", "Lake View", "Naivasha East"], "popular_neighborhoods": ["Naivasha", "Mai Mahiu"]},
                    {"sub_county": "Gilgil", "wards": ["Gilgil", "Elementaita", "Murindati"], "popular_neighborhoods": ["Gilgil", "Elementaita"]}
                ]
            }
        ]

        for county_data in location_data:
            county_name = county_data["county"]
            county, created = County.objects.get_or_create(name=county_name)
            if created:
                self.stdout.write(f'  Added County: {county_name}')
            else:
                self.stdout.write(f'  Skipped County: {county_name} (already exists)')

            for sub_county_data in county_data["sub_counties"]:
                sub_county_name = sub_county_data["sub_county"]
                sub_county, created = SubCounty.objects.get_or_create(name=sub_county_name, county=county)
                if created:
                    self.stdout.write(f'    Added SubCounty: {sub_county_name} in {county_name}')
                else:
                    self.stdout.write(f'    Skipped SubCounty: {sub_county_name} in {county_name} (already exists)')

                for ward_name in sub_county_data["wards"]:
                    ward, created = Ward.objects.get_or_create(name=ward_name, sub_county=sub_county)
                    if created:
                        self.stdout.write(f'      Added Ward: {ward_name} in {sub_county_name}')
                    else:
                        self.stdout.write(f'      Skipped Ward: {ward_name} in {sub_county_name} (already exists)')

                for neighborhood_name in sub_county_data["popular_neighborhoods"]:
                    neighborhood_tag, created = NeighborhoodTag.objects.get_or_create(name=neighborhood_name)
                    if created:
                        self.stdout.write(f'      Added NeighborhoodTag: {neighborhood_name}')
                    else:
                        self.stdout.write(f'      Skipped NeighborhoodTag: {neighborhood_name} (already exists)')
        self.stdout.write('Finished seeding location data.')

