import React, { useEffect, useState } from "react";

function Pipeline() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        console.log("🔍 Fetching quotes for the pipeline page");
        const response = await fetch("/api/pipeline/quotes", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();

        if (response.ok) {
          console.log("✅ Quotes fetched:", data.quotes);
          setQuotes(data.quotes);
        } else {
          console.error("❌ Error fetching quotes:", data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching quotes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  if (loading) return <p>Loading pipeline...</p>;

  return (
    <div>
      <h1>📋 My Pipeline</h1>
      {quotes.length === 0 ? (
        <p>No quotes sent yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Property Address</th>
              <th>FICO Score</th>
              <th>Experience</th>
              <th>Purchase Price</th>
              <th>Rehab Needed</th>
              <th>ARV</th>
              <th>Liquidity</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr key={quote._id}>
                <td>{quote.propertyAddress}</td>
                <td>{quote.ficoScore}</td>
                <td>{quote.experience}</td>
                <td>${quote.purchasePrice.toLocaleString()}</td>
                <td>${quote.rehabNeeded.toLocaleString()}</td>
                <td>${quote.arv.toLocaleString()}</td>
                <td>${quote.liquidity.toLocaleString()}</td>
                <td>{new Date(quote.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Pipeline;
