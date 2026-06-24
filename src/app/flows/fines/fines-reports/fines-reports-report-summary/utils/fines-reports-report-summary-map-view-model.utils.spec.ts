import { describe, expect, it } from 'vitest';
import {
  FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK,
  FINES_REPORTS_REPORT_SUMMARY_ERROR_MOCK,
  FINES_REPORTS_REPORT_SUMMARY_PAYMENTS_MOCK,
} from '../mocks/fines-reports-report-summary.mock';
import { FINES_DEFAULT_VALUES } from '../../../constants/fines-default-values.constant';
import { mapFinesReportsReportSummaryToViewModel } from './fines-reports-report-summary-map-view-model.utils';

describe('mapFinesReportsReportSummaryToViewModel', () => {
  it('should map requested reports to in progress and hide record count', () => {
    const result = mapFinesReportsReportSummaryToViewModel(FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK);

    expect(result.generalRows).toEqual([
      { key: 'Status', value: 'In progress' },
      { key: 'Date Created', value: '17 Oct 2025 at 09:30' },
      { key: 'Business Units', value: 'West London, South London' },
      { key: 'No. of Records', value: FINES_DEFAULT_VALUES.notProvidedLabel },
      { key: 'Created By', value: 'jane.doe' },
    ]);
  });

  it('should map ready reports with no records to no content', () => {
    const result = mapFinesReportsReportSummaryToViewModel(FINES_REPORTS_REPORT_SUMMARY_PAYMENTS_MOCK);

    expect(result.generalRows[0]).toEqual({ key: 'Status', value: 'No content' });
    expect(result.generalRows[3]).toEqual({ key: 'No. of Records', value: '0' });
  });

  it('should preserve criteria order and hide unused optional values', () => {
    const result = mapFinesReportsReportSummaryToViewModel(FINES_REPORTS_REPORT_SUMMARY_PAYMENTS_MOCK);

    expect(result.criteriaRows).toEqual([
      { key: 'Report Type', value: 'Detail' },
      { key: 'Account type', value: 'Adult, Company' },
      { key: 'Account status', value: 'Closed' },
      { key: 'Collection order', value: 'With collection order' },
    ]);
  });

  it('should map boolean criteria values as uppercase text', () => {
    const result = mapFinesReportsReportSummaryToViewModel(FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK);

    expect(result.criteriaRows).toContainEqual({
      key: 'Only accounts with initial or full payment due in the next 7 days',
      value: 'TRUE',
    });
  });

  it('should only show error rows for reports in error', () => {
    const nonErrorResult = mapFinesReportsReportSummaryToViewModel({
      ...FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK,
      errors: FINES_REPORTS_REPORT_SUMMARY_ERROR_MOCK.errors,
    });
    const errorResult = mapFinesReportsReportSummaryToViewModel(FINES_REPORTS_REPORT_SUMMARY_ERROR_MOCK);

    expect(nonErrorResult.errorRows).toEqual([]);
    expect(errorResult.generalRows[0]).toEqual({ key: 'Status', value: 'Error' });
    expect(errorResult.generalRows[3]).toEqual({
      key: 'No. of Records',
      value: FINES_DEFAULT_VALUES.notProvidedLabel,
    });
    expect(errorResult.errorRows).toEqual([
      { key: 'Report generation error', value: 'Legacy report timed out' },
      { key: 'Report service', value: 'No response from reporting engine' },
    ]);
  });
});
