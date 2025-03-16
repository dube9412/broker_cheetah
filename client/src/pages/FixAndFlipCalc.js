import React, { useState, useEffect } from 'react';

const FixAndFlipCalculator = () => {
  const [inputs, setInputs] = useState({
    timeToSold: 6,
    purchasePrice: 100000,
    targetSalePrice: 150000,
    rehabQuick: 30000,
    useDetailedRehab: false,
    rehabDetailed: { interior: 0, exterior: 0, misc: 0 },
    loanToCost: 0.9,
    rehabPercentage: 1,
    arvLimit: 0.65,
    totalLoanToCost: 0.9,
    interestRate: 0.13,
    origination: 0.03,
    transferTax: 0.0075,
    utilitiesPerMonth: 200,
    maintenanceCosts: 0,
    miscCosts: 0,
    realtorFee: 0.05,
    capitalGains: 0.2,
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
      ? Object.values(inputs.rehabDetailed).reduce((a, b) => a + (parseFloat(b) || 0), 0)
      : inputs.rehabQuick;

    const B5 = rehabTotal;
    const B8 = inputs.purchasePrice * inputs.loanToCost;
    const B10 = inputs.purchasePrice * (1 - inputs.loanToCost);
    const B11 = B8 * inputs.origination;
    const B12 = B8 * inputs.transferTax;
    const B13 = inputs.purchasePrice * inputs.transferTax;
    const B14 = B10 + B11 + B12 + B13;
    const B16 = B8 + (B5 * inputs.rehabPercentage);
    const B19 = ((B8 + B16) / 2) * (inputs.interestRate / 12) * inputs.timeToSold;
    const B20 = (inputs.utilitiesPerMonth + inputs.maintenanceCosts + inputs.miscCosts) * inputs.timeToSold;
    const B21 = B19 + B20;
    const B23 = B16 + B14 + B21;
    const B24 = inputs.targetSalePrice;
    const B25 = B24 - B23;
    const C16 = B16 / (inputs.purchasePrice + B5);
    const C17 = B16 / inputs.targetSalePrice;
    const F23 = inputs.realtorFee * B24;
    const F24 = B25 * inputs.capitalGains;
    const F25 = F23 + F24;
    const F26 = B25 - F25;

    setOutputs({
      rehabTotal: B5,
      totalCosts: B23,
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label>Time to Sold (months)</label>
          <input className="border p-1 w-full" type="number" name="timeToSold" value={inputs.timeToSold} onChange={handleChange} />
        </div>
        <div>
          <label>Purchase Price ($)</label>
          <input className="border p-1 w-full" type="number" name="purchasePrice" value={inputs.purchasePrice} onChange={handleChange} />
        </div>
        <div>
          <label>Target Sale Price ($)</label>
          <input className="border p-1 w-full" type="number" name="targetSalePrice" value={inputs.targetSalePrice} onChange={handleChange} />
        </div>
        <div>
          <label>Rehab Quick ($)</label>
          <input className="border p-1 w-full" type="number" name="rehabQuick" value={inputs.rehabQuick} onChange={handleChange} />
        </div>

        {/* Loan parameters clearly labeled */}
        {['loanToCost','rehabPercentage','arvLimit','totalLoanToCost','interestRate','origination','transferTax','utilitiesPerMonth','maintenanceCosts','miscCosts','realtorFee','capitalGains'].map(key => (
          <div key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)} {['loanToCost','rehabPercentage','arvLimit','totalLoanToCost','interestRate','origination','transferTax','realtorFee','capitalGains'].includes(key)? '(%)':'($)'}</label>
            <input className="border p-1 w-full" type="number" name={key} value={inputs[key]} onChange={handleChange} />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label>
          <input type="checkbox" checked={inputs.useDetailedRehab} onChange={() => setInputs({ ...inputs, useDetailedRehab: !inputs.useDetailedRehab })} />
          Use Detailed Rehab (future)
        </label>
      </div>

      <div className="results mt-6 border-t pt-4">
        <h3 className="font-bold">Results:</h3>
        <p>Total Rehab: ${outputs.rehabTotal?.toFixed(2)}</p>
        <p>Total Costs: ${outputs.totalCosts?.toFixed(2)}</p>
        <p>Profit: ${outputs.profit?.toFixed(2)}</p>
        <p>Net Profit (after Fees/Taxes): ${outputs.netProfit?.toFixed(2)}</p>
        <p>Net Profit %: {(outputs.profitPercent * 100)?.toFixed(2)}%</p>
        
        {outputs.warnings?.TLTC && <p className="text-red-600 font-bold">Warning: Exceeds TLTC limit!</p>}
        {outputs.warnings?.ARV && <p className="text-red-600 font-bold">Warning: ARV limit exceeded!</p>}
      </div>
    </div>
  );
};

export default FixAndFlipCalculator;
