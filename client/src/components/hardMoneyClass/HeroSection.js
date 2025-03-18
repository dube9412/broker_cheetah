import React from 'react';

function HeroSection() {
  const handleStartLearning = (e) => {
    e.preventDefault();
    const loanTypesSection = document.getElementById('loan-types');
    const headerHeight = document.querySelector('header').offsetHeight;
    const targetPosition = loanTypesSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  };

  return (
    <section style={{marginBottom: '4rem'}}>
      <div style={{ 
        background: 'linear-gradient(to right, #111827, #1f2937)', 
        borderRadius: '0.75rem',
        overflow: 'hidden', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{
          padding: '2.5rem', 
          display: 'flex', 
          flexDirection: window.innerWidth < 768 ? 'column' : 'row', 
          alignItems: 'center'
        }}>
          <div style={{
            width: window.innerWidth < 768 ? '100%' : '66.666667%', 
            color: 'white', 
            marginBottom: window.innerWidth < 768 ? '2rem' : 0
          }}>
            <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: 1.2}}>
              Understanding Hard Money Lending
            </h2>
            <p style={{fontSize: '1.125rem', color: '#d1d5db', marginBottom: '2rem'}}>
              A comprehensive guide for real estate investors and brokers who want to master the art of hard money lending in today's competitive market.
            </p>
            <div style={{display: 'flex', gap: '1rem'}}>
              <button 
                style={{
                  backgroundColor: 'white',
                  color: '#111827',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onClick={handleStartLearning}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
              >
                Start Learning
              </button>
              <button 
                style={{
                  border: '1px solid white',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
                onMouseOut={(e) => {e.target.style.backgroundColor = 'transparent'}}
              >
                Download Guide
              </button>
            </div>
          </div>
          <div style={{
            width: window.innerWidth < 768 ? '100%' : '33.333333%',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <img 
              src="https://r2.flowith.net/files/5e7995ef-ffd4-42e4-ba01-2ae2fa9fc8f1/1742098558867-A_coll.jpeg" 
              alt="Real Estate Collateral" 
              className="image-hover"
              style={{
                borderRadius: '0.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                maxWidth: '100%',
                height: 'auto'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
