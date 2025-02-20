import React from "react";
import { Link } from "react-router-dom";
import resources from "../data/resources";

function HardMoneyClass() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Hard Money Lending Class</h1>
      <p className="mb-4">Learn everything you need to know about hard money lending, from the basics to advanced strategies.</p>
      
      <h2 className="text-xl font-bold mt-6">Modules</h2>
      <ul className="list-disc ml-6">
        <li><Link to="/hard-money-class/module-1" className="text-blue-500 hover:underline">📖 Introduction to Hard Money Lending</Link></li>
        <li><Link to="/hard-money-class/module-2" className="text-blue-500 hover:underline">🏡 Loan Types & When to Use Them</Link></li>
        <li><Link to="/hard-money-class/module-3" className="text-blue-500 hover:underline">💰 How to Get a Loan Quote</Link></li>
        <li><Link to="/hard-money-class/module-4" className="text-blue-500 hover:underline">📑 Submitting a Loan Package</Link></li>
        <li><Link to="/hard-money-class/module-5" className="text-blue-500 hover:underline">🔍 Understanding the Lender Process</Link></li>
        <li><Link to="/hard-money-class/module-6" className="text-blue-500 hover:underline">📢 Marketing Yourself as a Loan Broker</Link></li>
        <li><Link to="/hard-money-class/module-7" className="text-blue-500 hover:underline">📊 Loan Calculations & Deal Structuring</Link></li>
      </ul>
      
      <h2 className="text-xl font-bold mt-6">Downloadable Resources</h2>
      <ul className="list-disc ml-6">
        {resources.map((resource, index) => (
          <li key={index} className="mb-2">
            <a href={resource.url} className="text-blue-500 hover:underline" download>
              {resource.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HardMoneyClass;

