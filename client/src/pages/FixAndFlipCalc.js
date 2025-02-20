import React, { useState } from 'react';

function FixAndFlipCalculator() {
  const [inputs, setInputs] = useState({
    timeToSold: 0,
    purchasePrice: 0,
    targetSalePrice: 0,
    loanToCost: 90,
    rehabPercentage: 1,
    arvLimit: 65,
    totalLoanToCost: 90,
    interestRate: 13,
    origination: 3,
    transferTax: 0.75,
    utilitiesPerMonth: 0,
    maintenanceCosts: 0,
    miscCosts: 0,
    realtorFee: 5,
    capitalGains: 20,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: parseFloat(value) || 0 });
  };

  // Core Calculations
  const loanAmount = inputs.purchasePrice * (inputs.loanToCost / 100);
  const cashToClose = inputs.purchasePrice * ((100 - inputs.loanToCost) / 100);
  const originationFee = loanAmount * (inputs.origination / 100);
  const transferTaxAmount = loanAmount * (inputs.transferTax / 100);
  const closingCosts = cashToClose + originationFee + transferTaxAmount;

  const rehabCosts = inputs.purchasePrice * (inputs.rehabPercentage / 100);
  const totalRehabCost = rehabCosts;

  const financedRehab = rehabCosts * (inputs.loanToCost / 100);
  const totalLoan = loanAmount + financedRehab;
  const holdingCosts = (
    (loanAmount * (inputs.interestRate / 100) / 12 * inputs.timeToSold) +
    (financedRehab * (inputs.interestRate / 100) / 12 * inputs.timeToSold)
  ) / 2;
  const otherCosts = inputs.utilitiesPerMonth * inputs.timeToSold + inputs.maintenanceCosts + inputs.miscCosts;

  const totalInvestment = totalLoan + closingCosts + holdingCosts + otherCosts;

  // **✅ Fixed Profit Calculation**
  const rawProfit = inputs.targetSalePrice - totalInvestment;
  const realtorsFeeAmount = inputs.targetSalePrice * (inputs.realtorFee / 100);
  const capitalGainsAmount = rawProfit * (inputs.capitalGains / 100);
  const profit = rawProfit - realtorsFeeAmount - capitalGainsAmount;

  const profitMargin = (profit / inputs.targetSalePrice) * 100;
  const totalLTC = (totalInvestment / (inputs.purchasePrice + totalRehabCost)) * 100;
  const arv = (totalInvestment / inputs.targetSalePrice) * 100;

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-xl font-bold mb-4">Fix and Flip Deal Calculator</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Time to Sold (Months)</label>
          <input type="number" name="timeToSold" value={inputs.timeToSold} onChange={handleChange} className="border p-2 w-full" />
        </div>
        {/* More input fields here */}
      </div>

      <h2 className="text-lg font-bold mt-5">Results</h2>
      <p>Loan Amount: ${loanAmount.toLocaleString()}</p>
      <p>Rehab Costs: ${rehabCosts.toLocaleString()}</p>
      <p>Total Rehab Cost: ${totalRehabCost.toLocaleString()}</p>
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


