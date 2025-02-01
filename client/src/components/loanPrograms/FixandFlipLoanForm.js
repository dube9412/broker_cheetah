import React, { useState, useEffect } from "react";

function FixAndFlipLoanForm({ lenderId, onLoanUpdated }) {
  const [loanPrograms, setLoanPrograms] = useState([]);
  const [minFICO, setMinFICO] = useState(0);
  const [minExperience, setMinExperience] = useState(0);
  const [maxLTV, setMaxLTV] = useState(0);
  const [maxLTP, setMaxLTP] = useState(0);
  const [totalLTC, setTotalLTC] = useState(0);
  const [maxARV, setMaxARV] = useState(0);
  const [maxLoanAmount, setMaxLoanAmount] = useState(0);
  const [tiers, setTiers] = useState(null);
  const [editingProgramId, setEditingProgramId] = useState(null);

  useEffect(() => {
    fetch(`/api/lenders/${lenderId}/fixandflip`)
      .then((res) => res.json())
      .then((data) => setLoanPrograms(data))
      .catch((err) => console.error("Error fetching loan programs:", err));
  }, [lenderId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const loanData = {
      lenderId,
      minFICO,
      minExperience,
      maxLTV,
      maxLTP,
      totalLTC,
      maxARV,
      maxLoanAmount,
      tiers: tiers ? parseInt(tiers, 10) : null, 
    };

    const method = editingProgramId ? "PUT" : "POST";
    const endpoint = editingProgramId
      ? `/api/lenders/${lenderId}/fixandflip/${editingProgramId}`
      : `/api/lenders/${lenderId}/fixandflip`;

    fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loanData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert(
            editingProgramId
              ? "Fix & Flip loan program updated successfully!"
              : "Fix & Flip loan program added successfully!"
          );
          onLoanUpdated();
          setEditingProgramId(null);
        } else {
          alert("Error saving loan program.");
        }
      })
      .catch((err) => {
        console.error("Error saving loan program:", err);
        alert("Error saving loan program.");
      });
  };

  const handleEdit = (program) => {
    setEditingProgramId(program._id);
    setMinFICO(program.minFICO);
    setMinExperience(program.minExperience);
    setMaxLTV(program.maxLTV);
    setMaxLTP(program.maxLTP);
    setTotalLTC(program.totalLTC);
    setMaxARV(program.maxARV);
    setMaxLoanAmount(program.maxLoanAmount);
    setTiers(program.tiers || null);
  };

  const handleDelete = (programId) => {
    if (!window.confirm("Are you sure you want to delete this loan program?")) {
      return;
    }

    fetch(`/api/lenders/${lenderId}/fixandflip/${programId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Loan program deleted successfully!");
          onLoanUpdated();
        } else {
          alert("Error deleting loan program.");
        }
      })
      .catch((err) => {
        console.error("Error deleting loan program:", err);
        alert("Error deleting loan program.");
      });
  };

  return (
    <div>
      <h3>{editingProgramId ? "Edit" : "Add"} Fix & Flip Loan Program</h3>
      <form onSubmit={handleSubmit}>
        <label>How many tiers? (Optional): <input type="number" value={tiers || ""} onChange={(e) => setTiers(e.target.value)} /></label>
        <br />
        <label>Min FICO: <input type="number" value={minFICO} onChange={(e) => setMinFICO(e.target.value)} /></label>
        <br />
        <label>Min Experience: <input type="number" value={minExperience} onChange={(e) => setMinExperience(e.target.value)} /></label>
        <br />
        <label>Max LTV (%): <input type="number" value={maxLTV} onChange={(e) => setMaxLTV(e.target.value)} /></label>
        <br />
        <label>Max LTP (%): <input type="number" value={maxLTP} onChange={(e) => setMaxLTP(e.target.value)} /></label>
        <br />
        <label>Total LTC (%): <input type="number" value={totalLTC} onChange={(e) => setTotalLTC(e.target.value)} /></label>
        <br />
        <label>Max ARV (%): <input type="number" value={maxARV} onChange={(e) => setMaxARV(e.target.value)} /></label>
        <br />
        <label>Max Loan Amount ($): <input type="number" value={maxLoanAmount} onChange={(e) => setMaxLoanAmount(e.target.value)} /></label>
        <br />
        <button type="submit">{editingProgramId ? "Update" : "Save"} Loan Program</button>
      </form>
      <h3>Existing Loan Programs</h3>
      <ul>
        {loanPrograms.map((program) => (
          <li key={program._id}>
            {program.tiers ? `Tier ${program.tiers}` : "No Tier"}: {program.minFICO} Min FICO, {program.maxLTV}% Max LTV
            <button onClick={() => handleEdit(program)}>Edit</button>
            <button onClick={() => handleDelete(program._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FixAndFlipLoanForm;