import React, { useState } from "react";
import { Link } from "react-router-dom";

function Module1() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📖 Loan Types & When to Use Them</h1>
      <p className="mb-4">
        Understanding loan types is **critical** in hard money lending. Each serves a different purpose based on the **property type, investor goals, and required terms**.
      </p>

      {[
        {
          title: "Fix and Flip 🏚️ → 🏡",
          content: "Short-term (usually 12 months). Used for purchasing and rehabbing a property. Any exit strategy is acceptable (sell, refi, rent, etc.).",
        },
        {
          title: "Ground Up Construction 🏗️",
          content: "Designed for **building new properties**, NOT buying land. Usually 18-month terms with required exit plans (sale or rent).",
        },
        {
          title: "Stabilized Bridge 🌉",
          content: "Short-term extension loans for **stabilized properties** (no major rehab needed). Used when waiting for DSCR refi or property sale.",
        },
        {
          title: "DSCR (Debt Service Coverage Ratio) 🏠💰",
          content: "**For rental properties** with little to no income documentation required. Uses the rental income to qualify. Typically a **30-year mortgage**.",
        },
        {
          title: "BRRR (Buy, Rehab, Refi, Repeat) 🔄",
          content: "A strategy where investors **buy distressed properties, rehab them, then refinance into a DSCR loan** to pull cash out and keep reinvesting.",
        },
      ].map((section, index) => (
        <div key={index} className="border-b py-4">
          <button
            onClick={() => toggleSection(index)}
            className="text-blue-500 font-bold hover:underline w-full text-left"
          >
            {section.title}
          </button>
          {openSection === index && <p className="mt-2">{section.content}</p>}
        </div>
      ))}
     

    </div>
    
  );
}

export default Module1;

