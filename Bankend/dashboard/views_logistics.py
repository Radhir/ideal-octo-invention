from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from logistics.models import Shipment, Pickup

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_logistics_stats(request):
    """
    Aggregates logistics metrics for the Control Console.
    """
    today = timezone.now().date()
    
    # 1. Active Shipments
    active_shipments = Shipment.objects.filter(
        status__in=['PENDING', 'IN_TRANSIT', 'ARRIVED', 'CUSTOMS']
    ).count()
    
    # 2. Pending Pickups
    pending_pickups = Pickup.objects.filter(status='PENDING').count()
    
    # 3. Deliveries Scheduled Today
    scheduled_deliveries = Shipment.objects.filter(expected_arrival=today).count()
    
    # 4. Fleet Status (Mock for now as Fleet model is pending)
    fleet_status = {
        "available": 2,
        "inUse": 3,
        "maintenance": 1
    }
    
    # 5. Today's Schedule (Recent pickups/shipments)
    recent_pickups = Pickup.objects.filter(pickup_date__date=today).order_by('pickup_date')[:5]
    schedule = []
    for p in recent_pickups:
        schedule.append({
            "id": p.id,
            "type": "PICKUP",
            "customer": p.customer.name,
            "location": p.pickup_location[:20] + "..." if len(p.pickup_location) > 20 else p.pickup_location,
            "time": p.pickup_date.strftime('%I:%M %p'),
            "status": p.status,
            "driver": p.driver.full_name if p.driver else "Unassigned"
        })

    return Response({
        "activeTrips": active_shipments,
        "pendingPickups": pending_pickups,
        "scheduledDeliveries": scheduled_deliveries,
        "fleetStatus": fleet_status,
        "todaysSchedule": schedule
    })
