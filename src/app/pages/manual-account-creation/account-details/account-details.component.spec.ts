import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountDetailsComponent } from './account-details.component';
import {
  DEFENDANT_TYPES_STATE,
  MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
} from '@constants';
import { MacStateService } from '@services';
import { provideRouter } from '@angular/router';

describe('AccountDetailsComponent', () => {
  let component: AccountDetailsComponent;
  let fixture: ComponentFixture<AccountDetailsComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;

  beforeEach(async () => {
    mockMacStateService = jasmine.createSpyObj('MacStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = {
      accountDetails: MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
      employerDetails: MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
      contactDetails: MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
      parentGuardianDetails: MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
      personalDetails: MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
      unsavedChanges: false,
      stateChanges: false,
    };

    await TestBed.configureTestingModule({
      imports: [AccountDetailsComponent],
      providers: [{ provide: MacStateService, useValue: mockMacStateService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDetailsComponent);
    component = fixture.componentInstance;
    mockMacStateService = TestBed.inject(MacStateService);
    fixture.detectChanges();
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

  it('should check status and set personalDetailsPopulated to true when all personal details are populated', () => {
    component.macStateService.manualAccountCreation.personalDetails.title = 'Mr';
    component.macStateService.manualAccountCreation.personalDetails.firstNames = 'John';
    component.macStateService.manualAccountCreation.personalDetails.lastName = 'Doe';
    component.macStateService.manualAccountCreation.personalDetails.addressLine1 = '123 Main St';

    component['checkStatus']();

    expect(component.personalDetailsPopulated).toBe(true);
  });

  it('should check status and set personalDetailsPopulated to false when any personal detail is missing', () => {
    component.macStateService.manualAccountCreation.personalDetails.title = 'Mr';
    component.macStateService.manualAccountCreation.personalDetails.firstNames = 'John';
    component.macStateService.manualAccountCreation.personalDetails.lastName = 'Doe';
    component.macStateService.manualAccountCreation.personalDetails.addressLine1 = null;

    component['checkStatus']();

    expect(component.personalDetailsPopulated).toBe(false);
  });
});
