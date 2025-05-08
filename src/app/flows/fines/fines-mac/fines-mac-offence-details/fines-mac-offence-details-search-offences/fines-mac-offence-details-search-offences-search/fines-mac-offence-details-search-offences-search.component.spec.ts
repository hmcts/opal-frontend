import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsSearchOffencesSearchComponent } from './fines-mac-offence-details-search-offences-search.component';
import { IFinesMacOffenceDetailsSearchOffencesForm } from '../interfaces/fines-mac-offence-details-search-offences-form.interface';
import { FinesMacOffenceDetailsSearchOffencesStoreType } from '../stores/types/fines-mac-offence-details-search-offences-store.type';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK } from '../mocks/fines-mac-offence-details-search-offences-form.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FinesMacOffenceDetailsSearchOffencesStore } from '../stores/fines-mac-offence-details-search-offences.store';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-search-offences-routing-paths.constant';

describe('FinesMacOffenceDetailsSearchOffencesSearchComponent', () => {
  let component: FinesMacOffenceDetailsSearchOffencesSearchComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsSearchOffencesSearchComponent>;
  let formSubmit: IFinesMacOffenceDetailsSearchOffencesForm;
  let finesMacOffenceDetailsSearchOffencesStore: FinesMacOffenceDetailsSearchOffencesStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsSearchOffencesSearchComponent],
      providers: [
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

    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesSearchComponent);
    component = fixture.componentInstance;

    finesMacOffenceDetailsSearchOffencesStore = TestBed.inject(FinesMacOffenceDetailsSearchOffencesStore);
    finesMacOffenceDetailsSearchOffencesStore.resetSearchOffencesStore();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleSearchOffencesSubmit(formSubmit);

    expect(finesMacOffenceDetailsSearchOffencesStore.searchOffences()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith(
      [FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_PATHS.children.searchOffencesResults],
      {
        relativeTo: component['activatedRoute'].parent,
        state: {
          payload: {
            code: formSubmit.formData.fm_offence_details_search_offences_code,
            short_title: formSubmit.formData.fm_offence_details_search_offences_short_title,
            act_and_section: formSubmit.formData.fm_offence_details_search_offences_act_and_section,
            inactive: formSubmit.formData.fm_offence_details_search_offences_inactive,
          },
        },
      },
    );
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(finesMacOffenceDetailsSearchOffencesStore.unsavedChanges()).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(finesMacOffenceDetailsSearchOffencesStore.unsavedChanges()).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
