// src/pages/LenderPortal/LenderDashboard.js (HARDCODED URLS - FOR IMMEDIATE FIX)
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LenderAuthContext } from '../../context/LenderAuthContext'; // Import context

const LenderDashboard = () => {
    const navigate = useNavigate();
    const { lenderUserId, logoutLender } = useContext(LenderAuthContext); // Use context
    const [lenderUserInfo, setLenderUserInfo] = useState(null);
    const [pendingEdits, setPendingEdits] = useState({});
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [logo, setLogo] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token || !lenderUserId) {
            navigate('/lender/login');
            return;
        }

        const fetchLenderUserInfo = async () => {
            try {
                // *** HARDCODED URL ***
                const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/lender-users/${lenderUserId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setLenderUserInfo(data);
                } else {
                    console.error('Error fetching lender user info:', data.message);
                    if (response.status === 401 || response.status === 403) {
                        logoutLender();
                        navigate('/lender/login');
                    }
                }
            } catch (error) {
                console.error('API Error:', error);
            }
        };

        fetchLenderUserInfo();
    }, [navigate, lenderUserId, logoutLender]);


    const handleEditChange = (e) => {
        setPendingEdits({
            ...pendingEdits,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmitEdits = async () => {
        const token = localStorage.getItem('token');

        try {
            // *** HARDCODED URL ***
            const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/lender-users/${lenderUserId}`, {
                method: 'PUT', // Or PATCH
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(pendingEdits),
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
        const token = localStorage.getItem('token');
        const file = e.target.files[0];
        setLogo(file);
        setUploading(true);

        const formData = new FormData();
        formData.append('logo', file);

        try {
            // *** HARDCODED URL ***
            const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/lender-users/${lenderUserId}/upload-logo`, {
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

{/* ✅ Display selected logo before uploading */}
{logo && (
    <div>
        <p>Preview:</p>
        <img src={URL.createObjectURL(logo)} alt="Selected Logo" style={{ maxWidth: "150px", maxHeight: "150px" }} />
    </div>
)}

{/* ✅ Display existing logo if already uploaded */}
{lenderUserInfo?.logoUrl && <img src={lenderUserInfo.logoUrl} alt="Company Logo" style={{ maxWidth: "150px", maxHeight: "150px" }} />}

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