import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDetailsComponent } from './account-details.component';
import { ManualAccountCreationRoutes } from '@enums';
import {
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
} from '@constants';
import { StateService } from '@services';
import { IManualAccountCreationAccountDetailsState } from '@interfaces';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BUSINESS_UNIT_REF_DATA_MOCK } from '@mocks';

describe('AccountDetailsComponent', () => {
  let component: AccountDetailsComponent;
  let fixture: ComponentFixture<AccountDetailsComponent>;
  let mockStateService: jasmine.SpyObj<StateService>;

  beforeEach(async () => {
    mockStateService = jasmine.createSpyObj('StateService', ['manualAccountCreation']);

    mockStateService.manualAccountCreation = {
      accountDetails: MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
      employerDetails: MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
      contactDetails: MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
      parentGuardianDetails: MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
      unsavedChanges: false,
      stateChanges: false,
    };

    await TestBed.configureTestingModule({
      imports: [AccountDetailsComponent, HttpClientTestingModule],
      providers: [{ provide: StateService, useValue: mockStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDetailsComponent);
    component = fixture.componentInstance;

    component.stateService.manualAccountCreation.accountDetails.businessUnit = null;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const formData: IManualAccountCreationAccountDetailsState = {
      businessUnit: 'Test',
      defendantType: 'Test',
    };

    component.handleAccountDetailsSubmit(formData);

    expect(mockStateService.manualAccountCreation.accountDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([ManualAccountCreationRoutes.createAccount]);
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(component.stateService.manualAccountCreation.unsavedChanges).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(component.stateService.manualAccountCreation.unsavedChanges).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });

  it('should set the business unit for account details when there is only one business unit available and the current business unit is null', () => {
    const response = { count: 1, refData: [BUSINESS_UNIT_REF_DATA_MOCK.refData[0]] };

    component['setBusinessUnit'](response);

    expect(component.stateService.manualAccountCreation.accountDetails.businessUnit).toEqual(
      BUSINESS_UNIT_REF_DATA_MOCK.refData[0].businessUnitName,
    );
  });

  it('should not set the business unit for account details when there is only one business unit available but the current business unit is not null', () => {
    const response = { count: 1, refData: [BUSINESS_UNIT_REF_DATA_MOCK.refData[0]] };

    component.stateService.manualAccountCreation.accountDetails.businessUnit =
      BUSINESS_UNIT_REF_DATA_MOCK.refData[1].businessUnitName;

    fixture.detectChanges();

    component['setBusinessUnit'](response);

    expect(component.stateService.manualAccountCreation.accountDetails.businessUnit).toEqual(
      BUSINESS_UNIT_REF_DATA_MOCK.refData[1].businessUnitName,
    );
  });

  it('should not set the business unit for account details when there are multiple business units available', () => {
    const response = BUSINESS_UNIT_REF_DATA_MOCK;

    component.stateService.manualAccountCreation.accountDetails.businessUnit = null;

    component['setBusinessUnit'](response);

    expect(component.stateService.manualAccountCreation.accountDetails.businessUnit).toBeNull();
  });
});
