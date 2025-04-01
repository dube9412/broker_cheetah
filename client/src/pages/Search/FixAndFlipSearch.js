import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Glossary from "../../components/hardMoneyClass/Glossary";
import OneClickQuoteModal from "../../components/OneClickQuoteModal";
import "../../styles/SearchPages.css";

const BASE_URL = "https://broker-cheetah-backend.onrender.com";

const US_STATES = [
  "AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA",
  "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME",
  "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM",
  "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX",
  "UT", "VA", "VT", "WA", "WI", "WV", "WY"
];

const TERM_LENGTH_OPTIONS = [6, 12, 13, 18, 24, 36];

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
  const [interestType, setInterestType] = useState({ dutch: false, nonDutch: false });
  const [crossCollateralAllowed, setCrossCollateralAllowed] = useState("");
  const [termLengthMonths, setTermLengthMonths] = useState([]);

  const [results, setResults] = useState([]);
  const [selectedLenders, setSelectedLenders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async () => {
    if (!state || !fico || !experience) {
      alert("Please fill in required fields: State, FICO, and Experience.");
      return;
    }

    const queryString = new URLSearchParams({
      state, fico, purchasePrice, rehabNeeded, arv, asisValue, experience, liquidity,
      recourse: recourse.recourse, nonRecourse: recourse.nonRecourse,
      interestTypeDutch: interestType.dutch, interestTypeNonDutch: interestType.nonDutch,
      crossCollateralAllowed,
    }).toString();

    const response = await fetch(`${BASE_URL}/api/fix-and-flip/search?${queryString}`);
    const data = await response.json();

    const processedResults = data.map(lender => {
      const asIs = asisValue ? Number(asisValue) : Number(purchasePrice);
      const pp = Number(purchasePrice);
      const rehab = Number(rehabNeeded);
      const arvNum = Number(arv);
      const totalCost = pp + rehab;

      let bestTier = lender.tiers
        .filter(t => (!t.minFICO || fico >= t.minFICO) && (!t.minExperience || experience >= t.minExperience))
        .sort((a, b) => b.minExperience - a.minExperience)[0];

      if (!bestTier) return null;

      const loanBase = pp > asIs ? asIs : pp;
      const initialLTCAmount = loanBase * (bestTier.maxLTC / 100);
      const rehabAmount = rehab * (bestTier.rehabPercent / 100);
      let totalLoan = initialLTCAmount + rehabAmount;

      const tltcMaxLoan = bestTier.totalLTC ? totalCost * (bestTier.totalLTC / 100) : Infinity;
      const arvMaxLoan = bestTier.maxARV ? arvNum * (bestTier.maxARV / 100) : Infinity;

      let limitingFactor = "";
      if (totalLoan > tltcMaxLoan && tltcMaxLoan < arvMaxLoan) {
        totalLoan = tltcMaxLoan;
        limitingFactor = `Loan limited to TLTC (${bestTier.totalLTC}%)`;
      } else if (totalLoan > arvMaxLoan) {
        totalLoan = arvMaxLoan;
        limitingFactor = `Loan limited to ARV (${bestTier.maxARV}%)`;
      }

      return {
        name: lender.name,
        phone: lender.phone,
        highlightNote: lender.highlightNote || "",
        maxLTC: bestTier.maxLTC,
        rehabPercent: bestTier.rehabPercent,
        termLengthMonths: lender.termLengthMonths.join("/"),
        totalLoan: totalLoan.toFixed(2),
        limitingFactor,
        lenderId: lender._id,
      };
    }).filter(Boolean);

    setResults(processedResults);
  };

  const handleClear = () => {
    window.location.reload();
  };

  const handleLenderSelect = id => {
    setSelectedLenders(prev => prev.includes(id) ? prev.filter(lid => lid !== id) : [...prev, id]);
  };

  const openQuoteModal = () => selectedLenders.length ? setIsModalOpen(true) : alert("Select a lender.");

  return (
    <div className="search-container">
      <button onClick={() => navigate("/lender-search")}>🔙 Back</button>
      <h1>Fix & Flip Search</h1>

      <fieldset className="search-fieldset">
        <legend>🔹 Deal Details</legend>
        <select value={state} onChange={e => setState(e.target.value)}>
          <option value="">Select State</option>
          {US_STATES.map(st => <option key={st} value={st}>{st}</option>)}
        </select>
        <input placeholder="Purchase Price" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} />
        <input placeholder="Rehab Needed" value={rehabNeeded} onChange={e => setRehabNeeded(e.target.value)} />
        <input placeholder="ARV" value={arv} onChange={e => setArv(e.target.value)} />
        <input placeholder="As-Is Value" value={asisValue} onChange={e => setAsisValue(e.target.value)} />
      </fieldset>

      <fieldset className="search-fieldset">
        <legend>🔹 Borrower Profile</legend>
        <input placeholder="FICO" value={fico} onChange={e => setFico(e.target.value)} />
        <input placeholder="Experience" value={experience} onChange={e => setExperience(e.target.value)} />
        <input placeholder="Liquidity" value={liquidity} onChange={e => setLiquidity(e.target.value)} />
      </fieldset>

      {/* Loan Options Fieldset (checkboxes etc.) */}
      <fieldset className="search-fieldset">
        <legend>🔹 Loan Options</legend>
        {TERM_LENGTH_OPTIONS.map(len => (
          <label key={len}>
            <input type="checkbox" checked={termLengthMonths.includes(len)} onChange={e =>
              setTermLengthMonths(prev => e.target.checked ? [...prev, len] : prev.filter(t => t !== len))
            } />{len} months
          </label>
        ))}
      </fieldset>

      <button onClick={handleSearch}>🔍 Search</button>
      <button onClick={handleClear}>🔄 Clear</button>

      <div>
        {results.map(r => (
          <div key={r.lenderId}>
            <p>{r.name}: ${r.totalLoan} ({r.limitingFactor})</p>
            <input type="checkbox" onChange={() => handleLenderSelect(r.lenderId)} />
          </div>
        ))}
      </div>

      {isModalOpen && <OneClickQuoteModal selectedLenders={selectedLenders} />}
      <Glossary />
    </div>
  );
}

export default FixAndFlipSearch;
