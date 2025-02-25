import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { LenderAuthProvider } from "./context/LenderAuthContext"; // ✅ Import LenderAuthProvider
import RequestQuote from "./components/RequestQuote";
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
import OneClickQuoteModal from "./components/OneClickQuoteModal";



// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
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
import LoanTypeSelection from "./pages/LoanTypeSelection";
import FixAndFlipSearch from "./pages/FixAndFlipSearch";
import ManageLoanPrograms from "./pages/ManageLoanPrograms";
import FixAndFlipCalc from "./pages/FixAndFlipCalc";
import HardMoneyClass from "./pages/HardMoneyClass";
import LessonPage from "./pages/LessonPage";


import LenderProtectedRoutes from './components/LenderProtectedRoutes';
import LenderDashboard from './pages/LenderPortal/LenderDashboard';
import LenderDocuments from './pages/LenderPortal/LenderDocuments';
import LenderLogin from './pages/LenderPortal/LenderLogin'; // Optional if separate login
import LenderSignup from './pages/LenderPortal/LenderSignup';




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
              <Route path="/admin/help-tickets" element={<AdminHelpTickets />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/scrapers" element={<AdminScrapers />} />
              <Route path="/admin/json-tools" element={<AdminJSONTools />} />
              <Route path="/admin/import-data" element={<AdminImportData />} />
              <Route path="/hard-money-class" element={<HardMoneyClass />} />
              <Route path="/hard-money-class/:lessonId" element={<LessonPage />} />
              <Route path="/fix-and-flip-calculator" element={<FixAndFlipCalc />} />
              <Route path="/one-click-quote" element={<OneClickQuoteModal />} />

              {/* Loan type & search */}
              <Route path="/select-loan-type" element={<LoanTypeSelection />} />
              <Route path="/search/fixandflip" element={<FixAndFlipSearch />} />

              {/* Admin Dashboard */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />

              {/* Request Quote */}
              <Route path="/request-quote/:lenderId" element={<RequestQuote />} />

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

             {/* Lender Portal (protected) */}
  <Route path="/lender/*" element={<LenderProtectedRoutes />}>
    <Route path="dashboard" element={<LenderDashboard />} />
    <Route path="documents" element={<LenderDocuments />} />
    
    {/* more lender-specific routes later */}
  </Route>
  
  {/* Fallback Route */}
  <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
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

