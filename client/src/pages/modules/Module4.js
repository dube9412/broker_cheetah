import React, { useState } from "react";
import { Link } from "react-router-dom";

function Module4() {
  const [expanded, setExpanded] = useState(null);
  const toggleSection = (section) => setExpanded(expanded === section ? null : section);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📑 Submitting a Loan Package</h1>

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
          <button onClick={() => toggleSection("loan-documents")} className="text-blue-500 hover:underline">
            🔹 Required Documents for a Loan Package
          </button>
          {expanded === "loan-documents" && (
            <p className="mt-2 p-4 border border-gray-300 rounded">
              A complete loan package should include:
              <ul className="list-disc ml-6">
                <li>Loan Application</li>
                <li>Purchase Agreement</li>
                <li>Scope of Work (if rehab is involved)</li>
                <li>Proof of Funds</li>
              </ul>
            </p>
          )}
        </div>

        <div>
          <button onClick={() => toggleSection("how-to-submit")} className="text-blue-500 hover:underline">
            🔹 How to Submit a Loan Package
          </button>
          {expanded === "how-to-submit" && (
            <p className="mt-2 p-4 border border-gray-300 rounded">
              Most lenders accept submissions via email or their portal. Ensure everything is **organized** and **complete** to avoid delays.
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

export default Module4;
