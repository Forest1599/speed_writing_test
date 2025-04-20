from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from django.contrib.auth.models import User
from ..serializers import UserSerializer

# Handles new user creation
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()

    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class DeleteAccountView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request) -> Response:
        user = request.user
        user.delete()

        return Response({"message": "Account deleted successfully"}, status=204)
