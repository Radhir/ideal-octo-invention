import requests

BASE_URL = "http://localhost:8000"

def test_full_erp():
    print("=" * 70)
    print("🔥 ELITE SHINE ERP - FINAL PRE-DEPLOYMENT CHECK 🔥")
    print("=" * 70)
    
    # Login
    login_response = requests.post(f"{BASE_URL}/api/auth/login/", json={
        "username": "radhir", "password": "Elite123!"
    })
    
    if login_response.status_code != 200:
        print("❌ LOGIN FAILED")
        return
    
    access_token = login_response.json().get("access")
    headers = {"Authorization": f"Bearer {access_token}"}
    print("✅ LOGIN: SUCCESS\n")
    
    # All endpoints with VERIFIED CORRECT paths
    modules = {
        "HR MODULE": [
            ("Employees", "/hr/api/employees/"),
            ("Roster", "/hr/api/roster/"),
            ("Attendance (HR)", "/hr/api/attendance/"),
            ("Departments", "/hr/api/departments/"),
            ("Teams", "/hr/api/teams/"),
            ("Salary Slips", "/hr/api/salary-slips/"),
        ],
        "JOB CARDS & WORKFLOW": [
            ("Job Cards", "/forms/job-cards/api/jobs/"),
            ("Job Card Photos", "/forms/job-cards/api/photos/"),
            ("Service Categories", "/forms/job-cards/api/service-categories/"),
            ("Bookings", "/forms/bookings/api/list/"),
        ],
        "CRM & LEADS": [
            ("Leads", "/forms/leads/api/list/"),
        ],
        "INVOICES & FINANCE": [
            ("Invoices", "/forms/invoices/api/list/"),
            ("Accounts", "/finance/api/accounts/"),
            ("Budgets", "/finance/api/budgets/"),
            ("Transactions", "/finance/api/transactions/"),
        ],
        "LOGISTICS & PICK-DROP": [
            ("Pick & Drop Trips", "/forms/pick-and-drop/api/trips/"),
        ],
        "WORKSHOP & OPERATIONS": [
            ("Operations", "/forms/operations/api/list/"),
            ("Stock/Inventory", "/forms/stock/api/stock/"),
            ("Leaves", "/forms/leaves/api/leave-requests/"),
        ],
        "ATTENDANCE (FORMS)": [
            ("Attendance", "/forms/attendance/api/attendance/"),
        ],
        "WARRANTY SYSTEM": [
            ("PPF Warranty", "/forms/ppf/api/warranties/"),
            ("Ceramic Warranty", "/forms/ceramic/api/warranties/"),
        ],
        "MARKETING": [
            ("Social Posts", "/marketing/api/social-posts/"),
            ("SEO Keywords", "/marketing/api/seo-keywords/"),
            ("Video Projects", "/marketing/api/video-projects/"),
        ],
        "SCHEDULING & DAILY OPS": [
            ("Work Teams", "/forms/scheduling/teams/"),
            ("Schedule Assignments", "/forms/scheduling/assignments/"),
            ("Daily Closing", "/forms/scheduling/daily-closing/"),
        ],
        "WORKSHOP": [
            ("Workshop Diary", "/workshop/api/entries/"),
        ],
        "PROJECTS": [
            ("Projects", "/projects/api/projects/"),
        ],
    }
    
    results = {"pass": 0, "fail": 0, "failed_list": []}
    
    for module_name, endpoints in modules.items():
        print(f"\n📦 {module_name}")
        print("-" * 50)
        for name, endpoint in endpoints:
            try:
                response = requests.get(f"{BASE_URL}{endpoint}", headers=headers, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    count = len(data) if isinstance(data, list) else data.get('count', '✓')
                    print(f"  ✅ {name}: OK ({count} records)")
                    results["pass"] += 1
                elif response.status_code == 401:
                    print(f"  ⚠️  {name}: Auth Required")
                    results["fail"] += 1
                    results["failed_list"].append((name, "Auth"))
                elif response.status_code == 404:
                    print(f"  ❌ {name}: NOT FOUND")
                    results["fail"] += 1
                    results["failed_list"].append((name, "404"))
                else:
                    print(f"  ❌ {name}: Error {response.status_code}")
                    results["fail"] += 1
                    results["failed_list"].append((name, f"Err {response.status_code}"))
            except Exception as e:
                print(f"  ❌ {name}: {str(e)[:40]}")
                results["fail"] += 1
                results["failed_list"].append((name, str(e)[:40]))
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 DEPLOYMENT READINESS SUMMARY")
    print("=" * 70)
    total = results["pass"] + results["fail"]
    pct = (results["pass"] / total * 100) if total > 0 else 0
    print(f"✅ Passed: {results['pass']}/{total} ({pct:.1f}%)")
    print(f"❌ Failed: {results['fail']}/{total}")
    
    if results["failed_list"]:
        print("\n⚠️  FAILED ENDPOINTS:")
        for name, reason in results["failed_list"]:
            print(f"   - {name}: {reason}")
    
    if pct >= 90:
        print("\n🎉 SYSTEM IS READY FOR DEPLOYMENT!")
    elif pct >= 70:
        print("\n⚡ MOSTLY READY - Minor issues to address")
    else:
        print("\n⛔ SIGNIFICANT FIXES NEEDED BEFORE DEPLOYMENT")

if __name__ == "__main__":
    test_full_erp()
