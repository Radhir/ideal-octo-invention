"""
Elite Shine Workshop Management System - Project Explanation PDF Generator
Generates a comprehensive PDF document explaining the entire WebPlot project.
"""
from fpdf import FPDF
from datetime import datetime


class ProjectPDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=25)

    def header(self):
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(150, 120, 70)
        self.cell(0, 8, 'Elite Shine - WebPlot ERP | Project Documentation', align='R')
        self.ln(4)
        self.set_draw_color(176, 141, 87)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(8)

    def footer(self):
        self.set_y(-20)
        self.set_draw_color(176, 141, 87)
        self.set_line_width(0.3)
        self.line(10, self.get_y(), 200, self.get_y())
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(130, 130, 130)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}  |  Generated: {datetime.now().strftime("%d %b %Y %H:%M")}', align='C')

    def chapter_title(self, title):
        self.set_font('Helvetica', 'B', 16)
        self.set_text_color(30, 30, 30)
        self.cell(0, 12, title, new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(176, 141, 87)
        self.set_line_width(0.8)
        self.line(10, self.get_y(), 80, self.get_y())
        self.ln(6)

    def section_title(self, title):
        self.set_font('Helvetica', 'B', 13)
        self.set_text_color(60, 60, 60)
        self.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
        self.ln(2)

    def sub_section(self, title):
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(80, 80, 80)
        self.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def body_text(self, text):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(50, 50, 50)
        self.multi_cell(0, 6, text)
        self.ln(3)

    def bullet_point(self, text, indent=15):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(50, 50, 50)
        x = self.get_x()
        self.set_x(x + indent)
        self.cell(5, 6, '-')
        self.multi_cell(0, 6, text)
        self.ln(1)

    def bold_bullet(self, label, desc, indent=15):
        x = self.get_x()
        self.set_x(x + indent)
        self.set_font('Helvetica', '', 10)
        self.set_text_color(50, 50, 50)
        self.cell(5, 6, '-')
        self.set_font('Helvetica', 'B', 10)
        self.cell(self.get_string_width(label) + 2, 6, label)
        self.set_font('Helvetica', '', 10)
        self.multi_cell(0, 6, f' - {desc}')
        self.ln(1)

    def table_row(self, col1, col2, col3='', header=False):
        if header:
            self.set_font('Helvetica', 'B', 9)
            self.set_fill_color(176, 141, 87)
            self.set_text_color(255, 255, 255)
        else:
            self.set_font('Helvetica', '', 9)
            self.set_text_color(50, 50, 50)
            self.set_fill_color(245, 245, 245)
        w1, w2, w3 = (50, 70, 70) if col3 else (60, 130, 0)
        self.cell(w1, 8, col1, border=1, fill=header)
        self.cell(w2, 8, col2, border=1, fill=header)
        if col3:
            self.cell(w3, 8, col3, border=1, fill=header)
        self.ln()


def generate():
    pdf = ProjectPDF()
    pdf.alias_nb_pages()

    # ========== COVER PAGE ==========
    pdf.add_page()
    pdf.ln(40)
    pdf.set_font('Helvetica', 'B', 36)
    pdf.set_text_color(30, 30, 30)
    pdf.cell(0, 18, 'ELITE SHINE', align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.set_font('Helvetica', '', 16)
    pdf.set_text_color(176, 141, 87)
    pdf.cell(0, 10, 'Workshop Management System', align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)
    pdf.set_draw_color(176, 141, 87)
    pdf.set_line_width(1)
    pdf.line(60, pdf.get_y(), 150, pdf.get_y())
    pdf.ln(15)
    pdf.set_font('Helvetica', '', 12)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 8, 'Project: WebPlot ERP', align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, 'Architecture: Django REST Framework + React Vite', align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, f'Document Date: {datetime.now().strftime("%d %B %Y")}', align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, 'Version: 1.0', align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.ln(30)
    pdf.set_font('Helvetica', 'I', 10)
    pdf.set_text_color(130, 130, 130)
    pdf.cell(0, 8, 'A comprehensive automotive detailing & coating business management platform', align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, 'Developed for Elite Shine, Dubai, UAE', align='C', new_x="LMARGIN", new_y="NEXT")

    # ========== TABLE OF CONTENTS ==========
    pdf.add_page()
    pdf.chapter_title('Table of Contents')
    pdf.ln(5)
    toc = [
        ('1.', 'Project Overview'),
        ('2.', 'Technology Stack'),
        ('3.', 'System Architecture'),
        ('4.', 'Backend Structure (20 Django Apps)'),
        ('5.', 'Frontend Structure (React + Vite)'),
        ('6.', 'Core Feature: Job Card Workflow (7 Stages)'),
        ('7.', 'Module Breakdown'),
        ('8.', 'API Endpoints'),
        ('9.', 'PDF Generation System'),
        ('10.', 'Authentication & Security'),
        ('11.', 'Database Models Summary'),
        ('12.', 'Modes & Workflow Status'),
        ('13.', 'Current Completion Status'),
    ]
    for num, title in toc:
        pdf.set_font('Helvetica', 'B', 11)
        pdf.set_text_color(176, 141, 87)
        pdf.cell(15, 9, num)
        pdf.set_font('Helvetica', '', 11)
        pdf.set_text_color(50, 50, 50)
        pdf.cell(0, 9, title, new_x="LMARGIN", new_y="NEXT")

    # ========== 1. PROJECT OVERVIEW ==========
    pdf.add_page()
    pdf.chapter_title('1. Project Overview')
    pdf.body_text(
        'Elite Shine Workshop Management System (codename: WebPlot) is a full-stack enterprise resource '
        'planning (ERP) platform designed specifically for an automotive car detailing and ceramic coating '
        'workshop business based in Dubai, UAE. The system manages the complete lifecycle of vehicle '
        'servicing from customer booking to final delivery, including financial operations, HR management, '
        'inventory control, and executive dashboards.'
    )
    pdf.body_text(
        'The platform is built as a decoupled architecture with a Django REST Framework backend providing '
        'RESTful APIs and a modern React (Vite) frontend delivering a premium glass-morphism dark-themed UI. '
        'The system is designed to handle multi-branch operations with role-based access control.'
    )
    pdf.section_title('Key Business Functions')
    for item in [
        'End-to-end vehicle service workflow management (7-stage job card system)',
        'Customer relationship management (leads, bookings, follow-ups)',
        'Warranty tracking for PPF and Ceramic coating services',
        'Financial management (invoicing, budgets, chart of accounts, transactions)',
        'Human resources (attendance, payroll, leave management, employee directory)',
        'Inventory and stock management',
        'Pick & Drop logistics coordination with driver assignment',
        'Executive dashboards and operational reporting',
        'PDF generation for all forms, invoices, and reports',
    ]:
        pdf.bullet_point(item)

    # ========== 2. TECHNOLOGY STACK ==========
    pdf.add_page()
    pdf.chapter_title('2. Technology Stack')
    pdf.section_title('Backend')
    for label, desc in [
        ('Python 3.14', 'Core programming language'),
        ('Django 6.0.1', 'Web framework with ORM and admin'),
        ('Django REST Framework 3.16.1', 'RESTful API toolkit'),
        ('Simple JWT', 'JSON Web Token authentication'),
        ('WeasyPrint', 'HTML-to-PDF generation engine'),
        ('PostgreSQL', 'Primary database (production)'),
        ('SQLite', 'Development database'),
        ('Django CORS Headers', 'Cross-origin request handling'),
        ('Celery + Redis', 'Async task queue (scheduled jobs)'),
    ]:
        pdf.bold_bullet(label, desc)

    pdf.section_title('Frontend')
    for label, desc in [
        ('React 19.2.0', 'UI component library'),
        ('Vite 7.2.4', 'Build tool and dev server'),
        ('React Router 7.13.0', 'Client-side routing'),
        ('Axios', 'HTTP client for API calls'),
        ('Framer Motion', 'Animation library for glass-morphism effects'),
        ('Lucide React', 'Icon library (200+ icons used)'),
        ('jwt-decode', 'Client-side JWT token parsing'),
    ]:
        pdf.bold_bullet(label, desc)

    pdf.section_title('Design System')
    pdf.body_text(
        'The UI follows a premium glass-morphism design language with a dark theme. Key visual elements include: '
        'frosted glass card components, gold accent color (#b08d57), purple highlight (#8400ff), animated hover '
        'effects, and a professional automotive-industry aesthetic. The "Outfit" font family is used for headings.'
    )

    # ========== 3. SYSTEM ARCHITECTURE ==========
    pdf.add_page()
    pdf.chapter_title('3. System Architecture')
    pdf.body_text(
        'The system follows a decoupled client-server architecture:'
    )
    pdf.ln(2)
    pdf.set_font('Courier', '', 9)
    pdf.set_text_color(50, 50, 50)
    arch_diagram = """
    +---------------------+          +---------------------+
    |   React Frontend    |  <--->   |   Django Backend     |
    |   (Vite Dev Server) |   REST   |   (DRF API Server)   |
    |   Port: 5173        |   API    |   Port: 8000         |
    +---------------------+          +---------------------+
                                              |
                                     +--------+--------+
                                     |                 |
                              +------+------+   +------+------+
                              |  PostgreSQL |   |  WeasyPrint |
                              |  Database   |   |  PDF Engine |
                              +-------------+   +-------------+
    """
    for line in arch_diagram.strip().split('\n'):
        pdf.cell(0, 5, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)
    pdf.set_font('Helvetica', '', 10)
    pdf.body_text(
        'API Communication: The frontend communicates with the backend exclusively through REST APIs. '
        'Authentication is handled via JWT tokens stored in localStorage. Axios is configured with a base '
        'URL of http://localhost:8000 and automatically attaches the Bearer token to all requests.'
    )

    # ========== 4. BACKEND STRUCTURE ==========
    pdf.add_page()
    pdf.chapter_title('4. Backend Structure (20 Django Apps)')
    pdf.body_text('The backend is organized into 20 Django apps, each handling a specific domain:')
    pdf.ln(2)
    apps = [
        ('authentication', 'JWT login, registration, user profiles, token refresh'),
        ('job_cards', 'Core 7-stage workflow, vehicle service tracking, invoice generation'),
        ('bookings', 'Customer appointment scheduling and management'),
        ('leads', 'CRM lead pipeline with source & budget tracking'),
        ('invoices', 'Tax invoice generation, payment status tracking'),
        ('ppf_warranty', 'PPF warranty registration with 5 service checkups'),
        ('ceramic_warranty', 'Ceramic coating warranty with 4 maintenance intervals'),
        ('operations', 'Operation logging and task tracking'),
        ('stock', 'Inventory and stock item management'),
        ('finance', 'Budgets, transactions, chart of accounts'),
        ('hr', 'Employee directory, payroll, HR rules, roster management'),
        ('attendance', 'Employee attendance and PIN-based check-in'),
        ('leaves', 'Leave application and approval workflow'),
        ('pick_and_drop', 'Driver logistics, vehicle pickup/dropoff scheduling'),
        ('requests', 'General request/approval workflow'),
        ('checklists', 'Task checklist management'),
        ('dashboard', 'Workshop diary, navigation tree, reporting'),
        ('forms_app', 'Central PDF generation engine for all models'),
        ('data', 'Shared data models and utilities'),
        ('core', 'Django settings, root URL configuration'),
    ]
    for name, desc in apps:
        pdf.bold_bullet(name, desc)

    # ========== 5. FRONTEND STRUCTURE ==========
    pdf.add_page()
    pdf.chapter_title('5. Frontend Structure (React + Vite)')
    pdf.body_text(
        'The frontend contains 53 JSX components organized into pages, layouts, components, and context providers.'
    )
    pdf.section_title('Directory Layout')
    pdf.set_font('Courier', '', 9)
    dirs = [
        'src/',
        '  App.jsx              - Main router with 40+ routes',
        '  main.jsx             - Entry point',
        '  components/',
        '    GlassCard.jsx      - Reusable glass-morphism card',
        '    BentoCard.jsx      - Bento grid layout card',
        '    BottomNav.jsx      - Mobile bottom navigation',
        '    BackgroundCarousel  - Animated background images',
        '  context/',
        '    AuthContext.jsx     - JWT auth state management',
        '  layouts/',
        '    AppLayout.jsx      - Main app shell with sidebar',
        '    AuthLayout.jsx     - Login/register layout',
        '  pages/               - 13 module directories:',
        '    jobs/              - JobList, JobCreate, JobDetail, JobWorkflow',
        '    bookings/          - BookingList, BookingForm, BookingCalendar',
        '    leads/             - LeadList, LeadDetail, LeadForm',
        '    invoices/          - InvoiceList, InvoiceDetail',
        '    ppf/               - PPFList, PPFForm',
        '    ceramic/           - CeramicList, CeramicForm',
        '    finance/           - FinanceOverview, BudgetManager, etc.',
        '    hr/                - EmployeeDirectory, Payroll, etc.',
        '    operations/        - OperationList, OperationForm',
        '    stock/             - StockList, StockForm',
        '    leaves/            - LeaveList, LeaveForm',
        '    pick_drop/         - PickDropList, DriverDashboard',
        '    requests/          - RequestList, RequestForm',
        '    dashboard/         - WorkshopDiary',
        '    attendance/        - AttendanceList',
    ]
    for d in dirs:
        pdf.cell(0, 5, '  ' + d, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)

    # ========== 6. CORE FEATURE: JOB CARD WORKFLOW ==========
    pdf.add_page()
    pdf.chapter_title('6. Core Feature: Job Card Workflow')
    pdf.body_text(
        'The Job Card system is the heart of the platform. Every vehicle service follows a strict 7-stage '
        'workflow from intake to delivery. Each stage has specific forms, validation, and sign-off requirements.'
    )
    pdf.ln(2)
    stages = [
        ('Stage 1: RECEPTION', 'Vehicle intake - photography, damage documentation, key collection, customer info capture.'),
        ('Stage 2: ESTIMATION', 'Cost assessment - parts estimation, service package selection, customer approval.'),
        ('Stage 3: WORK_ASSIGNMENT', 'Technician assignment - bay allocation, timeline estimation, task distribution.'),
        ('Stage 4: WIP (Work In Progress)', 'Active service execution - detailing, polishing, coating, bodywork.'),
        ('Stage 5: QC (Quality Control)', 'Quality inspection - team lead sign-off, floor incharge approval, QC inspector check.'),
        ('Stage 6: INVOICING', 'Billing - VAT calculation, discount application, payment processing, invoice generation.'),
        ('Stage 7: DELIVERY', 'Customer handover - vehicle release, feedback collection, loyalty points, signature.'),
    ]
    for title, desc in stages:
        pdf.sub_section(title)
        pdf.body_text(desc)

    pdf.section_title('Workflow Advancement')
    pdf.body_text(
        'The frontend provides a visual step indicator (JobWorkflow.jsx) showing progress through all 7 stages. '
        'Advancement is triggered via API call: POST /forms/job-cards/api/jobs/{id}/advance_status/. '
        'Each step shows contextual badges, descriptions, and an "Advance" button to move to the next stage.'
    )

    # ========== 7. MODULE BREAKDOWN ==========
    pdf.add_page()
    pdf.chapter_title('7. Module Breakdown')

    modules = [
        ('Warranty Management', [
            'PPF Warranty: Tracks Paint Protection Film installations with 5 scheduled service checkups.',
            'Ceramic Warranty: Manages ceramic coating warranties with 4 maintenance intervals.',
            'Both support multi-branch operations (Dubai, Abu Dhabi, Sharjah).',
        ]),
        ('CRM & Lead Management', [
            'Lead tracking with source attribution (Walk-in, Instagram, Referral, etc.)',
            'Budget range tracking for sales pipeline management.',
            'Service interest categorization (PPF, Ceramic, Detailing, etc.)',
            'Lead-to-booking conversion workflow.',
        ]),
        ('Financial Management', [
            'Invoice generation from completed job cards with auto VAT (5%) calculation.',
            'Chart of Accounts (COA) with department-based organization.',
            'Budget management with allocation tracking.',
            'Transaction entry with debit/credit accounting.',
        ]),
        ('HR & Workforce', [
            'Employee directory with department and designation tracking.',
            'Payroll console for salary management.',
            'PIN-based attendance tracking system.',
            'Leave application and approval workflow.',
            'HR rules and policy management.',
            'Staff roster/shift scheduling.',
        ]),
        ('Logistics', [
            'Pick & Drop coordination for vehicle pickups and deliveries.',
            'Driver assignment and scheduling.',
            'Driver dashboard for daily task overview.',
        ]),
        ('Operations & Inventory', [
            'Operation logging for workshop activities.',
            'Stock item tracking and management.',
            'Request/approval workflow for procurement.',
            'Checklist management for service quality.',
        ]),
    ]
    for title, items in modules:
        pdf.section_title(title)
        for item in items:
            pdf.bullet_point(item)
        pdf.ln(2)

    # ========== 8. API ENDPOINTS ==========
    pdf.add_page()
    pdf.chapter_title('8. API Endpoints')
    pdf.body_text('All API endpoints follow RESTful conventions. Base URL: http://localhost:8000')
    pdf.ln(2)
    endpoints = [
        ('Authentication', [
            ('POST', '/api/auth/login/', 'JWT token login'),
            ('POST', '/api/auth/register/', 'User registration'),
            ('POST', '/api/auth/token/refresh/', 'Refresh JWT token'),
            ('GET', '/api/auth/profile/', 'Current user profile'),
            ('GET', '/api/auth/users/', 'List all users'),
        ]),
        ('Job Cards', [
            ('GET', '/forms/job-cards/api/jobs/', 'List all job cards'),
            ('POST', '/forms/job-cards/api/jobs/', 'Create new job card'),
            ('GET', '/forms/job-cards/api/jobs/{id}/', 'Get job card detail'),
            ('POST', '/forms/job-cards/api/jobs/{id}/advance_status/', 'Advance workflow'),
            ('POST', '/forms/job-cards/api/jobs/{id}/create_invoice/', 'Generate invoice'),
        ]),
        ('Invoices', [
            ('GET', '/forms/invoices/api/list/', 'List all invoices'),
            ('GET', '/forms/invoices/api/list/{id}/', 'Get invoice detail'),
            ('PATCH', '/invoices/api/list/{id}/', 'Update payment status'),
        ]),
        ('Dashboard', [
            ('GET', '/api/dashboard/api/workshop-diary/', 'Workshop diary entries'),
            ('POST', '/api/dashboard/api/workshop-diary/capture_snapshot/', 'Capture daily snapshot'),
        ]),
        ('PDF Generation', [
            ('GET', '/forms/utils/generate-pdf/{model}/{pk}/', 'Generate PDF for any model'),
        ]),
    ]
    for section, eps in endpoints:
        pdf.sub_section(section)
        for method, path, desc in eps:
            pdf.set_font('Courier', 'B', 8)
            pdf.set_text_color(176, 141, 87)
            pdf.cell(12, 6, method)
            pdf.set_font('Courier', '', 8)
            pdf.set_text_color(50, 50, 50)
            pdf.cell(90, 6, path)
            pdf.set_font('Helvetica', '', 9)
            pdf.cell(0, 6, desc, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(3)

    # ========== 9. PDF GENERATION SYSTEM ==========
    pdf.add_page()
    pdf.chapter_title('9. PDF Generation System')
    pdf.body_text(
        'The platform includes a centralized PDF generation engine (forms_app) that can produce printable '
        'documents for any model in the system. It uses WeasyPrint to convert Django HTML templates to PDF.'
    )
    pdf.section_title('Supported PDF Templates')
    for item in [
        'Job Card PDF - Complete job card with vehicle details, services, and QC status',
        'Invoice PDF (Tax Invoice) - Professional tax invoice with VAT calculation',
        'PPF Warranty PDF - PPF installation warranty certificate',
        'Ceramic Warranty PDF - Ceramic coating warranty certificate',
        'Booking PDF - Booking confirmation document',
        'Lead PDF - Lead information summary',
        'Operation PDF - Operation log report',
        'Stock Form PDF - Inventory form printout',
        'Leave Application PDF - Leave request document',
        'Request Form PDF - Approval request document',
        'Checklist PDF - Task checklist printout',
        'Workshop Diary PDF - Daily operational snapshot',
    ]:
        pdf.bullet_point(item)
    pdf.section_title('How It Works')
    pdf.body_text(
        'The generate_pdf view at /forms/utils/generate-pdf/{model_name}/{pk}/ accepts any model name and '
        'primary key. If pk=0, it generates a list report. Otherwise, it renders the specific object using '
        'its dedicated HTML template and converts it to a downloadable PDF.'
    )

    # ========== 10. AUTHENTICATION ==========
    pdf.add_page()
    pdf.chapter_title('10. Authentication & Security')
    pdf.body_text(
        'The system uses JWT (JSON Web Token) authentication via the django-rest-framework-simplejwt library.'
    )
    pdf.section_title('Authentication Flow')
    for i, step in enumerate([
        'User submits credentials to POST /api/auth/login/',
        'Backend validates and returns access + refresh tokens',
        'Frontend stores tokens in localStorage',
        'AuthContext.jsx decodes JWT and sets user state',
        'Axios interceptor attaches Bearer token to all API requests',
        'Token expiry is checked on app load; expired tokens trigger logout',
        'Protected routes use ProtectedRoute wrapper component',
    ], 1):
        pdf.bullet_point(f'Step {i}: {step}')

    # ========== 11. DATABASE MODELS ==========
    pdf.add_page()
    pdf.chapter_title('11. Database Models Summary')
    pdf.body_text('Key models across the system:')
    models_list = [
        ('JobCard', 'Core model - customer info, vehicle details, 7-stage status, services, pricing, QC flags'),
        ('Invoice', 'Generated from JobCard - invoice number, items, amounts, VAT, payment status'),
        ('Booking', 'Customer appointment - date, service type, vehicle info, status'),
        ('Lead', 'CRM lead - name, phone, source, budget, service interest, status'),
        ('PPFWarrantyRegistration', 'PPF warranty - vehicle, film details, 5 checkup dates/statuses'),
        ('CeramicWarrantyRegistration', 'Ceramic warranty - coating type, 4 maintenance intervals'),
        ('WorkshopDiary', 'Daily snapshot - bookings count, jobs received/closed, revenue'),
        ('Operation', 'Activity log - operation name, remarks, timestamps'),
        ('StockForm', 'Inventory item - name, quantity, category'),
        ('LeaveApplication', 'Employee leave - type, dates, reason, approval status'),
        ('RequestForm', 'General request - type, description, approval status'),
        ('Checklist', 'Task list - items, completion status'),
    ]
    for name, desc in models_list:
        pdf.bold_bullet(name, desc)

    # ========== 12. MODES & WORKFLOW STATUS ==========
    pdf.add_page()
    pdf.chapter_title('12. Modes & Workflow Status')
    pdf.body_text(
        'The system operates through several interconnected "modes" or feature areas. Below is the status of each:'
    )
    pdf.ln(2)
    modes = [
        ('Job Card 7-Stage Workflow', 'COMPLETE', 'Full reception-to-delivery pipeline with advance API'),
        ('PPF Warranty Module', 'COMPLETE', 'Registration, 5-checkup tracking, list & form views'),
        ('Ceramic Warranty Module', 'COMPLETE', 'Registration, 4-maintenance tracking, list & form views'),
        ('Booking Management', 'COMPLETE', 'List, create, calendar views with API integration'),
        ('Lead CRM', 'COMPLETE', 'List, detail, create with source/budget tracking'),
        ('Invoice Management', 'COMPLETE', 'List, detail, payment status, print support'),
        ('Operations Logging', 'COMPLETE', 'List and form with timestamps'),
        ('Stock Management', 'COMPLETE', 'List and form for inventory items'),
        ('Leave Management', 'COMPLETE', 'List and form with approval workflow'),
        ('Pick & Drop Logistics', 'COMPLETE', 'List, form, and driver dashboard'),
        ('Request/Approvals', 'COMPLETE', 'List and form with status tracking'),
        ('HR Employee Directory', 'COMPLETE', 'Employee list with department info'),
        ('Payroll Console', 'COMPLETE', 'Salary management interface'),
        ('Attendance Tracking', 'COMPLETE', 'PIN-based attendance logging'),
        ('Finance Overview', 'COMPLETE', 'Budget, COA, transaction entry views'),
        ('Workshop Diary', 'COMPLETE', 'Daily snapshot capture with historical table'),
        ('Portfolio / Executive', 'COMPLETE', 'Executive dashboard with management display'),
        ('Mission Control', 'COMPLETE', 'Operational calendar with daily stats'),
        ('Register Page', 'NEW', 'User self-registration with JWT auto-login'),
        ('Reports Dashboard', 'NEW', 'Aggregated reports for jobs, revenue, HR, inventory'),
        ('Chat Support', 'NEW', 'Functional messaging interface with state management'),
        ('PDF Print System', 'COMPLETE', 'Centralized PDF generation via WeasyPrint'),
    ]
    pdf.table_row('Module', 'Status', 'Description', header=True)
    for mod, status, desc in modes:
        pdf.set_font('Helvetica', '', 8)
        pdf.set_text_color(50, 50, 50)
        fill = False
        pdf.cell(50, 7, mod, border=1, fill=fill)
        color = (16, 185, 129) if status == 'COMPLETE' else (245, 158, 11)
        pdf.set_text_color(*color)
        pdf.set_font('Helvetica', 'B', 8)
        pdf.cell(20, 7, status, border=1, fill=fill)
        pdf.set_text_color(50, 50, 50)
        pdf.set_font('Helvetica', '', 8)
        pdf.cell(0, 7, desc, border=1, fill=fill, new_x="LMARGIN", new_y="NEXT")

    # ========== 13. COMPLETION STATUS ==========
    pdf.add_page()
    pdf.chapter_title('13. Current Completion Status')
    pdf.body_text(
        'Overall project completion is estimated at approximately 85%. The core business logic is fully '
        'functional. The following items were identified as incomplete and have been addressed:'
    )
    pdf.section_title('Previously Incomplete (Now Fixed)')
    fixed = [
        'Register Page - Was a "Coming Soon" placeholder, now has a full registration form with validation',
        'Reports Dashboard - Was a "Coming Soon" placeholder, now has aggregated reports with real API data',
        'Chat Module - Was static with hardcoded messages, now has functional message state management',
        'Mission Control - Had mock data, now connected to backend API for live operational stats',
        'Portfolio Page - Had hardcoded personnel data, now pulls from API with dynamic tasks',
        'Job Workflow Badges - Had demo data, now shows real job data (photos, bay, inspection status)',
    ]
    for item in fixed:
        pdf.bullet_point(item)

    pdf.section_title('Print System')
    pdf.body_text(
        'All forms, job cards, invoices, and reports support PDF printing via the WeasyPrint engine. '
        'The frontend includes proper @media print CSS rules for browser-based printing, and the backend '
        'provides downloadable PDF generation via /forms/utils/generate-pdf/{model}/{pk}/.'
    )

    pdf.ln(10)
    pdf.set_font('Helvetica', 'I', 10)
    pdf.set_text_color(130, 130, 130)
    pdf.cell(0, 8, '--- End of Document ---', align='C')

    # Save
    output_path = r'r:\webplot\EliteShine_Project_Documentation.pdf'
    pdf.output(output_path)
    print(f'PDF generated successfully: {output_path}')
    return output_path


if __name__ == '__main__':
    generate()
