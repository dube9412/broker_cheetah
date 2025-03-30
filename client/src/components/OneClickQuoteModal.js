import React, { useState } from "react";

const OneClickQuoteModal = ({ selectedLenders, onClose }) => {
  const [loanType, setLoanType] = useState("fixAndFlip");
  const [formData, setFormData] = useState({
    address: "",
    ficoScore: "",
    experience: "",
    purchasePrice: "",
    rehabNeeded: "",
    arv: "",
    liquidity: "",
    rentRate: "",
    taxes: "",
    insurance: "",
    hoa: "",
    downPayment: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Quote Request to:", selectedLenders);
    console.log("Form Data:", formData);

    try {
      const response = await fetch(
        "https://broker-cheetah-backend.onrender.com/api/quotes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selectedLenders, formData }),
        }
      );

      if (response.ok) {
        alert("Quote request submitted successfully!");
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting quote request:", error);
      alert("An error occurred while submitting the quote request.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">One-Click Quote Request</h2>
        <label className="block mb-2">Select Loan Type</label>
        <select value={loanType} onChange={(e) => setLoanType(e.target.value)} className="w-full p-2 border rounded mb-4">
          <option value="fixAndFlip">Fix & Flip</option>
          <option value="dscr">DSCR</option>
        </select>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Property Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />

          <label className="block mb-2">Approx. FICO Score</label>
          <input type="number" name="ficoScore" value={formData.ficoScore} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />

          {loanType === "fixAndFlip" && (
            <>
              <label className="block mb-2">Experience Level (Flips Completed)</label>
              <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />

              <label className="block mb-2">Purchase Price</label>
              <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />

              <label className="block mb-2">Rehab Needed</label>
              <input type="number" name="rehabNeeded" value={formData.rehabNeeded} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />

              <label className="block mb-2">Approx. ARV (After Repair Value)</label>
              <input type="number" name="arv" value={formData.arv} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />
            </>
          )}

          {loanType === "dscr" && (
            <>
              <label className="block mb-2">Rent Rate (or Market Rent)</label>
              <input type="number" name="rentRate" value={formData.rentRate} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />

              <label className="block mb-2">Taxes</label>
              <input type="number" name="taxes" value={formData.taxes} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />

              <label className="block mb-2">Insurance</label>
              <input type="number" name="insurance" value={formData.insurance} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />

              <label className="block mb-2">HOA Fees (if applicable)</label>
              <input type="number" name="hoa" value={formData.hoa} onChange={handleChange} className="w-full p-2 border rounded mb-4" />
            </>
          )}

          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit Quote Request</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OneClickQuoteModal;
