
import json
from decimal import Decimal
from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone

from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from model_bakery import baker

from hustlehub.models import (
    Job, JobApplication, CommissionLog, XPLog, LoyaltyPointLog, Referral, Badge, 
    UserBadge, NotificationSettings, County, SubCounty, Ward, NeighborhoodTag,
    CommissionExcuse, SkillBarterPost, SkillBarterOffer, Notification, Review, AboutUs,
    PortfolioItem, SkillBarterApplication
)

User = get_user_model()

class ComprehensiveAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.password = 'strong-test-password123'

        self.employer_user = baker.make(User, email='employer@example.com', username='employeruser', full_name='Test Employer', role='employer')
        self.employer_user.set_password(self.password)
        self.employer_user.save()
        
        self.freelancer_user = baker.make(User, email='freelancer@example.com', username='freelanceruser', full_name='Test Freelancer', role='freelancer')
        self.freelancer_user.set_password(self.password)
        self.freelancer_user.save()

        self.job = baker.make(Job, employer=self.employer_user, title='Test Job', budget=1000)
        self.employer_token = self.get_user_token(self.employer_user.email, self.password)
        self.freelancer_token = self.get_user_token(self.freelancer_user.email, self.password)

    def get_user_token(self, email, password):
        response = self.client.post(reverse('login'), {'email': email, 'password': password})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response.data['access']

    def authenticate_as(self, user_type):
        if user_type == 'employer':
            self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.employer_token}')
        elif user_type == 'freelancer':
            self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.freelancer_token}')
        else:
            self.client.credentials()

    def test_create_barter_post(self):
        self.authenticate_as('freelancer')
        url = reverse('skillbarterpost-list')
        data = {
            'title': 'I will design your logo for a website',
            'description': 'I am a graphic designer and I need a website.',
            'skills_offered': ['logo-design', 'photoshop'],
            'skills_wanted': ['web-development', 'django']
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_fetch_all_barter_posts(self):
        baker.make(SkillBarterPost, _quantity=5)
        url = reverse('skillbarterpost-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 5)

    def test_update_barter_post(self):
        self.authenticate_as('freelancer')
        post = baker.make(SkillBarterPost, user=self.freelancer_user, title='Old Title')
        url = reverse('skillbarterpost-detail', kwargs={'pk': post.pk})
        data = {'title': 'New Title'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'New Title')

    def test_delete_barter_post(self):
        self.authenticate_as('freelancer')
        post = baker.make(SkillBarterPost, user=self.freelancer_user)
        url = reverse('skillbarterpost-detail', kwargs={'pk': post.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_make_offer_on_barter_post(self):
        self.authenticate_as('employer')
        post = baker.make(SkillBarterPost, user=self.freelancer_user)
        url = reverse('skillbarteroffer-list')
        data = {'post': post.pk, 'message': 'I can build your website.'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_fetch_received_applications(self):
        self.authenticate_as('freelancer')
        post = baker.make(SkillBarterPost, user=self.freelancer_user)
        baker.make(SkillBarterApplication, post=post, applicant=self.employer_user)
        url = reverse('received-barter-applications')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_fetch_sent_offers(self):
        self.authenticate_as('employer')
        post = baker.make(SkillBarterPost, user=self.freelancer_user)
        baker.make(SkillBarterOffer, post=post, offered_by=self.employer_user)
        url = reverse('sent-barter-offers')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_accept_reject_application(self):
        self.authenticate_as('freelancer')
        post = baker.make(SkillBarterPost, user=self.freelancer_user)
        application = baker.make(SkillBarterApplication, post=post, applicant=self.employer_user)
        url = reverse('update-barter-application-status', kwargs={'pk': application.pk})
        data = {'status': 'accepted'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'accepted')

    def test_cancel_offer(self):
        self.authenticate_as('employer')
        post = baker.make(SkillBarterPost, user=self.freelancer_user)
        offer = baker.make(SkillBarterOffer, post=post, offered_by=self.employer_user)
        url = reverse('cancel-barter-offer', kwargs={'pk': offer.pk})
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'cancelled')

    def test_create_portfolio_item(self):
        self.authenticate_as('freelancer')
        url = reverse('portfolio-list')
        data = {'title': 'My Awesome Project', 'description': 'A project I am proud of.', 'item_type': 'document'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_fetch_portfolio(self):
        self.authenticate_as('freelancer')
        baker.make(PortfolioItem, user=self.freelancer_user, _quantity=3)
        url = reverse('portfolio-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 3)

    def test_update_portfolio_item(self):
        self.authenticate_as('freelancer')
        item = baker.make(PortfolioItem, user=self.freelancer_user, title='Old Title')
        url = reverse('portfolio-detail', kwargs={'pk': item.pk})
        data = {'title': 'New Title'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'New Title')

    def test_delete_portfolio_item(self):
        self.authenticate_as('freelancer')
        item = baker.make(PortfolioItem, user=self.freelancer_user)
        url = reverse('portfolio-detail', kwargs={'pk': item.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_fetch_recent_jobs_employer(self):
        self.authenticate_as('employer')
        baker.make(Job, employer=self.employer_user, _quantity=5)
        url = reverse('my-jobs')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 6) # Includes the one from setUp

    def test_fetch_commission_logs_employer(self):
        self.authenticate_as('employer')
        job = baker.make(Job, employer=self.employer_user, budget=2000)
        baker.make(CommissionLog, job=job, total_amount=job.budget)
        url = reverse('commissionlog-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_submit_review_with_proof(self):
        self.authenticate_as('employer')
        url = reverse('review-list')
        data = {
            'job': self.job.pk,
            'reviewee': self.freelancer_user.pk,
            'rating': 5,
            'comment': 'Great work!',
            'proof_image': 'http://example.com/proof.jpg'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['rating'], 5)

    def test_xp_tracking_and_level_up(self):
        self.authenticate_as('employer')
        self.employer_user.add_xp(110)
        self.assertEqual(self.employer_user.xp_points, 110)
        self.assertEqual(self.employer_user.level, 2)

    def test_leaderboard(self):
        baker.make(User, xp_points=500, role='freelancer')
        baker.make(User, xp_points=300, role='employer')
        url = reverse('leaderboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 4) # Includes users from setUp
        self.assertEqual(response.data['results'][0]['xp_points'], 500)

    def test_achievements_badges(self):
        self.authenticate_as('employer')
        url = reverse('job-list')
        data = {
            'title': 'First Job',
            'description': 'This is the first job.',
            'category': 'Other',
            'job_type': 'remote',
            'budget': '500.00'
        }
        self.client.post(url, data, format='json')
        self.assertTrue(UserBadge.objects.filter(user=self.employer_user, badge__name='First Job Posted').exists())
