// client/src/components/StatesCheckboxList.js
//import React from "react";

// client/src/components/StatesCheckboxList.js
import React from "react";

// List of US states
const ALL_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID",
  "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
  "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK",
  "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
  "WI", "WY"
];

function StatesCheckboxList({ selectedStates, onChange }) {
  // Select all states
  const handleSelectAll = () => {
    onChange(ALL_STATES);
  };

  // Unselect all states
  const handleUnselectAll = () => {
    onChange([]);
  };

  // Toggle a single state
  const toggleState = (state) => {
    if (selectedStates.includes(state)) {
      onChange(selectedStates.filter(s => s !== state)); // Remove state
    } else {
      onChange([...selectedStates, state]); // Add state
    }
  };

  return (
    <div style={{ maxHeight: "200px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
      <button type="button" onClick={handleSelectAll}>Check All</button>
      <button type="button" onClick={handleUnselectAll} style={{ marginLeft: "10px" }}>Uncheck All</button>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", marginTop: "10px" }}>
        {ALL_STATES.map(state => (
          <label key={state} style={{ padding: "5px" }}>
            <input
              type="checkbox"
              checked={selectedStates.includes(state)}
              onChange={() => toggleState(state)}
            />
            {state}
          </label>
        ))}
      </div>
    </div>
  );
}

export default StatesCheckboxList;
