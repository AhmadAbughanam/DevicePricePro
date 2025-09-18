import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for JWT errors and data extraction
apiClient.interceptors.response.use(
  (response) => {
    // Return the data portion of the response
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Extract error message from response
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        error.message || 
                        'An unexpected error occurred';
    
    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data
    });
  }
);

// Backend feature mapping - CRITICAL for API communication
export const BACKEND_FEATURES = [
  "battery_power",  // Battery power in mAh
  "blue",          // Has Bluetooth (1/0)
  "clock_speed",   // Processor clock speed
  "dual_sim",      // Has dual SIM (1/0)
  "fc",           // Front camera MP
  "four_g",       // Has 4G (1/0)
  "int_memory",   // Internal memory in GB
  "m_dep",        // Mobile depth in cm
  "mobile_wt",    // Mobile weight in grams
  "n_cores",      // Number of processor cores
  "pc",           // Primary camera MP
  "px_height",    // Pixel resolution height
  "px_width",     // Pixel resolution width
  "ram",          // RAM in MB
  "sc_h",         // Screen height in cm
  "sc_w",         // Screen width in cm
  "talk_time",    // Talk time in hours
  "three_g",      // Has 3G (1/0)
  "touch_screen", // Has touch screen (1/0)
  "wifi"          // Has WiFi (1/0)
];

// Field mapping from user-friendly to backend
export const FIELD_MAPPING = {
  brand: 'brand',                    // For display only
  model_name: 'model_name',          // For display only
  battery_mah: 'battery_power',      // mAh → battery_power
  bluetooth: 'blue',                 // boolean → 1/0
  clock_speed: 'clock_speed',        // GHz
  dual_sim: 'dual_sim',             // boolean → 1/0
  front_camera: 'fc',               // MP
  has_4g: 'four_g',                 // boolean → 1/0
  storage_gb: 'int_memory',         // GB
  depth_cm: 'm_dep',                // cm
  weight_g: 'mobile_wt',            // grams
  cores: 'n_cores',                 // number
  rear_camera: 'pc',                // MP
  screen_height_px: 'px_height',    // pixels
  screen_width_px: 'px_width',      // pixels
  ram_mb: 'ram',                    // MB (note: MB, not GB!)
  screen_height_cm: 'sc_h',         // cm
  screen_width_cm: 'sc_w',          // cm
  talk_time: 'talk_time',           // hours
  has_3g: 'three_g',                // boolean → 1/0
  touchscreen: 'touch_screen',      // boolean → 1/0
  wifi: 'wifi'                      // boolean → 1/0
};

// Price range interpretation
export const PRICE_RANGES = {
  0: { label: 'Budget', range: '$0 - $200', color: '#10b981' },
  1: { label: 'Mid-Range', range: '$200 - $500', color: '#3b82f6' },
  2: { label: 'Premium', range: '$500 - $1000', color: '#f59e0b' },
  3: { label: 'Flagship', range: '$1000+', color: '#ef4444' }
};

// Transform form data to backend format
export const transformToBackendFormat = (formData) => {
  const backendData = {};
  
  Object.entries(formData).forEach(([key, value]) => {
    const backendKey = FIELD_MAPPING[key] || key;
    
    // Convert boolean fields to 1/0
    if (typeof value === 'boolean') {
      backendData[backendKey] = value ? 1 : 0;
    } else if (value !== '' && value !== null && value !== undefined) {
      backendData[backendKey] = parseFloat(value) || value;
    }
  });
  
  return backendData;
};

// API Service Functions
export const api = {
  // Health Check
  healthCheck: () => apiClient.get('/'),

  // Authentication
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
    logout: () => apiClient.post('/auth/logout'),
    getProfile: () => apiClient.get('/auth/profile'),
    updateProfile: (profileData) => apiClient.put('/auth/profile', profileData),
    changePassword: (passwordData) => apiClient.put('/auth/password', passwordData),
  },

  // Predictions
  predictions: {
    // Single device prediction
    single: (deviceData) => {
      const backendData = transformToBackendFormat(deviceData);
      return apiClient.post('/predict/', backendData);
    },
    
    // Batch CSV upload prediction
    batch: (csvFile, onProgress) => {
      const formData = new FormData();
      formData.append('file', csvFile);
      
      return apiClient.post('/predict/batch', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        }
      });
    },
    
    // Get prediction explanation (feature importance)
    explain: (deviceData) => {
      const backendData = transformToBackendFormat(deviceData);
      return apiClient.post('/predict/explain', backendData);
    },
    
    // Get required model features and descriptions
    getFeatures: () => apiClient.get('/predict/features'),
  },

  // Device Data
  devices: {
    getBrands: () => apiClient.get('/device/brands'),
    getModels: (brand) => apiClient.get(`/device/models?brand=${encodeURIComponent(brand)}`),
    getOperatingSystems: () => apiClient.get('/device/os'),
  }
};

// Utility functions for API error handling
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.status === 401) {
    return 'Please log in to continue';
  } else if (error.status === 403) {
    return 'You do not have permission to perform this action';
  } else if (error.status === 404) {
    return 'The requested resource was not found';
  } else if (error.status === 422) {
    return 'Invalid data provided. Please check your inputs';
  } else if (error.status === 429) {
    return 'Too many requests. Please try again later';
  } else if (error.status >= 500) {
    return 'Server error. Please try again later';
  } else {
    return error.message || 'An unexpected error occurred';
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Clear authentication data
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// CSV template generator for batch predictions
export const generateCSVTemplate = () => {
  const headers = BACKEND_FEATURES.join(',');
  const sampleRow1 = '1000,1,2.5,0,5,1,32,0.8,150,4,12,1920,1080,4000,14.2,7.1,15,1,1,1';
  const sampleRow2 = '2000,1,3.0,1,8,1,64,0.9,180,8,16,2560,1440,6000,15.5,7.8,20,1,1,1';
  
  return `${headers}\n${sampleRow1}\n${sampleRow2}`;
};

// Download CSV template
export const downloadCSVTemplate = () => {
  const csvContent = generateCSVTemplate();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'device_prediction_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Format prediction results for display
export const formatPredictionResult = (prediction) => {
  const priceRange = PRICE_RANGES[prediction.predicted_price_range];
  const confidence = prediction.confidence || [];
  const maxConfidence = Math.max(...confidence) * 100;
  
  return {
    priceRange: priceRange || PRICE_RANGES[0],
    confidence: maxConfidence.toFixed(1),
    confidenceDistribution: confidence.map((conf, index) => ({
      range: PRICE_RANGES[index].label,
      probability: (conf * 100).toFixed(1),
      color: PRICE_RANGES[index].color
    }))
  };
};

export default api;