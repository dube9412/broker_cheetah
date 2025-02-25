// LenderLogin.js (CORRECTED)
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LenderLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State for error messages

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lender/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('lenderUserId', data.lenderUserId);

                if (data.approved) {
                    if (data.lenderId) {
                        navigate('/lender/dashboard'); // Approved AND assigned
                    } else {
                        navigate('/lender/awaiting-assignment'); // Approved but NOT assigned
                    }
                } else {
                    navigate('/lender/awaiting-approval'); // Not approved - should not hit this.
                }
            } else if (response.status === 403) {
                setError('Your account is awaiting administrator approval.'); // Display on login page
            } else {
                setError(data.message || 'Invalid credentials.'); // Display on login page
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Error during login.'); // Display on login page
        }
    };

    return (
        <div className="lender-login" style={{ padding: '20px' }}>
            <h2>Lender User Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/lender/signup">Sign Up</Link>
            </p>
        </div>
    );
};

export default LenderLogin;


