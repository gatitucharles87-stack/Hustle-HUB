from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from backend.hustlehub.models import (
    Job, JobApplication, SkillBarterPost, SkillBarterOffer, Review, CommissionLog, 
    CommissionExcuse, NotificationSettings, AboutUs, Referral, County, SubCounty, Ward, 
    NeighborhoodTag, Badge, UserBadge, XPLog
)
from backend.hustlehub.serializers import (
    UserSerializer, JobSerializer, JobApplicationSerializer, SkillBarterPostSerializer,
    SkillBarterOfferSerializer, ReviewSerializer, CommissionLogSerializer,
    CommissionExcuseSerializer, NotificationSettingsSerializer, AboutUsSerializer, ReferralSerializer,
    CountySerializer, SubCountySerializer, WardSerializer, NeighborhoodTagSerializer
)

class ComprehensiveAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        User = get_user_model()

        # Create a test employer user
        self.employer_user = User.objects.create_user(
            username="employeruser",
            email="employer@example.com",
            password="testpassword",
            full_name="Employer User",
            role='employer'
        )
        self.employer_client = APIClient()
        self.employer_client.force_authenticate(user=self.employer_user)

        # Create a test freelancer user
        self.freelancer_user = User.objects.create_user(
            username="freelanceruser",
            email="freelancer@example.com",
            password="testpassword",
            full_name="Freelancer User",
            role='freelancer',
            xp_points=90 # Initial XP to test leveling up
        )
        self.freelancer_client = APIClient()
        self.freelancer_client.force_authenticate(user=self.freelancer_user)

        # Create a user specifically for password reset tests
        self.password_reset_user = User.objects.create_user(
            username="resetuser",
            email="reset@example.com",
            password="oldpassword",
            full_name="Reset User",
            role='freelancer'
        )

        # Create common data for tests
        self.job = Job.objects.create(
            employer=self.employer_user,
            title="Test Job",
            description="This is a test job description.",
            category="IT",
            job_type="remote",
            budget=100.00,
            deadline="2024-12-31"
        )
        self.skill_barter_post = SkillBarterPost.objects.create(
            user=self.freelancer_user,
            title="My Skill Barter Post",
            skills_offered="Web Development",
            skills_wanted="Graphic Design"
        )
        self.about_us_content = AboutUs.objects.create(
            title="Our Mission",
            content="This is the content of our mission."
        )
        NotificationSettings.objects.create(user=self.freelancer_user)

        # Create a basic achievement badge for initial testing (level badges are auto-created)
        Badge.objects.create(name="Test Achievement", description="A test achievement badge.", badge_type="achievement")


    # Authentication and User Management Tests
    def test_register_user_success(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "newpassword123",
            "full_name": "New User",
            "role": "freelancer"
        }
        response = self.client.post(reverse('register'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], "User Created Successfully. Now perform Login to get your token")

    def test_login_logout_success(self):
        data = {"email": "employer@example.com", "password": "testpassword"}
        response = self.client.post(reverse('login'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

        # Logout
        refresh_token = response.data['refresh']
        response = self.client.post(reverse('logout'), {'refresh_token': refresh_token}, format='json')
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

    def test_get_user_profile_success(self):
        response = self.freelancer_client.get(reverse('user-profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.freelancer_user.email)

    def test_update_user_profile_success(self):
        data = {"full_name": "Updated Freelancer Name", "is_remote": True}
        response = self.freelancer_client.patch(reverse('user-profile'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.freelancer_user.refresh_from_db()
        self.assertEqual(self.freelancer_user.full_name, "Updated Freelancer Name")
        self.assertTrue(self.freelancer_user.is_remote)

    def test_change_password_success(self):
        data = {"old_password": "testpassword", "new_password": "new_testpassword"}
        response = self.freelancer_client.put(reverse('change-password'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.freelancer_user.refresh_from_db()
        self.assertTrue(self.freelancer_user.check_password("new_testpassword"))

    # Password Reset Tests
    def test_password_reset_request_success(self):
        data = {"email": self.password_reset_user.email}
        response = self.client.post(reverse('password_reset'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertIn('If an account with that email exists', response.data['message'])
    
    def test_password_reset_confirm_success(self):
        # Manually generate UID and token for the password_reset_user
        uid = urlsafe_base64_encode(force_bytes(self.password_reset_user.pk))
        token = default_token_generator.make_token(self.password_reset_user)

        # Prepare data for password reset confirmation
        data = {"new_password": "newresetpassword123!"}
        url = reverse('password_reset_confirm', kwargs={'uidb64': force_str(uid), 'token': token})
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Password has been reset successfully.')

        # Verify login with new password
        login_data = {"email": self.password_reset_user.email, "password": "newresetpassword123!"}
        login_response = self.client.post(reverse('login'), login_data, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', login_response.data)

    def test_password_reset_confirm_invalid_token(self):
        uid = urlsafe_base64_encode(force_bytes(self.password_reset_user.pk))
        invalid_token = "invalid-token-123"
        data = {"new_password": "newresetpassword123!"}
        url = reverse('password_reset_confirm', kwargs={'uidb64': force_str(uid), 'token': invalid_token})
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('token', response.data)

    # Job Management Tests
    def test_create_job_success(self):
        data = {
            "title": "New Job for Employer",
            "description": "Description for new job",
            "category": "Writing",
            "job_type": "local",
            "budget": 200.00,
            "deadline": "2024-11-30",
            "county": None,  # Assuming these can be null for now
            "sub_county": None,
            "ward": None
        }
        response = self.employer_client.post(reverse('job-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Job.objects.count(), 2) # Includes job from setup

    def test_create_job_as_freelancer_fail(self):
        data = {
            "title": "Freelancer Job",
            "description": "Should not be created by freelancer",
            "category": "Design",
            "job_type": "remote",
            "budget": 50.00,
            "deadline": "2024-10-15"
        }
        response = self.freelancer_client.post(reverse('job-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_jobs_with_filters(self):
        # Create another job for filtering
        Job.objects.create(
            employer=self.employer_user,
            title="Another Test Job",
            description="Another job description.",
            category="Design",
            job_type="local",
            budget=150.00,
            deadline="2024-10-31"
        )

        response = self.client.get(reverse('job-list') + '?category=IT')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['category'], 'IT')

    def test_freelancer_apply_for_job_success(self):
        # Ensure the job is open
        self.job.status = 'open'
        self.job.save()
        
        url = reverse('job-apply', kwargs={'pk': self.job.pk})
        response = self.freelancer_client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(JobApplication.objects.filter(job=self.job, freelancer=self.freelancer_user).exists())

    def test_list_my_applications_freelancer(self):
        JobApplication.objects.create(job=self.job, freelancer=self.freelancer_user)
        response = self.freelancer_client.get(reverse('job-my-applications'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['job']['title'], self.job.title)

    def test_list_my_listings_employer(self):
        response = self.employer_client.get(reverse('job-my-listings'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], self.job.title)

    def test_employer_manages_applicants(self):
        # Create an application for the job
        job_application = JobApplication.objects.create(job=self.job, freelancer=self.freelancer_user)

        # List applicants
        list_url = reverse('job-applicants', kwargs={'pk': self.job.pk})
        response = self.employer_client.get(list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['freelancer']['email'], self.freelancer_user.email)

        # Update applicant status
        update_url = reverse('job-manage-applicant', kwargs={'pk': self.job.pk, 'application_pk': job_application.pk})
        response = self.employer_client.put(update_url, {'status': 'accepted'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        job_application.refresh_from_db()
        self.assertEqual(job_application.status, 'accepted')

    # Skill Barter Tests
    def test_create_and_list_skill_barter_posts(self):
        data = {
            "title": "Another Barter",
            "skills_offered": "Dancing",
            "skills_wanted": "Singing"
        }
        response = self.freelancer_client.post(reverse('skillbarterpost-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SkillBarterPost.objects.count(), 2)

        response = self.client.get(reverse('skillbarterpost-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)

    def test_make_skill_barter_offer(self):
        data = {
            "post": self.skill_barter_post.pk,
            "message": "I can help with graphic design!"
        }
        response = self.employer_client.post(reverse('skillbarteroffer-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SkillBarterOffer.objects.count(), 1)

    # Commission and Excuse Tests
    def test_submit_commission_excuse(self):
        commission_log = CommissionLog.objects.create(
            job=self.job,
            total_amount=100.00,
            commission_amount=20.00,
            freelancer_earning=80.00,
            status='due'
        )
        data = {
            "commission": commission_log.pk,
            "reason": "Medical emergency"
        }
        response = self.freelancer_client.post(reverse('commissionexcuse-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CommissionExcuse.objects.count(), 1)

    def test_list_my_excuses(self):
        commission_log = CommissionLog.objects.create(
            job=self.job,
            total_amount=100.00,
            commission_amount=20.00,
            freelancer_earning=80.00,
            status='due'
        )
        CommissionExcuse.objects.create(user=self.freelancer_user, commission=commission_log, reason="Family matter")
        response = self.freelancer_client.get(reverse('commissionexcuse-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    # Gamification and Loyalty Tests
    def test_xp_gain_and_level_up_and_badges(self):
        # Simulate a completed job to trigger XP gain
        self.job.status = 'completed'
        self.job.save() # This should trigger the XP gain and level up via signals/methods
        self.freelancer_user.refresh_from_db() # Refresh to get updated XP and level

        # Initial XP for freelancer_user is 90 from setup. Adding 100 from completed job.
        # LEVEL_THRESHOLDS is [0, 100, 250, ...]
        # So, 90 + 100 = 190 XP, which should put them at Level 2 (threshold 100)
        
        self.assertEqual(self.freelancer_user.xp_points, 190) 
        self.assertEqual(self.freelancer_user.level, 2)

        # Check if the correct level badge was awarded
        level_badge = Badge.objects.get(name="Hustle Initiate", badge_type="level") # Level 2 badge
        self.assertTrue(UserBadge.objects.filter(user=self.freelancer_user, badge=level_badge).exists())

        # Check if the initial achievement badge is still there
        test_achievement_badge = Badge.objects.get(name="Test Achievement", badge_type="achievement")
        self.assertTrue(UserBadge.objects.filter(user=self.freelancer_user, badge=test_achievement_badge).exists())

    def test_get_gamification_stats(self):
        # Ensure the user has some XP and a level
        self.freelancer_user.xp_points = 200 # Set explicitly for consistent testing
        self.freelancer_user.level = 2
        self.freelancer_user.save()

        response = self.freelancer_client.get(reverse('freelancer-gamification'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['xp'], 200)
        self.assertEqual(response.data['level'], 2)
        self.assertIn('badges', response.data)
        self.assertGreater(len(response.data['badges']), 0)
        # Verify at least one badge by name (e.g., the achievement badge from setup)
        badge_names = [b['badge']['name'] for b in response.data['badges']]
        self.assertIn("Test Achievement", badge_names)

    def test_get_referral_info(self):
        Referral.objects.create(referrer=self.freelancer_user, referred_user=self.employer_user)
        response = self.freelancer_client.get(reverse('referral-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['referrer']['email'], self.freelancer_user.email)

    # Notification Tests
    def test_get_and_update_notification_settings(self):
        url = reverse('notificationsettings-detail', kwargs={'pk': self.freelancer_user.notification_settings.pk})
        response = self.freelancer_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('job_alerts', response.data)

        update_data = {"job_alerts": False}
        response = self.freelancer_client.patch(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.freelancer_user.notification_settings.refresh_from_db()
        self.assertFalse(self.freelancer_user.notification_settings.job_alerts)

    def test_list_notifications_for_user(self):
        # Notifications are typically created via signals or direct calls, 
        # so create one manually for testing.
        from backend.hustlehub.models import Notification
        Notification.objects.create(user=self.freelancer_user, message="You have a new job match!")
        response = self.freelancer_client.get(reverse('notification-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertIn("job match", response.data['results'][0]['message'])

    # Review Tests
    def test_create_and_list_reviews(self):
        # A job application is usually reviewed after completion. Mock this scenario.
        job_completed = Job.objects.create(
            employer=self.employer_user,
            title="Completed Job",
            description="Job to be reviewed.",
            category="Other",
            job_type="local",
            budget=75.00,
            deadline="2024-09-01",
            status='completed'
        )
        JobApplication.objects.create(job=job_completed, freelancer=self.freelancer_user, status='accepted')

        data = {
            "job": job_completed.pk,
            "reviewee": self.freelancer_user.pk, 
            "rating": 4,
            "comment": "Great communication!"
        }
        response = self.employer_client.post(reverse('review-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 1)

        response = self.client.get(reverse('review-list') + f'?reviewee={self.freelancer_user.pk}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)

    # Location Tests
    def test_list_locations(self):
        county = County.objects.create(name="Nairobi")
        sub_county = SubCounty.objects.create(name="Westlands", county=county)
        Ward.objects.create(name="Kitisuru", sub_county=sub_county)

        response = self.client.get(reverse('county-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
        self.assertEqual(response.data['results'][0]['name'], "Nairobi")

        response = self.client.get(reverse('subcounty-list') + f'?county={county.pk}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
        self.assertEqual(response.data['results'][0]['name'], "Westlands")

        response = self.client.get(reverse('ward-list') + f'?sub_county={sub_county.pk}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
        self.assertEqual(response.data['results'][0]['name'], "Kitisuru")

    # About Us Tests
    def test_get_about_us_content(self):
        response = self.client.get(reverse('aboutus-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], self.about_us_content.title)
