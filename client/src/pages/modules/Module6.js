import React from "react";
import { Link } from "react-router-dom";

function Module6() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📣 Marketing Yourself as a Loan Broker</h1>
      <p>Now that you understand loans, let’s talk about how to **get clients**.</p>

      <h2 className="text-xl font-bold mt-6">🚀 The Simple Facebook Group Method</h2>
      <ul className="list-disc ml-6">
        <li>Find **real estate investing** groups on Facebook.</li>
        <li>Post about a **niche lending program** you offer.</li>
        <li>Answer questions **publicly** to increase engagement.</li>
        <li>Move serious clients into **direct messages**.</li>
        <li>Only **chase real deals**, avoid impossible scenarios.</li>
      </ul>

      <h2 className="text-xl font-bold mt-6">📊 Long-Term Marketing Strategies</h2>
      <ul className="list-disc ml-6">
        <li>Build a **personal brand** on LinkedIn & social media.</li>
        <li>Encourage **Google Reviews** from past clients.</li>
        <li>Network with **real estate agents, title companies, & investors**.</li>
        <li>Use **targeted ads** on Facebook, Google, and LinkedIn.</li>
      </ul>
      <div className="mt-6">
  <h2 className="text-xl font-bold">🎥 Video Lesson</h2>
  <p>Coming soon! This video will cover {lesson?.title || "this topic"} in detail.</p>
  <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-600">
    Video Placeholder
  </div>
</div>
     
    </div>
  );
}

export default Module6;
