import React, { useState } from "react";

const BASE_URL = "https://www.brokercheetah.com/api/quotes/fix-and-flip"; // Updated to explicitly use the correct route

const FixAndFlipQuoteModal = ({ selectedLenders, onClose, searchData }) => {
  const [formData, setFormData] = useState({
    address: searchData.address || "",
    ficoScore: searchData.fico || "",
    experience: searchData.experience || "",
    purchasePrice: searchData.purchasePrice || "",
    rehabNeeded: searchData.rehabNeeded || "",
    arv: searchData.arv || "",
    liquidity: searchData.liquidity || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🔍 Request Headers:", {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    });
    console.log("🔍 Request Payload:", {
      lenderId: selectedLenders[0],
      loanType: "fixAndFlip", // Replace undefined loanType with hardcoded value
      ...formData,
    });

    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          lenderIds: selectedLenders, // Send all selected lenders
          loanType: "fixAndFlip",
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quote request");
      }

      alert("Quote request submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting quote request:", error);
      alert("An error occurred while submitting the quote request.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Fix & Flip Quote Request</h2>
        <form onSubmit={handleSubmit}>
          <label>Property Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />

          <label>FICO Score</label>
          <input type="number" name="ficoScore" value={formData.ficoScore} onChange={handleChange} required />

          <label>Experience</label>
          <input type="number" name="experience" value={formData.experience} onChange={handleChange} required />

          <label>Purchase Price</label>
          <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} required />

          <label>Rehab Needed</label>
          <input type="number" name="rehabNeeded" value={formData.rehabNeeded} onChange={handleChange} required />

          <label>ARV</label>
          <input type="number" name="arv" value={formData.arv} onChange={handleChange} required />

          <label>Liquidity</label>
          <input type="number" name="liquidity" value={formData.liquidity} onChange={handleChange} required />

          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default FixAndFlipQuoteModal;