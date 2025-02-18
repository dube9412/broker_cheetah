// Dashboard.js (Updated without Lender Management and Scraper Logic)
import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard. Select an option below:</p>
      <ul style={{ marginBottom: '2rem' }}>
        <li>
          <Link to="/select-loan-type">Lender Search</Link>
        </li>
        <li><Link to="/hard-money-class"><button>Hard Money Lending Class</button></Link></li>
        <li>History (coming soon)</li>
        <li>Docs (coming soon)</li>
        <li>Pipeline (coming soon)</li>
        <li>Help (coming soon)</li>
        <li>Knowledge Base (coming soon)</li>
      </ul>
    </div>
  );
}

export default Dashboard;
