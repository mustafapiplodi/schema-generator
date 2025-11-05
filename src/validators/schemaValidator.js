/**
 * Level 3: Schema.org Compliance Validator
 * Validates against Schema.org vocabulary and type requirements
 */

import { validateISODate } from '../utils/dateFormatter.js';
import { validateURL, validateEmail, validatePhoneNumber } from '../utils/formToSchema.js';

export function validateSchemaCompliance(schema, schemaDefinition) {
  const errors = [];
  const warnings = [];

  if (!schemaDefinition) {
    return { valid: true, errors: [], warnings: [] };
  }

  // Check required properties
  schemaDefinition.required?.forEach(prop => {
    if (!schema[prop] || schema[prop] === '') {
      errors.push({
        severity: 'error',
        message: `Missing required property: ${prop}`,
        detail: schemaDefinition.properties[prop]?.description || `${prop} is required for this schema type`
      });
    }
  });

  // Check recommended properties (generate warnings)
  schemaDefinition.recommended?.forEach(prop => {
    if (!schema[prop] || schema[prop] === '') {
      warnings.push({
        severity: 'warning',
        message: `Missing recommended property: ${prop}`,
        detail: schemaDefinition.properties[prop]?.description || `${prop} is recommended for better rich result eligibility`
      });
    }
  });

  // Validate property types
  Object.entries(schema).forEach(([key, value]) => {
    if (key.startsWith('@')) return; // Skip @context, @type, etc.

    const propDef = schemaDefinition.properties?.[key];
    if (!propDef) return;

    // Validate based on expected type
    switch (propDef.type) {
      case 'URL':
        if (typeof value === 'string') {
          const urlValidation = validateURL(value);
          if (!urlValidation.valid) {
            errors.push({
              severity: 'error',
              message: `Invalid URL for ${key}`,
              detail: urlValidation.message
            });
          }
        }
        break;

      case 'Date':
      case 'DateTime':
        if (typeof value === 'string') {
          const dateValidation = validateISODate(value);
          if (!dateValidation.valid) {
            errors.push({
              severity: 'error',
              message: `Invalid date format for ${key}`,
              detail: dateValidation.message
            });
          }
        }
        break;

      case 'Number':
        if (typeof value !== 'number' && isNaN(Number(value))) {
          errors.push({
            severity: 'error',
            message: `Invalid number for ${key}`,
            detail: `${key} must be a valid number`
          });
        }
        break;
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
