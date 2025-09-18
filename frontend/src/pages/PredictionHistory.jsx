import React, { useState, useEffect, useMemo } from 'react';
import { PRICE_RANGES } from '../utils/api';
import { cardStyles, buttonStyles, inputStyles, tableStyles } from '../utils/ui';
import { formatNumber, debounce } from '../utils/ui';

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriceRange, setFilterPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const itemsPerPage = 10;

  // Enhanced mock prediction history data
  const mockPredictions = [
    {
      id: 1,
      type: 'single',
      brand: 'Apple',
      model: 'iPhone 14 Pro',
      predictedPriceRange: 3,
      confidence: 94.2,
      features: { 
        battery_power: 3200, 
        ram: 6000, 
        int_memory: 256,
        screen_size: 6.1,
        camera_mp: 48,
        operating_system: 'iOS'
      },
      explanation: {
        top_features: [
          { feature: 'Brand (Apple)', impact: 0.35 },
          { feature: 'RAM (6GB)', impact: 0.28 },
          { feature: 'Storage (256GB)', impact: 0.22 },
          { feature: 'Camera (48MP)', impact: 0.15 }
        ]
      },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      type: 'batch',
      fileName: 'samsung_devices.csv',
      totalDevices: 25,
      predictedPriceRange: 1,
      confidence: 87.5,
      summary: {
        successful_predictions: 23,
        failed_predictions: 2,
        average_confidence: 87.5,
        price_distribution: {
          0: 12,  // Low
          1: 8,   // Medium-Low
          2: 3,   // Medium-High
          3: 0    // High
        }
      },
      createdAt: '2024-01-14T15:45:00Z'
    },
    {
      id: 3,
      type: 'single',
      brand: 'Samsung',
      model: 'Galaxy S23',
      predictedPriceRange: 2,
      confidence: 91.8,
      features: { 
        battery_power: 3900, 
        ram: 8000, 
        int_memory: 128,
        screen_size: 6.1,
        camera_mp: 50,
        operating_system: 'Android'
      },
      explanation: {
        top_features: [
          { feature: 'RAM (8GB)', impact: 0.32 },
          { feature: 'Brand (Samsung)', impact: 0.29 },
          { feature: 'Camera (50MP)', impact: 0.21 },
          { feature: 'Battery (3900mAh)', impact: 0.18 }
        ]
      },
      createdAt: '2024-01-13T09:15:00Z'
    },
    {
      id: 4,
      type: 'single',
      brand: 'Google',
      model: 'Pixel 7 Pro',
      predictedPriceRange: 2,
      confidence: 89.3,
      features: { 
        battery_power: 5000, 
        ram: 12000, 
        int_memory: 256,
        screen_size: 6.7,
        camera_mp: 50,
        operating_system: 'Android'
      },
      explanation: {
        top_features: [
          { feature: 'RAM (12GB)', impact: 0.38 },
          { feature: 'Storage (256GB)', impact: 0.25 },
          { feature: 'Battery (5000mAh)', impact: 0.20 },
          { feature: 'Camera (50MP)', impact: 0.17 }
        ]
      },
      createdAt: '2024-01-12T14:20:00Z'
    },
    {
      id: 5,
      type: 'batch',
      fileName: 'budget_phones.csv',
      totalDevices: 12,
      predictedPriceRange: 0,
      confidence: 82.1,
      summary: {
        successful_predictions: 11,
        failed_predictions: 1,
        average_confidence: 82.1,
        price_distribution: {
          0: 9,   // Low
          1: 2,   // Medium-Low
          2: 0,   // Medium-High
          3: 0    // High
        }
      },
      createdAt: '2024-01-11T11:15:00Z'
    }
  ];

  useEffect(() => {
    const loadPredictions = async () => {
      setLoading(true);
      setError(null);
      setBackendStatus('connecting');
      
      try {
        const token = localStorage.getItem('token');
        console.log('Token found:', !!token);
        
        if (!token) {
          console.warn('No JWT token found, using mock data');
          setBackendStatus('no-auth');
          setPredictions(mockPredictions);
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/predict/history', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Received data:', data);
          
          const predictionData = data.predictions || data || [];
          
          if (predictionData.length === 0) {
            console.log('Backend returned empty array, using mock data for demonstration');
            setBackendStatus('empty-data');
            setPredictions(mockPredictions);
            setError('No prediction history found. The data below is sample data for demonstration.');
          } else {
            setBackendStatus('connected');
            setPredictions(predictionData);
          }
        } else if (response.status === 401) {
          console.error('Authentication failed - token may be invalid');
          setError('Authentication failed. Please log in again.');
          setBackendStatus('auth-failed');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setPredictions(mockPredictions);
        } else {
          console.error('Failed to fetch predictions:', response.status, response.statusText);
          setError(`Failed to fetch predictions: ${response.status}`);
          setBackendStatus('error');
          setPredictions(mockPredictions);
        }
      } catch (error) {
        console.error('Error loading predictions:', error);
        setError(`Network error: ${error.message}`);
        setBackendStatus('network-error');
        setPredictions(mockPredictions);
      } finally {
        setLoading(false);
      }
    };

    loadPredictions();
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((term) => {
      setSearchTerm(term);
      setCurrentPage(1);
    }, 300),
    []
  );

  // Handle showing prediction details
  const handleShowDetails = (prediction) => {
    setSelectedPrediction(prediction);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedPrediction(null);
  };

  // Modal component for prediction details
  const DetailsModal = ({ prediction, onClose }) => {
    if (!prediction) return null;

    const priceRange = PRICE_RANGES[prediction.predictedPriceRange];

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '24px'
          }}>
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '4px'
              }}>
                Prediction Details
              </h2>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                {formatDate(prediction.createdAt)}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280',
                borderRadius: '6px'
              }}
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Basic Info */}
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '16px',
              borderRadius: '8px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#374151'
              }}>
                Basic Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Type</span>
                  <p style={{ fontSize: '14px', fontWeight: '600', marginTop: '2px' }}>
                    {prediction.type === 'single' ? 'Single Device' : 'Batch Processing'}
                  </p>
                </div>
                {prediction.type === 'single' ? (
                  <>
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Brand</span>
                      <p style={{ fontSize: '14px', fontWeight: '600', marginTop: '2px' }}>{prediction.brand || 'Unknown'}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Model</span>
                      <p style={{ fontSize: '14px', fontWeight: '600', marginTop: '2px' }}>{prediction.model || 'Unknown'}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>File Name</span>
                      <p style={{ fontSize: '14px', fontWeight: '600', marginTop: '2px' }}>{prediction.fileName || 'Unknown'}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Total Devices</span>
                      <p style={{ fontSize: '14px', fontWeight: '600', marginTop: '2px' }}>{prediction.totalDevices || 0}</p>
                    </div>
                  </>
                )}
                <div>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Confidence</span>
                  <p style={{ fontSize: '14px', fontWeight: '600', marginTop: '2px' }}>
                    {prediction.confidence ? prediction.confidence.toFixed(1) : '0.0'}%
                  </p>
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div style={{
              backgroundColor: priceRange?.color || '#9ca3af',
              color: 'white',
              padding: '16px',
              borderRadius: '8px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                Predicted Price Range
              </h3>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {priceRange?.range || 'Unknown Range'}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px' }}>
                {priceRange?.label || 'Unknown Category'}
              </div>
            </div>

            {/* Single Device Details */}
            {prediction.type === 'single' && prediction.features && (
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: '#374151'
                }}>
                  Device Specifications
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                  {Object.entries(prediction.features).map(([key, value]) => (
                    <div key={key} style={{
                      backgroundColor: '#f3f4f6',
                      padding: '12px',
                      borderRadius: '6px'
                    }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                        {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <p style={{ fontSize: '14px', fontWeight: '600', marginTop: '2px' }}>
                        {typeof value === 'number' ? formatNumber(value) : value}
                        {key.includes('ram') || key.includes('memory') ? ' MB' : ''}
                        {key.includes('battery') ? ' mAh' : ''}
                        {key.includes('camera') && key.includes('mp') ? ' MP' : ''}
                        {key.includes('screen') && key.includes('size') ? '"' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feature Importance (for single predictions) */}
            {prediction.type === 'single' && prediction.explanation?.top_features && (
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: '#374151'
                }}>
                  Feature Importance
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {prediction.explanation.top_features.map((feature, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '6px'
                    }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', minWidth: '140px' }}>
                        {feature.feature}
                      </span>
                      <div style={{
                        flex: 1,
                        height: '8px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${feature.impact * 100}%`,
                          height: '100%',
                          backgroundColor: '#2563eb',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '40px' }}>
                        {(feature.impact * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Batch Processing Summary */}
            {prediction.type === 'batch' && prediction.summary && (
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: '#374151'
                }}>
                  Processing Summary
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                  <div style={{
                    backgroundColor: '#dcfce7',
                    padding: '12px',
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#166534' }}>
                      {prediction.summary.successful_predictions || 0}
                    </div>
                    <div style={{ fontSize: '12px', color: '#166534' }}>Successful</div>
                  </div>
                  <div style={{
                    backgroundColor: '#fee2e2',
                    padding: '12px',
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc2626' }}>
                      {prediction.summary.failed_predictions || 0}
                    </div>
                    <div style={{ fontSize: '12px', color: '#dc2626' }}>Failed</div>
                  </div>
                  <div style={{
                    backgroundColor: '#dbeafe',
                    padding: '12px',
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1d4ed8' }}>
                      {prediction.summary.average_confidence ? prediction.summary.average_confidence.toFixed(1) : prediction.confidence?.toFixed(1) || '0.0'}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#1d4ed8' }}>Avg Confidence</div>
                  </div>
                </div>

                {/* Price Distribution */}
                {prediction.summary.price_distribution && (
                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                      Price Range Distribution
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {Object.entries(prediction.summary.price_distribution).map(([rangeKey, count]) => {
                        const range = PRICE_RANGES[rangeKey];
                        if (!range || count === 0) return null;
                        
                        return (
                          <div key={rangeKey} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: range.color,
                              borderRadius: '2px'
                            }} />
                            <span style={{ fontSize: '14px', minWidth: '120px' }}>{range.label}</span>
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>{count} devices</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Close Button */}
          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button
              onClick={onClose}
              style={buttonStyles.primary}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const filteredPredictions = useMemo(() => {
    let filtered = predictions.filter(prediction => {
      const searchMatch = searchTerm === '' || 
        (prediction.brand && prediction.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (prediction.model && prediction.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (prediction.fileName && prediction.fileName.toLowerCase().includes(searchTerm.toLowerCase()));

      const typeMatch = filterType === 'all' || prediction.type === filterType;
      const priceRangeMatch = filterPriceRange === 'all' || 
        prediction.predictedPriceRange.toString() === filterPriceRange;

      return searchMatch && typeMatch && priceRangeMatch;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'confidence':
          aValue = a.confidence;
          bValue = b.confidence;
          break;
        case 'brand':
          aValue = a.brand || a.fileName || '';
          bValue = b.brand || b.fileName || '';
          break;
        case 'priceRange':
          aValue = a.predictedPriceRange;
          bValue = b.predictedPriceRange;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [predictions, searchTerm, filterType, filterPriceRange, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredPredictions.length / itemsPerPage);
  const paginatedPredictions = filteredPredictions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'connected': return '#10b981';
      case 'empty-data': return '#f59e0b';
      case 'checking':
      case 'connecting': return '#6b7280';
      default: return '#ef4444';
    }
  };

  const getStatusText = () => {
    switch (backendStatus) {
      case 'checking': return 'Checking connection...';
      case 'connecting': return 'Connecting to backend...';
      case 'connected': return 'Connected - Real data';
      case 'empty-data': return 'Connected but no data - Showing sample data';
      case 'no-auth': return 'No authentication - Using sample data';
      case 'auth-failed': return 'Authentication failed - Using sample data';
      case 'network-error': return 'Network error - Using sample data';
      case 'error': return 'Backend error - Using sample data';
      default: return 'Unknown status';
    }
  };

  const PaginationButton = ({ page, isActive, onClick, disabled = false, children }) => (
    <button
      onClick={() => onClick(page)}
      disabled={disabled}
      style={{
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        backgroundColor: isActive ? '#2563eb' : 'white',
        color: isActive ? 'white' : '#374151',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        opacity: disabled ? 0.5 : 1
      }}
    >
      {children}
    </button>
  );

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-block', 
          marginRight: '12px', 
          width: '20px', 
          height: '20px', 
          border: '2px solid #f3f3f3', 
          borderTop: '2px solid #2563eb', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }}></div>
        Loading prediction history...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          Prediction History
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          View and manage your past device price predictions
        </p>
      </div>

      {/* Enhanced Status Display */}
      <div style={{
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          flexShrink: 0
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
            Backend Status: {getStatusText()}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Predictions loaded: {predictions.length} | 
            Token: {localStorage.getItem('token') ? 'Present' : 'Missing'} |
            Endpoint: http://localhost:5000/device/history
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#b91c1c',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          <strong>Notice:</strong> {error}
        </div>
      )}

      {/* Development Tips */}
      {backendStatus === 'empty-data' && (
        <div style={{
          backgroundColor: '#fffbeb',
          border: '1px solid #fed7aa',
          color: '#92400e',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          <strong>Development Tip:</strong> Your backend is working but has no prediction history. 
          Make sure your prediction endpoints are saving data to the database when predictions are made.
        </div>
      )}

      <div style={cardStyles.base}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>
              Search
            </label>
            <input
              type="text"
              placeholder="Search by brand, model, or filename..."
              onChange={(e) => debouncedSearch(e.target.value)}
              style={inputStyles.base}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              style={inputStyles.base}
            >
              <option value="all">All Types</option>
              <option value="single">Single Prediction</option>
              <option value="batch">Batch Prediction</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>
              Price Range
            </label>
            <select
              value={filterPriceRange}
              onChange={(e) => {
                setFilterPriceRange(e.target.value);
                setCurrentPage(1);
              }}
              style={inputStyles.base}
            >
              <option value="all">All Ranges</option>
              {Object.entries(PRICE_RANGES).map(([key, range]) => (
                <option key={key} value={key}>
                  {range.label} ({range.range})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setFilterPriceRange('all');
              setCurrentPage(1);
              const searchInput = document.querySelector('input[type="text"]');
              if (searchInput) searchInput.value = '';
            }}
            style={buttonStyles.secondary}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        color: '#6b7280',
        fontSize: '14px'
      }}>
        <span>
          Showing {paginatedPredictions.length} of {formatNumber(filteredPredictions.length)} predictions
        </span>
        <span>
          Total: {formatNumber(predictions.length)} predictions
        </span>
      </div>

      <div style={cardStyles.base}>
        {filteredPredictions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
              No predictions found
            </h3>
            <p style={{ fontSize: '14px' }}>
              {searchTerm || filterType !== 'all' || filterPriceRange !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Start making predictions to see your history here.'}
            </p>
          </div>
        ) : (
          <div>
            <div style={{ overflow: 'auto' }}>
              <table style={tableStyles.table}>
                <thead>
                  <tr>
                    <th 
                      style={{ ...tableStyles.header, cursor: 'pointer' }}
                      onClick={() => handleSort('date')}
                    >
                      Date {getSortIcon('date')}
                    </th>
                    <th style={tableStyles.header}>Type</th>
                    <th 
                      style={{ ...tableStyles.header, cursor: 'pointer' }}
                      onClick={() => handleSort('brand')}
                    >
                      Device/File {getSortIcon('brand')}
                    </th>
                    <th 
                      style={{ ...tableStyles.header, cursor: 'pointer' }}
                      onClick={() => handleSort('priceRange')}
                    >
                      Price Range {getSortIcon('priceRange')}
                    </th>
                    <th 
                      style={{ ...tableStyles.header, cursor: 'pointer' }}
                      onClick={() => handleSort('confidence')}
                    >
                      Confidence {getSortIcon('confidence')}
                    </th>
                    <th style={tableStyles.header}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPredictions.map((prediction) => {
                    const priceRange = PRICE_RANGES[prediction.predictedPriceRange];
                    return (
                      <tr key={prediction.id} style={tableStyles.row}>
                        <td style={tableStyles.cell}>
                          {formatDate(prediction.createdAt)}
                        </td>
                        <td style={tableStyles.cell}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '500',
                            backgroundColor: prediction.type === 'single' ? '#dbeafe' : '#f0fdf4',
                            color: prediction.type === 'single' ? '#1e40af' : '#166534'
                          }}>
                            {prediction.type === 'single' ? 'Single' : 'Batch'}
                          </span>
                        </td>
                        <td style={tableStyles.cell}>
                          {prediction.type === 'single' ? (
                            <div>
                              <div style={{ fontWeight: '500' }}>{prediction.brand}</div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>{prediction.model}</div>
                            </div>
                          ) : (
                            <div>
                              <div style={{ fontWeight: '500' }}>{prediction.fileName}</div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>{prediction.totalDevices} devices</div>
                            </div>
                          )}
                        </td>
                        <td style={tableStyles.cell}>
                          <span style={{
                            backgroundColor: priceRange?.color || '#9ca3af',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '500'
                          }}>
                            {priceRange?.range || 'Unknown'}
                          </span>
                        </td>
                        <td style={tableStyles.cell}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '40px',
                              height: '8px',
                              backgroundColor: '#f3f4f6',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${prediction.confidence}%`,
                                height: '100%',
                                backgroundColor: prediction.confidence >= 90 ? '#10b981' : prediction.confidence >= 80 ? '#f59e0b' : '#ef4444',
                                transition: 'width 0.3s ease'
                              }} />
                            </div>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>
                              {prediction.confidence}%
                            </span>
                          </div>
                        </td>
                        <td style={tableStyles.cell}>
                          <button 
                            onClick={() => handleShowDetails(prediction)}
                            style={{
                              ...buttonStyles.secondary,
                              padding: '6px 12px',
                              fontSize: '12px'
                            }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                marginTop: '20px',
                padding: '20px 0'
              }}>
                <PaginationButton
                  page={currentPage - 1}
                  onClick={setCurrentPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </PaginationButton>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                  })
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] < page - 1 && (
                        <span style={{ padding: '8px 4px', color: '#6b7280' }}>...</span>
                      )}
                      <PaginationButton
                        page={page}
                        isActive={currentPage === page}
                        onClick={setCurrentPage}
                      >
                        {page}
                      </PaginationButton>
                    </React.Fragment>
                  ))}

                <PaginationButton
                  page={currentPage + 1}
                  onClick={setCurrentPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </PaginationButton>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <DetailsModal 
          prediction={selectedPrediction} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default PredictionHistory;