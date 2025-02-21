import React from "react";
import { Link } from "react-router-dom";

function Module4() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📤 Submitting a Loan</h1>
      <p>WAIT. On your computer, create a folder that is for lending. In your email, do the same. Create a
      folder with your client’s name and create TWO subfolders; one for things provided to you and one for
      things you sent to the lender.</p>

      <h2 className="text-xl font-bold mt-6">📂 Organization Before Submission</h2>
      <p>Some lenders, like any ROC company, use an **online portal** (NEW SCHOOL).  
      Other lenders, like **Lima One**, do most everything via email to a specific link but also have a portal (OLD SCHOOL).</p>

      <h2 className="text-xl font-bold mt-6">📋 Steps for Submission</h2>
      <ol className="list-decimal ml-6">
        <li>**Get a rep** (Call them, yes, it’s that easy).</li>
        <li>Ask rep for a **submission packet** for the loan type you need.</li>
        <li>Fill out **as much as you can** before sending it to the borrower.</li>
        <li>Gather all required documents: **ID, Company Docs, Asset Statements, Contracts, etc.**</li>
        <li>Submit the package to the lender’s designated contact.</li>
        <li>Follow up **constantly** to ensure the loan progresses.</li>
        <li>Monitor for **Clear to Close (CTC)** and ensure title & lender communicate.</li>
        <li>Get **PAID**. The lender doesn’t distribute the funds—**Title does!**</li>
      </ol>
      
      
    </div>
  );
}

export default Module4;

