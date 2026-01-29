"""
Middleware for comprehensive error handling and logging
"""
import json
import traceback
from django.utils import timezone
from django.http import JsonResponse
from core.models import ErrorLog


class ErrorHandlingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
            return response
        except Exception as e:
            # Log the error
            self.log_error(request, e)
            
            # Return user-friendly error response
            user = getattr(request, 'user', None)
            show_detail = user and getattr(user, 'is_staff', False)
            return JsonResponse({
                'error': 'An unexpected error occurred',
                'message': str(e) if show_detail else 'Please contact support',
                'timestamp': timezone.now().isoformat()
            }, status=500)
    
    def log_error(self, request, exception):
        """Log error to database"""
        try:
            # Determine severity
            severity = 'ERROR'
            if isinstance(exception, (ValueError, TypeError)):
                severity = 'WARNING'
            
            # Get request data safely
            request_data = ''
            try:
                if request.method == 'POST':
                    request_data = json.dumps(dict(request.POST))
            except:
                request_data = 'Unable to serialize request data'
            
            # Create error log
            ErrorLog.objects.create(
                severity=severity,
                error_type=type(exception).__name__,
                error_message=str(exception),
                stack_trace=traceback.format_exc(),
                endpoint=request.path,
                method=request.method,
                user=request.user if request.user.is_authenticated else None,
                ip_address=self.get_client_ip(request),
                request_data=request_data,
                user_agent=request.META.get('HTTP_USER_AGENT', '')[:500]
            )
        except Exception as log_error:
            # If logging fails, at least print it
            print(f"Failed to log error: {log_error}")
    
    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class APIExceptionMiddleware:
    """Catch and format API-specific exceptions"""
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Add custom headers for API responses
        if request.path.startswith('/api/'):
            response['X-Content-Type-Options'] = 'nosniff'
            response['X-Frame-Options'] = 'DENY'
        
        return response
    
    def process_exception(self, request, exception):
        """Handle API exceptions"""
        if not request.path.startswith('/api/'):
            return None
        
        # Log to database
        ErrorLog.objects.create(
            severity='ERROR',
            error_type=type(exception).__name__,
            error_message=str(exception),
            stack_trace=traceback.format_exc(),
            endpoint=request.path,
            method=request.method,
            user=request.user if request.user.is_authenticated else None
        )
        
        return JsonResponse({
            'success': False,
            'error': {
                'type': type(exception).__name__,
                'message': str(exception)
            }
        }, status=500)
