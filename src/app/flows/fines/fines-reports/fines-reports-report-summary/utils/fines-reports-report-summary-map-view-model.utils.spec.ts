import { describe, expect, it } from 'vitest';
import { OPAL_FINES_REPORT_INSTANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-report-instance.mock';
import { OPAL_FINES_RESULT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-result-ref-data.mock';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES } from '../constants/fines-reports-report-summary-report-types.constant';
import { FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY } from '../constants/fines-reports-report-summary-status-display.constant';
import { FINES_REPORTS_REPORT_SUMMARY_STATUSES } from '../constants/fines-reports-report-summary-statuses.constant';
import { mapFinesReportsReportInstanceToViewModel } from './fines-reports-report-summary-map-view-model.utils';

describe('mapFinesReportsReportInstanceToViewModel', () => {
  it('should map a ready report instance straight into the summary view model', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        report_parameters: {
          reportType: 'SUMMARY',
          businessUnitIds: [77],
          reportEnforcementMode: 'ALL',
          includeAdult: true,
          includeYouth: true,
          includeCompany: true,
        },
      },
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );

    expect(result.reportId).toBe('operational_report_enforcement');
    expect(result.reportReference).toBe('ABDC');
    expect(result.reportType).toBe(FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary);
    expect(result.generalRows).toEqual([
      { key: 'Status', value: 'Ready', type: 'text' },
      { key: 'Date Created', value: Date.parse('2006-06-01T10:36:00'), type: 'dateTime' },
      { key: 'Business Units', value: 'London North West', type: 'text' },
      { key: 'No. of Records', value: 1245, type: 'number' },
      { key: 'Created By', value: 'john.smith', type: 'text' },
    ]);
    expect(result.criteriaRows).toEqual([
      { key: 'Report Type', value: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary, type: 'text' },
      { key: 'Enforcement', value: 'All accounts', type: 'text' },
      { key: 'Account type', value: 'Adult, Youth, Company', type: 'text' },
    ]);
  });

  it('should map a report timestamp with fractional seconds for the date pipe', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        requested_at: '2026-07-16T16:13:08.600123',
      },
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );

    expect(result.generalRows[1]).toEqual({
      key: 'Date Created',
      value: Date.parse('2026-07-16T16:13:08.600123'),
      type: 'dateTime',
    });
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

  it('should map operational payment parameters into user-facing criteria rows', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        report: {
          ...OPAL_FINES_REPORT_INSTANCE_MOCK.report,
          id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
        },
        report_parameters: {
          reportType: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed,
          businessUnitIds: [77],
          isPaymentMade: true,
          reportMode: 'SINCE_DATE',
          sinceDate: '2026-01-01',
          includeAdult: true,
          includeYouth: true,
          includeCompany: true,
        },
      },
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    );

    expect(result.criteriaRows).toEqual([
      { key: 'Report Type', value: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed, type: 'text' },
      { key: 'Payments made', value: 'Yes', type: 'text' },
      { key: 'Payment report mode', value: 'Since date', type: 'text' },
      { key: 'Since date', value: '01 Jan 2026', type: 'text' },
      { key: 'Account type', value: 'Adult, Youth, Company', type: 'text' },
    ]);
  });

  it('should group a partial last-action date range with its operational enforcement criteria', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        report_parameters: {
          reportType: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary,
          businessUnitIds: [77],
          reportEnforcementMode: 'LAST_ACTION',
          enforcementAction: 'NOENF',
          lastActionDateFrom: '2026-01-01',
          includeAdult: true,
        },
      },
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
      {
        ...OPAL_FINES_RESULT_REF_DATA_MOCK,
        result_id: 'BWTD',
        result_title: 'Bail Warrant - dated',
      },
    );

    expect(result.criteriaRows).toEqual([
      { key: 'Report Type', value: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary, type: 'text' },
      { key: 'Enforcement', value: 'Last enforcement - Bail Warrant - dated (BWTD)', type: 'text' },
      { key: 'Action date', value: 'From 01 Jan 2026', type: 'text' },
      { key: 'Account type', value: 'Adult', type: 'text' },
    ]);
  });

  it('should map the full operational enforcement criteria in the API response order', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        report_parameters: {
          reportType: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary,
          businessUnitIds: [77],
          reportEnforcementMode: 'ALL',
          includeAdult: true,
          includeYouth: true,
          includeCompany: true,
          onlyAccountsWithParentGuardian: true,
          accountStatus: 'LIVE',
          collectionOrderChoice: 'ALL',
          minBalance: '120.50',
          maxBalance: '1000.00',
          firstPaymentOrPayByInNext7Days: true,
          lowerNameRange: 'A',
          upperNameRange: 'Z',
        },
      },
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );

    expect(result.criteriaRows).toEqual([
      { key: 'Report Type', value: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary, type: 'text' },
      { key: 'Enforcement', value: 'All accounts', type: 'text' },
      {
        key: 'Account type',
        value: 'Adult, Youth, Company, Only accounts with parent or guardian to pay',
        type: 'text',
      },
      { key: 'Account status', value: 'Live', type: 'text' },
      { key: 'Collection order', value: 'All accounts', type: 'text' },
      { key: 'Minimum account balance', value: 120.5, type: 'currency' },
      { key: 'Maximum account balance', value: 1000, type: 'currency' },
      {
        key: 'Only accounts with initial or full payment due in the next 7 days',
        value: 'TRUE',
        type: 'text',
      },
      { key: 'Lower name range', value: 'A', type: 'text' },
      { key: 'Upper name range', value: 'Z', type: 'text' },
    ]);
  });

  it('should ignore report parameters that are not part of the operational report contract', () => {
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

    expect(result.criteriaRows).not.toContainEqual({
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

  it('should use the status code when backend display wording changes', () => {
    const result = mapFinesReportsReportInstanceToViewModel(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        number_of_records: 0,
        status: {
          code: FINES_REPORTS_REPORT_SUMMARY_STATUSES.ready,
          display_name: 'Available to download',
        },
      },
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );

    expect(result.generalRows[0]).toEqual({ key: 'Status', value: 'No content', type: 'text' });
    expect(result.generalRows[3]).toEqual({ key: 'No. of Records', value: 0, type: 'number' });
    expect(result.errorRows).toEqual([]);
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
          {
            report_generation_error: 'Reporting service connection was reset',
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
      { key: 'Report generation error', value: 'Reporting service connection was reset', type: 'text' },
    ]);
  });
});
