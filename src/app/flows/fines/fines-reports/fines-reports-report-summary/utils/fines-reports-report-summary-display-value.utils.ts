import { DateService } from '@hmcts/opal-frontend-common/services/date-service';

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

  if (value !== null && typeof value === 'object') {
    return JSON.stringify(value);
  }

  return value === null || value === undefined ? '' : String(value);
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
 * Formats an ISO date supplied in a report parameter through Opal's shared DateService. The
 * service is supplied by the resolver in production; without it, the source value is retained.
 */
export const getCriteriaDateDisplayValue = (value: unknown, dateService: DateService): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return '';
  }

  const date = dateService.getFromIso(value);

  return date.isValid ? dateService.toFormat(date.setLocale('en-gb'), 'dd MMM yyyy') : value.trim();
};
