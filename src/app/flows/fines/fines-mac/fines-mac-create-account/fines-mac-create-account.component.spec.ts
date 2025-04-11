import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCreateAccountComponent } from './fines-mac-create-account.component';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-autocomplete-items.mock';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FINES_MAC_CREATE_ACCOUNT_FORM_MOCK } from './mocks/fines-mac-create-account-form.mock';
import { IFinesMacAccountDetailsForm } from '../fines-mac-account-details/interfaces/fines-mac-account-details-form.interface';
import { FinesMacStoreType } from '../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../stores/fines-mac.store';

describe('FinesMacCreateAccountComponent', () => {
  let component: FinesMacCreateAccountComponent;
  let fixture: ComponentFixture<FinesMacCreateAccountComponent>;
  let mockOpalFinesService: Partial<OpalFines>;
  let formSubmit: IFinesMacAccountDetailsForm;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    mockOpalFinesService = {
      getBusinessUnits: jasmine
        .createSpy('getBusinessUnits')
        .and.returnValue(of(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK)),
      getConfigurationItemValue: jasmine.createSpy('getConfigurationItemValue').and.returnValue(of('welshEnglish')),
    };
    formSubmit = structuredClone(FINES_MAC_CREATE_ACCOUNT_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacCreateAccountComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
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

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

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

    expect(finesMacStore.accountDetails()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
    expect(mockOpalFinesService.getConfigurationItemValue).toHaveBeenCalled();
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(finesMacStore.unsavedChanges()).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(finesMacStore.unsavedChanges()).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });

  it('should set the business unit for account details when there is only one business unit available and the current business unit is null', () => {
    const response = { count: 1, refData: [OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]] };

    component['setBusinessUnit'](response);

    expect(finesMacStore.accountDetails().formData.fm_create_account_business_unit_id).toEqual(
      OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_id,
    );
  });

  it('should not set the business unit for account details when there is only one business unit available but the current business unit is not null', () => {
    const response = { count: 1, refData: [OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]] };

    fixture.detectChanges();

    component['setBusinessUnit'](response);

    expect(finesMacStore.accountDetails().formData.fm_create_account_business_unit_id).toEqual(
      OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_id,
    );
  });

  it('should not set the business unit for account details when there are multiple business units available', () => {
    const response = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK;

    component['setBusinessUnit'](response);

    expect(finesMacStore.accountDetails().formData.fm_create_account_business_unit_id).toBeNull();
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
      expect(mockOpalFinesService.getBusinessUnits).toHaveBeenCalled();
    });
  });

  it('should initialise but capture business unit id', () => {
    spyOn(finesMacStore, 'setBusinessUnitId');
    finesMacStore.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    component.ngOnInit();
    expect(finesMacStore.setBusinessUnitId).toHaveBeenCalled();
  });
});
