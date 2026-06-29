import { IOpalFinesReportInstanceDetail } from '../interfaces/opal-fines-report-instance-detail.interface';

export const OPAL_FINES_REPORT_INSTANCE_MOCK: IOpalFinesReportInstanceDetail = {
  instance_id: 12345,
  requested_at: '2006-06-01T10:36:00',
  generated_at: '2006-06-01T10:37:00',
  requested_by: {
    user_id: '42',
    name: 'john.smith',
  },
  name: 'ABDC',
  business_units: [
    {
      business_unit_id: '77',
      business_unit_name: 'London North West',
      welsh_speaking: 'N',
    },
  ],
  status: {
    code: 'READY',
    display_name: 'Ready',
  },
  number_of_records: 1245,
  is_downloadable: true,
  errors: null,
  report_parameters: {
    reportType: 'SUMMARY',
    enforcement: 'Last enforcement - Bail warrant - Dated (BWTD)',
    action_date_from: '01 May 2006',
    action_date_to: '30 June 2006',
    account_type: ['Adult', 'Youth', 'Company'],
    account_status: 'Live',
    collection_order: 'All accounts',
    minimum_account_balance: '10.00',
    maximum_account_balance: '1000.00',
    lower_name_range: '0',
    upper_name_range: 'Z',
  },
  retain_until: '2025-10-31T09:30:00',
  report: {
    id: 'operational_report_enforcement',
    supported_file_types: ['CSV', 'PDF'],
  },
};
