import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // If user is logged in, send them straight to dashboard
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div>
      <h1>Welcome to Broker Cheetah</h1>
      <p>If you are not logged in, please Login or Sign Up.</p>
    </div>
  );
}

export default Home;
