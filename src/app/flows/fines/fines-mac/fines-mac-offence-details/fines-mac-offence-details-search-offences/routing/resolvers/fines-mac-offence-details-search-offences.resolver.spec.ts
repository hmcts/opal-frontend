import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ResolveFn, Router } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { of, throwError } from 'rxjs';
import { OPAL_FINES_SEARCH_OFFENCES_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-search-offences.mock';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { finesMacOffenceDetailsSearchOffencesResolver } from './fines-mac-offence-details-search-offences.resolver';
import { IOpalFinesSearchOffencesData } from '@services/fines/opal-fines-service/interfaces/opal-fines-search-offences.interface';

describe('finesMacOffenceDetailsSearchOffencesResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const executeResolver: ResolveFn<any> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesMacOffenceDetailsSearchOffencesResolver(...resolverParameters));

  let mockRouter: jasmine.SpyObj<Router>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['getCurrentNavigation']);
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['searchOffences']);
    mockDateService = jasmine.createSpyObj('DateService', ['getDateNow', 'getFromFormatToFormat']);
    mockUtilsService = jasmine.createSpyObj('UtilsService', ['scrollToTop', 'filterNullOrUndefined']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: DateService, useValue: mockDateService },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
    });
  });

  it('should resolve and return offence data when state.payload is provided', (done) => {
    mockRouter.getCurrentNavigation.and.returnValue({
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

    mockDateService.getDateNow.and.returnValue({
      toUTC: () => ({ toISO: () => '2025-05-07' }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    mockOpalFinesService.searchOffences.and.returnValue(
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
      done();
    });
  });

  it('should resolve and return offence data when state.payload is provided with active true', (done) => {
    mockRouter.getCurrentNavigation.and.returnValue({
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

    mockDateService.getDateNow.and.returnValue({
      toUTC: () => ({ toISO: () => '2025-05-07' }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    mockOpalFinesService.searchOffences.and.returnValue(
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
      done();
    });
  });

  it('should return empty array if no state.payload is available', (done) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockRouter.getCurrentNavigation.and.returnValue({ extras: {} } as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    executeResolver({} as any, {} as any).subscribe((result: IOpalFinesSearchOffencesData) => {
      expect(result).toEqual({ searchData: [], count: 0 });
      done();
    });
  });

  it('should return empty array if API call fails', fakeAsync(() => {
    mockRouter.getCurrentNavigation.and.returnValue({
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

    mockDateService.getDateNow.and.returnValue({
      toUTC: () => ({ toISO: () => '2025-05-07' }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    mockOpalFinesService.searchOffences.and.returnValue(throwError(() => new Error('Server error')));
    mockUtilsService.scrollToTop.calls.reset();

    let result: IOpalFinesSearchOffencesData = { searchData: [], count: 0 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    executeResolver({} as any, {} as any).subscribe((response: IOpalFinesSearchOffencesData) => {
      result = response;
    });

    tick();

    expect(result).toEqual({ searchData: [], count: 0 });
    expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
  }));
});
