import React, { useState, useEffect } from 'react';

const FixAndFlipCalculator = () => {
  const [inputs, setInputs] = useState({
    timeToSold: 6, // B3
    purchasePrice: 100000, // B4
    targetSalePrice: 150000, // B6
    rehabDetailed: {},
    rehabQuick: 30000, // Quick rehab mode
    useDetailedRehab: false, // Toggle between Quick and Detailed modes
    loanToCost: 0.9, // E3
    rehabPercentage: 1, // E4
    arvLimit: 0.65, // E5
    totalLoanToCost: 0.9, // E6
    interestRate: 0.13, // E7
    origination: 0.03, // E8
    transferTax: 0.0075, // E9
    utilitiesPerMonth: 200, // E11
    maintenanceCosts: 0, // E12
    miscCosts: 0, // E13
    realtorFee: 0.05, // E23
    capitalGains: 0.2, // E24
  });

  const [outputs, setOutputs] = useState({});

  useEffect(() => {
    calculateOutputs();
  }, [inputs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: parseFloat(value) || 0 });
  };

  const calculateOutputs = () => {
    const rehabTotal = inputs.useDetailedRehab
      ? Object.values(inputs.rehabDetailed).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
      : inputs.rehabQuick;
  
    const B5 = rehabTotal;
    const B8 = inputs.purchasePrice * inputs.loanToCost;
    const B10 = inputs.purchasePrice * (1 - inputs.loanToCost);
    const B11 = B8 * inputs.origination;
    const B12 = B8 * inputs.transferTax;
    const B13 = inputs.purchasePrice * inputs.transferTax;
    const B14 = B10 + B11 + B12 + B13;
    const B16 = B8 + (B5 * inputs.rehabPercentage);
    const B17 = inputs.targetSalePrice * inputs.arvLimit;
    const B19 = ((B8 * inputs.interestRate / 12 * inputs.timeToSold) + (B16 * inputs.interestRate / 12 * inputs.timeToSold)) / 2;
    const B20 = (inputs.utilitiesPerMonth + inputs.maintenanceCosts + inputs.miscCosts) * inputs.timeToSold;
    const B21 = B19 + B20;
    const B23 = B16 + B14 + B21;
    const B24 = inputs.targetSalePrice; // ✅ corrected (not rehabQuick!)
    const B25 = B24 - B23;
    const B26 = B25 / B24;
    const C16 = B16 / (inputs.purchasePrice + B5);
    const C17 = B16 / inputs.targetSalePrice;
    const F23 = inputs.realtorFee * B24;
    const F24 = B25 * inputs.capitalGains;
    const F25 = F23 + F24;
    const F26 = B25 - F25;
  
    setOutputs({
      rehabTotal,
      totalLoan: B16,
      totalInvestment: B23,
      profit: B25,
      netProfit: F26,
      TLTC: C16,
      ARV: C17,
      profitPercent: F26 / B24,
      warnings: {
        TLTC: C16 > inputs.totalLoanToCost,
        ARV: C17 > inputs.arvLimit,
      },
    });
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fix and Flip Calculator</h1>

      <div className="mb-4">
        <label>Time to Sold (months)</label>
        <input type="number" name="timeToSold" value={inputs.timeToSold} onChange={handleChange} />
      </div>

      <div className="mb-4">
        <label>Purchase Price ($)</label>
        <input type="number" name="purchasePrice" value={inputs.purchasePrice} onChange={handleChange} />
      </div>

      <div className="mb-4">
        <label>Target Sale Price ($)</label>
        <input type="number" name="targetSalePrice" value={inputs.targetSalePrice} onChange={handleChange} />
      </div>

      <div className="mb-4">
        <label>Rehab Quick ($)</label>
        <input type="number" name="rehabQuick" value={inputs.rehabQuick} onChange={handleChange} />
      </div>

      <div className="mb-4">
        <label>
          <input type="checkbox" checked={inputs.useDetailedRehab} onChange={() => setInputs({ ...inputs, useDetailedRehab: !inputs.useDetailedRehab })} />
          Use Detailed Rehab
        </label>
      </div>

      <div className="results">
        <h3>Results:</h3>
        <p>Total Rehab: ${outputs.rehabTotal?.toFixed(2)}</p>
        <p>Total Costs: ${outputs.B23?.toFixed(2)}</p>
        <p>Profit: ${outputs.netProfit?.toFixed(2)}</p>
        <p>Profit %: {(outputs.profitPercent * 100)?.toFixed(2)}%</p>
        {outputs.warnings?.TLTC && <p className="text-red-600">Warning: Exceeds TLTC limit!</p>}
        {outputs.warnings?.ARV && <p className="text-red-600">Warning: ARV limit exceeded!</p>}
      </div>
    </div>
  );
};

export default FixAndFlipCalculator;
