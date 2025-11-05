/**
 * Real-time field validation utilities
 */

export function validateField(fieldName, value, fieldDef, formData) {
  const errors = [];
  const warnings = [];

  // Skip validation for complex types (arrays, objects)
  if (fieldDef.type === 'OpeningHours' || fieldDef.type === 'Array') {
    return { valid: true, errors, warnings, status: 'valid' };
  }

  // Helper to check if value is empty
  const isEmpty = (val) => {
    if (!val) return true;
    if (typeof val === 'string') return val.trim() === '';
    if (Array.isArray(val)) return val.length === 0;
    if (typeof val === 'object') return Object.keys(val).length === 0;
    return false;
  };

  // Required field check
  if (fieldDef.required && isEmpty(value)) {
    errors.push('This field is required');
    return { valid: false, errors, warnings, status: 'error' };
  }

  // Recommended field check
  if (fieldDef.recommended && isEmpty(value)) {
    warnings.push('This field is recommended for better SEO');
    return { valid: true, errors, warnings, status: 'warning' };
  }

  // If empty and optional, it's valid
  if (isEmpty(value)) {
    return { valid: true, errors, warnings, status: 'empty' };
  }

  // Type-specific validation
  switch (fieldDef.type) {
    case 'URL':
      return validateURL(value, fieldDef);

    case 'Email':
      return validateEmail(value);

    case 'Number':
      return validateNumber(value, fieldDef);

    case 'Text':
      return validateText(value, fieldDef);

    case 'DateTime':
    case 'Date':
      return validateDate(value);

    default:
      return { valid: true, errors, warnings, status: 'valid' };
  }
}

function validateURL(value, fieldDef) {
  const errors = [];
  const warnings = [];

  try {
    const url = new URL(value);

    // Check protocol
    if (url.protocol === 'http:') {
      warnings.push('Consider using HTTPS instead of HTTP for better security');
    }

    // Check for relative URLs (must be absolute)
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      errors.push('URL must be absolute (include https://)');
      return { valid: false, errors, warnings, status: 'error' };
    }

    return {
      valid: true,
      errors,
      warnings,
      status: warnings.length > 0 ? 'warning' : 'valid'
    };
  } catch (e) {
    errors.push('Invalid URL format. Example: https://example.com');
    return { valid: false, errors, warnings, status: 'error' };
  }
}

function validateEmail(value) {
  const errors = [];
  const warnings = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    errors.push('Invalid email format. Example: user@example.com');
    return { valid: false, errors, warnings, status: 'error' };
  }

  return { valid: true, errors, warnings, status: 'valid' };
}

function validateNumber(value, fieldDef) {
  const errors = [];
  const warnings = [];

  const num = parseFloat(value);

  if (isNaN(num)) {
    errors.push('Must be a valid number');
    return { valid: false, errors, warnings, status: 'error' };
  }

  if (fieldDef.min !== undefined && num < fieldDef.min) {
    errors.push(`Value must be at least ${fieldDef.min}`);
    return { valid: false, errors, warnings, status: 'error' };
  }

  if (fieldDef.max !== undefined && num > fieldDef.max) {
    errors.push(`Value must be at most ${fieldDef.max}`);
    return { valid: false, errors, warnings, status: 'error' };
  }

  return { valid: true, errors, warnings, status: 'valid' };
}

function validateText(value, fieldDef) {
  const errors = [];
  const warnings = [];

  // Max length check
  if (fieldDef.maxLength && value.length > fieldDef.maxLength) {
    errors.push(`Exceeds maximum length of ${fieldDef.maxLength} characters`);
    return { valid: false, errors, warnings, status: 'error' };
  }

  // Warning at 80% capacity
  if (fieldDef.maxLength && value.length > fieldDef.maxLength * 0.8) {
    warnings.push(`Approaching character limit (${value.length}/${fieldDef.maxLength})`);
    return { valid: true, errors, warnings, status: 'warning' };
  }

  return { valid: true, errors, warnings, status: 'valid' };
}

function validateDate(value) {
  const errors = [];
  const warnings = [];

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    errors.push('Invalid date format');
    return { valid: false, errors, warnings, status: 'error' };
  }

  return { valid: true, errors, warnings, status: 'valid' };
}

// Get visual indicator for field status
export function getFieldStatusIcon(status) {
  switch (status) {
    case 'valid':
      return { icon: 'check', color: 'text-green-600', bgColor: 'bg-green-50' };
    case 'warning':
      return { icon: 'alert', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    case 'error':
      return { icon: 'x', color: 'text-red-600', bgColor: 'bg-red-50' };
    case 'empty':
    default:
      return { icon: null, color: '', bgColor: '' };
  }
}

// Get character counter color based on usage
export function getCharCounterColor(current, max) {
  if (!max) return 'text-gray-500';

  const percentage = (current / max) * 100;

  if (percentage >= 100) return 'text-red-600 font-semibold';
  if (percentage >= 80) return 'text-yellow-600 font-medium';
  return 'text-gray-500';
}
