import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import BackgroundCarousel from './components/BackgroundCarousel';

// Loading component for Suspense fallback
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    color: '#b08d57',
    fontSize: '14px',
    fontWeight: '600'
  }}>
    Loading...
  </div>
);

// Auth pages (keep eager for fast initial load)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

// Lazy load all other pages by module
// Dashboard
const WorkshopDiary = lazy(() => import('./pages/dashboard/WorkshopDiary'));
const AnalyticsDashboard = lazy(() => import('./pages/dashboard/AnalyticsDashboard'));
const SalesDashboard = lazy(() => import('./pages/dashboard/SalesDashboard'));
const AdvisorDashboard = lazy(() => import('./pages/dashboard/AdvisorDashboard'));
const AdvisorDailyReport = lazy(() => import('./pages/dashboard/AdvisorDailyReport'));
const MissionControl = lazy(() => import('./pages/MissionControl'));

// Jobs
const JobList = lazy(() => import('./pages/jobs/JobList'));
const JobCreate = lazy(() => import('./pages/jobs/JobCreate'));
const JobDetail = lazy(() => import('./pages/jobs/JobDetail'));
const JobBoard = lazy(() => import('./pages/jobs/JobBoard'));
const EstimateDetail = lazy(() => import('./pages/estimates/EstimateDetail'));

// Warranties
const PPFList = lazy(() => import('./pages/ppf/PPFList'));
const PPFForm = lazy(() => import('./pages/ppf/PPFForm'));
const PPFDetail = lazy(() => import('./pages/ppf/PPFDetail'));
const CeramicList = lazy(() => import('./pages/ceramic/CeramicList'));
const CeramicForm = lazy(() => import('./pages/ceramic/CeramicForm'));
const CeramicDetail = lazy(() => import('./pages/ceramic/CeramicDetail'));

// Bookings & Leads
const BookingList = lazy(() => import('./pages/bookings/BookingList'));
const BookingForm = lazy(() => import('./pages/bookings/BookingForm'));
const LeadList = lazy(() => import('./pages/leads/LeadList'));
const LeadDetail = lazy(() => import('./pages/leads/LeadDetail'));
const LeadForm = lazy(() => import('./pages/leads/LeadForm'));
const MockInbox = lazy(() => import('./pages/leads/MockInbox'));

// Invoices & Operations
const InvoiceList = lazy(() => import('./pages/invoices/InvoiceList'));
const InvoiceDetail = lazy(() => import('./pages/invoices/InvoiceDetail'));
const OperationList = lazy(() => import('./pages/operations/OperationList'));
const OperationForm = lazy(() => import('./pages/operations/OperationForm'));

// Stock
const StockList = lazy(() => import('./pages/stock/StockList'));
const StockForm = lazy(() => import('./pages/stock/StockForm'));
const StockMovement = lazy(() => import('./pages/stock/StockMovement'));
const SupplierList = lazy(() => import('./pages/stock/SupplierList'));
const ProcurementManager = lazy(() => import('./pages/stock/ProcurementManager'));
const StockScanner = lazy(() => import('./pages/stock/StockScanner'));

// HR
const EmployeeDirectory = lazy(() => import('./pages/hr/EmployeeDirectory'));
const EmployeeRegistration = lazy(() => import('./pages/hr/EmployeeRegistration'));
const PayrollConsole = lazy(() => import('./pages/hr/PayrollConsole'));
const HRRules = lazy(() => import('./pages/hr/HRRules'));
const HRRoster = lazy(() => import('./pages/hr/HRRoster'));
const AttendanceBoard = lazy(() => import('./pages/hr/AttendanceBoard'));
const TeamManagement = lazy(() => import('./pages/hr/TeamManagement'));
const AccessManagement = lazy(() => import('./pages/hr/AccessManagement'));
const HRHub = lazy(() => import('./pages/hr/HRHub'));

// Finance
const FinanceOverview = lazy(() => import('./pages/finance/FinanceOverview'));
const BudgetManager = lazy(() => import('./pages/finance/BudgetManager'));
const TransactionEntry = lazy(() => import('./pages/finance/TransactionEntry'));
const ChartOfAccounts = lazy(() => import('./pages/finance/ChartOfAccounts'));
const FinancialReports = lazy(() => import('./pages/finance/FinancialReports'));

// Leaves & Requests
const LeaveList = lazy(() => import('./pages/leaves/LeaveList'));
const LeaveForm = lazy(() => import('./pages/leaves/LeaveForm'));
const RequestList = lazy(() => import('./pages/requests/RequestList'));
const RequestForm = lazy(() => import('./pages/requests/RequestForm'));

// Pick & Drop
const PickDropList = lazy(() => import('./pages/pick_drop/PickDropList'));
const PickDropForm = lazy(() => import('./pages/pick_drop/PickDropForm'));
const DriverDashboard = lazy(() => import('./pages/pick_drop/DriverDashboard'));

// Portal & Attendance
const CustomerPortal = lazy(() => import('./pages/portal/CustomerPortal'));
const AttendanceList = lazy(() => import('./pages/attendance/AttendanceList'));

// ElitePro
const EliteProDashboard = lazy(() => import('./pages/elitepro/EliteProDashboard'));
const ShipmentManagement = lazy(() => import('./pages/elitepro/ShipmentManagement'));
const InventoryManagement = lazy(() => import('./pages/elitepro/InventoryManagement'));

// Forms & Hubs
const FormsHub = lazy(() => import('./pages/hubs/FormsHub'));
const MediaLibrary = lazy(() => import('./pages/hubs/MediaLibrary'));
const WorkshopHub = lazy(() => import('./pages/workshop/WorkshopHub'));
const ServiceAdvisorForm = lazy(() => import('./pages/forms/ServiceAdvisorForm'));
const ChecklistForm = lazy(() => import('./pages/forms/ChecklistForm'));
const PPFWarrantyForm = lazy(() => import('./pages/forms/PPFWarrantyForm'));

// Other
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Chat = lazy(() => import('./pages/Chat'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const CustomerList = lazy(() => import('./pages/customers/CustomerList'));
const SchedulePage = lazy(() => import('./pages/scheduling/SchedulePage'));
const UnderConstruction = lazy(() => import('./pages/UnderConstruction'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <BackgroundCarousel />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/portal/:token" element={<CustomerPortal />} />
            </Route>

            {/* Main App Routes */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/mission-control" element={<MissionControl />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/ppf" element={<PPFList />} />
              <Route path="/ppf/create" element={<PPFForm />} />
              <Route path="/ppf/:id" element={<PPFDetail />} />
              <Route path="/ceramic" element={<CeramicList />} />
              <Route path="/ceramic/create" element={<CeramicForm />} />
              <Route path="/ceramic/:id" element={<CeramicDetail />} />
              <Route path="/job-cards" element={<JobList />} />
              <Route path="/job-board" element={<JobBoard />} />
              <Route path="/job-cards/create" element={<JobCreate />} />
              <Route path="/job-cards/:id" element={<JobDetail />} />
              <Route path="/estimates/:id" element={<EstimateDetail />} />
              <Route path="/bookings" element={<BookingList />} />
              <Route path="/bookings/create" element={<BookingForm />} />
              <Route path="/leads" element={<LeadList />} />
              <Route path="/leads/:id" element={<LeadDetail />} />
              <Route path="/leads/create" element={<LeadForm />} />
              <Route path="/leads/inbox" element={<MockInbox />} />
              <Route path="/invoices" element={<InvoiceList />} />
              <Route path="/invoices/:id" element={<InvoiceDetail />} />
              <Route path="/operations" element={<OperationList />} />
              <Route path="/operations/create" element={<OperationForm />} />
              <Route path="/stock" element={<StockList />} />
              <Route path="/stock/create" element={<StockForm />} />
              <Route path="/stock/movement" element={<StockMovement />} />
              <Route path="/stock/suppliers" element={<SupplierList />} />
              <Route path="/stock/procurement" element={<ProcurementManager />} />
              <Route path="/stock/scanner" element={<StockScanner />} />
              <Route path="/leaves" element={<LeaveList />} />
              <Route path="/leaves/create" element={<LeaveForm />} />
              <Route path="/requests" element={<RequestList />} />
              <Route path="/requests/create" element={<RequestForm />} />
              <Route path="/pick-drop" element={<DriverDashboard />} />
              <Route path="/pick-drop/list" element={<PickDropList />} />
              <Route path="/pick-drop/create" element={<PickDropForm />} />
              <Route path="/finance" element={<FinanceOverview />} />
              <Route path="/finance/budget" element={<BudgetManager />} />
              <Route path="/finance/transaction" element={<TransactionEntry />} />
              <Route path="/finance/coa" element={<ChartOfAccounts />} />
              <Route path="/finance/reports" element={<FinancialReports />} />
              <Route path="/workshop-diary" element={<WorkshopDiary />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/hr" element={<EmployeeDirectory />} />
              <Route path="/hr/register" element={<EmployeeRegistration />} />
              <Route path="/hr/payroll" element={<PayrollConsole />} />
              <Route path="/hr/rules" element={<HRRules />} />
              <Route path="/hr/roster" element={<HRRoster />} />
              <Route path="/hr/attendance" element={<AttendanceList />} />
              <Route path="/hr/attendance-board" element={<AttendanceBoard />} />
              <Route path="/hr/hub" element={<HRHub />} />
              <Route path="/workshop" element={<WorkshopHub />} />

              {/* ElitePro Trading */}
              <Route path="/elitepro" element={<EliteProDashboard />} />
              <Route path="/elitepro/dashboard" element={<EliteProDashboard />} />
              <Route path="/elitepro/shipments" element={<ShipmentManagement />} />
              <Route path="/elitepro/inventory" element={<InventoryManagement />} />

              {/* Access Management */}
              <Route path="/hr/access" element={<AccessManagement />} />
              {/* Digital Forms & Checklists & Hubs */}
              <Route path="/forms" element={<FormsHub />} />
              <Route path="/media" element={<MediaLibrary />} />
              <Route path="/service-advisor/form" element={<ServiceAdvisorForm />} />
              <Route path="/detailing/checklist" element={
                <ChecklistForm title="Detailing Checklist" packages={{
                  "Silver": ["Washing with high-quality car shampoo", "Clay bar embedded contaminants", "6 step Compound Body Polish", "Swirl Marks Removal", "Sealant and synthetic wax", "Engine bay Degreasing", "Wheel Rim cleaning"],
                  "Gold": ["Washing with Foam shampoo", "Clay bar removal", "6 step Compound Body Polish (Premium)", "Nano Waxing", "Engine bay decontamination & steam", "Interior Deep Cleaning"]
                }} />
              } />
              <Route path="/ceramic/checklist" element={
                <ChecklistForm title="Ceramic Coating Check" packages={{
                  "Silver (2-3 Yr)": ["2 Layer of 9H on exterior", "1 Layer of 9H on plastics", "1 Layer on wheel & calliper", "1 Layer on glass"],
                  "Gold (5 Yr)": ["6 Layer of 9H & 10H on Exterior", "1 Layer 9H on plastics", "1 Layer 9H on chrome", "1 Layer 9H on leather"],
                  "Graphene": ["6 Layer Graphene Exterior", "1 Layer 9H Plastics", "1 Layer Wheel/Caliper"]
                }} />
              } />
              <Route path="/ppf/warranty" element={<PPFWarrantyForm />} />

              {/* End Digital Forms */}

              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/chat" element={<Chat />} />

              {/* Phase 9 Routes */}
              <Route path="/sales" element={<SalesDashboard />} />
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/scheduling" element={<SchedulePage />} />
              <Route path="/advisor-dashboard" element={<AdvisorDashboard />} />
              <Route path="/advisor-daily-report" element={<AdvisorDailyReport />} />
              <Route path="/construction" element={<UnderConstruction />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
