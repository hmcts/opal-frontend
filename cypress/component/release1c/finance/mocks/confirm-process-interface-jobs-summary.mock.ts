import { IOpalFinesInterfaceJobsSummaryResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-jobs-summary-response.interface';

/**
 * Representative selected-business-unit file data for Confirm before processing scenarios.
 * It includes both DWP/AEA and non-DWP/AEA sources for the later AC2--AC6 scenarios.
 */
export const CONFIRM_PROCESS_INTERFACE_JOBS_SUMMARY_MOCK: IOpalFinesInterfaceJobsSummaryResponse = {
  interface_jobs: [
    {
      interface_file_id: 201,
      interface_job_id: 2001,
      file_name: 'camberwell-dwp.xml',
      source: 'DWP',
      business_unit_name: 'Camberwell Green',
      created_datetime: '2026-01-10T12:00:00.000Z',
      completed_datetime: null,
      status: 'CREATED',
    },
    {
      interface_file_id: 202,
      interface_job_id: 2002,
      file_name: 'camberwell-natwest.xml',
      source: 'NATWEST',
      business_unit_name: 'Camberwell Green',
      created_datetime: '2026-01-10T12:05:00.000Z',
      completed_datetime: null,
      status: 'FAILED',
    },
    {
      interface_file_id: 203,
      interface_job_id: 2003,
      file_name: 'camden-dwp.xml',
      source: 'DWP',
      business_unit_name: 'Camden and Islington',
      created_datetime: '2026-01-10T12:10:00.000Z',
      completed_datetime: null,
      status: 'CREATED',
    },
    {
      interface_file_id: 204,
      interface_job_id: 2004,
      file_name: 'camden-allpay.xml',
      source: 'ALLPAY',
      business_unit_name: 'Camden and Islington',
      created_datetime: '2026-01-10T12:15:00.000Z',
      completed_datetime: null,
      status: 'FAILED',
    },
  ],
};
