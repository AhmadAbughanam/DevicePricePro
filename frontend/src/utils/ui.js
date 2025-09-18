// Simple UI utility functions for DevicePricePro

// Format numbers with commas
export const formatNumber = (num) => {
  if (!num && num !== 0) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Format price ranges
export const formatPrice = (price) => {
  if (!price && price !== 0) return '';
  return `$${formatNumber(price)}`;
};

// Format percentage
export const formatPercent = (value, decimals = 1) => {
  if (!value && value !== 0) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Convert camelCase to Title Case
export const camelToTitle = (str) => {
  if (!str) return '';
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (match) => match.toUpperCase())
    .trim();
};

// Convert snake_case to Title Case
export const snakeToTitle = (str) => {
  if (!str) return '';
  return str
    .split('_')
    .map(word => capitalize(word))
    .join(' ');
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get color for price range
export const getPriceRangeColor = (range) => {
  const colors = {
    0: '#10b981', // Budget - Green
    1: '#3b82f6', // Mid-Range - Blue
    2: '#f59e0b', // Premium - Orange
    3: '#ef4444'  // Flagship - Red
  };
  return colors[range] || colors[0];
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format duration (seconds to readable format)
export const formatDuration = (seconds) => {
  if (!seconds) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
};

// Generate random ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Simple loading spinner styles
export const loadingSpinnerStyle = {
  display: 'inline-block',
  width: '20px',
  height: '20px',
  border: '2px solid #f3f3f3',
  borderTop: '2px solid #2563eb',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

// CSS animation for spinner (add to your CSS)
export const spinnerCSS = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Button styles
export const buttonStyles = {
  primary: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  secondary: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  danger: {
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  disabled: {
    backgroundColor: '#9ca3af',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'not-allowed',
    fontSize: '14px',
    fontWeight: '500',
    opacity: 0.6
  }
};

// Input styles
export const inputStyles = {
  base: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  error: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #dc2626',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  }
};

// Card styles
export const cardStyles = {
  base: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    marginBottom: '20px'
  },
  hover: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s'
  }
};

// Alert styles
export const alertStyles = {
  success: {
    backgroundColor: '#d1fae5',
    border: '1px solid #10b981',
    borderRadius: '6px',
    padding: '12px 16px',
    color: '#065f46',
    marginBottom: '16px'
  },
  error: {
    backgroundColor: '#fee2e2',
    border: '1px solid #dc2626',
    borderRadius: '6px',
    padding: '12px 16px',
    color: '#991b1b',
    marginBottom: '16px'
  },
  warning: {
    backgroundColor: '#fef3c7',
    border: '1px solid #f59e0b',
    borderRadius: '6px',
    padding: '12px 16px',
    color: '#92400e',
    marginBottom: '16px'
  },
  info: {
    backgroundColor: '#dbeafe',
    border: '1px solid #3b82f6',
    borderRadius: '6px',
    padding: '12px 16px',
    color: '#1e40af',
    marginBottom: '16px'
  }
};

// Progress bar styles
export const progressBarStyles = {
  container: {
    width: '100%',
    height: '8px',
    backgroundColor: '#f3f4f6',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  bar: {
    height: '100%',
    backgroundColor: '#2563eb',
    transition: 'width 0.3s ease'
  }
};

// Table styles
export const tableStyles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '16px'
  },
  header: {
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '14px',
    color: '#374151'
  },
  cell: {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#6b7280'
  },
  row: {
    transition: 'background-color 0.2s'
  }
};

// Modal styles
export const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  content: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  }
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch (err) {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
};

// Simple toast notification (you'll need to implement the toast container)
export const showToast = (message, type = 'info') => {
  // This is a placeholder - you'd implement actual toast functionality
  console.log(`Toast [${type}]: ${message}`);
};

export default {
  formatNumber,
  formatPrice,
  formatPercent,
  capitalize,
  camelToTitle,
  snakeToTitle,
  truncateText,
  getPriceRangeColor,
  formatFileSize,
  formatDuration,
  generateId,
  debounce,
  loadingSpinnerStyle,
  buttonStyles,
  inputStyles,
  cardStyles,
  alertStyles,
  progressBarStyles,
  tableStyles,
  modalStyles,
  copyToClipboard,
  showToast
};