import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCreateAccountComponent } from './fines-mac-create-account.component';
import { FINES_MAC_STATE_MOCK } from '../mocks';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { IFinesMacCreateAccountForm, IFinesMacCreateAccountState } from './interfaces';
import { FinesService, OpalFines } from '@services/fines';
import {
  OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK,
  OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
} from '../../services/opal-fines-service/mocks';
import { IAlphagovAccessibleAutocompleteItem } from '@interfaces/components/alphagov';
import { IOpalFinesBusinessUnitRefData } from '@interfaces/fines';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants';
import { FINES_MAC_CREATE_ACCOUNT_FORM_MOCK, FINES_MAC_CREATE_ACCOUNT_STATE_MOCK } from './mocks';

describe('FinesMacCreateAccountComponent', () => {
  let component: FinesMacCreateAccountComponent;
  let fixture: ComponentFixture<FinesMacCreateAccountComponent>;
  let finesService: jasmine.SpyObj<FinesService>;
  let opalFinesService: Partial<OpalFines>;
  let formData: IFinesMacCreateAccountState;
  let formSubmit: IFinesMacCreateAccountForm;

  beforeEach(async () => {
    opalFinesService = {
      getBusinessUnits: jasmine
        .createSpy('getBusinessUnits')
        .and.returnValue(of(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK)),
    };
    finesService = jasmine.createSpyObj('FineService', ['finesMacState']);

    finesService.finesMacState = FINES_MAC_STATE_MOCK;
    formData = FINES_MAC_CREATE_ACCOUNT_STATE_MOCK;
    formSubmit = FINES_MAC_CREATE_ACCOUNT_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacCreateAccountComponent],
      providers: [
        { provide: FinesService, useValue: finesService },
        { provide: OpalFines, useValue: opalFinesService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacCreateAccountComponent);
    component = fixture.componentInstance;

    component['finesService'].finesMacState.accountDetails.BusinessUnit = null;

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

    component.handleAccountDetailsSubmit(formSubmit);

    expect(finesService.finesMacState.accountDetails).toEqual(formData);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(component['finesService'].finesMacState.unsavedChanges).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(component['finesService'].finesMacState.unsavedChanges).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });

  it('should set the business unit for account details when there is only one business unit available and the current business unit is null', () => {
    const response = { count: 1, refData: [OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]] };

    component['setBusinessUnit'](response);

    expect(component['finesService'].finesMacState.accountDetails.BusinessUnit).toEqual(
      OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].businessUnitName,
    );
  });

  it('should not set the business unit for account details when there is only one business unit available but the current business unit is not null', () => {
    const response = { count: 1, refData: [OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]] };

    component['finesService'].finesMacState.accountDetails.BusinessUnit =
      OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[1].businessUnitName;

    fixture.detectChanges();

    component['setBusinessUnit'](response);

    expect(component['finesService'].finesMacState.accountDetails.BusinessUnit).toEqual(
      OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[1].businessUnitName,
    );
  });

  it('should not set the business unit for account details when there are multiple business units available', () => {
    const response = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK;

    component['finesService'].finesMacState.accountDetails.BusinessUnit = null;

    component['setBusinessUnit'](response);

    expect(component['finesService'].finesMacState.accountDetails.BusinessUnit).toBeNull();
  });

  it('should create an array of autocomplete items from the response', () => {
    const response: IOpalFinesBusinessUnitRefData = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK;
    const expectedAutoCompleteItems: IAlphagovAccessibleAutocompleteItem[] =
      OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK;

    const autoCompleteItems = component['createAutoCompleteItems'](response);

    expect(autoCompleteItems).toEqual(expectedAutoCompleteItems);
  });

  it('should return an empty array if the response does not contain any business units', () => {
    const response: IOpalFinesBusinessUnitRefData = {
      count: 0,
      refData: [],
    };

    const expectedAutoCompleteItems: IAlphagovAccessibleAutocompleteItem[] = [];

    const autoCompleteItems = component['createAutoCompleteItems'](response);

    expect(autoCompleteItems).toEqual(expectedAutoCompleteItems);
  });

  it('should transform business unit reference data results into select options', () => {
    component.data$.subscribe((result) => {
      expect(result).toEqual(OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK);
      expect(opalFinesService.getBusinessUnits).toHaveBeenCalled();
    });
  });
});
