// src/pages/NotFound.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '50px', color: '#ff6347' }}>404</h1>
      <h2>Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
      <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 15px', cursor: 'pointer' }}>
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
