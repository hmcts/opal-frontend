import { formatDate } from '@angular/common';

/**
 * Identifies optional API values that should not create an empty row in the summary.
 */
export const isUnusedOptionalValue = (value: unknown): boolean => {
  return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
};

/**
 * Converts the API's untyped parameter values into the plain text shown in a summary row.
 */
export const mapDisplayText = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.map((item) => (item && typeof item === 'object' ? JSON.stringify(item) : String(item))).join(', ');
  }

  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }

  return value && typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
};

/**
 * Preserves a numeric money value for Angular's currency pipe, while safely retaining non-numeric API values.
 */
export const mapCurrencyValue = (value: unknown): number | string => {
  const text = mapDisplayText(value);
  const numericValue = Number(text.replace(/[£,\s]/g, ''));

  return Number.isNaN(numericValue) ? text : numericValue;
};

/**
 * Formats an ISO date supplied in a report parameter for the summary screen.
 */
export const getCriteriaDateDisplayValue = (value: unknown): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return '';
  }

  const date = Date.parse(value);

  return Number.isNaN(date) ? value.trim() : formatDate(date, 'dd MMM yyyy', 'en-GB');
};
