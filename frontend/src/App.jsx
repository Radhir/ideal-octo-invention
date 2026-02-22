import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PermissionProvider } from './context/PermissionContext';
import { BranchProvider } from './context/BranchContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { BrandProvider } from './context/BrandContext';
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
import PasswordResetRequestPage from './pages/PasswordResetRequestPage'; // Eager load for auth flow
import PasswordResetConfirmPage from './pages/PasswordResetConfirmPage'; // Eager load for auth flow
import HomePage from './pages/HomePage';

// Lazy load all other pages by module
const WorkshopDiary = lazy(() => import('./pages/finance/WorkshopDiary'));
const FinanceInvoiceBook = lazy(() => import('./pages/finance/InvoiceBook')); // Renamed to avoid conflict
const CommissionDashboard = lazy(() => import('./pages/finance/CommissionDashboard'));
const AdvisorDashboard = lazy(() => import('./pages/dashboard/AdvisorDashboard'));
const OperationsDashboard = lazy(() => import('./pages/dashboard/OperationsDashboard')); // NEW
const ManagementDashboard = lazy(() => import('./pages/dashboard/ManagementDashboard')); // NEW
const TradingDashboard = lazy(() => import('./pages/dashboard/TradingDashboard')); // NEW
const LogisticsDashboard = lazy(() => import('./pages/dashboard/LogisticsDashboard')); // NEW
const AdvisorDailyReport = lazy(() => import('./pages/dashboard/AdvisorDailyReport'));
const AnalyticsDashboard = lazy(() => import('./pages/dashboard/AnalyticsDashboard'));
const CEOConsole = lazy(() => import('./pages/dashboard/CEOConsole'));
const MissionControl = lazy(() => import('./pages/MissionControl'));
const RiskAuditPage = lazy(() => import('./pages/RiskAuditPage'));

const IDCardGenerator = lazy(() => import('./pages/hr/IDCardGenerator'));
const JobList = lazy(() => import('./pages/jobs/JobList'));
const JobCardHub = lazy(() => import('./pages/jobs/JobCardHub'));
const JobCardBuilder = lazy(() => import('./pages/jobs/JobCardBuilder'));
const JobDetail = lazy(() => import('./pages/jobs/JobDetail'));
const JobBoard = lazy(() => import('./pages/jobs/JobBoard'));
const EstimateDetail = lazy(() => import('./pages/estimates/EstimateDetail'));
const JobInvoiceBook = lazy(() => import('./pages/jobs/InvoiceBook')); // New import for jobs-related InvoiceBook
const WarrantyClaims = lazy(() => import('./pages/jobs/WarrantyClaims')); // New import

const PPFList = lazy(() => import('./pages/ppf/PPFList'));
const PPFForm = lazy(() => import('./pages/ppf/PPFForm'));
const PPFDetail = lazy(() => import('./pages/ppf/PPFDetail'));
const CeramicList = lazy(() => import('./pages/ceramic/CeramicList'));
const CeramicForm = lazy(() => import('./pages/ceramic/CeramicForm'));
const CeramicDetail = lazy(() => import('./pages/ceramic/CeramicDetail'));

const BookingList = lazy(() => import('./pages/bookings/BookingList'));
const BookingForm = lazy(() => import('./pages/bookings/BookingForm'));
const LeadList = lazy(() => import('./pages/leads/LeadList'));
const LeadDetail = lazy(() => import('./pages/leads/LeadDetail'));
const LeadForm = lazy(() => import('./pages/leads/LeadForm'));
const MockInbox = lazy(() => import('./pages/leads/MockInbox'));

const InvoiceList = lazy(() => import('./pages/invoices/InvoiceList'));
const InvoiceDetail = lazy(() => import('./pages/invoices/InvoiceDetail'));
const OperationList = lazy(() => import('./pages/operations/OperationList'));
const OperationForm = lazy(() => import('./pages/operations/OperationForm'));

const StockList = lazy(() => import('./pages/stock/StockList'));
const StockForm = lazy(() => import('./pages/stock/StockForm'));
const StockMovement = lazy(() => import('./pages/stock/StockMovement'));
const SupplierList = lazy(() => import('./pages/stock/SupplierList'));
const ProcurementManager = lazy(() => import('./pages/stock/ProcurementManager'));
const StockScanner = lazy(() => import('./pages/stock/StockScanner'));
const ScannerLanding = lazy(() => import('./pages/stock/ScannerLanding'));

const EmployeeDirectory = lazy(() => import('./pages/hr/EmployeeDirectory'));
const EmployeeRegistration = lazy(() => import('./pages/hr/EmployeeRegistration'));
const EmployeeEdit = lazy(() => import('./pages/hr/EmployeeEdit'));
const PayrollConsole = lazy(() => import('./pages/hr/PayrollConsole'));
const HRRules = lazy(() => import('./pages/hr/HRRules'));
const HRRoster = lazy(() => import('./pages/hr/HRRoster'));
const AttendanceBoard = lazy(() => import('./pages/hr/AttendanceBoard'));
const TeamManagement = lazy(() => import('./pages/hr/TeamManagement'));
const AccessManagement = lazy(() => import('./pages/hr/AccessManagement'));
const HRHub = lazy(() => import('./pages/hr/HRHub'));
const HRReports = lazy(() => import('./pages/hr/HRReports'));
const TechnicianAnalytics = lazy(() => import('./pages/hr/TechnicianAnalytics'));
const CustomerLiveTracker = lazy(() => import('./pages/public/CustomerLiveTracker'));
const WarrantyPortalView = lazy(() => import('./pages/public/WarrantyPortalView'));

const WarrantyBook = lazy(() => import('./pages/warranty/WarrantyBook'));
const WarrantyForm = lazy(() => import('./pages/warranty/WarrantyForm'));
const WarrantyVerify = lazy(() => import('./pages/warranty/WarrantyVerify'));

// High Fidelity UI Overhaul Pages
const WorkshopRegistry = lazy(() => import('./pages/WorkshopRegistry'));
const BookingCalendar = lazy(() => import('./pages/BookingCalendar'));
const TeamSettings = lazy(() => import('./pages/TeamSettings'));

const FinanceOverview = lazy(() => import('./pages/finance/FinanceOverview'));
const BudgetManager = lazy(() => import('./pages/finance/BudgetManager'));
const TransactionEntry = lazy(() => import('./pages/finance/TransactionEntry'));
const ChartOfAccounts = lazy(() => import('./pages/finance/ChartOfAccounts'));
const FinancialReports = lazy(() => import('./pages/finance/FinancialReports'));
const AssetConsole = lazy(() => import('./pages/finance/AssetConsole'));
const ReceiptVoucher = lazy(() => import('./pages/finance/ReceiptVoucher'));
const PettyCashVoucher = lazy(() => import('./pages/finance/PettyCashVoucher'));
const LinkingAccount = lazy(() => import('./pages/finance/LinkingAccount'));

const LeaveList = lazy(() => import('./pages/leaves/LeaveList'));
const LeaveForm = lazy(() => import('./pages/leaves/LeaveForm'));
const RequestList = lazy(() => import('./pages/requests/RequestList'));
const RequestForm = lazy(() => import('./pages/requests/RequestForm'));
const ApprovalsHub = lazy(() => import('./pages/hr/ApprovalsHub'));

const PickDropList = lazy(() => import('./pages/pick_drop/PickDropList'));
const PickDropForm = lazy(() => import('./pages/pick_drop/PickDropForm'));
const PickDropTrackingPage = lazy(() => import('./pages/pick_drop/PickDropTrackingPage'));
const DriverDashboard = lazy(() => import('./pages/pick_drop/DriverDashboard'));

const CustomerPortal = lazy(() => import('./pages/portal/CustomerPortal'));
const AttendanceList = lazy(() => import('./pages/attendance/AttendanceList'));
const PaymentPage = lazy(() => import('./pages/payments/PaymentPage'));

const EliteProDashboard = lazy(() => import('./pages/elitepro/EliteProDashboard'));
const ShipmentManagement = lazy(() => import('./pages/elitepro/ShipmentManagement'));
const InventoryManagement = lazy(() => import('./pages/elitepro/InventoryManagement'));

const FormsHub = lazy(() => import('./pages/hubs/FormsHub'));
const MediaLibrary = lazy(() => import('./pages/hubs/MediaLibrary'));
const WorkshopPortal = lazy(() => import('./pages/workshop/WorkshopPortal'));
const WorkshopDelayForm = lazy(() => import('./pages/workshop/WorkshopDelayForm'));
const WorkshopIncidentForm = lazy(() => import('./pages/workshop/WorkshopIncidentForm'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ServiceAdvisorForm = lazy(() => import('./pages/forms/ServiceAdvisorForm'));
const ChecklistForm = lazy(() => import('./pages/forms/ChecklistForm'));
const PPFWarrantyForm = lazy(() => import('./pages/forms/PPFWarrantyForm'));

const JobCardPrint = lazy(() => import('./pages/forms/JobCardPrint'));
const InvoicePrint = lazy(() => import('./pages/forms/InvoicePrint'));
const PPFWarrantyPrint = lazy(() => import('./pages/forms/PPFWarrantyPrint'));

const JobReport = lazy(() => import('./pages/reports/JobReport'));
const FinancialReport = lazy(() => import('./pages/reports/FinancialReport'));
const InventoryReport = lazy(() => import('./pages/reports/InventoryReport'));

const Portfolio = lazy(() => import('./pages/Portfolio'));
const Chat = lazy(() => import('./pages/Chat'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SchedulingPortal = lazy(() => import('./pages/scheduling/SchedulingPortal'));
const UnderConstruction = lazy(() => import('./pages/UnderConstruction'));
const BranchManagementPage = lazy(() => import('./pages/admin/BranchManagementPage'));
const SLAOverview = lazy(() => import('./pages/sla/SLAOverview'));
const LogisticsPortal = lazy(() => import('./pages/logistics/LogisticsPortal'));
const ManagementPortal = lazy(() => import('./pages/management/ManagementPortal'));
const SalesPortal = lazy(() => import('./pages/sales/SalesPortal'));
const FinancePortal = lazy(() => import('./pages/finance/FinancePortal'));
const CustomerDetail = lazy(() => import('./pages/customers/CustomerDetail'));
const CustomerForm = lazy(() => import('./pages/customers/CustomerForm'));
const SupplierForm = lazy(() => import('./pages/stock/SupplierForm'));
const SLADetail = lazy(() => import('./pages/sla/SLADetail'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const VehicleMaster = lazy(() => import('./pages/masters/VehicleMaster'));
const VehicleForm = lazy(() => import('./pages/masters/VehicleForm'));
const ServiceMaster = lazy(() => import('./pages/masters/ServiceMaster')); // NEW
const InsuranceMaster = lazy(() => import('./pages/masters/InsuranceMaster'));
const EmployeeReports = lazy(() => import('./pages/hr/EmployeeReports')); // NEW
const DepartmentMaster = lazy(() => import('./pages/admin/DepartmentMaster')); // NEW
const HRMasters = lazy(() => import('./pages/hr/HRMasters'));
const EmployeeDocumentRegistry = lazy(() => import('./pages/hr/EmployeeDocumentRegistry'));
const VehicleConfigMaster = lazy(() => import('./pages/masters/VehicleConfigMaster'));
const PaintDashboard = lazy(() => import('./pages/paint/PaintDashboard'));
const OrderConfirmation = lazy(() => import('./pages/logistics/OrderConfirmation'));
const PurchaseEntry = lazy(() => import('./pages/logistics/PurchaseEntry'));
const AuditorDossier = lazy(() => import('./pages/finance/AuditorDossier'));
const BranchComparison = lazy(() => import('./pages/dashboard/BranchComparison'));


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AuthConditionalCarousel = () => {
  const { pathname } = useLocation();
  const authRoutes = ['/login', '/register', '/password-reset', '/reset-password'];

  // Check if it's an auth route or a customer portal route
  const isAuthPage = authRoutes.some(route => pathname.startsWith(route)) ||
    pathname.startsWith('/portal/') ||
    pathname.startsWith('/track/') ||
    pathname.startsWith('/warranty/') ||
    pathname.startsWith('/warranty-verify/');

  if (isAuthPage) return null;
  return <BackgroundCarousel />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrandProvider>
            <BranchProvider>
              <Router>
                <PermissionProvider>
                  <AuthConditionalCarousel />
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Auth Routes */}
                      <Route element={<AuthLayout />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/portal/:token" element={<CustomerPortal />} />
                        <Route path="/track/:token" element={<CustomerLiveTracker />} />
                        <Route path="/warranty/:token" element={<WarrantyPortalView />} />
                        <Route path="/warranty-verify/:token" element={<WarrantyVerify />} />
                        <Route path="/password-reset" element={<PasswordResetRequestPage />} />
                        <Route path="/reset-password/:uid/:token" element={<PasswordResetConfirmPage />} />
                      </Route>

                      {/* Main App Routes */}
                      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                        <Route path="/portfolio" element={<Portfolio />} />

                        <Route path="/profile" element={<UserProfilePage />} />
                        <Route path="/mission-control" element={<MissionControl />} />
                        <Route path="/" element={<Portfolio />} />
                        <Route path="/ceo/command" element={<CEOConsole />} />
                        <Route path="/ppf" element={<PPFList />} />
                        <Route path="/ppf/create" element={<PPFForm />} />
                        <Route path="/ppf/:id" element={<PPFDetail />} />
                        <Route path="/ceramic" element={<CeramicList />} />
                        <Route path="/ceramic/create" element={<CeramicForm />} />
                        <Route path="/ceramic/:id" element={<CeramicDetail />} />
                        <Route path="/hr/id-cards" element={<IDCardGenerator />} />
                        <Route path="/job-cards" element={<JobCardHub />} />
                        <Route path="/job-cards/list" element={<JobList />} />
                        <Route path="/job-board" element={<JobBoard />} />
                        <Route path="/job-cards/create" element={<JobCardBuilder />} />
                        <Route path="/job-cards/board" element={<JobBoard />} />
                        <Route path="/job-cards/invoice-book" element={<JobInvoiceBook />} />
                        <Route path="/job-cards/warranty" element={<WarrantyClaims />} />
                        <Route path="/job-cards/:id" element={<JobDetail />} />
                        <Route path="/estimates/:id" element={<EstimateDetail />} />
                        <Route path="/bookings" element={<BookingCalendar />} />
                        <Route path="/bookings/create" element={<BookingForm />} />
                        <Route path="/leads" element={<LeadList />} />
                        <Route path="/leads/:id" element={<LeadDetail />} />
                        <Route path="/leads/create" element={<LeadForm />} />
                        <Route path="/leads/inbox" element={<MockInbox />} />
                        <Route path="/finance/invoice-book" element={<FinanceInvoiceBook />} />
                        <Route path="/finance/commissions" element={<CommissionDashboard />} />
                        <Route path="/invoices" element={<InvoiceList />} />
                        <Route path="/invoices/:id" element={<InvoiceDetail />} />
                        <Route path="/invoices/:id/print" element={<InvoicePrint />} />
                        <Route path="/job-cards/:id/print" element={<JobCardPrint />} />
                        <Route path="/ppf/:id/print" element={<PPFWarrantyPrint />} />
                        <Route path="/operations" element={<OperationList />} />
                        <Route path="/operations/create" element={<OperationForm />} />
                        <Route path="/stock" element={<StockList />} />
                        <Route path="/stock/create" element={<StockForm />} />
                        <Route path="/stock/movement" element={<StockMovement />} />
                        <Route path="/warranty-book" element={<WarrantyBook />} />
                        <Route path="/warranty/new" element={<WarrantyForm />} />
                        <Route path="/stock/suppliers" element={<SupplierList />} />
                        <Route path="/stock/procurement" element={<ProcurementManager />} />
                        <Route path="/stock/scanner" element={<ScannerLanding />} />
                        <Route path="/stock/scanner/active" element={<StockScanner />} />
                        <Route path="/leaves" element={<LeaveList />} />
                        <Route path="/leaves/create" element={<LeaveForm />} />
                        <Route path="/requests" element={<RequestList />} />
                        <Route path="/requests/create" element={<RequestForm />} />
                        <Route path="/pick-drop" element={<DriverDashboard />} />
                        <Route path="/pick-drop/list" element={<PickDropList />} />
                        <Route path="/pick-drop/create" element={<PickDropForm />} />
                        <Route path="/pick-drop/track/:id" element={<PickDropTrackingPage />} />
                        <Route path="/finance" element={<FinancePortal />} />
                        <Route path="/finance/budget" element={<BudgetManager />} />
                        <Route path="/finance/transaction" element={<TransactionEntry />} />
                        <Route path="/finance/coa" element={<ChartOfAccounts />} />
                        <Route path="/finance/coa" element={<ChartOfAccounts />} />
                        <Route path="/finance/reports" element={<FinancialReports />} />
                        <Route path="/finance/assets" element={<AssetConsole />} />
                        <Route path="/finance/linking" element={<LinkingAccount />} />
                        <Route path="/finance/petty-cash" element={<PettyCashVoucher />} />
                        <Route path="/finance/petty-cash/approve" element={<PettyCashVoucher />} />
                        <Route path="/workshop-diary" element={<WorkshopDiary />} />
                        <Route path="/analytics" element={<AnalyticsDashboard />} />
                        <Route path="/hr" element={<HRHub />} />
                        <Route path="/hr/directory" element={<EmployeeDirectory />} />
                        <Route path="/hr/register" element={<EmployeeRegistration />} />
                        <Route path="/hr/employee/:id/edit" element={<EmployeeEdit />} />
                        <Route path="/logistics/purchase" element={<PurchaseEntry />} />
                        <Route path="/logistics/order-confirmation" element={<OrderConfirmation />} />
                        <Route path="/hr/payroll" element={<PayrollConsole />} />
                        <Route path="/hr/rules" element={<HRRules />} />
                        <Route path="/hr/roster" element={<HRRoster />} />
                        <Route path="/hr/attendance" element={<AttendanceList />} />
                        <Route path="/hr/attendance-board" element={<AttendanceBoard />} />
                        <Route path="/hr/analytics" element={<TechnicianAnalytics />} />
                        <Route path="/workshop/hub" element={<WorkshopPortal />} />
                        <Route path="/workshop/delay" element={<WorkshopDelayForm />} />
                        <Route path="/workshop/incident" element={<WorkshopIncidentForm />} />
                        <Route path="/paint/dashboard" element={<PaintDashboard />} />
                        <Route path="/risk-management" element={<RiskAuditPage />} />
                        <Route path="/projects" element={<ProjectsPage />} />

                        <Route path="/elitepro" element={<LogisticsPortal />} />
                        <Route path="/elitepro/shipments" element={<ShipmentManagement />} />
                        <Route path="/elitepro/inventory" element={<InventoryManagement />} />
                        <Route path="/finance/audit" element={<AuditorDossier />} />
                        <Route path="/dashboard/comparison" element={<BranchComparison />} />

                        <Route path="/masters/vehicles" element={<VehicleMaster />} />
                        <Route path="/masters/vehicles/config" element={<VehicleConfigMaster />} />
                        <Route path="/masters/vehicles/create" element={<VehicleForm />} />
                        <Route path="/masters/vehicles/:id/edit" element={<VehicleForm />} />

                        <Route path="/masters/users" element={<EmployeeDirectory />} />
                        <Route path="/masters/branches" element={<BranchManagementPage />} />
                        <Route path="/masters/services" element={<ServiceMaster />} />
                        <Route path="/masters/insurance" element={<InsuranceMaster />} />
                        <Route path="/admin/departments" element={<DepartmentMaster />} />

                        <Route path="/hr/access" element={<AccessManagement />} />
                        <Route path="/hr/approvals" element={<ApprovalsHub />} />
                        <Route path="/hr/masters/:tab" element={<HRMasters />} />
                        <Route path="/hr/documents" element={<EmployeeDocumentRegistry />} />
                        <Route path="/hr/reports" element={<HRReports />} />
                        <Route path="/hr/reports/employees" element={<EmployeeReports />} />
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

                        <Route path="/customers/:id" element={<CustomerDetail />} />
                        <Route path="/customers/create" element={<CustomerForm />} />
                        <Route path="/customers/:id/edit" element={<CustomerForm />} />
                        <Route path="/stock/suppliers/create" element={<SupplierForm />} />
                        <Route path="/stock/suppliers/:id/edit" element={<SupplierForm />} />

                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/reports/jobs" element={<JobReport />} />
                        <Route path="/reports/financial" element={<FinancialReport />} />
                        <Route path="/reports/inventory" element={<InventoryReport />} />
                        <Route path="/chat" element={<Chat />} />

                        <Route path="/payment/:invoiceId" element={<PaymentPage />} />
                        <Route path="/sla/:id" element={<SLADetail />} />
                        <Route path="/construction" element={<UnderConstruction />} />

                        <Route path="/admin/branches" element={<BranchManagementPage />} />
                        <Route path="/finance/receipt-voucher" element={<ReceiptVoucher />} />

                        {/* High Fidelity UI Overhaul Routes */}
                        <Route path="/scheduling" element={<SchedulingPortal />} />
                        <Route path="/sla" element={<SLAOverview />} />
                        <Route path="/menu" element={<TeamSettings />} />
                      </Route>

                      <Route path="bookmarks" element={<Navigate to="/job-cards" replace />} />

                      {/* Operations Routing */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </PermissionProvider>
              </Router>
            </BranchProvider>
          </BrandProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
