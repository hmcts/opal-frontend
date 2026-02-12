import { TestBed } from '@angular/core/testing';
import { ResolveFn, Router } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { of, throwError } from 'rxjs';
import { OPAL_FINES_SEARCH_OFFENCES_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-search-offences.mock';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { finesMacOffenceDetailsSearchOffencesResolver } from './fines-mac-offence-details-search-offences.resolver';
import { IOpalFinesSearchOffencesData } from '@services/fines/opal-fines-service/interfaces/opal-fines-search-offences.interface';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('finesMacOffenceDetailsSearchOffencesResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const executeResolver: ResolveFn<any> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesMacOffenceDetailsSearchOffencesResolver(...resolverParameters));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDateService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockUtilsService: any;

  beforeEach(() => {
    mockRouter = {
      currentNavigation: vi.fn().mockName('Router.currentNavigation'),
    };
    mockOpalFinesService = {
      searchOffences: vi.fn().mockName('OpalFines.searchOffences'),
    };
    mockDateService = {
      getDateNow: vi.fn().mockName('DateService.getDateNow'),
      toFormat: vi.fn().mockName('DateService.toFormat'),
    };
    mockUtilsService = {
      scrollToTop: vi.fn().mockName('UtilsService.scrollToTop'),
      filterNullOrUndefined: vi.fn().mockName('UtilsService.filterNullOrUndefined'),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: DateService, useValue: mockDateService },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
    });
  });

  it('should resolve and return offence data when state.payload is provided', async () => {
    mockRouter.currentNavigation.mockReturnValue({
      extras: {
        state: {
          payload: {
            code: 'A123',
            short_title: 'Test Title',
            act_section: 'Act 1',
            inactive: false,
          },
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    mockDateService.getDateNow.mockReturnValue({
      toUTC: () => ({ toISO: () => '2025-05-07' }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    mockOpalFinesService.searchOffences.mockReturnValue(
      of({
        count: 1,
        searchData: [structuredClone(OPAL_FINES_SEARCH_OFFENCES_MOCK.searchData[0])],
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    executeResolver({} as any, {} as any).subscribe((result: IOpalFinesSearchOffencesData) => {
      expect(result).toEqual({
        count: 1,
        searchData: [structuredClone(OPAL_FINES_SEARCH_OFFENCES_MOCK.searchData[0])],
      });
    });
  });

  it('should resolve and return offence data when state.payload is provided with active true', async () => {
    mockRouter.currentNavigation.mockReturnValue({
      extras: {
        state: {
          payload: {
            code: 'A123',
            short_title: 'Test Title',
            act_section: 'Act 1',
            inactive: true,
          },
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    mockDateService.getDateNow.mockReturnValue({
      toUTC: () => ({ toISO: () => '2025-05-07' }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    mockOpalFinesService.searchOffences.mockReturnValue(
      of({
        count: 1,
        searchData: [structuredClone(OPAL_FINES_SEARCH_OFFENCES_MOCK.searchData[0])],
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    executeResolver({} as any, {} as any).subscribe((result: IOpalFinesSearchOffencesData) => {
      expect(result).toEqual({
        count: 1,
        searchData: [structuredClone(OPAL_FINES_SEARCH_OFFENCES_MOCK.searchData[0])],
      });
    });
  });

  it('should return empty array if no state.payload is available', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockRouter.currentNavigation.mockReturnValue({ extras: {} } as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    executeResolver({} as any, {} as any).subscribe((result: IOpalFinesSearchOffencesData) => {
      expect(result).toEqual({ searchData: [], count: 0 });
    });
  });

  it('should return empty array if API call fails', () => {
    mockRouter.currentNavigation.mockReturnValue({
      extras: {
        state: {
          payload: {
            code: 'A123',
            short_title: 'Test Title',
            act_section: 'Act 1',
            inactive: false,
          },
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    mockDateService.getDateNow.mockReturnValue({
      toUTC: () => ({ toISO: () => '2025-05-07' }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    mockOpalFinesService.searchOffences.mockReturnValue(throwError(() => new Error('Server error')));
    mockUtilsService.scrollToTop.mockClear();

    let result: IOpalFinesSearchOffencesData = { searchData: [], count: 0 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    executeResolver({} as any, {} as any).subscribe((response: IOpalFinesSearchOffencesData) => {
      result = response;
    });

    expect(result).toEqual({ searchData: [], count: 0 });
    expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
  });
});
