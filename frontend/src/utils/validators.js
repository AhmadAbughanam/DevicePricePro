// Simple validation functions for DevicePricePro forms

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateNumber = (value, fieldName, min = 0, max = Infinity) => {
  if (!value && value !== 0) return `${fieldName} is required`;
  
  const num = parseFloat(value);
  if (isNaN(num)) return `${fieldName} must be a valid number`;
  if (num < min) return `${fieldName} must be at least ${min}`;
  if (num > max) return `${fieldName} must be no more than ${max}`;
  
  return null;
};

export const validateInteger = (value, fieldName, min = 0, max = Infinity) => {
  if (!value && value !== 0) return `${fieldName} is required`;
  
  const num = parseInt(value);
  if (isNaN(num) || !Number.isInteger(parseFloat(value))) {
    return `${fieldName} must be a whole number`;
  }
  if (num < min) return `${fieldName} must be at least ${min}`;
  if (num > max) return `${fieldName} must be no more than ${max}`;
  
  return null;
};

// Device-specific field validations
export const validateDeviceField = (fieldName, value) => {
  switch (fieldName) {
    case 'battery_mah':
      return validateNumber(value, 'Battery (mAh)', 500, 10000);
    
    case 'clock_speed':
      return validateNumber(value, 'Clock Speed (GHz)', 0.5, 5.0);
    
    case 'front_camera':
      return validateNumber(value, 'Front Camera (MP)', 0.1, 200);
    
    case 'storage_gb':
      return validateInteger(value, 'Storage (GB)', 1, 2000);
    
    case 'depth_cm':
      return validateNumber(value, 'Depth (cm)', 0.3, 5.0);
    
    case 'weight_g':
      return validateNumber(value, 'Weight (g)', 50, 1000);
    
    case 'cores':
      return validateInteger(value, 'CPU Cores', 1, 16);
    
    case 'rear_camera':
      return validateNumber(value, 'Rear Camera (MP)', 0.1, 200);
    
    case 'screen_height_px':
      return validateInteger(value, 'Screen Height (px)', 480, 4000);
    
    case 'screen_width_px':
      return validateInteger(value, 'Screen Width (px)', 320, 3000);
    
    case 'ram_mb':
      return validateInteger(value, 'RAM (MB)', 256, 32000);
    
    case 'screen_height_cm':
      return validateNumber(value, 'Screen Height (cm)', 5, 25);
    
    case 'screen_width_cm':
      return validateNumber(value, 'Screen Width (cm)', 3, 15);
    
    case 'talk_time':
      return validateNumber(value, 'Talk Time (hours)', 1, 50);
    
    case 'brand':
    case 'model_name':
      return validateRequired(value, fieldName.replace('_', ' '));
    
    default:
      return null;
  }
};

// Validate entire device form
export const validateDeviceForm = (formData) => {
  const errors = {};
  
  // Required fields validation
  const requiredFields = [
    'brand', 'model_name', 'battery_mah', 'clock_speed', 'front_camera',
    'storage_gb', 'depth_cm', 'weight_g', 'cores', 'rear_camera',
    'screen_height_px', 'screen_width_px', 'ram_mb', 'screen_height_cm',
    'screen_width_cm', 'talk_time'
  ];
  
  requiredFields.forEach(field => {
    const error = validateDeviceField(field, formData[field]);
    if (error) {
      errors[field] = error;
    }
  });
  
  // Boolean fields don't need validation as they default to false
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate login form
export const validateLoginForm = (formData) => {
  const errors = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate registration form
export const validateRegisterForm = (formData) => {
  const errors = {};
  
  const nameError = validateRequired(formData.name, 'Name');
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate profile form
export const validateProfileForm = (formData) => {
  const errors = {};
  
  const nameError = validateRequired(formData.name, 'Name');
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate password change form
export const validatePasswordChangeForm = (formData) => {
  const errors = {};
  
  const currentPasswordError = validateRequired(formData.currentPassword, 'Current Password');
  if (currentPasswordError) errors.currentPassword = currentPasswordError;
  
  const newPasswordError = validatePassword(formData.newPassword);
  if (newPasswordError) errors.newPassword = newPasswordError;
  
  if (formData.newPassword !== formData.confirmNewPassword) {
    errors.confirmNewPassword = 'Passwords do not match';
  }
  
  if (formData.currentPassword === formData.newPassword) {
    errors.newPassword = 'New password must be different from current password';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// CSV validation
export const validateCSVFile = (file) => {
  if (!file) return 'Please select a CSV file';
  
  if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
    return 'Please select a valid CSV file';
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    return 'File size must be less than 5MB';
  }
  
  return null;
};

// Validate CSV headers
export const validateCSVHeaders = (headers, requiredHeaders) => {
  const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
  
  if (missingHeaders.length > 0) {
    return `Missing required columns: ${missingHeaders.join(', ')}`;
  }
  
  return null;
};

export default {
  validateEmail,
  validatePassword,
  validateRequired,
  validateNumber,
  validateInteger,
  validateDeviceField,
  validateDeviceForm,
  validateLoginForm,
  validateRegisterForm,
  validateProfileForm,
  validatePasswordChangeForm,
  validateCSVFile,
  validateCSVHeaders
};