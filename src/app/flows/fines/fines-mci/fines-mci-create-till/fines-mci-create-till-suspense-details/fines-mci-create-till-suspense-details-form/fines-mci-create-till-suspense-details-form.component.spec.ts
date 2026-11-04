import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IFinesMciSuspensePayment } from '../../../stores/interfaces/fines-mci.interface';
import { FinesMciCreateTillSuspenseDetailsFormComponent } from './fines-mci-create-till-suspense-details-form.component';

const VALID_SUSPENSE_PAYMENT: IFinesMciSuspensePayment = {
  amount: '123.45',
  payerType: 'defendant',
  methodOfPayment: 'notesCoins',
  paymentReferencePostalOrder: '',
  paymentReferenceCheque: '',
  paymentReferenceCreditTransfer: '',
  source: null,
  reason: 'overpayment',
  relevantDetails: '',
};

describe('FinesMciCreateTillSuspenseDetailsFormComponent', () => {
  let fixture: ComponentFixture<FinesMciCreateTillSuspenseDetailsFormComponent>;
  let component: FinesMciCreateTillSuspenseDetailsFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillSuspenseDetailsFormComponent],
      providers: [provideRouter([]), { provide: UtilsService, useValue: { scrollToTop: vi.fn() } }],
    }).compileComponents();
  });

  function createForm(initialValue: IFinesMciSuspensePayment | null = null): void {
    fixture = TestBed.createComponent(FinesMciCreateTillSuspenseDetailsFormComponent);
    component = fixture.componentInstance;
    component.initialValue = initialValue;
    fixture.detectChanges();
  }

  function setValidPayment(): void {
    component.form.patchValue(VALID_SUSPENSE_PAYMENT);
  }

  function submit(): void {
    component.submitForm(new SubmitEvent('submit'));
    fixture.detectChanges();
  }

  it('initialises an empty form and hides validation messages before submission', () => {
    createForm();

    expect(component.form.getRawValue()).toEqual({
      amount: '',
      payerType: null,
      methodOfPayment: null,
      paymentReferencePostalOrder: '',
      paymentReferenceCheque: '',
      paymentReferenceCreditTransfer: '',
      source: null,
      reason: null,
      relevantDetails: '',
    });
    expect((fixture.nativeElement as HTMLElement).querySelector('.govuk-error-message')).toBeNull();
  });

  it('restores the provided payment values', () => {
    const saved: IFinesMciSuspensePayment = {
      ...VALID_SUSPENSE_PAYMENT,
      methodOfPayment: 'creditTransfer',
      paymentReferenceCreditTransfer: 'ref-01',
      source: 'allpay',
      reason: 'unidentified',
      relevantDetails: 'payment details',
    };
    createForm(saved);

    expect(component.form.getRawValue()).toEqual(saved);
    expect(component.form.valid).toBe(true);
  });

  it('shows the required errors and summary after Continue is clicked', () => {
    createForm();

    submit();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.govuk-error-summary__list')?.textContent).toContain('Enter an amount');
    expect(element.textContent).toContain('Select who payment was received from');
    expect(element.textContent).toContain('Select a method of payment');
    expect(element.textContent).toContain('Select a reason for the suspense');
  });

  it('refreshes displayed validation only after Continue is clicked again', () => {
    createForm();
    submit();

    component.form.controls['amount'].setValue('12.00');
    fixture.detectChanges();
    expect(component.formControlErrorMessages['amount']).toBe('Enter an amount');

    submit();
    expect(component.formControlErrorMessages['amount']).toBeUndefined();
  });

  it('validates non-numeric amount characters separately from amount format', () => {
    createForm();
    setValidPayment();
    component.form.controls['amount'].setValue('12x');
    submit();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Enter a valid amount');

    component.form.controls['amount'].setValue('1234567890123456789.123');
    submit();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Enter an amount with no more than 18 digits before the decimal and 2 or fewer after.',
    );
  });

  it('accepts an amount with 18 integer digits and up to 2 decimal digits', () => {
    createForm();
    setValidPayment();
    component.form.controls['amount'].setValue('123456789012345678.12');

    expect(component.form.controls['amount'].valid).toBe(true);

    component.form.controls['amount'].setValue(null);
    submit();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Enter an amount');
  });

  it('validates an invalid postal order reference', () => {
    createForm();
    setValidPayment();
    component.form.controls['methodOfPayment'].setValue('postalOrder');
    component.form.controls['paymentReferencePostalOrder'].setValue('invalid!');
    submit();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Payment reference (Postal order) must only include letters a to z, numbers, hyphens, spaces and apostrophes',
    );
  });

  it('validates a cheque reference that exceeds 50 characters', () => {
    createForm();
    setValidPayment();
    component.form.controls['methodOfPayment'].setValue('cheque');
    component.form.controls['paymentReferenceCheque'].setValue('a'.repeat(51));
    submit();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Payment reference (Cheque) must be 50 characters or fewer',
    );
  });

  it('requires a source and validates the credit transfer reference', () => {
    createForm();
    setValidPayment();
    component.form.controls['methodOfPayment'].setValue('creditTransfer');
    submit();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Select a source');

    component.form.controls['source'].setValue('NatWest');
    component.form.controls['paymentReferenceCreditTransfer'].setValue('invalid!');
    submit();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Payment reference (Credit transfer) must only include letters a to z, numbers, hyphens, spaces and apostrophes',
    );
  });

  it('validates unidentified additional details for length and invalid characters', () => {
    createForm();
    setValidPayment();
    component.form.controls['reason'].setValue('unidentified');
    component.form.controls['relevantDetails'].setValue('a'.repeat(51));
    submit();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Add relevant details must be 50 characters or fewer',
    );

    component.form.controls['relevantDetails'].setValue('invalid!');
    submit();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Add Relevant Details must only include letters a to z, numbers, hyphens, spaces and apostrophes',
    );
  });

  it('emits valid form values when Continue is clicked', () => {
    createForm();
    setValidPayment();
    const formSubmitSpy = vi.spyOn(component['formSubmit'], 'emit');

    submit();

    expect(formSubmitSpy).toHaveBeenCalledWith({ formData: VALID_SUSPENSE_PAYMENT, nestedFlow: false });
  });

  it('reports unsaved changes only when a form field has a value', () => {
    createForm();
    expect(component['hasUnsavedChanges']()).toBe(false);

    component.form.controls['payerType'].setValue('thirdParty');

    expect(component['hasUnsavedChanges']()).toBe(true);
  });

  it('emits cancel without navigating from the form', () => {
    createForm();
    const cancelSpy = vi.spyOn(component['cancelRequested'], 'emit');

    (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>('.button-link')?.click();

    expect(cancelSpy).toHaveBeenCalledWith();
  });
});
