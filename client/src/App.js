import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { LenderAuthProvider } from "./context/LenderAuthContext"; // ✅ Import LenderAuthProvider
import { useContext } from "react";


// Components
import NavBar from "./components/NavBar";
import AddFixAndFlip from "./components/AddFixAndFlip";
import EditFixAndFlip from "./components/EditFixAndFlip";
import AddDSCR from "./components/AddDSCR";
import EditDSCR from "./components/EditDSCR";
import AddStabilizedBridge from "./components/AddStabilizedBridge";
import EditStabilizedBridge from "./components/EditStabilizedBridge";
import AddPortfolio from "./components/AddPortfolio";
import EditPortfolio from "./components/EditPortfolio";
import AddGroundUp from "./components/AddGroundUp";
import EditGroundUp from "./components/EditGroundUp";
import FixAndFlipQuoteModal from "./components/FixAndFlipQuoteModal"; // Import FixAndFlipQuoteModal
import ChatHead from "./components/ChatHead"; // Import ChatHead

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Pipeline from "./pages/Pipeline";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminLenders from "./pages/admin/AdminLenders"; 
import AdminLenderUsers from "./pages/admin/AdminLenderUsers";
import AdminLenderApprovals from "./pages/admin/AdminLenderApprovals";
import AdminHelpTickets from "./pages/admin/AdminHelpTickets";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminScrapers from "./pages/admin/AdminScrapers";
import AdminJSONTools from "./pages/admin/AdminJSONTools";
import AdminImportData from "./pages/admin/AdminImportData.js";
import AdminDocuments from "./pages/admin/AdminDocuments";

// Loan Type Pages

import ManageLoanPrograms from "./pages/ManageLoanPrograms";
import FixAndFlipCalc from "./pages/FixAndFlipCalc";
import HardMoneyClass from './pages/HardMoneyClass';
import LessonPage from "./pages/LessonPage";

// Search Pages
import LoanTypeSelection from "./pages/Search/LoanTypeSelection.js";
import FixAndFlipSearch from "./pages/Search/FixAndFlipSearch.js";
import DSCRSearch from "./pages/Search/DSCRSearch.js";
import GroundUpSearch from "./pages/Search/GroundUpSearch";
import StabilizedBridgeSearch from "./pages/Search/StabilizedBridgeSearch";
import PortfolioSearch from "./pages/Search/PortfolioSearch";

// Lender Portal Pages
import LenderProtectedRoutes from './components/LenderProtectedRoutes';
import LenderDashboard from './pages/LenderPortal/LenderDashboard';
import LenderDocuments from './pages/LenderPortal/LenderDocuments';
import LenderLogin from './pages/LenderPortal/LenderLogin'; // Optional if separate login
import LenderSignup from './pages/LenderPortal/LenderSignup';
import LenderAwaitingAssignment from './pages/LenderPortal/LenderAwaitingAssignment'; //Import
import LenderAwaitingApproval from './pages/LenderPortal/LenderAwaitingApproval';

import SubmitHelpTicket from './pages/user/SubmitHelpTicket'; // ✅ Corrected path
import Notifications from "./pages/Notifications"; // Import Notifications

import NotFound from './pages/NotFound';


// Admin-only
import AddLender from "./components/AddLender";
import EditLender from "./components/EditLender";

// Protected Admin Route
const ProtectedAdminRoute = ({ children }) => {
  const { isAdmin, isSuperAdmin } = useContext(AuthContext);
  if (!isAdmin && !isSuperAdmin) {
    return <Navigate to="/" />;
  }
  return children;
};

// ✅ New Protected Lender Route
const ProtectedLenderRoute = ({ children }) => {
  const { isLender } = useContext(AuthContext);
  if (!isLender) {
    return <Navigate to="/lender/login" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <LenderAuthProvider> {/* ✅ Add LenderAuthProvider here */}
        <Router>
          <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="container mx-auto p-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                <Route path="/lender/login" element={<LenderLogin />} />
                <Route path="/lender/signup" element={<LenderSignup />} />
                <Route path="/lender/awaiting-assignment" element={<LenderAwaitingAssignment />} />
                <Route path="/lender/awaiting-approval" element={<LenderAwaitingApproval />} />

              <Route path="/manage-loan-programs/:lenderId" element={<ManageLoanPrograms />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/lenders" element={<AdminLenders />} />
              <Route path="/admin/lender-users" element={<AdminLenderUsers />} />
              
              <Route
                  path="/admin/lender-approvals"
                  element={
                    <ProtectedAdminRoute>
                      <AdminLenderApprovals />
                    </ProtectedAdminRoute>
                  }
                />
              <Route path="/admin/help-tickets" element={<ProtectedAdminRoute><AdminHelpTickets /></ProtectedAdminRoute>} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/scrapers" element={<AdminScrapers />} />
              <Route path="/admin/json-tools" element={<AdminJSONTools />} />
              <Route path="/admin/import-data" element={<AdminImportData />} />
              <Route path="/admin/documents" element={<ProtectedAdminRoute><AdminDocuments /></ProtectedAdminRoute>} />
              <Route path="/hard-money-class" element={<HardMoneyClass />} />
              <Route path="/hard-money-class/:lessonId" element={<LessonPage />} />
              <Route path="/fix-and-flip-calculator" element={<FixAndFlipCalc />} />
              <Route path="/pipeline" element={<Pipeline />} />

              {/* Loan type & search */}
              <Route path="/lender-search" element={<LoanTypeSelection />} />
              <Route path="/search/fixandflip" element={<FixAndFlipSearch />} />
              <Route path="/search/dscr" element={<DSCRSearch />} />
              <Route path="/search/groundup" element={<GroundUpSearch />} />
              <Route path="/search/stabilizedbridge" element={<StabilizedBridgeSearch />} />
              <Route path="/search/portfolio" element={<PortfolioSearch />} />

              {/* Admin Dashboard */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />

          

              {/* Admin only routes for adding & editing lenders */}
              <Route path="/add-lender" element={<AddLender />} />
              <Route path="/edit-lender/:id" element={<EditLender />} />
              <Route path="/add-fix-and-flip-program/:lenderId" element={<AddFixAndFlip />} />
              <Route path="/edit-fix-and-flip-program/:lenderId/:programId" element={<EditFixAndFlip />} />
              <Route path="/add-dscr-program/:lenderId" element={<AddDSCR />} />
              <Route path="/edit-dscr-program/:lenderId/:programId" element={<EditDSCR />} />
              <Route path="/add-stabilized-bridge-program/:lenderId" element={<AddStabilizedBridge />} />
              <Route path="/edit-stabilized-bridge-program/:lenderId/:programId" element={<EditStabilizedBridge />} />
              <Route path="/add-portfolio-program/:lenderId" element={<AddPortfolio />} />
              <Route path="/edit-portfolio-program/:lenderId/:programId" element={<EditPortfolio />} />
              <Route path="/add-ground-up-program/:lenderId" element={<AddGroundUp />} />
              <Route path="/edit-ground-up-program/:lenderId/:programId" element={<EditGroundUp />} />

                <Route path="/lender/manage-loan-programs/:lenderId" element={<ProtectedLenderRoute><ManageLoanPrograms /></ProtectedLenderRoute>} />
                <Route path="/lender/add-fix-and-flip-program/:lenderId" element={<ProtectedLenderRoute><AddFixAndFlip /></ProtectedLenderRoute>} />
                <Route path="/lender/edit-fix-and-flip-program/:lenderId/:programId" element={<ProtectedLenderRoute><EditFixAndFlip /></ProtectedLenderRoute>} />
                <Route path="/lender/add-dscr-program/:lenderId" element={<ProtectedLenderRoute><AddDSCR /></ProtectedLenderRoute>} />
                <Route path="/lender/edit-dscr-program/:lenderId/:programId" element={<ProtectedLenderRoute><EditDSCR /></ProtectedLenderRoute>} />
                <Route path="/lender/add-ground-up-program/:lenderId" element={<ProtectedLenderRoute><AddGroundUp /></ProtectedLenderRoute>} />
                <Route path="/lender/edit-ground-up-program/:lenderId/:programId" element={<ProtectedLenderRoute><EditGroundUp /></ProtectedLenderRoute>} />
                <Route path="/lender/add-portfolio-program/:lenderId" element={<ProtectedLenderRoute><AddPortfolio /></ProtectedLenderRoute>} />
                <Route path="/lender/edit-portfolio-program/:lenderId/:programId" element={<ProtectedLenderRoute><EditPortfolio /></ProtectedLenderRoute>} />
                <Route path="/lender/add-stabilized-bridge-program/:lenderId" element={<ProtectedLenderRoute><AddStabilizedBridge /></ProtectedLenderRoute>} />
                <Route path="/lender/edit-stabilized-bridge-program/:lenderId/:programId" element={<ProtectedLenderRoute><EditStabilizedBridge /></ProtectedLenderRoute>} />
                <Route path="/lender/edit-lender/:lenderId" element={<ProtectedLenderRoute><EditLender /></ProtectedLenderRoute>} />

              {/* Help Tickets */}
              <Route path="/help-tickets" element={<SubmitHelpTicket />} />

              {/* Notifications */}
              <Route path="/notifications" element={<Notifications />} />

             {/* Lender Portal (protected) */}
             <Route path="/lender/*" element={<LenderProtectedRoutes />}>
    <Route path="dashboard" element={<LenderDashboard />} />
    <Route path="documents" element={<LenderDocuments />} />
    
    <Route path="lender-documents" element={<LenderDocuments />} />

              </Route>
  
  {/* Fallback Route */}
  <Route path="*" element={<NotFound />} />
  <Route path="/fix-and-flip-quote" element={<FixAndFlipQuoteModal />} />
            </Routes>
          </div>
          <ChatHead /> {/* Add ChatHead component */}
          <footer className="bg-blue-700 text-white p-4 text-center shadow-inner">
            &copy; {new Date().getFullYear()} Broker Cheetah. All rights reserved.
          </footer>
        </div>
      </Router>
      </LenderAuthProvider>
    </AuthProvider>
  );
}

export default App;