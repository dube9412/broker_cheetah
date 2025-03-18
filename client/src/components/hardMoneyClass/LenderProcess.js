import React from 'react';

function ProcessStep({ number, title, description, isActive = false }) {
  return (
    <div style={{ 
      display: 'flex', 
      marginBottom: '1rem',
      position: 'relative'
    }}>
      <div style={{
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '9999px',
        backgroundColor: isActive ? '#3b82f6' : '#f3f4f6',
        color: isActive ? 'white' : '#4b5563',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        marginRight: '1rem',
        zIndex: '2'
      }}>
        {number}
      </div>
      {number < 12 && (
        <div style={{
          position: 'absolute',
          left: '1.25rem',
          top: '2.5rem',
          bottom: '-1rem',
          width: '2px',
          backgroundColor: '#e5e7eb',
          zIndex: '1'
        }}></div>
      )}
      <div>
        <h4 style={{ 
          fontSize: '1rem', 
          fontWeight: '600', 
          marginBottom: '0.25rem', 
          color: isActive ? '#111827' : '#374151'
        }}>
          {title}
        </h4>
        <p style={{ 
          fontSize: '0.875rem', 
          color: '#6b7280',
          maxWidth: '24rem' 
        }}>
          {description}
        </p>
      </div>
    </div>
  );
}

function LenderProcess() {
  const steps = [
    {
      title: "Quote",
      description: "Get multiple quotes and compare terms from different lenders to secure the best financing."
    },
    {
      title: "Submission",
      description: "Provide the lender with all required documentation specific to the loan type."
    },
    {
      title: "Appraisal Ordered",
      description: "Borrower receives a secure payment link for the appraisal, which evaluates the property's value."
    },
    {
      title: "Account Exec Review",
      description: "Lender's representative reviews the file for completeness before submitting to underwriting."
    },
    {
      title: "Underwriting Review Begins",
      description: "Detailed analysis of all aspects of the loan, including property, financials, and borrower."
    },
    {
      title: "Conditions",
      description: "Lender may request additional information or clarification on submitted documents."
    },
    {
      title: "Lender Sends Documents to Title",
      description: "Once approved, loan documents are sent to the title company for closing preparation."
    },
    {
      title: "Final Review by Lender",
      description: "Final check of all documents and conditions to ensure everything is in order."
    },
    {
      title: "Title & Lender Confirm Documents",
      description: "Coordination between title company and lender to verify all closing documents are ready."
    },
    {
      title: "Clear to Close (CTC) Issued",
      description: "Official notification that the loan is approved and ready for closing."
    },
    {
      title: "Borrower Signs at Closing",
      description: "Borrower signs all necessary documents at the title company or via mobile notary."
    },
    {
      title: "Loan is Funded",
      description: "Money is disbursed to the appropriate parties, and brokers receive their commission."
    }
  ];

  return (
    <section id="lender-process" className="section-container">
      <div className="centered-content">
        <h2>Lender Process</h2>
        <p>
          Understanding the lender's internal process helps manage expectations and prepare clients for what's ahead.
          Here's a typical 12-step journey from quote to funding.
        </p>
      </div>
      
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
          The 12 Steps from Quote to Funding
        </h3>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          padding: '1rem'
        }}>
          <div>
            {steps.slice(0, 6).map((step, index) => (
              <ProcessStep 
                key={index}
                number={index + 1} 
                title={step.title} 
                description={step.description}
                isActive={index === 0} 
              />
            ))}
          </div>
          <div>
            {steps.slice(6).map((step, index) => (
              <ProcessStep 
                key={index + 6}
                number={index + 7} 
                title={step.title} 
                description={step.description} 
                isActive={index === 5}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem' }} className="grid-layout">
        <div className="card hover-card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ 
              width: '2.5rem', 
              height: '2.5rem',
              backgroundColor: '#dbeafe',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem'
            }}>
              <i className="bx bx-time" style={{ color: '#2563eb' }}></i>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Typical Timeline</h3>
          </div>
          <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
            The entire process typically takes:
          </p>
          <ul style={{ color: '#4b5563' }}>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <i className="bx bx-calendar" style={{ color: '#2563eb', marginRight: '0.5rem' }}></i>
              <span><strong>7-10 days</strong> for standard hard money loans</span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <i className="bx bx-calendar" style={{ color: '#2563eb', marginRight: '0.5rem' }}></i>
              <span><strong>14-21 days</strong> for more complex situations</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center' }}>
              <i className="bx bx-calendar" style={{ color: '#2563eb', marginRight: '0.5rem' }}></i>
              <span>As little as <strong>3-5 days</strong> for pre-approved borrowers</span>
            </li>
          </ul>
        </div>
        
        <div className="card hover-card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ 
              width: '2.5rem', 
              height: '2.5rem',
              backgroundColor: '#fee2e2',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem'
            }}>
              <i className="bx bx-error" style={{ color: '#dc2626' }}></i>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Common Delays</h3>
          </div>
          <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
            Factors that can slow down the process:
          </p>
          <ul style={{ color: '#4b5563' }}>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <i className="bx bx-x" style={{ color: '#dc2626', marginRight: '0.5rem', marginTop: '0.125rem' }}></i>
              <span>Incomplete documentation</span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <i className="bx bx-x" style={{ color: '#dc2626', marginRight: '0.5rem', marginTop: '0.125rem' }}></i>
              <span>Title issues (liens, encumbrances)</span>
            </li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
              <i className="bx bx-x" style={{ color: '#dc2626', marginRight: '0.5rem', marginTop: '0.125rem' }}></i>
              <span>Property condition concerns</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start' }}>
              <i className="bx bx-x" style={{ color: '#dc2626', marginRight: '0.5rem', marginTop: '0.125rem' }}></i>
              <span>Slow response to condition requests</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default LenderProcess;
