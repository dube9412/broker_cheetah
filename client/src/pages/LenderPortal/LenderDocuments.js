// src/pages/LenderPortal/LenderDocuments.js
import React, { useState, useEffect, useContext } from 'react';
import DocumentUploader from '../../components/DocumentUploader';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LenderDocuments = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loanPrograms, setLoanPrograms] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    const fetchLoanPrograms = async () => {
      try {
        const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/lenders/${user.lenderId}/loan-programs`);
        const data = await response.json();
        if (response.ok) {
          setLoanPrograms(data.loanPrograms);
        } else {
          console.error("Error fetching loan programs", data.message);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchLoanPrograms();
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="lender-portal">
      <h2>Document Management</h2>
      <p>Upload and manage your loan-related documents here.</p>

      <DocumentUploader loanPrograms={loanPrograms} userId={user._id} />
    </div>
  );
};

export default LenderDocuments;
