import React from "react";
import { Link } from "react-router-dom";

function Module2() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📖 Loan Types & When to Use Them</h1>
      <p>There are multiple types of hard money loans, each suited for different real estate investment strategies.</p>

      <h2 className="text-xl font-bold mt-6">Common Loan Types:</h2>
      <ul className="list-disc ml-6">
        <li>🔹 Fix and Flip Loans</li>
        <li>🔹 Bridge Loans</li>
        <li>🔹 DSCR Loans</li>
        <li>🔹 Ground-Up Construction Loans</li>
      </ul>
    </div>
  );
}

export default Module2;
