import React, { useState, useEffect } from "react";

const LOAN_SCHEMAS = {
    "Fix and Flip": ["minFICO", "minExperience", "maxLTP", "totalLTC", "maxARV", "minLoanAmount", "maxLoanAmount"],
    };
    function FixAndFlipLoanForm({ program }) {
        return (
          <div>
            {LOAN_SCHEMAS["Fix and Flip"].map((field) => (
              <div key={field}>
                <label htmlFor={field}>{field}:</label>
                <input type="text" id={field} name={field} value={program.tiers?.[field] || ""} />
                <br />
              </div>
            ))}
          </div>
        );
      }
      
      export default FixAndFlipLoanForm;