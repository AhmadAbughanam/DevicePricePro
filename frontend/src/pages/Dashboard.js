import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const cardStyle = {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    display: 'block',
    color: 'inherit'
  };

  const quickActions = [
    {
      title: 'Single Prediction',
      description: 'Get price prediction for one device',
      icon: '📱',
      path: '/predict'
    },
    {
      title: 'Batch Prediction',
      description: 'Upload CSV for multiple predictions',
      icon: '📊',
      path: '/batch'
    },
    {
      title: 'Prediction History',
      description: 'View your past predictions',
      icon: '🕒',
      path: '/history'
    },
    {
      title: 'Analytics',
      description: 'View insights and trends',
      icon: '📈',
      path: '/analytics'
    }
  ];

  return (
    <div style={{
      backgroundColor: '#f9fafb',
      minHeight: 'calc(100vh - 64px)',
      padding: '32px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Welcome Section */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '8px',
            margin: 0
          }}>
            Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: '8px 0 0 0'
          }}>
            Ready to predict some device prices? Choose an option below to get started.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{
                fontSize: '32px',
                marginBottom: '12px'
              }}>
                {action.icon}
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px',
                margin: '0 0 8px 0'
              }}>
                {action.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0,
                lineHeight: '1.4'
              }}>
                {action.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>
            System Status
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#059669',
                marginBottom: '4px'
              }}>
                94.2%
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Prediction Accuracy
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#2563eb',
                marginBottom: '4px'
              }}>
                50K+
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Devices Analyzed
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#dc2626',
                marginBottom: '4px'
              }}>
                &lt; 2s
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Response Time
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#7c3aed',
                marginBottom: '4px'
              }}>
                99.9%
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Uptime
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;