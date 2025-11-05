/**
 * Level 1: JSON Syntax Validator
 * Validates basic JSON syntax correctness
 */

export function validateJSONSyntax(jsonString) {
  const errors = [];

  if (!jsonString || jsonString.trim() === '') {
    return {
      valid: false,
      errors: [{ severity: 'critical', message: 'JSON content is empty' }]
    };
  }

  try {
    JSON.parse(jsonString);
    return { valid: true, errors: [] };
  } catch (error) {
    return {
      valid: false,
      errors: [{
        severity: 'critical',
        message: `JSON Syntax Error: ${error.message}`,
        detail: 'The generated JSON is malformed. This should not happen - please report this issue.'
      }]
    };
  }
}
