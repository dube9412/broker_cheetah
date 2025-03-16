import React, { useState, useEffect } from 'react';

const FixAndFlipCalculator = () => {
  const [inputs, setInputs] = useState({
    timeToSold: 6,
    purchasePrice: 100000,
    targetSalePrice: 200000,
    rehabQuick: 30000,
    useDetailedRehab: false,
    rehabDetailed: { interior: 0, exterior: 0, misc: 0 },
    loanToCost: 90,
    rehabPercentage: 100,
    arvLimit: 65,
    totalLoanToCost: 90,
    interestRate: 13,
    origination: 3,
    transferTax: 0.75,
    utilitiesPerMonth: 200,
    maintenanceCosts: 250,
    miscCosts: 0,
    realtorFee: 5,
    capitalGains: 20,
  });

  const [rehabDetailed, setRehabDetailed] = useState({ interior: 0, exterior: 0, misc: 0 });
  const [outputs, setOutputs] = useState({});

  useEffect(() => {
    calculateOutputs();
  }, [inputs, rehabDetailed]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: parseFloat(value) || 0 });
  };

  const handleRehabChange = (e) => {
    const { name, value } = e.target;
    setRehabDetailed({ ...rehabDetailed, [name]: parseFloat(value) || 0 });
  };

  const calculateOutputs = () => {
    const rehabTotal = inputs.useDetailedRehab
      ? Object.values(rehabDetailed).reduce((a, b) => a + b, 0)
      : inputs.rehabQuick;

    const B8 = inputs.purchasePrice * (inputs.loanToCost / 100);
    const B10 = inputs.purchasePrice * (1 - inputs.loanToCost / 100);
    const B11 = B8 * (inputs.origination / 100);
    const B12 = B8 * (inputs.transferTax / 100);
    const B13 = inputs.purchasePrice * (inputs.transferTax / 100);
    const B14 = B10 + B11 + B12 + B13;
    const B16 = B8 + (rehabTotal * (inputs.rehabPercentage / 100));
    const B19 = ((B8 + B16) / 2) * (inputs.interestRate / 100 / 12) * inputs.timeToSold;
    const B20 = (inputs.utilitiesPerMonth + inputs.maintenanceCosts + inputs.miscCosts) * inputs.timeToSold;
    const B21 = B19 + B20;
    const B23 = B16 + B14 + B21;
    const B24 = inputs.targetSalePrice;
    const B25 = B24 - B23;
    const C16 = B16 / (inputs.purchasePrice + rehabTotal);
    const C17 = B16 / inputs.targetSalePrice;
    const F23 = inputs.realtorFee / 100 * B24;
    const F24 = (B24 - B23) * (inputs.capitalGains / 100);
    const F25 = F23 + F24;
    const F26 = (B24 - B23) - F25;

    setOutputs({
      rehabTotal,
      totalCosts: B23,
      profit: B25,
      netProfit: F26,
      TLTC: C16,
      ARV: C17,
      profitPercent: F26 / B24,
      warnings: {
        TLTC: C16 > inputs.totalLoanToCost / 100,
        ARV: C17 > inputs.arvLimit / 100,
      },
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Fix and Flip Calculator</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="inputs">
          <h3 className="font-semibold">Inputs</h3>
          <label>Time to Sold (months)</label>
          <input type="number" name="timeToSold" value={inputs.timeToSold} onChange={handleChange} className="border p-1 w-full" />
          <label>Purchase Price ($)</label>
          <input type="number" name="purchasePrice" value={inputs.purchasePrice} onChange={handleChange} className="border p-1 w-full" />
          <label>Target Sale Price ($)</label>
          <input type="number" name="targetSalePrice" value={inputs.targetSalePrice} onChange={handleChange} className="border p-1 w-full" />
          <label>Rehab Quick ($)</label>
          <input type="number" name="rehabQuick" value={inputs.rehabQuick} onChange={handleChange} className="border p-1 w-full" />

          <label className="mt-4">
            <input type="checkbox" checked={inputs.useDetailedRehab} onChange={() => setInputs({ ...inputs, useDetailedRehab: !inputs.useDetailedRehab })} /> Detailed Rehab
            {inputs.useDetailedRehab && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {Object.entries(rehabDetailed).map(([key, val]) => (
                  <input key={key} type="number" name={key} value={val} onChange={handleRehabChange} className="border p-1 w-full" />
                ))}
              </div>
            )}
          </label>

          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h2 className="font-bold">Results</h2>
            <p>Total Rehab: ${outputs.rehabTotal?.toFixed(2)}</p>
            <p>Total Costs: ${outputs.totalCosts?.toFixed(2)}</p>
            <p>Profit: ${outputs.netProfit?.toFixed(2)}</p>
            <p>Profit %: {(outputs.profitPercent * 100)?.toFixed(2)}%</p>
            {outputs.warnings?.TLTC && <p className="text-red-600">Warning: Exceeds TLTC limit!</p>}
            {outputs.warnings?.ARV && <p className="text-red-600">Warning: ARV limit exceeded!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixAndFlipCalculator;
