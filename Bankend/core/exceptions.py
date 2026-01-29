from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # Now add the HTTP status code to the response.
    if response is not None:
        response.data['status_code'] = response.status_code
        # Add client IP for security auditing
        request = context.get('request')
        if request:
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            ip = x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')
            response.data['ip'] = ip
    else:
        # Handle 500 errors that DRF missed
        from django.conf import settings
        logger.error(f"Global Error: {str(exc)}", exc_info=True)
        response = Response({
            'error': 'Internal Server Error',
            'detail': str(exc) if settings.DEBUG else 'An unexpected error occurred.',
            'code': 'INTERNAL_ERROR'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
