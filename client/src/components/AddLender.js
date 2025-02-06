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
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <h2 style={{ textAlign: "center" }}>Add Lender</h2>

        <form onSubmit={handleSubmit}>
            <label>Lender Name:</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%", marginBottom: "10px" }} />

            <label>States:</label>
            <StatesCheckboxList selectedStates={states} onChange={setStates} />

            <label>Brokers License Only States:</label>
            <StatesCheckboxList selectedStates={brokersLicenseOnlyStates} onChange={setBrokersLicenseOnlyStates} />

            <label>Broker Friendly:</label>
            <input type="checkbox" checked={brokerFriendly} onChange={(e) => setBrokerFriendly(e.target.checked)} style={{ marginLeft: "10px" }} />
            <br/><br/>

            <label>Portal Website:</label>
            <input value={portalAddress} onChange={(e) => setPortalAddress(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

            <label>Contact Name:</label>
            <input value={contactName} onChange={(e) => setContactName(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

            <label>Phone:</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

            <label>Email:</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

            <label>Website:</label>
            <input value={website} onChange={(e) => setWebsite(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

            <label>White Label Paperwork:</label>
            <input type="checkbox" checked={whiteLabelPaperwork} onChange={(e) => setWhiteLabelPaperwork(e.target.checked)} style={{ marginLeft: "10px" }} />
            <br/><br/>
            <label>White Label Funding (TPO):</label>
            <input type="checkbox" checked={whiteLabelFundingTPO} onChange={(e) => setWhiteLabelFundingTPO(e.target.checked)} style={{ marginLeft: "10px" }} />
            <br/><br/>
            <label>Proof of Funds Letters:</label>
            <input type="checkbox" checked={proofOfFundsLetters} onChange={(e) => setProofOfFundsLetters(e.target.checked)} style={{ marginLeft: "10px" }} />
            <br/><br/>
            <label>Proof of Funds Notes:</label>
            <input value={proofOfFundsNotes} onChange={(e) => setProofOfFundsNotes(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

            <label>Assumable:</label>
            <input type="checkbox" checked={assumable} onChange={(e) => setAssumable(e.target.checked)} style={{ marginLeft: "10px" }} />
            <br/><br/>
            <label>Bankruptcy/Foreclosure/SS/DIL (years):</label>
            <input type="number" value={bkFcSsDil} onChange={(e) => setBkFcSsDil(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

            <label>Background Limitations:</label>
            <div>
                {BACKGROUND_LIMITATIONS_OPTIONS.map((option) => (
                    <label key={option} style={{ display: "block", marginBottom: "5px" }}>
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
                            style={{ marginRight: "10px" }}
                        />
                        {option}
                    </label>
                ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button type="submit" style={{ marginRight: "10px", padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", border: "none", cursor: "pointer" }}>
                    Add Lender
                </button>
                <button onClick={() => navigate("/dashboard")} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", cursor: "pointer" }}>
                    Cancel
                </button>
            </div>
        </form>
    </div>
);

}

export default AddLender;