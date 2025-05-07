import { TestBed } from '@angular/core/testing';
import { ResolveFn, Router } from '@angular/router';
import { finesMacOffenceDetailsSearchOffencesResultsResolver } from './fines-mac-offence-details-search-offences-result.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { of, throwError } from 'rxjs';
import { OPAL_FINES_SEARCH_OFFENCES_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-search-offences.mock';
import { IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData } from '../../fines-mac-offence-details-search-offences-results/fines-mac-offence-details-search-offences-results-table-wrapper/interfaces/fines-mac-offence-details-search-offences-results-table-wrapper-table-data.interface';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

describe('finesMacOffenceDetailsSearchOffencesResultsResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const executeResolver: ResolveFn<any> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesMacOffenceDetailsSearchOffencesResultsResolver(...resolverParameters));

  let mockRouter: jasmine.SpyObj<Router>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['getCurrentNavigation']);
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['searchOffences']);
    mockDateService = jasmine.createSpyObj('DateService', ['getDateNow']);
    mockUtilsService = jasmine.createSpyObj('UtilsService', ['scrollToTop']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: DateService, useValue: mockDateService },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
    });
  });

  it('should resolve and map offence data when state.searchForm is provided', (done) => {
    mockRouter.getCurrentNavigation.and.returnValue({
      extras: {
        state: {
          searchForm: {
            fm_offence_details_search_offences_code: 'A123',
            fm_offence_details_search_offences_short_title: 'Test Title',
            fm_offence_details_search_offences_act_and_section: 'Act 1',
            fm_offence_details_search_offences_inactive: false,
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
    executeResolver({} as any, {} as any).subscribe(
      (result: IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData[]) => {
        expect(result).toEqual([
          {
            Code: OPAL_FINES_SEARCH_OFFENCES_MOCK.searchData[0].cjs_code,
            'Short title': OPAL_FINES_SEARCH_OFFENCES_MOCK.searchData[0].offence_title,
            'Act and section': OPAL_FINES_SEARCH_OFFENCES_MOCK.searchData[0].offence_oas,
            'Used from': OPAL_FINES_SEARCH_OFFENCES_MOCK.searchData[0].date_used_from,
            'Used to': OPAL_FINES_SEARCH_OFFENCES_MOCK.searchData[0].date_used_to,
          },
        ]);
        done();
      },
    );
  });

  it('should return empty array if no state.searchForm is available', (done) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockRouter.getCurrentNavigation.and.returnValue({ extras: {} } as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    executeResolver({} as any, {} as any).subscribe(
      (result: IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData[]) => {
        expect(result).toEqual([]);
        done();
      },
    );
  });

  it('should return empty array if API call fails', (done) => {
    mockRouter.getCurrentNavigation.and.returnValue({
      extras: {
        state: {
          searchForm: {
            fm_offence_details_search_offences_code: 'A123',
            fm_offence_details_search_offences_short_title: 'Test Title',
            fm_offence_details_search_offences_act_and_section: 'Act 1',
            fm_offence_details_search_offences_inactive: false,
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    executeResolver({} as any, {} as any).subscribe(
      (result: IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData[]) => {
        expect(result).toEqual([]);
        done();
      },
    );
  });

  it('should set activeDate to null if fm_offence_details_search_offences_inactive is true', (done) => {
    mockRouter.getCurrentNavigation.and.returnValue({
      extras: {
        state: {
          searchForm: {
            fm_offence_details_search_offences_code: 'B456',
            fm_offence_details_search_offences_short_title: 'Another Title',
            fm_offence_details_search_offences_act_and_section: 'Act 2',
            fm_offence_details_search_offences_inactive: true,
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
        searchData: [structuredClone(OPAL_FINES_SEARCH_OFFENCES_MOCK.searchData[1])],
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    executeResolver({} as any, {} as any).subscribe(() => {
      const expectedPayload = {
        cjsCode: 'B456',
        title: 'Another Title',
        actAndSection: 'Act 2',
        // activeDate should be excluded since it's null
      };

      expect(mockOpalFinesService.searchOffences).toHaveBeenCalledWith(expectedPayload);
      done();
    });
  });
});
