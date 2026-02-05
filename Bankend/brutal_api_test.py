import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"
USERNAME = "Radhir"
PASSWORD = "Elite123!"

endpoints = [
    ("/api/auth/profile/", "GET"),
    ("/api/dashboard/navigation/", "GET"),
    ("/api/dashboard/api/stats/", "GET"),
    ("/api/dashboard/api/sales/", "GET"),
    ("/hr/api/employees/", "GET"),
    ("/hr/api/departments/", "GET"),
    ("/hr/api/branches/", "GET"),
    ("/hr/api/companies/", "GET"),
    ("/hr/api/teams/", "GET"),
    ("/hr/api/attendance/", "GET"),
    ("/hr/api/payroll/", "GET"),
    ("/hr/api/mistakes/", "GET"),
    ("/forms/job-cards/api/jobs/", "GET"),
    ("/forms/job-cards/api/tasks/", "GET"),
    ("/forms/job-cards/api/service-categories/", "GET"),
    ("/forms/invoices/api/list/", "GET"),
    ("/api/schema/", "GET"),
    ("/api/docs/", "GET"),
]

def run_brutal_test():
    results = []
    session = requests.Session()
    
    print(f"Logging in as {USERNAME}...")
    login_url = f"{BASE_URL}/api/auth/login/"
    login_data = {"username": USERNAME, "password": PASSWORD}
    
    try:
        login_res = session.post(login_url, json=login_data)
        if login_res.status_code == 200:
            token = login_res.json().get("access")
            session.headers.update({"Authorization": f"Bearer {token}"})
            print("Login successful.")
            results.append({"endpoint": "/api/auth/login/", "method": "POST", "status": 200, "message": "Success"})
        else:
            print(f"Login failed: {login_res.status_code} - {login_res.text}")
            results.append({"endpoint": "/api/auth/login/", "method": "POST", "status": login_res.status_code, "message": "Login Failed"})
            return results
    except Exception as e:
        print(f"Login error: {e}")
        results.append({"endpoint": "/api/auth/login/", "method": "POST", "status": "ERROR", "message": str(e)})
        return results

    for endpoint, method in endpoints:
        url = f"{BASE_URL}{endpoint}"
        print(f"Testing {method} {endpoint}...")
        try:
            start_time = time.time()
            if method == "GET":
                res = session.get(url)
            else:
                res = session.post(url)
            duration = time.time() - start_time
            
            results.append({
                "endpoint": endpoint,
                "method": method,
                "status": res.status_code,
                "duration": f"{duration:.2f}s",
                "message": "OK" if res.status_code < 400 else f"Error: {res.text[:100]}"
            })
        except Exception as e:
            results.append({
                "endpoint": endpoint,
                "method": method,
                "status": "ERROR",
                "message": str(e)
            })

    return results

def generate_report(results):
    report = "# Brutal API Test Report\n\n"
    report += f"**Timestamp:** {time.strftime('%Y-%m-%d %H:%M:%S')}\n"
    report += f"**Base URL:** {BASE_URL}\n"
    report += f"**User:** {USERNAME}\n\n"
    report += "| Endpoint | Method | Status | Duration | Message |\n"
    report += "|----------|--------|--------|----------|---------|\n"
    for r in results:
        status_md = f"`{r['status']}`"
        if r['status'] == 200 or r['status'] == 201:
            status_md = f"✅ {status_md}"
        elif r['status'] == "ERROR" or (isinstance(r['status'], int) and r['status'] >= 500):
            status_md = f"❌ {status_md}"
        else:
            status_md = f"⚠️ {status_md}"
            
        report += f"| {r['endpoint']} | {r['method']} | {status_md} | {r.get('duration', 'N/A')} | {r['message']} |\n"
    
    with open("api_test_results.md", "w", encoding='utf-8') as f:
        f.write(report)
    print("Report generated: api_test_results.md")

if __name__ == "__main__":
    import sys
    # Ensure stdout handles utf-8 if possible
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    
    test_results = run_brutal_test()
    generate_report(test_results)
