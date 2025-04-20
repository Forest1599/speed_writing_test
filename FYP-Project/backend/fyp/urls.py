from django.urls import path
from fyp.views.typing_session_views import GetWordView, TypingSessionCreateView
from fyp.views.proflie_views import ProfileStatsView

urlpatterns = [
    path("words/", GetWordView.as_view(), name="get_words"),
    path("typing-sessions/", TypingSessionCreateView.as_view(), name="typing_session_create"),
    path("stats/", ProfileStatsView.as_view(), name="profile_stats")
]