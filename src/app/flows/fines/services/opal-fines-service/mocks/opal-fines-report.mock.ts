import { IOpalFinesReport } from '../interfaces/opal-fines-report.interface';

export const OPAL_FINES_REPORT_MOCK: IOpalFinesReport = {
  report_id: 'operational_report_enforcement',
  report_title: 'Operational report (by enforcement)',
  report_group: 'Operational Reports',
  supported_file_types: ['CSV', 'PDF'],
  audited_report: false,
  report_parameters: {},
  supports_multiple_business_units: true,
  is_bespoke_journey: true,
  shown_as_worklist: false,
  retention_period: 'P14D',
  permission: 'OPERATIONAL_REPORT_BY_ENFORCEMENT',
  can_manually_create: true,
};
