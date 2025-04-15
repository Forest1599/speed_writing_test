from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TypingSession, WordPerformance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}} # Password is wrtie only
    
    # Creates a new user
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
            'word_performances'
        ]

    def create(self, validated_data):
        word_data = validated_data.pop('word_performances')

        session = TypingSession.objects.create(**validated_data)

        for word in word_data:
            WordPerformance.objects.create(session=session, **word)

        return session






