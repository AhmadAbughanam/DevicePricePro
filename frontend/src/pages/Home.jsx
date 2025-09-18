import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: '🧠',
      title: 'Smart AI Predictions',
      description: 'Advanced machine learning models trained on 50,000+ real device transactions provide accuracy rates above 94% for price forecasting.',
      highlight: 'Most Accurate'
    },
    {
      icon: '📁',
      title: 'Bulk Processing Power',
      description: 'Upload CSV files with thousands of devices and get comprehensive price analysis in minutes. Perfect for inventory management.',
      highlight: 'Time Saver'
    },
    {
      icon: '🔍',
      title: 'Transparent AI Insights',
      description: 'See exactly why the AI predicted each price with SHAP explanations. Understand which features drive value in the market.',
      highlight: 'Explainable'
    },
    {
      icon: '🛡️',
      title: 'Enterprise Security',
      description: 'Bank-level encryption, secure data handling, and compliance with privacy regulations. Your business data stays protected.',
      highlight: 'Trusted'
    },
    {
      icon: '⚡',
      title: 'Real-Time Results',
      description: 'Get predictions in under 200ms for single devices. Real-time API integration available for seamless workflow automation.',
      highlight: 'Lightning Fast'
    },
    {
      icon: '📈',
      title: 'Advanced Analytics',
      description: 'Track prediction history, analyze market trends, and export detailed reports. Make data-driven pricing decisions.',
      highlight: 'Professional'
    }
  ];

  const stats = [
    { label: 'Predictions Delivered', value: '50,000+', icon: '🎯', change: '+2,400 this month' },
    { label: 'Accuracy Rate', value: '94.7%', icon: '📊', change: 'Industry leading' },
    { label: 'Active Users', value: '1,200+', icon: '👥', change: 'Growing daily' },
    { label: 'Devices Supported', value: '2,500+', icon: '📱', change: 'Always expanding' }
  ];

  const useCases = [
    {
      title: 'Electronics Retailers',
      description: 'Price your inventory competitively and maximize profit margins with AI-powered market insights.',
      icon: '🏪',
      benefits: ['Optimal pricing strategy', 'Inventory valuation', 'Competitive analysis']
    },
    {
      title: 'Tech Resellers',
      description: 'Quickly assess device values for buying, selling, and trading decisions in the secondary market.',
      icon: '💼',
      benefits: ['Quick valuations', 'Trade assessments', 'Profit calculations']
    },
    {
      title: 'Insurance Companies',
      description: 'Accurately value devices for claims processing and coverage determinations with reliable AI predictions.',
      icon: '🛡️',
      benefits: ['Claims processing', 'Coverage assessment', 'Risk evaluation']
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Martinez',
      role: 'Electronics Store Owner',
      company: 'TechMart Plus',
      content: 'DevicePricePro transformed our pricing strategy. We increased margins by 18% while staying competitive. The bulk processing saves hours every week.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'David Kim',
      role: 'Tech Analyst',
      company: 'Digital Insights Corp',
      content: 'The explainable AI feature is incredible. I can finally understand market dynamics and present clear insights to my clients with confidence.',
      rating: 5,
      avatar: '👨‍💻'
    },
    {
      name: 'Lisa Thompson',
      role: 'E-commerce Manager',
      company: 'GadgetWorld',
      content: 'Processing our entire 5,000+ device catalog used to take weeks. Now it takes 10 minutes. The accuracy is remarkable - better than our internal team.',
      rating: 5,
      avatar: '👩‍💼'
    }
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'Forever',
      description: 'Perfect for trying out our platform',
      features: ['100 predictions/month', 'Basic analytics', 'Single device predictions', 'Email support'],
      cta: 'Start Free',
      popular: false
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'For serious business users',
      features: ['5,000 predictions/month', 'Bulk CSV processing', 'Advanced analytics', 'API access', 'Priority support'],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Contact us',
      description: 'For large organizations',
      features: ['Unlimited predictions', 'Custom integrations', 'Dedicated support', 'Custom models', 'SLA guarantee'],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Enhanced Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 50%, #f8f0ff 100%)',
        padding: '100px 20px 80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '200px',
          height: '200px',
          background: 'linear-gradient(45deg, #dbeafe, #e0e7ff)',
          borderRadius: '50%',
          opacity: 0.6,
          filter: 'blur(40px)'
        }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          {/* Trust badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#dbeafe',
            color: '#1d4ed8',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '32px'
          }}>
            ✨ Trusted by 1,200+ professionals worldwide
          </div>

          <h1 style={{
            fontSize: 'clamp(3rem, 5vw, 4.5rem)',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '24px',
            lineHeight: '1.1'
          }}>
            The Most Accurate
            <span style={{
              background: 'linear-gradient(to right, #2563eb, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block'
            }}>Device Price Predictions</span>
            Powered by AI
          </h1>
          
          <p style={{
            fontSize: '1.375rem',
            color: '#6b7280',
            marginBottom: '40px',
            maxWidth: '900px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            Stop guessing device values. Get instant, accurate price predictions with 94.7% accuracy. 
            Upload a CSV and analyze thousands of devices in minutes, or predict single device prices in real-time.
          </p>

          {/* Value proposition bullets */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '32px',
            marginBottom: '48px',
            fontSize: '16px',
            color: '#374151'
          }}>
            {['⚡ Results in <200ms', '🎯 94.7% Accuracy', '📊 Bulk Processing', '🔒 Enterprise Secure'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                {item}
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth < 640 ? 'column' : 'row',
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <Link
              to="/register"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '18px 36px',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: '600',
                textDecoration: 'none',
                boxShadow: '0 4px 6px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1d4ed8';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(37, 99, 235, 0.25)';
              }}
            >
              Start Predicting Free →
            </Link>
            
            <Link
              to="/login"
              style={{
                border: '2px solid #d1d5db',
                color: '#374151',
                padding: '16px 34px',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#2563eb';
                e.target.style.color = '#2563eb';
                e.target.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.color = '#374151';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Sign In
            </Link>
          </div>

          <p style={{ fontSize: '14px', color: '#9ca3af' }}>
            🎁 Free forever plan • No credit card required • 2-minute setup
          </p>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section style={{ padding: '80px 20px', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>
              Platform Performance
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              Real metrics from our active prediction platform
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px'
          }}>
            {stats.map(({ label, value, icon, change }, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                border: '1px solid #f3f4f6'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: '#dbeafe',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '28px'
                }}>
                  {icon}
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}>
                  {value}
                </div>
                <div style={{ color: '#374151', fontWeight: '600', marginBottom: '4px' }}>{label}</div>
                <div style={{ color: '#10b981', fontSize: '14px', fontWeight: '500' }}>{change}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section style={{ padding: '100px 20px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <h2 style={{
              fontSize: 'clamp(2.25rem, 3vw, 2.75rem)',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '20px'
            }}>
              Built for Your Industry
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Whether you're buying, selling, or insuring devices, our AI delivers the insights you need
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px'
          }}>
            {useCases.map(({ title, description, icon, benefits }, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: 'white',
                  padding: '40px',
                  borderRadius: '20px',
                  border: '2px solid #f3f4f6',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#93c5fd';
                  e.target.style.transform = 'translateY(-8px)';
                  e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#f3f4f6';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#dbeafe',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  fontSize: '32px'
                }}>
                  {icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '16px'
                }}>
                  {title}
                </h3>
                <p style={{ 
                  color: '#6b7280', 
                  lineHeight: '1.7', 
                  marginBottom: '24px',
                  fontSize: '1.125rem'
                }}>
                  {description}
                </p>
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>
                  {benefits.map((benefit, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      <span style={{ color: '#10b981' }}>✓</span>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section style={{ padding: '100px 20px', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{
              fontSize: 'clamp(2.25rem, 3vw, 2.75rem)',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '20px'
            }}>
              Everything You Need to Predict Prices
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Professional-grade tools designed for accuracy, speed, and ease of use
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px'
          }}>
            {features.map(({ icon, title, description, highlight }, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: 'white',
                  padding: '40px',
                  borderRadius: '20px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-8px)';
                  e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                  e.target.style.borderColor = '#93c5fd';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                  e.target.style.borderColor = '#e5e7eb';
                }}
              >
                {/* Highlight badge */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: '#fef3c7',
                  color: '#d97706',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {highlight}
                </div>

                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#dbeafe',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  fontSize: '32px'
                }}>
                  {icon}
                </div>
                <h3 style={{
                  fontSize: '1.375rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '16px'
                }}>
                  {title}
                </h3>
                <p style={{ 
                  color: '#6b7280', 
                  lineHeight: '1.7',
                  fontSize: '1rem'
                }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Pricing Section */}
      <section style={{ padding: '100px 20px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <h2 style={{
              fontSize: 'clamp(2.25rem, 3vw, 2.75rem)',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '20px'
            }}>
              Simple, Transparent Pricing
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Start free, upgrade when you need more. No hidden fees or surprises.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {pricingTiers.map(({ name, price, period, description, features, cta, popular }, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: 'white',
                  padding: '40px',
                  borderRadius: '20px',
                  border: popular ? '2px solid #2563eb' : '2px solid #f3f4f6',
                  position: 'relative',
                  transform: popular ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: popular ? '0 20px 40px rgba(37, 99, 235, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}
              >
                {popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '8px 24px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '8px'
                  }}>
                    {name}
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '16px' }}>{description}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                    <span style={{
                      fontSize: '3rem',
                      fontWeight: 'bold',
                      color: '#1f2937'
                    }}>
                      {price}
                    </span>
                    <span style={{ color: '#6b7280', fontSize: '1.125rem' }}>{period}</span>
                  </div>
                </div>

                <ul style={{ marginBottom: '32px', listStyle: 'none', padding: 0 }}>
                  {features.map((feature, i) => (
                    <li key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                      color: '#374151'
                    }}>
                      <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to={name === 'Enterprise' ? '/contact' : '/register'}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                    textAlign: 'center',
                    display: 'block',
                    transition: 'all 0.3s ease',
                    ...(popular ? {
                      backgroundColor: '#2563eb',
                      color: 'white'
                    } : {
                      backgroundColor: '#f8fafc',
                      color: '#374151',
                      border: '2px solid #e5e7eb'
                    })
                  }}
                  onMouseEnter={(e) => {
                    if (popular) {
                      e.target.style.backgroundColor = '#1d4ed8';
                    } else {
                      e.target.style.backgroundColor = '#f1f5f9';
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.color = '#2563eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (popular) {
                      e.target.style.backgroundColor = '#2563eb';
                    } else {
                      e.target.style.backgroundColor = '#f8fafc';
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.color = '#374151';
                    }
                  }}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section style={{ padding: '100px 20px', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <h2 style={{
              fontSize: 'clamp(2.25rem, 3vw, 2.75rem)',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '20px'
            }}>
              Trusted by Industry Leaders
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>
              See why professionals choose DevicePricePro for accurate pricing decisions
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '32px'
          }}>
            {testimonials.map(({ name, role, company, content, rating, avatar }, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '20px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                position: 'relative'
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ color: '#fbbf24', fontSize: '18px', marginBottom: '16px' }}>
                    {'★'.repeat(rating)}
                  </div>
                  <p style={{
                    color: '#374151',
                    fontSize: '1.125rem',
                    lineHeight: '1.7',
                    fontStyle: 'italic',
                    marginBottom: '24px'
                  }}>
                    "{content}"
                  </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#dbeafe',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    {avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#1f2937', fontSize: '1.125rem' }}>{name}</div>
                    <div style={{ color: '#6b7280' }}>{role}</div>
                    <div style={{ color: '#2563eb', fontSize: '14px', fontWeight: '600' }}>{company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section style={{
        padding: '100px 20px',
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }} />
        
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '24px',
            lineHeight: '1.2'
          }}>
            Ready to Transform Your Pricing Strategy?
          </h2>
          <p style={{
            fontSize: '1.375rem',
            color: '#bfdbfe',
            marginBottom: '48px',
            maxWidth: '700px',
            margin: '0 auto 48px',
            lineHeight: '1.6'
          }}>
            Join over 1,200 professionals who use DevicePricePro to make smarter, faster pricing decisions. 
            Start with our free plan and see the difference AI can make.
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth < 640 ? 'column' : 'row',
            gap: '24px',
            justifyContent: 'center',
            marginBottom: '32px'
          }}>
            <Link
              to="/register"
              style={{
                backgroundColor: 'white',
                color: '#2563eb',
                padding: '20px 40px',
                borderRadius: '12px',
                fontSize: '1.25rem',
                fontWeight: '700',
                textDecoration: 'none',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f8fafc';
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
              }}
            >
              Start Free Trial Now →
            </Link>
            <Link
              to="/login"
              style={{
                border: '2px solid rgba(255, 255, 255, 0.8)',
                color: 'white',
                padding: '18px 38px',
                borderRadius: '12px',
                fontSize: '1.25rem',
                fontWeight: '700',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.8)';
              }}
            >
              Sign In
            </Link>
          </div>

          {/* Trust indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '32px',
            flexWrap: 'wrap',
            color: '#bfdbfe',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              🛡️ Enterprise Secure
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚡ 99.9% Uptime
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              🎯 94.7% Accuracy
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer style={{ backgroundColor: '#1f2937', padding: '80px 20px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Main footer content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '48px',
            marginBottom: '48px'
          }}>
            {/* Brand section */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#2563eb',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  🎯
                </div>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  DevicePricePro
                </span>
              </div>
              <p style={{ 
                color: '#9ca3af', 
                marginBottom: '24px', 
                lineHeight: '1.6',
                fontSize: '1.125rem'
              }}>
                The most accurate AI-powered device price prediction platform. Trusted by professionals worldwide.
              </p>
              <div style={{
                display: 'flex',
                gap: '16px',
                color: '#6b7280'
              }}>
                <a href="#" style={{ color: '#6b7280', fontSize: '24px' }}>📧</a>
                <a href="#" style={{ color: '#6b7280', fontSize: '24px' }}>🐦</a>
                <a href="#" style={{ color: '#6b7280', fontSize: '24px' }}>💼</a>
              </div>
            </div>

            {/* Product links */}
            <div>
              <h4 style={{ 
                color: 'white', 
                fontWeight: '600', 
                marginBottom: '20px',
                fontSize: '1.125rem'
              }}>
                Product
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Single Predictions', 'Bulk Processing', 'API Access', 'Analytics Dashboard', 'Export Reports'].map(link => (
                  <a key={link} href="#" style={{ 
                    color: '#9ca3af', 
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#d1d5db'}
                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Company links */}
            <div>
              <h4 style={{ 
                color: 'white', 
                fontWeight: '600', 
                marginBottom: '20px',
                fontSize: '1.125rem'
              }}>
                Company
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['About Us', 'Blog', 'Careers', 'Contact', 'Press Kit'].map(link => (
                  <a key={link} href="#" style={{ 
                    color: '#9ca3af', 
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#d1d5db'}
                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Support links */}
            <div>
              <h4 style={{ 
                color: 'white', 
                fontWeight: '600', 
                marginBottom: '20px',
                fontSize: '1.125rem'
              }}>
                Support
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Help Center', 'API Documentation', 'Status Page', 'Report Bug', 'Feature Request'].map(link => (
                  <a key={link} href="#" style={{ 
                    color: '#9ca3af', 
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#d1d5db'}
                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom footer */}
          <div style={{
            borderTop: '1px solid #374151',
            paddingTop: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px'
          }}>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
              © 2024 DevicePricePro. All rights reserved.
            </p>
            <div style={{
              display: 'flex',
              gap: '32px',
              fontSize: '14px',
              color: '#9ca3af'
            }}>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms of Service</a>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;