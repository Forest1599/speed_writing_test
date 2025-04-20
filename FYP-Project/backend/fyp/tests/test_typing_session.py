from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse

class TypingSessionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='sessionuser', password='StrongPass123!')
        self.access_token = str(RefreshToken.for_user(self.user).access_token)
        self.create_url = reverse('typing_session_create')

    def test_create_typing_session_success(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        
        data = {
            "wpm": 65,
            "accuracy": 94,
            "min_word_length": 4,
            "max_word_length": 6,
            "frequency_rank": 1000,
            "mode": "random",
            "word_performances": []
        }

        response = self.client.post(self.create_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_typing_session_unauthenticated(self):
        response = self.client.post(self.create_url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_typing_session_invalid_payload(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        data = {
            "wpm": "fast",  # Invalid value (should be int/float)
            "accuracy": -10  # Invalid range
        }

        response = self.client.post(self.create_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)