import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        
        {/* Left Section */}
        <div className="max-w-md">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full text-white">
                <path fill="currentColor" d="M12 3L1 9l11 6l9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z"/>
              </svg>
            </div>
            <h2 className="font-geist-mono text-xl font-bold">Hard Money Lending</h2>
          </div>
          <p className="text-gray-400">Comprehensive educational resources for real estate investors and brokers navigating the hard money lending landscape.</p>
        </div>

        {/* Right Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-gray-200 mb-4 font-semibold">Resources</h3>
            <ul className="text-gray-400">
              <li><Link to="/hard-money-class#loan-types" className="hover:text-gray-300">Loan Types</Link></li>
              <li><Link to="/hard-money-class#quote-process" className="hover:text-gray-300">Quote Process</Link></li>
              <li><Link to="/hard-money-class#loan-application" className="hover:text-gray-300">Application Process</Link></li>
              <li><Link to="/hard-money-class#glossary" className="hover:text-gray-300">Glossary</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-200 mb-4 font-semibold">For Brokers</h3>
            <ul className="text-gray-400">
              <li><Link to="/hard-money-class#broker-clients" className="hover:text-gray-300">Finding Clients</Link></li>
              <li><Link to="/hard-money-class#lender-process" className="hover:text-gray-300">Lender Process</Link></li>
              <li><Link to="#" className="hover:text-gray-300">Broker Resources</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-200 mb-4 font-semibold">About</h3>
            <ul className="text-gray-400">
              <li><Link to="#" className="hover:text-gray-300">Our Mission</Link></li>
              <li><Link to="#" className="hover:text-gray-300">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-gray-300">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-700 text-sm text-gray-400 flex flex-col sm:flex-row justify-between">
        <p>© {new Date().getFullYear()} Hard Money Lending Guide. All rights reserved.</p>
        <p>Built with <a href="https://flowith.net" target="_blank" rel="noopener noreferrer" className="text-blue-500">Flowith Oracle</a>.</p>
      </div>
    </footer>
  );
};

export default Footer;
