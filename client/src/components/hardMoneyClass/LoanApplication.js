import React, { useState } from 'react';

function LoanApplication() {
  const [activeTab, setActiveTab] = useState('fixFlip');

  const loanApplicationData = {
    fixFlip: {
      title: "Fix and Flip Loan Application Requirements",
      description: "Documentation needed for property purchase and renovation financing.",
      requirements: [
        "Property purchase contract or address for refinance",
        "Detailed rehabilitation budget (line-item)",
        "Scope of work with timeline",
        "Contractor bids (if using contractors)",
        "Comparable sales for ARV validation",
        "Exit strategy timeline",
        "Previous rehab project examples (before/after photos)"
      ]
    },
    dscr: {
      title: "DSCR Loan Application Requirements",
      description: "Documentation focusing on the property's income-generating potential.",
      requirements: [
        "Current rent roll or market rent analysis",
        "Property operating expenses (taxes, insurance, HOA, etc.)",
        "Lease agreements (for existing properties)",
        "Property management plan",
        "Vacancy rate estimates",
        "Cash reserve verification",
        "Portfolio summary of other rental properties (if applicable)"
      ]
    },
    bridge: {
      title: "Stabilized Bridge Loan Application Requirements",
      description: "Documentation for properties with existing income needing time to optimize performance.",
      requirements: [
        "Current rent roll with tenant history",
        "Trailing 12-month operating statements",
        "Property improvement plan (if applicable)",
        "Exit strategy (refinance or sale plan)",
        "Cash flow projections",
        "Property management agreement",
        "Capital expenditure budget"
      ]
    },
    construction: {
      title: "Ground Up Construction Loan Application Requirements",
      description: "Comprehensive documentation for new construction projects.",
      requirements: [
        "Architectural plans and renderings",
        "Detailed construction budget",
        "Construction timeline with milestones",
        "Builder/contractor credentials and license",
        "Construction contract",
        "Permits or permit status",
        "Environmental reports",
        "Comparable sales/rentals for valuation"
      ]
    },
    portfolio: {
      title: "Portfolio Loan Application Requirements",
      description: "Documentation for financing multiple properties under a single loan.",
      requirements: [
        "Schedule of properties with addresses and property types",
        "Current mortgage balances and terms for each property",
        "Operating statements for each property",
        "Rent rolls for all properties",
        "Portfolio management strategy",
        "Global cash flow analysis",
        "Entity structure documentation"
      ]
    }
  };

  return (
    <section id="loan-application" className="section-container">
      <div className="centered-content">
        <h2>Loan Application Process</h2>
        <p>
          Each loan type requires specific documentation. Understanding these requirements helps streamline the application process and improve approval chances.
        </p>
      </div>
      
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '2rem',
        overflowX: 'auto'
      }} className="hide-scrollbar">
        {Object.entries(loanApplicationData).map(([key, data]) => (
          <button
            key={key}
            className={`loan-tab-btn ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {data.title.split(" ")[0]} {data.title.split(" ")[1]}
          </button>
        ))}
      </div>
      
      <div className="grid-layout">
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>{loanApplicationData[activeTab].title}</h3>
          <p style={{ color: '#4b5563', marginBottom: '1rem' }}>{loanApplicationData[activeTab].description}</p>
          
          <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#374151' }}>Required Documentation:</h4>
          <ul style={{ color: '#4b5563' }}>
            {loanApplicationData[activeTab].requirements.map((req, index) => (
              <li key={index} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <i className="bx bx-right-arrow-alt" style={{ color: '#3b82f6', marginRight: '0.5rem', marginTop: '0.25rem' }}></i>
                {req}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Application Submission Options</h3>
          
          <div style={{ 
            marginBottom: '1.5rem', 
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
              <i className="bx bx-envelope" style={{ color: '#3b82f6', marginRight: '0.5rem' }}></i>
              Email Submission
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.75rem' }}>
              Traditional method where documentation is compiled into PDFs and emailed to the lender.
            </p>
            <ul style={{ fontSize: '0.875rem', color: '#4b5563' }}>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <i className="bx bx-plus" style={{ color: '#10b981', marginRight: '0.5rem', marginTop: '0.125rem' }}></i>
                Simple and familiar process
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <i className="bx bx-minus" style={{ color: '#ef4444', marginRight: '0.5rem', marginTop: '0.125rem' }}></i>
                Can be disorganized and harder to track
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                <i className="bx bx-minus" style={{ color: '#ef4444', marginRight: '0.5rem', marginTop: '0.125rem' }}></i>
                Limited file size capabilities
              </li>
            </ul>
          </div>

          <div style={{ 
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
              <i className="bx bx-globe" style={{ color: '#3b82f6', marginRight: '0.5rem' }}></i>
              Portal Submission
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.75rem' }}>
              Modern approach using dedicated online platforms for document submission and tracking.
            </p>
            <ul style={{ fontSize: '0.875rem', color: '#4b5563' }}>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <i className="bx bx-plus" style={{ color: '#10b981', marginRight: '0.5rem', marginTop: '0.125rem' }}></i>
                Streamlined process with organized document storage
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <i className="bx bx-plus" style={{ color: '#10b981', marginRight: '0.5rem', marginTop: '0.125rem' }}></i>
                Real-time status updates and communication
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                <i className="bx bx-plus" style={{ color: '#10b981', marginRight: '0.5rem', marginTop: '0.125rem' }}></i>
                Secure document sharing and e-signature capabilities
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Document Signing Options</h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1rem' 
        }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f9fafb', 
            borderRadius: '0.5rem', 
            border: '1px solid #e5e7eb' 
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>DocuSign</h4>
            <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.75rem' }}>
              Industry leading e-signature platform with robust features.
            </p>
            <ul style={{ fontSize: '0.875rem', color: '#4b5563' }}>
              <li style={{ marginBottom: '0.25rem' }}>Simple, intuitive interface</li>
              <li style={{ marginBottom: '0.25rem' }}>Multiple signing options (mobile, desktop)</li>
              <li>Legally binding and secure</li>
            </ul>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f9fafb', 
            borderRadius: '0.5rem', 
            border: '1px solid #e5e7eb' 
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Adobe Sign</h4>
            <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.75rem' }}>
              Robust e-signature solution from Adobe with seamless PDF integration.
            </p>
            <ul style={{ fontSize: '0.875rem', color: '#4b5563' }}>
              <li style={{ marginBottom: '0.25rem' }}>Integrates perfectly with Adobe PDF ecosystem</li>
              <li style={{ marginBottom: '0.25rem' }}>Advanced workflow capabilities</li>
              <li>Strong compliance features</li>
            </ul>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f9fafb', 
            borderRadius: '0.5rem', 
            border: '1px solid #e5e7eb' 
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>HelloSign</h4>
            <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.75rem' }}>
              User-friendly e-signature platform with strong API capabilities.
            </p>
            <ul style={{ fontSize: '0.875rem', color: '#4b5563' }}>
              <li style={{ marginBottom: '0.25rem' }}>Simple, clean interface</li>
              <li style={{ marginBottom: '0.25rem' }}>Good for teams with technical capabilities</li>
              <li>Dropbox integration</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoanApplication;
