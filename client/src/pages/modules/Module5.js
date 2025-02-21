import React, { useState } from "react";
import { Link } from "react-router-dom";

function Module5() {
  const [expanded, setExpanded] = useState(null);
  const toggleSection = (section) => setExpanded(expanded === section ? null : section);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🔍 Understanding the Lender Process</h1>

      {/* ✅ YouTube Video Placeholder */}
      <div className="mb-6">
        <p className="font-bold">🎥 Video Overview (Coming Soon)</p>
        <div className="bg-gray-300 w-full h-48 flex items-center justify-center">
          <p className="text-gray-600">[VIDEO PLACEHOLDER]</p>
        </div>
      </div>

      <p className="mt-2">The lender's process typically follows these steps:</p>
      <ol className="list-decimal ml-6">
        <li>Preliminary Review & Term Sheet</li>
        <li>Underwriting (Background, Experience, Appraisal)</li>
        <li>Approval & Loan Docs</li>
        <li>Closing & Funding</li>
      </ol>

      <Link to="/hard-money-class" className="text-blue-500 hover:underline mt-6 block">
        ← Back to Class
      </Link>
    </div>
  );
}

export default Module5;
