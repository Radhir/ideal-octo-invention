"""
Custom cache backend that stores in database
"""
from django.core.cache.backends.base import BaseCache
from django.utils import timezone
from datetime import timedelta
import json

class DatabaseCache(BaseCache):
    def __init__(self, location, params):
        super().__init__(params)
        self.location = location
    
    def get_model(self):
        from core.models import CacheEntry
        return CacheEntry
    
    def get(self, key, default=None, version=None):
        key = self.make_key(key, version=version)
        self.validate_key(key)
        
        CacheEntry = self.get_model()
        try:
            entry = CacheEntry.objects.get(key=key)
            if entry.is_expired:
                entry.delete()
                return default
            return json.loads(entry.value)
        except CacheEntry.DoesNotExist:
            return default
    
    def set(self, key, value, timeout=None, version=None):
        key = self.make_key(key, version=version)
        self.validate_key(key)
        
        if timeout is None:
            timeout = self.default_timeout
        
        CacheEntry = self.get_model()
        expires_at = timezone.now() + timedelta(seconds=timeout)
        
        CacheEntry.objects.update_or_create(
            key=key,
            defaults={
                'value': json.dumps(value),
                'expires_at': expires_at
            }
        )
    
    def delete(self, key, version=None):
        key = self.make_key(key, version=version)
        self.validate_key(key)
        
        CacheEntry = self.get_model()
        CacheEntry.objects.filter(key=key).delete()
    
    def clear(self):
        CacheEntry = self.get_model()
        CacheEntry.objects.all().delete()
    
    def has_key(self, key, version=None):
        key = self.make_key(key, version=version)
        self.validate_key(key)
        
        CacheEntry = self.get_model()
        try:
            entry = CacheEntry.objects.get(key=key)
            if entry.is_expired:
                entry.delete()
                return False
            return True
        except CacheEntry.DoesNotExist:
            return False
