import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagePreferencesComponent } from './language-preferences.component';
import { provideRouter } from '@angular/router';
import { IManualAccountCreationLanguagePreferencesState } from '@interfaces';
import { MacStateService } from '@services';
import { MANUAL_ACCOUNT_CREATION_MOCK } from '@mocks';
import { ManualAccountCreationRoutes } from '@enums';

describe('LanguagePreferencesComponent', () => {
  let component: LanguagePreferencesComponent;
  let fixture: ComponentFixture<LanguagePreferencesComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;
  let formData: IManualAccountCreationLanguagePreferencesState;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('MacStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_MOCK;

    formData = {
      documentLanguage: 'welshEnglish',
      courtHearingLanguage: 'welshEnglish',
    };

    await TestBed.configureTestingModule({
      imports: [LanguagePreferencesComponent],
      providers: [{ provide: MacStateService, useValue: mockMacStateService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguagePreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleLanguagePreferencesSubmit(formData);

    expect(mockMacStateService.manualAccountCreation.languagePreferences).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([ManualAccountCreationRoutes.accountDetails]);
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(component.macStateService.manualAccountCreation.unsavedChanges).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(component.macStateService.manualAccountCreation.unsavedChanges).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
