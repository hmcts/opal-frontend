import { describe, expect, it } from 'vitest';
import { OPAL_FINES_REPORT_INSTANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-report-instance.mock';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES } from '../constants/fines-reports-report-summary-report-types.constant';
import { FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY } from '../constants/fines-reports-report-summary-status-display.constant';
import { FINES_REPORTS_REPORT_SUMMARY_STATUSES } from '../constants/fines-reports-report-summary-statuses.constant';
import { mapFinesReportsReportInstanceToViewModel } from './fines-reports-report-summary-map-view-model.utils';

describe('mapFinesReportsReportInstanceToViewModel', () => {
  it('should map a ready report instance straight into the summary view model', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      OPAL_FINES_REPORT_INSTANCE_MOCK,
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );

    expect(result.reportId).toBe('operational_report_enforcement');
    expect(result.reportReference).toBe('ABDC');
    expect(result.reportType).toBe(FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary);
    expect(result.generalRows).toEqual([
      { key: 'Status', value: 'Ready', type: 'text' },
      { key: 'Date Created', value: '2006-06-01T10:36:00', type: 'dateTime' },
      { key: 'Business Units', value: 'London North West', type: 'text' },
      { key: 'No. of Records', value: 1245, type: 'number' },
      { key: 'Created By', value: 'john.smith', type: 'text' },
    ]);
    expect(result.criteriaRows).toEqual([
      { key: 'Report Type', value: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary, type: 'text' },
      { key: 'Action date', value: 'From 01 May 2006 to 30 June 2006', type: 'text' },
      { key: 'Enforcement', value: 'Last enforcement - Bail warrant - Dated (BWTD)', type: 'text' },
      { key: 'Account type', value: 'Adult, Youth, Company', type: 'text' },
      { key: 'Account status', value: 'Live', type: 'text' },
      { key: 'Collection order', value: 'All accounts', type: 'text' },
      { key: 'Minimum account balance', value: 10, type: 'currency' },
      { key: 'Maximum account balance', value: 1000, type: 'currency' },
      { key: 'Lower name range', value: '0', type: 'text' },
      { key: 'Upper name range', value: 'Z', type: 'text' },
    ]);
  });

  it('should fall back to the route-specific report type when the API payload does not include one', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        report_parameters: {},
      },
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    );

    expect(result.reportType).toBe(FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed);
    expect(result.criteriaRows[0]).toEqual({
      key: 'Report Type',
      value: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed,
      type: 'text',
    });
  });

  it('should normalise report type aliases into display values', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        report_parameters: {
          reportType: 'detail',
        },
      },
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    );

    expect(result.reportType).toBe(FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed);
    expect(result.criteriaRows[0]).toEqual({
      key: 'Report Type',
      value: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed,
      type: 'text',
    });
  });

  it('should combine payment date range parameters into one criteria row', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        report: {
          ...OPAL_FINES_REPORT_INSTANCE_MOCK.report,
          id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
        },
        report_parameters: {
          reportType: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed,
          payment_date_from: '01 May 2006',
          payment_date_to: '30 June 2006',
          account_type: ['Adult', 'Youth', 'Company'],
        },
      },
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    );

    expect(result.criteriaRows).toEqual([
      { key: 'Report Type', value: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed, type: 'text' },
      { key: 'Payment date', value: 'From 01 May 2006 to 30 June 2006', type: 'text' },
      { key: 'Account type', value: 'Adult, Youth, Company', type: 'text' },
    ]);
  });

  it('should show a partial action date range when only one date is supplied', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        report_parameters: {
          reportType: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary,
          action_date_from: '01 May 2006',
          account_type: ['Adult'],
        },
      },
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );

    expect(result.criteriaRows).toContainEqual({
      key: 'Action date',
      value: 'From 01 May 2006',
      type: 'text',
    });
  });

  it('should leave unknown report parameter keys unchanged', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        report_parameters: {
          reportType: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary,
          unknown_parameter_key: 'Unknown value',
        },
      },
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );

    expect(result.criteriaRows).toContainEqual({
      key: 'unknown_parameter_key',
      value: 'Unknown value',
      type: 'text',
    });
  });

  it('should map in-progress reports to in progress and hide record count', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        status: {
          code: FINES_REPORTS_REPORT_SUMMARY_STATUSES.inProgress,
          display_name: 'In progress',
        },
      },
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );

    expect(result.generalRows[0]).toEqual({ key: 'Status', value: 'In progress', type: 'text' });
    expect(result.generalRows[3]).toEqual({ key: 'No. of Records', value: null, type: 'notProvided' });
  });

  it('should map ready reports with no records to no content status and show zero records', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        number_of_records: 0,
      },
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );

    expect(result.generalRows[0]).toEqual({ key: 'Status', value: 'No content', type: 'text' });
    expect(result.generalRows[3]).toEqual({ key: 'No. of Records', value: 0, type: 'number' });
  });

  it('should only show error rows for reports in error', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        status: {
          code: FINES_REPORTS_REPORT_SUMMARY_STATUSES.error,
          display_name: FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY[FINES_REPORTS_REPORT_SUMMARY_STATUSES.error],
        },
        errors: [
          {
            report_generation_error: 'Legacy report timed out',
            report_service: 'No response from reporting engine',
          },
        ],
      },
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );

    expect(result.generalRows[0]).toEqual({ key: 'Status', value: 'Error', type: 'text' });
    expect(result.generalRows[3]).toEqual({ key: 'No. of Records', value: null, type: 'notProvided' });
    expect(result.errorRows).toEqual([
      { key: 'Report generation error', value: 'Legacy report timed out', type: 'text' },
      { key: 'Report service', value: 'No response from reporting engine', type: 'text' },
    ]);
  });
});
