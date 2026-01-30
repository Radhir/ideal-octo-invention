from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.management import call_command
from io import StringIO

class TriggerDailyReportView(APIView):
    """
    API endpoint to manually trigger the daily attendance report.
    Useful for testing or ad-hoc reporting.
    """
    def post(self, request):
        out = StringIO()
        try:
            # Call the management command programmatically
            call_command('send_daily_report', stdout=out)
            output = out.getvalue()
            return Response({'status': 'success', 'output': output}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
