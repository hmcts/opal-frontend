import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCreateAccountComponent } from './fines-mac-create-account.component';
import { FinesService } from '../../services/fines.service';
import { BusinessUnitService } from '@services';
import { FINES_MAC_STATE_MOCK } from '../mocks';
import { of } from 'rxjs';
import { BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK, BUSINESS_UNIT_REF_DATA_MOCK } from '@mocks';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { IAutoCompleteItem, IBusinessUnitRefData } from '@interfaces';
import { FinesMacRoutes } from '../enums';
import { IFinesMacAccountDetailsState } from '../interfaces';

describe('FinesMacCreateAccountComponent', () => {
  let component: FinesMacCreateAccountComponent;
  let fixture: ComponentFixture<FinesMacCreateAccountComponent>;
  let finesService: jasmine.SpyObj<FinesService>;
  let businessUnitService: Partial<BusinessUnitService>;

  beforeEach(async () => {
    businessUnitService = {
      getBusinessUnits: jasmine.createSpy('getBusinessUnits').and.returnValue(of(BUSINESS_UNIT_REF_DATA_MOCK)),
    };
    finesService = jasmine.createSpyObj('FineService', ['fineMacState']);

    finesService.fineMacState = FINES_MAC_STATE_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacCreateAccountComponent],
      providers: [
        { provide: FinesService, useValue: finesService },
        { provide: BusinessUnitService, useValue: businessUnitService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacCreateAccountComponent);
    component = fixture.componentInstance;

    component.finesService.fineMacState.accountDetails.BusinessUnit = null;

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
    const formData: IFinesMacAccountDetailsState = {
      BusinessUnit: 'Test',
      AccountType: 'Test',
      DefendantType: 'Test',
    };

    component.handleAccountDetailsSubmit(formData);

    expect(finesService.fineMacState.accountDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([FinesMacRoutes.finesMacAccountDetails]);
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(component.finesService.fineMacState.unsavedChanges).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(component.finesService.fineMacState.unsavedChanges).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });

  it('should set the business unit for account details when there is only one business unit available and the current business unit is null', () => {
    const response = { count: 1, refData: [BUSINESS_UNIT_REF_DATA_MOCK.refData[0]] };

    component['setBusinessUnit'](response);

    expect(component.finesService.fineMacState.accountDetails.BusinessUnit).toEqual(
      BUSINESS_UNIT_REF_DATA_MOCK.refData[0].businessUnitName,
    );
  });

  it('should not set the business unit for account details when there is only one business unit available but the current business unit is not null', () => {
    const response = { count: 1, refData: [BUSINESS_UNIT_REF_DATA_MOCK.refData[0]] };

    component.finesService.fineMacState.accountDetails.BusinessUnit =
      BUSINESS_UNIT_REF_DATA_MOCK.refData[1].businessUnitName;

    fixture.detectChanges();

    component['setBusinessUnit'](response);

    expect(component.finesService.fineMacState.accountDetails.BusinessUnit).toEqual(
      BUSINESS_UNIT_REF_DATA_MOCK.refData[1].businessUnitName,
    );
  });

  it('should not set the business unit for account details when there are multiple business units available', () => {
    const response = BUSINESS_UNIT_REF_DATA_MOCK;

    component.finesService.fineMacState.accountDetails.BusinessUnit = null;

    component['setBusinessUnit'](response);

    expect(component.finesService.fineMacState.accountDetails.BusinessUnit).toBeNull();
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
