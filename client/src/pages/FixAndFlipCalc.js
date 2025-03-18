import React, { useState, useEffect } from 'react';

const FixAndFlipCalculator = () => {
  const [inputs, setInputs] = useState({
    timeToSold: 6,
    purchasePrice: 100000,
    targetSalePrice: 200000,
    rehabQuick: 30000,
    useDetailedRehab: false,
    rehabDetailed: {
      interior: 0,
      exterior: 0,
      misc: 0,
    },
    loanToCost: 90,
    rehabPercentage: 100,
    arvLimit: 65,
    interestRate: 13,
    origination: 3,
    transferTax: 0.75,
    utilitiesPerMonth: 200,
    maintenanceCosts: 250,
    miscCosts: 0,
    realtorFee: 5,
    capitalGains: 20,
  });

  const [outputs, setOutputs] = useState({});

  useEffect(() => {
    calculateOutputs();
  }, [inputs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: parseFloat(value) || 0 });
  };

  const handleDetailedChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      rehabDetailed: { ...inputs.rehabDetailed, [name]: parseFloat(value) || 0 },
    });
  };

  const calculateOutputs = () => {
    const rehabTotal = inputs.useDetailedRehab
      ? Object.values(inputs.rehabDetailed).reduce((a, b) => a + b, 0)
      : inputs.rehabQuick;

    const loanAmountInitial = inputs.purchasePrice * (inputs.loanToCost / 100);
    const downPayment = inputs.purchasePrice - loanAmountInitial;
    const origination = loanAmountInitial * (inputs.origination / 100);
    const closingCosts = loanAmountInitial * (inputs.transferTax / 100);
    const transferTax = inputs.purchasePrice * (inputs.transferTax / 100);
    const totalClosing = downPayment + origination + closingCosts + transferTax;
    const loanAmountMaxDraw = loanAmountInitial + rehabTotal * (inputs.rehabPercentage / 100);
    const arvDollarLimit = inputs.targetSalePrice * (inputs.arvLimit / 100);
    const avgInterest = ((loanAmountInitial + loanAmountMaxDraw) / 2) * (inputs.interestRate / 100 / 12) * inputs.timeToSold;
    const totalHoldingCosts = (inputs.utilitiesPerMonth + inputs.maintenanceCosts + inputs.miscCosts) * inputs.timeToSold;
    const totalCosts = loanAmountMaxDraw + totalClosing + avgInterest + totalHoldingCosts;
    const profit = inputs.targetSalePrice - totalCosts;
    const realtorFees = inputs.targetSalePrice * (inputs.realtorFee / 100);
    const capitalGainsAmount = profit * (inputs.capitalGains / 100);
    const netProfit = profit - realtorFees - capitalGainsAmount;

    setOutputs({
      rehabTotal,
      loanAmountInitial,
      downPayment,
      origination,
      closingCosts,
      transferTax,
      totalClosing,
      loanAmountMaxDraw,
      arvDollarLimit,
      totalCosts,
      profit,
      netProfit,
      profitPercent: (netProfit / inputs.targetSalePrice) * 100,
      warnings: {
        TLTC: loanAmountMaxDraw / (inputs.purchasePrice + rehabTotal) > inputs.loanToCost / 100,
        ARV: loanAmountMaxDraw / inputs.targetSalePrice > inputs.arvLimit / 100,
      },
    });
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Fix and Flip Calculator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="inputs bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Inputs</h3>
          {["timeToSold", "purchasePrice", "targetSalePrice", "rehabQuick", "loanToCost", "rehabPercentage",
            "arvLimit", "interestRate", "origination", "transferTax", "utilitiesPerMonth",
            "maintenanceCosts", "miscCosts", "realtorFee", "capitalGains"].map(key => (
            <div key={key} className="mb-4">
              <label className="capitalize block text-sm font-medium mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="number"
                name={key}
                value={inputs[key]}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
          ))}
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={inputs.useDetailedRehab}
              onChange={() => setInputs({ ...inputs, useDetailedRehab: !inputs.useDetailedRehab })}
              className="mr-2"
            />Detailed Rehab
          </label>
          {inputs.useDetailedRehab && (
            <div className="grid grid-cols-1 gap-4 mt-2">
              {["interior", "exterior", "misc"].map(key => (
                <div key={key}>
                  <label className="capitalize block text-sm font-medium mb-1">{key}</label>
                  <input
                    type="number"
                    name={key}
                    value={inputs.rehabDetailed[key]}
                    onChange={handleDetailedChange}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="outputs bg-gray-100 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Results</h2>
          {["rehabTotal", "loanAmountInitial", "downPayment", "origination", "closingCosts", "transferTax", "totalClosing",
            "loanAmountMaxDraw", "arvDollarLimit", "totalCosts", "profit", "netProfit", "profitPercent"].map(key => (
            <p key={key} className="capitalize">{key.replace(/([A-Z])/g, ' $1')}: <strong>${outputs[key]?.toFixed(2)}</strong></p>
          ))}
          {outputs.warnings?.TLTC && <p className="text-red-600 font-semibold mt-2">Warning: Exceeds TLTC limit!</p>}
          {outputs.warnings?.ARV && <p className="text-red-600 font-semibold">Warning: ARV limit exceeded!</p>}
        </div>
      </div>
    </div>
  );
};

export default FixAndFlipCalculator;