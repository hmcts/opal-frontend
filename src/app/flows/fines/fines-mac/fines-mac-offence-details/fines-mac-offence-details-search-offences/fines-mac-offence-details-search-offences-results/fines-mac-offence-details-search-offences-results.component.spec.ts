import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsSearchOffencesResultsComponent } from './fines-mac-offence-details-search-offences-results.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FinesMacOffenceDetailsSearchOffencesStore } from '../stores/fines-mac-offence-details-search-offences.store';
import { FinesMacOffenceDetailsSearchOffencesStoreType } from '../stores/types/fines-mac-offence-details-search-offences-store.type';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_SEARCH_OFFENCES_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-search-offences.mock';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK } from '../mocks/fines-mac-offence-details-search-offences-form.mock';

describe('FinesMacOffenceDetailsSearchOffencesResultsComponent', () => {
  let component: FinesMacOffenceDetailsSearchOffencesResultsComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsSearchOffencesResultsComponent>;
  let finesMacOffenceDetailsSearchOffencesStore: FinesMacOffenceDetailsSearchOffencesStoreType;
  let mockOpalFinesService: Partial<OpalFines>;
  let mockDateService: jasmine.SpyObj<DateService>;
  const getDateNow = '2025-05-05T00:00:00.000Z';

  beforeEach(async () => {
    mockOpalFinesService = {
      searchOffences: jasmine.createSpy('searchOffences').and.returnValue(of(OPAL_FINES_SEARCH_OFFENCES_MOCK)),
    };
    mockDateService = jasmine.createSpyObj(DateService, ['getDateNow', 'getFromFormatToFormat']);

    mockDateService.getDateNow.and.returnValue({
      toUTC: () => ({
        toISO: () => getDateNow,
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsSearchOffencesResultsComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: DateService, useValue: mockDateService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('search-offences'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesResultsComponent);
    component = fixture.componentInstance;

    finesMacOffenceDetailsSearchOffencesStore = TestBed.inject(FinesMacOffenceDetailsSearchOffencesStore);
    finesMacOffenceDetailsSearchOffencesStore.resetSearchOffencesStore();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return false from canDeactivate if there are unsaved changes', () => {
    finesMacOffenceDetailsSearchOffencesStore.setUnsavedChanges(true);
    expect(component.canDeactivate()).toBeFalse();
  });

  it('should return true from canDeactivate if there are no unsaved changes', () => {
    finesMacOffenceDetailsSearchOffencesStore.setUnsavedChanges(false);
    expect(component.canDeactivate()).toBeTrue();
  });

  it('should navigate back one level up on navigateBack', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.navigateBack();
    expect(routerSpy).toHaveBeenCalledWith(['..'], { relativeTo: component['activatedRoute'] });
  });

  it('should build the correct search offences body', () => {
    finesMacOffenceDetailsSearchOffencesStore.setSearchOffences(FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK);

    const expectedBody = {
      activeDate: getDateNow,
      cjsCode: FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK.formData.fm_offence_details_search_offences_code,
      title:
        FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK.formData.fm_offence_details_search_offences_short_title,
      actAndSection:
        FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK.formData.fm_offence_details_search_offences_act_and_section,
    };

    const result = component['buildSearchOffencesBody']();
    expect(result).toEqual(expectedBody);
  });

  it('should build the correct search offences body - inactive offences', () => {
    finesMacOffenceDetailsSearchOffencesStore.setSearchOffences({
      ...structuredClone(FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK),
      formData: {
        ...structuredClone(FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK.formData),
        fm_offence_details_search_offences_inactive: true,
      },
    });

    const expectedBody = {
      cjsCode: FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK.formData.fm_offence_details_search_offences_code,
      title:
        FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK.formData.fm_offence_details_search_offences_short_title,
      actAndSection:
        FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK.formData.fm_offence_details_search_offences_act_and_section,
    };

    const result = component['buildSearchOffencesBody']();
    expect(result).toEqual(expectedBody);
  });

  it('should populate table data correctly', () => {
    const result = component['populateTableData'](OPAL_FINES_SEARCH_OFFENCES_MOCK);
    expect(result.length).toEqual(OPAL_FINES_SEARCH_OFFENCES_MOCK.count);
  });
});
