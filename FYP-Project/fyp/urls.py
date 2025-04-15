from django.urls import path
from fyp.views.typing_session_views import GetWordView, TypingSessionCreateView


urlpatterns = [
    path("words/", GetWordView.as_view(), name="get_words"),
    path("typing-sessions/", TypingSessionCreateView.as_view(), name="typing-session-create")
]