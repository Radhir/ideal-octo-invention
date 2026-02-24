import requests
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BASE_URL = "https://srv1306978.hstgr.cloud"

def test_workflow():
    session = requests.Session()
    session.verify = False 
    
    print("\n--- 1. Testing Login ---")
    resp = session.post(f"{BASE_URL}/api/auth/login/", json={"username": "radhir", "password": "radhir123"})
    if resp.status_code != 200:
        print(f"Login Failed: {resp.status_code} - {resp.text}")
        return
    
    tokens = resp.json()
    access = tokens.get('access')
    print("Login Success! Token received.")
    
    headers = {"Authorization": f"Bearer {access}"}
    
    print("\n--- 2. Fetching Profile ---")
    resp = session.get(f"{BASE_URL}/api/auth/profile/", headers=headers)
    print(f"Profile Status: {resp.status_code}")
    if resp.status_code == 200:
        data = resp.json()
        print(f"User: {data.get('username')}, Employee Profile Linked: {'hr_profile' in data and data['hr_profile'] is not None}")
    else:
        print(resp.text)
        
    print("\n--- 3. Testing Punch In ---")
    resp = session.post(f"{BASE_URL}/api/hr/attendance/clock_in/", headers=headers)
    if resp.status_code == 404:
        resp = session.post(f"{BASE_URL}/hr/api/attendance/clock_in/", headers=headers)
    print(f"Punch In Status: {resp.status_code} - {resp.text[:100]}")
    
    print("\n--- 4. Testing Customers List ---")
    resp = session.get(f"{BASE_URL}/api/customers/", headers=headers)
    if resp.status_code == 404:
         resp = session.get(f"{BASE_URL}/customers/api/list/", headers=headers)
    print(f"Customers Status: {resp.status_code}")
    
    print("\n--- 5. Testing Vehicle Registry (Master) ---")
    resp = session.get(f"{BASE_URL}/api/masters/vehicles/", headers=headers)
    if resp.status_code == 200:
         print(f"Vehicle Registry Status: 200 OK")
    else:
         print(f"Vehicle Registry Status: {resp.status_code} - {resp.text[:100]}")

    print("\n--- 6. Testing Services (Master) ---")
    resp = session.get(f"{BASE_URL}/api/masters/services/", headers=headers)
    if resp.status_code == 200:
         print(f"Services Status: 200 OK")
    else:
         print(f"Services Status: {resp.status_code} - {resp.text[:100]}")
         
    print("\n=== Workflow Automated Backend Verification Complete ===")

if __name__ == "__main__":
    test_workflow()
