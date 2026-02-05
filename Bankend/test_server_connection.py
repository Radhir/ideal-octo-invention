import urllib.request
import urllib.error
import json

url = "http://127.0.0.1:8000/api/auth/login/"
data = json.dumps({'username': 'radhir', 'password': 'admin'}).encode('utf-8')
# Mimic frontend headers
headers = {
    'Content-Type': 'application/json',
    'X-Branch-ID': '1',  # Simulating a branch ID
    'Origin': 'http://localhost:5174'
}

req = urllib.request.Request(url, data=data, headers=headers, method='POST')

print(f"Connecting to {url} with X-Branch-ID...")
try:
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.status}")
        print(f"Response: {response.read().decode()}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Error Response: {e.read().decode()}")
except urllib.error.URLError as e:
    print(f"URL Error: {e.reason}")
except Exception as e:
    print(f"General Error: {e}")
