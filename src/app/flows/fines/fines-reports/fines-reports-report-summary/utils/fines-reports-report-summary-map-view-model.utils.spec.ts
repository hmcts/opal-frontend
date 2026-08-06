import { describe, expect, it } from 'vitest';
import { DateTime } from 'luxon';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { OPAL_FINES_REPORT_INSTANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-report-instance.mock';
import { FINES_REPORTS_REPORT_SUMMARY_STATUSES } from '../constants/fines-reports-report-summary-statuses.constant';
import { mapFinesReportsReportInstanceToViewModel } from './fines-reports-report-summary-map-view-model.utils';

describe('mapFinesReportsReportInstanceToViewModel', () => {
  const dateService = {
    getFromIso: (value: string) => DateTime.fromISO(value),
    toFormat: (value: DateTime, format: string) => value.toFormat(format),
  } as DateService;

  it('maps the fixed General section without generic display rows', () => {
    const result = mapFinesReportsReportInstanceToViewModel(OPAL_FINES_REPORT_INSTANCE_MOCK, null, '', dateService);

    expect(result.general).toEqual({
      status: 'Ready',
      dateCreated: DateTime.fromISO('2006-06-01T10:36:00').toMillis(),
      businessUnits: 'London North West',
      numberOfRecords: 1245,
      createdBy: 'john.smith',
    });
  });

  it('keeps visible report criteria in the received parameter order', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        report_parameters: {
          accountStatus: 'LIVE',
          reportType: 'SUMMARY',
          includeAdult: true,
          minBalance: '120.50',
        },
      },
      null,
      '',
      dateService,
    );

    expect(result.criteriaRows).toEqual([
      { key: 'Account status', value: 'Live' },
      { key: 'Report Type', value: 'Summary' },
      { key: 'Account type', value: 'Adult' },
      { key: 'Minimum account balance', value: 120.5, isCurrency: true },
    ]);
  });

  it('does not create an action-date row when both supplied date values are empty', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        report_parameters: {
          reportType: 'SUMMARY',
          lastActionDateFrom: '',
          lastActionDateTo: '',
        },
      },
      null,
      '',
      dateService,
    );

    expect(result.criteriaRows).toEqual([{ key: 'Report Type', value: 'Summary' }]);
  });

  it('uses the shared DateService to format an action-date range', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        report_parameters: {
          lastActionDateFrom: '2006-05-01',
          lastActionDateTo: '2006-06-30',
        },
      },
      null,
      '',
      dateService,
    );

    expect(result.criteriaRows).toEqual([{ key: 'Action date', value: 'From 01 May 2006 to 30 Jun 2006' }]);
  });

  it('uses the fixed General record count rule for in-progress reports', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        status: { code: FINES_REPORTS_REPORT_SUMMARY_STATUSES.inProgress, display_name: 'In progress' },
      },
      null,
      '',
      dateService,
    );

    expect(result.general.status).toBe('In progress');
    expect(result.general.numberOfRecords).toBeNull();
  });

  it('shows error rows only for error reports', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        status: { code: FINES_REPORTS_REPORT_SUMMARY_STATUSES.error, display_name: 'Error' },
        errors: [{ report_generation_error: 'Report timed out' }],
      },
      null,
      '',
      dateService,
    );

    expect(result.errorRows).toEqual([{ key: 'Report generation error', value: 'Report timed out' }]);
  });

  it('uses the report ID when the report type parameter is missing or unsupported', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        report: { ...OPAL_FINES_REPORT_INSTANCE_MOCK.report, id: 'operational_report_payment' },
        report_parameters: { reportType: 'UNSUPPORTED' },
      },
      null,
      '',
      dateService,
    );

    expect(result.reportType).toBe('Detail');
  });

  it('maps the legacy detail report type alias to the Detail display value', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        report_parameters: { reportType: 'detail' },
      },
      null,
      '',
      dateService,
    );

    expect(result.reportType).toBe('Detail');
  });
});
