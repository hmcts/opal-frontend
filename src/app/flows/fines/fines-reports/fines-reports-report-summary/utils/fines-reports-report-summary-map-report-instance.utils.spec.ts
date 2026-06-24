import { describe, expect, it } from 'vitest';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
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
      report_type: 'Summary',
      status: 'Ready',
      date_created: '2006-06-01T10:36:00.000Z',
      business_units: ['London North West'],
      number_of_records: 1245,
      created_by: 'john.smith',
      criteria: [
        { name: 'Report Type', value: 'Summary', optional: false },
        { name: 'Enforcement', value: 'Last enforcement - Bail warrant - Dated (BWTD)', optional: false },
        { name: 'Action date', value: 'From 01 May 2006 to 30 June 2006', optional: false },
        { name: 'Account type', value: 'Adult, Youth, Company', optional: false },
        { name: 'Account status', value: 'Live', optional: false },
        { name: 'Collection order', value: 'All accounts', optional: false },
        { name: 'Minimum account balance', value: '£10.00', optional: false },
        { name: 'Maximum account balance', value: '£1,000.00', optional: false },
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

    expect(result.report_type).toBe('Detailed');
    expect(result.criteria[0]).toEqual({ name: 'Report Type', value: 'Detailed', optional: false });
  });

  it('should flatten API error maps into named rows', () => {
    const result = mapFinesReportsReportInstanceToReportSummary(
      {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        status: {
          code: 'ERROR',
          display_name: 'Error',
        },
        errors: [
          {
            error_description: 'Legacy report timed out',
            report_service: 'No response from reporting engine',
          },
        ],
      },
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );

    expect(result.errors).toEqual([
      { name: 'Error description', value: 'Legacy report timed out', optional: false },
      { name: 'Report service', value: 'No response from reporting engine', optional: false },
    ]);
  });
});
