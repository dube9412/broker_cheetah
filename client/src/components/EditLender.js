import React, { useEffect, useState, useContext} from "react";
import { useParams, useNavigate } from "react-router-dom";
import StatesCheckboxList from "./StatesCheckboxList";
import { AuthContext } from "../context/AuthContext";

const BACKGROUND_LIMITATIONS_OPTIONS = ["Financial Crimes", "Felony Convictions"];

function EditLender() {
  const { id } = useParams();
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
  const { isAdmin, isSuperAdmin } = useContext(AuthContext);

  useEffect(() => {
    console.log("EditLender Mounted");
    console.log("Lender ID from URL:", id);

    if (!id) {
      console.error("EditLender: No ID provided in URL");
      alert("Invalid lender ID.");
      navigate(isAdmin || isSuperAdmin ? "/admin-dashboard" : "/dashboard");

      return;
    }

    fetch(`https://broker-cheetah-backend.onrender.com/api/lenders/${id}`)
      .then((res) => res.json())
      .then((lender) => {
        console.log("✅ Fetched lender:", lender);

        if (!lender || !lender._id) {
          console.error("Lender not found.");
          alert("Lender not found.");
          navigate(isAdmin || isSuperAdmin ? "/admin-dashboard" : "/dashboard");

          return;
        }

        setName(lender.name || "");
        setStates(lender.states || []);
        setBrokersLicenseOnlyStates(lender.brokersLicenseOnlyStates || []);
        setBrokerFriendly(lender.brokerFriendly || false);
        setPortalAddress(lender.portalAddress || "");
        setContactName(lender.contactName || "");
        setPhone(lender.phone || "");
        setEmail(lender.email || "");
        setWebsite(lender.website || "");
        setWhiteLabelPaperwork(lender.whiteLabelPaperwork || false);
        setWhiteLabelFundingTPO(lender.whiteLabelFundingTPO || false);
        setProofOfFundsLetters(lender.proofOfFundsLetters || false);
        setProofOfFundsNotes(lender.proofOfFundsNotes || "");
        setAssumable(lender.assumable || false);
        setBkFcSsDil(lender.bkFcSsDil || "");
        setBackgroundLimitations(lender.backgroundLimitations || []);
      })
      .catch((err) => {
        console.error("❌ Error fetching lender:", err);
        alert("Error fetching lender data.");
        navigate(isAdmin || isSuperAdmin ? "/admin-dashboard" : "/dashboard");

      });
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedLenderData = {
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

    fetch(`https://broker-cheetah-backend.onrender.com/api/lenders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedLenderData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Lender updated successfully!");
          navigate(isAdmin || isSuperAdmin ? "/admin-dashboard" : "/dashboard");

        } else {
          alert("Error updating lender.");
        }
      })
      .catch((error) => {
        console.error("Error updating lender:", error);
        alert("Error updating lender.");
      });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Edit Lender</h2>
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
            <label key={option} style={{ marginRight: "10px" }}>
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

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate(isAdmin || isSuperAdmin ? "/admin-dashboard" : "/dashboard")
            }
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditLender;

