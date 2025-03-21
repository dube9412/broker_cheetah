import React, { useState, useEffect } from 'react';

const FixAndFlipCalculator = () => {
  const [inputs, setInputs] = useState({
    timeToSold: 6,
    purchasePrice: 100000,
    targetSalePrice: 200000,
    rehabQuick: 30000,
    useDetailedRehab: false,
    interior: 0,
    exterior: 0,
    misc: 0,
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
  
  const [outputs, setOutputs] = useState({
    rehabTotal: 0,
    loanAmountInitial: 0,
    downPayment: 0,
    originationFee: 0,
    closingCosts: 0,
    totalClosing: 0,
    loanAmountMaxDraw: 0,
    avgInterest: 0,
    totalHoldingCosts: 0,
    totalCosts: 0,
    profit: 0,
    realtorFees: 0,
    capitalGainsAmount: 0,
    netProfit: 0,
    profitPercent: 0,
    tltcWarning: false,
    arvWarning: false
  });
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseFloat(value) || 0
    }));
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };
  
  // Icons
  const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
  
  const LandmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="22" x2="21" y2="22"/>
      <line x1="6" y1="18" x2="6" y2="22"/>
      <line x1="18" y1="18" x2="18" y2="22"/>
      <line x1="12" y1="18" x2="12" y2="22"/>
      <path d="M3 10h18"/>
      <path d="m12 10-4-6"/>
      <path d="m12 10 4-6"/>
      <path d="m12 10 4 8"/>
      <path d="m12 10-4 8"/>
      <path d="M20 10 3 22"/>
    </svg>
  );
  
  const WalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
    </svg>
  );
  
  const CalculatorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2"/>
      <line x1="8" y1="6" x2="16" y2="6"/>
      <line x1="16" y1="14" x2="16" y2="18"/>
      <path d="M16 10h.01"/>
      <path d="M12 10h.01"/>
      <path d="M8 10h.01"/>
      <path d="M12 14h.01"/>
      <path d="M8 14h.01"/>
      <path d="M12 18h.01"/>
      <path d="M8 18h.01"/>
    </svg>
  );
  
  const TrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  );
  
  const AlertTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4"/>
      <path d="M12 17h.01"/>
    </svg>
  );
  
  // Money bag SVG for profitable deals vs broke person for unprofitable deals
  const ProfitVisualization = ({profitable}) => {
    return profitable ? (
      <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M75 15C68.3696 15 62.0107 17.6339 57.3223 22.3223C52.6339 27.0107 50 33.3696 50 40V45H40C36.0218 45 32.2064 46.5804 29.3934 49.3934C26.5804 52.2064 25 56.0218 25 60V120C25 123.978 26.5804 127.794 29.3934 130.607C32.2064 133.42 36.0218 135 40 135H110C113.978 135 117.794 133.42 120.607 130.607C123.42 127.794 125 123.978 125 120V60C125 56.0218 123.42 52.2064 120.607 49.3934C117.794 46.5804 113.978 45 110 45H100V40C100 33.3696 97.3661 27.0107 92.6777 22.3223C87.9893 17.6339 81.6304 15 75 15Z" fill="#4CAF50" stroke="black" strokeWidth="2"/>
        <path d="M60 45H90V40C90 36.0218 88.4196 32.2064 85.6066 29.3934C82.7936 26.5804 78.9782 25 75 25C71.0218 25 67.2064 26.5804 64.3934 29.3934C61.5804 32.2064 60 36.0218 60 40V45Z" fill="#81C784" stroke="black" strokeWidth="2"/>
        <path d="M62.5 60H87.5" stroke="white" strokeWidth="5" strokeLinecap="round"/>
        <path d="M75 60V110" stroke="white" strokeWidth="5" strokeLinecap="round"/>
        <path d="M62.5 85H87.5" stroke="white" strokeWidth="5" strokeLinecap="round"/>
        <path d="M40 50C35 55 25 70 50 95C75 120 115 120 120 70" stroke="#81C784" strokeWidth="5"/>
        <path d="M65 110C65 110 70 100 75 100C80 100 85 110 85 110" stroke="#81C784" strokeWidth="3" strokeLinecap="round"/>
        <path d="M40 130C40 130 50 125 75 125C100 125 110 130 110 130" stroke="#81C784" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="110" cy="70" r="7" fill="#FFD700" stroke="black" strokeWidth="1"/>
        <circle cx="50" cy="95" r="7" fill="#FFD700" stroke="black" strokeWidth="1"/>
        <circle cx="85" cy="50" r="5" fill="#FFD700" stroke="black" strokeWidth="1"/>
      </svg>
    ) : (
      <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 110C50 110 55 100 60 100C65 100 70 110 75 110" stroke="#D32F2F" strokeWidth="3" strokeLinecap="round"/>
        <path d="M75 110C75 110 80 100 85 100C90 100 95 110 100 110" stroke="#D32F2F" strokeWidth="3" strokeLinecap="round"/>
        <path d="M70 40C65 40 60 45 60 50V65H90V50C90 45 85 40 80 40H70Z" fill="#D32F2F" stroke="#D32F2F" strokeWidth="2"/>
        <circle cx="75" cy="30" r="15" fill="#D32F2F" stroke="#D32F2F" strokeWidth="2"/>
        <path d="M60 65V80C60 85 65 90 70 90H80C85 90 90 85 90 80V65" stroke="#D32F2F" strokeWidth="3"/>
        <path d="M55 50L40 55" stroke="#D32F2F" strokeWidth="3" strokeLinecap="round"/>
        <path d="M95 50L110 55" stroke="#D32F2F" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="65" cy="25" r="2" fill="white"/>
        <circle cx="85" cy="25" r="2" fill="white"/>
        <path d="M70 35C70 35 75 38 80 35" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  };
  
  // Calculate outputs whenever inputs change
  useEffect(() => {
    const calculate = () => {
      // Calculate rehab total
      const rehabTotal = inputs.useDetailedRehab
        ? inputs.interior + inputs.exterior + inputs.misc
        : inputs.rehabQuick;
      
      // Calculate loan variables
      const loanAmountInitial = inputs.purchasePrice * (inputs.loanToCost / 100);
      const downPayment = inputs.purchasePrice - loanAmountInitial;
      const originationFee = loanAmountInitial * (inputs.origination / 100);
      const closingCosts = loanAmountInitial * (inputs.transferTax / 100);
      const totalClosing = downPayment + originationFee + closingCosts + (inputs.purchasePrice * (inputs.transferTax / 100));
      const loanAmountMaxDraw = loanAmountInitial + rehabTotal * (inputs.rehabPercentage / 100);
      const avgInterest = ((loanAmountInitial + loanAmountMaxDraw) / 2) * (inputs.interestRate / 100 / 12) * inputs.timeToSold;
      const totalHoldingCosts = (inputs.utilitiesPerMonth + inputs.maintenanceCosts + inputs.miscCosts) * inputs.timeToSold;
      const totalCosts = loanAmountMaxDraw + totalClosing + avgInterest + totalHoldingCosts;
      
      // Calculate profit metrics
      const profit = inputs.targetSalePrice - totalCosts;
      const realtorFees = inputs.targetSalePrice * (inputs.realtorFee / 100);
      const capitalGainsAmount = profit * (inputs.capitalGains / 100);
      const netProfit = profit - realtorFees - capitalGainsAmount;
      const profitPercent = (netProfit / inputs.targetSalePrice) * 100;
      
      // Check warning conditions
      const tltcWarning = loanAmountMaxDraw / (inputs.purchasePrice + rehabTotal) > inputs.loanToCost / 100;
      const arvWarning = loanAmountMaxDraw / inputs.targetSalePrice > inputs.arvLimit / 100;
      
      // Update outputs state
      setOutputs({
        rehabTotal,
        loanAmountInitial,
        downPayment,
        originationFee,
        closingCosts,
        totalClosing,
        loanAmountMaxDraw,
        avgInterest,
        totalHoldingCosts,
        totalCosts,
        profit,
        realtorFees,
        capitalGainsAmount,
        netProfit,
        profitPercent,
        tltcWarning,
        arvWarning
      });
    };
    
    calculate();
  }, [inputs]);

  // Prevent zooming
  useEffect(() => {
    const handleWheel = (e) => {
      const isPinching = e.ctrlKey;
      if(isPinching) e.preventDefault();
    };
    
    window.addEventListener("wheel", handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);
  
  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      backgroundColor: "#f4f4f5",
      color: "#18181b",
      lineHeight: 1.5,
      padding: "20px",
      margin: 0,
      boxSizing: "border-box"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px"
      }}>
        <header style={{
          textAlign: "center",
          marginBottom: "32px"
        }}>
          <h1 style={{
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "8px",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
          }}>Fix and Flip Calculator</h1>
          <p style={{
            color: "#71717a",
            fontSize: "14px"
          }}>Analyze your real estate investment with precision</p>
        </header>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "24px",
          marginBottom: "24px"
        }}>
          {/* Box 1: Property Details */}
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e4e4e7",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{
              backgroundColor: "#000000",
              color: "white",
              padding: "12px 16px",
              fontWeight: 600,
              fontSize: "16px",
              display: "flex",
              alignItems: "center"
            }}>
              <HomeIcon /> <span style={{marginLeft: "8px"}}>Property Details</span>
            </div>
            <div style={{
              padding: "16px"
            }}>
              <div style={{marginBottom: "16px"}}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "#18181b"
                }} htmlFor="timeToSold">Time to Sold (months)</label>
                <input
                  type="number"
                  id="timeToSold"
                  name="timeToSold"
                  value={inputs.timeToSold}
                  onChange={handleInputChange}
                  min="0"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                />
              </div>
              
              <div style={{marginBottom: "16px"}}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "#18181b"
                }} htmlFor="purchasePrice">Purchase Price ($)</label>
                <input
                  type="number"
                  id="purchasePrice"
                  name="purchasePrice"
                  value={inputs.purchasePrice}
                  onChange={handleInputChange}
                  min="0"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                />
              </div>
              
              <div style={{marginBottom: "16px"}}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "#18181b"
                }} htmlFor="targetSalePrice">Target Sale Price ($)</label>
                <input
                  type="number"
                  id="targetSalePrice"
                  name="targetSalePrice"
                  value={inputs.targetSalePrice}
                  onChange={handleInputChange}
                  min="0"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                />
              </div>
              
              <div style={{marginBottom: "16px"}}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "#18181b"
                }} htmlFor="rehabQuick">Rehab Quick ($)</label>
                <input
                  type="number"
                  id="rehabQuick"
                  name="rehabQuick"
                  value={inputs.rehabQuick}
                  onChange={handleInputChange}
                  min="0"
                  disabled={inputs.useDetailedRehab}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "border-color 0.2s",
                    opacity: inputs.useDetailedRehab ? 0.5 : 1
                  }}
                />
              </div>
              
              <div style={{
                display: "flex",
                alignItems: "center",
                marginTop: "8px"
              }}>
                <input
                  type="checkbox"
                  id="useDetailedRehab"
                  name="useDetailedRehab"
                  checked={inputs.useDetailedRehab}
                  onChange={handleInputChange}
                  style={{marginRight: "8px"}}
                />
                <label htmlFor="useDetailedRehab">Use Detailed Rehab</label>
              </div>
              
              {inputs.useDetailedRehab && (
                <div style={{
                  backgroundColor: "#f4f4f5",
                  padding: "12px",
                  borderRadius: "8px",
                  marginTop: "12px"
                }}>
                  <h3 style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    marginBottom: "12px",
                    color: "#71717a"
                  }}>Detailed Rehab Costs</h3>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px"
                  }}>
                    <div>
                      <label style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: 500,
                        marginBottom: "6px",
                        color: "#18181b"
                      }} htmlFor="interior">Interior ($)</label>
                      <input
                        type="number"
                        id="interior"
                        name="interior"
                        value={inputs.interior}
                        onChange={handleInputChange}
                        min="0"
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          border: "1px solid #e4e4e7",
                          borderRadius: "6px",
                          fontSize: "14px",
                          transition: "border-color 0.2s"
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: 500,
                        marginBottom: "6px",
                        color: "#18181b"
                      }} htmlFor="exterior">Exterior ($)</label>
                      <input
                        type="number"
                        id="exterior"
                        name="exterior"
                        value={inputs.exterior}
                        onChange={handleInputChange}
                        min="0"
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          border: "1px solid #e4e4e7",
                          borderRadius: "6px",
                          fontSize: "14px",
                          transition: "border-color 0.2s"
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: 500,
                        marginBottom: "6px",
                        color: "#18181b"
                      }} htmlFor="misc">Misc ($)</label>
                      <input
                        type="number"
                        id="misc"
                        name="misc"
                        value={inputs.misc}
                        onChange={handleInputChange}
                        min="0"
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          border: "1px solid #e4e4e7",
                          borderRadius: "6px",
                          fontSize: "14px",
                          transition: "border-color 0.2s"
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Box 2: Loan Details */}
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e4e4e7",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{
              backgroundColor: "#000000",
              color: "white",
              padding: "12px 16px",
              fontWeight: 600,
              fontSize: "16px",
              display: "flex",
              alignItems: "center"
            }}>
              <LandmarkIcon /> <span style={{marginLeft: "8px"}}>Loan Details</span>
            </div>
            <div style={{
              padding: "16px"
            }}>
              <div style={{marginBottom: "16px"}}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "#18181b"
                }} htmlFor="loanToCost">Loan to Cost (%)</label>
                <input
                  type="number"
                  id="loanToCost"
                  name="loanToCost"
                  value={inputs.loanToCost}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                />
              </div>
              
              <div style={{marginBottom: "16px"}}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "#18181b"
                }} htmlFor="rehabPercentage">Rehab Percentage (%)</label>
                <input
                  type="number"
                  id="rehabPercentage"
                  name="rehabPercentage"
                  value={inputs.rehabPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                />
              </div>
              
              <div style={{marginBottom: "16px"}}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "#18181b"
                }} htmlFor="arvLimit">ARV Limit (%)</label>
                <input
                  type="number"
                  id="arvLimit"
                  name="arvLimit"
                  value={inputs.arvLimit}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                />
              </div>
              
              <div style={{marginBottom: "16px"}}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "#18181b"
                }} htmlFor="interestRate">Interest Rate (%)</label>
                <input
                  type="number"
                  id="interestRate"
                  name="interestRate"
                  value={inputs.interestRate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                />
              </div>
              
              <div style={{marginBottom: "16px"}}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "#18181b"
                }} htmlFor="origination">Origination (%)</label>
                <input
                  type="number"
                  id="origination"
                  name="origination"
                  value={inputs.origination}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                />
              </div>
              
              <div style={{marginBottom: "0"}}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "#18181b"
                }} htmlFor="transferTax">Transfer Tax (%)</label>
                <input
                  type="number"
                  id="transferTax"
                  name="transferTax"
                  value={inputs.transferTax}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Box 3: Holding Costs */}
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e4e4e7",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{
              backgroundColor: "#000000",
              color: "white",
              padding: "12px 16px",
              fontWeight: 600,
              fontSize: "16px",
              display: "flex",
              alignItems: "center"
            }}>
              <WalletIcon /> <span style={{marginLeft: "8px"}}>Holding Costs</span>
            </div>
            <div style={{
              padding: "16px"
            }}>
              <div style={{marginBottom: "16px"}}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "#18181b"
                }} htmlFor="utilitiesPerMonth">Utilities Per Month ($)</label>
                <input
                  type="number"
                  id="utilitiesPerMonth"
                  name="utilitiesPerMonth"
                  value={inputs.utilitiesPerMonth}
                  onChange={handleInputChange}
                  min="0"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                />
              </div>
              
              <div style={{marginBottom: "16px"}}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "#18181b"
                }} htmlFor="maintenanceCosts">Maintenance Costs ($)</label>
                <input
                  type="number"
                  id="maintenanceCosts"
                  name="maintenanceCosts"
                  value={inputs.maintenanceCosts}
                  onChange={handleInputChange}
                  min="0"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                />
              </div>
              
              <div style={{marginBottom: "16px"}}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "#18181b"
                }} htmlFor="miscCosts">Misc Costs ($)</label>
                <input
                  type="number"
                  id="miscCosts"
                  name="miscCosts"
                  value={inputs.miscCosts}
                  onChange={handleInputChange}
                  min="0"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                />
              </div>
              
              <div style={{marginBottom: "16px"}}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "#18181b"
                }} htmlFor="realtorFee">Realtor Fee (%)</label>
                <input
                  type="number"
                  id="realtorFee"
                  name="realtorFee"
                  value={inputs.realtorFee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                />
              </div>
              
              <div style={{marginBottom: "0"}}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "#18181b"
                }} htmlFor="capitalGains">Capital Gains (%)</label>
                <input
                  type="number"
                  id="capitalGains"
                  name="capitalGains"
                  value={inputs.capitalGains}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "24px",
          marginBottom: "24px"
        }}>
          {/* Cost Breakdown */}
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e4e4e7",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{
              backgroundColor: "#000000",
              color: "white",
              padding: "12px 16px",
              fontWeight: 600,
              fontSize: "16px",
              display: "flex",
              alignItems: "center"
            }}>
              <CalculatorIcon /> <span style={{marginLeft: "8px"}}>Cost Breakdown</span>
            </div>
            <div style={{
              padding: "16px"
            }}>
              {[
                { label: "Rehab Total:", value: outputs.rehabTotal },
                { label: "Initial Loan Amount:", value: outputs.loanAmountInitial },
                { label: "Down Payment:", value: outputs.downPayment },
                { label: "Origination Fees:", value: outputs.originationFee },
                { label: "Closing Costs:", value: outputs.closingCosts },
                { label: "Total Closing:", value: outputs.totalClosing },
                { label: "Loan Amount (Max Draw):", value: outputs.loanAmountMaxDraw }
              ].map((item, index, array) => (
                <div key={index} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: index === array.length - 1 ? "none" : "1px solid #e4e4e7"
                }}>
                  <span style={{
                    fontSize: "14px",
                    color: "#71717a"
                  }}>{item.label}</span>
                  <span style={{
                    fontWeight: 500,
                    textAlign: "right"
                  }}>{formatCurrency(item.value)}</span>
                </div>
              ))}
              
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderTop: "2px solid #e4e4e7",
                marginTop: "8px"
              }}>
                <span style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#18181b"
                }}>Total Costs:</span>
                <span style={{
                  fontWeight: 700,
                  textAlign: "right",
                  fontSize: "16px"
                }}>{formatCurrency(outputs.totalCosts)}</span>
              </div>
            </div>
          </div>
          
          {/* Profit Analysis */}
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e4e4e7",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{
              backgroundColor: "#000000",
              color: "white",
              padding: "12px 16px",
              fontWeight: 600,
              fontSize: "16px",
              display: "flex",
              alignItems: "center"
            }}>
              <TrendingUpIcon /> <span style={{marginLeft: "8px"}}>Profit Analysis</span>
            </div>
            <div style={{
              padding: "16px"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #e4e4e7"
              }}>
                <span style={{
                  fontSize: "14px",
                  color: "#71717a"
                }}>Gross Profit:</span>
                <span style={{
                  fontWeight: 500,
                  textAlign: "right"
                }}>{formatCurrency(outputs.profit)}</span>
              </div>
              
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #e4e4e7"
              }}>
                <span style={{
                  fontSize: "14px",
                  color: "#71717a"
                }}>Realtor Fees:</span>
                <span style={{
                  fontWeight: 500,
                  textAlign: "right"
                }}>{formatCurrency(outputs.realtorFees)}</span>
              </div>
              
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #e4e4e7"
              }}>
                <span style={{
                  fontSize: "14px",
                  color: "#71717a"
                }}>Capital Gains Tax:</span>
                <span style={{
                  fontWeight: 500,
                  textAlign: "right"
                }}>{formatCurrency(outputs.capitalGainsAmount)}</span>
              </div>
              
              {(outputs.tltcWarning || outputs.arvWarning) && (
                <div style={{marginTop: "12px"}}>
                  {outputs.tltcWarning && (
                    <div style={{
                      backgroundColor: "#fee2e2",
                      color: "#b91c1c",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "flex-start",
                      fontSize: "14px"
                    }}>
                      <AlertTriangleIcon />
                      <span style={{marginLeft: "8px"}}>Warning: Exceeds Loan to Cost limit!</span>
                    </div>
                  )}
                  
                  {outputs.arvWarning && (
                    <div style={{
                      backgroundColor: "#fee2e2",
                      color: "#b91c1c",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "flex-start",
                      fontSize: "14px"
                    }}>
                      <AlertTriangleIcon />
                      <span style={{marginLeft: "8px"}}>Warning: Exceeds ARV limit!</span>
                    </div>  
                  )}
                </div>  
              )}  

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderTop: "2px solid #e4e4e7",
                marginTop: "8px"
              }}>
                <span style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#18181b"
                }}>Net Profit:</span>
                <span style={{
                  fontWeight: 700,
                  textAlign: "right",
                  fontSize: "16px"
                }}>{formatCurrency(outputs.netProfit)}</span>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderTop: "2px solid #e4e4e7",
                marginTop: "8px"
              }}>
                <span style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#18181b"
                }}>Profit Margin:</span>
                <span style={{
                  fontWeight: 700,
                  textAlign: "right",
                  fontSize: "16px"
                }}>{outputs.profitPercent.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "24px",
          marginBottom: "24px"
        }}>
          {/* Visual Representation */}
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e4e4e7",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{
              backgroundColor: "#000000",
              color: "white",
              padding: "12px 16px",
              fontWeight: 600,
              fontSize: "16px",
              display: "flex",
              alignItems: "center"
            }}>
              <EyeIcon /> <span style={{marginLeft: "8px"}}>Visual Representation</span>
            </div>
            <div style={{
              padding: "16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              {renderVisualRepresentation()}
            </div>
          </div>
          
          {/* Disclaimer */}
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e4e4e7",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{
              backgroundColor: "#000000",
              color: "white",
              padding: "12px 16px",
              fontWeight: 600,
              fontSize: "16px",
              display: "flex",
              alignItems: "center"
            }}>
              <InfoIcon /> <span style={{marginLeft: "8px"}}>Disclaimer</span>
            </div>
            <div style={{
              padding: "16px"
            }}>
              <p style={{
                fontSize: "14px",
                color: "#18181b"
              }}>This calculator is for informational purposes only. It is not intended as financial, investment, tax, or legal advice. Always consult a professional advisor before making any financial decisions.</p>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}

export default FixAndFlipCalc;