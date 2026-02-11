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

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False  # Deactivate until verified
            user.save()
            
            profile = user.profile
            verify_url = f"{settings.FRONTEND_URL}/verify-email/{profile.verification_token}/"
            
            try:
                send_mail(
                    subject='Elite Shine ERP – Verify your email',
                    message=f'Welcome to Elite Shine! Click the link below to activate your account:\n\n{verify_url}\n\nThis link will expire in 24 hours.',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
                return Response({
                    'detail': 'Registration successful. Please check your email for verification link.',
                    'user': serializer.data
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                # Log error but user is created (though inactive)
                return Response({
                    'detail': 'User created but failed to send verification email. Please contact support.',
                    'error': str(e)
                }, status=status.HTTP_201_CREATED)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            profile = UserProfile.objects.get(verification_token=token, email_verified=False)
            if not profile.is_token_valid():
                return Response({'error': 'Verification link expired.'}, status=status.HTTP_400_BAD_REQUEST)
            
            profile.email_verified = True
            profile.save()
            
            profile.user.is_active = True
            profile.user.save()
            
            return Response({'detail': 'Email verified successfully. You may now log in.'})
        except UserProfile.DoesNotExist:
            return Response({'error': 'Invalid verification token.'}, status=status.HTTP_404_NOT_FOUND)

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
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)

class UserListView(APIView):
    def get(self, request):
        users = User.objects.all().order_by('username')
        serializer = UserSerializer(users, many=True, context={'request': request})
        return Response(serializer.data)

from django.contrib.auth import logout
from django.shortcuts import redirect

def logout_view(request):
    logout(request)
    return redirect('home')
