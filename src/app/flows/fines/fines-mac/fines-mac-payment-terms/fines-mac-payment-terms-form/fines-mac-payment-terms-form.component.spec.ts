import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacPaymentTermsFormComponent } from './fines-mac-payment-terms-form.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { ActivatedRoute } from '@angular/router';
import { IFinesMacPaymentTermsForm } from '../interfaces/fines-mac-payment-terms-form.interface';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { FINES_MAC_PAYMENT_TERMS_FORM_MOCK } from '../mocks/fines-mac-payment-terms-form.mock';
import { DateService } from '@services/date-service/date.service';
import { DateTime } from 'luxon';
import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';
import { FinesMacPaymentTermsPermissions } from '../enums/fines-mac-payment-terms-permissions.enum';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

describe('FinesMacPaymentTermsFormComponent', () => {
  let component: FinesMacPaymentTermsFormComponent;
  let fixture: ComponentFixture<FinesMacPaymentTermsFormComponent>;
  let mockGlobalStateService: GlobalStateService;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let formSubmit: IFinesMacPaymentTermsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockDateService = jasmine.createSpyObj(DateService, [
      'getPreviousDate',
      'calculateAge',
      'isValidDate',
      'isDateInThePast',
      'isDateInTheFuture',
      'getDateNow',
      'toFormat',
    ]);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;
    formSubmit = FINES_MAC_PAYMENT_TERMS_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacPaymentTermsFormComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: DateService, useValue: mockDateService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    mockGlobalStateService = TestBed.inject(GlobalStateService);
    mockGlobalStateService.userState.set(SESSION_USER_STATE_MOCK);

    fixture = TestBed.createComponent(FinesMacPaymentTermsFormComponent);
    component = fixture.componentInstance;

    component.defendantType = 'adultOrYouthOnly';

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

    component.defendantType = 'adultOrYouthOnly';
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
    expect(component['rePopulateForm']).toHaveBeenCalledWith(
      component['finesService'].finesMacState.paymentTerms.formData,
    );
    expect(mockDateService.getPreviousDate).toHaveBeenCalledWith({ days: 1 });
    expect(component.yesterday).toBeDefined();
    expect(component.today).toBeDefined();
  });

  it('should add controls when has_days_in_default is true', () => {
    component.defendantType = 'parentOrGuardianToPay';

    component['initialPaymentTermsSetup']();

    const hasDaysInDefaultControl = component.form.controls['has_days_in_default'];
    hasDaysInDefaultControl.setValue(true);

    expect(component.form.contains('days_in_default_date')).toBe(true);
    expect(component.form.contains('days_in_default')).toBe(true);
  });

  it('should remove controls when has_days_in_default is false', () => {
    component.defendantType = 'parentOrGuardianToPay';

    component['initialPaymentTermsSetup']();

    const hasDaysInDefaultControl = component.form.controls['has_days_in_default'];
    hasDaysInDefaultControl.setValue(false);

    expect(component.form.contains('days_in_default_date')).toBe(false);
    expect(component.form.contains('days_in_default')).toBe(false);
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
    const paymentTermsControl = component.form.controls['payment_terms'];
    const selectedTerm = 'payInFull';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removeControlsSpy = spyOn<any>(component, 'removeControls');

    paymentTermsControl.setValue(selectedTerm);

    expect(removeControlsSpy).toHaveBeenCalled();
  });

  it('should update form controls based on selected payment term', () => {
    const paymentTermsControl = component.form.controls['payment_terms'];
    const selectedTerm = 'instalmentsOnly';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removeControlsSpy = spyOn<any>(component, 'removeControls');

    paymentTermsControl.setValue(selectedTerm);

    expect(removeControlsSpy).toHaveBeenCalledTimes(1);
  });

  it('should check defendant age and set accessDefaultDates to true when age is 18 or above', () => {
    component.defendantType = 'adultOrYouthOnly';
    const dob = DateTime.now().minus({ years: 30 }).toFormat('dd/MM/yyyy');
    mockFinesService.finesMacState.personalDetails.formData.dob = dob;
    mockDateService.calculateAge.and.returnValue(30);

    component['determineAccess']();

    expect(component.accessDefaultDates).toBe(true);
    expect(component.accessCollectionOrder).toBe(true);
    expect(mockDateService.calculateAge).toHaveBeenCalledWith(dob);
  });

  it('should check defendant age and set accessDefaultDates to false when age is below 18', () => {
    const dob = DateTime.now().minus({ years: 10 }).toFormat('dd/MM/yyyy');
    mockFinesService.finesMacState.personalDetails.formData.dob = dob;
    mockDateService.calculateAge.and.returnValue(10);
    component.defendantType = 'adultOrYouthOnly';

    component['determineAccess']();

    expect(component.accessDefaultDates).toBe(false);
    expect(component.accessCollectionOrder).toBe(false);
    expect(mockDateService.calculateAge).toHaveBeenCalledWith(dob);
  });

  it('should set accessDefaultDates to true defendant type parent or guardian to pay', () => {
    component.defendantType = 'parentOrGuardianToPay';

    component['determineAccess']();

    expect(component.accessDefaultDates).toBe(true);
    expect(component.accessCollectionOrder).toBe(true);
  });

  it('should set accessDefaultDates to true defendant type parent or guardian to pay', () => {
    component.defendantType = 'company';

    component['determineAccess']();

    expect(component.accessDefaultDates).toBe(false);
    expect(component.accessCollectionOrder).toBe(false);
  });

  it('should create enforcement fields for company defendant type', () => {
    component.defendantType = 'company';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addControlsSpy = spyOn<any>(component, 'addControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const holdEnforcementListener = spyOn<any>(component, 'holdEnforcementOnAccountListener');

    component['addEnforcementFields']();

    expect(addControlsSpy).toHaveBeenCalledWith([component.ptHoldEnforcementOnAccount]);
    expect(holdEnforcementListener).toHaveBeenCalled();
  });

  it('should create enforcement fields for non-company defendant type', () => {
    component.defendantType = 'adultOrYouthOnly';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addControlsSpy = spyOn<any>(component, 'addControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addEnforcementActionSpy = spyOn<any>(component, 'addEnforcementActionListener');

    component['addEnforcementFields']();

    expect(addControlsSpy).toHaveBeenCalledWith([component.ptAddEnforcementActionControl]);
    expect(addEnforcementActionSpy).toHaveBeenCalled();
  });

  it('should add control when hold_enforcement_on_account is true', () => {
    component.defendantType = 'company';
    component['addEnforcementFields']();
    const holdEnforcementOnAccountControl = component.form.controls['hold_enforcement_on_account'];
    holdEnforcementOnAccountControl.setValue(true);

    component['holdEnforcementOnAccountListener']();

    expect(component.form.contains(component.ptReasonAccountIsOnNoEnf.controlName)).toBe(true);
  });

  it('should remove control when hold_enforcement_on_account is false', () => {
    component.defendantType = 'company';
    component['addEnforcementFields']();
    const holdEnforcementOnAccountControl = component.form.controls['hold_enforcement_on_account'];
    holdEnforcementOnAccountControl.setValue(false);

    component['holdEnforcementOnAccountListener']();

    expect(component.form.contains(component.ptReasonAccountIsOnNoEnf.controlName)).toBe(false);
  });

  it('should reset ptCollectionOrderDateControl and create ptCollectionOrderDateControl when hasCollectionOrder value is "yes"', () => {
    component.defendantType = 'adultOrYouthOnly';
    component.accessCollectionOrder = true;
    component['addCollectionOrderFormControls']();
    const hasCollectionOrderControl = component.form.controls[component.ptHasCollectionOrderControl.controlName];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'createControl');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'removeControl');

    component['hasCollectionOrderListener']();
    hasCollectionOrderControl.setValue('yes');

    expect(component['createControl']).toHaveBeenCalledWith(
      component.ptCollectionOrderDateControl.controlName,
      component.ptCollectionOrderDateControl.validators,
    );
    expect(component['removeControl']).toHaveBeenCalledWith(component.ptMakeCollectionOrderTodayControl.controlName);
  });

  it('should remove ptCollectionOrderDateControl and create ptMakeCollectionOrderTodayControl and ptCollectionOrderDateControl when hasCollectionOrder value is not "yes"', () => {
    component.defendantType = 'adultOrYouthOnly';
    component.accessCollectionOrder = true;
    component['addCollectionOrderFormControls']();
    const hasCollectionOrderControl = component.form.controls[component.ptHasCollectionOrderControl.controlName];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'createControl');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'removeControl');

    component['hasCollectionOrderListener']();
    hasCollectionOrderControl.setValue('no');

    expect(component['removeControl']).toHaveBeenCalledWith(component.ptCollectionOrderDateControl.controlName);
    expect(component['createControl']).toHaveBeenCalledWith(
      component.ptMakeCollectionOrderTodayControl.controlName,
      component.ptMakeCollectionOrderTodayControl.validators,
    );
    expect(component['createControl']).toHaveBeenCalledWith(component.ptCollectionOrderDateControl.controlName, []);
  });

  it('should set collection order date when makeCollectionOrderToday is true', () => {
    component.defendantType = 'adultOrYouthOnly';
    component.accessCollectionOrder = true;
    component.today = '31/08/2024';
    component['addCollectionOrderFormControls']();
    component['hasCollectionOrderListener']();
    const hasCollectionOrderControl = component.form.controls[component.ptHasCollectionOrderControl.controlName];
    hasCollectionOrderControl.setValue('no');

    const makeCollectionOrderToday = component.form.controls[component.ptMakeCollectionOrderTodayControl.controlName];
    makeCollectionOrderToday.setValue(true);

    component['setCollectionOrderDate']();

    expect(component.form.get(component.ptCollectionOrderDateControl.controlName)!.value).toBe(component.today);
  });

  it('should setup permissions', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'hasPermissionAccess').and.returnValue(true);

    component['setupPermissions']();

    expect(component['hasPermissionAccess']).toHaveBeenCalled();
    expect(component.permissions[FinesMacPaymentTermsPermissions.collectionOrder]).toBeTruthy();
  });

  it('should update form controls based on selected enforcement action', () => {
    component.defendantType = 'adultOrYouthOnly';
    component['addEnforcementFields']();
    const addEnforcementActionControl = component.form.controls[component.ptAddEnforcementActionControl.controlName];
    component['addEnforcementActionListener']();
    addEnforcementActionControl.setValue(true);
    const enforcementActionsControl = component.form.controls[component.ptEnforcementActions.controlName];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addControlsSpy = spyOn<any>(component, 'addControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removeControlsSpy = spyOn<any>(component, 'removeControls');

    component['enforcementActionsListener']();
    enforcementActionsControl.setValue('defendantIsInCustody');

    expect(addControlsSpy).toHaveBeenCalledTimes(4);
    expect(removeControlsSpy).toHaveBeenCalledTimes(4);
  });

  it('should update form controls based on selected enforcement action', () => {
    component.defendantType = 'adultOrYouthOnly';
    component['addEnforcementFields']();
    const addEnforcementActionControl = component.form.controls[component.ptAddEnforcementActionControl.controlName];
    component['addEnforcementActionListener']();
    addEnforcementActionControl.setValue(true);
    const enforcementActionsControl = component.form.controls[component.ptEnforcementActions.controlName];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addControlsSpy = spyOn<any>(component, 'addControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removeControlsSpy = spyOn<any>(component, 'removeControls');

    component['enforcementActionsListener']();
    enforcementActionsControl.setValue('holdEnforcementOnAccount');

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
