import React, { useEffect, useState } from "react";

function Pipeline() {
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPipeline = async () => {
      try {
        const response = await fetch("/api/pipeline", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();

        if (response.ok) {
          setPipeline(data.pipeline);
        } else {
          console.error("❌ Error fetching pipeline:", data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching pipeline:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPipeline();
  }, []);

  if (loading) return <p>Loading pipeline...</p>;

  return (
    <div>
      <h1>📋 My Pipeline</h1>
      {pipeline.length === 0 ? (
        <p>No quotes sent yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Address</th>
              <th>FICO</th>
              <th>Experience</th>
              <th>Purchase Price</th>
              <th>As-Is Value</th>
              <th>Rehab Needed</th>
              <th>ARV</th>
              <th>Liquidity</th>
            </tr>
          </thead>
          <tbody>
            {pipeline.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.address}</td>
                <td>{entry.fico}</td>
                <td>{entry.experience}</td>
                <td>${entry.purchasePrice.toLocaleString()}</td>
                <td>${entry.asisValue.toLocaleString()}</td>
                <td>${entry.rehabNeeded.toLocaleString()}</td>
                <td>${entry.arv.toLocaleString()}</td>
                <td>${entry.liquidity.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {pipeline.map((entry) => (
        <PipelineDetails key={entry._id} entry={entry} />
      ))}
    </div>
  );
}

function PipelineDetails({ entry }) {
  const [milestones, setMilestones] = useState(entry.milestones || []);
  const [documents, setDocuments] = useState(entry.documents || []);
  const [contacts, setContacts] = useState(entry.contacts || []);

  const updateMilestones = async () => {
    // API call to update milestones
  };

  const updateDocuments = async () => {
    // API call to update documents
  };

  const updateContacts = async () => {
    // API call to update contacts
  };

  return (
    <div>
      <h2>Details for {entry.address}</h2>

      <h3>Milestones</h3>
      <ul>
        {milestones.map((milestone, index) => (
          <li key={index}>
            {milestone.name}: {milestone.status}
          </li>
        ))}
      </ul>

      <h3>Documents</h3>
      <ul>
        {documents.map((doc, index) => (
          <li key={index}>
            {doc.name}: {doc.status}
          </li>
        ))}
      </ul>

      <h3>Contacts</h3>
      <ul>
        {contacts.map((contact, index) => (
          <li key={index}>
            {contact.role}: {contact.name} ({contact.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pipeline;
