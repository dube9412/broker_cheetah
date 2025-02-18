import React from 'react';
import { Link } from 'react-router-dom';

function HardMoneyClass() {
    return (
        <div className="container">
            <h1>Hard Money Lending Class</h1>
            <p>Welcome to the Hard Money Lending class! Below, you'll find modules to help you understand how hard money loans work, how to get a quote, and how to close deals successfully.</p>
            
            <h2>Modules</h2>
            <ul>
                <li><Link to="/hard-money-class/module-1">1. Introduction to Hard Money Lending</Link></li>
                <li><Link to="/hard-money-class/module-2">2. Loan Types & When to Use Them</Link></li>
                <li><Link to="/hard-money-class/module-3">3. How to Get a Loan Quote</Link></li>
                <li><Link to="/hard-money-class/module-4">4. Submitting a Loan Package</Link></li>
                <li><Link to="/hard-money-class/module-5">5. Understanding the Lender Process</Link></li>
                <li><Link to="/hard-money-class/module-6">6. Marketing Yourself as a Loan Broker</Link></li>
                <li><Link to="/hard-money-class/module-7">7. Loan Calculations & Deal Structuring</Link></li>
            </ul>

            <h2>Downloadable Resources</h2>
            <ul>
                <li><a href="/downloads/loan_submission_checklist.pdf" download>Loan Submission Checklist</a></li>
                <li><a href="/downloads/loan_calculator.xlsx" download>Loan Calculator Spreadsheet</a></li>
            </ul>
            
            <Link to="/dashboard"><button>Back to Dashboard</button></Link>
        </div>
    );
}

export default HardMoneyClass;
