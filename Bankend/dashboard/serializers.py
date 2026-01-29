from rest_framework import serializers
from .models import WorkshopDiary, ChatMessage

class WorkshopDiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkshopDiary
        fields = '__all__'

class ChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    receiver_name = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'sender_name', 'receiver', 'receiver_name', 'text', 'is_system', 'created_at']
        read_only_fields = ['sender']

    def get_sender_name(self, obj):
        return obj.sender.get_full_name() or obj.sender.username

    def get_receiver_name(self, obj):
        if obj.receiver:
            return obj.receiver.get_full_name() or obj.receiver.username
        return None
