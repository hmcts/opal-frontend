import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAccEnfActionAddFormComponent } from './fines-acc-enf-action-add-form.component';
import { FINES_ACC_ENF_ACTION_ADD_API_DATA_KEYS } from '../constants/fines-acc-enf-action-add-api-data-keys.constant';
import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from '../constants/fines-acc-enf-action-add-field-types.constant';
import { FINES_ACC_ENF_ACTION_ADD_FORM_CONTROL_NAMES } from '../constants/fines-acc-enf-action-add-control-names.constant';
import { FINES_ACC_ENF_ACTION_ADD_PAYMENT_TERM_KEYS } from '../constants/fines-acc-enf-action-add-payment-term-keys.constant';
import { IFinesAccEnfActionAddFormField } from '../interfaces/fines-acc-enf-action-add-form-field.interface';
import { FINES_ACC_ENF_ACTION_ADD_COLLECTION_TYPE_FORM_FIELD_MOCK } from '../mocks/fines-acc-enf-action-add-collection-type-form-field.mock';
import { FINES_ACC_ENF_ACTION_ADD_FORM_FIELDS_MOCK } from '../mocks/fines-acc-enf-action-add-form-fields.mock';
import { FINES_ACC_ENF_ACTION_ADD_TEXT_INPUT_MAX_LENGTH_FORM_FIELDS_MOCK } from '../mocks/fines-acc-enf-action-add-text-input-max-length-form-fields.mock';
import { FINES_ACC_ENF_ACTION_ADD_TEXTAREA_VALIDATION_FORM_FIELDS_MOCK } from '../mocks/fines-acc-enf-action-add-textarea-validation-form-fields.mock';

describe('FinesAccEnfActionAddFormComponent', () => {
  let component: FinesAccEnfActionAddFormComponent;
  let fixture: ComponentFixture<FinesAccEnfActionAddFormComponent>;

  const controlNames = FINES_ACC_ENF_ACTION_ADD_FORM_CONTROL_NAMES;

  const createComponent = (
    showPaymentTerms = true,
    fields: IFinesAccEnfActionAddFormField[] = FINES_ACC_ENF_ACTION_ADD_FORM_FIELDS_MOCK,
  ) => {
    fixture = TestBed.createComponent(FinesAccEnfActionAddFormComponent);
    component = fixture.componentInstance;
    component.accountNumber = '177A';
    component.actionTitle = 'Reminder of Unpaid Fine (REM)';
    component.fields = structuredClone(fields);
    component.partyName = 'Ms Anna GRAHAM';
    component.showPaymentTerms = showPaymentTerms;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccEnfActionAddFormComponent],
      providers: [{ provide: ActivatedRoute, useValue: { snapshot: { params: {}, data: {} } } }],
    }).compileComponents();
  });

  it('should create dynamic controls and payment term controls', () => {
    createComponent();

    expect(component).toBeTruthy();
    expect(component.form.get('fines-acc-enf-action-add_reason')).toBeTruthy();
    expect(component.form.get('fines-acc-enf-action-add_reason_cy')).toBeTruthy();
    expect(component.form.get('fines-acc-enf-action-add_hearing_date')).toBeTruthy();
    expect(component.form.get('fines-acc-enf-action-add_amount')).toBeTruthy();
    expect(component.form.get(controlNames.addPaymentTerms)).toBeTruthy();
    expect(component.form.get(controlNames.paymentTerms)).toBeTruthy();
    expect(component.form.get(controlNames.payByDate)).toBeTruthy();
  });

  it('should render input ids and names with the enforcement action prefix', () => {
    createComponent();
    const element = fixture.nativeElement as HTMLElement;

    expect(component.getInputName('fines-acc-enf-action-add_reason')).toBe('fines-acc-enf-action-add_reason');
    expect(element.querySelector('#fines-acc-enf-action-add_reason')).toBeTruthy();
    expect(element.querySelector('[name="fines-acc-enf-action-add_reason"]')).toBeTruthy();
    expect(element.querySelector('#fines-acc-enf-action-add_add_payment_terms-yes')).toBeTruthy();
    expect(element.querySelector('[name="fines-acc-enf-action-add_add_payment_terms"]')).toBeTruthy();
  });

  it('should show payment terms fields below the add payment terms radios when yes is selected', async () => {
    createComponent();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('#fines-acc-enf-action-add_payment_terms')).toBeNull();

    const yesRadio = element.querySelector<HTMLInputElement>('#fines-acc-enf-action-add_add_payment_terms-yes')!;
    yesRadio.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.showPaymentTermsFields).toBe(true);
    expect(element.textContent).toContain('Select payment terms');

    const noRadio = element.querySelector('#fines-acc-enf-action-add_add_payment_terms-no')!;
    const paymentTermsFieldset = element.querySelector('#fines-acc-enf-action-add_payment_terms')!;

    expect(paymentTermsFieldset).toBeTruthy();
    expect(noRadio.compareDocumentPosition(paymentTermsFieldset) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('should render menu fields as radios instead of a select', () => {
    createComponent(false, [FINES_ACC_ENF_ACTION_ADD_COLLECTION_TYPE_FORM_FIELD_MOCK]);
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('select#fines-acc-enf-action-add_collection_type')).toBeNull();
    expect(element.querySelector('#fines-acc-enf-action-add_collection_type-standard')).toBeTruthy();
    expect(element.querySelector('#fines-acc-enf-action-add_collection_type-fast_track')).toBeTruthy();
    expect(element.querySelector('[name="fines-acc-enf-action-add_collection_type"]')).toBeTruthy();
  });

  it('should render autocomplete fields for menu-autocomplete parameters', () => {
    createComponent(false, [
      {
        controlName: 'fines-acc-enf-action-add_enforcer',
        parameterName: 'enforcer',
        label: 'Enforcer',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuAutocomplete,
        required: true,
        options: [{ value: 1, name: 'Enforcer One (1)' }],
        apidata: FINES_ACC_ENF_ACTION_ADD_API_DATA_KEYS.enforcers,
      },
    ]);
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('opal-lib-alphagov-accessible-autocomplete')).toBeTruthy();
    expect(element.querySelector('#fines-acc-enf-action-add_enforcer')).toBeTruthy();
  });

  it('should render checkbox fields for menu-checkbox parameters and enforce max selections', () => {
    createComponent(false, [
      {
        controlName: 'fines-acc-enf-action-add_selecthowitwillbeserved',
        parameterName: 'selecthowitwillbeserved',
        label: 'Select how it will be served',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuCheckbox,
        required: false,
        min: 0,
        max: 1,
        options: [
          { value: 'Consecutive', name: 'Consecutive' },
          { value: 'Concurrent', name: 'Concurrent' },
        ],
        checkboxControls: [
          {
            controlName: 'fines-acc-enf-action-add_selecthowitwillbeserved_consecutive',
            option: { value: 'Consecutive', name: 'Consecutive' },
          },
          {
            controlName: 'fines-acc-enf-action-add_selecthowitwillbeserved_concurrent',
            option: { value: 'Concurrent', name: 'Concurrent' },
          },
        ],
      },
    ]);
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('#fines-acc-enf-action-add_selecthowitwillbeserved_consecutive')).toBeTruthy();
    expect(element.querySelector('#fines-acc-enf-action-add_selecthowitwillbeserved_concurrent')).toBeTruthy();

    component.form.get('fines-acc-enf-action-add_selecthowitwillbeserved_consecutive')!.setValue(true);
    component.form.get('fines-acc-enf-action-add_selecthowitwillbeserved_concurrent')!.setValue(true);

    expect(component.form.get('fines-acc-enf-action-add_selecthowitwillbeserved')?.hasError('max')).toBe(true);
  });

  it('should size text fields by max length and render max-1000 text fields as textareas', () => {
    createComponent(false, FINES_ACC_ENF_ACTION_ADD_TEXT_INPUT_MAX_LENGTH_FORM_FIELDS_MOCK);
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('#fines-acc-enf-action-add_short_code')?.className).toContain('govuk-input--width-5');
    expect(element.querySelector('#fines-acc-enf-action-add_reason')?.className).toContain('govuk-input--width-60');
    expect(element.querySelector('#fines-acc-enf-action-add_long_text')?.className).toContain('govuk-input--width-100');
    expect(element.querySelector('textarea#fines-acc-enf-action-add_notes')).toBeTruthy();
    expect(component.form.get('fines-acc-enf-action-add_notes')).toBeTruthy();
  });

  it('should validate textarea minimum length and return no class for unsupported max lengths', () => {
    createComponent(false, FINES_ACC_ENF_ACTION_ADD_TEXTAREA_VALIDATION_FORM_FIELDS_MOCK);

    component.form.get('fines-acc-enf-action-add_notes')!.setValue('abc');

    expect(component.form.get('fines-acc-enf-action-add_notes')?.hasError('minlength')).toBe(true);
    expect(
      component.getTextInputClasses({
        controlName: 'fines-acc-enf-action-add_long_text',
        parameterName: 'long_text',
        label: 'Long text',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.text,
        required: false,
        max: 61,
        options: [],
      }),
    ).toBe('');
  });

  it('should apply decimal and integer min/max validators', () => {
    createComponent(false, [
      {
        controlName: 'fines-acc-enf-action-add_amount',
        parameterName: 'amount',
        label: 'Amount',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.decimal,
        required: false,
        min: 10,
        max: 20,
        options: [],
      },
      {
        controlName: 'fines-acc-enf-action-add_days',
        parameterName: 'days',
        label: 'Days',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.integer,
        required: false,
        min: 2,
        max: 5,
        options: [],
      },
    ]);

    component.form.get('fines-acc-enf-action-add_amount')!.setValue('9');
    component.form.get('fines-acc-enf-action-add_days')!.setValue('6');

    expect(component.form.get('fines-acc-enf-action-add_amount')?.hasError('min')).toBe(true);
    expect(component.form.get('fines-acc-enf-action-add_days')?.hasError('max')).toBe(true);

    component.form.get('fines-acc-enf-action-add_amount')!.setValue('21');
    component.form.get('fines-acc-enf-action-add_days')!.setValue('1');

    expect(component.form.get('fines-acc-enf-action-add_amount')?.hasError('max')).toBe(true);
    expect(component.form.get('fines-acc-enf-action-add_days')?.hasError('min')).toBe(true);
  });

  it('should handle dynamic fields without optional validator metadata', () => {
    createComponent(false, [
      {
        controlName: 'fines-acc-enf-action-add_days',
        parameterName: 'days',
        label: 'Days',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.integer,
        required: false,
        options: [],
      },
      {
        controlName: 'fines-acc-enf-action-add_text',
        parameterName: 'text',
        label: 'Text',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.text,
        required: false,
        min: 0,
        options: [],
      },
      {
        controlName: 'fines-acc-enf-action-add_notes',
        parameterName: 'notes',
        label: 'Notes',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.textarea,
        required: false,
        min: 0,
        options: [],
      },
      {
        controlName: 'fines-acc-enf-action-add_optional_checkbox',
        parameterName: 'optional_checkbox',
        label: 'Optional checkbox',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuCheckbox,
        required: false,
        options: [{ value: 'A', name: 'A' }],
        checkboxControls: [
          {
            controlName: 'fines-acc-enf-action-add_optional_checkbox_a',
            option: { value: 'A', name: 'A' },
          },
        ],
      },
    ]);

    expect(component.form.get('fines-acc-enf-action-add_days')?.valid).toBe(true);
    expect(component.form.get('fines-acc-enf-action-add_text')?.valid).toBe(true);
    expect(component.form.get('fines-acc-enf-action-add_notes')?.valid).toBe(true);
    expect(component.form.get('fines-acc-enf-action-add_optional_checkbox')?.valid).toBe(true);
  });

  it('should use checkbox selection defaults when min and max are not supplied', () => {
    createComponent(false, [
      {
        controlName: 'fines-acc-enf-action-add_selecthowitwillbeserved',
        parameterName: 'selecthowitwillbeserved',
        label: 'Select how it will be served',
        type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuCheckbox,
        required: true,
        options: [{ value: 'Consecutive', name: 'Consecutive' }],
        checkboxControls: [
          {
            controlName: 'fines-acc-enf-action-add_selecthowitwillbeserved_consecutive',
            option: { value: 'Consecutive', name: 'Consecutive' },
          },
        ],
      },
    ]);

    expect(component.form.get('fines-acc-enf-action-add_selecthowitwillbeserved')?.hasError('required')).toBe(true);

    component.form.get('fines-acc-enf-action-add_selecthowitwillbeserved_consecutive')!.setValue(true);

    expect(component.form.get('fines-acc-enf-action-add_selecthowitwillbeserved')?.valid).toBe(true);
  });

  it('should return default helper values when optional field metadata is missing', () => {
    createComponent(false);
    const fieldWithoutMax = {
      controlName: 'fines-acc-enf-action-add_notes',
      parameterName: 'notes',
      label: 'Notes',
      type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.textarea,
      required: false,
      options: [],
    };

    expect(component.getTextInputClasses(fieldWithoutMax)).toBe('');
    expect(component.getTextAreaCharacterLimit(fieldWithoutMax)).toBe(1000);
    expect(component.getDateBoundary(10)).toBe('');
    expect(component.getDateBoundary('2026-05-28')).toBe('2026-05-28');
    expect(component.getRadioOptionInputName('fines-acc-enf-action-add_type', '', 2)).toBe(
      'fines-acc-enf-action-add_type-2',
    );
    expect(component.getSelectedCheckboxOptions(fieldWithoutMax)).toEqual([]);
  });

  it('should not create payment term controls when payment terms are hidden', () => {
    createComponent(false);

    expect(component.form.get(controlNames.addPaymentTerms)).toBeNull();
    expect(component.form.get(controlNames.paymentTerms)).toBeNull();
  });

  it('should validate required dynamic fields and paired Welsh fields', () => {
    createComponent();
    const englishControl = component.form.get('fines-acc-enf-action-add_reason')!;
    const welshControl = component.form.get('fines-acc-enf-action-add_reason_cy')!;

    englishControl.setValue('English reason');
    component.form.updateValueAndValidity();

    expect(welshControl.hasError('pairedLanguage')).toBe(true);
    expect(englishControl.hasError('required')).toBe(false);

    welshControl.setValue('Rheswm');
    component.form.updateValueAndValidity();

    expect(welshControl.hasError('pairedLanguage')).toBe(false);
  });

  it('should validate date and decimal dynamic fields', () => {
    createComponent();
    const dateControl = component.form.get('fines-acc-enf-action-add_hearing_date')!;
    const amountControl = component.form.get('fines-acc-enf-action-add_amount')!;

    dateControl.setValue('31/02/2026');
    amountControl.setValue('10.123');

    expect(dateControl.hasError('invalidDate')).toBe(true);
    expect(amountControl.hasError('invalidAmount')).toBe(true);

    dateControl.setValue('28/02/2026');
    amountControl.setValue('10.10');

    expect(dateControl.valid).toBe(true);
    expect(amountControl.valid).toBe(true);
  });

  it('should require payment terms only when adding payment terms is selected', () => {
    createComponent();
    const addPaymentTermsControl = component.form.get(controlNames.addPaymentTerms)!;
    const paymentTermsControl = component.form.get(controlNames.paymentTerms)!;

    addPaymentTermsControl.setValue(true);

    expect(paymentTermsControl.hasError('required')).toBe(true);

    paymentTermsControl.setValue(FINES_ACC_ENF_ACTION_ADD_PAYMENT_TERM_KEYS.payInFull);

    expect(paymentTermsControl.valid).toBe(true);
  });

  it('should apply conditional validators for pay in full payment terms', () => {
    createComponent();

    component.form.get(controlNames.addPaymentTerms)!.setValue(true);
    component.form.get(controlNames.paymentTerms)!.setValue(FINES_ACC_ENF_ACTION_ADD_PAYMENT_TERM_KEYS.payInFull);

    expect(component.form.get(controlNames.payByDate)?.hasError('required')).toBe(true);
  });

  it('should apply conditional validators for instalments only payment terms', () => {
    createComponent();

    component.form.get(controlNames.addPaymentTerms)!.setValue(true);
    component.form.get(controlNames.paymentTerms)!.setValue(FINES_ACC_ENF_ACTION_ADD_PAYMENT_TERM_KEYS.instalmentsOnly);

    expect(component.form.get(controlNames.instalmentAmount)?.hasError('required')).toBe(true);
    expect(component.form.get(controlNames.instalmentPeriod)?.hasError('required')).toBe(true);
    expect(component.form.get(controlNames.startDate)?.hasError('required')).toBe(true);
  });

  it('should clear payment term controls when add payment terms is set to no', () => {
    createComponent();

    component.form.get(controlNames.addPaymentTerms)!.setValue(true);
    component.form
      .get(controlNames.paymentTerms)!
      .setValue(FINES_ACC_ENF_ACTION_ADD_PAYMENT_TERM_KEYS.lumpSumPlusInstalments);
    component.form.get(controlNames.lumpSumAmount)!.setValue('10.00');
    component.form.get(controlNames.instalmentAmount)!.setValue('5.00');
    component.form.get(controlNames.addPaymentTerms)!.setValue(false);

    expect(component.form.get(controlNames.paymentTerms)?.value).toBeNull();
    expect(component.form.get(controlNames.lumpSumAmount)?.value).toBeNull();
    expect(component.form.get(controlNames.instalmentAmount)?.value).toBeNull();
  });

  it('should set date picker values when the target control exists', () => {
    createComponent();
    const payByDateControl = component.form.get(controlNames.payByDate)!;

    component.setInputValue('28/05/2026', controlNames.payByDate);

    expect(payByDateControl.value).toBe('28/05/2026');
    expect(payByDateControl.touched).toBe(true);
  });

  it('should emit cancel when handleCancel is called', () => {
    createComponent();
    const emitSpy = vi.spyOn(component.cancelRequested, 'emit');

    component.handleCancel();

    expect(emitSpy).toHaveBeenCalled();
  });
});
