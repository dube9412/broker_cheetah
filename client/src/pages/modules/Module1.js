import React from "react";
import { Link } from "react-router-dom";

function Module1() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📖 Introduction to Hard Money Lending</h1>
      <p>Hard money lending is a type of short-term financing secured by real estate. It is commonly used by real estate investors who need quick funding for fix-and-flip projects.</p>
      
      <h2 className="text-xl font-bold mt-6">Key Topics:</h2>
      <ul className="list-disc ml-6">
        <li>🔹 What is Hard Money?</li>
        <li>🔹 How Hard Money Differs from Traditional Loans</li>
        <li>🔹 The Role of Private Lenders</li>
      </ul>

      <Link to="/hard-money-class" className="text-blue-500 hover:underline mt-6 block">
        ← Back to Class
      </Link>
    </div>
  );
}

export default Module1;
