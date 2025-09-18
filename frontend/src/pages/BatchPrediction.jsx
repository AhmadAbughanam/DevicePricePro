import React, { useState, useRef } from 'react';
import { api, BACKEND_FEATURES, PRICE_RANGES, downloadCSVTemplate } from '../utils/api';
import { validateCSVFile } from '../utils/validators';
import { buttonStyles, cardStyles, alertStyles, loadingSpinnerStyle, tableStyles, progressBarStyles } from '../utils/ui';
import { formatNumber } from '../utils/ui';

const BatchPrediction = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateCSVFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResults(null);
    setUploadProgress(0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const validationError = validateCSVFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResults(null);
    setUploadProgress(0);
  };

  const handleUploadAndProcess = async () => {
    if (!selectedFile) return;

    setProcessing(true);
    setError(null);
    setUploadProgress(0);

    try {
      const result = await api.predictions.batch(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      setResults(result);
      setUploadProgress(100);
    } catch (err) {
      setError(err.message || 'Failed to process file');
      setUploadProgress(0);
    } finally {
      setProcessing(false);
    }
  };

  const downloadResults = () => {
    if (!results || !results.predictions) return;

    const headers = ['Row', 'Predicted Price Range', 'Price Range Label', ...BACKEND_FEATURES];
    const csvContent = [
      headers.join(','),
      ...results.predictions.map(pred => {
        const priceRange = PRICE_RANGES[pred.predicted_price_range];
        const row = [
          pred.row,
          pred.predicted_price_range,
          `"${priceRange?.label || 'Unknown'}"`,
          ...BACKEND_FEATURES.map(feature => pred[feature] || '')
        ];
        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'prediction_results.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAll = () => {
    setSelectedFile(null);
    setResults(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          Batch Price Prediction
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Upload a CSV file with device specifications to get bulk price predictions
        </p>
      </div>

      {/* CSV Template Section */}
      <div style={cardStyles.base}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          CSV Template
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Download the template file to see the required format and column names.
        </p>
        
        <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '6px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
            Required Columns ({BACKEND_FEATURES.length} total):
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '4px', fontSize: '12px', color: '#6b7280' }}>
            {BACKEND_FEATURES.map(feature => (
              <code key={feature} style={{ backgroundColor: 'white', padding: '2px 6px', borderRadius: '3px' }}>
                {feature}
              </code>
            ))}
          </div>
        </div>

        <button onClick={downloadCSVTemplate} style={buttonStyles.secondary}>
          Download CSV Template
        </button>
      </div>

      {/* File Upload Section */}
      <div style={cardStyles.base}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          Upload CSV File
        </h2>

        {error && (
          <div style={alertStyles.error}>
            {error}
          </div>
        )}

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '20px',
            backgroundColor: selectedFile ? '#f0f9ff' : '#fafafa',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".csv"
            style={{ display: 'none' }}
          />
          
          {selectedFile ? (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                {selectedFile.name}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {formatFileSize(selectedFile.size)}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📁</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                Drop your CSV file here or click to browse
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Maximum file size: 5MB
              </div>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {(processing || uploadProgress > 0) && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#374151' }}>
                {processing ? 'Processing...' : 'Upload Complete'}
              </span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                {uploadProgress}%
              </span>
            </div>
            <div style={progressBarStyles.container}>
              <div 
                style={{
                  ...progressBarStyles.bar,
                  width: `${uploadProgress}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleUploadAndProcess}
            disabled={!selectedFile || processing}
            style={(!selectedFile || processing) ? buttonStyles.disabled : buttonStyles.primary}
          >
            {processing ? (
              <>
                <span style={loadingSpinnerStyle}></span>
                <span style={{ marginLeft: '8px' }}>Processing...</span>
              </>
            ) : (
              'Upload & Process'
            )}
          </button>
          
          <button onClick={clearAll} style={buttonStyles.secondary}>
            Clear All
          </button>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div style={cardStyles.base}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Processing Results
          </h2>

          {/* Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '6px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
                {formatNumber(results.total_processed || 0)}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Rows</div>
            </div>
            
            <div style={{ backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '6px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#166534' }}>
                {formatNumber(results.successful_predictions || 0)}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Successful</div>
            </div>
            
            <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '6px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
                {formatNumber(results.errors_count || 0)}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Errors</div>
            </div>
          </div>

          {/* Error Messages */}
          {results.errors && results.errors.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#dc2626' }}>
                Processing Errors
              </h3>
              <div style={{ backgroundColor: '#fef2f2', borderRadius: '6px', padding: '12px', maxHeight: '200px', overflow: 'auto' }}>
                {results.errors.map((error, index) => (
                  <div key={index} style={{ fontSize: '13px', color: '#7f1d1d', marginBottom: '4px' }}>
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Predictions Table */}
          {results.predictions && results.predictions.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
                  Predictions Preview (First 10 rows)
                </h3>
                <button onClick={downloadResults} style={buttonStyles.secondary}>
                  Download Full Results
                </button>
              </div>
              
              <div style={{ overflow: 'auto', maxHeight: '400px' }}>
                <table style={tableStyles.table}>
                  <thead>
                    <tr>
                      <th style={tableStyles.header}>Row</th>
                      <th style={tableStyles.header}>Price Range</th>
                      <th style={tableStyles.header}>Label</th>
                      <th style={tableStyles.header}>Battery</th>
                      <th style={tableStyles.header}>RAM</th>
                      <th style={tableStyles.header}>Storage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.predictions.slice(0, 10).map((pred, index) => {
                      const priceRange = PRICE_RANGES[pred.predicted_price_range];
                      return (
                        <tr key={index} style={tableStyles.row}>
                          <td style={tableStyles.cell}>{pred.row}</td>
                          <td style={tableStyles.cell}>
                            <span 
                              style={{ 
                                backgroundColor: priceRange?.color || '#9ca3af',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}
                            >
                              {priceRange?.range || 'Unknown'}
                            </span>
                          </td>
                          <td style={tableStyles.cell}>{priceRange?.label || 'Unknown'}</td>
                          <td style={tableStyles.cell}>{pred.battery_power || '-'}</td>
                          <td style={tableStyles.cell}>{pred.ram || '-'}</td>
                          <td style={tableStyles.cell}>{pred.int_memory || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {results.predictions.length > 10 && (
                <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
                  Showing 10 of {formatNumber(results.predictions.length)} predictions. 
                  Download full results to see all data.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BatchPrediction;