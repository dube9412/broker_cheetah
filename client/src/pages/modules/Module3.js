import React from "react";
import { Link } from "react-router-dom";

function Module3() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📄 General Loan Application Information</h1>

      <h2 className="text-xl font-semibold mt-4">✅ Required Documents</h2>
      <ul className="list-disc ml-6">
        <li>✔️ **Borrower Application** (including Credit Authorization)</li>
        <li>✔️ **Company Documents** (LLC Operating Agreement, Articles of Organization)</li>
        <li>✔️ **Asset Statements (2 months of bank statements)**</li>
        <li>✔️ **Purchase Contract** (if applicable)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">📌 Loan Type-Specific Requirements</h2>
      <ul className="list-disc ml-6">
        <li>🏚️ **Fix & Flip** – Need **As-Is Value, Rehab Budget, ARV**</li>
        <li>🏗️ **Ground Up** – Need **Land Ownership Details, Plans, Permits**</li>
        <li>🏠 **DSCR** – Need **Market Value, Lease Agreement, Tax & Insurance Costs**</li>
      </ul>

      <p className="mt-4">🔹 *The more complete your application, the **faster the approval process**!*</p>

          </div>
  );
}

export default Module3;

