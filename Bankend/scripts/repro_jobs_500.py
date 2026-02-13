
import requests

BASE_URL = "http://127.0.0.1:8000"

def test_jobs():
    # Login
    login_response = requests.post(f"{BASE_URL}/api/auth/login/", json={
        "username": "radhir", "password": "Elite123!"
    })
    
    if login_response.status_code != 200:
        print(f"Login failed: {login_response.text}")
        return
    
    access_token = login_response.json().get("access")
    headers = {"Authorization": f"Bearer {access_token}"}
    
    print("Fetching jobs...")
    response = requests.get(f"{BASE_URL}/forms/job-cards/api/jobs/", headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code != 200:
        print(f"Error Body: {response.text[:1000]}")
    else:
        print("Success!")

if __name__ == "__main__":
    test_jobs()
