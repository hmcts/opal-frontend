import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from 'src/app/flows/fines/fines-reports/fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { IOpalFinesReport } from 'src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-report.interface';
import { IOpalFinesReportInstancesResponse } from 'src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-report-instances-response.interface';

const REPORT_ID = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement;

export const OPERATIONAL_REPORT_BY_ENFORCEMENT_METADATA_MOCK: IOpalFinesReport = {
  report_id: REPORT_ID,
  report_title: 'Operational reports (by enforcement)',
  can_manually_create: true,
};

export const OPERATIONAL_REPORT_BY_ENFORCEMENT_INSTANCES_MOCK: IOpalFinesReportInstancesResponse = {
  report_instances: [
    {
      instance_id: 1,
      report_id: REPORT_ID,
      created_at: '2026-07-21T09:15:00Z',
      name: 'Operational report (by enforcement) - CLAMPO - Detailed',
      business_unit: 'London Central & South East',
      created_by: 'Olivia Smith',
      status: 'READY',
      number_of_records: 10,
    },
    {
      instance_id: 2,
      report_id: REPORT_ID,
      created_at: '2026-07-20T09:15:00Z',
      name: 'Operational report (by enforcement) - No actions - Summary',
      business_unit: 'Multiple',
      created_by: 'James Brown',
      status: 'REQUESTED',
      number_of_records: 0,
    },
    {
      instance_id: 3,
      report_id: REPORT_ID,
      created_at: '2026-07-19T09:15:00Z',
      name: 'Operational report (by enforcement) - Empty - Summary',
      business_unit: 'London North West',
      created_by: 'Sarah Johnson',
      status: 'READY',
      number_of_records: 0,
    },
  ],
  count: 3,
};

export const OPERATIONAL_REPORT_BY_ENFORCEMENT_PAGINATED_INSTANCES_MOCK: IOpalFinesReportInstancesResponse = {
  report_instances: Array.from({ length: 26 }, (_, index) => ({
    ...OPERATIONAL_REPORT_BY_ENFORCEMENT_INSTANCES_MOCK.report_instances![0],
    instance_id: index + 1,
    name: `Operational report (by enforcement) - Pagination report ${index + 1}`,
    created_at: `2026-07-${String(26 - index).padStart(2, '0')}T09:15:00Z`,
  })),
  count: 26,
};

export const OPERATIONAL_REPORT_BY_ENFORCEMENT_NO_INSTANCES_MOCK: IOpalFinesReportInstancesResponse = {
  report_instances: [],
  count: 0,
};

export const OPERATIONAL_REPORT_BY_ENFORCEMENT_OVER_LIMIT_MOCK: IOpalFinesReportInstancesResponse = {
  report_instances: [],
  count: 101,
  max_results: 100,
  has_more: true,
};
