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


    def get(self, request) -> Response:
        mode = request.query_params.get("mode")

        if mode not in ['random', 'adaptive']:
            return Response({"error": "Invalid mode parameter."}, status=400)

        if mode == 'adaptive':
            if not request.user.is_authenticated:
                return Response({"error": "Authenticaton required for adaptive mode."}, status=403)

                
            # Generates words based on users past experience
            word_batch = generate_words_for_user(request.user)
        else:
            # Random words generated or invalid fallback
            word_batch = generate_words_for_user(None)

        # Adds the mode to the settings
        word_batch["settings"]["mode"] = mode

        return Response(word_batch)