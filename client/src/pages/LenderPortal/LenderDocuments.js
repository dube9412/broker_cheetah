// src/pages/LenderPortal/LenderDocuments.js
import React, { useState, useEffect, useContext } from 'react';
import DocumentUploader from '../../components/DocumentUploader';
import { LenderAuthContext } from '../../context/LenderAuthContext'; // ✅ Correct Context
import { useNavigate } from 'react-router-dom';

const LenderDocuments = () => {
  const { lenderUserId, isLenderLoggedIn } = useContext(LenderAuthContext); // ✅ Use LenderAuthContext
  const navigate = useNavigate();
  const [loanPrograms, setLoanPrograms] = useState([]);

  useEffect(() => {
    if (!isLenderLoggedIn || !lenderUserId) {
      navigate('/lender/login'); // ✅ Redirect to lender login
      return;
    }

    const fetchLoanPrograms = async () => {
      try {
        const response = await fetch(
          `https://broker-cheetah-backend.onrender.com/api/lenders/${lenderUserId}/loan-programs`
        );
        const data = await response.json();
        if (response.ok) {
          setLoanPrograms(data.loanPrograms);
        } else {
          console.error('Error fetching loan programs', data.message);
        }
      } catch (error) {
        console.error('API Error:', error);
      }
    };

    fetchLoanPrograms();
  }, [isLenderLoggedIn, lenderUserId, navigate]);

  return (
    <div className="lender-portal">
      <h2>Document Management</h2>
      <p>Upload and manage your loan-related documents here.</p>

      <DocumentUploader loanPrograms={loanPrograms} userId={lenderUserId} /> {/* ✅ Pass correct ID */}
    </div>
  );
};

export default LenderDocuments;

