import React, { useState } from 'react';

function SubscribeSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // In a real app, you would send this to your backend
      console.log('Subscription email:', email);
      setSubmitted(true);
      setEmail('');
      
      // Reset the submission state after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <section style={{ marginTop: '4rem', marginBottom: '2rem' }}>
      <div style={{ 
        background: 'linear-gradient(to right, #1e293b, #334155)',
        borderRadius: '0.75rem',
        padding: '2rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Stay Updated with Hard Money News
        </h2>
        <p style={{ marginBottom: '1.5rem', maxWidth: '32rem', margin: '0 auto 1.5rem auto', color: '#cbd5e1' }}>
          Subscribe to receive the latest market trends, lending innovations, and expert insights on hard money lending.
        </p>
        
        <form onSubmit={handleSubmit} style={{ maxWidth: '28rem', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: window.innerWidth < 640 ? 'column' : 'row',
            gap: window.innerWidth < 640 ? '0.75rem' : '0'
          }}>
            <input 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                width: '100%',
                borderRadius: window.innerWidth < 640 ? '0.375rem' : '0.375rem 0 0 0.375rem',
                border: '1px solid #475569',
                backgroundColor: '#1e293b',
                color: 'white',
                outline: 'none'
              }}
              required
            />
            <button 
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                fontWeight: '600',
                borderRadius: window.innerWidth < 640 ? '0.375rem' : '0 0.375rem 0.375rem 0',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              Subscribe
            </button>
          </div>
        </form>
        
        {submitted && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.5rem', 
            backgroundColor: 'rgba(16, 185, 129, 0.1)', 
            borderRadius: '0.375rem',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'inline-block'
          }}>
            <p style={{ color: '#10b981', display: 'flex', alignItems: 'center' }}>
              <i className="bx bx-check-circle" style={{ marginRight: '0.5rem' }}></i>
              Thanks for subscribing!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default SubscribeSection;
