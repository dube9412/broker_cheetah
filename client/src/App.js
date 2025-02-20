import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
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


// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LoanTypeSelection from "./pages/LoanTypeSelection";
import FixAndFlipSearch from "./pages/FixAndFlipSearch";
import ManageLoanPrograms from "./pages/ManageLoanPrograms";
import FixAndFlipCalc from "./pages/FixAndFlipCalc";
import HardMoneyClass from "./pages/HardMoneyClass";
import LessonPage from "./pages/LessonPage";
import lessons from "./data/lessons";


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
      <Router>
        <div className="min-h-screen bg-gray-50">
          <NavBar />
          <div className="container mx-auto p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/manage-loan-programs/:lenderId" element={<ManageLoanPrograms />} />
              <Route path="/hard-money-class" element={<HardMoneyClass />} />
              <Route path="/hard-money-class/:lessonId" element={<LessonPage />} />
              <Route path="/fix-and-flip-calculator" element={<FixAndFlipCalc />} />

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
            </Routes>
          </div>
          <footer className="bg-blue-700 text-white p-4 text-center shadow-inner">
            &copy; {new Date().getFullYear()} Broker Cheetah. All rights reserved.
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

