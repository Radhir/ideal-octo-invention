import requests
import json

BASE_URL = "http://localhost:8000"

def final_deployment_check():
    print("=" * 70)
    print("🚀 ELITE SHINE ERP - FINAL DEPLOYMENT VERIFICATION")
    print("=" * 70)
    
    # Login
    print("\n🔐 Authenticating...")
    login_response = requests.post(f"{BASE_URL}/api/auth/login/", json={
        "username": "radhir", "password": "Elite123!"
    })
    
    if login_response.status_code != 200:
        print("❌ LOGIN FAILED - Cannot proceed")
        return
    
    access_token = login_response.json().get("access")
    headers = {"Authorization": f"Bearer {access_token}"}
    print("✅ Authentication successful\n")
    
    # ALL VERIFIED CORRECT ENDPOINTS
    modules = {
        "HR MANAGEMENT": [
            ("Employees", "/hr/api/employees/"),
            ("Roster", "/hr/api/roster/"),
            ("Attendance", "/hr/api/attendance/"),
            ("Departments", "/hr/api/departments/"),
            ("Teams", "/hr/api/teams/"),
            ("Salary Slips", "/hr/api/salary-slips/"),
        ],
        "JOB CARDS & SERVICE": [
            ("Job Cards", "/forms/job-cards/api/jobs/"),
            ("Job Card Photos", "/forms/job-cards/api/photos/"),
            ("Service Categories", "/forms/job-cards/api/service-categories/"),
            ("Bookings", "/forms/bookings/api/list/"),
        ],
        "CRM": [
            ("Leads", "/forms/leads/api/list/"),
        ],
        "INVOICES & FINANCE": [
            ("Invoices", "/forms/invoices/api/list/"),
            ("Accounts", "/finance/api/accounts/"),
            ("Budgets", "/finance/api/budgets/"),
            ("Transactions", "/finance/api/transactions/"),
        ],
        "LOGISTICS": [
            ("Pick & Drop Trips", "/forms/pick-and-drop/api/trips/"),
        ],
        "WORKSHOP & OPERATIONS": [
            ("Operations", "/forms/operations/api/list/"),
            ("Workshop Delays", "/workshop/api/delays/"),
            ("Workshop Incidents", "/workshop/api/incidents/"),
        ],
        "INVENTORY & STOCK": [
            ("Stock Items", "/forms/stock/api/items/"),
            ("Stock Requests", "/forms/stock/api/requests/"),
            ("Stock Movements", "/forms/stock/api/movements/"),
            ("Suppliers", "/forms/stock/api/suppliers/"),
        ],
        "HR LEAVES & ATTENDANCE": [
            ("Leave Applications", "/forms/leaves/api/applications/"),
            ("Attendance (Forms)", "/forms/attendance/api/"),
        ],
        "WARRANTY": [
            ("PPF Warranty", "/forms/ppf/api/warranties/"),
            ("Ceramic Warranty", "/forms/ceramic/api/warranties/"),
        ],
        "MARKETING": [
            ("Social Posts", "/marketing/api/social-posts/"),
            ("SEO Keywords", "/marketing/api/seo-keywords/"),
            ("Video Projects", "/marketing/api/video-projects/"),
        ],
        "SCHEDULING": [
            ("Work Teams", "/forms/scheduling/teams/"),
            ("Assignments", "/forms/scheduling/assignments/"),
            ("Daily Closing", "/forms/scheduling/daily-closing/"),
        ],
        "PROJECTS": [
            ("Projects", "/projects/projects/"),
            ("Milestones", "/projects/milestones/"),
            ("Tasks", "/projects/tasks/"),
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
                    print(f"  ✅ {name}: {count} records")
                    results["pass"] += 1
                elif response.status_code == 404:
                    print(f"  ❌ {name}: NOT FOUND")
                    results["fail"] += 1
                    results["failed_list"].append((name, endpoint, "404"))
                elif response.status_code == 401:
                    print(f"  ⚠️  {name}: AUTH ISSUE")
                    results["fail"] += 1
                    results["failed_list"].append((name, endpoint, "401"))
                else:
                    print(f"  ❌ {name}: HTTP {response.status_code}")
                    results["fail"] += 1
                    results["failed_list"].append((name, endpoint, f"{response.status_code}"))
            except Exception as e:
                print(f"  ❌ {name}: {str(e)[:30]}")
                results["fail"] += 1
                results["failed_list"].append((name, endpoint, "ERROR"))
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 FINAL DEPLOYMENT READINESS")
    print("=" * 70)
    total = results["pass"] + results["fail"]
    pct = (results["pass"] / total * 100) if total > 0 else 0
    print(f"\n✅ Passed: {results['pass']}/{total} ({pct:.1f}%)")
    print(f"❌ Failed: {results['fail']}/{total}")
    
    if results["failed_list"]:
        print("\n⚠️  FAILED ENDPOINTS:")
        for name, endpoint, reason in results["failed_list"]:
            print(f"   • {name}: {endpoint} ({reason})")
    
    print("\n" + "=" * 70)
    if pct == 100:
        print("🎉🎉🎉 PERFECT! ALL SYSTEMS OPERATIONAL - DEPLOY NOW! 🎉🎉🎉")
    elif pct >= 90:
        print("🚀 EXCELLENT! READY FOR DEPLOYMENT!")
    elif pct >= 80:
        print("⚡ MOSTLY READY - Minor fixes needed")
    else:
        print("⛔ NEEDS ATTENTION - Fix critical issues before deployment")
    print("=" * 70)

if __name__ == "__main__":
    final_deployment_check()
