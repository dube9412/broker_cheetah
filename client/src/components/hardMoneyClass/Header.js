import React from 'react';

function Header() {
  return (
    <header style={{
      backgroundColor: '#FFD700',
      color: '#000',
      padding: '1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '1px solid #1f2937',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{
        maxWidth: '80rem',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
          <div style={{width: '2.5rem', height: '2.5rem'}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{width: '100%', height: '100%', color: 'white'}}>
              <path fill="currentColor" d="M12 3L1 9l11 6l9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z"/>
            </svg>
          </div>
          <h1 style={{fontSize: '1.25rem', fontWeight: 700}} className="font-geist-mono">
            Hard Money Lending <span style={{opacity: 0.7}}>Masterclass</span>
          </h1>
        </div>
        <nav>
          <ul style={{display: 'flex', gap: '1.5rem'}}>
            <li><a href="#loan-types" style={{fontSize: '0.875rem', color: 'white', textDecoration: 'none', transition: 'all 0.2s ease'}} onMouseOver={(e) => e.target.style.color = '#d1d5db'} onMouseOut={(e) => e.target.style.color = 'white'}>Loan Types</a></li>
            <li><a href="#quote-process" style={{fontSize: '0.875rem', color: 'white', textDecoration: 'none', transition: 'all 0.2s ease'}} onMouseOver={(e) => e.target.style.color = '#d1d5db'} onMouseOut={(e) => e.target.style.color = 'white'}>Quote Process</a></li>
            <li><a href="#loan-application" style={{fontSize: '0.875rem', color: 'white', textDecoration: 'none', transition: 'all 0.2s ease'}} onMouseOver={(e) => e.target.style.color = '#d1d5db'} onMouseOut={(e) => e.target.style.color = 'white'}>Application</a></li>
            <li><a href="#lender-process" style={{fontSize: '0.875rem', color: 'white', textDecoration: 'none', transition: 'all 0.2s ease'}} onMouseOver={(e) => e.target.style.color = '#d1d5db'} onMouseOut={(e) => e.target.style.color = 'white'}>Lender Process</a></li>
            <li><a href="#broker-clients" style={{fontSize: '0.875rem', color: 'white', textDecoration: 'none', transition: 'all 0.2s ease'}} onMouseOver={(e) => e.target.style.color = '#d1d5db'} onMouseOut={(e) => e.target.style.color = 'white'}>Finding Clients</a></li>
            <li><a href="#glossary" style={{fontSize: '0.875rem', color: 'white', textDecoration: 'none', transition: 'all 0.2s ease'}} onMouseOver={(e) => e.target.style.color = '#d1d5db'} onMouseOut={(e) => e.target.style.color = 'white'}>Glossary</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
