import React, { useEffect, useState } from "react";

const HardMoneyClass = () => {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    fetch("/hard-money-class.html") // Load the external HTML file
      .then((response) => response.text())
      .then((html) => setHtmlContent(html))
      .catch((error) => console.error("Error loading HTML:", error));

    // Inject script.js dynamically
    const script = document.createElement("script");
    script.src = "/script.js"; // Ensure script.js is inside `public/`
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup when component unmounts
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default HardMoneyClass;
