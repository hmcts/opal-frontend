import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from 'src/app/flows/fines/fines-reports/fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { IOpalFinesReportInstancesResponse } from 'src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-report-instances-response.interface';

const REPORT_ID = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports;

export const YOUR_REPORTS_INSTANCES_MOCK: IOpalFinesReportInstancesResponse = {
  report_instances: [
    {
      instance_id: 1,
      report_id: REPORT_ID,
      created_at: '2026-08-21T09:15:00Z',
      name: 'My report 1',
      business_unit: 'London Central & South East',
      created_by: 'Current user',
      status: 'READY',
      number_of_records: 10,
    },
    {
      instance_id: 2,
      report_id: REPORT_ID,
      created_at: '2026-08-20T09:15:00Z',
      name: 'My report 2',
      business_unit: 'Multiple',
      created_by: 'Current user',
      status: 'REQUESTED',
      number_of_records: 0,
    },
    {
      instance_id: 3,
      report_id: REPORT_ID,
      created_at: '2026-08-19T09:15:00Z',
      name: 'My report 3',
      business_unit: 'London North West',
      created_by: 'Current user',
      status: 'READY',
      number_of_records: 0,
    },
  ],
  count: 3,
};

export const YOUR_REPORTS_NO_INSTANCES_MOCK: IOpalFinesReportInstancesResponse = {
  report_instances: [],
  count: 0,
};

export const YOUR_REPORTS_OVER_LIMIT_MOCK: IOpalFinesReportInstancesResponse = {
  report_instances: [],
  count: 101,
  max_results: 100,
  has_more: true,
};
