import React, { useState } from "react";

const BASE_URL = "https://broker-cheetah-backend.onrender.com/api/quotes/fix-and-flip"; // Updated to use the correct backend base URL

const FixAndFlipQuoteModal = ({ selectedLenders, onClose, searchData }) => {
  const [formData, setFormData] = useState({
    address: searchData.address || "",
    ficoScore: searchData.fico || "",
    experience: searchData.experience || "",
    purchasePrice: searchData.purchasePrice || "",
    rehabNeeded: searchData.rehabNeeded || "",
    arv: searchData.arv || "",
    liquidity: searchData.liquidity || "",
    propertyType: searchData.propertyType || "", // New field
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          propertyAddress: formData.address, // Updated field name
          ficoScore: formData.ficoScore,
          experience: formData.experience,
          purchasePrice: formData.purchasePrice,
          rehabNeeded: formData.rehabNeeded,
          arv: formData.arv,
          liquidity: formData.liquidity,
          propertyType: formData.propertyType, // Include propertyType
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

          <label>Property Type</label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
            required
          >
            <option value="">-- Select Property Type --</option>
            <option value="Single Family 1-4">Single Family 1-4</option>
            <option value="Condo">Condo</option>
            <option value="Townhome">Townhome</option>
            <option value="Manufactured">Manufactured</option>
            <option value="Cabins">Cabins</option>
          </select>

          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default FixAndFlipQuoteModal;