from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.response import Response

from ..serializers import TypingSessionSerializer

from nltk.corpus import brown
from nltk import FreqDist

from fyp.utils.word_generation import generate_words_for_user

import random

# constants, the default values for the typing tests
WORD_FREQUENCY_RANK = 1000
MIN_WORD_LENGTH_DEFAULT = 3
MAX_WORD_LENGTH_DEFAULT = 5

ALL_WORDS = [w.lower() for w in brown.words() if w.isalpha()] # words from nltk brown library
FREQ_DIST = FreqDist(ALL_WORDS)

TOP_WORDS = [word for word, _ in FREQ_DIST.most_common(WORD_FREQUENCY_RANK)]
FILTERED_WORDS = [word for word in TOP_WORDS if MIN_WORD_LENGTH_DEFAULT <= len(word) <= MAX_WORD_LENGTH_DEFAULT]


# For saving typing sessions
class TypingSessionCreateView(generics.CreateAPIView):
    serializer_class = TypingSessionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class GetWordView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request):
        
        if not request.user.is_authenticated:
            word_batch = generate_words_for_user(None)
        else:
            word_batch = generate_words_for_user(request.user)

        return Response(word_batch)
