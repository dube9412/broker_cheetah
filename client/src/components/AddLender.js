import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatesCheckboxList from "./StatesCheckboxList";

const BACKGROUND_LIMITATIONS_OPTIONS = ["Financial Crimes", "Felony Convictions"];

function AddLender() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [states, setStates] = useState([]);
  const [brokersLicenseOnlyStates, setBrokersLicenseOnlyStates] = useState([]);
  const [brokerFriendly, setBrokerFriendly] = useState(false);
  const [portalAddress, setPortalAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [whiteLabelPaperwork, setWhiteLabelPaperwork] = useState(false);
  const [whiteLabelFundingTPO, setWhiteLabelFundingTPO] = useState(false);
  const [proofOfFundsLetters, setProofOfFundsLetters] = useState(false);
  const [proofOfFundsNotes, setProofOfFundsNotes] = useState("");
  const [assumable, setAssumable] = useState(false);
  const [bkFcSsDil, setBkFcSsDil] = useState("");
  const [backgroundLimitations, setBackgroundLimitations] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const lenderData = {
      name,
      states,
      brokersLicenseOnlyStates,
      brokerFriendly,
      portalAddress,
      contactName,
      phone,
      email,
      website,
      whiteLabelPaperwork,
      whiteLabelFundingTPO,
      proofOfFundsLetters,
      proofOfFundsNotes,
      assumable,
      bkFcSsDil: parseInt(bkFcSsDil) || null,
      backgroundLimitations,
    };

    fetch("/api/lenders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lenderData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Lender added successfully!");
          navigate("/dashboard");
        } else {
          alert("Error adding lender.");
        }
      })
      .catch((err) => {
        console.error("Error adding lender:", err);
        alert("Error adding lender.");
      });
  };

  return (
    <div>
      <h2>Add Lender</h2>
      <form onSubmit={handleSubmit}>
        <label>Lender Name: <input value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <br />

        <label>States:</label>
        <StatesCheckboxList selectedStates={states} onChange={setStates} />
        <br />

        <label>Brokers License Only States:</label>
        <StatesCheckboxList selectedStates={brokersLicenseOnlyStates} onChange={setBrokersLicenseOnlyStates} />
        <br />

        <label>Broker Friendly:</label>
        <input type="checkbox" checked={brokerFriendly} onChange={(e) => setBrokerFriendly(e.target.checked)} />
        <br />

        <label>Portal Website:</label>
        <input value={portalAddress} onChange={(e) => setPortalAddress(e.target.value)} />
        <br />

        <label>Contact Name:</label>
        <input value={contactName} onChange={(e) => setContactName(e.target.value)} />
        <br />

        <label>Phone:</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        <br />

        <label>Email:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />

        <label>Website:</label>
        <input value={website} onChange={(e) => setWebsite(e.target.value)} />
        <br />

        <label>White Label Paperwork:</label>
        <input type="checkbox" checked={whiteLabelPaperwork} onChange={(e) => setWhiteLabelPaperwork(e.target.checked)} />
        <br />

        <label>White Label Funding (TPO):</label>
        <input type="checkbox" checked={whiteLabelFundingTPO} onChange={(e) => setWhiteLabelFundingTPO(e.target.checked)} />
        <br />

        <label>Proof of Funds Letters:</label>
        <input type="checkbox" checked={proofOfFundsLetters} onChange={(e) => setProofOfFundsLetters(e.target.checked)} />
        <br />

        <label>Proof of Funds Notes:</label>
        <input value={proofOfFundsNotes} onChange={(e) => setProofOfFundsNotes(e.target.value)} />
        <br />

        <label>Assumable:</label>
        <input type="checkbox" checked={assumable} onChange={(e) => setAssumable(e.target.checked)} />
        <br />

        <label>Bankruptcy/Foreclosure/SS/DIL (years):</label>
        <input type="number" value={bkFcSsDil} onChange={(e) => setBkFcSsDil(e.target.value)} />
        <br />

        <label>Background Limitations:</label>
        <div>
          {BACKGROUND_LIMITATIONS_OPTIONS.map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                value={option}
                checked={backgroundLimitations.includes(option)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...backgroundLimitations, option]
                    : backgroundLimitations.filter((t) => t !== option);
                  setBackgroundLimitations(updated);
                }}
              />
              {option}
            </label>
          ))}
        </div>
        <br />

        <button type="submit">Add Lender</button>
      </form>
    </div>
  );
}

export default AddLender;