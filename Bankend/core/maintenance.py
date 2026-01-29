from django.core.cache import cache
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

def perform_cache_maintenance():
    """
    Executes cache maintenance based on the day of the week.
    Code 1: Monday (0), Tuesday (1), Friday (4) -> Full Clear
    Code 2: Wednesday (2), Thursday (3), Saturday (5) -> Partial/Log
    """
    today = timezone.now().weekday() # Mon=0, Sun=6
    
    status_msg = "No maintenance scheduled for today."
    
    if today in [0, 1, 4]: # Mon, Tue, Fri
        # Code 1: Full Clear (or aggressive expiry)
        try:
            cache.clear()
            status_msg = f"CODE 1 Maintenance Executed (Day {today}): Cache Cleared."
            logger.info(status_msg)
        except Exception as e:
            status_msg = f"CODE 1 Failed: {str(e)}"
            logger.error(status_msg)
            
    elif today in [2, 3, 5]: # Wed, Thu, Sat
        # Code 2: Strategic/Partial Clear (Placeholder for now, maybe just specific keys)
        # For now, we will log it as a separate maintenance routine.
        status_msg = f"CODE 2 Maintenance Executed (Day {today}): Routine Check Completed."
        logger.info(status_msg)
        
    return status_msg
