import React, { useState } from "react";
import { Link } from "react-router-dom";

function Module3() {
  const [expanded, setExpanded] = useState(null);
  const toggleSection = (section) => setExpanded(expanded === section ? null : section);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">💰 How to Get a Loan Quote</h1>

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
          <button onClick={() => toggleSection("loan-quote-steps")} className="text-blue-500 hover:underline">
            🔹 Steps to Get a Loan Quote
          </button>
          {expanded === "loan-quote-steps" && (
            <p className="mt-2 p-4 border border-gray-300 rounded">
              To get a hard money loan quote, you need to provide details such as:
              <ul className="list-disc ml-6">
                <li>Property Address & Purchase Price</li>
                <li>Loan Amount Requested</li>
                <li>Rehab Budget (if applicable)</li>
                <li>Exit Strategy (Flip, Rental, etc.)</li>
              </ul>
            </p>
          )}
        </div>

        <div>
          <button onClick={() => toggleSection("common-mistakes")} className="text-blue-500 hover:underline">
            🔹 Common Mistakes When Requesting a Quote
          </button>
          {expanded === "common-mistakes" && (
            <p className="mt-2 p-4 border border-gray-300 rounded">
              <ul className="list-disc ml-6">
                <li>Not providing enough details (Lenders hate incomplete info)</li>
                <li>Underestimating rehab costs</li>
                <li>Overestimating After Repair Value (ARV)</li>
              </ul>
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

export default Module3;
