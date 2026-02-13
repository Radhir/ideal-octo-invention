from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.core.mail import send_mail
from .serializers import UserSerializer
from .models import UserProfile

class AuthService:
    @staticmethod
    def get_tokens_for_user(user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    @staticmethod
    def authenticate_user(username, password):
        user = authenticate(username=username, password=password)
        if user and user.is_active:
            return user
        return None

    @staticmethod
    def register_user(serializer_data):
        serializer = UserSerializer(data=serializer_data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False
            user.save()
            
            profile = user.profile
            verify_url = f"{settings.FRONTEND_URL}/verify-email/{profile.verification_token}/"
            
            try:
                send_mail(
                    subject='Elite Shine ERP – Verify your email',
                    message=f'Welcome to Elite Shine! Click the link below to activate your account:\n\n{verify_url}',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
                return True, serializer.data, None
            except Exception as e:
                return True, serializer.data, str(e)
        return False, None, serializer.errors

    @staticmethod
    def verify_email(token):
        try:
            profile = UserProfile.objects.get(verification_token=token, email_verified=False)
            if not profile.is_token_valid():
                return False, 'Verification link expired.'
            
            profile.email_verified = True
            profile.save()
            profile.user.is_active = True
            profile.user.save()
            return True, 'Email verified successfully.'
        except UserProfile.DoesNotExist:
            return False, 'Invalid verification token.'
