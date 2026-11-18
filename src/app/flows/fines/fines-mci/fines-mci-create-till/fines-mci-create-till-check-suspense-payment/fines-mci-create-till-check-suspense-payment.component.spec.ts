import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { IFinesMciSuspensePayment } from '../../stores/interfaces/fines-mci.interface';
import { FinesMciCreateTillCheckSuspensePaymentComponent } from './fines-mci-create-till-check-suspense-payment.component';

const payment: IFinesMciSuspensePayment = {
  amount: '12.50',
  payerType: 'thirdParty',
  methodOfPayment: 'creditTransfer',
  paymentReferencePostalOrder: '',
  paymentReferenceCheque: '',
  paymentReferenceCreditTransfer: 'REF123',
  source: 'allpay',
  reason: 'unidentified',
  relevantDetails: '',
};

describe('FinesMciCreateTillCheckSuspensePaymentComponent', () => {
  let fixture: ComponentFixture<FinesMciCreateTillCheckSuspensePaymentComponent>;
  let store: InstanceType<typeof FinesMciStore>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillCheckSuspensePaymentComponent],
      providers: [provideRouter([]), FinesMciStore],
    }).compileComponents();
    store = TestBed.inject(FinesMciStore);
    router = TestBed.inject(Router);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.setSuspensePayment(payment);
    fixture = TestBed.createComponent(FinesMciCreateTillCheckSuspensePaymentComponent);
  });

  it('shows unidentified details, credit transfer source and missing values as dashes', () => {
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('opal-lib-govuk-summary-card-list')).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).querySelector('.govuk-summary-card__title')?.textContent).toContain(
      'Suspense payment',
    );
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('£12.50');
    expect(text).toContain('allpay');
    expect(text).toContain('REF123');
    const noteInput = (fixture.nativeElement as HTMLElement).querySelector<HTMLTextAreaElement>('#suspenseNote');
    expect(noteInput?.closest('.govuk-grid-column-two-thirds')).toBeTruthy();
    expect(noteInput?.maxLength).toBe(1000);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('1000 characters remaining');
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('#cancel-suspense-payment')?.closest('.govuk-button-group'),
    ).toBeNull();
    expect(text).toContain('Relevant details');
    expect(text).toContain('—');
    expect(text).not.toContain('Payer type');
  });

  it('shows identified payer details and hides source for other methods', () => {
    store.setSuspensePayment({ ...payment, reason: 'overpayment', methodOfPayment: 'cheque', source: null });
    store.setSuspensePayerDetails({
      payerType: 'individual',
      title: 'Ms',
      firstNames: 'Alex',
      lastName: 'Smith',
      companyName: '',
      addressLine1: '1 Main Street',
      addressLine2: '',
      addressLine3: '',
      postcode: 'AA1 1AA',
    });
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    const text = page.textContent ?? '';
    const fields = Array.from(page.querySelectorAll('.govuk-summary-card__content .govuk-summary-list__key')).map(
      (element) => element.textContent?.trim(),
    );
    expect(fields).toEqual([
      'Amount',
      'Payment received from',
      'Method of payment',
      'Payment reference',
      'Suspense reason',
      'Payer type',
      'Payer name',
      'Address',
    ]);
    expect(text).toContain('Alex Smith');
    expect(text).toContain('1 Main Street');
    expect(text).toContain('Payer type');
    expect(text).not.toContain('Source');
    expect(text).not.toContain('Relevant details');
  });

  it('requires a note for either save action and keeps the payment draft', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('#save-review-till')!.click();
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Add a suspense note');
    expect(document.activeElement).toBe((fixture.nativeElement as HTMLElement).querySelector('.govuk-error-summary'));
    expect(store.suspensePayment()).toEqual(payment);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('saves to the till and allows the stored payment to be edited', () => {
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
    const textarea = (fixture.nativeElement as HTMLElement).querySelector<HTMLTextAreaElement>('#suspenseNote')!;
    textarea.value = 'Payment needs investigation';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('#save-add-payment')!.click();
    expect(store.tills()[0].payments).toHaveLength(1);
    expect(store.tills()[0].payments[0].suspenseNote).toBe('Payment needs investigation');
    expect(store.suspensePayment()).toBeNull();
    const id = store.tills()[0].payments[0].paymentId;
    store.editSuspensePayment(id);
    store.setSuspenseNote('Updated note');
    store.saveSuspensePayment();
    expect(store.tills()[0].payments).toHaveLength(1);
    expect(store.tills()[0].payments[0].suspenseNote).toBe('Updated note');
  });

  it('retains the draft when cancellation is declined', async () => {
    vi.spyOn(router, 'navigate').mockResolvedValue(false);
    fixture.detectChanges();
    expect(fixture.componentInstance.canDeactivate()).toBe(true);
    expect(fixture.componentInstance.handleBeforeUnload()).toBe(true);
    const textarea = (fixture.nativeElement as HTMLElement).querySelector<HTMLTextAreaElement>('#suspenseNote')!;
    textarea.value = 'Draft note';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.canDeactivate()).toBe(false);
    expect(fixture.componentInstance.handleBeforeUnload()).toBe(false);
    (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>('#cancel-suspense-payment')!.click();
    expect(fixture.componentInstance.canDeactivate()).toBe(false);
    await Promise.resolve();
    expect(store.suspensePayment()).toEqual(payment);
  });

  it('blocks browser unload only while a note has been entered', () => {
    fixture.detectChanges();
    const emptyUnload = new Event('beforeunload', { cancelable: true });
    expect(window.dispatchEvent(emptyUnload)).toBe(true);
    const textarea = (fixture.nativeElement as HTMLElement).querySelector<HTMLTextAreaElement>('#suspenseNote')!;
    textarea.value = 'Draft note';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const draftUnload = new Event('beforeunload', { cancelable: true });
    expect(window.dispatchEvent(draftUnload)).toBe(false);
    expect(draftUnload.defaultPrevented).toBe(true);
  });

  it('allows cancel without a leave warning when the note is empty', async () => {
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>('#cancel-suspense-payment')!.click();
    expect(fixture.componentInstance.canDeactivate()).toBe(true);
    await Promise.resolve();
    expect(store.suspensePayment()).toBeNull();
  });

  it.each([
    { methodOfPayment: 'notesCoins', reference: '—' },
    { methodOfPayment: 'postalOrder', reference: 'PO123' },
    { methodOfPayment: 'cheque', reference: 'CH123' },
  ] as const)('shows the selected $methodOfPayment reference', ({ methodOfPayment, reference }) => {
    store.setSuspensePayment({
      ...payment,
      methodOfPayment,
      paymentReferencePostalOrder: 'PO123',
      paymentReferenceCheque: 'CH123',
    });
    fixture.detectChanges();
    const row = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.govuk-summary-list__row')).find(
      (element) => element.querySelector('dt')?.textContent === 'Payment reference',
    );
    expect(row?.querySelector('.govuk-summary-list__value')?.textContent).toBe(reference);
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Source');
  });

  it('shows dashes when optional payment and payer details are missing', () => {
    store.setSuspensePayment({ ...payment, amount: '', methodOfPayment: null, reason: null });
    fixture.detectChanges();
    const values = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.govuk-summary-list__value'),
    ).map((element) => element.textContent?.trim());
    expect(values).toContain('—');
    expect(values.filter((value) => value === '—').length).toBeGreaterThanOrEqual(5);
  });

  it('shows a company payer with a missing name and address as dashes', () => {
    store.setSuspensePayment({ ...payment, reason: 'advance' });
    store.setSuspensePayerDetails({
      payerType: 'company',
      title: null,
      firstNames: '',
      lastName: '',
      companyName: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      postcode: '',
    });
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.textContent).toContain('Fine paid in advance (FA)');
    expect(page.textContent).toContain('Company');
    expect(
      page.querySelector('.govuk-summary-list__row:last-child .govuk-summary-list__value')?.textContent?.trim(),
    ).toBe('—');
  });

  it('routes each Change link to its matching details screen', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    store.setSuspensePayment({ ...payment, reason: 'miscellaneous' });
    fixture.detectChanges();
    const links = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('.govuk-summary-list__actions a'),
    );
    links.find((link) => link.textContent?.includes('amount'))!.click();
    links.find((link) => link.textContent?.includes('payer type'))!.click();
    expect(navigate).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create', 'till', 'suspense-details']);
    expect(navigate).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create', 'till', 'payer-details']);
  });

  it('clears the validation error as a note is entered and saves to review the till', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    page.querySelector<HTMLButtonElement>('#save-review-till')!.click();
    expect(page.querySelector('.govuk-error-summary')).toBeTruthy();
    const textarea = page.querySelector<HTMLTextAreaElement>('#suspenseNote')!;
    textarea.value = '  Follow up  ';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(page.querySelector('.govuk-error-summary')).toBeNull();
    page.querySelector<HTMLButtonElement>('#save-review-till')!.click();
    expect(store.tills()[0].payments[0].suspenseNote).toBe('Follow up');
    expect(navigate).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create', 'till', 'details']);
  });

  it('keeps the validation error for a whitespace-only note', () => {
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    page.querySelector<HTMLButtonElement>('#save-review-till')!.click();
    const textarea = page.querySelector<HTMLTextAreaElement>('#suspenseNote')!;
    textarea.value = '   ';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(page.querySelector('.govuk-error-summary')).toBeTruthy();
  });

  it('rejects an overlong restored note and retains the draft', () => {
    store.setSuspenseNote('x'.repeat(1001));
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('#save-add-payment')!.click();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Suspense note must be 1000 characters or fewer',
    );
    expect(store.tills()).toEqual([]);
  });

  it('discards a note when cancellation is accepted', async () => {
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
    const textarea = (fixture.nativeElement as HTMLElement).querySelector<HTMLTextAreaElement>('#suspenseNote')!;
    textarea.value = 'Discard this note';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>('#cancel-suspense-payment')!.click();
    expect(fixture.componentInstance.canDeactivate()).toBe(false);
    await Promise.resolve();
    expect(store.suspenseNote()).toBe('');
    expect(store.suspensePayment()).toBeNull();
  });
});
