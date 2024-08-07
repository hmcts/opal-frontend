import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacAccountDetailsComponent } from './fines-mac-account-details.component';
import { FinesService } from '../../services/fines.service';
import {
  FINES_MAC_ACCOUNT_DETAILS_STATE,
  FINES_MAC_ACCOUNT_TYPES_STATE,
  FINES_MAC_BUSINESS_UNIT_STATE,
  FINES_MAC_DEFENDANT_TYPES_STATE,
  FINES_MAC_STATE,
} from '../constants';
import { provideRouter } from '@angular/router';
import { IFinesMacAccountTypes, IFinesMacDefendantTypes } from '../interfaces';
import {
  FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE_MOCK,
  FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK,
  FINES_MAC_COMPANY_DETAILS_STATE_MOCK,
  FINES_MAC_CONTACT_DETAILS_STATE_MOCK,
  FINES_MAC_COURT_DETAILS_STATE_MOCK,
  FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK,
  FINES_MAC_OFFENCE_DETAILS_STATE_MOCK,
  FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
  FINES_MAC_PAYMENT_TERMS_STATE_MOCK,
  FINES_MAC_PERSONAL_DETAILS_STATE_MOCK,
} from '../mocks';

describe('FinesMacAccountDetailsComponent', () => {
  let component: FinesMacAccountDetailsComponent;
  let fixture: ComponentFixture<FinesMacAccountDetailsComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FineService', ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC_STATE;

    await TestBed.configureTestingModule({
      imports: [FinesMacAccountDetailsComponent],
      providers: [{ provide: FinesService, useValue: mockFinesService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacAccountDetailsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  beforeEach(() => {
    mockFinesService.finesMacState.accountDetails = FINES_MAC_ACCOUNT_DETAILS_STATE;
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
    mockFinesService.finesMacState.accountDetails.DefendantType = 'adultOrYouthOnly';

    component['setDefendantType']();

    expect(component.defendantType).toEqual(
      FINES_MAC_DEFENDANT_TYPES_STATE[
        mockFinesService.finesMacState.accountDetails.DefendantType as keyof IFinesMacDefendantTypes
      ],
    );
  });

  it('should set defendantType to be empty', () => {
    mockFinesService.finesMacState.accountDetails.DefendantType = 'test';

    component['setDefendantType']();

    expect(component.defendantType).toBe('');
  });

  it('should not set defendantType', () => {
    component.defendantType = '';
    mockFinesService.finesMacState.accountDetails.DefendantType = null;

    component['setDefendantType']();
    expect(component.defendantType).toBe('');
  });

  it('should set accountType correctly', () => {
    mockFinesService.finesMacState.accountDetails.AccountType = 'fine';

    component['setAccountType']();

    expect(component.accountType).toEqual(
      FINES_MAC_ACCOUNT_TYPES_STATE[
        mockFinesService.finesMacState.accountDetails.AccountType as keyof IFinesMacAccountTypes
      ],
    );
  });

  it('should set accountType to be empty', () => {
    mockFinesService.finesMacState.accountDetails.AccountType = 'test';

    component['setAccountType']();

    expect(component.accountType).toBe('');
  });

  it('should not set accountType', () => {
    component.accountType = '';
    mockFinesService.finesMacState.accountDetails.AccountType = null;

    component['setAccountType']();
    expect(component.accountType).toBe('');
  });

  it('should correctly update accountCreationStatus based on manualAccountCreation state', () => {
    mockFinesService.finesMacState = {
      employerDetails: FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK,
      accountDetails: FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK,
      contactDetails: FINES_MAC_CONTACT_DETAILS_STATE_MOCK,
      parentGuardianDetails: FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
      personalDetails: FINES_MAC_PERSONAL_DETAILS_STATE_MOCK,
      companyDetails: FINES_MAC_COMPANY_DETAILS_STATE_MOCK,
      courtDetails: FINES_MAC_COURT_DETAILS_STATE_MOCK,
      accountCommentsNotes: FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE_MOCK,
      offenceDetails: FINES_MAC_OFFENCE_DETAILS_STATE_MOCK,
      paymentTerms: FINES_MAC_PAYMENT_TERMS_STATE_MOCK,
      businessUnit: FINES_MAC_BUSINESS_UNIT_STATE,
      unsavedChanges: false,
      stateChanges: true,
    };

    component['checkStatus']();

    expect(component.accountCreationStatus['employerDetails']).toBe(true);
    expect(component.accountCreationStatus['accountDetails']).toBe(true);
    expect(component.accountCreationStatus['contactDetails']).toBe(true);
    expect(component.accountCreationStatus['parentGuardianDetails']).toBe(true);
    expect(component.accountCreationStatus['personalDetails']).toBe(true);
    expect(component.accountCreationStatus['companyDetails']).toBe(true);
    expect(component.accountCreationStatus['courtDetails']).toBe(true);
    expect(component.accountCreationStatus['accountCommentsNotes']).toBe(true);
    expect(component.accountCreationStatus['offenceDetails']).toBe(true);
    expect(component.accountCreationStatus['paymentTerms']).toBe(true);
  });

  it('should correctly update accountCreationStatus based on empty manualAccountCreation state', () => {
    mockFinesService.finesMacState = FINES_MAC_STATE;
    mockFinesService.finesMacState.accountDetails = FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK;

    component['checkStatus']();

    expect(component.accountCreationStatus['employerDetails']).toBeFalsy();
    expect(component.accountCreationStatus['accountDetails']).toBeTruthy();
    expect(component.accountCreationStatus['contactDetails']).toBeFalsy();
    expect(component.accountCreationStatus['parentGuardianDetails']).toBeFalsy();
    expect(component.accountCreationStatus['personalDetails']).toBeFalsy();
    expect(component.accountCreationStatus['companyDetails']).toBeFalsy();
    expect(component.accountCreationStatus['courtDetails']).toBeFalsy();
    expect(component.accountCreationStatus['accountCommentsNotes']).toBeFalsy();
    expect(component.accountCreationStatus['offenceDetails']).toBeFalsy();
    expect(component.accountCreationStatus['paymentTerms']).toBeFalsy();
  });

  it('should call setDefendantType and setAccountType on initialSetup', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setDefendantType');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setAccountType');

    component['initialSetup']();

    expect(component['setDefendantType']).toHaveBeenCalled();
    expect(component['setAccountType']).toHaveBeenCalled();
  });
});
