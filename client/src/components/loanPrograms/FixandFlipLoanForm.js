import React, { useState, useEffect } from "react";

function FixAndFlipLoanForm({ lenderId, onLoanUpdated }) {
  const [loanPrograms, setLoanPrograms] = useState([]);
  const [formData, setFormData] = useState({
    minFICO: 0,
    minExperience: 0,
    maxLTV: 0,
    maxLTP: 0,
    totalLTC: 0,
    maxARV: 0,
    maxLoanAmount: 0,
    tiers: [],
  });
  const [editingProgramId, setEditingProgramId] = useState(null);

  useEffect(() => {
    fetch(`/api/lenders/${lenderId}/loan-programs`)
      .then((res) => res.json())
      .then((data) => setLoanPrograms(data))
      .catch((err) => console.error("Error fetching loan programs:", err));
  }, [lenderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingProgramId ? "PUT" : "POST";
    const endpoint = editingProgramId
      ? `/api/lenders/${lenderId}/loan-programs/${editingProgramId}`
      : `/api/lenders/${lenderId}/loan-programs`;

    fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert(editingProgramId ? "Loan program updated successfully!" : "Loan program added successfully!");
          onLoanUpdated();
          setEditingProgramId(null);
          setFormData({
            minFICO: 0,
            minExperience: 0,
            maxLTV: 0,
            maxLTP: 0,
            totalLTC: 0,
            maxARV: 0,
            maxLoanAmount: 0,
            tiers: [],
          });
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
    setFormData(program);
  };

  const handleDelete = (programId) => {
    if (!window.confirm("Are you sure you want to delete this loan program?")) return;

    fetch(`/api/lenders/${lenderId}/loan-programs/${programId}`, {
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
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label>{key}: </label>
            <input
              type="number"
              name={key}
              value={formData[key]}
              onChange={handleChange}
            />
          </div>
        ))}
        <button type="submit">{editingProgramId ? "Update" : "Save"} Loan Program</button>
      </form>

      <h3>Existing Loan Programs</h3>
      <ul>
        {loanPrograms.map((program) => (
          <li key={program._id}>
            {program.name}
            <button onClick={() => handleEdit(program)}>Edit</button>
            <button onClick={() => handleDelete(program._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FixAndFlipLoanForm;
