import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCreateAccountComponent } from './fines-mac-create-account.component';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-autocomplete-items.mock';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IAlphagovAccessibleAutocompleteItem } from '@components/alphagov/alphagov-accessible-autocomplete/interfaces/alphagov-accessible-autocomplete-item.interface';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { FINES_MAC_CREATE_ACCOUNT_FORM_MOCK } from './mocks/fines-mac-create-account-form.mock';
import { IFinesMacAccountDetailsForm } from '../fines-mac-account-details/interfaces/fines-mac-account-details-form.interface';
import { FINES_MAC_STATE } from '../constants/fines-mac-state';

describe('FinesMacCreateAccountComponent', () => {
  let component: FinesMacCreateAccountComponent;
  let fixture: ComponentFixture<FinesMacCreateAccountComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockOpalFinesService: Partial<OpalFines>;
  let formSubmit: IFinesMacAccountDetailsForm;

  beforeEach(async () => {
    mockOpalFinesService = {
      getBusinessUnits: jasmine
        .createSpy('getBusinessUnits')
        .and.returnValue(of(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK)),
      getConfigurationItemValue: jasmine.createSpy('getConfigurationItemValue').and.returnValue(of('welshEnglish')),
    };

    mockFinesService = jasmine.createSpyObj('FinesService', [], {
      finesMacState: structuredClone(FINES_MAC_STATE),
    });

    formSubmit = structuredClone(FINES_MAC_CREATE_ACCOUNT_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacCreateAccountComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: OpalFines, useValue: mockOpalFinesService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { parent: of('manual-account-creation') },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacCreateAccountComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have state and populate data$', () => {
    expect(component.data$).toBeDefined();
  });

  it('should handle form submission and navigate', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    mockFinesService = jasmine.createSpyObj('FinesService', [], {
      finesMacState: structuredClone({
        ...FINES_MAC_STATE,
        accountDetails: structuredClone(FINES_MAC_CREATE_ACCOUNT_FORM_MOCK),
      }),
    });

    component.handleAccountDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.accountDetails.formData).toEqual(formSubmit.formData);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
    expect(mockOpalFinesService.getConfigurationItemValue).toHaveBeenCalled();
  });

  it('should handle unsaved changes', () => {
    component.handleUnsavedChanges(true);
    expect(mockFinesService.finesMacState.unsavedChanges).toBeTrue();
    expect(component.stateUnsavedChanges).toBeTrue();

    component.handleUnsavedChanges(false);
    expect(mockFinesService.finesMacState.unsavedChanges).toBeFalse();
    expect(component.stateUnsavedChanges).toBeFalse();
  });

  it('should set the business unit when there is only one available and current unit is null', () => {
    const response = { count: 1, refData: [structuredClone(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0])] };

    component['setBusinessUnit'](response);

    expect(mockFinesService.finesMacState.accountDetails.formData.fm_create_account_business_unit_id).toEqual(
      OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_id,
    );
  });

  it('should not set the business unit when there are multiple units available', () => {
    const response = structuredClone(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK);

    component['setBusinessUnit'](response);

    expect(mockFinesService.finesMacState.accountDetails.formData.fm_create_account_business_unit_id).toBeNull();
    expect(component['businessUnits']).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData);
  });

  it('should create autocomplete items from the response', () => {
    const response: IOpalFinesBusinessUnitRefData = structuredClone(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK);
    const expectedAutoCompleteItems: IAlphagovAccessibleAutocompleteItem[] = structuredClone(
      OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK,
    );
    (mockOpalFinesService.getBusinessUnits as jasmine.Spy).and.returnValue(of(response));

    const autoCompleteItems = component['createAutoCompleteItems'](response);

    expect(autoCompleteItems).toEqual(expectedAutoCompleteItems);
  });

  it('should return an empty array if no business units are available', () => {
    const response: IOpalFinesBusinessUnitRefData = { count: 0, refData: [] };
    const expectedAutoCompleteItems: IAlphagovAccessibleAutocompleteItem[] = [];

    const autoCompleteItems = component['createAutoCompleteItems'](response);

    expect(autoCompleteItems).toEqual(expectedAutoCompleteItems);
  });
});
