import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciCreateTillCourtFeePaymentDetailsFormComponent } from './fines-mci-create-till-court-fee-payment-details-form.component';

describe('FinesMciCreateTillCourtFeePaymentDetailsFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillCourtFeePaymentDetailsFormComponent],
      providers: [provideRouter([]), { provide: UtilsService, useValue: { scrollToTop: vi.fn() } }],
    }).compileComponents();
  });

  it('shows the required error in the summary and next to the choices when neither is selected', () => {
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeePaymentDetailsFormComponent);
    fixture.detectChanges();
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
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeePaymentDetailsFormComponent);
    fixture.detectChanges();
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
    fixture.detectChanges();
    submit();
    fixture.detectChanges();

    expect(component.form.valid).toBe(true);
    expect(element.querySelector('.govuk-error-summary__list')).toBeNull();
    expect(element.querySelector('.govuk-form-group--error')).toBeNull();
    expect(emitted).toHaveBeenCalledWith({ formData: { paymentReceivedFrom: value }, nestedFlow: false });
  });
});
