import { describe, expect, it } from 'vitest';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES } from '../constants/fines-reports-report-summary-report-types.constant';
import { FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY } from '../constants/fines-reports-report-summary-status-display.constant';
import { FINES_REPORTS_REPORT_SUMMARY_STATUSES } from '../constants/fines-reports-report-summary-statuses.constant';
import { OPAL_FINES_REPORT_INSTANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-report-instance.mock';
import { mapFinesReportsReportInstanceToReportSummary } from './fines-reports-report-summary-map-report-instance.utils';

describe('mapFinesReportsReportInstanceToReportSummary', () => {
  it('should map a live report instance into the summary model', () => {
    const result = mapFinesReportsReportInstanceToReportSummary(
      OPAL_FINES_REPORT_INSTANCE_MOCK,
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );

    expect(result).toEqual({
      report_instance_id: '12345',
      report_id: 'operational_report_enforcement',
      report_reference: 'ABDC',
      report_type: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary,
      status: FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY[FINES_REPORTS_REPORT_SUMMARY_STATUSES.ready],
      date_created: '2006-06-01T10:36:00',
      business_units: ['London North West'],
      number_of_records: 1245,
      created_by: 'john.smith',
      criteria: [
        { name: 'Report Type', value: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary, optional: false },
        { name: 'Enforcement', value: 'Last enforcement - Bail warrant - Dated (BWTD)', optional: false },
        { name: 'Action date', value: 'From 01 May 2006 to 30 June 2006', optional: false },
        { name: 'Account type', value: ['Adult', 'Youth', 'Company'], optional: false },
        { name: 'Account status', value: 'Live', optional: false },
        { name: 'Collection order', value: 'All accounts', optional: false },
        { name: 'Minimum account balance', value: '10.00', optional: false },
        { name: 'Maximum account balance', value: '1000.00', optional: false },
        { name: 'Lower name range', value: '0', optional: false },
        { name: 'Upper name range', value: 'Z', optional: false },
      ],
      errors: [],
    });
  });

  it('should fall back to the route-specific report type when the API payload does not include one', () => {
    const result = mapFinesReportsReportInstanceToReportSummary(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        report_parameters: {},
      },
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    );

    expect(result.report_type).toBe(FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed);
    expect(result.criteria[0]).toEqual({
      name: 'Report Type',
      value: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed,
      optional: false,
    });
  });

  it('should normalise report type aliases into display values', () => {
    const result = mapFinesReportsReportInstanceToReportSummary(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        report_parameters: {
          reportType: 'detail',
        },
      },
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    );

    expect(result.report_type).toBe(FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed);
    expect(result.criteria[0]).toEqual({
      name: 'Report Type',
      value: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed,
      optional: false,
    });
  });

  it('should combine payment date range parameters into one criteria row', () => {
    const result = mapFinesReportsReportInstanceToReportSummary(
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

    expect(result.criteria).toEqual([
      { name: 'Report Type', value: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed, optional: false },
      { name: 'Payment date', value: 'From 01 May 2006 to 30 June 2006', optional: false },
      { name: 'Account type', value: ['Adult', 'Youth', 'Company'], optional: false },
    ]);
  });

  it('should flatten API error maps into named rows', () => {
    const result = mapFinesReportsReportInstanceToReportSummary(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        status: {
          code: FINES_REPORTS_REPORT_SUMMARY_STATUSES.error,
          display_name: FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY[FINES_REPORTS_REPORT_SUMMARY_STATUSES.error],
        },
        errors: [
          {
            operationId: 'ERROR-ID',
            error: 'Generation failed',
          },
        ],
      },
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );

    expect(result.errors).toEqual([
      { name: 'Operation ID', value: 'ERROR-ID', optional: false },
      { name: 'Error description', value: 'Generation failed', optional: false },
    ]);
  });
});
