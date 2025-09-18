import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateRegisterForm } from '../utils/validators';
import { buttonStyles, inputStyles, cardStyles, alertStyles, loadingSpinnerStyle } from '../utils/ui';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register, error: authError } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});
    
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    
    if (!result.success) {
      setErrors({ submit: result.error });
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#2563eb',
            marginBottom: '8px'
          }}>
            📱 DevicePricePro
          </div>
          <p style={{
            color: '#6b7280',
            fontSize: '16px'
          }}>
            Create your account to get started
          </p>
        </div>

        {/* Registration Form */}
        <div style={cardStyles.base}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            Sign Up
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            Join DevicePricePro and start predicting device prices with AI.
          </p>

          {/* Error Messages */}
          {(authError || errors.submit) && (
            <div style={alertStyles.error}>
              {authError || errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#374151'
              }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                style={errors.name ? inputStyles.error : inputStyles.base}
                autoComplete="name"
              />
              {errors.name && (
                <div style={{
                  color: '#dc2626',
                  fontSize: '12px',
                  marginTop: '4px'
                }}>
                  {errors.name}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#374151'
              }}>
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
              {errors.email && (
                <div style={{
                  color: '#dc2626',
                  fontSize: '12px',
                  marginTop: '4px'
                }}>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#374151'
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                style={errors.password ? inputStyles.error : inputStyles.base}
                autoComplete="new-password"
              />
              {errors.password && (
                <div style={{
                  color: '#dc2626',
                  fontSize: '12px',
                  marginTop: '4px'
                }}>
                  {errors.password}
                </div>
              )}
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '4px'
              }}>
                Password must be at least 6 characters long
              </div>
            </div>

            {/* Confirm Password Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#374151'
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                style={errors.confirmPassword ? inputStyles.error : inputStyles.base}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <div style={{
                  color: '#dc2626',
                  fontSize: '12px',
                  marginTop: '4px'
                }}>
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                marginBottom: '20px',
                ...(loading ? buttonStyles.disabled : buttonStyles.primary)
              }}
            >
              {loading ? (
                <>
                  <span style={loadingSpinnerStyle}></span>
                  <span style={{ marginLeft: '8px' }}>Creating Account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div style={{
            textAlign: 'center',
            paddingTop: '20px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <p style={{
              color: '#6b7280',
              fontSize: '14px',
              margin: 0
            }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Terms Notice */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: 0,
            lineHeight: '1.5'
          }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;