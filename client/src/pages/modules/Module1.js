import React, { useState } from "react";
import { Link } from "react-router-dom";

function Module1() {
  const [expanded, setExpanded] = useState(null);
  const toggleSection = (section) => setExpanded(expanded === section ? null : section);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📖 Introduction to Hard Money Lending</h1>
      
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
          <button onClick={() => toggleSection("what-is-hard-money")} className="text-blue-500 hover:underline">
            🔹 What is Hard Money?
          </button>
          {expanded === "what-is-hard-money" && (
            <p className="mt-2 p-4 border border-gray-300 rounded">
              Hard money lending is a type of short-term financing secured by real estate. It is commonly used by real estate investors who need quick funding for fix-and-flip projects.
            </p>
          )}
        </div>

        <div>
          <button onClick={() => toggleSection("vs-traditional-loans")} className="text-blue-500 hover:underline">
            🔹 How Hard Money Differs from Traditional Loans
          </button>
          {expanded === "vs-traditional-loans" && (
            <p className="mt-2 p-4 border border-gray-300 rounded">
              Unlike traditional loans, hard money loans are based on property value rather than borrower credit. They have higher interest rates and shorter terms.
            </p>
          )}
        </div>

        <div>
          <button onClick={() => toggleSection("private-lenders")} className="text-blue-500 hover:underline">
            🔹 The Role of Private Lenders
          </button>
          {expanded === "private-lenders" && (
            <p className="mt-2 p-4 border border-gray-300 rounded">
              Private lenders fund hard money loans. They focus on asset value and deal potential rather than borrower financials.
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

export default Module1;

