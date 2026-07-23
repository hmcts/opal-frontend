import { type IOpalFinesReport } from '../interfaces/opal-fines-report.interface';

export const OPAL_FINES_REPORT_MOCK: IOpalFinesReport = {
  report_id: 'operational_report_enforcement',
  report_title: 'Operational report (by enforcement)',
  report_group: 'Operational reports',
  supported_file_types: ['CSV', 'PDF'],
  audited_report: true,
  report_parameters: {
    business_unit_warning_threshold: 10,
  },
  supports_multiple_business_units: true,
  is_bespoke_journey: false,
  shown_as_worklist: true,
  retention_period: 'P30D',
  permission: 'view-operational-reports',
  can_manually_create: true,
};
