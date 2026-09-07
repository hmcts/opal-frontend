import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesInterfaceJobSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-job-summary.interface';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  extractInterfaceJobs,
  FINES_API_INTERFACE_JOBS_MAX_RESULTS,
  mapInterfaceJobs,
} from './fines-api-payload-map-interface-jobs.utils';

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

describe('fines-api-payload-map-interface-jobs utils', () => {
  let dateService: DateService;
  let parsedDate: ReturnType<DateService['getFromIso']>;

  beforeEach(() => {
    const localisedDate = { localised: true };
    parsedDate = {
      isValid: true,
      setLocale: vi.fn().mockReturnValue(localisedDate),
      toMillis: vi.fn().mockReturnValue(1_777_884_100_000),
    } as unknown as ReturnType<DateService['getFromIso']>;
    dateService = {
      getFromIso: vi.fn().mockReturnValue(parsedDate),
      toFormat: vi.fn().mockReturnValue('03 September 2026 at 09:15'),
    } as unknown as DateService;
  });

  it('should extract interface jobs in response order', () => {
    const jobs = [buildInterfaceJob({ interface_job_id: 3 }), buildInterfaceJob({ interface_job_id: 1 })];

    expect(extractInterfaceJobs({ interface_jobs: jobs })).toEqual(jobs);
  });

  it('should return no jobs for unsupported response shapes', () => {
    expect(extractInterfaceJobs(null)).toEqual([]);
    expect(extractInterfaceJobs([])).toEqual([]);
    expect(extractInterfaceJobs({ interface_jobs: 'invalid' })).toEqual([]);
  });

  it('should cap extracted and mapped interface jobs at 500 without reordering them', () => {
    const jobs = Array.from({ length: FINES_API_INTERFACE_JOBS_MAX_RESULTS + 1 }, (_, index) =>
      buildInterfaceJob({ interface_job_id: index + 1, interface_file_id: index + 1001 }),
    );

    const extractedJobs = extractInterfaceJobs({ interface_jobs: jobs });
    const mappedJobs = mapInterfaceJobs(jobs, dateService);

    expect(extractedJobs).toHaveLength(FINES_API_INTERFACE_JOBS_MAX_RESULTS);
    expect(mappedJobs).toHaveLength(FINES_API_INTERFACE_JOBS_MAX_RESULTS);
    expect(mappedJobs[0].interfaceJobId).toBe('1');
    expect(mappedJobs.at(-1)?.interfaceJobId).toBe('500');
  });

  it('should map API fields, string identifiers, and local date display data', () => {
    const rows = mapInterfaceJobs([buildInterfaceJob()], dateService);

    expect(rows[0]).toEqual({
      'File name': 'payments_20260903_001.dat',
      Source: 'NatWest',
      'Business unit': 'Camberwell Green',
      'Date uploaded': 1_777_884_100_000,
      interfaceJobId: '1001',
      interfaceFileId: '501',
      dateUploadedDisplay: '03 September 2026 at 09:15',
      status: 'CREATED',
    });
    expect(dateService.getFromIso).toHaveBeenCalledWith('2026-09-03T08:15:00.000Z');
    expect(parsedDate.setLocale).toHaveBeenCalledWith('en-gb');
    expect(dateService.toFormat).toHaveBeenCalledWith(expect.anything(), "dd MMMM yyyy 'at' HH:mm");
  });

  it.each([
    ['ALLPAY', 'allpay'],
    ['ALL_PAY', 'allpay'],
    ['NATWEST', 'NatWest'],
    ['BARCLAYCARD', 'Barclaycard'],
    ['BRITISH_TELECOM', 'British Telecom'],
    ['BRITISHTELECOM', 'British Telecom'],
    ['BT', 'British Telecom'],
    ['DWP_AEA', 'DWP/AEA'],
    ['DWP/AEA', 'DWP/AEA'],
    ['DWP', 'DWP/AEA'],
    ['AEA', 'DWP/AEA'],
  ])('should display source %s as %s', (source, expectedSource) => {
    const [row] = mapInterfaceJobs([buildInterfaceJob({ source })], dateService);

    expect(row.Source).toBe(expectedSource);
  });

  it('should leave an unknown source unchanged', () => {
    const [row] = mapInterfaceJobs([buildInterfaceJob({ source: 'NEW_PROVIDER' })], dateService);

    expect(row.Source).toBe('NEW_PROVIDER');
  });

  it('should retain an invalid timestamp for display and use a safe numeric sort fallback', () => {
    vi.mocked(dateService.getFromIso).mockReturnValueOnce({ isValid: false } as ReturnType<DateService['getFromIso']>);

    const [row] = mapInterfaceJobs([buildInterfaceJob({ created_datetime: 'not-a-date' })], dateService);

    expect(row['Date uploaded']).toBe(0);
    expect(row.dateUploadedDisplay).toBe('not-a-date');
    expect(dateService.toFormat).not.toHaveBeenCalled();
  });
});
