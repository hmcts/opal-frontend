import { IFinesReportsReportSummaryInstance } from '../interfaces/fines-reports-report-summary-instance.interface';
import { FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES } from '../constants/fines-reports-report-summary-report-types.constant';
import { FINES_REPORTS_REPORT_SUMMARY_STATUSES } from '../constants/fines-reports-report-summary-statuses.constant';

const ENFORCEMENT_REPORT_REFERENCE = 'ABDC';
const ENFORCEMENT_REPORT_TYPE = FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary;
const PAYMENTS_REPORT_REFERENCE = 'PYMT';
const PAYMENTS_REPORT_TYPE = FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed;

export const FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK: IFinesReportsReportSummaryInstance = {
  report_instance_id: 'report-instance-enforcement-001',
  report_id: 'operational_report_enforcement',
  report_reference: ENFORCEMENT_REPORT_REFERENCE,
  report_type: ENFORCEMENT_REPORT_TYPE,
  status: FINES_REPORTS_REPORT_SUMMARY_STATUSES.requested,
  date_created: '2025-10-17T09:30:00',
  business_units: ['West London', 'South London'],
  number_of_records: 124,
  created_by: 'jane.doe',
  criteria: [
    { name: 'Report Type', value: ENFORCEMENT_REPORT_TYPE },
    { name: 'Enforcement', value: 'Last enforcement action' },
    { name: 'Action date', value: 'From 17 Oct 2025 to 18 Oct 2025', optional: true },
    { name: 'Account type', value: ['Adult', 'Youth'] },
    { name: 'Account status', value: 'Live' },
    { name: 'Collection order', value: 'All accounts' },
    { name: 'Minimum account balance', value: '120.50', optional: true },
    { name: 'Maximum account balance', value: '1000.00', optional: true },
    { name: 'Only accounts with initial or full payment due in the next 7 days', value: true, optional: true },
    { name: 'Lower name range', value: 'A', optional: true },
    { name: 'Upper name range', value: 'Z', optional: true },
  ],
};

export const FINES_REPORTS_REPORT_SUMMARY_PAYMENTS_MOCK: IFinesReportsReportSummaryInstance = {
  report_instance_id: 'report-instance-payments-001',
  report_id: 'operational_report_payment',
  report_reference: PAYMENTS_REPORT_REFERENCE,
  report_type: PAYMENTS_REPORT_TYPE,
  status: FINES_REPORTS_REPORT_SUMMARY_STATUSES.ready,
  date_created: '2025-10-20T14:05:00',
  business_units: ['North London'],
  number_of_records: 0,
  created_by: 'john.smith',
  criteria: [
    { name: 'Report Type', value: PAYMENTS_REPORT_TYPE },
    { name: 'Account type', value: ['Adult', 'Company'] },
    { name: 'Account status', value: 'Closed' },
    { name: 'Collection order', value: 'With collection order' },
    { name: 'Minimum account balance', value: undefined, optional: true },
    { name: 'Maximum account balance', value: undefined, optional: true },
    { name: 'Lower name range', value: '', optional: true },
    { name: 'Upper name range', value: '', optional: true },
  ],
};

export const FINES_REPORTS_REPORT_SUMMARY_ERROR_MOCK: IFinesReportsReportSummaryInstance = {
  ...FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK,
  report_instance_id: 'report-instance-error-001',
  status: FINES_REPORTS_REPORT_SUMMARY_STATUSES.error,
  number_of_records: null,
  errors: [
    { name: 'Report generation error', value: 'Legacy report timed out' },
    { name: 'Report service', value: 'No response from reporting engine' },
  ],
};
