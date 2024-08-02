import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAccountComponent } from './create-account.component';
import { ManualAccountCreationRoutes } from '@enums';
import { BusinessUnitService, MacStateService } from '@services';
import { IAutoCompleteItem, IBusinessUnitRefData, IManualAccountCreationAccountDetailsState } from '@interfaces';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK,
  BUSINESS_UNIT_REF_DATA_MOCK,
  MANUAL_ACCOUNT_CREATION_MOCK,
} from '@mocks';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;
  let mockMacStateService: jasmine.SpyObj<MacStateService>;
  let businessUnitService: Partial<BusinessUnitService>;

  beforeEach(async () => {
    businessUnitService = {
      getBusinessUnits: jasmine.createSpy('getBusinessUnits').and.returnValue(of(BUSINESS_UNIT_REF_DATA_MOCK)),
    };
    mockMacStateService = jasmine.createSpyObj('MacStateService', ['manualAccountCreation']);

    mockMacStateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_MOCK;

    await TestBed.configureTestingModule({
      imports: [CreateAccountComponent],
      providers: [
        { provide: MacStateService, useValue: mockMacStateService },
        { provide: BusinessUnitService, useValue: businessUnitService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;

    component.macStateService.manualAccountCreation.accountDetails.businessUnit = null;

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
      accountType: 'Test',
      defendantType: 'Test',
    };

    component.handleAccountDetailsSubmit(formData);

    expect(mockMacStateService.manualAccountCreation.accountDetails).toEqual(formData);
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

  it('should set the business unit for account details when there is only one business unit available and the current business unit is null', () => {
    const response = { count: 1, refData: [BUSINESS_UNIT_REF_DATA_MOCK.refData[0]] };

    component['setBusinessUnit'](response);

    expect(component.macStateService.manualAccountCreation.accountDetails.businessUnit).toEqual(
      BUSINESS_UNIT_REF_DATA_MOCK.refData[0].businessUnitName,
    );
  });

  it('should not set the business unit for account details when there is only one business unit available but the current business unit is not null', () => {
    const response = { count: 1, refData: [BUSINESS_UNIT_REF_DATA_MOCK.refData[0]] };

    component.macStateService.manualAccountCreation.accountDetails.businessUnit =
      BUSINESS_UNIT_REF_DATA_MOCK.refData[1].businessUnitName;

    fixture.detectChanges();

    component['setBusinessUnit'](response);

    expect(component.macStateService.manualAccountCreation.accountDetails.businessUnit).toEqual(
      BUSINESS_UNIT_REF_DATA_MOCK.refData[1].businessUnitName,
    );
  });

  it('should not set the business unit for account details when there are multiple business units available', () => {
    const response = BUSINESS_UNIT_REF_DATA_MOCK;

    component.macStateService.manualAccountCreation.accountDetails.businessUnit = null;

    component['setBusinessUnit'](response);

    expect(component.macStateService.manualAccountCreation.accountDetails.businessUnit).toBeNull();
  });

  it('should create an array of autocomplete items from the response', () => {
    const response: IBusinessUnitRefData = BUSINESS_UNIT_REF_DATA_MOCK;
    const expectedAutoCompleteItems: IAutoCompleteItem[] = BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK;

    const autoCompleteItems = component['createAutoCompleteItems'](response);

    expect(autoCompleteItems).toEqual(expectedAutoCompleteItems);
  });

  it('should return an empty array if the response does not contain any business units', () => {
    const response: IBusinessUnitRefData = {
      count: 0,
      refData: [],
    };

    const expectedAutoCompleteItems: IAutoCompleteItem[] = [];

    const autoCompleteItems = component['createAutoCompleteItems'](response);

    expect(autoCompleteItems).toEqual(expectedAutoCompleteItems);
  });

  it('should transform business unit reference data results into select options', () => {
    component.data$.subscribe((result) => {
      expect(result).toEqual(BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK);
      expect(businessUnitService.getBusinessUnits).toHaveBeenCalled();
    });
  });
});
