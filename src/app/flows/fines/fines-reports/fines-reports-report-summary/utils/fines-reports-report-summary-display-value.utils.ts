import { DateService } from '@hmcts/opal-frontend-common/services/date-service';

/**
 * Identifies optional API values that should not create an empty row in the summary.
 *
 * @param value - The optional API value to inspect.
 * @returns Whether the value is null, undefined, an empty string or an empty array.
 */
export const isUnusedOptionalValue = (value: unknown): boolean => {
  return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
};

/**
 * Converts the API's untyped parameter values into the plain text shown in a summary row.
 *
 * @param value - The API value to display, including arrays, objects and primitives.
 * @returns Display text with comma-separated arrays, JSON objects and uppercase booleans; absent or unsupported values become empty text.
 */
export const mapDisplayText = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.map((item) => (item && typeof item === 'object' ? JSON.stringify(item) : String(item))).join(', ');
  }

  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }

  if (value !== null && typeof value === 'object') {
    return JSON.stringify(value);
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return '';
};

/**
 * Preserves a numeric money value for Angular's currency pipe, while safely retaining non-numeric API values.
 *
 * @param value - The API money value to convert after removing pound signs, commas and whitespace.
 * @returns The parsed number, or the display text when numeric conversion fails; empty text converts to zero.
 */
export const mapCurrencyValue = (value: unknown): number | string => {
  const text = mapDisplayText(value);
  const numericValue = Number(text.replace(/[£,\s]/g, ''));

  return Number.isNaN(numericValue) ? text : numericValue;
};

/**
 * Formats an ISO date supplied in a report parameter through Opal's shared DateService.
 *
 * @param value - The ISO date parameter supplied by the API.
 * @param dateService - The shared service used to parse and format dates.
 * @returns The date formatted as dd MMM yyyy, the trimmed original text for an invalid date, or empty text for a blank or non-string value.
 */
export const getCriteriaDateDisplayValue = (value: unknown, dateService: DateService): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return '';
  }

  const date = dateService.getFromIso(value);

  return date.isValid ? dateService.toFormat(date.setLocale('en-gb'), 'dd MMM yyyy') : value.trim();
};
