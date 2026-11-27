import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../stores/fines-mci.store';
import { IFinesMciCriminalPayment } from '../stores/interfaces/fines-mci.interface';
import { FinesMciPaymentCategoryCriminalPaymentDetailsComponent } from './fines-mci-payment-category-criminal-payment-details.component';

const CRIMINAL_PAYMENT: IFinesMciCriminalPayment = {
  amount: '25.00',
  payerType: 'defendant',
  methodOfPayment: 'creditTransfer',
  paymentReferencePostalOrder: '',
  paymentReferenceCheque: '',
  paymentReferenceCreditTransfer: 'ref-02',
  source: 'allpay',
  thirdPartyName: '',
};

describe('FinesMciPaymentCategoryCriminalPaymentDetailsComponent', () => {
  let fixture: ComponentFixture<FinesMciPaymentCategoryCriminalPaymentDetailsComponent>;
  let router: Router;
  let store: InstanceType<typeof FinesMciStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciPaymentCategoryCriminalPaymentDetailsComponent],
      providers: [provideRouter([]), FinesMciStore, { provide: UtilsService, useValue: { scrollToTop: vi.fn() } }],
    }).compileComponents();

    store = TestBed.inject(FinesMciStore);
    router = TestBed.inject(Router);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalPaymentDetailsComponent);
  });

  it('shows the selected business unit and form title', () => {
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_name);
    expect(element.querySelector('h1')?.textContent).toContain('Payment details');
  });

  it('starts without leave protection when no criminal payment data is stored', () => {
    fixture.detectChanges();

    expect(fixture.componentInstance['canDeactivate']()).toBe(true);
    expect(fixture.componentInstance.handleBeforeUnload()).toBe(true);
  });

  it.each([
    ['', 'Enter amount'],
    ['12x', 'Enter only numbers and decimals'],
    ['-20', 'Amount cannot be a negative value'],
    ['0.00', 'Amount cannot be zero'],
  ])('keeps the user on Payment details with the amount error for %s', (amount, message) => {
    store.setCriminalPayment(CRIMINAL_PAYMENT);
    fixture.detectChanges();
    const navigate = vi.spyOn(router, 'navigate');
    const input = fixture.nativeElement.querySelector('#amount') as HTMLInputElement;
    input.value = amount;
    input.dispatchEvent(new Event('input', { bubbles: true }));

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toBe('Payment details');
    expect(fixture.nativeElement.querySelector('#amount-error')?.textContent).toBe(message);
    expect(fixture.nativeElement.querySelector('.govuk-error-summary__list')?.textContent).toContain(message);
    expect(navigate).not.toHaveBeenCalled();
    expect(store.criminalPayment()).toEqual(CRIMINAL_PAYMENT);
  });

  it('restores leave protection for saved criminal payment details', () => {
    store.setCriminalPayment(CRIMINAL_PAYMENT);
    fixture.detectChanges();

    expect(fixture.componentInstance['canDeactivate']()).toBe(false);
    expect(fixture.componentInstance.handleBeforeUnload()).toBe(false);
    fixture.destroy();
    expect(store.criminalPayment()).toBeNull();
  });

  it.each([
    {
      scenario: 'no payer selected',
      payerType: null,
      name: '',
      errorId: 'payerType-error-message',
      message: 'Select who the payment was received from',
    },
    {
      scenario: 'third-party name missing',
      payerType: 'thirdParty',
      name: '',
      errorId: 'thirdPartyName-error',
      message: 'Enter name',
    },
    {
      scenario: 'third-party name contains only spaces',
      payerType: 'thirdParty',
      name: '   ',
      errorId: 'thirdPartyName-error',
      message: 'Enter name',
    },
    {
      scenario: 'third-party name contains unsupported characters',
      payerType: 'thirdParty',
      name: 'Payer@123',
      errorId: 'thirdPartyName-error',
      message: 'Name must only include letters a to z, numbers, hyphens, spaces and apostrophes',
    },
    {
      scenario: 'third-party name exceeds 50 characters',
      payerType: 'thirdParty',
      name: 'A'.repeat(51),
      errorId: 'thirdPartyName-error',
      message: 'Name must be 50 characters or fewer',
    },
  ])('blocks Continue when $scenario', ({ payerType, name, errorId, message }) => {
    fixture.detectChanges();
    const navigate = vi.spyOn(router, 'navigate');
    const element = fixture.nativeElement as HTMLElement;
    const amount = element.querySelector<HTMLInputElement>('#amount')!;
    amount.value = '25.00';
    amount.dispatchEvent(new Event('input', { bubbles: true }));
    element.querySelector<HTMLInputElement>('input[name="methodOfPayment"][value="notesCoins"]')!.click();
    if (payerType) {
      element.querySelector<HTMLInputElement>(`input[name="payerType"][value="${payerType}"]`)!.click();
      const input = element.querySelector<HTMLInputElement>('#thirdPartyName')!;
      input.value = name;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    element.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(element.querySelector(`#${errorId}`)?.textContent).toContain(message);
    expect(element.querySelector('.govuk-error-summary__list')?.textContent).toContain(message);
    if (payerType) {
      expect(element.querySelector('#thirdPartyName')?.getAttribute('aria-describedby')).toBe('thirdPartyName-error');
    }
    expect(element.querySelector('h1')?.textContent).toBe('Payment details');
    expect(navigate).not.toHaveBeenCalled();
    expect(store.criminalPayment()).toBeNull();
  });

  it('stores validated details and continues to Check Payment without leave protection', async () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.componentInstance.handleSubmit({ formData: CRIMINAL_PAYMENT, nestedFlow: false });
    expect(store.criminalPayment()).toEqual(CRIMINAL_PAYMENT);
    expect(fixture.componentInstance.stateUnsavedChanges).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create', 'till', 'check-payment']);
  });

  it.each(['cancelled', 'failed'])('restores draft protection when Continue navigation is %s', async (outcome) => {
    const navigate = vi.spyOn(router, 'navigate');
    if (outcome === 'failed') navigate.mockRejectedValue(new Error('Navigation failed'));
    else navigate.mockResolvedValue(false);

    await fixture.componentInstance.handleSubmit({ formData: CRIMINAL_PAYMENT, nestedFlow: false });

    expect(store.criminalPayment()).toEqual(CRIMINAL_PAYMENT);
    expect(fixture.componentInstance.stateUnsavedChanges).toBe(true);
    expect(fixture.componentInstance.handleBeforeUnload()).toBe(false);
    fixture.destroy();
    expect(store.criminalPayment()).toBeNull();
  });

  it('ignores duplicate Continue submissions while navigation is pending', async () => {
    let completeNavigation!: (success: boolean) => void;
    const navigate = vi.spyOn(router, 'navigate').mockReturnValue(
      new Promise<boolean>((resolve) => {
        completeNavigation = resolve;
      }),
    );
    const pending = fixture.componentInstance.handleSubmit({ formData: CRIMINAL_PAYMENT, nestedFlow: false });
    await fixture.componentInstance.handleSubmit({ formData: CRIMINAL_PAYMENT, nestedFlow: false });
    expect(navigate).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.handleBeforeUnload()).toBe(false);
    completeNavigation(true);
    await pending;
  });

  it.each([
    { method: null, source: null, field: null, value: '', message: 'Select a method of payment' },
    { method: 'creditTransfer', source: null, field: null, value: '', message: 'Select a source' },
    ...[
      ['postalOrder', 'paymentReferencePostalOrder'],
      ['cheque', 'paymentReferenceCheque'],
      ['creditTransfer', 'paymentReferenceCreditTransfer'],
    ].flatMap(([method, field]) => [
      {
        method,
        source: 'allpay',
        field,
        value: 'Ref@123',
        message: 'Payment reference must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      },
      {
        method,
        source: 'allpay',
        field,
        value: 'A'.repeat(51),
        message: 'Payment reference must be 50 characters or fewer',
      },
    ]),
  ])('blocks Continue for $method with $message', ({ method, source, field, value, message }) => {
    fixture.detectChanges();
    const navigate = vi.spyOn(router, 'navigate');
    const element = fixture.nativeElement as HTMLElement;
    const amount = element.querySelector<HTMLInputElement>('#amount')!;
    amount.value = '25.00';
    amount.dispatchEvent(new Event('input', { bubbles: true }));
    element.querySelector<HTMLInputElement>('input[name="payerType"][value="defendant"]')!.click();
    if (method) element.querySelector<HTMLInputElement>(`input[name="methodOfPayment"][value="${method}"]`)!.click();
    if (source && method === 'creditTransfer')
      element.querySelector<HTMLInputElement>(`input[name="source"][value="${source}"]`)!.click();
    if (field) {
      const input = element.querySelector<HTMLInputElement>(`#${field}`)!;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    element.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(element.querySelector('.govuk-error-summary__list')?.textContent).toContain(message);
    const errorId = field ? `${field}-error` : `${method ? 'source' : 'methodOfPayment'}-error-message`;
    expect(element.querySelector(`#${errorId}`)?.textContent).toContain(message);
    expect(element.querySelector('h1')?.textContent).toBe('Payment details');
    expect(store.criminalPayment()).toBeNull();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('tracks unsaved child form values for route and browser leave protection', () => {
    const component = fixture.componentInstance;
    component.handleUnsavedChanges(true);
    const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });

    expect(component['canDeactivate']()).toBe(false);
    expect(component.handleBeforeUnload()).toBe(false);
    expect(window.dispatchEvent(beforeUnloadEvent)).toBe(false);
    expect(beforeUnloadEvent.defaultPrevented).toBe(true);
  });

  it('retains leave protection when criminal payment state is present even if the child is pristine', () => {
    store.setCriminalPayment(CRIMINAL_PAYMENT);
    fixture.detectChanges();

    fixture.componentInstance.handleUnsavedChanges(false);

    expect(fixture.componentInstance.stateUnsavedChanges).toBe(true);
  });

  it('clears criminal payment data after Cancel navigation succeeds', async () => {
    store.setDraftJourney('criminal');
    store.setCriminalPayment(CRIMINAL_PAYMENT);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await fixture.componentInstance.handleCancel();
    await fixture.whenStable();

    expect(navigateSpy).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create', 'till', 'details']);
    expect(store.draftJourney()).toBeNull();
    expect(store.criminalPayment()).toBeNull();
  });

  it('retains criminal payment data when Cancel navigation is rejected', async () => {
    store.setDraftJourney('criminal');
    store.setCriminalPayment(CRIMINAL_PAYMENT);
    vi.spyOn(router, 'navigate').mockResolvedValue(false);

    await fixture.componentInstance.handleCancel();
    await fixture.whenStable();

    expect(store.draftJourney()).toBe('criminal');
    expect(store.criminalPayment()).toEqual(CRIMINAL_PAYMENT);
  });

  it.each(['Back', 'Cancel'] as const)(
    'retains the draft and leave protection when %s navigation fails',
    async (action) => {
      store.setDraftJourney('criminal');
      store.setCriminalPayment(CRIMINAL_PAYMENT);
      fixture.detectChanges();
      vi.spyOn(router, 'navigate').mockRejectedValue(new Error('Navigation failed'));

      if (action === 'Back') await fixture.componentInstance.handleBack();
      else await fixture.componentInstance.handleCancel();

      expect(store.criminalPayment()).toEqual(CRIMINAL_PAYMENT);
      expect(store.draftJourney()).toBe('criminal');
      expect(fixture.componentInstance['canDeactivate']()).toBe(false);
      expect(fixture.componentInstance.handleBeforeUnload()).toBe(false);
      expect(fixture.nativeElement.querySelector('#amount').value).toBe(CRIMINAL_PAYMENT.amount);
    },
  );
});
