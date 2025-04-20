from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from fyp.models import TypingSession
from datetime import datetime, timedelta

class ProfileStatsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="tester", password="TestPass123!")
        self.profile_stats_url = reverse("profile_stats")

    def test_profile_stats_no_sessions(self):
        """Test profile stats when user has no typing sessions."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.profile_stats_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["overall"]["total_sessions"], 0)
        self.assertEqual(response.data["random"]["total_sessions"], 0)
        self.assertEqual(response.data["adaptive"]["total_sessions"], 0)
        self.assertEqual(response.data["adaptive_wpm_history"], [])
        self.assertEqual(response.data["random_wpm_history"], [])

    def test_profile_stats_with_sessions(self):
        """Test stats and chart data with mixed random and adaptive sessions."""
        self.client.force_authenticate(user=self.user)

        # Create random sessions
        for i in range(3):
            TypingSession.objects.create(
                user=self.user,
                wpm=50 + i,
                accuracy=95 - i,
                min_word_length=4,
                max_word_length=6,
                frequency_rank=1000,
                mode="random",
                timestamp=datetime.now() - timedelta(days=i)
            )

        # Create adaptive sessions
        for i in range(3):
            TypingSession.objects.create(
                user=self.user,
                wpm=60 + i,
                accuracy=90 - i,
                min_word_length=5,
                max_word_length=7,
                frequency_rank=1500,
                mode="adaptive",
                timestamp=datetime.now() - timedelta(days=i+3)
            )

        response = self.client.get(self.profile_stats_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["overall"]["total_sessions"], 6)
        self.assertEqual(response.data["random"]["total_sessions"], 3)
        self.assertEqual(response.data["adaptive"]["total_sessions"], 3)
        self.assertEqual(len(response.data["random_wpm_history"]), 3)
        self.assertEqual(len(response.data["adaptive_wpm_history"]), 3)
        self.assertIn("username", response.data)
        self.assertIn("joined", response.data)