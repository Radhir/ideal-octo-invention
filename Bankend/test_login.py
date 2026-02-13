import requests
import json

def test_login():
    url = "http://localhost:8000/api/auth/login/"
    data = {
        "username": "admin",
        "password": "admin123"
    }
    
    print(f"Testing login at {url}...")
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print("Response Content:")
        print(response.text)
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_login()
