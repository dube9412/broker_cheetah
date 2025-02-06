import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequestQuote from "./components/RequestQuote";

// Components
import NavBar from "./components/NavBar";
import AddFixAndFlip from "./components/AddFixAndFlip";
import EditFixAndFlip from "./components/EditFixAndFlip";  // ✅ Import the Edit component For Fix and Flip

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import LoanTypeSelection from "./pages/LoanTypeSelection";
import FixAndFlipSearch from "./pages/FixAndFlipSearch";
import ManageLoanPrograms from "./pages/ManageLoanPrograms";

// Admin-only
import AddLender from "./components/AddLender";
import EditLender from "./components/EditLender";

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

              {/* Loan type & search */}
              <Route path="/select-loan-type" element={<LoanTypeSelection />} />
              <Route path="/search/fixandflip" element={<FixAndFlipSearch />} /> 

              {/* Request Quote */}
              <Route path="/request-quote/:lenderId" element={<RequestQuote />} />
  
              {/* Admin only route for adding & editing lenders */}
              <Route path="/add-lender" element={<AddLender />} />
              <Route path="/edit-lender/:id" element={<EditLender />} />

              <Route path="/add-fix-and-flip/:lenderId" element={<AddFixAndFlip />} />
              <Route path="/edit-fix-and-flip/:lenderId/:programId" element={<EditFixAndFlip />} />

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
