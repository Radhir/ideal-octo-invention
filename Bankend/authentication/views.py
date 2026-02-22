from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.forms import PasswordResetForm
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.throttling import ScopedRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from .models import UserProfile
from .services import AuthService

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        success, data, error = AuthService.register_user(request.data)
        if success:
            detail = 'Registration successful. Please check your email.' if not error else f'User created but: {error}'
            return Response({'detail': detail, 'user': data}, status=status.HTTP_201_CREATED)
        return Response(data or error, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        success, message = AuthService.verify_email(token)
        if success:
            return Response({'detail': message})
        return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'password_reset'

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email required'}, status=status.HTTP_400_BAD_REQUEST)
            
        form = PasswordResetForm({'email': email})
        if form.is_valid():
            form.save(
                request=request,
                use_https=True,
                email_template_name='registration/password_reset_email.html',
                subject_template_name='registration/password_reset_subject.txt'
            )
        # Always return success to prevent enum
        return Response({'detail': 'If an account exists with this email, a reset link has been sent.'})

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        try:
            uid = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Invalid reset link.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({'detail': 'Password reset successful.'})
        
        return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    def get(self, request):
        try:
            # Use prefetch_related for all relationships to be safe (avoids Inner Join issues on reverse relations)
            user = User.objects.prefetch_related(
                'hr_profile',
                'hr_profile__department',
                'hr_profile__company',
                'hr_profile__branch',
                'hr_profile__module_permissions'
            ).get(id=request.user.id)
        except User.DoesNotExist:
            user = request.user

        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)

class UserListView(APIView):
    def get(self, request):
        users = User.objects.all().select_related(
            'hr_profile', 
            'hr_profile__department', 
            'hr_profile__branch', 
            'hr_profile__company'
        ).prefetch_related(
            'hr_profile__module_permissions'
        ).order_by('username')
        serializer = UserSerializer(users, many=True, context={'request': request})
        return Response(serializer.data)

from django.contrib.auth import logout
from django.shortcuts import redirect

def logout_view(request):
    logout(request)
    return redirect('home')
