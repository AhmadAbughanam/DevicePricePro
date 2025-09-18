import React from 'react';
import { useAuth } from '../context/AuthContext';
import { cardStyles } from '../utils/ui';

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', marginRight: '12px', width: '20px', height: '20px', border: '2px solid #f3f3f3', borderTop: '2px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        Loading profile...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          Profile
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Your account information and activity overview
        </p>
      </div>

      {/* Main Profile Card */}
      <div style={cardStyles.base}>
        {/* User Avatar and Basic Info */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', paddingBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '40px',
            fontWeight: 'bold',
            marginRight: '24px'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
              {user?.name || 'User'}
            </h2>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: '0 0 4px 0' }}>
              {user?.email || 'email@example.com'}
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
            </p>
          </div>
        </div>

        {/* Account Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '30px' }}>
          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Account Status
            </h3>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '8px' }}></div>
              <span style={{ fontSize: '16px', color: '#10b981', fontWeight: '600' }}>Active</span>
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Account Type
            </h3>
            <span style={{ fontSize: '16px', color: '#1f2937', fontWeight: '500' }}>Standard</span>
          </div>

          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Last Login
            </h3>
            <span style={{ fontSize: '16px', color: '#1f2937', fontWeight: '500' }}>2 hours ago</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            Activity Overview
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div style={{ 
              backgroundColor: '#fef3f2', 
              padding: '16px', 
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #fecaca'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', marginBottom: '4px' }}>
                47
              </div>
              <div style={{ fontSize: '12px', color: '#7f1d1d', fontWeight: '500' }}>
                Total Items
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: '#f0fdf4', 
              padding: '16px', 
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a', marginBottom: '4px' }}>
                92%
              </div>
              <div style={{ fontSize: '12px', color: '#14532d', fontWeight: '500' }}>
                Success Rate
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: '#fffbeb', 
              padding: '16px', 
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #fed7aa'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706', marginBottom: '4px' }}>
                12
              </div>
              <div style={{ fontSize: '12px', color: '#92400e', fontWeight: '500' }}>
                This Month
              </div>
            </div>

            <div style={{ 
              backgroundColor: '#f0f9ff', 
              padding: '16px', 
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #bfdbfe'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', marginBottom: '4px' }}>
                7
              </div>
              <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: '500' }}>
                Day Streak
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            Recent Activity
          </h3>
          <div style={{ 
            backgroundColor: '#f9fafb', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '12px' }}></div>
                <span style={{ fontSize: '14px', color: '#1f2937' }}>Completed prediction task</span>
              </div>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>2 hours ago</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%', marginRight: '12px' }}></div>
                <span style={{ fontSize: '14px', color: '#1f2937' }}>Updated profile information</span>
              </div>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Yesterday</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%', marginRight: '12px' }}></div>
                <span style={{ fontSize: '14px', color: '#1f2937' }}>Batch upload completed</span>
              </div>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;