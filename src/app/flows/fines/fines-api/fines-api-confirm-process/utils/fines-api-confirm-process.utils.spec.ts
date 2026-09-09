import { IOpalFinesInterfaceJobSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-job-summary.interface';
import { describe, expect, it } from 'vitest';
import { IFinesApiConfirmProcessInterfaceJob } from '../interfaces/fines-api-confirm-process-interface-job.interface';
import {
  buildBusinessUnitSummary,
  buildProcessInterfaceJobsPayload,
  enrichInterfaceJobsWithBusinessUnitIds,
  getSelectedInterfaceJobs,
  isDwpAeaSource,
} from './fines-api-confirm-process.utils';

const buildInterfaceJob = (overrides: Partial<IOpalFinesInterfaceJobSummary> = {}): IOpalFinesInterfaceJobSummary => ({
  business_unit_name: 'Camberwell Green',
  completed_datetime: null,
  created_datetime: '2026-09-03T08:15:00.000Z',
  file_name: 'payments_20260903_001.dat',
  interface_file_id: 501,
  interface_job_id: 1001,
  source: 'NATWEST',
  status: 'CREATED',
  ...overrides,
});

const buildConfirmInterfaceJob = (
  overrides: Partial<IFinesApiConfirmProcessInterfaceJob> = {},
): IFinesApiConfirmProcessInterfaceJob => ({
  ...buildInterfaceJob(overrides),
  businessUnitId: 77,
  ...overrides,
});

describe('fines-api-confirm-process utils', () => {
  it('should retain only selected interface files in API response order', () => {
    const interfaceJobs = [
      buildInterfaceJob({ interface_file_id: 501 }),
      buildInterfaceJob({ interface_file_id: 502 }),
      buildInterfaceJob({ interface_file_id: 503 }),
    ];

    expect(getSelectedInterfaceJobs(interfaceJobs, ['503', '501'])).toEqual([interfaceJobs[0], interfaceJobs[2]]);
    expect(getSelectedInterfaceJobs(null, ['501'])).toEqual([]);
  });

  it.each(['DWP_AEA', 'DWP/AEA', 'DWP/AEA/DWP', 'DWP', 'AEA', ' dwp_aea '])(
    'should recognise %s as a DWP/AEA source',
    (source) => {
      expect(isDwpAeaSource(source)).toBe(true);
    },
  );

  it('should not recognise another payment source as DWP/AEA', () => {
    expect(isDwpAeaSource('NATWEST')).toBe(false);
  });

  it('should enrich summary rows with IDs from selected business-unit data', () => {
    const interfaceJobs = [
      buildInterfaceJob({ business_unit_name: 'West London', interface_file_id: 501 }),
      buildInterfaceJob({ business_unit_name: 'Camberwell Green', interface_file_id: 502 }),
    ];

    expect(
      enrichInterfaceJobsWithBusinessUnitIds(interfaceJobs, [
        { business_unit_id: 77, business_unit_name: 'Camberwell Green', file_count: 1, till_count: 0 },
        { business_unit_id: 80, business_unit_name: 'West London', file_count: 1, till_count: 0 },
      ]),
    ).toEqual([
      { ...interfaceJobs[0], businessUnitId: 80 },
      { ...interfaceJobs[1], businessUnitId: 77 },
    ]);
  });

  it('should omit rows whose business-unit name is missing or ambiguous', () => {
    const interfaceJobs = [
      buildInterfaceJob({ business_unit_name: 'Duplicate Name', interface_file_id: 501 }),
      buildInterfaceJob({ business_unit_name: 'Missing Name', interface_file_id: 502 }),
    ];

    expect(
      enrichInterfaceJobsWithBusinessUnitIds(interfaceJobs, [
        { business_unit_id: 77, business_unit_name: 'Duplicate Name', file_count: 1, till_count: 0 },
        { business_unit_id: 80, business_unit_name: 'Duplicate Name', file_count: 1, till_count: 0 },
      ]),
    ).toEqual([]);
  });

  it('should group file counts by business unit ID and sort rows by business unit name', () => {
    const interfaceJobs = [
      buildConfirmInterfaceJob({ businessUnitId: 80, business_unit_name: 'West London', interface_file_id: 501 }),
      buildConfirmInterfaceJob({ businessUnitId: 77, business_unit_name: 'Camberwell Green', interface_file_id: 502 }),
      buildConfirmInterfaceJob({ businessUnitId: 77, business_unit_name: 'Camberwell Green', interface_file_id: 503 }),
    ];

    expect(buildBusinessUnitSummary(interfaceJobs)).toEqual([
      { businessUnitId: 77, businessUnitName: 'Camberwell Green', fileCount: 2 },
      { businessUnitId: 80, businessUnitName: 'West London', fileCount: 1 },
    ]);
  });

  it('should build a unique job payload with override inhibits true only for checked DWP/AEA files', () => {
    const interfaceJobs = [
      buildConfirmInterfaceJob({ interface_file_id: 501, interface_job_id: 1001, source: 'DWP_AEA' }),
      buildConfirmInterfaceJob({ interface_file_id: 502, interface_job_id: 1002, source: 'DWP/AEA' }),
      buildConfirmInterfaceJob({ interface_file_id: 503, interface_job_id: 1003, source: 'NATWEST' }),
    ];

    expect(buildProcessInterfaceJobsPayload(interfaceJobs, new Set(['501', '503']))).toEqual({
      interface_jobs: [
        { business_unit_id: 77, interface_job_id: 1001, override_inhibits: true },
        { business_unit_id: 77, interface_job_id: 1002, override_inhibits: false },
        { business_unit_id: 77, interface_job_id: 1003, override_inhibits: false },
      ],
    });
  });

  it('should submit a shared interface job once and retain a selected override', () => {
    const interfaceJobs = [
      buildConfirmInterfaceJob({ interface_file_id: 501, interface_job_id: 1001, source: 'DWP_AEA' }),
      buildConfirmInterfaceJob({ interface_file_id: 502, interface_job_id: 1001, source: 'DWP_AEA' }),
    ];

    expect(buildProcessInterfaceJobsPayload(interfaceJobs, new Set(['502']))).toEqual({
      interface_jobs: [{ business_unit_id: 77, interface_job_id: 1001, override_inhibits: true }],
    });
  });
});
