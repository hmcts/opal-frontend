import { describe, expect, it } from 'vitest';
import {
  isFinesReportsReportSummaryUnusedOptionalValue,
  mapFinesReportsReportSummaryDisplayValue,
} from './fines-reports-report-summary-display-value.utils';

describe('finesReportsReportSummaryDisplayValueUtils', () => {
  it('should identify values that do not need to be displayed', () => {
    expect(isFinesReportsReportSummaryUnusedOptionalValue(null)).toBe(true);
    expect(isFinesReportsReportSummaryUnusedOptionalValue(undefined)).toBe(true);
    expect(isFinesReportsReportSummaryUnusedOptionalValue('')).toBe(true);
    expect(isFinesReportsReportSummaryUnusedOptionalValue([])).toBe(true);
    expect(isFinesReportsReportSummaryUnusedOptionalValue('value')).toBe(false);
  });

  it('should map missing display values to null', () => {
    expect(mapFinesReportsReportSummaryDisplayValue(null)).toBeNull();
    expect(mapFinesReportsReportSummaryDisplayValue(undefined)).toBeNull();
    expect(mapFinesReportsReportSummaryDisplayValue('')).toBeNull();
  });

  it('should preserve numeric values for number pipes', () => {
    expect(mapFinesReportsReportSummaryDisplayValue(1245)).toBe(1245);
  });

  it('should map array and boolean values to display text', () => {
    expect(mapFinesReportsReportSummaryDisplayValue(['Adult', 'Youth'])).toBe('Adult, Youth');
    expect(mapFinesReportsReportSummaryDisplayValue(true)).toBe('TRUE');
    expect(mapFinesReportsReportSummaryDisplayValue(false)).toBe('FALSE');
  });

  it('should map object values to JSON display text', () => {
    expect(mapFinesReportsReportSummaryDisplayValue({ error: 'Timed out' })).toBe('{"error":"Timed out"}');
  });
});
