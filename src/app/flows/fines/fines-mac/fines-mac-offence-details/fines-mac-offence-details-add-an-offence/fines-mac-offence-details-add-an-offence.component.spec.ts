import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsAddAnOffenceComponent } from './fines-mac-offence-details-add-an-offence.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FinesService } from '@services/fines/fines-service/fines.service';
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
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE } from '../constants/fines-mac-offence-details-draft-state.constant';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from '../mocks/fines-mac-offence-details-draft-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK } from '../fines-mac-offence-details-minor-creditor/mocks/fines-mac-offence-details-minor-creditor-form.mock';
import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { FINES_MAC_PAYMENT_TERMS_FORM } from '../../fines-mac-payment-terms/constants/fines-mac-payment-terms-form';
import { FINES_MAC_PAYMENT_TERMS_STATE_MOCK } from '../../fines-mac-payment-terms/mocks/fines-mac-payment-terms-state.mock';
import { FINES_MAC_PAYMENT_TERMS_FORM_MOCK } from '../../fines-mac-payment-terms/mocks/fines-mac-payment-terms-form.mock';
import { FINES_MAC_PAYMENT_TERMS_STATE } from '../../fines-mac-payment-terms/constants/fines-mac-payment-terms-state';

describe('FinesMacOffenceDetailsAddAnOffenceComponent', () => {
  let component: FinesMacOffenceDetailsAddAnOffenceComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsAddAnOffenceComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService>;
  let mockOpalFinesService: Partial<OpalFines>;
  let formSubmit: IFinesMacOffenceDetailsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState', 'getEarliestDateOfSentence']);
    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;

    mockFinesMacOffenceDetailsService = jasmine.createSpyObj(FinesMacOffenceDetailsService, [
      'offenceIndex',
      'addedOffenceCode',
      'finesMacOffenceDetailsDraftState',
    ]);
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = { ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE };

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

    formSubmit = FINES_MAC_OFFENCE_DETAILS_FORM[0];

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsAddAnOffenceComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: FinesMacOffenceDetailsService, useValue: mockFinesMacOffenceDetailsService },
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsAddAnOffenceComponent);
    component = fixture.componentInstance;
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
    mockFinesService.finesMacState.offenceDetails = [];

    formSubmit.nestedFlow = false;

    component.handleOffenceDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.offenceDetails).toContain(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.reviewOffences], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    mockFinesService.finesMacState.offenceDetails = [];

    formSubmit.nestedFlow = true;

    component.handleOffenceDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.offenceDetails).toContain(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(mockFinesService.finesMacState.unsavedChanges).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(mockFinesService.finesMacState.unsavedChanges).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });

  it('should update offence details index when form exists in the state', () => {
    const form = { ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK };

    const existingForm = { ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK };

    mockFinesService.finesMacState.offenceDetails = [{ ...existingForm }];
    mockFinesService.finesMacState.offenceDetails[0].childFormData = null;

    component['updateOffenceDetailsIndex'](form);

    expect(mockFinesService.finesMacState.offenceDetails.length).toBe(1);
    expect(mockFinesService.finesMacState.offenceDetails[0].formData).toEqual(form.formData);
    expect(mockFinesService.finesMacState.offenceDetails[0].childFormData).toBeNull();
  });

  it('should add offence details form to the state when form does not exist', () => {
    const form = { ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK };

    mockFinesService.finesMacState.offenceDetails = [];

    component['updateOffenceDetailsIndex'](form);

    expect(mockFinesService.finesMacState.offenceDetails.length).toBe(1);
    expect(mockFinesService.finesMacState.offenceDetails[0]).toEqual(form);
  });

  it('should add offence details form to the state when form does not exist', () => {
    const form = { ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK };
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = {
      ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
    };
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0].childFormData = [
      { ...FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK },
    ];

    mockFinesService.finesMacState.offenceDetails = [];

    component['updateOffenceDetailsIndex'](form);

    expect(mockFinesService.finesMacState.offenceDetails.length).toBe(1);
    expect(mockFinesService.finesMacState.offenceDetails[0]).toEqual(form);
  });

  it('should add new object when offenceDetails is empty', () => {
    mockFinesService.finesMacState.offenceDetails = [];

    component['retrieveFormData']();

    expect(mockFinesService.finesMacState.offenceDetails).toEqual([]);
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
    const form = { ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK };

    const existingForm = { ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK };

    mockFinesService.finesMacState.offenceDetails = [{ ...existingForm }];
    mockFinesService.finesMacState.offenceDetails[0].childFormData = null;

    component['updateOffenceDetailsIndex'](form);

    expect(mockFinesService.finesMacState.offenceDetails.length).toBe(1);
    expect(mockFinesService.finesMacState.offenceDetails[0].formData).toEqual(form.formData);
    expect(mockFinesService.finesMacState.offenceDetails[0].childFormData).toBeNull();
  });

  it('should add offence details form to the state when form does not exist', () => {
    const form = { ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK };

    mockFinesService.finesMacState.offenceDetails = [];

    component['updateOffenceDetailsIndex'](form);

    expect(mockFinesService.finesMacState.offenceDetails.length).toBe(1);
    expect(mockFinesService.finesMacState.offenceDetails[0]).toEqual(form);
  });

  it('should retrieve form data and set offenceIndex to 0 when offenceDetails is empty', () => {
    mockFinesService.finesMacState.offenceDetails = [];

    component['retrieveFormData']();

    expect(component.offenceIndex).toBe(0);
  });

  it('should retrieve form data and set offenceIndex to offenceIndex from service when offenceDetails is not empty', () => {
    mockFinesService.finesMacState.offenceDetails = [{ ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK }];
    mockFinesMacOffenceDetailsService.offenceIndex = 1;

    component['retrieveFormData']();

    expect(component.offenceIndex).toBe(1);
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    mockFinesService.finesMacState.offenceDetails = [];

    formSubmit.nestedFlow = false;

    component.handleOffenceDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.offenceDetails).toContain(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.reviewOffences], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    mockFinesService.finesMacState.offenceDetails = [];

    formSubmit.nestedFlow = true;

    component.handleOffenceDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.offenceDetails).toContain(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle unsaved changes', () => {
    component.handleUnsavedChanges(true);
    expect(mockFinesService.finesMacState.unsavedChanges).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(mockFinesService.finesMacState.unsavedChanges).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });

  it('should set minorCreditorAdded to false on destroy', () => {
    component.ngOnDestroy();
    expect(mockFinesMacOffenceDetailsService.minorCreditorAdded).toBeFalsy();
  });

  it('should get collection order date from payment terms', () => {
    const date = new Date();
    spyOn(component['dateService'], 'getDateFromFormat').and.returnValue(date);
    mockFinesService.finesMacState.paymentTerms = {
      ...FINES_MAC_PAYMENT_TERMS_FORM_MOCK,
      formData: {
        ...FINES_MAC_PAYMENT_TERMS_STATE_MOCK,
        fm_payment_terms_collection_order_date: '01/01/2022',
      },
    };

    const result = component['getCollectionOrderDate']();

    expect(result).toBe(date);
  });

  it('should return null when collection order date is not available', () => {
    mockFinesService.finesMacState.paymentTerms = {
      ...FINES_MAC_PAYMENT_TERMS_FORM,
      formData: { ...FINES_MAC_PAYMENT_TERMS_STATE, fm_payment_terms_collection_order_date: null },
    };

    const result = component['getCollectionOrderDate']();

    expect(result).toBeNull();
  });

  it('should set payment terms status to INCOMPLETE when collection order date is earlier than earliest date of sentence', () => {
    const earliestDateOfSentence = new Date('2022-02-01');
    mockFinesService.finesMacState.paymentTerms = {
      ...FINES_MAC_PAYMENT_TERMS_FORM_MOCK,
      formData: {
        ...FINES_MAC_PAYMENT_TERMS_STATE_MOCK,
        fm_payment_terms_collection_order_date: '01/01/2022',
      },
    };
    mockFinesService.getEarliestDateOfSentence.and.returnValue(earliestDateOfSentence);

    component['checkPaymentTermsCollectionOrder']();

    expect(mockFinesService.finesMacState.paymentTerms.status).toBe(FINES_MAC_STATUS.INCOMPLETE);
  });

  it('should not set payment terms status to INCOMPLETE when collection order date is not earlier than earliest date of sentence', () => {
    const collectionOrderDate = new Date('2022-03-01');
    const earliestDateOfSentence = new Date('2022-02-01');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(component as any, 'getCollectionOrderDate').and.returnValue(collectionOrderDate);
    mockFinesService.finesMacState.paymentTerms = { ...FINES_MAC_PAYMENT_TERMS_FORM };
    mockFinesService.getEarliestDateOfSentence.and.returnValue(earliestDateOfSentence);

    component['checkPaymentTermsCollectionOrder']();

    expect(mockFinesService.finesMacState.paymentTerms.status).not.toBe(FINES_MAC_STATUS.INCOMPLETE);
  });
});
