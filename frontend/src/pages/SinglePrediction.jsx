import React, { useState } from 'react';
import { api, PRICE_RANGES, formatPredictionResult } from '../utils/api';
import { validateDeviceForm } from '../utils/validators';
import { buttonStyles, inputStyles, cardStyles, alertStyles, loadingSpinnerStyle } from '../utils/ui';

const SinglePrediction = () => {
  const [formData, setFormData] = useState({
    brand: '',
    model_name: '',
    battery_mah: '',
    bluetooth: true,
    clock_speed: '',
    dual_sim: false,
    front_camera: '',
    has_4g: true,
    storage_gb: '',
    depth_cm: '',
    weight_g: '',
    cores: '',
    rear_camera: '',
    screen_height_px: '',
    screen_width_px: '',
    ram_mb: '',
    screen_height_cm: '',
    screen_width_cm: '',
    talk_time: '',
    has_3g: true,
    touchscreen: true,
    wifi: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    const validation = validateDeviceForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const result = await api.predictions.single(formData);
      setPrediction(result);
      setErrors({});
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to get prediction' });
    } finally {
      setLoading(false);
    }
  };

  const handleExplainPrediction = async () => {
    if (!prediction) return;
    
    setLoading(true);
    try {
      const result = await api.predictions.explain(formData);
      setExplanation(result);
      setShowExplanation(true);
    } catch (error) {
      setErrors({ explain: error.message || 'Failed to get explanation' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      model_name: '',
      battery_mah: '',
      bluetooth: true,
      clock_speed: '',
      dual_sim: false,
      front_camera: '',
      has_4g: true,
      storage_gb: '',
      depth_cm: '',
      weight_g: '',
      cores: '',
      rear_camera: '',
      screen_height_px: '',
      screen_width_px: '',
      ram_mb: '',
      screen_height_cm: '',
      screen_width_cm: '',
      talk_time: '',
      has_3g: true,
      touchscreen: true,
      wifi: true
    });
    setErrors({});
    setPrediction(null);
    setExplanation(null);
    setShowExplanation(false);
  };

  const renderInput = (name, label, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        placeholder={placeholder}
        style={errors[name] ? inputStyles.error : inputStyles.base}
      />
      {errors[name] && (
        <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
          {errors[name]}
        </div>
      )}
    </div>
  );

  const renderCheckbox = (name, label) => (
    <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
      <input
        type="checkbox"
        name={name}
        checked={formData[name]}
        onChange={handleInputChange}
        style={{ marginRight: '8px' }}
      />
      <label style={{ fontWeight: '500', fontSize: '14px', cursor: 'pointer' }}>
        {label}
      </label>
    </div>
  );

  const formattedPrediction = prediction ? formatPredictionResult(prediction) : null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          Device Price Prediction
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Enter device specifications to get an AI-powered price range prediction
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: prediction ? '1fr 1fr' : '1fr', gap: '30px' }}>
        {/* Form Section */}
        <div style={cardStyles.base}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
            Device Specifications
          </h2>

          {errors.submit && (
            <div style={alertStyles.error}>
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                Basic Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {renderInput('brand', 'Brand', 'text', 'e.g., Apple, Samsung')}
                {renderInput('model_name', 'Model Name', 'text', 'e.g., iPhone 14, Galaxy S23')}
              </div>
            </div>

            {/* Battery & Performance */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                Battery & Performance
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {renderInput('battery_mah', 'Battery (mAh)', 'number', '1000-10000')}
                {renderInput('clock_speed', 'Clock Speed (GHz)', 'number', '0.5-5.0')}
                {renderInput('cores', 'CPU Cores', 'number', '1-16')}
                {renderInput('talk_time', 'Talk Time (hours)', 'number', '1-50')}
              </div>
            </div>

            {/* Memory & Storage */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                Memory & Storage
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {renderInput('ram_mb', 'RAM (MB)', 'number', 'Note: Enter in MB (e.g., 4000 for 4GB)')}
                {renderInput('storage_gb', 'Storage (GB)', 'number', '1-2000')}
              </div>
            </div>

            {/* Display */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                Display Specifications
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {renderInput('screen_height_cm', 'Screen Height (cm)', 'number', '5-25')}
                {renderInput('screen_width_cm', 'Screen Width (cm)', 'number', '3-15')}
                {renderInput('screen_height_px', 'Screen Height (pixels)', 'number', '480-4000')}
                {renderInput('screen_width_px', 'Screen Width (pixels)', 'number', '320-3000')}
              </div>
            </div>

            {/* Camera */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                Camera
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {renderInput('rear_camera', 'Rear Camera (MP)', 'number', '0.1-200')}
                {renderInput('front_camera', 'Front Camera (MP)', 'number', '0.1-200')}
              </div>
            </div>

            {/* Physical Dimensions */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                Physical Dimensions
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {renderInput('weight_g', 'Weight (grams)', 'number', '50-1000')}
                {renderInput('depth_cm', 'Depth (cm)', 'number', '0.3-5.0')}
              </div>
            </div>

            {/* Connectivity Features */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                Connectivity Features
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {renderCheckbox('bluetooth', 'Bluetooth')}
                {renderCheckbox('wifi', 'WiFi')}
                {renderCheckbox('has_3g', '3G Support')}
                {renderCheckbox('has_4g', '4G Support')}
                {renderCheckbox('dual_sim', 'Dual SIM')}
                {renderCheckbox('touchscreen', 'Touchscreen')}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                type="submit"
                disabled={loading}
                style={loading ? buttonStyles.disabled : buttonStyles.primary}
              >
                {loading ? (
                  <>
                    <span style={loadingSpinnerStyle}></span>
                    <span style={{ marginLeft: '8px' }}>Predicting...</span>
                  </>
                ) : (
                  'Get Price Prediction'
                )}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                style={buttonStyles.secondary}
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {prediction && (
          <div>
            {/* Prediction Result */}
            <div style={cardStyles.base}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
                Price Prediction
              </h2>

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div 
                  style={{ 
                    fontSize: '48px', 
                    fontWeight: 'bold', 
                    color: formattedPrediction.priceRange.color,
                    marginBottom: '8px'
                  }}
                >
                  {formattedPrediction.priceRange.range}
                </div>
                <div style={{ fontSize: '18px', color: '#6b7280', marginBottom: '4px' }}>
                  {formattedPrediction.priceRange.label} Range
                </div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                  Confidence: {formattedPrediction.confidence}%
                </div>
              </div>

              {/* Confidence Distribution */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                  Confidence Distribution
                </h4>
                {formattedPrediction.confidenceDistribution.map((item, index) => (
                  <div key={index} style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>{item.range}</span>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>{item.probability}%</span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '6px', 
                      backgroundColor: '#f3f4f6', 
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${item.probability}%`,
                        height: '100%',
                        backgroundColor: item.color,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleExplainPrediction}
                disabled={loading}
                style={loading ? buttonStyles.disabled : buttonStyles.secondary}
              >
                {loading ? 'Loading...' : 'Explain Prediction'}
              </button>
            </div>

            {/* Feature Importance */}
            {showExplanation && explanation && (
              <div style={cardStyles.base}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
                  Feature Importance
                </h3>
                
                {explanation.top_features && explanation.top_features.length > 0 && (
                  <div>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                      Top factors influencing this prediction:
                    </p>
                    
                    {explanation.top_features.slice(0, 5).map(([feature, importance], index) => (
                      <div key={feature} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13px', color: '#374151', textTransform: 'capitalize' }}>
                            {feature.replace(/_/g, ' ')}
                          </span>
                          <span style={{ fontSize: '13px', color: '#6b7280' }}>
                            {(importance * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '8px',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${importance * 100}%`,
                            height: '100%',
                            backgroundColor: '#2563eb',
                            transition: 'width 0.5s ease'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePrediction;