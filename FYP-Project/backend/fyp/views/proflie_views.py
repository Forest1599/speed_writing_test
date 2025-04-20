from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from fyp.models import TypingSession
from django.db.models import Avg, Max, Count

class ProfileStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        sessions = TypingSession.objects.filter(user=user)

        def aggregate_stats(qs):
            count = qs.count()
            if count == 0:
                return {
                    "average_wpm": 0,
                    "average_accuracy": 0,
                    "highest_wpm": 0,
                    "total_sessions": 0,
                }

            return {
                "average_wpm": round(qs.aggregate(Avg('wpm'))['wpm__avg'], 2),
                "average_accuracy": round(qs.aggregate(Avg('accuracy'))['accuracy__avg'], 2),
                "highest_wpm": qs.aggregate(Max('wpm'))['wpm__max'],
                "total_sessions": count,
            }

        all_stats = aggregate_stats(sessions)
        random_stats = aggregate_stats(sessions.filter(mode="random"))
        adaptive_stats = aggregate_stats(sessions.filter(mode="adaptive"))

        # 30 recent adaptive sessions
        adaptive_sessions = TypingSession.objects.filter(user=user, mode="adaptive")\
            .order_by('-timestamp')[:30].values('timestamp', 'wpm')
        adaptive_wpm_history = [
            {
                'date': session['timestamp'].strftime('%Y-%m-%d'),
                'wpm': session['wpm']
            } for session in list(adaptive_sessions)[::-1]
        ]

        # 30 recent random sessions
        random_sessions = TypingSession.objects.filter(user=user, mode="random")\
            .order_by('-timestamp')[:30].values('timestamp', 'wpm')
        random_wpm_history = [
            {
                'date': session['timestamp'].strftime('%Y-%m-%d'),
                'wpm': session['wpm']
            } for session in list(random_sessions)[::-1]
        ]
        
        print(adaptive_wpm_history)

        return Response({
            "username": user.username,
            "joined": user.date_joined.strftime('%Y-%m-%d'),
            "overall": all_stats,
            "random": random_stats,
            "adaptive": adaptive_stats,
            "adaptive_wpm_history": adaptive_wpm_history,
            "random_wpm_history": random_wpm_history
        })