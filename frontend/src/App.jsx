import React, { useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home'; // Marketing landing page
import Dashboard from './pages/Dashboard'; // Simple dashboard home page
import SinglePrediction from './pages/SinglePrediction';
import BatchPrediction from './pages/BatchPrediction';
import Login from './pages/Login';
import Register from './pages/Register';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import PredictionHistory from './pages/PredictionHistory';
import { buttonStyles, alertStyles } from './utils/ui';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Public Route component (for authenticated users, redirect to dashboard)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated() ? children : <Navigate to="/dashboard" />;
};

// Navigation component
const Navigation = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    backgroundColor: isActive(path) ? '#2563eb' : 'transparent',
    color: isActive(path) ? 'white' : '#374151'
  });

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '0 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px'
      }}>
        {/* Logo */}
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '24px' }}>📱</span>
            DevicePricePro
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to="/dashboard" style={navLinkStyle('/dashboard')}>
            Home
          </Link>
          <Link to="/predict" style={navLinkStyle('/predict')}>
            Single Prediction
          </Link>
          <Link to="/batch" style={navLinkStyle('/batch')}>
            Batch Prediction
          </Link>
          <Link to="/history" style={navLinkStyle('/history')}>
            History
          </Link>
          <Link to="/analytics" style={navLinkStyle('/analytics')}>
            Analytics
          </Link>
          
          {/* User Menu */}
          <div style={{ marginLeft: '16px', position: 'relative' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#374151',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              👤 {user?.name || user?.email?.split('@')[0] || 'User'}
            </button>
            
            {mobileMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                minWidth: '160px',
                zIndex: 50,
                marginTop: '4px'
              }}>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    textDecoration: 'none',
                    color: '#374151',
                    fontSize: '14px',
                    borderBottom: '1px solid #f3f4f6'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Dashboard Layout component
const DashboardLayout = ({ children }) => (
  <>
    <Navigation />
    <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: '#f9fafb' }}>
      {children}
    </div>
  </>
);

const App = () => {
  const { user, loading, error } = useAuth();

  // Show loading spinner only for initial auth check
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{
            fontSize: '16px',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            Loading DevicePricePro...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Global Error Display */}
      {error && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          ...alertStyles.error
        }}>
          {error}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginLeft: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'inherit',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Reload
          </button>
        </div>
      )}

      <Routes>
        {/* Public Landing Page */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          } 
        />
        
        {/* Authentication Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />

        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/predict" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SinglePrediction />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/batch" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <BatchPrediction />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PredictionHistory />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route 
          path="*" 
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/" />
          } 
        />
      </Routes>
      
      {/* Global CSS for animations */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default App;