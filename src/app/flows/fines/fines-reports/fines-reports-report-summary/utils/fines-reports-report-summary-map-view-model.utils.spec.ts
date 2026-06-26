import { describe, expect, it } from 'vitest';
import {
  FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK,
  FINES_REPORTS_REPORT_SUMMARY_ERROR_MOCK,
  FINES_REPORTS_REPORT_SUMMARY_PAYMENTS_MOCK,
} from '../mocks/fines-reports-report-summary.mock';
import { mapFinesReportsReportSummaryToViewModel } from './fines-reports-report-summary-map-view-model.utils';

describe('mapFinesReportsReportSummaryToViewModel', () => {
  it('should map requested reports to in progress and hide record count', () => {
    const result = mapFinesReportsReportSummaryToViewModel(FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK);

    expect(result.generalRows).toEqual([
      { key: 'Status', value: 'In progress', type: 'text' },
      { key: 'Date Created', value: '2025-10-17T09:30:00.000Z', type: 'dateTime' },
      { key: 'Business Units', value: 'West London, South London', type: 'text' },
      { key: 'No. of Records', value: null, type: 'notProvided' },
      { key: 'Created By', value: 'jane.doe', type: 'text' },
    ]);
  });

  it('should map ready reports with no records to no content', () => {
    const result = mapFinesReportsReportSummaryToViewModel(FINES_REPORTS_REPORT_SUMMARY_PAYMENTS_MOCK);

    expect(result.generalRows[0]).toEqual({ key: 'Status', value: 'No content', type: 'text' });
    expect(result.generalRows[3]).toEqual({ key: 'No. of Records', value: 0, type: 'number' });
  });

  it('should preserve criteria order and hide unused optional values', () => {
    const result = mapFinesReportsReportSummaryToViewModel(FINES_REPORTS_REPORT_SUMMARY_PAYMENTS_MOCK);

    expect(result.criteriaRows).toEqual([
      { key: 'Report Type', value: 'Detailed', type: 'text' },
      { key: 'Account type', value: 'Adult, Company', type: 'text' },
      { key: 'Account status', value: 'Closed', type: 'text' },
      { key: 'Collection order', value: 'With collection order', type: 'text' },
    ]);
  });

  it('should map boolean criteria values as uppercase text', () => {
    const result = mapFinesReportsReportSummaryToViewModel(FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK);

    expect(result.criteriaRows).toContainEqual({
      key: 'Only accounts with initial or full payment due in the next 7 days',
      value: 'TRUE',
      type: 'text',
    });
  });

  it('should only show error rows for reports in error', () => {
    const nonErrorResult = mapFinesReportsReportSummaryToViewModel({
      ...FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK,
      errors: FINES_REPORTS_REPORT_SUMMARY_ERROR_MOCK.errors,
    });
    const errorResult = mapFinesReportsReportSummaryToViewModel(FINES_REPORTS_REPORT_SUMMARY_ERROR_MOCK);

    expect(nonErrorResult.errorRows).toEqual([]);
    expect(errorResult.generalRows[0]).toEqual({ key: 'Status', value: 'Error', type: 'text' });
    expect(errorResult.generalRows[3]).toEqual({
      key: 'No. of Records',
      value: null,
      type: 'notProvided',
    });
    expect(errorResult.errorRows).toEqual([
      { key: 'Report generation error', value: 'Legacy report timed out', type: 'text' },
      { key: 'Report service', value: 'No response from reporting engine', type: 'text' },
    ]);
  });
});
