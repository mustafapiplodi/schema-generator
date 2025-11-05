/**
 * Level 2: JSON-LD Structure Validator
 * Validates JSON-LD structure requirements
 */

export function validateJSONLDStructure(schema) {
  const errors = [];

  // Check for @context
  if (!schema['@context']) {
    errors.push({
      severity: 'error',
      message: 'Missing @context property',
      detail: '@context must be "https://schema.org" for valid JSON-LD'
    });
  } else if (schema['@context'] !== 'https://schema.org') {
    errors.push({
      severity: 'error',
      message: 'Invalid @context value',
      detail: '@context must be exactly "https://schema.org"'
    });
  }

  // Check for @type
  if (!schema['@type']) {
    errors.push({
      severity: 'error',
      message: 'Missing @type property',
      detail: '@type is required to specify the schema type'
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
