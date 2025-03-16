import React, { useEffect } from 'react';
import './HardMoneyClass.css'; 

const HardMoneyClass = () => {
    useEffect(() => {
        // Inject script.js dynamically
        const script = document.createElement("script");
        script.src = "/script.js"; // Ensure this is served from the public folder
        script.async = true;
        document.body.appendChild(script);
    
        return () => {
          document.body.removeChild(script); // Cleanup when component unmounts
        };
      }, []);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="./HardMoneyClass.css">
    </head>
    <body>
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Hard Money Lending Masterclass</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="styles.css">
    <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-gray-50 text-gray-900">
    <header class="bg-black text-white p-6 sticky top-0 z-50 shadow-sm border-b border-gray-800">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-full h-full text-white">
                        <path fill="currentColor" d="M12 3L1 9l11 6l9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z"/>
                    </svg>
                </div>
                <h1 class="text-xl font-bold font-geist-mono">Hard Money Lending <span class="opacity-70">Masterclass</span></h1>
            </div>
            <nav>
                <ul class="flex space-x-6">
                    <li><a href="#loan-types" class="text-sm hover:text-gray-300 transition">Loan Types</a></li>
                    <li><a href="#quote-process" class="text-sm hover:text-gray-300 transition">Quote Process</a></li>
                    <li><a href="#loan-application" class="text-sm hover:text-gray-300 transition">Application</a></li>
                    <li><a href="#lender-process" class="text-sm hover:text-gray-300 transition">Lender Process</a></li>
                    <li><a href="#broker-clients" class="text-sm hover:text-gray-300 transition">Finding Clients</a></li>
                    <li><a href="#glossary" class="text-sm hover:text-gray-300 transition">Glossary</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-10">
        <section class="mb-16">
            <div class="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-xl">
                <div class="p-10 md:p-16 flex flex-col md:flex-row items-center">
                    <div class="w-full md:w-2/3 text-white mb-8 md:mb-0">
                        <h2 class="text-3xl md:text-4xl font-bold mb-6 leading-tight">Understanding Hard Money Lending</h2>
                        <p class="text-lg text-gray-300 mb-8">A comprehensive guide for real estate investors and brokers who want to master the art of hard money lending in today's competitive market.</p>
                        <div class="flex space-x-4">
                            <button class="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition" id="startLearningBtn">Start Learning</button>
                            <button class="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition">Download Guide</button>
                        </div>
                    </div>
                    <div class="w-full md:w-1/3 flex justify-center">
                        <img src="https://r2.flowith.net/files/5e7995ef-ffd4-42e4-ba01-2ae2fa9fc8f1/1742098558867-A_coll.jpeg" alt="Real Estate Collateral" class="rounded-lg shadow-lg max-w-full h-auto">
                    </div>
                </div>
            </div>
        </section>

        <section id="loan-types" class="mb-16">
            <div class="border-b border-gray-200 pb-5 mb-8">
                <h2 class="text-3xl font-bold">1. Loan Types</h2>
                <p class="text-gray-600 mt-2">Comprehensive breakdown of hard money loan options for various real estate investment strategies.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <i class='bx bx-home text-blue-600 text-xl'></i>
                        </div>
                        <h3 class="text-xl font-semibold">Fix & Flip Loans</h3>
                    </div>
                    <p class="text-gray-600 mb-4">Short-term financing solutions for investors looking to purchase, renovate, and quickly resell properties for profit.</p>
                    <ul class="text-sm text-gray-600 space-y-2">
                        <li class="flex items-start">
                            <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                            <span>Loan amounts based on After-Repair Value (ARV)</span>
                        </li>
                        <li class="flex items-start">
                            <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                            <span>Requires detailed renovation budget</span>
                        </li>
                        <li class="flex items-start">
                            <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                            <span>Typically 6-18 month terms</span>
                        </li>
                    </ul>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <i class='bx bx-building-house text-purple-600 text-xl'></i>
                        </div>
                        <h3 class="text-xl font-semibold">DSCR Loans</h3>
                    </div>
                    <p class="text-gray-600 mb-4">Debt Service Coverage Ratio loans for rental property investors, qualified based on property's income rather than borrower's.</p>
                    <ul class="text-sm text-gray-600 space-y-2">
                        <li class="flex items-start">
                            <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                            <span>Focuses on property's ability to generate income</span>
                        </li>
                        <li class="flex items-start">
                            <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                            <span>Ideal for investors with multiple properties</span>
                        </li>
                        <li class="flex items-start">
                            <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                            <span>Typically longer terms than fix & flip</span>
                        </li>
                    </ul>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <i class='bx bx-transfer-alt text-green-600 text-xl'></i>
                        </div>
                        <h3 class="text-xl font-semibold">Stabilized Bridge Loans</h3>
                    </div>
                    <p class="text-gray-600 mb-4">Temporary financing for properties with stable income but transitioning between long-term financing options.</p>
                    <ul class="text-sm text-gray-600 space-y-2">
                        <li class="flex items-start">
                            <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                            <span>For properties with existing cash flow</span>
                        </li>
                        <li class="flex items-start">
                            <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                            <span>Bridges gap between loan types</span>
                        </li>
                        <li class="flex items-start">
                            <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                            <span>Typically 1-3 year terms</span>
                        </li>
                    </ul>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                            <i class='bx bx-buildings text-amber-600 text-xl'></i>
                        </div>
                        <h3 class="text-xl font-semibold">Ground-Up Construction</h3>
                    </div>
                    <p class="text-gray-600 mb-4">Financing for building new structures from scratch on vacant land, with staged funding throughout construction phases.</p>
                    <ul class="text-sm text-gray-600 space-y-2">
                        <li class="flex items-start">
                            <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                            <span>Includes detailed construction plans and budgets</span>
                        </li>
                        <li class="flex items-start">
                            <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                            <span>Draw schedule for milestone-based funding</span>
                        </li>
                        <li class="flex items-start">
                            <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                            <span>Requires contractor vetting and inspections</span>
                        </li>
                    </ul>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                            <i class='bx bx-folder-open text-red-600 text-xl'></i>
                        </div>
                        <h3 class="text-xl font-semibold">Portfolio Loans</h3>
                    </div>
                    <p class="text-gray-600 mb-4">Financing solutions for investors looking to purchase or refinance multiple properties under a single loan.</p>
                    <ul class="text-sm text-gray-600 space-y-2">
                        <li class="flex items-start">
                            <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                            <span>Consolidates multiple properties into one loan</span>
                        </li>
                        <li class="flex items-start">
                            <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                            <span>Streamlined management and paperwork</span>
                        </li>
                        <li class="flex items-start">
                            <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                            <span>Often offers economies of scale on rates and fees</span>
                        </li>
                    </ul>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                            <i class='bx bx-refresh text-teal-600 text-xl'></i>
                        </div>
                        <h3 class="text-xl font-semibold">BRRRR Strategy Loans</h3>
                    </div>
                    <p class="text-gray-600 mb-4">Buy, Rehab, Rent, Refinance, Repeat – Financing structured specifically for this popular real estate investment strategy.</p>
                    <ul class="text-sm text-gray-600 space-y-2">
                        <li class="flex items-start">
                            <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                            <span>Initial hard money for acquisition and rehab</span>
                        </li>
                        <li class="flex items-start">
                            <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                            <span>Transitions to long-term financing after stabilization</span>
                        </li>
                        <li class="flex items-start">
                            <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                            <span>Focuses on cash-out refinance to recover capital</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="mt-10 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 class="text-xl font-semibold mb-4">Loan Type Considerations</h3>
                
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Type</th>
                                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Typical Term</th>
                                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LTV/LTC Range</th>
                                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate Range</th>
                                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best For</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Fix & Flip</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6-18 months</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">65-75% ARV</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8-12%</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Short-term rehab projects</td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">DSCR</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5-30 years</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">70-80% LTV</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5-8%</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rental property investors</td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Bridge</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1-3 years</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">65-75% LTV</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7-10%</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Transitional properties</td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Construction</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12-24 months</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">60-75% LTC</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">9-13%</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">New development projects</td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Portfolio</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Varies</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">65-80% LTV</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Varies</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Multiple property investors</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <section id="quote-process" class="mb-16">
            <div class="border-b border-gray-200 pb-5 mb-8">
                <h2 class="text-3xl font-bold">2. Quote Process & Client Sensitivities</h2>
                <p class="text-gray-600 mt-2">Understanding what matters to borrowers when selecting a hard money lender for their project.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 class="text-xl font-semibold mb-4">What's Included in a Quote Request</h3>
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <ul class="space-y-4">
                            <li class="flex items-start">
                                <div class="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">1</div>
                                <div>
                                    <span class="font-medium">Property Information</span>
                                    <p class="text-sm text-gray-600 mt-1">Address, property type, current value, purchase price, and basic property details.</p>
                                </div>
                            </li>
                            <li class="flex items-start">
                                <div class="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">2</div>
                                <div>
                                    <span class="font-medium">Loan Request Details</span>
                                    <p class="text-sm text-gray-600 mt-1">Desired loan amount, intended use of funds (purchase, rehab, etc.), preferred term length.</p>
                                </div>
                            </li>
                            <li class="flex items-start">
                                <div class="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">3</div>
                                <div>
                                    <span class="font-medium">Borrower Information</span>
                                    <p class="text-sm text-gray-600 mt-1">Real estate experience, credit score range, entity type (individual or LLC), available cash reserves.</p>
                                </div>
                            </li>
                            <li class="flex items-start">
                                <div class="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">4</div>
                                <div>
                                    <span class="font-medium">Project Details</span>
                                    <p class="text-sm text-gray-600 mt-1">For rehab: renovation budget and scope of work. For rentals: current or projected monthly income.</p>
                                </div>
                            </li>
                            <li class="flex items-start">
                                <div class="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">5</div>
                                <div>
                                    <span class="font-medium">Exit Strategy</span>
                                    <p class="text-sm text-gray-600 mt-1">How the borrower plans to repay the loan (sell, refinance, etc.) and timeline for exit.</p>
                                </div>
                            </li>
                            <li class="flex items-start">
                                <div class="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">6</div>
                                <div>
                                    <span class="font-medium">Timeline Requirements</span>
                                    <p class="text-sm text-gray-600 mt-1">How quickly the borrower needs to close and any pending deadlines.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div>
                    <h3 class="text-xl font-semibold mb-4">Client Sensitivities When Choosing a Lender</h3>
                    
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div class="space-y-5">
                            <div class="flex items-start">
                                <div class="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mr-3">
                                    <i class='bx bx-money text-lg'></i>
                                </div>
                                <div>
                                    <span class="font-medium">Cost Structure</span>
                                    <p class="text-sm text-gray-600 mt-1">Interest rate, origination fees, points, closing costs, prepayment penalties, and extension fees.</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start">
                                <div class="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 mr-3">
                                    <i class='bx bx-time text-lg'></i>
                                </div>
                                <div>
                                    <span class="font-medium">Speed of Closing</span>
                                    <p class="text-sm text-gray-600 mt-1">How quickly the lender can process, underwrite, and fund the loan, especially for time-sensitive deals.</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start">
                                <div class="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 mr-3">
                                    <i class='bx bx-slider text-lg'></i>
                                </div>
                                <div>
                                    <span class="font-medium">Flexibility</span>
                                    <p class="text-sm text-gray-600 mt-1">Willingness to work with unique situations, property types, or borrower circumstances.</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start">
                                <div class="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 mr-3">
                                    <i class='bx bx-check-shield text-lg'></i>
                                </div>
                                <div>
                                    <span class="font-medium">Reliability & Reputation</span>
                                    <p class="text-sm text-gray-600 mt-1">Trustworthiness, consistency, and track record of successfully closing loans as quoted.</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start">
                                <div class="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-3">
                                    <i class='bx bx-wallet text-lg'></i>
                                </div>
                                <div>
                                    <span class="font-medium">Leverage (LTV/LTC Ratios)</span>
                                    <p class="text-sm text-gray-600 mt-1">Maximum loan-to-value or loan-to-cost ratios offered, impacting cash needed for down payment.</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start">
                                <div class="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                                    <i class='bx bx-calendar text-lg'></i>
                                </div>
                                <div>
                                    <span class="font-medium">Term Length & Structure</span>
                                    <p class="text-sm text-gray-600 mt-1">Duration of the loan, payment schedule, interest-only options, and balloon payment details.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-6">
                        <h4 class="text-lg font-medium mb-3">Why Sensitivities Matter</h4>
                        <p class="text-gray-600 mb-3">Understanding client sensitivities allows brokers to match borrowers with the most appropriate lender for their specific project and priorities. This leads to:</p>
                        <ul class="text-sm text-gray-600 space-y-2">
                            <li class="flex items-start">
                                <i class='bx bx-check text-green-500 mr-2 mt-1'></i>
                                <span>Higher client satisfaction and retention</span>
                            </li>
                            <li class="flex items-start">
                                <i class='bx bx-check text-green-500 mr-2 mt-1'></i>
                                <span>More successful transactions and fewer fallouts</span>
                            </li>
                            <li class="flex items-start">
                                <i class='bx bx-check text-green-500 mr-2 mt-1'></i>
                                <span>Better long-term relationships with both borrowers and lenders</span>
                            </li>
                            <li class="flex items-start">
                                <i class='bx bx-check text-green-500 mr-2 mt-1'></i>
                                <span>Increased referrals from happy clients</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section id="loan-application" class="mb-16">
            <div class="border-b border-gray-200 pb-5 mb-8">
                <h2 class="text-3xl font-bold">3. Loan Application Process</h2>
                <p class="text-gray-600 mt-2">Requirements and procedures for different loan types from application to closing.</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-1">
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-28">
                        <h3 class="text-xl font-semibold mb-4">Application Requirements By Loan Type</h3>
                        
                        <div class="flex border-b border-gray-200">
                            <button class="loan-tab-btn active py-3 px-4 font-medium text-sm" data-tab="fix-flip">Fix & Flip</button>
                            <button class="loan-tab-btn py-3 px-4 font-medium text-sm" data-tab="dscr">DSCR</button>
                            <button class="loan-tab-btn py-3 px-4 font-medium text-sm" data-tab="construction">Construction</button>
                        </div>
                        
                        <div class="loan-tab-content active mt-4" id="fix-flip-content">
                            <ul class="space-y-3 text-sm">
                                <li class="flex items-start">
                                    <i class='bx bx-file text-blue-500 mr-2 mt-0.5'></i>
                                    <span>Loan application form</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-blue-500 mr-2 mt-0.5'></i>
                                    <span>Purchase contract (if acquisition)</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-blue-500 mr-2 mt-0.5'></i>
                                    <span>Detailed scope of work/renovation budget</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-blue-500 mr-2 mt-0.5'></i>
                                    <span>Proof of funds for down payment/closing costs</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-blue-500 mr-2 mt-0.5'></i>
                                    <span>Color photos of property (interior/exterior)</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-blue-500 mr-2 mt-0.5'></i>
                                    <span>Comparable sales to support ARV</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-blue-500 mr-2 mt-0.5'></i>
                                    <span>Entity documents (if using LLC/Corp)</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-blue-500 mr-2 mt-0.5'></i>
                                    <span>Experience documentation (past projects)</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-blue-500 mr-2 mt-0.5'></i>
                                    <span>Exit strategy documentation</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div class="loan-tab-content hidden mt-4" id="dscr-content">
                            <ul class="space-y-3 text-sm">
                                <li class="flex items-start">
                                    <i class='bx bx-file text-purple-500 mr-2 mt-0.5'></i>
                                    <span>Loan application form</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-purple-500 mr-2 mt-0.5'></i>
                                    <span>Purchase contract (if acquisition)</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-purple-500 mr-2 mt-0.5'></i>
                                    <span>Rent roll (for existing rentals)</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-purple-500 mr-2 mt-0.5'></i>
                                    <span>Lease agreements (if property is tenanted)</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-purple-500 mr-2 mt-0.5'></i>
                                    <span>Market rent analysis (for vacant properties)</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-purple-500 mr-2 mt-0.5'></i>
                                    <span>Property operating expenses</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-purple-500 mr-2 mt-0.5'></i>
                                    <span>Proof of funds for down payment/closing costs</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-purple-500 mr-2 mt-0.5'></i>
                                    <span>Property insurance quote</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-purple-500 mr-2 mt-0.5'></i>
                                    <span>Property management plan</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div class="loan-tab-content hidden mt-4" id="construction-content">
                            <ul class="space-y-3 text-sm">
                                <li class="flex items-start">
                                    <i class='bx bx-file text-amber-500 mr-2 mt-0.5'></i>
                                    <span>Loan application form</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-amber-500 mr-2 mt-0.5'></i>
                                    <span>Land purchase contract (if applicable)</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-amber-500 mr-2 mt-0.5'></i>
                                    <span>Detailed construction budget</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-amber-500 mr-2 mt-0.5'></i>
                                    <span>Architectural plans and renderings</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-amber-500 mr-2 mt-0.5'></i>
                                    <span>Construction timeline with milestones</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-amber-500 mr-2 mt-0.5'></i>
                                    <span>Building permits and approvals</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-amber-500 mr-2 mt-0.5'></i>
                                    <span>Contractor bids and agreements</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-amber-500 mr-2 mt-0.5'></i>
                                    <span>Contractor licenses and insurance</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-amber-500 mr-2 mt-0.5'></i>
                                    <span>Developer experience portfolio</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-amber-500 mr-2 mt-0.5'></i>
                                    <span>Feasibility study and comps for ARV</span>
                                </li>
                                <li class="flex items-start">
                                    <i class='bx bx-file text-amber-500 mr-2 mt-0.5'></i>
                                    <span>Draw schedule request</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-2">
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                        <h3 class="text-xl font-semibold mb-6">Email vs. Portal Application Methods</h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="border border-gray-200 rounded-lg p-5">
                                <div class="flex items-center mb-4">
                                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <i class='bx bx-envelope text-blue-600 text-xl'></i>
                                    </div>
                                    <h4 class="text-lg font-medium">Email Application</h4>
                                </div>
                                
                                <div class="space-y-3 text-sm text-gray-600">
                                    <div class="flex items-start">
                                        <i class='bx bx-plus-circle text-green-500 mr-2 mt-0.5'></i>
                                        <span><strong>Pro:</strong> Familiar and accessible to most clients</span>
                                    </div>
                                    <div class="flex items-start">
                                        <i class='bx bx-plus-circle text-green-500 mr-2 mt-0.5'></i>
                                        <span><strong>Pro:</strong> No new systems to learn</span>
                                    </div>
                                    <div class="flex items-start">
                                        <i class='bx bx-plus-circle text-green-500 mr-2 mt-0.5'></i>
                                        <span><strong>Pro:</strong> Easy to communicate about application status</span>
                                    </div>
                                    <div class="flex items-start">
                                        <i class='bx bx-minus-circle text-red-500 mr-2 mt-0.5'></i>
                                        <span><strong>Con:</strong> Document management can be disorganized</span>
                                    </div>
                                    <div class="flex items-start">
                                        <i class='bx bx-minus-circle text-red-500 mr-2 mt-0.5'></i>
                                        <span><strong>Con:</strong> Less secure for sensitive information</span>
                                    </div>
                                    <div class="flex items-start">
                                        <i class='bx bx-minus-circle text-red-500 mr-2 mt-0.5'></i>
                                        <span><strong>Con:</strong> Manual tracking of application status</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="border border-gray-200 rounded-lg p-5">
                                <div class="flex items-center mb-4">
                                    <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                        <i class='bx bx-globe text-purple-600 text-xl'></i>
                                    </div>
                                    <h4 class="text-lg font-medium">Portal Application</h4>
                                </div>
                                
                                <div class="space-y-3 text-sm text-gray-600">
                                    <div class="flex items-start">
                                        <i class='bx bx-plus-circle text-green-500 mr-2 mt-0.5'></i>
                                        <span><strong>Pro:</strong> Centralized document management</span>
                                    </div>
                                    <div class="flex items-start">
                                        <i class='bx bx-plus-circle text-green-500 mr-2 mt-0.5'></i>
                                        <span><strong>Pro:</strong> Enhanced security for sensitive information</span>
                                    </div>
                                    <div class="flex items-start">
                                        <i class='bx bx-plus-circle text-green-500 mr-2 mt-0.5'></i>
                                        <span><strong>Pro:</strong> Automated status updates and notifications</span>
                                    </div>
                                    <div class="flex items-start">
                                        <i class='bx bx-plus-circle text-green-500 mr-2 mt-0.5'></i>
                                        <span><strong>Pro:</strong> Standardized process reduces errors</span>
                                    </div>
                                    <div class="flex items-start">
                                        <i class='bx bx-minus-circle text-red-500 mr-2 mt-0.5'></i>
                                        <span><strong>Con:</strong> Learning curve for new users</span>
                                    </div>
                                    <div class="flex items-start">
                                        <i class='bx bx-minus-circle text-red-500 mr-2 mt-0.5'></i>
                                        <span><strong>Con:</strong> Technical issues can cause delays</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 class="text-xl font-semibold mb-6">Document Signing & Process Flow</h3>
                        
                        <div class="relative">
                            <!-- Process Timeline -->
                            <div class="hidden md:block absolute left-[15px] top-0 bottom-0 w-0.5 bg-gray-200"></div>
                            
                            <div class="space-y-8">
                                <div class="relative flex items-start">
                                    <div class="hidden md:flex h-8 w-8 rounded-full bg-blue-100 text-blue-600 items-center justify-center border-2 border-white shadow relative z-10">
                                        <span class="text-sm font-medium">1</span>
                                    </div>
                                    <div class="md:ml-6 bg-gray-50 rounded-lg p-4 w-full">
                                        <h4 class="text-lg font-medium mb-2">Initial Application & Documentation</h4>
                                        <p class="text-sm text-gray-600 mb-3">Broker works with client to gather necessary documentation based on loan type. This can be facilitated through:</p>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            <div class="flex items-start">
                                                <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                                                <span>Email communication with PDF attachments</span>
                                            </div>
                                            <div class="flex items-start">
                                                <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                                                <span>Secure document upload portal</span>
                                            </div>
                                            <div class="flex items-start">
                                                <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                                                <span>Digital application forms</span>
                                            </div>
                                            <div class="flex items-start">
                                                <i class='bx bx-check-circle text-green-500 mr-2 mt-0.5'></i>
                                                <span>Cloud storage solutions (Dropbox, Google Drive)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="relative flex items-start">
                                    <div class="hidden md:flex h-8 w-8 rounded-full bg-blue-100 text-blue-600 items-center justify-center border-2 border-white shadow relative z-10">
                                        <span class="text-sm font-medium">2</span>
                                    </div>
                                    <div class="md:ml-6 bg-gray-50 rounded-lg p-4 w-full">
                                        <h4 class="text-lg font-medium mb-2">Document Signing Solutions</h4>
                                        <p class="text-sm text-gray-600 mb-3">For documents requiring signatures, electronic signing platforms streamline the process:</p>
                                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div class="border border-gray-200 rounded-lg p-3">
                                                <div class="font-medium mb-2">DocuSign</div>
                                                <p class="text-gray-600 text-xs">Most widely used platform with robust features for document routing and status tracking.</p>
                                            </div>
                                            <div class="border border-gray-200 rounded-lg p-3">
                                                <div class="font-medium mb-2">Adobe Sign</div>
                                                <p class="text-gray-600 text-xs">Integrated with Adobe PDF ecosystem, offering secure, legally-binding signatures.</p>
                                            </div>
                                            <div class="border border-gray-200 rounded-lg p-3">
                                                <div class="font-medium mb-2">HelloSign</div>
                                                <p class="text-gray-600 text-xs">User-friendly interface with templates and team management features.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="relative flex items-start">
                                    <div class="hidden md:flex h-8 w-8 rounded-full bg-blue-100 text-blue-600 items-center justify-center border-2 border-white shadow relative z-10">
                                        <span class="text-sm font-medium">3</span>
                                    </div>
                                    <div class="md:ml-6 bg-gray-50 rounded-lg p-4 w-full">
                                        <h4 class="text-lg font-medium mb-2">Broker's Role in Application Assistance</h4>
                                        <p class="text-sm text-gray-600 mb-3">A broker can help clients through the process by:</p>
                                        <ul class="space-y-2 text-sm">
                                            <li class="flex items-start">
                                                <i class='bx bx-chevron-right text-blue-500 mr-1 mt-0.5'></i>
                                                <span>Pre-filling application forms with known information</span>
                                            </li>
                                            <li class="flex items-start">
                                                <i class='bx bx-chevron-right text-blue-500 mr-1 mt-0.5'></i>
                                                <span>Reviewing documentation for completeness before submission</span>
                                            </li>
                                            <li class="flex items-start">
                                                <i class='bx bx-chevron-right text-blue-500 mr-1 mt-0.5'></i>
                                                <span>Explaining complex terms and requirements to clients</span>
                                            </li>
                                            <li class="flex items-start">
                                                <i class='bx bx-chevron-right text-blue-500 mr-1 mt-0.5'></i>
                                                <span>Acting as liaison between client and lender</span>
                                            </li>
                                            <li class="flex items-start">
                                                <i class='bx bx-chevron-right text-blue-500 mr-1 mt-0.5'></i>
                                                <span>Tracking application status and following up on requirements</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div class="relative flex items-start">
                                    <div class="hidden md:flex h-8 w-8 rounded-full bg-blue-100 text-blue-600 items-center justify-center border-2 border-white shadow relative z-10">
                                        <span class="text-sm font-medium">4</span>
                                    </div>
                                    <div class="md:ml-6 bg-gray-50 rounded-lg p-4 w-full">
                                        <h4 class="text-lg font-medium mb-2">Submission to Closing Timeline</h4>
                                        <p class="text-sm text-gray-600 mb-3">The typical hard money loan process from submission to closing includes:</p>
                                        <div class="relative overflow-x-auto">
                                            <table class="w-full text-sm">
                                                <tbody>
                                                    <tr class="border-b border-gray-200">
                                                        <td class="py-2 pr-4 font-medium whitespace-nowrap">Days 1-2</td>
                                                        <td class="py-2">Application review and initial underwriting</td>
                                                    </tr>
                                                    <tr class="border-b border-gray-200">
                                                        <td class="py-2 pr-4 font-medium whitespace-nowrap">Days 3-7</td>
                                                        <td class="py-2">Appraisal ordered and completed</td>
                                                    </tr>
                                                    <tr class="border-b border-gray-200">
                                                        <td class="py-2 pr-4 font-medium whitespace-nowrap">Days 7-10</td>
                                                        <td class="py-2">Underwriting review and conditional approval</td>
                                                    </tr>
                                                    <tr class="border-b border-gray-200">
                                                        <td class="py-2 pr-4 font-medium whitespace-nowrap">Days 10-12</td>
                                                        <td class="py-2">Conditions satisfied by borrower</td>
                                                    </tr>
                                                    <tr class="border-b border-gray-200">
                                                        <td class="py-2 pr-4 font-medium whitespace-nowrap">Days 12-14</td>
                                                        <td class="py-2">Final approval and loan docs prepared</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="py-2 pr-4 font-medium whitespace-nowrap">Days 14-21</td>
                                                        <td class="py-2">Closing and funding</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <p class="text-xs text-gray-500 mt-3">Note: Timeline can vary based on complexity of the deal, responsiveness of the borrower, and lender workload.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="lender-process" class="mb-16">
            <div class="border-b border-gray-200 pb-5 mb-8">
                <h2 class="text-3xl font-bold">4. Lender's Process: Quote to Funding</h2>
                <p class="text-gray-600 mt-2">Understanding the 12 key steps from initial quote to successful loan funding.</p>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <div class="p-6 border-b md:border-r border-gray-100">
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span class="font-semibold text-blue-600">1</span>
                            </div>
                            <h3 class="text-xl font-semibold">Quote</h3>
                        </div>
                        <p class="text-gray-600 mb-3">Get multiple quotes and negotiate terms with different lenders to find the best fit for your project.</p>
                        <div class="text-sm text-gray-500">
                            <div class="flex items-start mb-2">
                                <i class='bx bx-time-five mr-2 mt-0.5'></i>
                                <span>Typically 24-48 hours</span>
                            </div>
                            <div class="flex items-start">
                                <i class='bx bx-user mr-2 mt-0.5'></i>
                                <span>Handled by loan officers or account executives</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 border-b md:border-r lg:border-r-0 border-gray-100">
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span class="font-semibold text-blue-600">2</span>
                            </div>
                            <h3 class="text-xl font-semibold">Submission</h3>
                        </div>
                        <p class="text-gray-600 mb-3">Provide the lender with all required documents for initial processing and review.</p>
                        <div class="text-sm text-gray-500">
                            <div class="flex items-start mb-2">
                                <i class='bx bx-file mr-2 mt-0.5'></i>
                                <span>Complete application package</span>
                            </div>
                            <div class="flex items-start">
                                <i class='bx bx-check-shield mr-2 mt-0.5'></i>
                                <span>Initial compliance review</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 border-b lg:border-r border-gray-100">
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span class="font-semibold text-blue-600">3</span>
                            </div>
                            <h3 class="text-xl font-semibold">Appraisal Ordered</h3>
                        </div>
                        <p class="text-gray-600 mb-3">Borrower receives a secure payment link to cover the cost of property appraisal.</p>
                        <div class="text-sm text-gray-500">
                            <div class="flex items-start mb-2">
                                <i class='bx bx-building-house mr-2 mt-0.5'></i>
                                <span>Professional valuation of property</span>
                            </div>
                            <div class="flex items-start">
                                <i class='bx bx-calendar mr-2 mt-0.5'></i>
                                <span>Typically takes 3-7 days to complete</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 border-b md:border-r border-gray-100">
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span class="font-semibold text-blue-600">4</span>
                            </div>
                            <h3 class="text-xl font-semibold">Account Exec Review</h3>
                        </div>
                        <p class="text-gray-600 mb-3">Loan package is reviewed for completeness before submission to underwriting.</p>
                        <div class="text-sm text-gray-500">
                            <div class="flex items-start mb-2">
                                <i class='bx bx-search mr-2 mt-0.5'></i>
                                <span>Identification of any missing documents</span>
                            </div>
                            <div class="flex items-start">
                                <i class='bx bx-conversation mr-2 mt-0.5'></i>
                                <span>Communication with broker/borrower as needed</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 border-b md:border-r lg:border-r-0 border-gray-100">
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span class="font-semibold text-blue-600">5</span>
                            </div>
                            <h3 class="text-xl font-semibold">Underwriting Review</h3>
                        </div>
                        <p class="text-gray-600 mb-3">Detailed analysis of the loan application, property, and borrower profile begins.</p>
                        <div class="text-sm text-gray-500">
                            <div class="flex items-start mb-2">
                                <i class='bx bx-analyse mr-2 mt-0.5'></i>
                                <span>Risk assessment and feasibility analysis</span>
                            </div>
                            <div class="flex items-start">
                                <i class='bx bx-money mr-2 mt-0.5'></i>
                                <span>Verification of financial information</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 border-b lg:border-r border-gray-100">
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span class="font-semibold text-blue-600">6</span>
                            </div>
                            <h3 class="text-xl font-semibold">Conditions</h3>
                        </div>
                        <p class="text-gray-600 mb-3">Additional requests from the lender may arise to address specific concerns or requirements.</p>
                        <div class="text-sm text-gray-500">
                            <div class="flex items-start mb-2">
                                <i class='bx bx-list-check mr-2 mt-0.5'></i>
                                <span>Specific documentation requests</span>
                            </div>
                            <div class="flex items-start">
                                <i class='bx bx-message-detail mr-2 mt-0.5'></i>
                                <span>Clarifications on project specifics</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 border-b md:border-r border-gray-100">
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span class="font-semibold text-blue-600">7</span>
                            </div>
                            <h3 class="text-xl font-semibold">Docs to Title</h3>
                        </div>
                        <p class="text-gray-600 mb-3">Lender sends documents to title company for closing preparation and final review.</p>
                        <div class="text-sm text-gray-500">
                            <div class="flex items-start mb-2">
                                <i class='bx bx-file-find mr-2 mt-0.5'></i>
                                <span>Title search and clearance</span>
                            </div>
                            <div class="flex items-start">
                                <i class='bx bx-notepad mr-2 mt-0.5'></i>
                                <span>Preparation of closing documentation</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 border-b md:border-r lg:border-r-0 border-gray-100">
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span class="font-semibold text-blue-600">8</span>
                            </div>
                            <h3 class="text-xl font-semibold">Final Review</h3>
                        </div>
                        <p class="text-gray-600 mb-3">Comprehensive review of all documentation and fulfillment of conditions by the lender.</p>
                        <div class="text-sm text-gray-500">
                            <div class="flex items-start mb-2">
                                <i class='bx bx-check-double mr-2 mt-0.5'></i>
                                <span>Verification of all conditions met</span>
                            </div>
                            <div class="flex items-start">
                                <i class='bx bx-detail mr-2 mt-0.5'></i>
                                <span>Final compliance check</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 border-b lg:border-r border-gray-100">
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span class="font-semibold text-blue-600">9</span>
                            </div>
                            <h3 class="text-xl font-semibold">Title & Lender Confirm</h3>
                        </div>
                        <p class="text-gray-600 mb-3">Title company and lender confirm all closing documents are correct and ready for signing.</p>
                        <div class="text-sm text-gray-500">
                            <div class="flex items-start mb-2">
                                <i class='bx bx-revision mr-2 mt-0.5'></i>
                                <span>Final document review</span>
                            </div>
                            <div class="flex items-start">
                                <i class='bx bx-calendar-check mr-2 mt-0.5'></i>
                                <span>Scheduling of closing appointment</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 border-b md:border-r border-gray-100">
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                <span class="font-semibold text-green-600">10</span>
                            </div>
                            <h3 class="text-xl font-semibold">Clear to Close (CTC)</h3>
                        </div>
                        <p class="text-gray-600 mb-3">Official approval is issued indicating the loan is ready to proceed to closing.</p>
                        <div class="text-sm text-gray-500">
                            <div class="flex items-start mb-2">
                                <i class='bx bx-badge-check mr-2 mt-0.5'></i>
                                <span>Final approval from underwriting</span>
                            </div>
                            <div class="flex items-start">
                                <i class='bx bx-notification mr-2 mt-0.5'></i>
                                <span>Notification to all parties</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 border-b md:border-r lg:border-r-0 border-gray-100">
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                <span class="font-semibold text-green-600">11</span>
                            </div>
                            <h3 class="text-xl font-semibold">Borrower Signs</h3>
                        </div>
                        <p class="text-gray-600 mb-3">Borrower attends closing appointment to sign all loan documents and closing paperwork.</p>
                        <div class="text-sm text-gray-500">
                            <div class="flex items-start mb-2">
                                <i class='bx bx-edit mr-2 mt-0.5'></i>
                                <span>Execution of all required documents</span>
                            </div>
                            <div class="flex items-start">
                                <i class='bx bx-transfer mr-2 mt-0.5'></i>
                                <span>Transfer of down payment funds</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                <span class="font-semibold text-green-600">12</span>
                            </div>
                            <h3 class="text-xl font-semibold">Funding</h3>
                        </div>
                        <p class="text-gray-600 mb-3">Loan is funded, property ownership transfers, and brokers receive their commission.</p>
                        <div class="text-sm text-gray-500">
                            <div class="flex items-start mb-2">
                                <i class='bx bx-money-withdraw mr-2 mt-0.5'></i>
                                <span>Disbursement of loan funds</span>
                            </div>
                            <div class="flex items-start">
                                <i class='bx bx-party mr-2 mt-0.5'></i>
                                <span>Completion of transaction</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 class="text-xl font-semibold mb-4">Timeline Considerations</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white p-4 rounded-lg shadow-sm">
                        <div class="flex items-center mb-3">
                            <i class='bx bx-time text-blue-500 text-xl mr-2'></i>
                            <h4 class="font-medium">Standard Timeline</h4>
                        </div>
                        <p class="text-sm text-gray-600">A typical hard money loan can close in <strong>7-14 days</strong> from complete submission, compared to 30-45 days for conventional financing.</p>
                    </div>
                    
                    <div class="bg-white p-4 rounded-lg shadow-sm">
                        <div class="flex items-center mb-3">
                            <i class='bx bx-bolt-circle text-amber-500 text-xl mr-2'></i>
                            <h4 class="font-medium">Expedited Processing</h4>
                        </div>
                        <p class="text-sm text-gray-600">Some lenders offer expedited processing for an additional fee, allowing closings in as little as <strong>3-5 days</strong> for time-sensitive deals.</p>
                    </div>
                    
                    <div class="bg-white p-4 rounded-lg shadow-sm">
                        <div class="flex items-center mb-3">
                            <i class='bx bx-error-circle text-red-500 text-xl mr-2'></i>
                            <h4 class="font-medium">Common Delays</h4>
                        </div>
                        <p class="text-sm text-gray-600">Delays typically occur due to incomplete documentation, title issues, appraisal discrepancies, or complex property conditions.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="broker-clients" class="mb-16">
            <div class="border-b border-gray-200 pb-5 mb-8">
                <h2 class="text-3xl font-bold">5. Finding New Clients as a Broker</h2>
                <p class="text-gray-600 mt-2">Effective strategies for brokers to source and qualify hard money loan clients.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                        <h3 class="text-xl font-semibold mb-6">Social Media Strategies</h3>
                        
                        <div class="space-y-6">
                            <div class="flex items-start">
                                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                    <i class='bx bxl-facebook text-blue-600 text-xl'></i>
                                </div>
                                <div>
                                    <h4 class="font-medium mb-1">Facebook Groups</h4>
                                    <p class="text-sm text-gray-600 mb-2">Join and actively participate in real estate investing groups where your target clients gather.</p>
                                    <div class="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                        <strong>Pro Tip:</strong> Focus on providing value through answering questions rather than obvious self-promotion.
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex items-start">
                                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center mr-4">
                                    <i class='bx bxl-linkedin text-sky-600 text-xl'></i>
                                </div>
                                <div>
                                    <h4 class="font-medium mb-1">LinkedIn</h4>
                                    <p class="text-sm text-gray-600 mb-2">Create and share educational content about hard money lending terms, processes, and success stories.</p>
                                    <div class="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                        <strong>Pro Tip:</strong> Connect with real estate attorneys, CPAs, and other professionals who can refer clients.
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex items-start">
                                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center mr-4">
                                    <i class='bx bxl-instagram text-rose-600 text-xl'></i>
                                </div>
                                <div>
                                    <h4 class="font-medium mb-1">Instagram</h4>
                                    <p class="text-sm text-gray-600 mb-2">Showcase successfully funded projects with before/after photos and client testimonials.</p>
                                    <div class="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                        <strong>Pro Tip:</strong> Use relevant hashtags like #realestateinvesting, #fixandflip, and #hardmoneylending.
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex items-start">
                                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                    <i class='bx bxl-tiktok text-black text-xl'></i>
                                </div>
                                <div>
                                    <h4 class="font-medium mb-1">TikTok & YouTube</h4>
                                    <p class="text-sm text-gray-600 mb-2">Create short, educational videos explaining lending concepts or showcasing successful deals.</p>
                                    <div class="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                        <strong>Pro Tip:</strong> Keep videos concise, focusing on one key point per video for maximum engagement.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                        <h3 class="text-xl font-semibold mb-6">Networking Partners</h3>
                        
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="border border-gray-200 rounded-lg p-4">
                                <div class="flex items-center mb-3">
                                    <div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                                        <i class='bx bx-home text-amber-600'></i>
                                    </div>
                                    <h4 class="font-medium">Real Estate Agents</h4>
                                </div>
                                <p class="text-sm text-gray-600">Build relationships with agents who work with investors or specialize in distressed properties.</p>
                            </div>
                            
                            <div class="border border-gray-200 rounded-lg p-4">
                                <div class="flex items-center mb-3">
                                    <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <i class='bx bx-building-house text-blue-600'></i>
                                    </div>
                                    <h4 class="font-medium">Title Companies</h4>
                                </div>
                                <p class="text-sm text-gray-600">Establish relationships with escrow officers who can refer clients needing alternative financing.</p>
                            </div>
                            
                            <div class="border border-gray-200 rounded-lg p-4">
                                <div class="flex items-center mb-3">
                                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                        <i class='bx bx-group text-purple-600'></i>
                                    </div>
                                    <h4 class="font-medium">Investor Groups</h4>
                                </div>
                                <p class="text-sm text-gray-600">Attend local REI meetings and offer to speak about hard money financing options.</p>
                            </div>
                            
                            <div class="border border-gray-200 rounded-lg p-4">
                                <div class="flex items-center mb-3">
                                    <div class="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                                        <i class='bx bx-buildings text-teal-600'></i>
                                    </div>
                                    <h4 class="font-medium">Contractors</h4>
                                </div>
                                <p class="text-sm text-gray-600">Connect with renovation specialists who work with investors on fix and flip projects.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 class="text-xl font-semibold mb-6">Marketing Approaches</h3>
                        
                        <div class="space-y-4">
                            <div class="flex items-start">
                                <div class="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                    <i class='bx bx-target-lock text-green-600'></i>
                                </div>
                                <div>
                                    <h4 class="font-medium mb-1">Targeted Ads</h4>
                                    <p class="text-sm text-gray-600">Run geographically targeted ads focusing on areas with high investor activity or distressed properties.</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start">
                                <div class="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                                    <i class='bx bx-podcast text-red-600'></i>
                                </div>
                                <div>
                                    <h4 class="font-medium mb-1">Content Marketing</h4>
                                    <p class="text-sm text-gray-600">Create blogs, podcasts, or webinars explaining hard money lending for specific investment strategies.</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start">
                                <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                    <i class='bx bx-envelope text-indigo-600'></i>
                                </div>
                                <div>
                                    <h4 class="font-medium mb-1">Email Campaigns</h4>
                                    <p class="text-sm text-gray-600">Send targeted newsletters with market updates, success stories, and special lending programs.</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start">
                                <div class="flex-shrink-0 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                                    <i class='bx bx-mail-send text-amber-600'></i>
                                </div>
                                <div>
                                    <h4 class="font-medium mb-1">Direct Mail</h4>
                                    <p class="text-sm text-gray-600">Target property owners in pre-foreclosure or with high equity who might need financing options.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 class="text-xl font-semibold mb-6">Best Practices for Client Acquisition</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="flex items-start">
                        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                            <i class='bx bx-rocket text-blue-600 text-xl'></i>
                        </div>
                        <div>
                            <h4 class="font-medium mb-2">Focus on Niche Programs</h4>
                            <p class="text-sm text-gray-600">Highlight specialized lending programs you offer that solve specific investor problems or serve underserved markets.</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4 mt-1">
                            <i class='bx bx-bulb text-green-600 text-xl'></i>
                        </div>
                        <div>
                            <h4 class="font-medium mb-2">Educate, Don't Just Sell</h4>
                            <p class="text-sm text-gray-600">Position yourself as a knowledgeable resource who helps investors understand their financing options and make informed decisions.</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-4 mt-1">
                            <i class='bx bx-filter-alt text-purple-600 text-xl'></i>
                        </div>
                        <div>
                            <h4 class="font-medium mb-2">Chase Real Deals</h4>
                            <p class="text-sm text-gray-600">Qualify prospects early to focus your time on feasible deals rather than impossible scenarios that will never fund.</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-4 mt-1">
                            <i class='bx bx-message-square-detail text-red-600 text-xl'></i>
                        </div>
                        <div>
                            <h4 class="font-medium mb-2">Move Conversations Private</h4>
                            <p class="text-sm text-gray-600">After initial public engagement on social platforms, move serious prospects to direct messages or calls to discuss specifics.</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mr-4 mt-1">
                            <i class='bx bx-timer text-amber-600 text-xl'></i>
                        </div>
                        <div>
                            <h4 class="font-medium mb-2">Leverage Responsiveness</h4>
                            <p class="text-sm text-gray-600">In a fast-paced investment environment, quick response times can be your competitive advantage in winning clients.</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start">
                        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center mr-4 mt-1">
                            <i class='bx bx-refresh text-teal-600 text-xl'></i>
                        </div>
                        <div>
                            <h4 class="font-medium mb-2">Nurture Past Clients</h4>
                            <p class="text-sm text-gray-600">Maintain relationships with previous borrowers who are likely to need financing for future projects or provide referrals.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="glossary" class="mb-16">
            <div class="border-b border-gray-200 pb-5 mb-8">
                <h2 class="text-3xl font-bold">6. Hard Money Lending Glossary</h2>
                <p class="text-gray-600 mt-2">Essential terminology for navigating the hard money lending landscape.</p>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div class="mb-6">
                    <div class="relative">
                        <input type="text" class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Search terms..." id="glossary-search">
                        <div class="absolute left-3 top-3 text-gray-400">
                            <i class='bx bx-search text-xl'></i>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="glossary-terms">
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">After-Repair Value (ARV)</h3>
                        <p class="text-gray-600 text-sm">The estimated value of a property after all renovations and repairs have been completed. Used to determine loan amounts for fix-and-flip loans.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">As-Is Value (AIV)</h3>
                        <p class="text-gray-600 text-sm">The current market value of a property in its present condition without any repairs or renovations.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">Balloon Payment</h3>
                        <p class="text-gray-600 text-sm">A large, lump-sum payment due at the end of a loan term. Most hard money loans have balloon payments rather than fully amortizing over the loan term.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">BRRRR</h3>
                        <p class="text-gray-600 text-sm">Buy, Rehab, Rent, Refinance, Repeat. An investment strategy for building a rental portfolio by leveraging equity created through rehabilitation.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">Clear to Close (CTC)</h3>
                        <p class="text-gray-600 text-sm">Final approval from a lender indicating that all loan conditions have been satisfied and the loan is ready to proceed to closing.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">Cross-Collateralization</h3>
                        <p class="text-gray-600 text-sm">Using multiple properties as collateral for a single loan, or using one property as collateral for multiple loans.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">Debt Service Coverage Ratio (DSCR)</h3>
                        <p class="text-gray-600 text-sm">The ratio of net operating income to debt service, used to measure a property's ability to cover its debt payments through income generation.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">Draw Schedule</h3>
                        <p class="text-gray-600 text-sm">A predetermined plan for distributing construction loan funds in stages as specific project milestones are completed.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">Dutch Interest</h3>
                        <p class="text-gray-600 text-sm">Interest calculated on the full loan amount for the entire term, regardless of early repayment. Non-Dutch interest is calculated only on the outstanding balance.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">Extension Fee</h3>
                        <p class="text-gray-600 text-sm">A fee charged by lenders to extend the term of a loan beyond its original maturity date.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">Interest-Only (IO) Payment</h3>
                        <p class="text-gray-600 text-sm">A payment that covers only the interest portion of a loan without reducing the principal balance. Common in hard money loans.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">Loan-to-Cost (LTC)</h3>
                        <p class="text-gray-600 text-sm">The ratio of the loan amount to the total cost of a project, including purchase price and renovation expenses.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">Loan-to-Value (LTV)</h3>
                        <p class="text-gray-600 text-sm">The ratio of the loan amount to the appraised value of the property used as collateral.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">Origination Fee</h3>
                        <p class="text-gray-600 text-sm">A fee charged by lenders for processing a new loan application, typically 1-3 points of the loan amount (1 point = 1%).</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">Prepayment Penalty (PPP)</h3>
                        <p class="text-gray-600 text-sm">A fee charged for paying off a loan before its scheduled maturity date. May be structured as a percentage or fixed amount.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">Rehab Budget</h3>
                        <p class="text-gray-600 text-sm">A detailed estimate of all costs associated with renovating a property, including materials, labor, permits, and contingency funds.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">Scope of Work (SOW)</h3>
                        <p class="text-gray-600 text-sm">A detailed document outlining all renovation work to be completed on a property, including specifications and timeline.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">Seasoning Period</h3>
                        <p class="text-gray-600 text-sm">The minimum time a borrower must own a property before certain financing options become available, typically relevant for refinancing.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">Title Insurance</h3>
                        <p class="text-gray-600 text-sm">Insurance that protects the lender and/or owner against losses arising from defects in the title to the property.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">Underwriting</h3>
                        <p class="text-gray-600 text-sm">The process of evaluating a loan application to determine the risk of lending, including assessment of the borrower, property, and project feasibility.</p>
                    </div>
                    
                    <div class="glossary-item">
                        <h3 class="text-lg font-semibold text-blue-700 mb-2">Yield Spread</h3>
                        <p class="text-gray-600 text-sm">The difference between the interest rate charged to a borrower and the rate paid to investors or the lender's cost of funds.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="mb-16">
            <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div class="grid grid-cols-1 md:grid-cols-2">
                    <div class="p-8 md:p-10">
                        <h2 class="text-2xl font-bold mb-4">Take Your Hard Money Lending Knowledge to the Next Level</h2>
                        <p class="text-gray-600 mb-6">Subscribe to our newsletter for the latest market insights, lending opportunities, and exclusive resources for real estate investors and brokers.</p>
                        
                        <form id="subscribe-form" class="space-y-4">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" id="name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input type="email" id="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label for="interest" class="block text-sm font-medium text-gray-700 mb-1">Primary Interest</label>
                                <select id="interest" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">Select an option</option>
                                    <option value="fix-flip">Fix & Flip</option>
                                    <option value="dscr">DSCR / Rental Properties</option>
                                    <option value="construction">New Construction</option>
                                    <option value="broker">I'm a Broker</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <button type="submit" class="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition">Subscribe Now</button>
                            </div>
                        </form>
                    </div>
                    <div class="relative h-64 md:h-auto">
                        <img src="https://r2.flowith.net/files/5e7995ef-ffd4-42e4-ba01-2ae2fa9fc8f1/1742098575698-A_deta.jpeg" alt="Real Estate Investment" class="absolute inset-0 w-full h-full object-cover">
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                <div>
                    <h3 class="text-lg font-semibold mb-4">Hard Money Lending Masterclass</h3>
                    <p class="text-gray-400 text-sm">Your comprehensive resource for understanding hard money lending for real estate investment.</p>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul class="space-y-2 text-sm text-gray-400">
                        <li><a href="#loan-types" class="hover:text-white transition">Loan Types</a></li>
                        <li><a href="#quote-process" class="hover:text-white transition">Quote Process</a></li>
                        <li><a href="#loan-application" class="hover:text-white transition">Loan Application</a></li>
                        <li><a href="#lender-process" class="hover:text-white transition">Lender Process</a></li>
                        <li><a href="#broker-clients" class="hover:text-white transition">Finding Clients</a></li>
                        <li><a href="#glossary" class="hover:text-white transition">Glossary</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-4">Resources</h3>
                    <ul class="space-y-2 text-sm text-gray-400">
                        <li><a href="#" class="hover:text-white transition">Blog</a></li>
                        <li><a href="#" class="hover:text-white transition">Calculators</a></li>
                        <li><a href="#" class="hover:text-white transition">Market Reports</a></li>
                        <li><a href="#" class="hover:text-white transition">Webinars</a></li>
                        <li><a href="#" class="hover:text-white transition">Success Stories</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="text-lg font-semibold mb-4">Contact</h3>
                    <ul class="space-y-2 text-sm text-gray-400">
                        <li class="flex items-start">
                            <i class='bx bx-envelope mr-2 mt-1'></i>
                            <span>info@hardmoneymasterclass.com</span>
                        </li>
                        <li class="flex items-start">
                            <i class='bx bx-phone mr-2 mt-1'></i>
                            <span>(555) 123-4567</span>
                        </li>
                        <li class="flex items-start">
                            <i class='bx bx-map mr-2 mt-1'></i>
                            <span>123 Investment Ave, Suite 500<br>Austin, TX 78701</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div class="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                <p class="mb-4">© 2023 Hard Money Lending Masterclass. All rights reserved.</p>
                <p>Built with <a href="https://flowith.net" target="_blank" class="text-blue-400 hover:text-blue-300 transition">Flowith Oracle</a>.</p>
            </div>
        </div>
    </footer>

    <script src="script.js"></script>
    <script>
        window.addEventListener("wheel", (e)=> {
          const isPinching = e.ctrlKey
          if(isPinching) e.preventDefault()
        }, { passive: false })
    </script>
</body>
</html>

    </body>
    </html>
  `;

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
};

export default HardMoneyClass;
