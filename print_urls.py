import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.urls import get_resolver

def print_urls(url_patterns, prefix=''):
    for pattern in url_patterns:
        if hasattr(pattern, 'url_patterns'):
            new_prefix = prefix
            if hasattr(pattern, 'pattern'):
                new_prefix += str(pattern.pattern)
            print_urls(pattern.url_patterns, new_prefix)
        else:
            print(prefix + str(pattern.pattern))

resolver = get_resolver()
print_urls(resolver.url_patterns)
