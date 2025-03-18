import React, { useState } from 'react';

function LoanTypeCard({ icon, iconBg, iconColor, title, description, features }) {
  return (
    <div className="hover-card" style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      border: '1px solid #f3f4f6'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ 
          width: '2.5rem', 
          height: '2.5rem', 
          borderRadius: '9999px', 
          backgroundColor: iconBg, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginRight: '0.75rem' 
        }}>
          <i className={`bx ${icon}`} style={{ fontSize: '1.25rem', color: iconColor }}></i>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</h3>
      </div>
      <p style={{ color: '#4b5563', marginBottom: '1rem' }}>{description}</p>
      <ul style={{ fontSize: '0.875rem', color: '#4b5563' }}>
        {features.map((feature, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <i className="bx bx-check-circle" style={{ marginRight: '0.5rem', marginTop: '0.125rem', color: '#10b981' }}></i>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LoanTypes() {
  const [activeTab, setActiveTab] = useState(0);
  
  const loanTypesData = [
    {
      icon: "bx-home",
      iconBg: "#dbeafe",
      iconColor: "#2563eb",
      title: "Fix and Flip Loans",
      description: "Short-term financing for purchasing and renovating properties with the intention of selling for profit.",
      features: [
        "Typically 6-24 month terms",
        "Interest rates from 7-13%",
        "Funding for purchase and renovation costs",
        "Up to 90% of purchase price and 100% of rehab costs",
        "Fast closing timeline (7-10 days)"
      ]
    },
    {
      icon: "bx-buildings",
      iconBg: "#fef3c7",
      iconColor: "#d97706",
      title: "DSCR Loans",
      description: "Debt Service Coverage Ratio loans focus on the property's income rather than the borrower's personal income.",
      features: [
        "No income verification required",
        "Property must generate sufficient cash flow",
        "Minimum DSCR typically 1.0-1.25x",
        "Terms from 5-30 years",
        "Available for residential and commercial properties"
      ]
    },
    {
      icon: "bx-bridge",
      iconBg: "#d1fae5",
      iconColor: "#059669",
      title: "Stabilized Bridge Loans",
      description: "Short to medium-term financing for properties that are already generating income but need time to stabilize operations.",
      features: [
        "12-36 month terms typically",
        "Lower rates than traditional bridge loans",
        "Can refinance into conventional financing once stabilized",
        "For properties with existing cash flow",
        "Interest-only payments common"
      ]
    },
    {
      icon: "bx-building-house",
      iconBg: "#fee2e2",
      iconColor: "#dc2626",
      title: "Ground Up Construction",
      description: "Financing for building new structures from the ground up, including both residential and commercial projects.",
      features: [
        "Covers land acquisition and construction costs",
        "Draw schedule based on construction milestones",
        "12-24 month terms",
        "Requires detailed construction plans and budgets",
        "Higher rates due to increased risk (8-12%)"
      ]
    },
    {
      icon: "bx-collection",
      iconBg: "#e0e7ff",
      iconColor: "#4f46e5",
      title: "Portfolio Loans",
      description: "Financing for multiple properties under a single loan, ideal for investors with several properties.",
      features: [
        "Single loan for multiple properties",
        "Simplified management of debt",
        "Cross-collateralized for better terms",
        "Flexible terms based on portfolio size",
        "Often includes release provisions for property sales"
      ]
    }
  ];

  return (
    <section id="loan-types" className="section-container">
      <div className="centered-content">
        <h2>Loan Types</h2>
        <p>
          Understanding the various loan options in hard money lending is crucial for making informed investment decisions.
          Each loan type serves specific purposes and comes with unique terms and requirements.
        </p>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', width: '100%', maxWidth: '42rem', overflow: 'auto' }} className="hide-scrollbar">
          {loanTypesData.map((loan, index) => (
            <button
              key={index}
              className={`loan-tab-btn ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {loan.title}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{loanTypesData[activeTab].title}</h3>
          <p style={{ color: '#4b5563', marginBottom: '1rem' }}>{loanTypesData[activeTab].description}</p>
        </div>
        
        <div className="grid-layout">
          {loanTypesData.map((loan, index) => (
            <LoanTypeCard
              key={index}
              icon={loan.icon}
              iconBg={loan.iconBg}
              iconColor={loan.iconColor}
              title={loan.title}
              description={loan.description}
              features={loan.features}
            />
          ))}
        </div>
        
        <div style={{ 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb' 
        }}>
          <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
            <i className="bx bx-info-circle" style={{ marginRight: '0.5rem', color: '#3b82f6' }}></i>
            Can Loans Be Used Together?
          </h4>
          <p style={{ color: '#4b5563' }}>
            Yes, experienced investors often leverage multiple loan types throughout their real estate journey. For example, 
            starting with a Ground Up Construction loan to build a property, transitioning to a Stabilized Bridge loan 
            while establishing rental income, then refinancing with a DSCR loan for long-term holding, or using a Portfolio loan 
            to consolidate multiple properties. Strategic layering of loan products can optimize financing at each phase of a project.
          </p>
        </div>
      </div>
    </section>
  );
}

export default LoanTypes;
