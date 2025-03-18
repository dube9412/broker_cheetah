import React, { useState } from 'react';

function QuoteProcess() {
  const [activeFeature, setActiveFeature] = useState('rate');
  
  const sensitivityData = {
    rate: {
      title: "Interest Rate",
      description: "The interest rate significantly impacts the total cost of your loan. Even a small difference can mean thousands of dollars over the loan term.",
      importance: "Critical for long-term holds; less important for very short-term projects.",
      tips: "Consider the full cost including points rather than just the rate. A slightly higher rate with lower fees might be better for short-term projects."
    },
    origination: {
      title: "Origination Fees",
      description: "Points charged upfront, typically 1-3% of the loan amount. These fees cover the lender's cost of creating the loan.",
      importance: "Directly impacts your upfront costs and project ROI calculations.",
      tips: "Negotiate these fees, especially for larger loans or when you have a proven track record with the lender."
    },
    speed: {
      title: "Speed to Close",
      description: "The timeframe from application to funding, typically ranging from 5-15 days for hard money loans.",
      importance: "Crucial when competing against cash buyers or facing tight deadlines with sellers.",
      tips: "Have all your documents organized in advance to avoid delays. Consider paying for an expedited appraisal if time is critical."
    },
    term: {
      title: "Loan Term",
      description: "Length of the loan, which can vary from 6 months to several years depending on the loan type.",
      importance: "Must align with your project timeline and exit strategy. Too short may force a rushed exit; too long may incur unnecessary costs.",
      tips: "Look for loans with extension options for added flexibility, but understand the costs associated with extensions."
    },
    rollover: {
      title: "Cost Roll-In Options",
      description: "Whether closing costs, interest, and/or renovation costs can be included in the loan amount.",
      importance: "Directly impacts how much cash you need to bring to closing.",
      tips: "Rolling costs into the loan increases cash flow but also increases the total loan amount and therefore total interest paid."
    },
    interest: {
      title: "Interest Structure",
      description: "How interest is calculated and paid - monthly payments, interest-only, or Dutch interest where interest is prepaid from loan proceeds.",
      importance: "Affects monthly cash flow and total cost of the loan.",
      tips: "Dutch interest can help with cash flow but effectively raises the cost of borrowing. Compare the true APR across different structures."
    }
  };

  return (
    <section id="quote-process" className="section-container">
      <div className="centered-content">
        <h2>Quote Process & Client Sensitivities</h2>
        <p>
          Understanding client priorities is essential for finding the right lender match. Different borrowers have different sensitivities when comparing loan options.
        </p>
      </div>

      <div className="grid-layout">
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Standard Quote Request Information</h3>
          <ul style={{ color: '#4b5563' }}>
            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start' }}>
              <i className="bx bx-check-circle" style={{ color: '#10b981', marginRight: '0.5rem', marginTop: '0.25rem' }}></i>
              <div>
                <span style={{ fontWeight: 500 }}>Property Details:</span> Address, property type, condition, current use
              </div>
            </li>
            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start' }}>
              <i className="bx bx-check-circle" style={{ color: '#10b981', marginRight: '0.5rem', marginTop: '0.25rem' }}></i>
              <div>
                <span style={{ fontWeight: 500 }}>Loan Request:</span> Purchase price, loan amount, use of funds
              </div>
            </li>
            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start' }}>
              <i className="bx bx-check-circle" style={{ color: '#10b981', marginRight: '0.5rem', marginTop: '0.25rem' }}></i>
              <div>
                <span style={{ fontWeight: 500 }}>Exit Strategy:</span> Sell, refinance, timeline
              </div>
            </li>
            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start' }}>
              <i className="bx bx-check-circle" style={{ color: '#10b981', marginRight: '0.5rem', marginTop: '0.25rem' }}></i>
              <div>
                <span style={{ fontWeight: 500 }}>Borrower Info:</span> Experience, credit score range, entity type
              </div>
            </li>
            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start' }}>
              <i className="bx bx-check-circle" style={{ color: '#10b981', marginRight: '0.5rem', marginTop: '0.25rem' }}></i>
              <div>
                <span style={{ fontWeight: 500 }}>For Rehab:</span> Renovation budget, scope of work summary, after repair value (ARV)
              </div>
            </li>
            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start' }}>
              <i className="bx bx-check-circle" style={{ color: '#10b981', marginRight: '0.5rem', marginTop: '0.25rem' }}></i>
              <div>
                <span style={{ fontWeight: 500 }}>For DSCR:</span> Current/projected rental income, expenses
              </div>
            </li>
            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start' }}>
              <i className="bx bx-check-circle" style={{ color: '#10b981', marginRight: '0.5rem', marginTop: '0.25rem' }}></i>
              <div>
                <span style={{ fontWeight: 500 }}>Timeline:</span> Close date needed, renovation timeline
              </div>
            </li>
          </ul>
        </div>
        
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Client Sensitivities</h3>
          <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
            Understanding what matters most to your client helps match them with the right lender. Click each factor to learn more:
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {Object.keys(sensitivityData).map((key) => (
              <button
                key={key}
                onClick={() => setActiveFeature(key)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  border: 'none',
                  backgroundColor: activeFeature === key ? '#3b82f6' : '#f3f4f6',
                  color: activeFeature === key ? 'white' : '#4b5563',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {sensitivityData[key].title}
              </button>
            ))}
          </div>
          
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{sensitivityData[activeFeature].title}</h4>
            <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.75rem' }}>{sensitivityData[activeFeature].description}</p>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>IMPORTANCE:</span>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{sensitivityData[activeFeature].importance}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>PRO TIP:</span>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{sensitivityData[activeFeature].tips}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
          <i className="bx bx-bulb" style={{ color: '#eab308', marginRight: '0.5rem' }}></i>
          Why Understanding Client Sensitivities Matters
        </h3>
        <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
          Identifying what matters most to your borrower allows you to find the right lender match and explain your recommendations effectively. 
          This targeted approach increases client satisfaction and closes more loans.
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1rem' 
        }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f9fafb', 
            borderRadius: '0.5rem', 
            border: '1px solid #e5e7eb' 
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>EXAMPLE: PRIORITIZING SPEED</h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              For a borrower with a 10-day closing deadline, focusing on lenders with expedited processes and in-house underwriting is critical, 
              even if it means accepting a slightly higher rate.
            </p>
          </div>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f9fafb', 
            borderRadius: '0.5rem', 
            border: '1px solid #e5e7eb' 
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>EXAMPLE: PRIORITIZING CASH FLOW</h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              A borrower with limited cash reserves might benefit from a loan with higher points that can be rolled into the loan amount, 
              rather than a loan with lower points that must be paid upfront.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuoteProcess;
