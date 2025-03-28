import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsAddAnOffenceComponent } from './fines-mac-offence-details-add-an-offence.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OPAL_FINES_RESULT_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-result-pretty-name.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { FINES_MAC_OFFENCE_DETAILS_FORM } from '../constants/fines-mac-offence-details-form.constant';
import { IFinesMacOffenceDetailsForm } from '../interfaces/fines-mac-offence-details-form.interface';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../mocks/fines-mac-offence-details-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-pretty-name.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from '../mocks/fines-mac-offence-details-draft-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK } from '../fines-mac-offence-details-minor-creditor/mocks/fines-mac-offence-details-minor-creditor-form.mock';
import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { FINES_MAC_PAYMENT_TERMS_FORM } from '../../fines-mac-payment-terms/constants/fines-mac-payment-terms-form';
import { FINES_MAC_PAYMENT_TERMS_STATE_MOCK } from '../../fines-mac-payment-terms/mocks/fines-mac-payment-terms-state.mock';
import { FINES_MAC_PAYMENT_TERMS_FORM_MOCK } from '../../fines-mac-payment-terms/mocks/fines-mac-payment-terms-form.mock';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { FinesMacOffenceDetailsStoreType } from '../stores/types/fines-mac-offence-details.type';
import { FinesMacOffenceDetailsStore } from '../stores/fines-mac-offence-details.store';
import { UtilsService } from '@hmcts/opal-frontend-common/core/services';

describe('FinesMacOffenceDetailsAddAnOffenceComponent', () => {
  let component: FinesMacOffenceDetailsAddAnOffenceComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsAddAnOffenceComponent>;
  let mockOpalFinesService: Partial<OpalFines>;
  let formSubmit: IFinesMacOffenceDetailsForm;
  let finesMacStore: FinesMacStoreType;
  let finesMacOffenceDetailsStore: FinesMacOffenceDetailsStoreType;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    mockUtilsService = jasmine.createSpyObj(UtilsService, ['getFormStatus']);

    mockOpalFinesService = {
      getResults: jasmine.createSpy('getResults').and.returnValue(of(OPAL_FINES_RESULTS_REF_DATA_MOCK)),
      getResultPrettyName: jasmine.createSpy('getResultPrettyName').and.returnValue(OPAL_FINES_RESULT_PRETTY_NAME_MOCK),
      getMajorCreditors: jasmine
        .createSpy('getMajorCreditors')
        .and.returnValue(of(OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK)),
      getMajorCreditorPrettyName: jasmine
        .createSpy('getMajorCreditorPrettyName')
        .and.returnValue(OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK),
      getOffenceByCjsCode: jasmine
        .createSpy('getOffenceByCjsCode')
        .and.returnValue(of(OPAL_FINES_OFFENCES_REF_DATA_MOCK)),
    };

    formSubmit = structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM[0]);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsAddAnOffenceComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('offence-details'),
          },
        },
        {
          provide: UtilsService,
          useValue: mockUtilsService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsAddAnOffenceComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    finesMacOffenceDetailsStore = TestBed.inject(FinesMacOffenceDetailsStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have state and populate data$', () => {
    expect(component['resultCodeData$']).not.toBeUndefined();
    expect(component['majorCreditorData$']).not.toBeUndefined();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [];
    finesMacStore.setFinesMacStore(finesMacState);

    formSubmit.nestedFlow = false;

    component.handleOffenceDetailsSubmit(formSubmit);

    expect(finesMacStore.offenceDetails()).toContain(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.reviewOffences], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [];
    finesMacStore.setFinesMacStore(finesMacState);
    component.offenceIndex = 0;

    formSubmit.nestedFlow = true;

    component.handleOffenceDetailsSubmit(formSubmit);

    expect(finesMacStore.offenceDetails()).toContain(formSubmit);
    expect(routerSpy).not.toHaveBeenCalled();
    expect(component.showOffenceDetailsForm).toBeTruthy();
    expect(component.offenceIndex).toBe(1);
    expect(finesMacOffenceDetailsStore.emptyOffences()).toBeFalsy();
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(finesMacStore.unsavedChanges()).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(finesMacStore.unsavedChanges()).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });

  it('should update offence details index when form exists in the state', () => {
    const form = structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK);

    const existingForm = structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK);

    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [structuredClone(existingForm)];
    finesMacState.offenceDetails[0] = {
      ...structuredClone(finesMacState.offenceDetails[0]),
      childFormData: null,
    };
    finesMacStore.setFinesMacStore(finesMacState);

    component['updateOffenceDetailsIndex'](form);

    expect(finesMacStore.offenceDetails().length).toBe(1);
    expect(finesMacStore.offenceDetails()[0].formData).toEqual(form.formData);
    expect(finesMacStore.offenceDetails()[0].childFormData).toBeNull();
  });

  it('should add offence details form to the state when form does not exist', () => {
    const form = {
      ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK),
      formData: {
        ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK.formData),
        fm_offence_details_impositions: [
          {
            ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK.formData.fm_offence_details_impositions[0]),
            fm_offence_details_amount_imposed: 100,
            fm_offence_details_amount_paid: 50,
          },
        ],
      },
    };

    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [];
    finesMacStore.setFinesMacStore(finesMacState);

    component['updateOffenceDetailsIndex'](form);

    expect(finesMacStore.offenceDetails().length).toBe(1);
    expect(finesMacStore.offenceDetails()[0]).toEqual(form);
  });

  it('should add offence details form to the state when form does not exist', () => {
    const form = structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK);
    const offenceWithMinorCreditor = structuredClone(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft);
    offenceWithMinorCreditor[0].childFormData = [structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK)];
    finesMacOffenceDetailsStore.setOffenceDetailsDraft(offenceWithMinorCreditor);
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [];
    finesMacStore.setFinesMacStore(finesMacState);

    component['updateOffenceDetailsIndex'](form);

    expect(finesMacStore.offenceDetails().length).toBe(1);
    expect(finesMacStore.offenceDetails()[0]).toEqual(form);
  });

  it('should add new object when offenceDetails is empty', () => {
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [];
    finesMacStore.setFinesMacStore(finesMacState);

    component['retrieveFormData']();

    expect(finesMacStore.offenceDetails()).toEqual([]);
  });

  it('should create autocomplete items for results', () => {
    const response = OPAL_FINES_RESULTS_REF_DATA_MOCK;
    const result = component['createAutoCompleteItemsResults'](response);
    expect(result.length).toBe(response.refData.length);
    expect(result[0].value).toBe(response.refData[0].result_id);
    expect(result[0].name).toBe(OPAL_FINES_RESULT_PRETTY_NAME_MOCK);
  });

  it('should create autocomplete items for major creditors', () => {
    const response = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK;
    const result = component['createAutoCompleteItemsMajorCreditors'](response);
    expect(result.length).toBe(response.refData.length);
    expect(result[0].value).toBe(response.refData[0].major_creditor_id);
    expect(result[0].name).toBe(OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK);
  });

  it('should update offence details index when form exists in the state', () => {
    const form = structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK);

    const existingForm = structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK);

    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [structuredClone(existingForm)];
    finesMacState.offenceDetails[0].childFormData = null;
    finesMacStore.setFinesMacStore(finesMacState);

    component['updateOffenceDetailsIndex'](form);

    expect(finesMacStore.offenceDetails().length).toBe(1);
    expect(finesMacStore.offenceDetails()[0].formData).toEqual(form.formData);
    expect(finesMacStore.offenceDetails()[0].childFormData).toBeNull();
  });

  it('should add offence details form to the state when form does not exist', () => {
    const form = structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK);

    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [];
    finesMacStore.setFinesMacStore(finesMacState);

    component['updateOffenceDetailsIndex'](form);

    expect(finesMacStore.offenceDetails().length).toBe(1);
    expect(finesMacStore.offenceDetails()[0]).toEqual(form);
  });

  it('should retrieve form data and set offenceIndex to 0 when offenceDetails is empty', () => {
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [];
    finesMacStore.setFinesMacStore(finesMacState);

    component['retrieveFormData']();

    expect(component.offenceIndex).toBe(0);
  });

  it('should retrieve form data and set offenceIndex to offenceIndex from service when offenceDetails is not empty', () => {
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK)];
    finesMacStore.setFinesMacStore(finesMacState);

    finesMacOffenceDetailsStore.setOffenceIndex(1);

    component['retrieveFormData']();

    expect(component.offenceIndex).toBe(1);
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [];
    finesMacStore.setFinesMacStore(finesMacState);

    formSubmit.nestedFlow = false;

    component.handleOffenceDetailsSubmit(formSubmit);

    expect(finesMacStore.offenceDetails()).toContain(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.reviewOffences], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [];
    finesMacStore.setFinesMacStore(finesMacState);
    component.offenceIndex = 0;

    formSubmit.nestedFlow = true;

    component.handleOffenceDetailsSubmit(formSubmit);

    expect(finesMacStore.offenceDetails()).toContain(formSubmit);
    expect(routerSpy).not.toHaveBeenCalled();
    expect(component.showOffenceDetailsForm).toBeTruthy();
    expect(component.offenceIndex).toBe(1);
    expect(finesMacOffenceDetailsStore.emptyOffences()).toBeFalsy();
  });

  it('should handle unsaved changes', () => {
    component.handleUnsavedChanges(true);
    expect(finesMacStore.unsavedChanges()).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(finesMacStore.unsavedChanges()).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });

  it('should set minorCreditorAdded to false on destroy', () => {
    component.ngOnDestroy();
    expect(finesMacOffenceDetailsStore.minorCreditorAdded()).toBeFalsy();
  });

  it('should get collection order date from payment terms', () => {
    const date = new Date();
    spyOn(component['dateService'], 'getDateFromFormat').and.returnValue(date);
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.paymentTerms = {
      ...structuredClone(FINES_MAC_PAYMENT_TERMS_FORM_MOCK),
      formData: {
        ...structuredClone(FINES_MAC_PAYMENT_TERMS_STATE_MOCK),
        fm_payment_terms_collection_order_date: '01/01/2022',
      },
    };
    finesMacStore.setFinesMacStore(finesMacState);

    const result = component['getCollectionOrderDate']();

    expect(result).toBe(date);
  });

  it('should return null when collection order date is not available', () => {
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.paymentTerms = {
      ...structuredClone(FINES_MAC_PAYMENT_TERMS_FORM_MOCK),
      formData: {
        ...structuredClone(FINES_MAC_PAYMENT_TERMS_STATE_MOCK),
        fm_payment_terms_collection_order_date: null,
      },
    };
    finesMacStore.setFinesMacStore(finesMacState);

    const result = component['getCollectionOrderDate']();

    expect(result).toBeNull();
  });

  it('should set payment terms status to INCOMPLETE when collection order date is earlier than earliest date of sentence', () => {
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.paymentTerms = {
      ...structuredClone(FINES_MAC_PAYMENT_TERMS_FORM_MOCK),
      formData: {
        ...structuredClone(FINES_MAC_PAYMENT_TERMS_STATE_MOCK),
        fm_payment_terms_collection_order_date: '01/01/2022',
      },
    };
    finesMacState.offenceDetails = [structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK)];
    finesMacStore.setFinesMacStore(finesMacState);
    mockUtilsService.getFormStatus.and.returnValue(FINES_MAC_STATUS.INCOMPLETE);

    component['checkPaymentTermsCollectionOrder']();

    expect(finesMacStore.paymentTermsStatus()).toEqual(FINES_MAC_STATUS.INCOMPLETE);
  });

  it('should not set payment terms status to INCOMPLETE when collection order date is not earlier than earliest date of sentence', () => {
    const collectionOrderDate = new Date('2022-03-01');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(component as any, 'getCollectionOrderDate').and.returnValue(collectionOrderDate);
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.paymentTerms = structuredClone(FINES_MAC_PAYMENT_TERMS_FORM);
    finesMacStore.setFinesMacStore(finesMacState);

    component['checkPaymentTermsCollectionOrder']();

    expect(finesMacStore.paymentTerms().status).not.toBe(FINES_MAC_STATUS.INCOMPLETE);
  });
});
