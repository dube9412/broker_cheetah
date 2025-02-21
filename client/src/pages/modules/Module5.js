import React from "react";
import { Link } from "react-router-dom";

function Module5() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🏦 Understanding the Lender Process</h1>
      <p>Once a loan is submitted, it follows a structured process before funding.</p>

      <h2 className="text-xl font-bold mt-6">📝 The 12-Step Lender Process</h2>
      <ol className="list-decimal ml-6">
        <li>**Quote** – Get multiple quotes and negotiate terms.</li>
        <li>**Submission** – Provide the lender with all required documents.</li>
        <li>**Appraisal Ordered** – Borrower receives a secure payment link.</li>
        <li>**Account Exec Review** for submission to underwriting.</li>
        <li>**Underwriting Review Begins.**</li>
        <li>**Conditions** – Additional requests from the lender may arise.</li>
        <li>**Lender Sends Documents to Title for Closing Preparation.**</li>
        <li>**Final Review by Lender.**</li>
        <li>**Title & Lender Confirm Closing Documents.**</li>
        <li>**Clear to Close (CTC) Issued.**</li>
        <li>**Borrower Signs at Closing.**</li>
        <li>**Loan is Funded, and Brokers Get Paid!** 💰</li>
      </ol>

      <h2 className="text-xl font-bold mt-6">✅ What Happens at Closing?</h2>
      <p>Once the **CTC** is issued, the lender wires funds to the title company, which distributes payments to all parties.</p>

      <div className="mt-6">
  <h2 className="text-xl font-bold">🎥 Video Lesson</h2>
  <p>Coming soon! This video will cover {lesson?.title || "this topic"} in detail.</p>
  <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-600">
    Video Placeholder
  </div>
</div>
    </div>
  );
}

export default Module5;

