import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PPFList from './pages/ppf/PPFList';
import PPFForm from './pages/ppf/PPFForm';
import PPFDetail from './pages/ppf/PPFDetail';
import CeramicList from './pages/ceramic/CeramicList';
import CeramicForm from './pages/ceramic/CeramicForm';
import CeramicDetail from './pages/ceramic/CeramicDetail';
import JobList from './pages/jobs/JobList';
import JobCreate from './pages/jobs/JobCreate';
import JobDetail from './pages/jobs/JobDetail';
import JobBoard from './pages/jobs/JobBoard';
import EstimateDetail from './pages/estimates/EstimateDetail';
import BookingList from './pages/bookings/BookingList';
import BookingForm from './pages/bookings/BookingForm';
import LeadList from './pages/leads/LeadList';
import LeadDetail from './pages/leads/LeadDetail';
import LeadForm from './pages/leads/LeadForm';
import MockInbox from './pages/leads/MockInbox';
import InvoiceList from './pages/invoices/InvoiceList';
import InvoiceDetail from './pages/invoices/InvoiceDetail';
import OperationList from './pages/operations/OperationList';
import OperationForm from './pages/operations/OperationForm';
import StockList from './pages/stock/StockList';
import StockForm from './pages/stock/StockForm';
import StockMovement from './pages/stock/StockMovement';
import SupplierList from './pages/stock/SupplierList';
import ProcurementManager from './pages/stock/ProcurementManager';
import StockScanner from './pages/stock/StockScanner';
import LeaveList from './pages/leaves/LeaveList';
import LeaveForm from './pages/leaves/LeaveForm';
import PickDropList from './pages/pick_drop/PickDropList';
import PickDropForm from './pages/pick_drop/PickDropForm';
import CustomerPortal from './pages/portal/CustomerPortal';
import DriverDashboard from './pages/pick_drop/DriverDashboard';
import RequestList from './pages/requests/RequestList';
import RequestForm from './pages/requests/RequestForm';
import AttendanceList from './pages/attendance/AttendanceList';
import Portfolio from './pages/Portfolio';
import FinanceOverview from './pages/finance/FinanceOverview';
import BudgetManager from './pages/finance/BudgetManager';
import TransactionEntry from './pages/finance/TransactionEntry';
import ChartOfAccounts from './pages/finance/ChartOfAccounts';
import FinancialReports from './pages/finance/FinancialReports';
import WorkshopDiary from './pages/dashboard/WorkshopDiary';
import AnalyticsDashboard from './pages/dashboard/AnalyticsDashboard';
import EmployeeDirectory from './pages/hr/EmployeeDirectory';
import EmployeeRegistration from './pages/hr/EmployeeRegistration';
import PayrollConsole from './pages/hr/PayrollConsole';
import HRRules from './pages/hr/HRRules';
import HRRoster from './pages/hr/HRRoster';
import AttendanceBoard from './pages/hr/AttendanceBoard';
import TeamManagement from './pages/hr/TeamManagement';
import AccessManagement from './pages/hr/AccessManagement';
import EliteProDashboard from './pages/elitepro/EliteProDashboard';
import ShipmentManagement from './pages/elitepro/ShipmentManagement';
import InventoryManagement from './pages/elitepro/InventoryManagement';
import MissionControl from './pages/MissionControl';
import Chat from './pages/Chat';
import RegisterPage from './pages/RegisterPage';
import ReportsPage from './pages/ReportsPage';
import SalesDashboard from './pages/dashboard/SalesDashboard';
import CustomerList from './pages/customers/CustomerList';
import SchedulePage from './pages/scheduling/SchedulePage';
import UnderConstruction from './pages/UnderConstruction';
import AdvisorDashboard from './pages/dashboard/AdvisorDashboard';
import AdvisorDailyReport from './pages/dashboard/AdvisorDailyReport';
import { AuthProvider, useAuth } from './context/AuthContext';
import ServiceAdvisorForm from './pages/forms/ServiceAdvisorForm';
import ChecklistForm from './pages/forms/ChecklistForm';
import PPFWarrantyForm from './pages/forms/PPFWarrantyForm';
import FormsHub from './pages/hubs/FormsHub';
import MediaLibrary from './pages/hubs/MediaLibrary';
import WorkshopHub from './pages/workshop/WorkshopHub';
import HRHub from './pages/hr/HRHub';
import BackgroundCarousel from './components/BackgroundCarousel';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <BackgroundCarousel />
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
      </Router>
    </AuthProvider>
  );
}

export default App;
