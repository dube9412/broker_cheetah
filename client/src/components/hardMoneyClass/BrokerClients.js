import React from 'react';

function StrategyCard({ icon, title, description, tips }) {
  return (
    <div className="card hover-card">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ 
          width: '2.5rem', 
          height: '2.5rem', 
          backgroundColor: '#f3f4f6',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '0.75rem'
        }}>
          <i className={`bx ${icon}`} style={{ color: '#3b82f6' }}></i>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{title}</h3>
      </div>
      <p style={{ color: '#4b5563', marginBottom: '1rem' }}>{description}</p>
      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>BEST PRACTICES:</h4>
      <ul style={{ color: '#4b5563' }}>
        {tips.map((tip, index) => (
          <li key={index} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
            <i className="bx bx-check" style={{ color: '#10b981', marginRight: '0.5rem', marginTop: '0.25rem' }}></i>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BrokerClients() {
  const strategies = [
    {
      icon: "bxl-facebook",
      title: "Social Media Marketing",
      description: "Leverage platforms like Facebook, LinkedIn, and Instagram to connect with potential clients and showcase your expertise.",
      tips: [
        "Join real estate investing groups and provide valuable insights",
        "Share success stories and case studies of funded deals",
        "Post about niche lending programs you specialize in",
        "Create educational content about hard money lending basics",
        "Use targeted ads to reach property investors in your area"
      ]
    },
    {
      icon: "bx-building-house",
      title: "Real Estate Agent Partnerships",
      description: "Build relationships with agents who work with investors and can refer clients looking for financing solutions.",
      tips: [
        "Offer lunch & learns to educate agents about hard money options",
        "Create co-branded marketing materials agents can share",
        "Help agents close deals their clients couldn't finance conventionally",
        "Attend local real estate agent networking events",
        "Provide quick pre-approval letters for their investor clients"
      ]
    },
    {
      icon: "bx-group",
      title: "Investor Networks",
      description: "Connect directly with real estate investors through local and online investment communities.",
      tips: [
        "Attend REI meetups and investment club meetings regularly",
        "Sponsor investor events to gain visibility",
        "Present workshops on creative financing strategies",
        "Join online forums and platforms like BiggerPockets",
        "Host webinars explaining hard money loan programs"
      ]
    },
    {
      icon: "bx-certification",
      title: "Title Company Relationships",
      description: "Develop connections with title companies who can refer investors needing alternative financing options.",
      tips: [
        "Bring lunch to title company staff to build relationships",
        "Offer to help with deals that are stuck due to financing issues",
        "Provide educational materials about your loan programs",
        "Be responsive when they send referrals your way",
        "Position yourself as their hard money lending expert"
      ]
    },
    {
      icon: "bx-target-lock",
      title: "Targeted Digital Marketing",
      description: "Implement focused online marketing strategies to attract qualified leads looking for hard money solutions.",
      tips: [
        "Create landing pages for specific investor pain points",
        "Use SEO to target local hard money loan searches",
        "Run Google Ads campaigns focusing on investor keywords",
        "Build email marketing sequences for lead nurturing",
        "Develop content addressing common investor questions"
      ]
    },
    {
      icon: "bx-podcast",
      title: "Content Marketing",
      description: "Establish yourself as an expert through valuable content that educates and attracts potential borrowers.",
      tips: [
        "Start a blog or podcast about real estate investing",
        "Create loan program comparison guides",
        "Develop case studies showcasing successful projects",
        "Write guest articles for real estate publications",
        "Share market insights and lending trend analysis"
      ]
    }
  ];

  return (
    <section id="broker-clients" className="section-container">
      <div className="centered-content">
        <h2>Finding Clients as a Broker</h2>
        <p>
          Successful hard money brokers employ multiple strategies to find and nurture relationships with real estate investors.
          These approaches help generate a steady stream of qualified leads.
        </p>
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {strategies.map((strategy, index) => (
          <StrategyCard
            key={index}
            icon={strategy.icon}
            title={strategy.title}
            description={strategy.description}
            tips={strategy.tips}
          />
        ))}
      </div>
      
      <div style={{ marginTop: '2rem' }} className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
          <i className="bx bx-bulb" style={{ color: '#eab308', marginRight: '0.5rem' }}></i>
          Client Acquisition Best Practices
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1rem' 
        }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f9fafb', 
            borderRadius: '0.5rem', 
            border: '1px solid #e5e7eb' 
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>BUILD YOUR REPUTATION</h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Focus on delivering excellent service to create advocates who will refer others. In hard money lending,
              your reputation for closing deals on time and as promised is your most valuable marketing asset.
            </p>
          </div>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f9fafb', 
            borderRadius: '0.5rem', 
            border: '1px solid #e5e7eb' 
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>CHASE REAL DEALS</h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Qualify leads early and focus your time on borrowers with viable projects and realistic expectations.
              Avoid spending excessive time on deals that don't match lender guidelines.
            </p>
          </div>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f9fafb', 
            borderRadius: '0.5rem', 
            border: '1px solid #e5e7eb' 
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>NURTURE RELATIONSHIPS</h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Build long-term relationships rather than focusing on one-time transactions.
              The most successful brokers have clients who return for multiple projects and refer others.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrokerClients;
