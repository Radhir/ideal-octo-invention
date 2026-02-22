import requests
import json

def test_logins():
    url = "http://localhost:8001/api/auth/login/"
    usernames = ['ankit', 'suraj.upadhya', 'anish', 'tamer', 'tariq.abdullah']
    password = 'EliteShine2025!'
    
    print("="*60)
    print("API LOGIN TEST (localhost:8001)")
    print("="*60)
    
    for u in usernames:
        print(f"\nUser: {u}")
        try:
            response = requests.post(url, json={
                'username': u,
                'password': password
            })
            print(f"  - Status: {response.status_code}")
            if response.status_code == 200:
                print(f"  - Result: SUCCESS")
                # Try profile fetch
                tokens = response.json()
                headers = {'Authorization': f"Bearer {tokens['access']}"}
                profile_res = requests.get("http://localhost:8001/api/auth/profile/", headers=headers)
                print(f"  - Profile Status: {profile_res.status_code}")
                if profile_res.status_code != 200:
                    print(f"  - Profile Error: {profile_res.text}")
            else:
                print(f"  - Result: FAILED")
                print(f"  - Error: {response.text}")
        except Exception as e:
            print(f"  - Connection Error: {e}")

    print("\n" + "="*60)

if __name__ == '__main__':
    test_logins()
