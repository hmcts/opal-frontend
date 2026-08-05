import { describe, expect, it } from 'vitest';
import { OPAL_FINES_REPORT_INSTANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-report-instance.mock';
import { FINES_REPORTS_REPORT_SUMMARY_STATUSES } from '../constants/fines-reports-report-summary-statuses.constant';
import { mapFinesReportsReportInstanceToViewModel } from './fines-reports-report-summary-map-view-model.utils';

describe('mapFinesReportsReportInstanceToViewModel', () => {
  it('maps the fixed General section without generic display rows', () => {
    const result = mapFinesReportsReportInstanceToViewModel(OPAL_FINES_REPORT_INSTANCE_MOCK);

    expect(result.general).toEqual({
      status: 'Ready',
      dateCreated: Date.parse('2006-06-01T10:36:00'),
      businessUnits: 'London North West',
      numberOfRecords: 1245,
      createdBy: 'john.smith',
    });
  });

  it('keeps report criteria in their fixed screen order', () => {
    const result = mapFinesReportsReportInstanceToViewModel({
      ...OPAL_FINES_REPORT_INSTANCE_MOCK,
      report_parameters: { minBalance: '120.50', includeAdult: true, reportType: 'SUMMARY' },
    });

    expect(result.criteriaRows).toEqual([
      { key: 'Report Type', value: 'Summary' },
      { key: 'Payments made', value: '' },
      { key: 'Payment report mode', value: '' },
      { key: 'Account type', value: 'Adult' },
      { key: 'Minimum account balance', value: 120.5, isCurrency: true },
    ]);
  });

  it('uses the fixed General record count rule for in-progress reports', () => {
    const result = mapFinesReportsReportInstanceToViewModel({
      ...OPAL_FINES_REPORT_INSTANCE_MOCK,
      status: { code: FINES_REPORTS_REPORT_SUMMARY_STATUSES.inProgress, display_name: 'In progress' },
    });

    expect(result.general.status).toBe('In progress');
    expect(result.general.numberOfRecords).toBeNull();
  });

  it('shows error rows only for error reports', () => {
    const result = mapFinesReportsReportInstanceToViewModel({
      ...OPAL_FINES_REPORT_INSTANCE_MOCK,
      status: { code: FINES_REPORTS_REPORT_SUMMARY_STATUSES.error, display_name: 'Error' },
      errors: [{ report_generation_error: 'Report timed out' }],
    });

    expect(result.errorRows).toEqual([{ key: 'Report generation error', value: 'Report timed out' }]);
  });

  it('uses the report ID when the report type parameter is missing or unsupported', () => {
    const result = mapFinesReportsReportInstanceToViewModel({
      ...OPAL_FINES_REPORT_INSTANCE_MOCK,
      report: { ...OPAL_FINES_REPORT_INSTANCE_MOCK.report, id: 'operational_report_payment' },
      report_parameters: { reportType: 'UNSUPPORTED' },
    });

    expect(result.reportType).toBe('Detail');
  });
});
