import { TestBed } from '@angular/core/testing';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesInterfaceJobsSummaryResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-jobs-summary-response.interface';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesApiPayloadService } from './fines-api-payload.service';

const INTERFACE_JOBS_RESPONSE: IOpalFinesInterfaceJobsSummaryResponse = {
  interface_jobs: [
    {
      business_unit_name: 'Camberwell Green',
      completed_datetime: null,
      created_datetime: '2026-09-03T10:15:00.000Z',
      file_name: 'payments_20260903_natwest_001.dat',
      interface_file_id: 501,
      interface_job_id: 1001,
      source: 'NATWEST',
      status: 'CREATED',
    },
  ],
};

describe('FinesApiPayloadService', () => {
  let service: FinesApiPayloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DateService,
          useValue: {
            getFromIso: vi.fn().mockReturnValue({
              isValid: true,
              setLocale: vi.fn().mockReturnValue({}),
              toMillis: vi.fn().mockReturnValue(1_777_884_100_000),
            }),
            toFormat: vi.fn().mockReturnValue('03 September 2026 at 09:15'),
          },
        },
      ],
    });

    service = TestBed.inject(FinesApiPayloadService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should extract and map interface jobs for the Process table', () => {
    const interfaceJobs = service.extractInterfaceJobs(INTERFACE_JOBS_RESPONSE);
    const rows = service.mapInterfaceJobs(interfaceJobs);

    expect(interfaceJobs).toEqual(INTERFACE_JOBS_RESPONSE.interface_jobs);
    expect(rows).toHaveLength(INTERFACE_JOBS_RESPONSE.interface_jobs.length);
    expect(rows[0]).toEqual(
      expect.objectContaining({
        'File name': 'payments_20260903_natwest_001.dat',
        Source: 'NatWest',
        'Business unit': 'Camberwell Green',
        interfaceJobId: '1001',
        interfaceFileId: '501',
        status: 'CREATED',
      }),
    );
  });
});
