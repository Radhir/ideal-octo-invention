import requests

BASE_URL = "http://localhost:8000"

def complete_system_test():
    print("=" * 70)
    print("🔥 ELITE SHINE ERP - COMPLETE SYSTEM VERIFICATION 🔥")
    print("=" * 70)
    
    # Login
    print("\n🔐 Authenticating...")
    login_response = requests.post(f"{BASE_URL}/api/auth/login/", json={
        "username": "radhir", "password": "Elite123!"
    })
    
    if login_response.status_code != 200:
        print("❌ LOGIN FAILED")
        return
    
    access_token = login_response.json().get("access")
    headers = {"Authorization": f"Bearer {access_token}"}
    print("✅ Authentication successful\n")
    
    # All critical endpoints
    modules = {
        "CORE OPERATIONS": [
            ("Job Cards", "/forms/job-cards/api/jobs/"),
            ("Bookings", "/forms/bookings/api/list/"),
            ("Leads", "/forms/leads/api/list/"),
            ("Invoices", "/forms/invoices/api/list/"),
            ("Operations", "/forms/operations/api/list/"),
        ],
        "HR & PERSONNEL": [
            ("Employees", "/hr/api/employees/"),
            ("Departments", "/hr/api/departments/"),
            ("Roster", "/hr/api/roster/"),
            ("Attendance", "/hr/api/attendance/"),
            ("Leave Apps", "/forms/leaves/api/applications/"),
        ],
        "INVENTORY & STOCK": [
            ("Stock Items", "/forms/stock/api/items/"),
            ("Stock Requests", "/forms/stock/api/requests/"),
            ("Suppliers", "/forms/stock/api/suppliers/"),
        ],
        "FINANCE & ACCOUNTING": [
            ("Accounts", "/finance/api/accounts/"),
            ("Budgets", "/finance/api/budgets/"),
            ("Transactions", "/finance/api/transactions/"),
        ],
        "LOGISTICS": [
            ("Pick & Drop", "/forms/pick-and-drop/api/trips/"),
        ],
        "WORKSHOP": [
            ("Delays", "/workshop/api/delays/"),
            ("Incidents", "/workshop/api/incidents/"),
        ],
        "PROJECTS": [
            ("Projects", "/projects/projects/"),
            ("Milestones", "/projects/milestones/"),
        ],
        "WARRANTY": [
            ("PPF Warranty", "/forms/ppf/api/warranties/"),
            ("Ceramic Warranty", "/forms/ceramic/api/warranties/"),
        ],
        "MARKETING": [
            ("Social Posts", "/marketing/api/social-posts/"),
        ],
        "SCHEDULING": [
            ("Teams", "/forms/scheduling/teams/"),
            ("Daily Closing", "/forms/scheduling/daily-closing/"),
        ],
    }
    
    results = {"pass": 0, "fail": 0, "failed_list": []}
    
    for module_name, endpoints in modules.items():
        print(f"\n📦 {module_name}")
        print("-" * 50)
        for name, endpoint in endpoints:
            try:
                response = requests.get(f"{BASE_URL}{endpoint}", headers=headers, timeout=5)
                if response.status_code == 200:
                    data = response.json()
                    count = len(data) if isinstance(data, list) else data.get('count', '✓')
                    print(f"  ✅ {name}: {count}")
                    results["pass"] += 1
                else:
                    print(f"  ❌ {name}: {response.status_code}")
                    results["fail"] += 1
                    results["failed_list"].append((name, endpoint, response.status_code))
            except Exception as e:
                print(f"  ❌ {name}: ERROR")
                results["fail"] += 1

    # Final Summary
    print("\n" + "=" * 70)
    total = results["pass"] + results["fail"]
    pct = (results["pass"] / total * 100) if total > 0 else 0
    
    if pct == 100:
        print("🎉🎉🎉 PERFECT SCORE - 100% SYSTEMS OPERATIONAL! 🎉🎉🎉")
    elif pct >= 95:
        print(f"🚀 EXCELLENT: {pct:.0f}% - Ready for Production!")
    else:
        print(f"✅ {pct:.0f}% Passed ({results['pass']}/{total})")
    
    print("=" * 70)
    print(f"\n✅ Passed: {results['pass']}")
    print(f"❌ Failed: {results['fail']}")
    
    if results["failed_list"]:
        print("\nFailed endpoints:")
        for name, ep, code in results["failed_list"]:
            print(f"  - {name}: {ep} ({code})")

if __name__ == "__main__":
    complete_system_test()
