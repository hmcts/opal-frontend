import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountDetailsComponent } from './account-details.component';
import {
  ACCOUNT_TYPES_STATE,
  DEFENDANT_TYPES_STATE,
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_BUSINESS_UNIT_STATE,
  MANUAL_ACCOUNT_CREATION_COURT_DETAILS_STATE,
} from '@constants';
import { MacStateService } from '@services';
import { provideRouter } from '@angular/router';
import {
  MANUAL_ACCOUNT_CREATION_ACCOUNT_COMMENTS_NOTES_MOCK,
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE_MOCK,
  MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_STATE_MOCK,
  MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE_MOCK,
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE_MOCK,
  MANUAL_ACCOUNT_CREATION_MOCK,
  MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
  MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE_MOCK,
} from '@mocks';
import { IAccountTypes, IDefendantTypes } from '@interfaces';

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
    mockMacStateService.manualAccountCreation.accountDetails.DefendantType = 'adultOrYouthOnly';

    component['setDefendantType']();

    expect(component.defendantType).toEqual(
      DEFENDANT_TYPES_STATE[
        mockMacStateService.manualAccountCreation.accountDetails.DefendantType as keyof IDefendantTypes
      ],
    );
  });

  it('should set defendantType to be empty', () => {
    mockMacStateService.manualAccountCreation.accountDetails.DefendantType = 'test';

    component['setDefendantType']();

    expect(component.defendantType).toBe('');
  });

  it('should not set defendantType', () => {
    component.defendantType = '';
    mockMacStateService.manualAccountCreation.accountDetails.DefendantType = null;

    component['setDefendantType']();
    expect(component.defendantType).toBe('');
  });

  it('should set accountType correctly', () => {
    mockMacStateService.manualAccountCreation.accountDetails.AccountType = 'fine';

    component['setAccountType']();

    expect(component.accountType).toEqual(
      ACCOUNT_TYPES_STATE[mockMacStateService.manualAccountCreation.accountDetails.AccountType as keyof IAccountTypes],
    );
  });

  it('should set accountType to be empty', () => {
    mockMacStateService.manualAccountCreation.accountDetails.AccountType = 'test';

    component['setAccountType']();

    expect(component.accountType).toBe('');
  });

  it('should not set accountType', () => {
    component.accountType = '';
    mockMacStateService.manualAccountCreation.accountDetails.AccountType = null;

    component['setAccountType']();
    expect(component.accountType).toBe('');
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
      accountCommentsNotes: MANUAL_ACCOUNT_CREATION_ACCOUNT_COMMENTS_NOTES_MOCK,
      businessUnit: MANUAL_ACCOUNT_CREATION_BUSINESS_UNIT_STATE,
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
});
