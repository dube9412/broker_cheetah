import React from "react";
import { Link } from "react-router-dom";

function Module7() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📖 Loan Glossary & Acronyms</h1>
      <p>Understanding key lending terms will make navigating loans much easier.</p>

      <h2 className="text-xl font-bold mt-6">💡 Common Lending Terms</h2>
      <ul className="list-disc ml-6">
        <li><strong>AIV</strong> – As-is Value</li>
        <li><strong>LA or ILA</strong> – Loan Amount or Initial Loan Amount</li>
        <li><strong>ARV</strong> – After Repair Value</li>
        <li><strong>MV</strong> – Market Value</li>
        <li><strong>LTC</strong> – Loan to Cost</li>
        <li><strong>LTV</strong> – Loan to Value</li>
        <li><strong>BRRR</strong> – Buy, Rehab, Rent, Refinance</li>
        <li><strong>DSCR</strong> – Debt Service Coverage Ratio</li>
        <li><strong>PPP</strong> – Prepayment Penalty</li>
        <li><strong>CTC</strong> – Clear to Close</li>
        <li><strong>EOI</strong> – Evidence of Insurance</li>
      </ul>

      <h2 className="text-xl font-bold mt-6">🧐 Client Sensitivities to Consider</h2>
      <p>Understanding a client’s **top concern** is crucial for placing their loan.</p>
      <ul className="list-disc ml-6">
        <li>**Interest Rate**</li>
        <li>**Origination Fees**</li>
        <li>**Loan Term**</li>
        <li>**LTC / LTV Caps**</li>
        <li>**Draw Process**</li>
        <li>**Prepayment Penalties**</li>
      </ul>

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

export default Module7;

