import React, { useState } from "react";
import { Link } from "react-router-dom";

function Module2() {
  const [expanded, setExpanded] = useState(null);
  const toggleSection = (section) => setExpanded(expanded === section ? null : section);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🏡 Loan Types & When to Use Them</h1>

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
          <button onClick={() => toggleSection("fix-and-flip")} className="text-blue-500 hover:underline">
            🔹 Fix & Flip Loans
          </button>
          {expanded === "fix-and-flip" && (
            <p className="mt-2 p-4 border border-gray-300 rounded">
              Fix & Flip loans are short-term loans designed for investors buying properties to renovate and resell for a profit. These loans typically cover the purchase price and renovation costs.
            </p>
          )}
        </div>

        <div>
          <button onClick={() => toggleSection("dscr-loans")} className="text-blue-500 hover:underline">
            🔹 DSCR Loans (Debt Service Coverage Ratio)
          </button>
          {expanded === "dscr-loans" && (
            <p className="mt-2 p-4 border border-gray-300 rounded">
              DSCR loans are used for rental properties. They qualify based on rental income rather than borrower income, making them ideal for investors with multiple properties.
            </p>
          )}
        </div>

        <div>
          <button onClick={() => toggleSection("ground-up-construction")} className="text-blue-500 hover:underline">
            🔹 Ground-Up Construction Loans
          </button>
          {expanded === "ground-up-construction" && (
            <p className="mt-2 p-4 border border-gray-300 rounded">
              These loans fund new construction projects from start to finish. They are typically interest-only until project completion.
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

export default Module2;
