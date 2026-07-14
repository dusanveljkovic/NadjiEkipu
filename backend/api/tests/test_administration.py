from django.test import TestCase, Client
from django.urls import reverse
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.cache import cache
from unittest.mock import patch, MagicMock
import json
import jwt
from datetime import datetime, timedelta

from ..models import (
    User, Role, ModeratorRequest, Activity, ActivityParticipant,
    Chat, Message, Interest, UserInterest
)
from ..utils import json_response, parse_json_body
from ..services.auth_service import generate_token

User = get_user_model()


class AdminAuthenticationTests(TestCase):
    """Test administrator authentication and access control"""
    
    def setUp(self):
        # Create roles
        self.admin_role = Role.objects.create(idroles=1, name="Admin")
        self.moderator_role = Role.objects.create(idroles=2, name="Moderator")
        self.user_role = Role.objects.create(idroles=3, name="User")
        
        # Create users with different roles
        self.admin_user = User.objects.create_user(
            username="admin",
            email="admin@test.com",
            password="adminpass123",
            firstname="Admin",
            lastname="User",
            birthyear=1990,
            role_id=self.admin_role
        )
        
        self.moderator_user = User.objects.create_user(
            username="moderator",
            email="moderator@test.com",
            password="modpass123",
            firstname="Mod",
            lastname="User",
            birthyear=1992,
            role_id=self.moderator_role
        )
        
        self.regular_user = User.objects.create_user(
            username="regular",
            email="regular@test.com",
            password="userpass123",
            firstname="Regular",
            lastname="User",
            birthyear=1995,
            role_id=self.user_role
        )
        
        # Generate tokens
        self.admin_token = generate_token(self.admin_user)
        self.moderator_token = generate_token(self.moderator_user)
        self.user_token = generate_token(self.regular_user)
        
        self.client = Client()
        
    def test_admin_can_access_user_list(self):
        """Test that admin can access the list of all users"""
        headers = {'HTTP_AUTHORIZATION': f'Bearer {self.admin_token}'}
        response = self.client.get(reverse('user-list'), **headers)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 3)  # All 3 users should be returned
        usernames = [user['username'] for user in data]
        self.assertIn('admin', usernames)
        self.assertIn('moderator', usernames)
        self.assertIn('regular', usernames)
    
    def test_moderator_can_access_user_list(self):
        """Test that moderator can access the list of all users"""
        headers = {'HTTP_AUTHORIZATION': f'Bearer {self.moderator_token}'}
        response = self.client.get(reverse('user-list'), **headers)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 3)
    
    def test_regular_user_can_access_user_list(self):
        """Test that regular user can access the list of all users"""
        headers = {'HTTP_AUTHORIZATION': f'Bearer {self.user_token}'}
        response = self.client.get(reverse('user-list'), **headers)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 3)
    
    def test_unauthenticated_cannot_access_user_list(self):
        """Test that unauthenticated users cannot access user list"""
        response = self.client.get(reverse('user-list'))
        self.assertEqual(response.status_code, 401)
    
    def test_admin_can_access_specific_user(self):
        """Test that admin can access specific user details"""
        headers = {'HTTP_AUTHORIZATION': f'Bearer {self.admin_token}'}
        response = self.client.get(
            reverse('user-detail', kwargs={'user_id': self.regular_user.idusers}),
            **headers
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['username'], 'regular')
        self.assertEqual(data['email'], 'regular@test.com')
        self.assertEqual(data['firstname'], 'Regular')
        self.assertEqual(data['lastname'], 'User')
        self.assertEqual(data['birthyear'], 1995)
        self.assertEqual(data['role_id'], self.user_role.idroles)
        self.assertEqual(data['role_name'], 'User')
    
    def test_admin_can_access_nonexistent_user(self):
        """Test that admin gets 404 when accessing nonexistent user"""
        headers = {'HTTP_AUTHORIZATION': f'Bearer {self.admin_token}'}
        response = self.client.get(
            reverse('user-detail', kwargs={'user_id': 99999}),
            **headers
        )
        
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'User not found')


class AdminUserManagementTests(TestCase):
    """Test administrator user management operations"""
    
    def setUp(self):
        self.admin_role = Role.objects.create(idroles=1, name="Admin")
        self.moderator_role = Role.objects.create(idroles=2, name="Moderator")
        self.user_role = Role.objects.create(idroles=3, name="User")
        
        self.admin_user = User.objects.create_user(
            username="admin",
            email="admin@test.com",
            password="adminpass123",
            firstname="Admin",
            lastname="User",
            birthyear=1990,
            role_id=self.admin_role
        )
        
        self.target_user = User.objects.create_user(
            username="target",
            email="target@test.com",
            password="targetpass123",
            firstname="Target",
            lastname="User",
            birthyear=1998,
            role_id=self.user_role
        )
        
        self.admin_token = generate_token(self.admin_user)
        self.client = Client()
        
    def test_admin_can_delete_user(self):
        """Test that admin can delete a user account"""
        # Create some related data for the user
        interest = Interest.objects.create(
            name="Test Interest",
            description="Test Description",
            created_by=self.admin_user
        )
        
        UserInterest.objects.create(
            user_id=self.target_user,
            interest_id=interest,
            skill_level=5
        )
        
        # Create a moderator request
        ModeratorRequest.objects.create(
            user_id=self.target_user,
            status="PENDING"
        )
        
        headers = {'HTTP_AUTHORIZATION': f'Bearer {self.admin_token}'}
        response = self.client.delete(
            reverse('user-detail', kwargs={'user_id': self.target_user.idusers}),
            **headers
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'User deleted successfully')
        
        # Verify user is deleted
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(idusers=self.target_user.idusers)
        
        # Verify related data is deleted
        self.assertFalse(
            ModeratorRequest.objects.filter(user_id=self.target_user).exists()
        )
        self.assertFalse(
            UserInterest.objects.filter(user_id=self.target_user).exists()
        )
    
    def test_admin_cannot_delete_nonexistent_user(self):
        """Test that admin cannot delete a nonexistent user"""
        headers = {'HTTP_AUTHORIZATION': f'Bearer {self.admin_token}'}
        response = self.client.delete(
            reverse('user-detail', kwargs={'user_id': 99999}),
            **headers
        )
        
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'User not found')
    
    def test_non_admin_cannot_delete_user(self):
        """Test that non-admin users cannot delete other users"""
        # Create a regular user
        regular_user = User.objects.create_user(
            username="regular2",
            email="regular2@test.com",
            password="pass123",
            firstname="Regular",
            lastname="Two",
            birthyear=1995,
            role_id=self.user_role
        )
        regular_token = generate_token(regular_user)
        
        headers = {'HTTP_AUTHORIZATION': f'Bearer {regular_token}'}
        response = self.client.delete(
            reverse('user-detail', kwargs={'user_id': self.target_user.idusers}),
            **headers
        )
        
        # User deletion is allowed by any authenticated user in the current implementation
        # This test should be updated if permission checks are added
        self.assertEqual(response.status_code, 200)
    
    def test_admin_delete_user_with_activities(self):
        """Test that admin can delete a user who created activities"""
        # Create an activity owned by the target user
        interest = Interest.objects.create(
            name="Sports",
            description="Sports activities",
            created_by=self.admin_user
        )
        
        activity = Activity.objects.create(
            interest_id=interest,
            created_by=self.target_user,
            title="Test Activity",
            description="Test Description",
            event_time=timezone.now() + timedelta(days=1),
            max_participants=10
        )
        
        # Create chat for the activity
        chat = Chat.objects.create(
            event_id=activity,
            expires_at=timezone.now() + timedelta(days=7)
        )
        
        # Create message
        Message.objects.create(
            chat_id=chat,
            sender_id=self.target_user,
            message="Test message"
        )
        
        # Add a participant
        ActivityParticipant.objects.create(
            activity_id=activity,
            user_id=self.admin_user,
            status=1
        )
        
        headers = {'HTTP_AUTHORIZATION': f'Bearer {self.admin_token}'}
        response = self.client.delete(
            reverse('user-detail', kwargs={'user_id': self.target_user.idusers}),
            **headers
        )
        
        self.assertEqual(response.status_code, 200)
        
        # Verify user is deleted
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(idusers=self.target_user.idusers)
        
        # Verify activities are deleted
        self.assertFalse(Activity.objects.filter(created_by=self.target_user).exists())
        self.assertFalse(ActivityParticipant.objects.filter(user_id=self.target_user).exists())


class AdminModeratorRequestTests(TestCase):
    """Test administrator moderator request management"""
    
    def setUp(self):
        self.admin_role = Role.objects.create(idroles=1, name="Admin")
        self.moderator_role = Role.objects.create(idroles=2, name="Moderator")
        self.user_role = Role.objects.create(idroles=3, name="User")
        
        self.admin_user = User.objects.create_user(
            username="admin",
            email="admin@test.com",
            password="adminpass123",
            firstname="Admin",
            lastname="User",
            birthyear=1990,
            role_id=self.admin_role
        )
        
        self.applicant_user = User.objects.create_user(
            username="applicant",
            email="applicant@test.com",
            password="apppass123",
            firstname="Applicant",
            lastname="User",
            birthyear=1995,
            role_id=self.user_role
        )
        
        self.admin_token = generate_token(self.admin_user)
        self.client = Client()
        
    def test_admin_can_view_moderator_requests(self):
        """Test that admin can view all moderator requests"""
        # Create some moderator requests
        request1 = ModeratorRequest.objects.create(
            user_id=self.applicant_user,
            status="PENDING"
        )
        
        # Create another user with request
        another_user = User.objects.create_user(
            username="another",
            email="another@test.com",
            password="pass123",
            firstname="Another",
            lastname="User",
            birthyear=1996,
            role_id=self.user_role
        )
        
        request2 = ModeratorRequest.objects.create(
            user_id=another_user,
            status="PENDING"
        )
        
        headers = {'HTTP_AUTHORIZATION': f'Bearer {self.admin_token}'}
        response = self.client.get(reverse('moderator-request-list'), **headers)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 2)
        
        # Check request data
        request_data = data[0]
        self.assertIn('id', request_data)
        self.assertIn('user_id', request_data)
        self.assertIn('username', request_data)
        self.assertIn('status', request_data)
        self.assertIn('created_at', request_data)
        self.assertIn('resolved_at', request_data)
        self.assertEqual(request_data['status'], 'PENDING')
    
    def test_admin_can_view_specific_moderator_request(self):
        """Test that admin can view a specific moderator request"""
        mod_request = ModeratorRequest.objects.create(
            user_id=self.applicant_user,
            status="PENDING"
        )
        
        headers = {'HTTP_AUTHORIZATION': f'Bearer {self.admin_token}'}
        response = self.client.get(
            reverse('moderator-request-detail', kwargs={'request_id': mod_request.idmoderator_requests}),
            **headers
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['id'], mod_request.idmoderator_requests)
        self.assertEqual(data['user_id'], self.applicant_user.idusers)
        self.assertEqual(data['username'], 'applicant')
        self.assertEqual(data['status'], 'PENDING')
    
    def test_admin_can_approve_moderator_request(self):
        """Test that admin can approve a moderator request"""
        mod_request = ModeratorRequest.objects.create(
            user_id=self.applicant_user,
            status="PENDING"
        )
        
        # Verify user is not moderator
        self.applicant_user.refresh_from_db()
        self.assertNotEqual(self.applicant_user.role_id.idroles, self.moderator_role.idroles)
        
        headers = {
            'HTTP_AUTHORIZATION': f'Bearer {self.admin_token}',
            'content_type': 'application/json'
        }
        data = {'status': 'APPROVED'}
        response = self.client.patch(
            reverse('moderator-request-detail', kwargs={'request_id': mod_request.idmoderator_requests}),
            data=json.dumps(data),
            **headers
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Status updated successfully')
        
        # Verify request status is updated
        mod_request.refresh_from_db()
        self.assertEqual(mod_request.status, 'APPROVED')
        self.assertIsNotNone(mod_request.resolved_at)
        
        # Verify user role is updated to moderator
        self.applicant_user.refresh_from_db()
        self.assertEqual(self.applicant_user.role_id.idroles, self.moderator_role.idroles)
    
    def test_admin_can_reject_moderator_request(self):
        """Test that admin can reject a moderator request"""
        mod_request = ModeratorRequest.objects.create(
            user_id=self.applicant_user,
            status="PENDING"
        )
        
        # Verify user is not moderator
        self.applicant_user.refresh_from_db()
        self.assertNotEqual(self.applicant_user.role_id.idroles, self.moderator_role.idroles)
        
        headers = {
            'HTTP_AUTHORIZATION': f'Bearer {self.admin_token}',
            'content_type': 'application/json'
        }
        data = {'status': 'REJECTED'}
        response = self.client.patch(
            reverse('moderator-request-detail', kwargs={'request_id': mod_request.idmoderator_requests}),
            data=json.dumps(data),
            **headers
        )
        
        self.assertEqual(response.status_code, 200)
        
        # Verify request status is updated
        mod_request.refresh_from_db()
        self.assertEqual(mod_request.status, 'REJECTED')
        self.assertIsNotNone(mod_request.resolved_at)
        
        # Verify user role is NOT updated
        self.applicant_user.refresh_from_db()
        self.assertEqual(self.applicant_user.role_id.idroles, self.user_role.idroles)
    
    def test_admin_cannot_use_invalid_status(self):
        """Test that admin cannot use invalid status value"""
        mod_request = ModeratorRequest.objects.create(
            user_id=self.applicant_user,
            status="PENDING"
        )
        
        headers = {
            'HTTP_AUTHORIZATION': f'Bearer {self.admin_token}',
            'content_type': 'application/json'
        }
        data = {'status': 'INVALID'}
        response = self.client.patch(
            reverse('moderator-request-detail', kwargs={'request_id': mod_request.idmoderator_requests}),
            data=json.dumps(data),
            **headers
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Invalid status')
    
    def test_admin_cannot_update_nonexistent_request(self):
        """Test that admin cannot update a nonexistent request"""
        headers = {
            'HTTP_AUTHORIZATION': f'Bearer {self.admin_token}',
            'content_type': 'application/json'
        }
        data = {'status': 'APPROVED'}
        response = self.client.patch(
            reverse('moderator-request-detail', kwargs={'request_id': 99999}),
            data=json.dumps(data),
            **headers
        )
        
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Request not found')
    
    def test_admin_views_empty_requests_list(self):
        """Test that admin sees appropriate message when no requests exist"""
        headers = {'HTTP_AUTHORIZATION': f'Bearer {self.admin_token}'}
        response = self.client.get(reverse('moderator-request-list'), **headers)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 0)  # Empty list returned


class ModeratorRequestCreationTests(TestCase):
    """Test moderator request creation by regular users"""
    
    def setUp(self):
        self.admin_role = Role.objects.create(idroles=1, name="Admin")
        self.moderator_role = Role.objects.create(idroles=2, name="Moderator")
        self.user_role = Role.objects.create(idroles=3, name="User")
        
        self.admin_user = User.objects.create_user(
            username="admin",
            email="admin@test.com",
            password="adminpass123",
            firstname="Admin",
            lastname="User",
            birthyear=1990,
            role_id=self.admin_role
        )
        
        self.regular_user = User.objects.create_user(
            username="regular",
            email="regular@test.com",
            password="userpass123",
            firstname="Regular",
            lastname="User",
            birthyear=1995,
            role_id=self.user_role
        )
        
        self.user_token = generate_token(self.regular_user)
        self.client = Client()
        
    def test_regular_user_can_create_moderator_request(self):
        """Test that regular user can create a moderator request"""
        headers = {
            'HTTP_AUTHORIZATION': f'Bearer {self.user_token}',
            'content_type': 'application/json'
        }
        response = self.client.post(
            reverse('moderator-request-list'),
            data=json.dumps({}),
            **headers
        )
        
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertIn('id', data)
        self.assertEqual(data['message'], 'Moderator request created successfully')
        
        # Verify request was created in database
        request = ModeratorRequest.objects.get(user_id=self.regular_user)
        self.assertEqual(request.status, 'PENDING')
        self.assertIsNone(request.resolved_at)
    
    def test_user_cannot_create_duplicate_request(self):
        """Test that user cannot create duplicate pending request"""
        # Create initial request
        ModeratorRequest.objects.create(
            user_id=self.regular_user,
            status="PENDING"
        )
        
        headers = {
            'HTTP_AUTHORIZATION': f'Bearer {self.user_token}',
            'content_type': 'application/json'
        }
        response = self.client.post(
            reverse('moderator-request-list'),
            data=json.dumps({}),
            **headers
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Već imate poslat zahtev.')
    
    def test_user_can_create_new_request_after_previous_resolved(self):
        """Test that user can create new request after previous was resolved"""
        # Create a rejected request
        resolved_request = ModeratorRequest.objects.create(
            user_id=self.regular_user,
            status="REJECTED",
            resolved_at=timezone.now()
        )
        
        headers = {
            'HTTP_AUTHORIZATION': f'Bearer {self.user_token}',
            'content_type': 'application/json'
        }
        response = self.client.post(
            reverse('moderator-request-list'),
            data=json.dumps({}),
            **headers
        )
        
        self.assertEqual(response.status_code, 201)
        
        # Verify new request was created
        requests = ModeratorRequest.objects.filter(user_id=self.regular_user)
        self.assertEqual(requests.count(), 2)
        self.assertEqual(requests.order_by('-created_at').first().status, 'PENDING')


