import React, { useState } from "react";
import { Link } from "react-router-dom";

function Module7() {
  const [expanded, setExpanded] = useState(null);
  const toggleSection = (section) => setExpanded(expanded === section ? null : section);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Loan Calculations & Deal Structuring</h1>

      {/* ✅ YouTube Video Placeholder */}
      <div className="mb-6">
        <p className="font-bold">🎥 Video Overview (Coming Soon)</p>
        <div className="bg-gray-300 w-full h-48 flex items-center justify-center">
          <p className="text-gray-600">[VIDEO PLACEHOLDER]</p>
        </div>
      </div>

      {/* ✅ Expandable Sections */}
      <div className="space-y-4">
        <div>
          <button onClick={() => toggleSection("loan-amount")} className="text-blue-500 hover:underline">
            🔹 How to Calculate Loan Amount
          </button>
          {expanded === "loan-amount" && (
            <p className="mt-2 p-4 border border-gray-300 rounded">
              Loan amount is determined by **Loan-to-Cost (LTC)** and **Loan-to-ARV (After Repair Value)**.
              <ul className="list-disc ml-6">
                <li>Loan to Cost (LTC) = (Loan Amount) ÷ (Purchase Price + Rehab)</li>
                <li>Loan to ARV = (Loan Amount) ÷ (After Repair Value)</li>
              </ul>
              The lower of these two numbers is the **max loan amount** a lender will approve.
            </p>
          )}
        </div>

        <div>
          <button onClick={() => toggleSection("holding-costs")} className="text-blue-500 hover:underline">
            🔹 Understanding Holding Costs
          </button>
          {expanded === "holding-costs" && (
            <p className="mt-2 p-4 border border-gray-300 rounded">
              Holding costs include **loan interest, property taxes, utilities, and maintenance**. They are typically calculated as:
              <br />
              <strong>Holding Costs = (Loan Amount × Interest Rate / 12) × Time Held</strong>
            </p>
          )}
        </div>

        <div>
          <button onClick={() => toggleSection("profit-calculation")} className="text-blue-500 hover:underline">
            🔹 How to Calculate Profit
          </button>
          {expanded === "profit-calculation" && (
            <p className="mt-2 p-4 border border-gray-300 rounded">
              Profit is determined by subtracting all costs from the final sale price:
              <br />
              <strong>Profit = Sale Price - (Purchase Price + Rehab + Closing Costs + Holding Costs + Selling Costs)</strong>
            </p>
          )}
        </div>
      </div>

      <Link to="/hard-money-class" className="text-blue-500 hover:underline mt-6 block">
        ← Back to Class
      </Link>
    </div>
  );
}

export default Module7;
