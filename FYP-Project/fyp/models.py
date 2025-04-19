from django.db import models
from django.contrib.auth.models import User


# Typing statistics for individual sessions
class TypingSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="typing_sessions")
    wpm = models.IntegerField(default=0)
    accuracy = models.FloatField(default=0.0)

    # The settings of the previous session
    min_word_length = models.IntegerField(default=3)
    max_word_length = models.IntegerField(default=8)
    frequency_rank = models.IntegerField(default=500)
    
    timestamp = models.DateTimeField(auto_now_add=True)
    mode = models.CharField(max_length=10, default="random")
    
    # Default string implementation
    def __str__(self,) -> str:
        return f"{self.user.username} - {self.wpm} WPM"
    

# Word performance linked to a session
class WordPerformance(models.Model):
    session = models.ForeignKey(TypingSession, on_delete=models.CASCADE, related_name="word_performances")
    target_word = models.CharField(max_length=100)
    typed_word = models.CharField(max_length=100)
    
    is_correct = models.BooleanField(default=False)
    backspace_count = models.IntegerField(default=0)

    def __str__(self) -> str:
        return f"{self.word} - {'Correct' if self.is_correct else 'Incorrect'}"

    