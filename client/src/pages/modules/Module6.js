import React, { useState } from "react";
import { Link } from "react-router-dom";

function Module6() {
  const [expanded, setExpanded] = useState(null);
  const toggleSection = (section) => setExpanded(expanded === section ? null : section);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📢 Marketing Yourself as a Loan Broker</h1>

      {/* ✅ YouTube Video Placeholder */}
      <div className="mb-6">
        <p className="font-bold">🎥 Video Overview (Coming Soon)</p>
        <div className="bg-gray-300 w-full h-48 flex items-center justify-center">
          <p className="text-gray-600">[VIDEO PLACEHOLDER]</p>
        </div>
      </div>

      <p className="mt-2">To build a strong brand as a loan broker:</p>
      <ul className="list-disc ml-6">
        <li>Build a professional website</li>
        <li>Leverage social media marketing</li>
        <li>Attend real estate networking events</li>
      </ul>

      <Link to="/hard-money-class" className="text-blue-500 hover:underline mt-6 block">
        ← Back to Class
      </Link>
    </div>
  );
}

export default Module6;
