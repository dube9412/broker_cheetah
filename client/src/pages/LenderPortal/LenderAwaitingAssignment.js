
// src/pages/LenderPortal/LenderAwaitingAssignment.js (NEW FILE)
import React from 'react';
import { Link } from 'react-router-dom';

const LenderAwaitingAssignment = () => {
    return (
        <div>
            <h2>Account Awaiting Assignment</h2>
            <p>Your account has been approved, but you are not yet assigned to a lender.</p>
            <p>Please contact an administrator for assignment.</p>
             <p>
               <Link to="/">Return to Homepage</Link>
            </p>
        </div>
    );
};

export default LenderAwaitingAssignment;