import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacPaymentTermsFormComponent } from './fines-mac-payment-terms-form.component';
import { ActivatedRoute } from '@angular/router';
import { IFinesMacPaymentTermsForm } from '../interfaces/fines-mac-payment-terms-form.interface';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { FINES_MAC_PAYMENT_TERMS_FORM_MOCK } from '../mocks/fines-mac-payment-terms-form.mock';
import { DateTime } from 'luxon';
import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../../fines-mac-offence-details/mocks/fines-mac-offence-details-form.mock';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { FINES_MAC_PERSONAL_DETAILS_FORM_MOCK } from '../../fines-mac-personal-details/mocks/fines-mac-personal-details-form.mock';
import { of } from 'rxjs';
import { FINES_MAC_PAYMENT_TERMS_PERMISSIONS } from '../constants/fines-mac-payment-terms-permission-values.constant';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { SESSION_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';

describe('FinesMacPaymentTermsFormComponent', () => {
  let component: FinesMacPaymentTermsFormComponent;
  let fixture: ComponentFixture<FinesMacPaymentTermsFormComponent>;
  let mockDateService: jasmine.SpyObj<DateService>;

  let formSubmit: IFinesMacPaymentTermsForm;
  let globalStore: GlobalStoreType;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    mockDateService = jasmine.createSpyObj(DateService, [
      'getPreviousDate',
      'calculateAge',
      'isValidDate',
      'isDateInThePast',
      'isDateInTheFuture',
      'getDateNow',
      'toFormat',
      'toDateStringFormat',
      'getDateFromFormat',
    ]);
    formSubmit = structuredClone(FINES_MAC_PAYMENT_TERMS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacPaymentTermsFormComponent],
      providers: [
        { provide: DateService, useValue: mockDateService },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacPaymentTermsFormComponent);
    component = fixture.componentInstance;

    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;

    globalStore = TestBed.inject(GlobalStore);
    globalStore.setUserState(SESSION_USER_STATE_MOCK);

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    fixture.detectChanges();
  });

  beforeEach(() => {
    component.form.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;
    formSubmit.nestedFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalled();
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    formSubmit.nestedFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalled();
  });

  it('should call initialPaymentTermsSetup method', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupPermissions');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupPaymentTermsForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'paymentTermsListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'determineAccess');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'addCollectionOrderFormControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'addDefaultDatesFormControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'addEnforcementFields');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'rePopulateForm');
    mockDateService.getPreviousDate.and.returnValue('30/08/2024');
    component.accessDefaultDates = true;
    mockDateService.toFormat.and.returnValue('31/08/2024');
    component.accessCollectionOrder = true;
    component.accessDefaultDates = true;
    component['initialPaymentTermsSetup']();

    expect(component['setupPermissions']).toHaveBeenCalled();
    expect(component['setupPaymentTermsForm']).toHaveBeenCalled();
    expect(component['paymentTermsListener']).toHaveBeenCalled();
    expect(component['determineAccess']).toHaveBeenCalled();
    expect(component['addCollectionOrderFormControls']).toHaveBeenCalled();
    expect(component['addDefaultDatesFormControls']).toHaveBeenCalled();
    expect(component['addEnforcementFields']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(finesMacStore.paymentTerms().formData);
    expect(mockDateService.getPreviousDate).toHaveBeenCalledWith({ days: 1 });
    expect(component.yesterday).toBeDefined();
    expect(component.today).toBeDefined();
  });

  it('should call initialPaymentTermsSetup method with offence details data', () => {
    finesMacStore.setPaymentTerms({
      ...structuredClone(FINES_MAC_PAYMENT_TERMS_FORM_MOCK),
      formData: {
        ...structuredClone(FINES_MAC_PAYMENT_TERMS_FORM_MOCK.formData),
        fm_payment_terms_collection_order_date: '01/09/2024',
      },
    });
    finesMacStore.setOffenceDetails([
      {
        ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK),
        formData: {
          ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK.formData),
          fm_offence_details_date_of_sentence: '01/09/2024',
        },
      },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupPermissions');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupPaymentTermsForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'paymentTermsListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'determineAccess');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'addCollectionOrderFormControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'addDefaultDatesFormControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'addEnforcementFields');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'rePopulateForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'handleErrorMessages');
    mockDateService.getPreviousDate.and.returnValue('30/08/2024');
    component.accessDefaultDates = true;
    mockDateService.toFormat.and.returnValue('31/08/2024');
    mockDateService.getDateFromFormat.and.returnValue(new Date('01/09/2024'));
    component.accessCollectionOrder = true;
    component.accessDefaultDates = true;
    component['initialPaymentTermsSetup']();

    expect(component['setupPermissions']).toHaveBeenCalled();
    expect(component['setupPaymentTermsForm']).toHaveBeenCalled();
    expect(component['paymentTermsListener']).toHaveBeenCalled();
    expect(component['determineAccess']).toHaveBeenCalled();
    expect(component['addCollectionOrderFormControls']).toHaveBeenCalled();
    expect(component['addDefaultDatesFormControls']).toHaveBeenCalled();
    expect(component['addEnforcementFields']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(finesMacStore.paymentTerms().formData);
    expect(mockDateService.getPreviousDate).toHaveBeenCalledWith({ days: 1 });
    expect(component.yesterday).toBeDefined();
    expect(component.today).toBeDefined();
    expect(component['handleErrorMessages']).toHaveBeenCalled();
  });

  it('should add controls when has days in default is true', () => {
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.parentOrGuardianToPay;

    component['initialPaymentTermsSetup']();

    const hasDaysInDefaultControl = component.form.controls['fm_payment_terms_has_days_in_default'];
    hasDaysInDefaultControl.setValue(true);

    expect(component.form.contains('fm_payment_terms_suspended_committal_date')).toBe(true);
    expect(component.form.contains('fm_payment_terms_default_days_in_jail')).toBe(true);
    expect(component.form.contains('fm_payment_terms_suspended_committal_date')).toBe(true);
    expect(component.form.contains('fm_payment_terms_default_days_in_jail')).toBe(true);
  });

  it('should remove controls when has days in default is false', () => {
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.parentOrGuardianToPay;

    component['initialPaymentTermsSetup']();

    const hasDaysInDefaultControl = component.form.controls['fm_payment_terms_has_days_in_default'];
    hasDaysInDefaultControl.setValue(false);

    expect(component.form.contains('fm_payment_terms_suspended_committal_date')).toBe(false);
    expect(component.form.contains('fm_payment_terms_default_days_in_jail')).toBe(false);
    expect(component.form.contains('fm_payment_terms_suspended_committal_date')).toBe(false);
    expect(component.form.contains('fm_payment_terms_default_days_in_jail')).toBe(false);
  });

  it('should set dateInFuture and dateInPast to true when dateValue is a valid date in the future', () => {
    const dateValue = DateTime.now().plus({ years: 4 }).toFormat('dd/MM/yyyy');
    mockDateService.isValidDate.and.returnValue(true);
    mockDateService.isDateInTheFuture.and.returnValue(true);
    mockDateService.isDateInThePast.and.returnValue(false);

    component['dateChecker'](dateValue);

    expect(component.dateInFuture).toBe(true);
    expect(component.dateInPast).toBe(false);
  });

  it('should set dateInFuture and dateInPast to true when dateValue is a valid date in the past', () => {
    const dateValue = DateTime.now().minus({ years: 4 }).toFormat('dd/MM/yyyy');
    mockDateService.isValidDate.and.returnValue(true);
    mockDateService.isDateInTheFuture.and.returnValue(false);
    mockDateService.isDateInThePast.and.returnValue(true);

    component['dateChecker'](dateValue);

    expect(component.dateInFuture).toBe(false);
    expect(component.dateInPast).toBe(true);
  });

  it('should set dateInFuture and dateInPast to false when dateValue is not a valid date', () => {
    const dateValue = 'invalid-date';
    mockDateService.isValidDate.and.returnValue(false);

    component['dateChecker'](dateValue);

    expect(component.dateInFuture).toBe(false);
    expect(component.dateInPast).toBe(false);
  });

  it('should update form controls based on selected payment term', () => {
    const paymentTermsControl = component.form.controls['fm_payment_terms_payment_terms'];
    const selectedTerm = 'payInFull';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removeControlsSpy = spyOn<any>(component, 'removeControls');

    paymentTermsControl.setValue(selectedTerm);

    expect(removeControlsSpy).toHaveBeenCalled();
  });

  it('should update form controls based on selected payment term', () => {
    const paymentTermsControl = component.form.controls['fm_payment_terms_payment_terms'];
    const selectedTerm = 'instalmentsOnly';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removeControlsSpy = spyOn<any>(component, 'removeControls');

    paymentTermsControl.setValue(selectedTerm);

    expect(removeControlsSpy).toHaveBeenCalledTimes(1);
  });

  it('should check defendant age and set accessDefaultDates to true when age is 18 or above', () => {
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;
    const dob = DateTime.now().minus({ years: 30 }).toFormat('dd/MM/yyyy');
    finesMacStore.setPersonalDetails({
      ...structuredClone(FINES_MAC_PERSONAL_DETAILS_FORM_MOCK),
      formData: {
        ...structuredClone(FINES_MAC_PERSONAL_DETAILS_FORM_MOCK.formData),
        fm_personal_details_dob: dob,
      },
    });
    mockDateService.calculateAge.and.returnValue(30);

    component['determineAccess']();

    expect(component.accessDefaultDates).toBe(true);
    expect(component.accessCollectionOrder).toBe(true);
    expect(mockDateService.calculateAge).toHaveBeenCalledWith(dob);
  });

  it('should check defendant age and set accessDefaultDates to false when age is below 18', () => {
    const dob = DateTime.now().minus({ years: 10 }).toFormat('dd/MM/yyyy');
    finesMacStore.setPersonalDetails({
      ...structuredClone(FINES_MAC_PERSONAL_DETAILS_FORM_MOCK),
      formData: {
        ...structuredClone(FINES_MAC_PERSONAL_DETAILS_FORM_MOCK.formData),
        fm_personal_details_dob: dob,
      },
    });
    mockDateService.calculateAge.and.returnValue(10);
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;

    component['determineAccess']();

    expect(component.accessDefaultDates).toBe(false);
    expect(component.accessCollectionOrder).toBe(false);
    expect(mockDateService.calculateAge).toHaveBeenCalledWith(dob);
  });

  it('should set accessDefaultDates to true defendant type parent or guardian to pay', () => {
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.parentOrGuardianToPay;

    component['determineAccess']();

    expect(component.accessDefaultDates).toBe(true);
    expect(component.accessCollectionOrder).toBe(true);
  });

  it('should set accessDefaultDates to true defendant type parent or guardian to pay', () => {
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.company;

    component['determineAccess']();

    expect(component.accessDefaultDates).toBe(false);
    expect(component.accessCollectionOrder).toBe(false);
  });

  it('should create enforcement fields for company defendant type', () => {
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.company;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addControlsSpy = spyOn<any>(component, 'addControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const holdEnforcementListener = spyOn<any>(component, 'noEnfListener');

    component['addEnforcementFields']();

    expect(addControlsSpy).toHaveBeenCalledWith([
      { controlName: 'fm_payment_terms_hold_enforcement_on_account', validators: [] },
    ]);
    expect(holdEnforcementListener).toHaveBeenCalled();
  });

  it('should create enforcement fields for non-company defendant type', () => {
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addControlsSpy = spyOn<any>(component, 'addControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addEnforcementActionSpy = spyOn<any>(component, 'addEnforcementActionListener');

    component['addEnforcementFields']();

    expect(addControlsSpy).toHaveBeenCalledWith([
      { controlName: 'fm_payment_terms_add_enforcement_action', validators: [] },
    ]);
    expect(addEnforcementActionSpy).toHaveBeenCalled();
  });

  it('should add control when hold enforcement on account is true', () => {
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.company;
    component['addEnforcementFields']();
    const NOENFControl = component.form.controls['fm_payment_terms_hold_enforcement_on_account'];
    NOENFControl.setValue(true);

    component['noEnfListener']();

    expect(component.form.contains('fm_payment_terms_reason_account_is_on_noenf')).toBe(true);
  });

  it('should remove control when hold enforcement on account is false', () => {
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.company;
    component['addEnforcementFields']();
    const NOENFControl = component.form.controls['fm_payment_terms_hold_enforcement_on_account'];
    NOENFControl.setValue(false);

    component['noEnfListener']();

    expect(component.form.contains('fm_payment_terms_reason_account_is_on_noenf')).toBe(false);
  });

  it('should reset and create collection order date when has collection order value is "yes"', () => {
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;
    component.accessCollectionOrder = true;
    component['addCollectionOrderFormControls']();
    const hasCollectionOrderControl = component.form.controls['fm_payment_terms_collection_order_made'];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'addControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'removeControls');

    component['hasCollectionOrderListener']();
    hasCollectionOrderControl.setValue(true);

    expect(component['addControls']).toHaveBeenCalledWith(component.collectionOrderControls.true.fieldsToAdd);
    expect(component['removeControls']).toHaveBeenCalledWith(component.collectionOrderControls.true.fieldsToRemove);
  });

  it('should reset and create collection order date when has collection order value is "yes" with offence date', () => {
    mockDateService.toDateStringFormat.and.returnValue(
      FINES_MAC_OFFENCE_DETAILS_FORM_MOCK.formData.fm_offence_details_date_of_sentence!,
    );
    mockDateService.getDateFromFormat.and.returnValue(
      new Date(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK.formData.fm_offence_details_date_of_sentence!),
    );
    finesMacStore.setOffenceDetails([structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK)]);

    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;
    component.accessCollectionOrder = true;
    component['addCollectionOrderFormControls']();
    const hasCollectionOrderControl = component.form.controls['fm_payment_terms_collection_order_made'];

    component['hasCollectionOrderListener']();
    hasCollectionOrderControl.setValue(true);

    expect(component.form.get('fm_payment_terms_collection_order_date')!.value).toBe(
      FINES_MAC_OFFENCE_DETAILS_FORM_MOCK.formData.fm_offence_details_date_of_sentence,
    );
  });

  it('should remove collection order date and create make collection order today and collection order date when has collection order value is not "yes"', () => {
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;
    component.accessCollectionOrder = true;
    component['addCollectionOrderFormControls']();
    const hasCollectionOrderControl = component.form.controls['fm_payment_terms_collection_order_made'];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'addControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'removeControls');

    component['hasCollectionOrderListener']();
    hasCollectionOrderControl.setValue(false);

    expect(component['addControls']).toHaveBeenCalledWith(component.collectionOrderControls.false.fieldsToAdd);
    expect(component['removeControls']).toHaveBeenCalledWith(component.collectionOrderControls.false.fieldsToRemove);
  });

  it('should set collection order date when make collection order today is true', () => {
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;
    component.accessCollectionOrder = true;
    component.today = '31/08/2024';
    component['addCollectionOrderFormControls']();
    component['hasCollectionOrderListener']();
    const hasCollectionOrderControl = component.form.controls['fm_payment_terms_collection_order_made'];
    hasCollectionOrderControl.setValue(false);

    const makeCollectionOrderToday = component.form.controls['fm_payment_terms_collection_order_made_today'];
    makeCollectionOrderToday.setValue(true);

    component['setCollectionOrderDate']();

    expect(component.form.get('fm_payment_terms_collection_order_date')!.value).toBe(component.today);
  });

  it('should set collection order date when make collection order today is false', () => {
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;
    component.accessCollectionOrder = true;
    component.today = '31/08/2024';
    component['addCollectionOrderFormControls']();
    component['hasCollectionOrderListener']();
    const hasCollectionOrderControl = component.form.controls['fm_payment_terms_collection_order_made'];
    hasCollectionOrderControl.setValue(false);

    const makeCollectionOrderToday = component.form.controls['fm_payment_terms_collection_order_made_today'];
    makeCollectionOrderToday.setValue(false);

    component['setCollectionOrderDate']();

    expect(component.form.get('fm_payment_terms_collection_order_date')!.value).toBeNull();
  });

  it('should setup permissions', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'hasBusinessUnitPermissionAccess').and.returnValue(true);

    component['setupPermissions']();

    expect(component['hasBusinessUnitPermissionAccess']).toHaveBeenCalled();
    expect(component.permissions[FINES_MAC_PAYMENT_TERMS_PERMISSIONS['collection-order']]).toBeTruthy();
  });

  it('should update form controls based on selected enforcement action', () => {
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;
    component['addEnforcementFields']();
    const addEnforcementActionControl = component.form.controls['fm_payment_terms_add_enforcement_action'];
    component['addEnforcementActionListener']();
    addEnforcementActionControl.setValue(true);
    const enforcementActionsControl = component.form.controls['fm_payment_terms_enforcement_action'];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addControlsSpy = spyOn<any>(component, 'addControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removeControlsSpy = spyOn<any>(component, 'removeControls');

    component['enforcementActionsListener']();
    enforcementActionsControl.setValue('PRIS');

    expect(addControlsSpy).toHaveBeenCalledTimes(4);
    expect(removeControlsSpy).toHaveBeenCalledTimes(4);
  });

  it('should update form controls based on selected enforcement action', () => {
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;
    component['addEnforcementFields']();
    const addEnforcementActionControl = component.form.controls['fm_payment_terms_add_enforcement_action'];
    component['addEnforcementActionListener']();
    addEnforcementActionControl.setValue(true);
    const enforcementActionsControl = component.form.controls['fm_payment_terms_enforcement_action'];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addControlsSpy = spyOn<any>(component, 'addControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removeControlsSpy = spyOn<any>(component, 'removeControls');

    component['enforcementActionsListener']();
    enforcementActionsControl.setValue('NOENF');

    expect(addControlsSpy).toHaveBeenCalledTimes(4);
    expect(removeControlsSpy).toHaveBeenCalledTimes(4);
  });

  it('should add controls', () => {
    const controlsToAdd = [
      { controlName: 'control1', validators: [] },
      { controlName: 'control2', validators: [] },
      { controlName: 'control3', validators: [] },
    ];

    component['addControls'](controlsToAdd);

    controlsToAdd.forEach((control) => {
      expect(component.form.contains(control.controlName)).toBe(true);
    });
  });

  it('should remove controls', () => {
    const controlsToRemove: IAbstractFormArrayControlValidation[] = [
      { controlName: 'control1', validators: [] },
      { controlName: 'control2', validators: [] },
      { controlName: 'control3', validators: [] },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'removeControl');

    component['removeControls'](controlsToRemove);

    expect(component['removeControl']).toHaveBeenCalledTimes(3);
    expect(component['removeControl']).toHaveBeenCalledWith('control1');
    expect(component['removeControl']).toHaveBeenCalledWith('control2');
    expect(component['removeControl']).toHaveBeenCalledWith('control3');
  });
});
