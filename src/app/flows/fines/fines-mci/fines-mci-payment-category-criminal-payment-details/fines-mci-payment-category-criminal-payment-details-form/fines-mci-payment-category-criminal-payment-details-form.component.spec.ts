import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IFinesMciCriminalPayment } from '../../stores/interfaces/fines-mci.interface';
import { FinesMciPaymentCategoryCriminalPaymentDetailsFormComponent } from './fines-mci-payment-category-criminal-payment-details-form.component';

const PAYMENT: IFinesMciCriminalPayment = {
  amount: '123.45',
  payerType: 'defendant',
  thirdPartyName: '',
  methodOfPayment: 'notesCoins',
  paymentReferencePostalOrder: '',
  paymentReferenceCheque: '',
  paymentReferenceCreditTransfer: '',
  source: null,
};

describe('FinesMciPaymentCategoryCriminalPaymentDetailsFormComponent', () => {
  let fixture: ComponentFixture<FinesMciPaymentCategoryCriminalPaymentDetailsFormComponent>;
  let component: FinesMciPaymentCategoryCriminalPaymentDetailsFormComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciPaymentCategoryCriminalPaymentDetailsFormComponent],
      providers: [provideRouter([]), { provide: UtilsService, useValue: { scrollToTop: vi.fn() } }],
    }).compileComponents();
    fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalPaymentDetailsFormComponent);
    component = fixture.componentInstance;
  });

  function initialise(initialValue: IFinesMciCriminalPayment | null = null): void {
    fixture.componentRef.setInput('initialValue', initialValue);
    fixture.componentRef.setInput('accountBalance', 100);
    fixture.detectChanges();
  }
  function submit(): void {
    component.submitForm(new SubmitEvent('submit'));
    fixture.detectChanges();
  }

  it('starts with empty fields, no selections, no errors and no overpayment', () => {
    initialise();
    expect(component.form.get('amount')?.value).toBe('');
    expect(fixture.nativeElement.querySelector('input:checked')).toBeNull();
    expect(fixture.nativeElement.querySelector('.govuk-error-message')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('overpayment');
    expect(component['hasUnsavedChanges']()).toBe(false);
  });
  it('restores a draft including the conditional fields', () => {
    const saved = {
      ...PAYMENT,
      payerType: 'thirdParty',
      thirdPartyName: 'Payer 1',
      methodOfPayment: 'creditTransfer',
      source: 'allpay',
      paymentReferenceCreditTransfer: 'Ref 1',
    } as const;
    initialise(saved);
    expect(component.form.getRawValue()).toEqual(saved);
    expect(component.form.valid).toBe(true);
    expect(component['hasUnsavedChanges']()).toBe(true);
  });
  it('reports required fields on Continue and links the amount error to its input', () => {
    initialise();
    submit();
    expect(fixture.nativeElement.textContent).toContain('Enter amount');
    expect(fixture.nativeElement.textContent).toContain('Select who the payment was received from');
    expect(fixture.nativeElement.textContent).toContain('Select a method of payment');
    expect(fixture.nativeElement.querySelector('#amount').getAttribute('aria-describedby')).toBe('amount-error');
  });
  it.each(['abc', '12x', '£10', '1,000', '1.2.3', '1e3', '0x10', 'Infinity'])(
    'shows the non-numeric error on Continue for %s without submitting',
    (amount) => {
      initialise({ ...PAYMENT, amount });
      const emit = vi.spyOn(component['formSubmit'], 'emit');

      submit();

      expect(fixture.nativeElement.querySelector('#amount-error')?.textContent).toBe('Enter only numbers and decimals');
      expect(fixture.nativeElement.querySelector('.govuk-error-summary__list')?.textContent).toContain(
        'Enter only numbers and decimals',
      );
      expect(emit).not.toHaveBeenCalled();
    },
  );
  it.each(['12x', '1.234', '1234567890123456789.12'])('rejects invalid amount %s', (value) => {
    initialise(PAYMENT);
    component.form.get('amount')?.setValue(value);
    expect(component.form.get('amount')?.invalid).toBe(true);
    expect(component['overpayment']).toBeNull();
  });
  it.each(['0', '1', '1.2', '123456789012345678.12'])('accepts numeric amount %s', (value) => {
    initialise(PAYMENT);
    component.form.get('amount')?.setValue(value);
    expect(component.form.get('amount')?.valid).toBe(true);
  });
  it.each([
    ['99.99', null],
    ['-1.00', null],
    ['100', null],
    ['100.01', '£0.01'],
    ['110.10', '£10.10'],
    ['123456789012345678.12', '£123,456,789,012,345,578.12'],
    ['', null],
  ])('calculates the exact overpayment for %s', (value, expected) => {
    initialise(PAYMENT);
    const input = fixture.nativeElement.querySelector('#amount') as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(component['overpayment']).toBe(expected);
    if (expected)
      expect(fixture.nativeElement.textContent).toContain(`This amount contains a ${expected} overpayment.`);
    else expect(fixture.nativeElement.textContent).not.toContain('overpayment');
  });
  it('hides the overpayment after the Amount control is reset', () => {
    initialise(PAYMENT);
    expect(component['overpayment']).toBe('£23.45');

    component.form.controls['amount'].reset();
    fixture.detectChanges();

    expect(component.form.controls['amount'].hasError('required')).toBe(true);
    expect(component['overpayment']).toBeNull();
  });
  it.each([null, NaN, Infinity])('hides overpayment when balance is unavailable: %s', (balance) => {
    initialise(PAYMENT);
    fixture.componentRef.setInput('accountBalance', balance);
    fixture.detectChanges();
    expect(component['overpayment']).toBeNull();
  });
  it('requires a source only for credit transfer', () => {
    initialise(PAYMENT);
    component.form.get('methodOfPayment')?.setValue('creditTransfer');
    expect(component.form.get('source')?.hasError('required')).toBe(true);
    component.form.get('source')?.setValue('allpay');
    expect(component.form.valid).toBe(true);
    component.form.get('source')?.setValue(null);
    component.form.get('methodOfPayment')?.setValue('notesCoins');
    expect(component.form.valid).toBe(true);
  });
  it.each([
    ['postalOrder', 'paymentReferencePostalOrder'],
    ['cheque', 'paymentReferenceCheque'],
    ['creditTransfer', 'paymentReferenceCreditTransfer'],
  ])('validates the selected %s text field only', (choice, field) => {
    initialise(PAYMENT);
    component.form.patchValue({ methodOfPayment: choice, source: 'allpay' });
    const control = component.form.controls[field];
    control.setValue('A'.repeat(50));
    expect(control.valid).toBe(true);
    control.setValue('A'.repeat(51));
    expect(control.hasError('maxlength')).toBe(true);
    control.setValue('!');
    expect(control.hasError('pattern')).toBe(true);
    control.setValue('');
    expect(control.valid).toBe(true);
    control.setValue('!');
    component.form.patchValue({ payerType: 'defendant', methodOfPayment: 'notesCoins' });
    expect(control.valid).toBe(true);
  });
  it.each([' ', '   ', '\t', '\u00a0'])(
    'shows Enter name for a whitespace-only third-party name %j without requiring blur',
    (thirdPartyName) => {
      initialise({ ...PAYMENT, payerType: 'thirdParty', thirdPartyName });
      const emit = vi.spyOn(component['formSubmit'], 'emit');

      submit();

      expect(component.form.controls['thirdPartyName'].hasError('required')).toBe(true);
      expect(fixture.nativeElement.querySelector('#thirdPartyName-error')?.textContent).toBe('Enter name');
      expect(fixture.nativeElement.querySelector('.govuk-error-summary__list')?.textContent).toContain('Enter name');
      expect(emit).not.toHaveBeenCalled();
    },
  );
  it.each(['Payer 123', '  Payer  123  ', "Payer-1 O'Brien", 'Payer-1 O\u2019Brien', 'A'.repeat(50)])(
    'accepts the permitted third-party name %s',
    (thirdPartyName) => {
      initialise({ ...PAYMENT, payerType: 'thirdParty', thirdPartyName });
      const emit = vi.spyOn(component['formSubmit'], 'emit');

      submit();

      expect(component.form.valid).toBe(true);
      expect(emit).toHaveBeenCalledWith({
        formData: { ...PAYMENT, payerType: 'thirdParty', thirdPartyName },
        nestedFlow: false,
      });
    },
  );
  it('removes the name requirement and errors when the payer changes to Defendant', () => {
    initialise({ ...PAYMENT, payerType: 'thirdParty' });
    submit();
    expect(component.form.controls['thirdPartyName'].hasError('required')).toBe(true);
    expect(fixture.nativeElement.querySelector('#thirdPartyName-error')?.textContent).toBe('Enter name');

    component.form.controls['payerType'].setValue('defendant');
    submit();

    expect(component.form.valid).toBe(true);
    expect(fixture.nativeElement.querySelector('#thirdPartyName-error')).toBeNull();
    expect(fixture.nativeElement.querySelector('.govuk-error-summary__list')?.textContent ?? '').not.toContain(
      'Enter name',
    );
  });
  it.each([
    ['postalOrder', 'paymentReferencePostalOrder'],
    ['cheque', 'paymentReferenceCheque'],
    ['creditTransfer', 'paymentReferenceCreditTransfer'],
  ] as const)('accepts optional and valid %s references', (methodOfPayment, field) => {
    initialise({ ...PAYMENT, methodOfPayment, source: methodOfPayment === 'creditTransfer' ? 'allpay' : null });
    const emit = vi.spyOn(component['formSubmit'], 'emit');
    for (const reference of ['', "Ref-123 O'Brien", 'A'.repeat(50)]) {
      component.form.controls[field].setValue(reference);
      submit();
      expect(component.form.valid).toBe(true);
      expect(emit).toHaveBeenLastCalledWith({
        formData: {
          ...PAYMENT,
          methodOfPayment,
          source: methodOfPayment === 'creditTransfer' ? 'allpay' : null,
          [field]: reference,
        },
        nestedFlow: false,
      });
    }
  });

  it('emits validated values and clears values belonging to hidden fields', () => {
    initialise(PAYMENT);
    const emit = vi.spyOn(component['formSubmit'], 'emit');
    component.form.patchValue({
      thirdPartyName: 'Old payer',
      source: 'allpay',
      paymentReferencePostalOrder: 'Old ref',
    });
    submit();
    expect(emit).toHaveBeenCalledWith({ formData: PAYMENT, nestedFlow: false });
  });
  it('does not emit invalid form values', () => {
    initialise();
    const emit = vi.spyOn(component['formSubmit'], 'emit');
    submit();
    expect(emit).not.toHaveBeenCalled();
  });
  it('emits cancellation from the Cancel link', () => {
    initialise();
    const emit = vi.spyOn(component['cancelRequested'], 'emit');
    fixture.nativeElement.querySelector('opal-lib-govuk-cancel-link a').click();
    expect(emit).toHaveBeenCalledOnce();
  });
});
