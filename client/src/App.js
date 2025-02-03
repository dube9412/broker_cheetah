import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequestQuote from "./components/RequestQuote";

// Components
import NavBar from "./components/NavBar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import LoanTypeSelection from "./pages/LoanTypeSelection";
import FixAndFlipSearch from "./pages/FixAndFlipSearch";
import ManageLoanPrograms from "./components/ManageLoanPrograms";

// Admin-only
import AddLender from "./components/AddLender";
import EditLender from "./components/EditLender";

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Go to Manage Loan Programs Page*/}
          <Route path="/manage-loan-programs/:lenderId" element={<ManageLoanPrograms />} />


          {/* Loan type & search */}
          <Route path="/select-loan-type" element={<LoanTypeSelection />} />
          <Route path="/search/fixandflip" element={<FixAndFlipSearch />} /> 

          {/* Request Quote */}
          <Route path="/request-quote/:lenderId" element={<RequestQuote />} />
  
          {/* Admin only route for adding & editing lenders */}
          <Route path="/add-lender" element={<AddLender />} />
          <Route path="/edit-lender/:id" element={<EditLender />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
