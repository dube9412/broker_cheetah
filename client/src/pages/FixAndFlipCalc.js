import React, { useState } from 'react';

function FixAndFlipCalculator() {
    const [inputs, setInputs] = useState({
        timeToSold: 3, // B3
        purchasePrice: 150000, // B4
        targetSalePrice: 225000, // B6
        loanToCost: 0.9, // E3 (LTC)
        rehab: 1, // E4 (Rehab %)
        arvLimit: 0.65, // E5 (ARV Limit)
        totalLoanToCost: 0.9, // E6 (TLTC)
        interestRate: 0.13, // E7 (Rate)
        origination: 0.03, // E8 (Origination Fee %)
        transferTax: 0.0075, // E9 (Transfer Tax %)
        utilitiesPerMonth: 200, // E11 (Utilities per month)
        maintenanceCosts: 1000, // E12 (Maintenance)
        miscCosts: 500, // E13 (Miscellaneous)
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: parseFloat(value) || 0 });
    };

    // Auto-calculated values from formulas
    const closingCosts = inputs.purchasePrice * inputs.origination;
    const holdingCosts = inputs.timeToSold * inputs.utilitiesPerMonth;
    const totalInvestment = inputs.purchasePrice + closingCosts + holdingCosts;
    const grossProfit = inputs.targetSalePrice - totalInvestment;
    const roi = totalInvestment > 0 ? ((grossProfit / totalInvestment) * 100).toFixed(2) : 0;

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-xl font-bold mb-4">Fix and Flip Deal Calculator</h1>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label>Time to Sold (Months)</label>
                    <input type="number" name="timeToSold" value={inputs.timeToSold} onChange={handleChange} className="border p-2 w-full" />
                </div>
                <div>
                    <label>Purchase Price</label>
                    <input type="number" name="purchasePrice" value={inputs.purchasePrice} onChange={handleChange} className="border p-2 w-full" />
                </div>
                <div>
                    <label>Target Sale Price</label>
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
                <div>
                    <label>Origination Fee (%)</label>
                    <input type="number" name="origination" value={inputs.origination} onChange={handleChange} className="border p-2 w-full" />
                </div>
            </div>
            <h2 className="text-lg font-bold mt-5">Results</h2>
            <p>Closing Costs: ${closingCosts.toLocaleString()}</p>
            <p>Holding Costs: ${holdingCosts.toLocaleString()}</p>
            <p>Total Investment: ${totalInvestment.toLocaleString()}</p>
            <p>Gross Profit: ${grossProfit.toLocaleString()}</p>
            <p>ROI: {roi}%</p>
        </div>
    );
}

export default FixAndFlipCalculator;
