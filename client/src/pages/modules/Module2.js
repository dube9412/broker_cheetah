import React from "react";
import { Link } from "react-router-dom";

function Module2() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Getting & Analyzing Loan Quotes</h1>

      <h2 className="text-xl font-semibold mt-4">1️⃣ Getting a Quote</h2>
      <p>To get a loan quote, you'll need basic **borrower & property information**:</p>
      <ul className="list-disc ml-6">
        <li>✔️ Borrower **credit score & experience**</li>
        <li>✔️ Assets available for closing</li>
        <li>✔️ Property details (address, condition, rehab cost, etc.)</li>
        <li>✔️ **Loan type & leverage request**</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">2️⃣ Analyzing Loan Quotes</h2>
      <p>Quotes come in various formats (emails, PDFs). Your job is to:</p>
      <ul className="list-disc ml-6">
        <li>✔️ Compare **rate, fees, leverage, and lender requirements**</li>
        <li>✔️ Prioritize lenders based on client **sensitivities**</li>
        <li>✔️ Present the best **3 options** to the client, guiding them to the right choice</li>
      </ul>

      <p className="mt-4">🔹 *Your ability to analyze quotes correctly will set you apart as a broker!*</p>
      <div className="mt-6">
  <h2 className="text-xl font-bold">🎥 Video Lesson</h2>
  <p>Coming soon! This video will cover {lesson.title} in detail.</p>
  <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-600">
    Video Placeholder
  </div>
</div>
      
    </div>
  );
}

export default Module2;
