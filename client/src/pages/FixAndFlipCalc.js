import React, { useState } from 'react';

function FixAndFlipCalculator() {
    const [inputs, setInputs] = useState({
        timeToSold: 0, // B3
        purchasePrice: 0, // B4
        rehabCosts: 0, // B5
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

    // Function to calculate loan amount
    const calculateLoanAmount = () => {
        const loanToCostAmount = (inputs.purchasePrice + inputs.rehabCosts) * (inputs.loanToCost / 100);
        const loanToArvAmount = inputs.targetSalePrice * (inputs.arvLimit / 100);
        return Math.min(loanToCostAmount, loanToArvAmount);
    };

    // Function to calculate total investment
    const calculateTotalInvestment = () => {
        return (
            inputs.purchasePrice +
            inputs.rehabCosts +
            calculateLoanAmount() * (inputs.origination / 100) +
            inputs.purchasePrice * (inputs.transferTax / 100) +
            (((calculateLoanAmount() * inputs.interestRate) / 12) * inputs.timeToSold) +
            (inputs.utilitiesPerMonth * inputs.timeToSold)
        );
    };

    // Function to calculate profit
    const calculateProfit = () => {
        return inputs.targetSalePrice - calculateTotalInvestment();
    };

    // Function to calculate ROI
    const calculateROI = () => {
        return (calculateProfit() / calculateTotalInvestment()) * 100;
    };

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
                    <label>Rehab Costs ($)</label>
                    <input type="number" name="rehabCosts" value={inputs.rehabCosts} onChange={handleChange} className="border p-2 w-full" />
                </div>
                <div>
                    <label>Target Sale Price ($)</label>
                    <input type="number" name="targetSalePrice" value={inputs.targetSalePrice} onChange={handleChange} className="border p-2 w-full" />
                </div>
                <div>
                    <label>Loan to Cost (%)</label>
                    <input type="number" name="loanToCost" value={inputs.loanToCost} onChange={handleChange} className="border p-2 w-full" />
                </div>
            </div>
            <h2 className="text-lg font-bold mt-5">Results</h2>
            <p>Loan Amount: ${calculateLoanAmount().toLocaleString()}</p>
            <p>Total Investment: ${calculateTotalInvestment().toLocaleString()}</p>
            <p>Profit: ${calculateProfit().toLocaleString()}</p>
            <p>ROI: {calculateROI().toFixed(2)}%</p>
        </div>
    );
}

export default FixAndFlipCalculator;


