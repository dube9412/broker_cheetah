import React, { useState } from 'react';

function GlossaryItem({ term, definition }) {
  return (
    <div className="glossary-item" style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>{term}</h3>
      <p style={{ color: '#4b5563', fontSize: '0.875rem', paddingLeft: '0.5rem' }}>{definition}</p>
    </div>
  );
}

function Glossary() {
  const [searchTerm, setSearchTerm] = useState('');

  const glossaryTerms = [
    {
      term: "LTV (Loan-to-Value)",
      definition: "The ratio of the loan amount to the value of the property expressed as a percentage. For example, an $80,000 loan on a $100,000 property has an LTV of 80%."
    },
    {
      term: "LTC (Loan-to-Cost)",
      definition: "The ratio of the loan amount to the total project cost, including purchase and renovations. Used primarily for rehab and construction loans."
    },
    {
      term: "ARV (After Repair Value)",
      definition: "The estimated value of a property after all planned renovations are completed. Often used in fix and flip loans where lenders may fund a percentage of ARV."
    },
    {
      term: "DSCR (Debt Service Coverage Ratio)",
      definition: "The ratio of a property's net operating income to its debt service (mortgage payment), indicating its ability to cover its debt obligations."
    },
    {
      term: "Points",
      definition: "Upfront fees charged by the lender, typically 1-3% of the loan amount. One point equals 1% of the loan amount."
    },
    {
      term: "Origination Fee",
      definition: "Fee charged by a lender for processing a new loan application, typically 1-3% of the loan amount, often expressed in terms of points."
    },
    {
      term: "Hard Money Loan",
      definition: "A short-term, asset-based loan where the property serves as collateral and the terms depend more on the property value than the borrower's creditworthiness."
    },
    {
      term: "Bridge Loan",
      definition: "A short-term loan used to 'bridge' the gap between two transactions, such as buying a new property before selling an existing one."
    },
    {
      term: "Exit Strategy",
      definition: "The borrower's plan to pay off the hard money loan, typically through sale, refinance, or another method."
    },
    {
      term: "Draw Schedule",
      definition: "A predetermined timeline for releasing funds in stages for construction or renovation projects, typically after certain milestones are completed."
    },
    {
      term: "PPP (Prepayment Penalty)",
      definition: "A fee charged if a borrower pays off a loan before the end of its term. May be structured as a percentage or fixed amount."
    },
    {
      term: "Cross-Collateralization",
      definition: "Using multiple properties as collateral for a single loan, often used in portfolio loans or to secure better terms."
    },
    {
      term: "Blanket Mortgage",
      definition: "A single mortgage that covers multiple properties, allowing investors to use equity across their portfolio."
    },
    {
      term: "CTC (Clear to Close)",
      definition: "Notification that all loan conditions have been satisfied and the loan is ready for closing."
    },
    {
      term: "EIO (Extension/Interest Only)",
      definition: "A loan option where the borrower only pays interest during the loan term, with principal due at maturity, often with extension options."
    },
    {
      term: "LA (Loan Amount)",
      definition: "The total amount of money borrowed, excluding interest and fees."
    },
    {
      term: "ILA (Initial Loan Amount)",
      definition: "The principal loan amount at origination, before any additional draws or loan increases."
    },
    {
      term: "AIV (As-Is Value)",
      definition: "The current market value of a property in its present condition, before any improvements."
    },
    {
      term: "MV (Market Value)",
      definition: "The estimated amount a property would sell for on the open market under normal conditions."
    },
    {
      term: "BRRR (Buy, Rehab, Rent, Refinance)",
      definition: "A real estate investment strategy where an investor buys a property, renovates it, rents it out, and then refinances to recover capital for the next investment."
    },
    {
      term: "Dutch Interest",
      definition: "An interest structure where interest is collected upfront from loan proceeds rather than paid monthly, improving cash flow during the loan term."
    },
    {
      term: "Rate Sheet",
      definition: "A document outlining a lender's current interest rates, points, and terms for various loan programs."
    },
    {
      term: "Rehab Budget",
      definition: "A detailed cost breakdown of all renovation work planned for a property, required for fix and flip or BRRR loans."
    },
    {
      term: "Scope of Work (SOW)",
      definition: "A document detailing all renovation work to be performed on a property, including materials, timeline, and costs."
    },
    {
      term: "Soft Costs",
      definition: "Expenses in a construction or renovation project that aren't directly related to physical construction, like permits, architect fees, and insurance."
    },
    {
      term: "Hard Costs",
      definition: "The tangible expenses directly related to physical construction or renovation, like materials and labor."
    },
    {
      term: "Holdback",
      definition: "A portion of the loan amount reserved by the lender until certain conditions are met, often used for renovation costs in fix and flip loans."
    },
    {
      term: "Seasoning",
      definition: "The time period a borrower must own a property before qualifying for certain loan programs, particularly for cash-out refinances."
    },
    {
      term: "Underwriting",
      definition: "The process of evaluating a loan application to determine risk and approve or deny financing."
    },
    {
      term: "Interest Reserve",
      definition: "A portion of the loan set aside to make interest payments during the loan term, commonly used in construction loans."
    }
  ];

  const filteredTerms = glossaryTerms.filter(item => 
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="glossary" className="section-container">
      <div className="centered-content">
        <h2>Hard Money Lending Glossary</h2>
        <p>
          Understanding the terminology is crucial for navigating the hard money lending industry effectively.
          This glossary covers the most important terms you'll encounter.
        </p>
      </div>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="search-glossary" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
            Search Terms & Definitions
          </label>
          <div style={{ position: 'relative' }}>
            <input 
              id="search-glossary"
              type="text" 
              placeholder="Type to search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
            <i className="bx bx-search" style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }}></i>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer'
                }}
              >
                <i className="bx bx-x"></i>
              </button>
            )}
          </div>
        </div>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          <div>
            {filteredTerms.slice(0, Math.ceil(filteredTerms.length / 2)).map((item, index) => (
              <GlossaryItem key={index} term={item.term} definition={item.definition} />
            ))}
          </div>
          <div>
            {filteredTerms.slice(Math.ceil(filteredTerms.length / 2)).map((item, index) => (
              <GlossaryItem key={index + Math.ceil(filteredTerms.length / 2)} term={item.term} definition={item.definition} />
            ))}
          </div>
        </div>
        
        {filteredTerms.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            color: '#6b7280'
          }}>
            <i className="bx bx-search" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
            <p>No terms found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          <strong>Pro Tip:</strong> Bookmark this glossary for quick reference when reviewing loan documents or speaking with lenders.
        </p>
      </div>
    </section>
  );
}

export default Glossary;
