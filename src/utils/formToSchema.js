/**
 * Form Data to Schema Mapping Utilities
 * Converts form inputs to valid JSON-LD schema objects
 */

export function setNestedProperty(obj, path, value) {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
}

export function cleanSchema(schema) {
  // Remove null, undefined, empty strings, empty objects, and empty arrays
  return JSON.parse(JSON.stringify(schema, (key, value) => {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) {
      return undefined;
    }
    if (Array.isArray(value) && value.length === 0) {
      return undefined;
    }
    return value;
  }));
}

export function mapFormToSchema(formData, schemaType, mapping) {
  const schema = {
    "@context": "https://schema.org",
    "@type": schemaType
  };

  Object.entries(formData).forEach(([field, value]) => {
    const path = mapping[field];
    if (path && value !== undefined && value !== null && value !== '') {
      setNestedProperty(schema, path, value);
    }
  });

  return cleanSchema(schema);
}

export function validateURL(url) {
  if (!url) return { valid: false, message: 'URL is required' };

  try {
    const urlObj = new URL(url);
    if (!urlObj.protocol.startsWith('http')) {
      return { valid: false, message: 'URL must use HTTP or HTTPS protocol' };
    }
    return { valid: true };
  } catch {
    return { valid: false, message: 'Invalid URL format. Example: https://example.com' };
  }
}

export function validateEmail(email) {
  if (!email) return { valid: false, message: 'Email is required' };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email format' };
  }
  return { valid: true };
}

export function validatePhoneNumber(phone) {
  if (!phone) return { valid: false, message: 'Phone number is required' };

  if (!phone.startsWith('+')) {
    return {
      valid: false,
      message: 'Phone must include country code with + prefix. Example: +1-555-123-4567'
    };
  }
  return { valid: true };
}
