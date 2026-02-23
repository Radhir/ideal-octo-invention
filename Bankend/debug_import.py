import sys
import os

try:
    print("Trying to import stock.views...")
    import stock.views
    print("Successfully imported stock.views")
except ModuleNotFoundError as e:
    print(f"ModuleNotFoundError: {e}")
    import traceback
    traceback.print_exc()
except Exception as e:
    print(f"An error occurred: {e}")
    import traceback
    traceback.print_exc()
