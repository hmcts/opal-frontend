import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagePreferencesFormComponent } from './language-preferences-form.component';
import { MacStateService } from '@services';
import { MANUAL_ACCOUNT_CREATION_LANGUAGE_PREFERENCES_MOCK, MANUAL_ACCOUNT_CREATION_MOCK } from '@mocks';
import { IManualAccountCreationLanguagePreferencesState } from '@interfaces';

describe('LanguagePreferencesFormComponent', () => {
  let component: LanguagePreferencesFormComponent;
  let fixture: ComponentFixture<LanguagePreferencesFormComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;
  let formData: IManualAccountCreationLanguagePreferencesState;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('macStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_MOCK;

    formData = MANUAL_ACCOUNT_CREATION_LANGUAGE_PREFERENCES_MOCK;

    await TestBed.configureTestingModule({
      imports: [LanguagePreferencesFormComponent],
      providers: [{ provide: MacStateService, useValue: mockMacStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguagePreferencesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formData);

    component.handleFormSubmit();

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formData);
  });
});
