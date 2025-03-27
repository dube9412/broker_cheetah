import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LenderAuthProvider } from "./context/LenderAuthContext";
import "./styles/HardMoneyClass.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <LenderAuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LenderAuthProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();