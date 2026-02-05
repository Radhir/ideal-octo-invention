import requests
import json

def test_http_login():
    url = "http://127.0.0.1:8000/api/auth/login/"
    data = {
        "username": "radhir",
        "password": "Elite123!"
    }
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        print(f"Body: {response.text}")
    except Exception as e:
        print(f"Rquest failed: {e}")

if __name__ == "__main__":
    test_http_login()
