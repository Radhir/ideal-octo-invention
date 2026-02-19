import requests
import json
import sys

# Disable warning for self-signed certs for testing if needed
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

url = "https://srv1306978.hstgr.cloud/api/auth/login/"
username = "ravit"
password = "adhirHAS@123"

print(f"--- External API Test: {url} ---")

payload = {
    "username": username,
    "password": password
}

try:
    response = requests.post(url, json=payload, verify=False, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    try:
        print(f"Response Body: {response.json()}")
        tokens = response.json()
        if 'access' in tokens:
            print("Login Success! Received access token.")
            # Test profile fetch
            profile_url = "https://srv1306978.hstgr.cloud/api/auth/profile/"
            auth_headers = {"Authorization": f"Bearer {tokens['access']}"}
            p_res = requests.get(profile_url, headers=auth_headers, verify=False, timeout=10)
            print(f"Profile Status: {p_res.status_code}")
            print(f"Profile Data: {p_res.text[:500]}")
    except:
        print(f"Response Body (raw): {response.text[:1000]}")
except Exception as e:
    print(f"Request failed: {e}")

print("--- End of External API Test ---")
