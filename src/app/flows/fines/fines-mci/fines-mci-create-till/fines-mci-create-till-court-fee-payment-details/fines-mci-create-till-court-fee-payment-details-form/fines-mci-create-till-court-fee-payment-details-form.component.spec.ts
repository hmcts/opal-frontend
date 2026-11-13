import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciCreateTillCourtFeePaymentDetailsFormComponent } from './fines-mci-create-till-court-fee-payment-details-form.component';

describe('FinesMciCreateTillCourtFeePaymentDetailsFormComponent', () => {
  const methods = [
    { code: 'NC', display_name: 'Notes and coins' },
    { code: 'PO', display_name: 'Postal order' },
    { code: 'CQ', display_name: 'Cheque' },
    { code: 'CT', display_name: 'Credit transfer' },
  ];
  const sources = [
    { code: 'ALLPAY', display_name: 'allpay' },
    { code: 'OTHER', display_name: 'Other' },
  ];

  /** Creates the form with the method and source data returned by the API. */
  function render() {
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeePaymentDetailsFormComponent);
    fixture.componentRef.setInput('paymentMethods', methods);
    fixture.componentRef.setInput('paymentSources', sources);
    fixture.detectChanges();
    return fixture;
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillCourtFeePaymentDetailsFormComponent],
      providers: [provideRouter([]), { provide: UtilsService, useValue: { scrollToTop: vi.fn() } }],
    }).compileComponents();
  });

  it('shows the required error in the summary and next to the choices when neither is selected', () => {
    const fixture = render();
    const element = fixture.nativeElement as HTMLElement;

    element.querySelector('form')!.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.form.invalid).toBe(true);
    expect(element.querySelector('.govuk-error-summary__list')?.textContent).toContain(
      'Select who the payment was received from',
    );
    expect(element.querySelector('.govuk-form-group--error .govuk-error-message')?.textContent).toContain(
      'Select who the payment was received from',
    );
    const label = element.querySelector<HTMLLabelElement>('label[for="paymentReceivedFrom"]');
    if (label) Object.defineProperty(label, 'scrollIntoView', { value: vi.fn() });
    element.querySelector<HTMLAnchorElement>('.govuk-error-summary__list a')!.click();
    expect(document.activeElement?.id).toBe('paymentReceivedFrom');
  });

  it.each([
    ['Applicant', 'applicant'],
    ['Third party', 'thirdParty'],
  ])('accepts %s and clears the required error', (label, value) => {
    const fixture = render();
    const component = fixture.componentInstance;
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('legend')?.textContent).toContain('Payment received from');
    expect(element.textContent).toContain(label);
    const submit = () =>
      element.querySelector('form')!.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    submit();
    fixture.detectChanges();
    const emitted = vi.spyOn(component['formSubmit'], 'emit');

    element.querySelector<HTMLInputElement>(`input[value="${value}"]`)!.click();
    element.querySelector<HTMLInputElement>('input[value="NC"]')!.click();
    fixture.detectChanges();
    submit();
    fixture.detectChanges();

    expect(component.form.valid).toBe(true);
    expect(element.querySelector('.govuk-error-summary__list')).toBeNull();
    expect(element.querySelector('.govuk-form-group--error')).toBeNull();
    expect(emitted).toHaveBeenCalledWith({
      formData: { paymentReceivedFrom: value, paymentMethod: 'NC' },
      nestedFlow: false,
    });
  });

  it('shows a required method error when no payment method is selected', () => {
    const fixture = render();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLInputElement>('input[value="applicant"]')!.click();
    element.querySelector('form')!.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(element.querySelector('.govuk-error-summary__list')?.textContent).toContain('Select a method of payment');
  });

  it.each([
    ['NC', false, false],
    ['PO', true, false],
    ['CQ', true, false],
    ['CT', true, true],
  ])('shows the appropriate fields for %s', (method, hasReference, hasSource) => {
    const fixture = render();
    const element = fixture.nativeElement as HTMLElement;
    if (hasReference) {
      const conditionalId = element
        .querySelector<HTMLInputElement>(`input[value="${method}"]`)
        ?.getAttribute('aria-controls');
      expect(conditionalId).toBe(`payment-method-conditional-${method}`);
      expect(element.querySelector(`#${conditionalId}`)).not.toBeNull();
    }
    element.querySelector<HTMLInputElement>(`input[value="${method}"]`)!.click();
    fixture.detectChanges();

    expect(!!element.querySelector('#paymentReference')).toBe(hasReference);
    expect(!!element.querySelector('input[value="ALLPAY"]')).toBe(hasSource);
    expect(fixture.componentInstance.form.controls['paymentReference'].enabled).toBe(hasReference);
    expect(fixture.componentInstance.form.controls['paymentSource'].enabled).toBe(hasSource);
  });

  it('requires a source for credit transfer and clears conditional values when the method changes', () => {
    const fixture = render();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLInputElement>('input[value="applicant"]')!.click();
    element.querySelector<HTMLInputElement>('input[value="CT"]')!.click();
    fixture.detectChanges();
    element.querySelector('form')!.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(element.querySelector('.govuk-error-summary__list')?.textContent).toContain('Select a source');

    element.querySelector<HTMLInputElement>('input[value="ALLPAY"]')!.click();
    fixture.detectChanges();
    expect(element.querySelector('.govuk-error-summary__list')).toBeNull();
    fixture.componentInstance.form.controls['paymentReference'].setValue('ABC-123');
    element.querySelector<HTMLInputElement>('input[value="NC"]')!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.form.valid).toBe(true);
    expect(fixture.componentInstance.form.controls['paymentSource'].value).toBeNull();
    expect(fixture.componentInstance.form.controls['paymentReference'].value).toBeNull();
    expect(element.querySelector('.govuk-error-summary__list')).toBeNull();
  });

  it.each(['PO', 'CQ', 'CT'])('validates optional references for %s', (method) => {
    const fixture = render();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLInputElement>('input[value="applicant"]')!.click();
    element.querySelector<HTMLInputElement>(`input[value="${method}"]`)!.click();
    fixture.detectChanges();
    if (method === 'CT') element.querySelector<HTMLInputElement>('input[value="OTHER"]')!.click();
    const reference = element.querySelector<HTMLInputElement>('#paymentReference')!;
    const submit = () =>
      element.querySelector('form')!.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));

    reference.value = 'ABC!';
    reference.dispatchEvent(new Event('input', { bubbles: true }));
    submit();
    fixture.detectChanges();
    expect(element.querySelector('.govuk-error-summary__list')?.textContent).toContain(
      'Payment reference must only include letters a to z, numbers, hyphens, spaces and apostrophes',
    );
    reference.value = 'A'.repeat(51);
    reference.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(element.querySelector('.govuk-error-summary__list')?.textContent).toContain(
      'Payment reference must be 50 characters or fewer',
    );
    reference.value = "A1 - O'Brien";
    reference.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.form.valid).toBe(true);
  });
});
