from django.test import TestCase
from rest_framework.test import APITestCase
from unittest.mock import MagicMock, patch
from fyp.utils import word_generation
from fyp.models import TypingSession, WordPerformance
from django.contrib.auth.models import User
from datetime import timedelta
from django.utils import timezone
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken

class WordGenerationTests(APITestCase):

    @patch('fyp.utils.word_generation.TypingSession.objects')
    def test_default_difficulty_when_no_sessions(self, mock_sessions):
        mock_sessions.filter.return_value.order_by.return_value.count.return_value = 0
        user = MagicMock()
        min_len, max_len, freq_rank = word_generation.get_typing_difficulty(user)

        self.assertEqual(min_len, word_generation.DEFAULT_MIN_LEN)
        self.assertEqual(max_len, word_generation.DEFAULT_MAX_LEN)
        self.assertEqual(freq_rank, word_generation.DEFAULT_FREQ_RANK)

    def test_filtered_words_respect_bounds(self):
        words = word_generation.get_filtered_words(4, 6, 500)
        self.assertTrue(all(4 <= len(w) <= 6 for w in words))

    def test_get_similar_words(self):
        pool = ['dog', 'dot', 'dig', 'dug', 'log']
        similar = word_generation.get_similar_words('dog', pool)
        self.assertIn('dot', similar)
        self.assertIn('dig', similar)
        self.assertIn('dug', similar)


    def test_difficulty_increases_when_performance_improves(self):
            user = User.objects.create_user(username="tester", password="StrongPass123!")

            # Added for typing session consistent ordering
            now = timezone.now()

            # 3 older sessions (treated as recent)
            # Create the latest session that triggers adaptation
            TypingSession.objects.create(user=user, wpm=60, accuracy=95, mode="adaptive",
                                        min_word_length=3, max_word_length=5, frequency_rank=500, timestamp=now - timedelta(days=4))

            TypingSession.objects.create(user=user, wpm=40, accuracy=90, mode="adaptive",
                                        min_word_length=3, max_word_length=5, frequency_rank=500,
                                        timestamp=now - timedelta(days=1))

            TypingSession.objects.create(user=user, wpm=39, accuracy=89, mode="adaptive",
                                        min_word_length=3, max_word_length=5, frequency_rank=500,
                                        timestamp=now - timedelta(days=3))


            # Should trigger the difficulty increase
            min_len, max_len, freq_rank = word_generation.get_typing_difficulty(user)

            self.assertEqual(min_len, 4)
            self.assertEqual(max_len, 6)
            self.assertEqual(freq_rank, 1000)

    def test_difficulty_decreases_when_performance_declines(self):
            user = User.objects.create_user(username="tester2", password="StrongPass123!")
            now = timezone.now()

            # 3 earlier better sessions (average ~60 WPM, 95% accuracy)

            # Latest session that performs worse (to trigger decrease)
            TypingSession.objects.create(user=user, wpm=45, accuracy=85, mode="adaptive",
                                        min_word_length=4, max_word_length=6, frequency_rank=1000,
                                        timestamp=now - timedelta(days=4))

            TypingSession.objects.create(user=user, wpm=60, accuracy=95, mode="adaptive",
                                        min_word_length=4, max_word_length=6, frequency_rank=1000,
                                        timestamp=now - timedelta(days=1))
            TypingSession.objects.create(user=user, wpm=61, accuracy=94, mode="adaptive",
                                        min_word_length=4, max_word_length=6, frequency_rank=1000,
                                        timestamp=now - timedelta(days=3))

            # Should trigger a difficulty decrease
            min_len, max_len, freq_rank = word_generation.get_typing_difficulty(user)

            self.assertEqual(min_len, 3)
            self.assertEqual(max_len, 5)
            self.assertEqual(freq_rank, 500)

        
    def test_difficulty_remains_same_on_neutral_performance(self):
        user = User.objects.create_user(username="tester3", password="StrongPass123!")
        now = timezone.now()

        TypingSession.objects.create(user=user, wpm=50, accuracy=90, mode="adaptive",
                                    min_word_length=4, max_word_length=6, frequency_rank=1000,
                                    timestamp=now - timedelta(days=4))
        TypingSession.objects.create(user=user, wpm=50, accuracy=90, mode="adaptive",
                                    min_word_length=4, max_word_length=6, frequency_rank=1000,
                                    timestamp=now - timedelta(days=1))
        TypingSession.objects.create(user=user, wpm=49, accuracy=89, mode="adaptive",
                                    min_word_length=4, max_word_length=6, frequency_rank=1000,
                                    timestamp=now - timedelta(days=2))

        min_len, max_len, freq_rank = word_generation.get_typing_difficulty(user)
        self.assertEqual(min_len, 4)
        self.assertEqual(max_len, 6)
        self.assertEqual(freq_rank, 1000)

    def test_get_words_random_mode_success(self):
        url = reverse('get_words') + '?mode=random'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('words', response.data)
        self.assertIn('settings', response.data)
        self.assertEqual(response.data['settings']['mode'], 'random')

    def test_get_words_adaptive_requires_auth(self):
        url = reverse('get_words') + '?mode=adaptive'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)
        self.assertIn('error', response.data)

    def test_get_words_adaptive_authenticated(self):
        # Create the user
        User.objects.create_user(username='user1', password='StrongPass123!')

        # Use the actual login endpoint
        login_url = reverse('get_token')
        login_response = self.client.post(login_url, {
            'username': 'user1',
            'password': 'StrongPass123!'
        })

        self.assertEqual(login_response.status_code, 200)
        access_token = login_response.data['access']

        # Set the JWT access token in the header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        # Now test the adaptive endpoint
        url = reverse('get_words') + '?mode=adaptive'
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertIn('words', response.data)
        self.assertIn('settings', response.data)
        self.assertEqual(response.data['settings']['mode'], 'adaptive')
    
    def test_get_words_invalid_mode_returns_400(self):
        url = reverse('get_words') + '?mode=invalid'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.data)