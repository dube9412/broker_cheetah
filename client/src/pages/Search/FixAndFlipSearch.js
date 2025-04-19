import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Glossary from "../../components/hardMoneyClass/Glossary";
import FixAndFlipQuoteModal from "../../components/FixAndFlipQuoteModal"; // Import the modal
import "../../styles/SearchPages.css";

const BASE_URL = "https://broker-cheetah-backend.onrender.com";

const US_STATES = [
  "AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA",
  "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME",
  "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM",
  "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX",
  "UT", "VA", "VT", "WA", "WI", "WV", "WY"
];

const TERM_LENGTH_OPTIONS = [12, 13, 18, 19, 24]; // Define term length options

function FixAndFlipSearch() {
  const navigate = useNavigate();
  const [state, setState] = useState("");
  const [fico, setFico] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [rehabNeeded, setRehabNeeded] = useState("");
  const [arv, setArv] = useState("");
  const [asisValue, setAsisValue] = useState("");
  const [experience, setExperience] = useState("");
  const [liquidity, setLiquidity] = useState("");
  const [recourse, setRecourse] = useState("");
  const [interestType, setInterestType] = useState("");
  const [crossCollateralAllowed, setCrossCollateralAllowed] = useState("");
  const [termLengthMonths, setTermLengthMonths] = useState([]); // Initialize as an array
  const [drawType, setDrawType] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [setting, setSetting] = useState(""); // Renamed from 'rural' to 'setting'

  const [results, setResults] = useState([]);
  const [warning, setWarning] = useState("");
  const [selectedLenders, setSelectedLenders] = useState([]); // Track selected lenders
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [searchData, setSearchData] = useState({}); // Store search data

  const handleSearch = async () => {
    setWarning("");

    if (!state || !fico || !experience) {
      alert("Please fill in all required fields: State, FICO, and Experience.");
      return;
    }

    try {
      const queryString = new URLSearchParams({
        state,
        fico,
        purchasePrice,
        rehabNeeded,
        arv,
        asisValue,
        experience,
        liquidity,
        propertyType,
        sortBy,
        recourse,
        interestType,
        drawType,
        crossCollateralAllowed,
        termLengthMonths: termLengthMonths.join(","),
        setting, // Renamed from 'rural' to 'setting'
      }).toString();

      const url = `${BASE_URL}/api/fix-and-flip/search?${queryString}`;
      console.log("🔍 Fetching:", url);

      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`❌ Status ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      // Log the backend response for debugging
      console.log("🔍 Backend Response:", data);

      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error("❌ Unexpected API response format:", data);
        throw new Error("API response is not an array.");
      }

      // Directly use the backend response without additional filtering
      setResults(data);
    } catch (err) {
      console.error("❌ Error searching:", err.message);
      setResults([]);
    }
  };

  const handleClear = () => {
    setState("");
    setFico("");
    setPurchasePrice("");
    setRehabNeeded("");
    setArv("");
    setAsisValue("");
    setExperience("");
    setLiquidity("");
    setRecourse("");
    setInterestType("");
    setCrossCollateralAllowed("");
    setTermLengthMonths([]); // Clear term length
    setResults([]);
    setWarning("");
  };

  const handleLenderSelect = (lenderId) => {
    setSelectedLenders((prevSelected) =>
        prevSelected.includes(lenderId)
            ? prevSelected.filter((id) => id !== lenderId)
            : [...prevSelected, lenderId]
    );
  };

  const openQuoteModal = () => {
    if (selectedLenders.length === 0) {
        alert("Please select at least one lender.");
        return;
    }
    setSearchData({
      state,
      fico,
      purchasePrice,
      rehabNeeded,
      arv,
      asisValue,
      experience,
      liquidity,
    });
    setIsModalOpen(true);
  };

  const closeQuoteModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="search-container">
      <>
        <button className="back-button" onClick={() => navigate("/lender-search")}>
          🔙 Back to Loan Types
        </button>
        <h1 className="search-title">Fix & Flip Search</h1>
        <p className="search-subtitle">
          Enter one or more filters to find matching loan programs.<br />
          * = required
        </p>
      </>

      <div className="search-row">
        <fieldset className="search-fieldset">
          <legend className="search-legend">🔹 Deal Details</legend>
          <label className="search-label">*State:</label>
          <select className="search-select" value={state} onChange={(e) => setState(e.target.value)}>
            <option value="">-- Select a state --</option>
            {US_STATES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
          <label className="search-label">Purchase Price:</label>
          <input className="search-input" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
          <label className="search-label">Rehab Needed ($):</label>
          <input className="search-input" value={rehabNeeded} onChange={(e) => setRehabNeeded(e.target.value)} />
          <label className="search-label">ARV:</label>
          <input className="search-input" value={arv} onChange={(e) => setArv(e.target.value)} />
          <label className="search-label">As-Is Value:</label>
          <input className="search-input" value={asisValue} onChange={(e) => setAsisValue(e.target.value)} />
        </fieldset>

        <fieldset className="search-fieldset">
          <legend className="search-legend">🔹 Borrower Profile</legend>
          <label className="search-label">*FICO Score:</label>
          <input className="search-input" value={fico} onChange={(e) => setFico(e.target.value)} />
          <label className="search-label">*Experience (Flips in past 36 mo):</label>
          <input className="search-input" value={experience} onChange={(e) => setExperience(e.target.value)} />
          <label className="search-label">Liquidity (cash, stocks, etc.):</label>
          <input className="search-input" value={liquidity} onChange={(e) => setLiquidity(e.target.value)} />
        </fieldset>
      </div>

      <fieldset className="search-fieldset">
        <legend className="search-legend">🔹 Loan Options</legend>

        <label className="search-label">Recourse:</label>
        <label>
          <input
            type="radio"
            name="recourse"
            value="recourse"
            checked={recourse === "recourse"}
            onChange={() => setRecourse("recourse")}
          />
          Recourse
        </label>
        <label>
          <input
            type="radio"
            name="recourse"
            value="nonRecourse"
            checked={recourse === "nonRecourse"}
            onChange={() => setRecourse("nonRecourse")}
          />
          Non-Recourse
        </label>

        <label className="search-label">Interest Type:</label>
        <label>
          <input
            type="radio"
            name="interestType"
            value="dutch"
            checked={interestType === "dutch"}
            onChange={() => setInterestType("dutch")}
          />
          Dutch
        </label>
        <label>
          <input
            type="radio"
            name="interestType"
            value="nonDutch"
            checked={interestType === "nonDutch"}
            onChange={() => setInterestType("nonDutch")}
          />
          Non-Dutch
        </label>

        <label className="search-label">Draw Type:</label>
        <label>
          <input
            type="radio"
            name="drawType"
            value="self"
            checked={drawType === "self"}
            onChange={() => setDrawType("self")}
          />
          Self-Draw
        </label>
        <label>
          <input
            type="radio"
            name="drawType"
            value="thirdParty"
            checked={drawType === "thirdParty"}
            onChange={() => setDrawType("thirdParty")}
          />
          Third-Party Draw
        </label>

        <label className="search-label">Cross Collateral Allowed:</label>
        <select className="search-select" value={crossCollateralAllowed} onChange={(e) => setCrossCollateralAllowed(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <label>Term Length (Months):</label>
        <div>
            {TERM_LENGTH_OPTIONS.map((length) => (
                <label key={length} style={{ marginRight: "10px" }}>
                    <input
                        type="checkbox"
                        value={length}
                        checked={Array.isArray(termLengthMonths) && termLengthMonths.includes(length)} // Ensure safe access
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...termLengthMonths, length]
                            : termLengthMonths.filter((l) => l !== length);
                          setTermLengthMonths(updated);
                        }}
                    />
                    {length} months
                </label>
            ))}
        </div>
      </fieldset>

      <fieldset className="search-fieldset">
        <legend className="search-legend">🔹 Additional Filters</legend>
        <label className="search-label">Property Type:</label>
        <select className="search-select" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
          <option value="">-- Select Property Type --</option>
          <option value="Single Family 1-4">Single Family 1-4</option>
          <option value="Condo">Condo</option>
          <option value="Townhome">Townhome</option>
          <option value="Manufactured">Manufactured</option>
          <option value="Cabins">Cabins</option>
        </select>

        <label className="search-label">Sort By:</label>
        <select className="search-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">-- Select Sorting Option --</option>
          <option value="ltc">LTC (Loan-to-Cost)</option>
          <option value="loanAmount">Loan Amount</option>
        </select>

        <label className="search-label">Setting:</label>
        <label>
          <input
            type="radio"
            name="setting"
            value="Rural"
            checked={setting === "Rural"}
            onChange={() => setSetting("Rural")}
          />
          Rural
        </label>
        <label>
          <input
            type="radio"
            name="setting"
            value="Non-Rural"
            checked={setting === "Non-Rural"}
            onChange={() => setSetting("Non-Rural")}
          />
          Non-Rural
        </label>
        <label>
          <input
            type="radio"
            name="setting"
            value=""
            checked={setting === ""}
            onChange={() => setSetting("")}
          />
          Any
        </label>
      </fieldset>

      <div className="search-buttons-container">
        <button className="search-button" onClick={handleSearch}>🔍 Search</button>
        <button class="search-button" onClick={handleClear}>🔄 New Search</button>
      </div>

      {warning && <p className="search-warning">{warning}</p>}

      <div className="sort-by-container">
        <label htmlFor="sortBy">Sort By:</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="ltc">Loan-to-Cost (LTC)</option>
          <option value="loanAmount">Loan Amount</option>
        </select>
      </div>

      <div className="search-results">
        {results.length > 0 ? (
          <div>
            {results.map((res, i) => (
              <div key={i} className="search-result-item">
                {/* Line 1: Lender Name, Phone, Email */}
                <div>
                  <strong>🏦 {res.name}</strong> | 📞 {res.phone} | ✉️ {res.email}
                </div>

                {/* Line 2: Loan Expectations (Percentages) */}
                <div>
                  Expect <strong>{res.maxLTC || "N/A"}%</strong> of purchase and <strong>{res.rehabPercent || "N/A"}%</strong> of rehab.
                </div>

                {/* Line 3: Unconstrained Loan Amounts */}
                <div>
                  Potential Loan Amount: <strong>${res.calculations?.purchaseLoanAmount?.toLocaleString() || "N/A"}</strong> toward purchase, 
                  <strong>${res.calculations?.rehabLoanAmount?.toLocaleString() || "N/A"}</strong> toward rehab.
                </div>

                {/* Line 4: Constrained Total Loan Amount */}
                <div>
                  Total Loan Amount (Constrained): <strong>${res.calculations?.totalLoanAmount?.toLocaleString() || "N/A"}</strong> | 
                  TLTC Limit: <strong>${res.calculations?.tltcLimit?.toLocaleString() || "N/A"}</strong> | 
                  ARV Limit: <strong>${res.calculations?.arvLimit?.toLocaleString() || "N/A"}</strong>
                </div>

                {/* Line 5: Warnings */}
                <div style={{ color: (res.warnings || []).length > 0 ? "orange" : "inherit" }}>
                  {(res.warnings || []).length > 0
                    ? (res.warnings || []).map((warning, idx) => <div key={idx}>⚠️ {warning}</div>)
                    : "No warnings"}
                </div>

                {/* Line 6: Request Quote */}
                <div>
                  <label>
                    <input
                      type="checkbox"
                      value={res.lenderId}
                      onChange={() => handleLenderSelect(res.lenderId)}
                    />
                    {selectedLenders.includes(res.lenderId) ? " ✅ Quote Requested" : " Request Quote"}
                  </label>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No results found. Please adjust your search criteria.</p>
        )}
      </div>

      {selectedLenders.length > 0 && (
        <button
          className="search-button"
          onClick={openQuoteModal}
          style={{ marginTop: "1rem" }}
        >
          Request One-Click Quote
        </button>
      )}

      {isModalOpen && (
        <FixAndFlipQuoteModal
          selectedLenders={selectedLenders}
          onClose={closeQuoteModal}
          searchData={searchData}
        />
      )}

      <Glossary />
    </div>
  );
}

export default FixAndFlipSearch;