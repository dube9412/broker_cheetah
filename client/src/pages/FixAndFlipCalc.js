import React, { useState } from 'react';

function FixAndFlipCalculator() {
  const [inputs, setInputs] = useState({
    timeToSold: 0, // B3
    purchasePrice: 0, // B4
    targetSalePrice: 0, // B6
    loanToCost: 90, // E3
    rehabPercentage: 1, // E4
    arvLimit: 65, // E5
    totalLoanToCost: 90, // E6
    interestRate: 13, // E7
    origination: 3, // E8
    transferTax: 0.75, // E9
    utilitiesPerMonth: 0, // E11
    maintenanceCosts: 0, // E12
    miscCosts: 0, // E13
    realtorFee: 5, // E23
    capitalGains: 20, // E24
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({...inputs, [name]: parseFloat(value) || 0 });
  };

  // Calculations (more detailed and accurate)
  const loanAmount = inputs.purchasePrice * (inputs.loanToCost / 100); // B8
  const cashToClose = inputs.purchasePrice * ((100 - inputs.loanToCost) / 100); // B10
  const originationFee = loanAmount * (inputs.origination / 100); // B11
  const transferTaxAmount = loanAmount * (inputs.transferTax / 100); // B12
  const closingCosts = cashToClose + originationFee + transferTaxAmount; // B14

  const rehabCosts = inputs.purchasePrice * (inputs.rehabPercentage / 100); // B5 (calculated)
  const totalRehabCost = rehabCosts; // Placeholder for additional rehab costs (I27 + K27)

  const financedRehab = rehabCosts * (inputs.loanToCost / 100); // Part of B16
  const totalLoan = loanAmount + financedRehab; // B16 (updated)
  const holdingCosts = (
    (loanAmount * (inputs.interestRate / 100) / 12 * inputs.timeToSold) +
    (financedRehab * (inputs.interestRate / 100) / 12 * inputs.timeToSold)
  ) / 2; // B19 (more accurate)
  const otherCosts = inputs.utilitiesPerMonth * inputs.timeToSold + inputs.maintenanceCosts + inputs.miscCosts; // B20 (combined)

  const totalInvestment = totalLoan + closingCosts + holdingCosts + otherCosts; // B23 (updated)
  const profit = inputs.targetSalePrice - totalInvestment - (inputs.targetSalePrice * (inputs.realtorFee / 100)) - (profit * (inputs.capitalGains / 100)); // B25 (with fees and gains)
  const profitMargin = (profit / inputs.targetSalePrice) * 100; // B26
  const totalLTC = (totalInvestment / (inputs.purchasePrice + totalRehabCost)) * 100; // C16 (updated)
  const arv = (totalInvestment / inputs.targetSalePrice) * 100; // C17

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-xl font-bold mb-4">Fix and Flip Deal Calculator</h1>
      <div className="grid grid-cols-2 gap-4">
        {/* Input fields (same as before) */}
        <div>
          <label>Time to Sold (Months)</label>
          <input type="number" name="timeToSold" value={inputs.timeToSold} onChange={handleChange} className="border p-2 w-full" />
        </div>
        {/*... other input fields... */}
      </div>

      <h2 className="text-lg font-bold mt-5">Results</h2>
      <p>Loan Amount: ${loanAmount.toLocaleString()}</p>
      {/*... other output values... */}
      <p>Rehab Costs: ${rehabCosts.toLocaleString()}</p>
      <p>Total Rehab Cost: ${totalRehabCost.toLocaleString()}</p> {/* Placeholder */}
      <p>Total Loan: ${totalLoan.toLocaleString()}</p>
      <p>Holding Costs: ${holdingCosts.toLocaleString()}</p>
      <p>Other Costs: ${otherCosts.toLocaleString()}</p>
      <p>Profit: ${profit.toLocaleString()}</p>
      <p>Profit Margin: {profitMargin.toFixed(2)}%</p>
      <p>Total LTC: {totalLTC.toFixed(2)}% (Must be &le; {inputs.totalLoanToCost}%)</p>
      <p>ARV: {arv.toFixed(2)}% (Must be &le; {inputs.arvLimit}%)</p>
    </div>
  );
}

export default FixAndFlipCalculator;

