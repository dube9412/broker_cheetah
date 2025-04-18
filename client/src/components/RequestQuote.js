import React, { useState, useEffect } from "react";
 import { useParams } from "react-router-dom";
 
 function RequestQuote() {
   const { lenderId } = useParams();
   const [lender, setLender] = useState(null);
 
   useEffect(() => {
     fetch(`/api/lenders/${lenderId}`)
       .then((res) => res.json())
       .then((data) => setLender(data))
       .catch((err) => console.error(err));
   }, [lenderId]);
 
   if (!lender) return <p>Loading...</p>;
 
   return (
     <div>
       <h2>Request a Quote from {lender.name}</h2>
       <p><strong>Contact:</strong> {lender.email}</p>
       <p><strong>Phone:</strong> {lender.phone}</p>
 
       <h3>Next Steps to Get a Quote</h3>
       <ul>
         <li>📍 <strong>Property Address</strong></li>
         <li>📊 <strong>Guarantor's FICO Score</strong></li>
         <li>🏚 <strong>Number of Flips (Experience)</strong></li>
         <li>💰 <strong>Purchase Price</strong></li>
         <li>🛠 <strong>Rehab Money Needed</strong></li>
         <li>🏡 <strong>After Repair Value (ARV)</strong></li>
         <li>💵 <strong>Liquidity</strong></li>
       </ul>
 
       <button>Contact Lender</button>
     </div>
   );
 }
 
 export default RequestQuote;