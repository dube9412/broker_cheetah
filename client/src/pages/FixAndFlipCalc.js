import React, { useState } from 'react';

function FixAndFlipCalculator() {
    const [inputs, setInputs] = useState({
        timeToSold: 0, // B3
        purchasePrice: 0, // B4
        targetSalePrice: 0, // B6
        loanToCost: 90, // E3 (Displayed as whole number, math done internally)
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
        setInputs({ ...inputs, [name]: parseFloat(value) || 0 });
    };

    // Calculations
    const loanAmount = inputs.purchasePrice * (inputs.loanToCost / 100); // B8
    const cashToClose = inputs.purchasePrice * ((100 - inputs.loanToCost) / 100); // B10
    const originationFee = loanAmount * (inputs.origination / 100); // B11
    const transferTaxAmount = loanAmount * (inputs.transferTax / 100); // B12
    const closingCosts = cashToClose + originationFee + transferTaxAmount; // B14
    const totalInvestment = loanAmount + closingCosts; // B23
    const profit = inputs.targetSalePrice - totalInvestment; // B25
    const profitMargin = (profit / inputs.targetSalePrice) * 100; // B26
    const totalLTC = (totalInvestment / (inputs.purchasePrice + totalInvestment)) * 100; // C16
    const arv = (totalInvestment / inputs.targetSalePrice) * 100; // C17

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-xl font-bold mb-4">Fix and Flip Deal Calculator</h1>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label>Time to Sold (Months)</label>
                    <input type="number" name="timeToSold" value={inputs.timeToSold} onChange={handleChange} className="border p-2 w-full" />
                </div>
                <div>
                    <label>Purchase Price ($)</label>
                    <input type="number" name="purchasePrice" value={inputs.purchasePrice} onChange={handleChange} className="border p-2 w-full" />
                </div>
                <div>
                    <label>Target Sale Price ($)</label>
                    <input type="number" name="targetSalePrice" value={inputs.targetSalePrice} onChange={handleChange} className="border p-2 w-full" />
                </div>
                <div>
                    <label>Loan to Cost (%)</label>
                    <input type="number" name="loanToCost" value={inputs.loanToCost} onChange={handleChange} className="border p-2 w-full" />
                </div>
                <div>
                    <label>Interest Rate (%)</label>
                    <input type="number" name="interestRate" value={inputs.interestRate} onChange={handleChange} className="border p-2 w-full" />
                </div>
            </div>
            <h2 className="text-lg font-bold mt-5">Results</h2>
            <p>Loan Amount: ${loanAmount.toLocaleString()}</p>
            <p>Cash to Close: ${cashToClose.toLocaleString()}</p>
            <p>Origination Fee: ${originationFee.toLocaleString()}</p>
            <p>Transfer Tax: ${transferTaxAmount.toLocaleString()}</p>
            <p>Closing Costs: ${closingCosts.toLocaleString()}</p>
            <p>Total Investment: ${totalInvestment.toLocaleString()}</p>
            <p>Profit: ${profit.toLocaleString()}</p>
            <p>Profit Margin: {profitMargin.toFixed(2)}%</p>
            <p>Total LTC: {totalLTC.toFixed(2)}% (Must be &le; {inputs.totalLoanToCost}%)</p>
            <p>ARV: {arv.toFixed(2)}% (Must be &le; {inputs.arvLimit}%)</p>
        </div>
    );
}

export default FixAndFlipCalculator;

