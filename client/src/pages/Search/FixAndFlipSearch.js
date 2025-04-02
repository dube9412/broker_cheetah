import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Glossary from "../../components/hardMoneyClass/Glossary";
import OneClickQuoteModal from "../../components/OneClickQuoteModal"; // Import the modal
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
  const [recourse, setRecourse] = useState({ recourse: false, nonRecourse: false });
  const [interestType, setInterestType] = useState("");
  const [crossCollateralAllowed, setCrossCollateralAllowed] = useState("");
  const [termLengthMonths, setTermLengthMonths] = useState(""); // Update to string for radio buttons

  const [results, setResults] = useState([]);
  const [warning, setWarning] = useState("");
  const [selectedLenders, setSelectedLenders] = useState([]); // Track selected lenders
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

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
      }).toString();

      const url = `${BASE_URL}/api/fix-and-flip/search?${queryString}`;
      console.log("🔍 Fetching:", url);

      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`❌ Status ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      // Safeguard: Ensure programs exist before filtering
      const filteredResults = data.map((lender) => {
        if (!lender.programs || !Array.isArray(lender.programs)) {
          console.warn(`⚠️ Lender ${lender.name} has no programs.`);
          return null;
        }

        const fixAndFlipPrograms = lender.programs.filter(
          (program) => program.type === "Fix and Flip"
        );

        if (fixAndFlipPrograms.length === 0) {
          console.warn(`⚠️ Lender ${lender.name} has no Fix and Flip programs.`);
          return null;
        }

        // Process each program to find matching tiers
        const asIs = asisValue || purchasePrice; // Assume as-is value equals purchase price if not provided
        const totalCost = Number(purchasePrice) + Number(rehabNeeded);

        const validPrograms = fixAndFlipPrograms.map((program) => {
          const matchingTier = program.tiers.find((tier) => {
            if (tier.minFICO && Number(fico) < tier.minFICO) return false;
            if (tier.minExperience && Number(experience) < tier.minExperience) return false;

            // LTC and ARV calculations
            const ltcLimit = tier.maxLTC ? (asIs * tier.maxLTC) / 100 : Infinity;
            const totalLtcLimit = tier.totalLTC ? (arv * tier.totalLTC) / 100 : Infinity;
            const arvLimit = tier.maxARV ? (arv * tier.maxARV) / 100 : Infinity;

            if (purchasePrice > ltcLimit) return false;
            if (totalCost > totalLtcLimit) return false;
            if (totalCost > arvLimit) return false;

            return true;
          });

          return matchingTier ? { ...program, matchingTier } : null;
        });

        // Filter out programs without matching tiers
        const programsWithMatchingTiers = validPrograms.filter(Boolean);

        if (programsWithMatchingTiers.length === 0) {
          console.warn(`⚠️ No matching tiers found for lender: ${lender.name}`);
          return null;
        }

        return {
          ...lender,
          validPrograms: programsWithMatchingTiers,
        };
      });

      // Filter out lenders without valid programs
      const validLenders = filteredResults.filter(Boolean);

      setResults(validLenders);
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
    setRecourse({ recourse: false, nonRecourse: false });
    setInterestType({ dutch: false, nonDutch: false });
    setCrossCollateralAllowed("");
    setTermLengthMonths(""); // Clear term length
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
    setIsModalOpen(true);
  };

  return (
    <div className="search-container">
      <button className="back-button" onClick={() => navigate("/lender-search")}>🔙 Back to Loan Types</button>
      <h1 className="search-title">Fix & Flip Search</h1>
      <p className="search-subtitle">Enter one or more filters to find matching loan programs.</p>

      <div className="search-row">
        <fieldset className="search-fieldset">
          <legend className="search-legend">🔹 Deal Details</legend>
          <label className="search-label">State:</label>
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
          <label className="search-label">FICO Score:</label>
          <input className="search-input" value={fico} onChange={(e) => setFico(e.target.value)} />
          <label className="search-label">Experience (Flips in past 36 mo):</label>
          <input className="search-input" value={experience} onChange={(e) => setExperience(e.target.value)} />
          <label className="search-label">Liquidity (cash, stocks, etc.):</label>
          <input className="search-input" value={liquidity} onChange={(e) => setLiquidity(e.target.value)} />
        </fieldset>
      </div>

      <fieldset className="search-fieldset">
        <legend className="search-legend">🔹 Loan Options</legend>
        <label className="search-label">Recourse:</label>
        <label><input type="checkbox" checked={recourse.recourse} onChange={() => setRecourse((prev) => ({ ...prev, recourse: !prev.recourse }))} /> Recourse</label>
        <label><input type="checkbox" checked={recourse.nonRecourse} onChange={() => setRecourse((prev) => ({ ...prev, nonRecourse: !prev.nonRecourse }))} /> Non-Recourse</label>
        <label className="search-label">Interest Type:</label>
        <label><input type="checkbox" checked={interestType.dutch} onChange={() => setInterestType((prev) => ({ ...prev, dutch: !prev.dutch }))} /> Dutch</label>
        <label><input type="checkbox" checked={interestType.nonDutch} onChange={() => setInterestType((prev) => ({ ...prev, nonDutch: !prev.nonDutch }))} /> Non-Dutch</label>
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
                        type="radio"
                        name="termLengthMonths"
                        value={length}
                        checked={termLengthMonths === String(length)}
                        onChange={(e) => setTermLengthMonths(e.target.value)}
                    />
                    {length} months
                </label>
            ))}
        </div>
      </fieldset>

      <div className="search-buttons-container">
        <button className="search-button" onClick={handleSearch}>🔍 Search</button>
        <button class="search-button" onClick={handleClear}>🔄 New Search</button>
      </div>

      {warning && <p className="search-warning">{warning}</p>}

      <div class="search-results">
        {results.map((res, i) => (
          <div key={i} className="search-result-item">
            <strong>✅ {res.name}</strong>
            <p>{res.highlightNote}</p> {/* Display dynamic note */}
            <span>{res.phone || ""}</span>
            <p>Expect <strong>{res.maxLTC || "N/A"}%</strong> of purchase, <strong>{res.rehabPercent || "N/A"}%</strong> rehab, <strong>{res.termLengthMonths || "N/A"}-month</strong> term.</p>
            <p>Interest: <strong>{res.interestType || "Not Provided"}</strong> | Recourse: <strong>{res.recourse || "Not Provided"}</strong></p>
            <p>Rehab Classification: <strong>{res.rehabType || "Not Specified"}</strong></p>
            <p>📌 <em>Why this lender works:</em> {res.highlightNote || "Available Fix & Flip program"}</p>
            <label>
              <input
                type="checkbox"
                value={res.lenderId}
                onChange={() => handleLenderSelect(res.lenderId)}
              />{" "}
              Request Quote
            </label>
          </div>
        ))}
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
        <OneClickQuoteModal
          selectedLenders={selectedLenders}
          onClose={() => setIsModalOpen(false)}
          searchData={{
            state,
            fico,
            purchasePrice,
            rehabNeeded,
            arv,
            asisValue,
            experience,
            liquidity, // Pass liquidity to the modal
          }}
        />
      )}

      <Glossary />
    </div>
  );
}

export default FixAndFlipSearch;