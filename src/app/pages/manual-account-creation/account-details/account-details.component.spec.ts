import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountDetailsComponent } from './account-details.component';
import {
  DEFENDANT_TYPES_STATE,
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_BUSINESS_UNIT_STATE,
  MANUAL_ACCOUNT_CREATION_COURT_DETAILS_STATE,
} from '@constants';
import { MacStateService } from '@services';
import { provideRouter } from '@angular/router';
import {
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE_MOCK,
  MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_STATE_MOCK,
  MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE_MOCK,
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE_MOCK,
  MANUAL_ACCOUNT_CREATION_LANGUAGE_PREFERENCES_MOCK,
  MANUAL_ACCOUNT_CREATION_MOCK,
  MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
  MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE_MOCK,
} from '@mocks';
import { ILanguageOptions } from '@interfaces';

describe('AccountDetailsComponent', () => {
  let component: AccountDetailsComponent;
  let fixture: ComponentFixture<AccountDetailsComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('MacStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_MOCK;
    await TestBed.configureTestingModule({
      imports: [AccountDetailsComponent],
      providers: [{ provide: MacStateService, useValue: mockMacStateService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDetailsComponent);
    component = fixture.componentInstance;
    mockMacStateService = TestBed.inject(MacStateService);
    fixture.detectChanges();
  });

  beforeEach(() => {
    mockMacStateService.manualAccountCreation.accountDetails = MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate on handleRoute', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.handleRoute('test');
    expect(routerSpy).toHaveBeenCalledWith(['test']);
  });

  it('should set defendantType correctly', () => {
    mockMacStateService.manualAccountCreation.accountDetails.defendantType = 'adultOrYouthOnly';

    component['setDefendantType']();

    expect(component.defendantType).toEqual(
      DEFENDANT_TYPES_STATE[mockMacStateService.manualAccountCreation.accountDetails.defendantType],
    );
  });

  it('should set defendantType to be empty', () => {
    mockMacStateService.manualAccountCreation.accountDetails.defendantType = 'test';

    component['setDefendantType']();

    expect(component.defendantType).toBe('');
  });

  it('should not set defendantType', () => {
    component.defendantType = '';
    mockMacStateService.manualAccountCreation.accountDetails.defendantType = null;

    component['setDefendantType']();
    expect(component.defendantType).toBe('');
  });

  it('should correctly update accountCreationStatus based on manualAccountCreation state', () => {
    component.macStateService.manualAccountCreation = {
      employerDetails: MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE_MOCK,
      accountDetails: MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE_MOCK,
      contactDetails: MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE_MOCK,
      parentGuardianDetails: MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
      personalDetails: MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE_MOCK,
      companyDetails: MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_STATE_MOCK,
      courtDetails: MANUAL_ACCOUNT_CREATION_COURT_DETAILS_STATE,
      businessUnit: MANUAL_ACCOUNT_CREATION_BUSINESS_UNIT_STATE,
      languagePreferences: MANUAL_ACCOUNT_CREATION_LANGUAGE_PREFERENCES_MOCK,
      unsavedChanges: false,
      stateChanges: true,
    };

    component['checkStatus']();

    expect(component.accountCreationStatus['employerDetails']).toBe(true);
    expect(component.accountCreationStatus['accountDetails']).toBe(true);
    expect(component.accountCreationStatus['contactDetails']).toBe(true);
    expect(component.accountCreationStatus['parentGuardianDetails']).toBe(true);
    expect(component.accountCreationStatus['personalDetails']).toBe(true);
  });

  it('should correctly update accountCreationStatus based on empty manualAccountCreation state', () => {
    component.macStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_MOCK;
    component.macStateService.manualAccountCreation.accountDetails = MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE_MOCK;

    component['checkStatus']();

    expect(component.accountCreationStatus['employerDetails']).toBeFalsy();
    expect(component.accountCreationStatus['accountDetails']).toBeTruthy();
    expect(component.accountCreationStatus['contactDetails']).toBeFalsy();
    expect(component.accountCreationStatus['parentGuardianDetails']).toBeFalsy();
    expect(component.accountCreationStatus['personalDetails']).toBeFalsy();
    expect(component.accountCreationStatus['companyDetails']).toBeFalsy();
  });
  it('should set documentLanguage and courtHearingLanguage correctly', () => {
    const documentLanguage = 'W';
    const courtHearingLanguage = 'E';
    component.macStateService.manualAccountCreation.languagePreferences = {
      documentLanguage,
      courtHearingLanguage,
    };

    component['setLanguage']();

    expect(component.documentLanguage).toEqual(component.languages[documentLanguage as keyof ILanguageOptions]);
    expect(component.courtHearingLanguage).toEqual(component.languages[courtHearingLanguage as keyof ILanguageOptions]);
  });

  it('should set documentLanguage and courtHearingLanguage to empty strings if the provided languages are not in the languages list', () => {
    const documentLanguage = 'german';
    const courtHearingLanguage = 'french';
    component.macStateService.manualAccountCreation.languagePreferences = {
      documentLanguage,
      courtHearingLanguage,
    };

    component['setLanguage']();

    expect(component.documentLanguage).toBe('');
    expect(component.courtHearingLanguage).toBe('');
  });

  it('should call setDefendantType, setLanguage, and checkStatus on initialSetup', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setDefendantType');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setLanguage');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'checkStatus');

    component['initialSetup']();

    expect(component['setDefendantType']).toHaveBeenCalled();
    expect(component['setLanguage']).toHaveBeenCalled();
    expect(component['checkStatus']).toHaveBeenCalled();
  });
});
