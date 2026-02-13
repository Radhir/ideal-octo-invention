# Utility functions for authentication
def format_user_payload(user, tokens):
    from .serializers import UserSerializer
    return {
        'user': UserSerializer(user).data,
        'tokens': tokens
    }
