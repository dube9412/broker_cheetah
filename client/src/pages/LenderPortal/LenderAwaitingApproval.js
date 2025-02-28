import React from "react";
import { Link } from "react-router-dom";

const LenderAwaitingApproval = () => {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Your Account is Awaiting Approval</h2>
            <p>An administrator needs to approve your account before you can access the lender portal.</p>
            <p>Please contact support if you believe this is taking too long.</p>
            <Link to="/">Return to Home</Link>
        </div>
    );
};

export default LenderAwaitingApproval;
