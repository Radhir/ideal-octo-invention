# Elite Shine ERP - API Endpoints

> Base URL: `http://localhost:8000`
> Auth: JWT Bearer Token (via `Authorization: Bearer <access_token>`)

---

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user, returns JWT tokens |
| POST | `/api/auth/login/` | Login, returns `access` + `refresh` tokens |
| POST | `/api/auth/token/refresh/` | Refresh expired access token |
| GET | `/api/auth/profile/` | Get authenticated user profile |
| GET | `/api/auth/users/` | List all users |
| GET | `/api/auth/logout/` | Logout (redirect) |

---

## Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/api/stats/` | Dashboard KPI statistics |
| GET | `/api/dashboard/api/sales/` | Sales dashboard (pipeline, KPIs, leaderboard, charts) |
| GET | `/api/dashboard/navigation/` | Navigation tree structure |

### Workshop Diary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/workshop-diary/` | List all diary entries |
| POST | `/api/dashboard/workshop-diary/` | Create diary entry |
| GET | `/api/dashboard/workshop-diary/{id}/` | Get single entry |
| PUT | `/api/dashboard/workshop-diary/{id}/` | Update entry |
| DELETE | `/api/dashboard/workshop-diary/{id}/` | Delete entry |
| POST | `/api/dashboard/workshop-diary/capture_snapshot/` | Capture today's snapshot |
| GET | `/api/dashboard/workshop-diary/chart_data/` | Get 30-day chart data |

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/chat/` | List messages for current user |
| POST | `/api/dashboard/chat/` | Send message (`{ text, receiver }`) |
| GET | `/api/dashboard/chat/{id}/` | Get single message |
| DELETE | `/api/dashboard/chat/{id}/` | Delete message |
| GET | `/api/dashboard/chat/colleagues/` | List available colleagues |
| GET | `/api/dashboard/chat/conversation/?user_id={id}` | Get conversation with a user |

---

## Job Cards

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/job-cards/api/jobs/` | List all job cards |
| POST | `/forms/job-cards/api/jobs/` | Create job card |
| GET | `/forms/job-cards/api/jobs/{id}/` | Get job card detail |
| PUT | `/forms/job-cards/api/jobs/{id}/` | Update job card |
| PATCH | `/forms/job-cards/api/jobs/{id}/` | Partial update |
| DELETE | `/forms/job-cards/api/jobs/{id}/` | Delete job card |
| POST | `/forms/job-cards/api/jobs/{id}/advance_status/` | Advance workflow status |
| POST | `/forms/job-cards/api/jobs/{id}/create_invoice/` | Create invoice from job card |

**Workflow**: RECEPTION -> ESTIMATION -> WORK_ASSIGNMENT -> WIP -> QC -> INVOICING -> DELIVERY -> CLOSED

### Job Card Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/job-cards/api/tasks/` | List all tasks |
| POST | `/forms/job-cards/api/tasks/` | Create task |
| GET | `/forms/job-cards/api/tasks/{id}/` | Get task |
| PUT | `/forms/job-cards/api/tasks/{id}/` | Update task |
| DELETE | `/forms/job-cards/api/tasks/{id}/` | Delete task |

### Job Card Photos

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/job-cards/api/photos/` | List all photos |
| POST | `/forms/job-cards/api/photos/` | Upload photo |
| GET | `/forms/job-cards/api/photos/{id}/` | Get photo |
| DELETE | `/forms/job-cards/api/photos/{id}/` | Delete photo |

---

## Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/bookings/api/list/` | List all bookings |
| POST | `/forms/bookings/api/list/` | Create booking |
| GET | `/forms/bookings/api/list/{id}/` | Get booking detail |
| PUT | `/forms/bookings/api/list/{id}/` | Update booking |
| PATCH | `/forms/bookings/api/list/{id}/` | Partial update |
| DELETE | `/forms/bookings/api/list/{id}/` | Delete booking |
| POST | `/forms/bookings/api/list/{id}/convert_to_job/` | Convert booking to job card |

---

## Leads (CRM)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/leads/api/list/` | List all leads |
| POST | `/forms/leads/api/list/` | Create lead |
| GET | `/forms/leads/api/list/{id}/` | Get lead detail |
| PUT | `/forms/leads/api/list/{id}/` | Update lead |
| PATCH | `/forms/leads/api/list/{id}/` | Partial update |
| DELETE | `/forms/leads/api/list/{id}/` | Delete lead |

---

## Invoices

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/invoices/api/list/` | List all invoices |
| POST | `/forms/invoices/api/list/` | Create invoice |
| GET | `/forms/invoices/api/list/{id}/` | Get invoice detail |
| PUT | `/forms/invoices/api/list/{id}/` | Update invoice |
| PATCH | `/forms/invoices/api/list/{id}/` | Partial update |
| DELETE | `/forms/invoices/api/list/{id}/` | Delete invoice |

---

## Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/operations/api/list/` | List all operations |
| POST | `/forms/operations/api/list/` | Create operation |
| GET | `/forms/operations/api/list/{id}/` | Get operation detail |
| PUT | `/forms/operations/api/list/{id}/` | Update operation |
| PATCH | `/forms/operations/api/list/{id}/` | Partial update |
| DELETE | `/forms/operations/api/list/{id}/` | Delete operation |

---

## Service Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/requests/api/forms/` | List all requests |
| POST | `/forms/requests/api/forms/` | Create request |
| GET | `/forms/requests/api/forms/{id}/` | Get request detail |
| PUT | `/forms/requests/api/forms/{id}/` | Update request |
| PATCH | `/forms/requests/api/forms/{id}/` | Partial update |
| DELETE | `/forms/requests/api/forms/{id}/` | Delete request |

---

## Stock

### Stock Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/stock/api/requests/` | List all stock requests |
| POST | `/forms/stock/api/requests/` | Create stock request |
| GET | `/forms/stock/api/requests/{id}/` | Get stock request |
| PUT | `/forms/stock/api/requests/{id}/` | Update stock request |
| DELETE | `/forms/stock/api/requests/{id}/` | Delete stock request |

### Stock Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/stock/api/items/` | List all stock items |
| POST | `/forms/stock/api/items/` | Create stock item |
| GET | `/forms/stock/api/items/{id}/` | Get stock item |
| PUT | `/forms/stock/api/items/{id}/` | Update stock item |
| DELETE | `/forms/stock/api/items/{id}/` | Delete stock item |

### Stock Movements

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/stock/api/movements/` | List all movements |
| POST | `/forms/stock/api/movements/` | Record movement |
| GET | `/forms/stock/api/movements/{id}/` | Get movement |
| PUT | `/forms/stock/api/movements/{id}/` | Update movement |
| DELETE | `/forms/stock/api/movements/{id}/` | Delete movement |

---

## Leaves

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/leaves/api/applications/` | List all leave applications |
| POST | `/forms/leaves/api/applications/` | Create leave application |
| GET | `/forms/leaves/api/applications/{id}/` | Get leave detail |
| PUT | `/forms/leaves/api/applications/{id}/` | Update leave |
| PATCH | `/forms/leaves/api/applications/{id}/` | Partial update |
| DELETE | `/forms/leaves/api/applications/{id}/` | Delete leave |

---

## Pick and Drop

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/pick-and-drop/api/trips/` | List all trips |
| POST | `/forms/pick-and-drop/api/trips/` | Create trip |
| GET | `/forms/pick-and-drop/api/trips/{id}/` | Get trip detail |
| PUT | `/forms/pick-and-drop/api/trips/{id}/` | Update trip |
| PATCH | `/forms/pick-and-drop/api/trips/{id}/` | Partial update |
| DELETE | `/forms/pick-and-drop/api/trips/{id}/` | Delete trip |

---

## Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/attendance/api/logs/` | List all attendance logs |
| POST | `/forms/attendance/api/logs/` | Create attendance log |
| GET | `/forms/attendance/api/logs/{id}/` | Get attendance log |
| PUT | `/forms/attendance/api/logs/{id}/` | Update attendance log |
| DELETE | `/forms/attendance/api/logs/{id}/` | Delete attendance log |

---

## PPF Warranty

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/ppf/api/warranties/` | List all PPF warranties |
| POST | `/forms/ppf/api/warranties/` | Create PPF warranty |
| GET | `/forms/ppf/api/warranties/{id}/` | Get warranty detail |
| PUT | `/forms/ppf/api/warranties/{id}/` | Update warranty |
| PATCH | `/forms/ppf/api/warranties/{id}/` | Partial update |
| DELETE | `/forms/ppf/api/warranties/{id}/` | Delete warranty |

---

## Ceramic Warranty

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/ceramic/api/ceramic/` | List all ceramic warranties |
| POST | `/forms/ceramic/api/ceramic/` | Create ceramic warranty |
| GET | `/forms/ceramic/api/ceramic/{id}/` | Get warranty detail |
| PUT | `/forms/ceramic/api/ceramic/{id}/` | Update warranty |
| PATCH | `/forms/ceramic/api/ceramic/{id}/` | Partial update |
| DELETE | `/forms/ceramic/api/ceramic/{id}/` | Delete warranty |

---

## Finance

### Accounts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/finance/api/accounts/` | List all accounts |
| POST | `/finance/api/accounts/` | Create account |
| GET | `/finance/api/accounts/{id}/` | Get account |
| PUT | `/finance/api/accounts/{id}/` | Update account |
| DELETE | `/finance/api/accounts/{id}/` | Delete account |

### Account Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/finance/api/categories/` | List all categories |
| POST | `/finance/api/categories/` | Create category |
| GET | `/finance/api/categories/{id}/` | Get category |
| PUT | `/finance/api/categories/{id}/` | Update category |
| DELETE | `/finance/api/categories/{id}/` | Delete category |

### Budgets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/finance/api/budgets/` | List all budgets |
| POST | `/finance/api/budgets/` | Create budget |
| GET | `/finance/api/budgets/{id}/` | Get budget |
| PUT | `/finance/api/budgets/{id}/` | Update budget |
| DELETE | `/finance/api/budgets/{id}/` | Delete budget |

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/finance/api/transactions/` | List all transactions |
| POST | `/finance/api/transactions/` | Create transaction |
| GET | `/finance/api/transactions/{id}/` | Get transaction |
| PUT | `/finance/api/transactions/{id}/` | Update transaction |
| DELETE | `/finance/api/transactions/{id}/` | Delete transaction |
| GET | `/finance/api/transactions/financial_summary/` | Financial summary (revenue, budgets, assets) |

---

## HR

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/hr/api/employees/` | List all employees |
| POST | `/hr/api/employees/` | Create employee |
| GET | `/hr/api/employees/{id}/` | Get employee |
| PUT | `/hr/api/employees/{id}/` | Update employee |
| DELETE | `/hr/api/employees/{id}/` | Delete employee |

### HR Rules

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/hr/api/rules/` | List all HR rules |
| POST | `/hr/api/rules/` | Create rule |
| GET | `/hr/api/rules/{id}/` | Get rule |
| PUT | `/hr/api/rules/{id}/` | Update rule |
| DELETE | `/hr/api/rules/{id}/` | Delete rule |

### Payroll

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/hr/api/payroll/` | List all payroll records |
| POST | `/hr/api/payroll/` | Create payroll record |
| GET | `/hr/api/payroll/{id}/` | Get payroll record |
| PUT | `/hr/api/payroll/{id}/` | Update payroll record |
| DELETE | `/hr/api/payroll/{id}/` | Delete payroll record |
| POST | `/hr/api/payroll/generate_payroll_cycle/` | Auto-generate monthly payroll |

### Roster

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/hr/api/roster/` | List all roster entries |
| POST | `/hr/api/roster/` | Create roster entry |
| GET | `/hr/api/roster/{id}/` | Get roster entry |
| PUT | `/hr/api/roster/{id}/` | Update roster entry |
| DELETE | `/hr/api/roster/{id}/` | Delete roster entry |

### HR Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/hr/api/attendance/` | List all attendance records |
| POST | `/hr/api/attendance/` | Create attendance record |
| GET | `/hr/api/attendance/{id}/` | Get attendance record |
| PUT | `/hr/api/attendance/{id}/` | Update attendance record |
| DELETE | `/hr/api/attendance/{id}/` | Delete attendance record |
| POST | `/hr/api/attendance/clock_in/` | Clock in (`{ employee_id }`) |
| POST | `/hr/api/attendance/clock_out/` | Clock out (`{ employee_id }`) |

### Teams

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/hr/api/teams/` | List all teams |
| POST | `/hr/api/teams/` | Create team |
| GET | `/hr/api/teams/{id}/` | Get team detail with members |
| PUT | `/hr/api/teams/{id}/` | Update team |
| DELETE | `/hr/api/teams/{id}/` | Delete team |
| POST | `/hr/api/teams/{id}/add_member/` | Add employee to team (`{ employee_id }`) |
| POST | `/hr/api/teams/{id}/remove_member/` | Remove employee from team (`{ employee_id }`) |

---

## Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers/api/` | List all customers (`?search=` supported) |
| POST | `/customers/api/` | Create customer |
| GET | `/customers/api/{id}/` | Get customer |
| PUT | `/customers/api/{id}/` | Update customer |
| DELETE | `/customers/api/{id}/` | Delete customer |

---

## PDF Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/utils/generate-pdf/{model}/{pk}/` | Generate PDF for model |

### Supported Models

| model_name | pk=0 (List) | pk>0 (Single) |
|------------|-------------|---------------|
| `JobCard` | All job cards report | Single job card PDF |
| `Invoice` | All invoices report | Single invoice PDF |
| `Lead` | All leads report | Single lead PDF |
| `Booking` | All bookings report | Single booking PDF |
| `Operation` | All operations report | Single operation PDF |
| `StockForm` | All stock report | Single stock PDF |
| `LeaveApplication` | All leaves report | Single leave PDF |
| `WorkshopDiary` | Workshop diary snapshot | N/A |
| `PPFWarrantyRegistration` | N/A | Single PPF warranty PDF |
| `CeramicWarrantyRegistration` | N/A | Single ceramic warranty PDF |
| `Checklist` | N/A | Single checklist PDF |
| `RequestForm` | N/A | Single request PDF |

---

## Checklists (HTML only - no REST API)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/checklists/` | List checklists (HTML) |
| GET/POST | `/forms/checklists/create/` | Create checklist (HTML form) |
