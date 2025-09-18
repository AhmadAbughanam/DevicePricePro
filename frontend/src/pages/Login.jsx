import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm } from '../utils/validators';
import { buttonStyles, inputStyles, cardStyles, alertStyles, loadingSpinnerStyle } from '../utils/ui';

const Login = () => {
  const navigate = useNavigate(); // ✅ useNavigate hook inside the component
  const { login, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/Home'); // ✅ correct redirection after login
    } else {
      setErrors({ submit: result.error });
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb', marginBottom: '8px' }}>
            📱 DevicePricePro
          </div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            AI-powered device price predictions
          </p>
        </div>

        {/* Login Form */}
        <div style={cardStyles.base}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px', textAlign: 'center' }}>
            Sign In
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', marginBottom: '24px' }}>
            Welcome back! Please sign in to your account.
          </p>

          {/* Error Messages */}
          {(authError || errors.submit) && <div style={alertStyles.error}>{authError || errors.submit}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                style={errors.email ? inputStyles.error : inputStyles.base}
                autoComplete="email"
              />
              {errors.email && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.email}</div>}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                style={errors.password ? inputStyles.error : inputStyles.base}
                autoComplete="current-password"
              />
              {errors.password && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.password}</div>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', marginBottom: '20px', ...(loading ? buttonStyles.disabled : buttonStyles.primary) }}
            >
              {loading ? (
                <>
                  <span style={loadingSpinnerStyle}></span>
                  <span style={{ marginLeft: '8px' }}>Signing In...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>Demo Credentials</h3>
          <div style={{ fontSize: '12px', color: '#1e40af' }}>
            <div>Email: demo@devicepricepro.com</div>
            <div>Password: demo123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
