import React, {useEffect } from "react";
import Header from "../components/hardMoneyClass/Header";  // ✅ Import Header here
import HeroSection from "../components/hardMoneyClass/HeroSection";
import LoanTypes from "../components/hardMoneyClass/LoanTypes";
import LenderProcess from "../components/hardMoneyClass/LenderProcess";
import QuoteProcess from "../components/hardMoneyClass/QuoteProcess";
import LoanApplication from "../components/hardMoneyClass/LoanApplication";
import BrokerClients from "../components/hardMoneyClass/BrokerClients";
import Glossary from "../components/hardMoneyClass/Glossary";
import SubscribeSection from "../components/hardMoneyClass/SubscribeSection";
import Footer from "../components/hardMoneyClass/Footer";  // ✅ Import Footer here

function HardMoneyClass() {
  useEffect(() => {
    // Add fade-in animation for sections as user scrolls
    const fadeInElements = document.querySelectorAll('section');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          fadeInObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    fadeInElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      fadeInObserver.observe(element);
    });

    return () => {
      fadeInObserver.disconnect();
    };
  }, []);

  return (
    <React.Fragment>
      <Header />
      <main style={{maxWidth: '80rem', margin: '0 auto', padding: '2.5rem 1rem'}}>
        <HeroSection />
        <LoanTypes />
        <QuoteProcess />
        <LoanApplication />
        <LenderProcess />
        <BrokerClients />
        <Glossary />
        <SubscribeSection />
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default HardMoneyClass;


