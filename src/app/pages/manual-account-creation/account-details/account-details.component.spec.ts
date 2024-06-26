import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountDetailsComponent } from './account-details.component';
import { ManualAccountCreationRoutes } from '@enums';
import {
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
  MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
} from '@constants';
import { BusinessUnitService, StateService } from '@services';
import { IAutoCompleteItem, IBusinessUnitRefData, IManualAccountCreationAccountDetailsState } from '@interfaces';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK, BUSINESS_UNIT_REF_DATA_MOCK } from '@mocks';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('AccountDetailsComponent', () => {
  let component: AccountDetailsComponent;
  let fixture: ComponentFixture<AccountDetailsComponent>;
  let mockStateService: jasmine.SpyObj<StateService>;
  let businessUnitService: Partial<BusinessUnitService>;

  beforeEach(async () => {
    businessUnitService = {
      getBusinessUnits: jasmine.createSpy('getBusinessUnits').and.returnValue(of(BUSINESS_UNIT_REF_DATA_MOCK)),
    };
    mockStateService = jasmine.createSpyObj('StateService', ['manualAccountCreation']);

    mockStateService.manualAccountCreation = {
      accountDetails: MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
      employerDetails: MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
      contactDetails: MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
      parentGuardianDetails: MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
      personalDetails: MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
      unsavedChanges: false,
      stateChanges: false,
    };

    await TestBed.configureTestingModule({
      imports: [AccountDetailsComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: StateService, useValue: mockStateService },
        { provide: BusinessUnitService, useValue: businessUnitService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDetailsComponent);
    component = fixture.componentInstance;

    component.stateService.manualAccountCreation.accountDetails.businessUnit = null;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have state and populate data$', () => {
    expect(component.data$).not.toBeUndefined();
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

  it('should create an array of autocomplete items from the response', () => {
    // Arrange
    const response: IBusinessUnitRefData = BUSINESS_UNIT_REF_DATA_MOCK;
    const expectedAutoCompleteItems: IAutoCompleteItem[] = BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK;

    // Act
    const autoCompleteItems = component['createAutoCompleteItems'](response);

    // Assert
    expect(autoCompleteItems).toEqual(expectedAutoCompleteItems);
  });

  it('should return an empty array if the response does not contain any business units', () => {
    // Arrange
    const response: IBusinessUnitRefData = {
      count: 0,
      refData: [],
    };

    const expectedAutoCompleteItems: IAutoCompleteItem[] = [];

    // Act
    const autoCompleteItems = component['createAutoCompleteItems'](response);

    // Assert
    expect(autoCompleteItems).toEqual(expectedAutoCompleteItems);
  });

  it('should transform business unit reference data results into select options', () => {
    component.data$.subscribe((result) => {
      expect(result).toEqual(BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK);
      expect(businessUnitService.getBusinessUnits).toHaveBeenCalled();
    });
  });
});
