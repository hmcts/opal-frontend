import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacLanguagePreferencesFormComponent } from './fines-mac-language-preferences-form.component';
import { IFinesMacLanguagePreferencesForm } from '../interfaces/fines-mac-language-preferences-form.interface';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { FINES_MAC_LANGUAGE_PREFERENCES_FORM_MOCK } from '../mocks/fines-mac-language-preferences-form.mock';
import { ActivatedRoute } from '@angular/router';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { of } from 'rxjs';

describe('FinesMacLanguagePreferencesFormComponent', () => {
  let component: FinesMacLanguagePreferencesFormComponent;
  let fixture: ComponentFixture<FinesMacLanguagePreferencesFormComponent>;
  let formSubmit: IFinesMacLanguagePreferencesForm;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_MAC_LANGUAGE_PREFERENCES_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacLanguagePreferencesFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacLanguagePreferencesFormComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    spyOn(component['formSubmit'], 'emit');
    const event = {} as SubmitEvent;

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formSubmit);
  });
});
