import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsSearchOffencesSearchFormComponent } from './fines-mac-offence-details-search-offences-search-form.component';
import { IFinesMacOffenceDetailsSearchOffencesForm } from '../../interfaces/fines-mac-offence-details-search-offences-form.interface';
import { FinesMacOffenceDetailsSearchOffencesStoreType } from '../../stores/types/fines-mac-offence-details-search-offences-store.type';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK } from '../../mocks/fines-mac-offence-details-search-offences-form.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FinesMacOffenceDetailsSearchOffencesStore } from '../../stores/fines-mac-offence-details-search-offences.store';

describe('FinesMacOffenceDetailsSearchOffencesFormComponent', () => {
  let component: FinesMacOffenceDetailsSearchOffencesSearchFormComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsSearchOffencesSearchFormComponent>;
  let formSubmit: IFinesMacOffenceDetailsSearchOffencesForm;
  let finesMacOffenceDetailsSearchOffencesStore: FinesMacOffenceDetailsSearchOffencesStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsSearchOffencesSearchFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('search-offences'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesSearchFormComponent);
    component = fixture.componentInstance;

    finesMacOffenceDetailsSearchOffencesStore = TestBed.inject(FinesMacOffenceDetailsSearchOffencesStore);
    finesMacOffenceDetailsSearchOffencesStore.resetSearchOffencesStore();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: false,
      }),
    );
  });
});
