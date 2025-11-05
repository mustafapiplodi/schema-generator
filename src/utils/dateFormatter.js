/**
 * ISO 8601 Date Formatting Utilities
 * Ensures dates are properly formatted for Schema.org compliance
 */

export function formatISO8601(date, includeTime = true, timezone = '+00:00') {
  if (!date) return '';

  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return '';
  }

  if (!includeTime) {
    return d.toISOString().split('T')[0];
  }

  // Format: 2024-01-05T08:00:00+08:00
  return d.toISOString().slice(0, 19) + timezone;
}

export function getCurrentISODate(includeTime = true) {
  return formatISO8601(new Date(), includeTime);
}

export function validateISODate(dateString) {
  if (!dateString) return { valid: false, message: 'Date is required' };

  // ISO 8601 format: YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS+TZ
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)?)?$/;

  if (!isoDateRegex.test(dateString)) {
    return {
      valid: false,
      message: 'Date must be in ISO 8601 format. Example: 2024-01-05T08:00:00+08:00'
    };
  }

  return { valid: true };
}
