import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FINES_ACC_ENF_ACTION_ROUTING_PATHS } from '../fines-acc-enf-action-select/constants/fines-acc-enf-action-select-routing-paths.constant';
import { FinesAccEnfActionAddComponent } from './fines-acc-enf-action-add.component';
import { FINES_ACC_ENF_ACTION_ADD_API_DATA_KEYS } from './constants/fines-acc-enf-action-add-api-data-keys.constant';
import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from './constants/fines-acc-enf-action-add-field-types.constant';
import { FinesAccEnfActionAddService } from './services/fines-acc-enf-action-add.service';
import { FINES_ACC_ENF_ACTION_ADD_ACCOUNT_STATE_MOCK } from './mocks/fines-acc-enf-action-add-account-state.mock';
import { FINES_ACC_ENF_ACTION_ADD_ADDITIONAL_ACTION_RESULT_MOCK } from './mocks/fines-acc-enf-action-add-additional-action-result.mock';
import { FINES_ACC_ENF_ACTION_ADD_MAPPED_FIELDS_MOCK } from './mocks/fines-acc-enf-action-add-mapped-fields.mock';
import { FINES_ACC_ENF_ACTION_ADD_NON_WELSH_ACCOUNT_STATE_MOCK } from './mocks/fines-acc-enf-action-add-non-welsh-account-state.mock';
import { FINES_ACC_ENF_ACTION_ADD_OPAL_FINES_SERVICE_MOCK } from './mocks/fines-acc-enf-action-add-opal-fines-service.mock';
import { FINES_ACC_ENF_ACTION_ADD_PAYLOAD_MOCK } from './mocks/fines-acc-enf-action-add-payload.mock';
import { FINES_ACC_ENF_ACTION_ADD_PAYLOAD_SERVICE_MOCK } from './mocks/fines-acc-enf-action-add-payload-service.mock';
import { FINES_ACC_ENF_ACTION_ADD_SERVICE_MOCK } from './mocks/fines-acc-enf-action-add-service.mock';
import { FINES_ACC_ENF_ACTION_ADD_STORE_MOCK } from './mocks/fines-acc-enf-action-add-store.mock';
import { FINES_ACC_ENF_ACTION_ADD_SUBMIT_FORM_MOCK } from './mocks/fines-acc-enf-action-add-submit-form.mock';
import { createFinesAccEnfActionAddActivatedRouteMock } from './mocks/fines-acc-enf-action-add-activated-route.mock';
import { FINES_ACC_ENF_ACTION_ADD_COLLO_RESULT_WITHOUT_PAYMENT_TERMS_FLAG_MOCK } from './mocks/fines-acc-enf-action-add-collo-result-without-payment-terms-flag.mock';
import { FINES_ACC_ENF_ACTION_ADD_NEW_SUCCESS_MESSAGE } from '../fines-acc-enf-action-add-new/constants/fines-acc-enf-action-add-new-success-message.constant';

describe('FinesAccEnfActionAddComponent', () => {
  let component: FinesAccEnfActionAddComponent;
  let fixture: ComponentFixture<FinesAccEnfActionAddComponent>;
  let activatedRouteStub: ReturnType<typeof createFinesAccEnfActionAddActivatedRouteMock>;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };

  const mockFinesAccStore = FINES_ACC_ENF_ACTION_ADD_STORE_MOCK;
  const mockPayloadService = FINES_ACC_ENF_ACTION_ADD_PAYLOAD_SERVICE_MOCK;
  const mockAddService = FINES_ACC_ENF_ACTION_ADD_SERVICE_MOCK;
  const mockOpalFinesService = FINES_ACC_ENF_ACTION_ADD_OPAL_FINES_SERVICE_MOCK;

  const createComponent = () => {
    fixture = TestBed.createComponent(FinesAccEnfActionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    activatedRouteStub = createFinesAccEnfActionAddActivatedRouteMock();
    mockRouter = { navigate: vi.fn() };

    mockFinesAccStore.account_id.set(12345);
    mockFinesAccStore.base_version.set('1');
    mockFinesAccStore.business_unit_id.set('78');
    mockFinesAccStore.welsh_speaking.set('Y');
    mockFinesAccStore.setAccountState.mockImplementation(
      (accountState: typeof FINES_ACC_ENF_ACTION_ADD_ACCOUNT_STATE_MOCK) => {
        mockFinesAccStore.account_id.set(accountState.account_id);
        mockFinesAccStore.base_version.set(accountState.base_version);
        mockFinesAccStore.business_unit_id.set(accountState.business_unit_id);
        mockFinesAccStore.welsh_speaking.set(accountState.welsh_speaking);
      },
    );
    mockPayloadService.transformDefendantAccountHeaderForStore.mockReturnValue(
      FINES_ACC_ENF_ACTION_ADD_ACCOUNT_STATE_MOCK,
    );
    mockPayloadService.buildEnforcementActionAddPayload.mockReturnValue(FINES_ACC_ENF_ACTION_ADD_PAYLOAD_MOCK);
    mockAddService.mapResultParamsToFormStructure.mockReturnValue({
      fields: FINES_ACC_ENF_ACTION_ADD_MAPPED_FIELDS_MOCK,
    });
    mockOpalFinesService.addEnforcementAction.mockReturnValue(of({}));
    mockOpalFinesService.getEnforcerPrettyName.mockImplementation(
      (enforcer: { name: string; enforcer_code: number }) => `${enforcer.name} (${enforcer.enforcer_code})`,
    );

    await TestBed.configureTestingModule({
      imports: [FinesAccEnfActionAddComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: mockRouter },
        { provide: FinesAccountStore, useValue: mockFinesAccStore },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
        { provide: FinesAccEnfActionAddService, useValue: mockAddService },
        { provide: OpalFines, useValue: mockOpalFinesService },
      ],
    }).compileComponents();
  });

  it('should create and map result parameters using the Welsh-speaking account store value', () => {
    createComponent();

    expect(component).toBeTruthy();
    expect(component.accountNumber).toBe(FINES_ACC_ENF_ACTION_ADD_ACCOUNT_STATE_MOCK.account_number);
    expect(component.partyName).toBe(FINES_ACC_ENF_ACTION_ADD_ACCOUNT_STATE_MOCK.party_name);
    expect(mockPayloadService.transformDefendantAccountHeaderForStore).toHaveBeenCalledWith(
      12345,
      activatedRouteStub.snapshot.data.defendantAccountHeadingData,
    );
    expect(mockFinesAccStore.setAccountState).toHaveBeenCalledWith(FINES_ACC_ENF_ACTION_ADD_ACCOUNT_STATE_MOCK);
    expect(mockAddService.mapResultParamsToFormStructure).toHaveBeenCalledWith(
      activatedRouteStub.snapshot.data.enforcementActionResult.result_parameters,
      true,
    );
    expect(component.fields).toEqual(FINES_ACC_ENF_ACTION_ADD_MAPPED_FIELDS_MOCK);
  });

  it('should populate enforcer autocomplete options from resolved API data', () => {
    (activatedRouteStub.snapshot.data as Record<string, unknown>)['enforcersRefData'] = {
      count: 1,
      refData: [{ enforcer_id: 1, enforcer_code: 101, name: 'Enforcer One', name_cy: null }],
    };
    mockAddService.mapResultParamsToFormStructure.mockReturnValue({
      fields: [
        {
          controlName: 'fines-acc-enf-action-add_enforcer',
          parameterName: 'enforcer',
          label: 'Enforcer',
          type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuAutocomplete,
          required: true,
          options: [],
          apiData: FINES_ACC_ENF_ACTION_ADD_API_DATA_KEYS.enforcers,
        },
      ],
    });

    createComponent();

    expect(component.fields[0].options).toEqual([{ value: 1, name: 'Enforcer One (101)' }]);
  });

  it('should use empty heading text when account state names are missing', () => {
    mockPayloadService.transformDefendantAccountHeaderForStore.mockReturnValue({
      ...FINES_ACC_ENF_ACTION_ADD_ACCOUNT_STATE_MOCK,
      account_number: null,
      party_name: null,
    });

    createComponent();

    expect(component.accountNumber).toBe('');
    expect(component.partyName).toBe('');
  });

  it('should default enforcer autocomplete options to empty when resolved API data is missing', () => {
    mockAddService.mapResultParamsToFormStructure.mockReturnValue({
      fields: [
        {
          controlName: 'fines-acc-enf-action-add_enforcer',
          parameterName: 'enforcer',
          label: 'Enforcer',
          type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuAutocomplete,
          required: true,
          options: [],
          apiData: FINES_ACC_ENF_ACTION_ADD_API_DATA_KEYS.enforcers,
        },
      ],
    });

    createComponent();

    expect(component.fields[0].options).toEqual([]);
  });

  it('should map result parameters without Welsh fields when the account is not Welsh speaking', () => {
    mockPayloadService.transformDefendantAccountHeaderForStore.mockReturnValue(
      FINES_ACC_ENF_ACTION_ADD_NON_WELSH_ACCOUNT_STATE_MOCK,
    );

    createComponent();

    expect(mockAddService.mapResultParamsToFormStructure).toHaveBeenCalledWith(
      activatedRouteStub.snapshot.data.enforcementActionResult.result_parameters,
      false,
    );
  });

  it('should show payment terms for COLLO even when the allow payment terms flag is false', () => {
    activatedRouteStub.snapshot.data.enforcementActionResult =
      FINES_ACC_ENF_ACTION_ADD_COLLO_RESULT_WITHOUT_PAYMENT_TERMS_FLAG_MOCK;

    createComponent();

    expect(component.showPaymentTerms).toBe(true);
  });

  it('should submit the add enforcement action payload and navigate to the enforcement tab', () => {
    createComponent();
    const routerNavigateSpy = vi.spyOn(component as never, 'routerNavigate');
    const form = structuredClone(FINES_ACC_ENF_ACTION_ADD_SUBMIT_FORM_MOCK);

    component.handleSubmit(form);

    expect(mockPayloadService.buildEnforcementActionAddPayload).toHaveBeenCalledWith(
      component.result,
      FINES_ACC_ENF_ACTION_ADD_MAPPED_FIELDS_MOCK,
      form.formData,
    );
    expect(mockOpalFinesService.addEnforcementAction).toHaveBeenCalledWith(
      12345,
      FINES_ACC_ENF_ACTION_ADD_PAYLOAD_MOCK,
      '1',
      '78',
    );
    expect(mockOpalFinesService.clearCache).toHaveBeenCalledWith('defendantAccountEnforcementCache$');
    expect(routerNavigateSpy).toHaveBeenCalledWith(
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
      false,
      undefined,
      null,
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement,
    );
  });

  it('should submit without optional headers when account version and business unit are missing', () => {
    createComponent();
    mockFinesAccStore.base_version.set(null);
    mockFinesAccStore.business_unit_id.set(null);

    component.handleSubmit(structuredClone(FINES_ACC_ENF_ACTION_ADD_SUBMIT_FORM_MOCK));

    expect(mockOpalFinesService.addEnforcementAction).toHaveBeenCalledWith(
      12345,
      FINES_ACC_ENF_ACTION_ADD_PAYLOAD_MOCK,
      undefined,
      undefined,
    );
  });

  it('should navigate to the add new action prompt when the result allows additional action', () => {
    activatedRouteStub.snapshot.data.enforcementActionResult = FINES_ACC_ENF_ACTION_ADD_ADDITIONAL_ACTION_RESULT_MOCK;
    createComponent();
    const routerNavigateSpy = vi.spyOn(component as never, 'routerNavigate');

    component.handleSubmit({
      ...FINES_ACC_ENF_ACTION_ADD_SUBMIT_FORM_MOCK,
    });

    expect(mockOpalFinesService.clearCache).toHaveBeenCalledWith('defendantAccountEnforcementCache$');
    expect(mockFinesAccStore.setSuccessMessage).toHaveBeenCalledWith(FINES_ACC_ENF_ACTION_ADD_NEW_SUCCESS_MESSAGE);
    expect(routerNavigateSpy).toHaveBeenCalledWith(
      `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.root}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children['add-new']}`,
    );
  });

  it('should restore unsaved changes when add enforcement action fails', () => {
    mockOpalFinesService.addEnforcementAction.mockReturnValue(throwError(() => new Error('API error')));
    createComponent();

    component.handleSubmit({
      ...FINES_ACC_ENF_ACTION_ADD_SUBMIT_FORM_MOCK,
    });

    expect((component as unknown as { stateUnsavedChanges: boolean }).stateUnsavedChanges).toBe(true);
  });

  it('should update unsaved changes and navigate back to the enforcement tab on cancel', () => {
    createComponent();
    const routerNavigateSpy = vi.spyOn(component as never, 'routerNavigate');

    component.handleUnsavedChanges(true);
    component.handleCancel();

    expect((component as unknown as { stateUnsavedChanges: boolean }).stateUnsavedChanges).toBe(true);
    expect(routerNavigateSpy).toHaveBeenCalledWith(
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
      false,
      undefined,
      null,
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement,
    );
  });

  it('should extend AbstractFormParentBaseComponent and expose inherited canDeactivate behaviour', () => {
    createComponent();

    expect(component).toBeInstanceOf(AbstractFormParentBaseComponent);
    expect(component['activatedRoute']).toBeDefined();

    component.handleUnsavedChanges(false);
    expect((component as unknown as { canDeactivate: () => boolean }).canDeactivate()).toBe(true);

    component.handleUnsavedChanges(true);
    expect((component as unknown as { canDeactivate: () => boolean }).canDeactivate()).toBe(false);
  });
});
