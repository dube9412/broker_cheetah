// src/pages/LenderPortal/LenderDashboard.js (CORRECTED - with Context)
import React, { useState, useEffect, useContext } from 'react'; // Import useContext
import { useNavigate } from 'react-router-dom';
import { LenderAuthContext } from '../../context/LenderAuthContext'; // Import context

const LenderDashboard = () => {
    const navigate = useNavigate();
    const { lenderUserId, isLenderLoggedIn, logoutLender } = useContext(LenderAuthContext); // Use context
    const [lenderUserInfo, setLenderUserInfo] = useState(null);
    const [pendingEdits, setPendingEdits] = useState({});
    const [logo, setLogo] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token'); // Still get token from localStorage

        if (!token || !lenderUserId) {
            // No need to check isLenderLoggedIn here; presence of token and ID is sufficient
            navigate('/lender/login');
            return;
        }

        const fetchLenderUserInfo = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lender-users/${lenderUserId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Use the token from localStorage
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setLenderUserInfo(data);
                } else {
                    console.error('Error fetching lender user info:', data.message);
                    if (response.status === 401 || response.status === 403) {
                        logoutLender(); // Logout if unauthorized
                        navigate('/lender/login');
                    }
                }
            } catch (error) {
                console.error('API Error:', error);
            }
        };

        fetchLenderUserInfo();
    }, [navigate, lenderUserId, logoutLender]); // Add logoutLender to dependency array


    const handleEditChange = (e) => {
        setPendingEdits({
            ...pendingEdits,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmitEdits = async () => {
        // No need to get lenderUserId from localStorage; it's in context
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lender-users/${lenderUserId}`, {
                method: 'PUT', // Or PATCH
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify( pendingEdits ),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Your changes have been saved.');
                setPendingEdits({});
                setLenderUserInfo(data); // Update with the response data
            } else {
                setMessage('Error submitting changes.');
            }
        } catch (error) {
            console.error('Edit submission error:', error);
            setMessage('Error submitting changes.');
        }
    };

    const handleLogoUpload = async (e) => {
        // No need to get lenderUserId from localStorage; it's in context
        const token = localStorage.getItem('token');
        const file = e.target.files[0];
        setLogo(file);
        setUploading(true);

        const formData = new FormData();
        formData.append('logo', file);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lender-users/${lenderUserId}/upload-logo`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setLenderUserInfo({ ...lenderUserInfo, logoUrl: data.logoUrl });
                setMessage('Logo uploaded successfully!');
            } else {
                setMessage('Error uploading logo.');
            }
        } catch (error) {
            console.error('Logo upload error:', error);
            setMessage('Error uploading logo.');
        }

        setUploading(false);
    };



    return (
        <div className="lender-dashboard">
            <h2>Welcome to Your Lender User Portal</h2>

            {lenderUserInfo ? (
                <>
                    <div className="lender-info">
                        <label>Company Name:</label>
                        <input
                            type="text"
                            name="companyName"
                            value={pendingEdits.companyName ?? lenderUserInfo.companyName ?? ''}
                            onChange={handleEditChange}
                        />

                        <label>Contact Email:</label>
                        <input
                            type="email"
                            name="contactEmail"
                            value={pendingEdits.contactEmail ?? lenderUserInfo.contactEmail ?? ''}
                            onChange={handleEditChange}
                        />

                        <label>Phone:</label>
                        <input
                            type="text"
                            name="phone"
                            value={pendingEdits.phone ?? lenderUserInfo.phone ?? ''}
                            onChange={handleEditChange}
                        />

                        <label>States Operating In:</label>
                        <input
                            type="text"
                            name="states"
                            value={pendingEdits.states ?? lenderUserInfo.states ?? ''}
                            onChange={handleEditChange}
                        />

                        <button onClick={handleSubmitEdits}>Submit Changes</button>

                        <h3>Company Logo:</h3>
                        {lenderUserInfo.logoUrl && <img src={lenderUserInfo.logoUrl} alt="Company Logo" />}
                        <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
                    </div>

                    <div className="lender-actions">
                         <button onClick={() => navigate(`/lender/loan-programs/${lenderUserInfo.lenderId}`)}>
                            Manage Loan Programs
                        </button>
                        <button onClick={() => navigate("/lender/documents")}>
                            Manage Documents
                        </button>
                    </div>

                    {message && <p>{message}</p>}
                </>
            ) : (
                <p>Loading lender user information...</p>
            )}
        </div>
    );
};

export default LenderDashboard;
  