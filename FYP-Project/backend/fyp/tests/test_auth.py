from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


class AuthenticationTests(APITestCase):

    def setUp(self):
        # Matches your registered routes
        self.register_url = reverse('register')  # /api/user/register/
        self.login_url = reverse('get_token')    # /api/token/
        self.refresh_url = reverse('refresh')    # /api/token/refresh/

        # Protected endpoint for testing (you can use stats for now)
        self.protected_url = reverse('profile_stats')  # /api/stats/

        self.user_data = {
            "username": "testuser",
            "password": "StrongPass123!"
        }

    # User registration with valid input
    def test_register_valid_user(self):
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="testuser").exists())

    # User registration with duplicate username
    def test_register_duplicate_user(self):
        User.objects.create_user(**self.user_data)
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)

    # User registration with weak password
    def test_register_weak_password(self):
        response = self.client.post(self.register_url, {
            "username": "weakuser",
            "password": "123"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    # User login with correct credentials
    def test_login_valid_credentials(self):
        User.objects.create_user(**self.user_data)
        response = self.client.post(self.login_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    # Login fails with wrong credentials
    def test_login_invalid_credentials(self):
        response = self.client.post(self.login_url, {
            "username": "wronguser",
            "password": "wrongpass"
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # Login fails with missing fields
    def test_login_missing_fields(self):
        response = self.client.post(self.login_url, {
            "username": "testuser"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Token refresh works with valid token
    def test_refresh_token_valid(self):
        user = User.objects.create_user(**self.user_data)
        refresh = RefreshToken.for_user(user)
        response = self.client.post(self.refresh_url, {"refresh": str(refresh)})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    # Token refresh fails with invalid token
    def test_refresh_token_invalid(self):
        response = self.client.post(self.refresh_url, {"refresh": "invalid.token.value"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # Access to protected resource with valid token
    def test_access_protected_with_valid_token(self):
        user = User.objects.create_user(**self.user_data)
        access_token = str(RefreshToken.for_user(user).access_token)
        response = self.client.get(self.protected_url, HTTP_AUTHORIZATION=f"Bearer {access_token}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Access to protected resource without token
    def test_access_protected_without_token(self):
        response = self.client.get(self.protected_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # Access to protected resource with invalid token
    def test_access_protected_with_invalid_token(self):
        response = self.client.get(self.protected_url, HTTP_AUTHORIZATION="Bearer faketoken")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # Delete account with valid token
    def test_delete_account_authenticated(self):
        user = User.objects.create_user(**self.user_data)
        access_token = str(RefreshToken.for_user(user).access_token)

        response = self.client.delete(
            reverse("delete_account"),
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(username=self.user_data["username"]).exists())

    # Delete account without token
    def test_delete_account_unauthenticated(self):
        response = self.client.delete(reverse("delete_account"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # Delete account with invalid token
    def test_delete_account_invalid_token(self):
        response = self.client.delete(
            reverse("delete_account"),
            HTTP_AUTHORIZATION="Bearer invalid.token"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)