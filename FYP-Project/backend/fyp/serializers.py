from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TypingSession, WordPerformance
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password(self, value):
        validate_password(value)  # Runs django password validation
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class WordPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WordPerformance
        fields = ['target_word', 'typed_word', 'is_correct', 'backspace_count']


class TypingSessionSerializer(serializers.ModelSerializer):
    word_performances = WordPerformanceSerializer(many=True)

    class Meta:
        model = TypingSession
        fields = [
            'wpm', 
            'accuracy',
            'min_word_length',
            'max_word_length',
            'frequency_rank',
            'mode',
            'word_performances',
        ]

    def create(self, validated_data):
        mode = validated_data.get('mode', 'random')  # default to 'random' if not provided
        word_data = validated_data.pop('word_performances', [])

        session = TypingSession.objects.create(**validated_data)

        if mode == 'adaptive':
            for word in word_data:
                WordPerformance.objects.create(session=session, **word)

        return session






