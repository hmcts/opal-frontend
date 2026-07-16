import { type IFinesReportsReportSummaryDisplayRow } from '../interfaces/fines-reports-report-summary-display-row.interface';

/**
 * Checks whether an optional API value should be hidden from the summary rows.
 */
export const isFinesReportsReportSummaryUnusedOptionalValue = (value: unknown): boolean => {
  return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
};

/**
 * Converts an unknown API value into the limited value types that the summary row component can display.
 */
export const mapFinesReportsReportSummaryDisplayValue = (
  value: unknown,
): IFinesReportsReportSummaryDisplayRow['value'] => {
  if (isFinesReportsReportSummaryUnusedOptionalValue(value)) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map((item) => (item && typeof item === 'object' ? JSON.stringify(item) : String(item))).join(', ');
  }

  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }

  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }

  return typeof value === 'number' ? value : String(value);
};
