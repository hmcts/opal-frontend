import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { IFinesMciSuspensePayment } from '../../stores/interfaces/fines-mci.interface';
import { FinesMciCreateTillDetailsComponent } from './fines-mci-create-till-details.component';

const suspensePayment: IFinesMciSuspensePayment = {
  amount: '12.50',
  payerType: 'defendant',
  methodOfPayment: 'notesCoins',
  paymentReferencePostalOrder: '',
  paymentReferenceCheque: '',
  paymentReferenceCreditTransfer: '',
  source: null,
  reason: 'overpayment',
  relevantDetails: '',
};

describe('FinesMciCreateTillDetailsComponent', () => {
  let fixture: ComponentFixture<FinesMciCreateTillDetailsComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillDetailsComponent],
      providers: [provideRouter([]), FinesMciStore],
    }).compileComponents();

    TestBed.inject(FinesMciStore).setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    fixture = TestBed.createComponent(FinesMciCreateTillDetailsComponent);
    router = TestBed.inject(Router);
  });

  it('should display the selected business unit and empty till content', () => {
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.textContent).toContain('Till details');
    expect(nativeElement.textContent).toContain('Business unit');
    expect(nativeElement.textContent).toContain('Historical Debt');
    expect(nativeElement.textContent).toContain('Payments');
    expect(nativeElement.textContent).toContain('There are no payments');
    expect(nativeElement.textContent).toContain('Create till');
    expect(nativeElement.textContent).toContain('You must add at least 1 payment to the till.');
    expect(nativeElement.querySelector('#fines-mci-add-payment')?.classList).toContain('govuk-button--secondary');
    const deleteTillLink = nativeElement.querySelector('#fines-mci-delete-till');
    expect(deleteTillLink?.tagName).toBe('A');
    expect(deleteTillLink?.classList).toContain('govuk-error-colour');
    expect(deleteTillLink?.textContent?.trim()).toBe('Delete till');
  });

  it('shows a saved suspense payment and opens it for amendment', () => {
    const store = TestBed.inject(FinesMciStore);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    store.setSuspensePayment({
      amount: '12.50',
      payerType: 'defendant',
      methodOfPayment: 'notesCoins',
      paymentReferencePostalOrder: '',
      paymentReferenceCheque: '',
      paymentReferenceCreditTransfer: '',
      source: null,
      reason: 'overpayment',
      relevantDetails: '',
    });
    store.setSuspensePayerDetails({
      payerType: 'company',
      title: null,
      firstNames: '',
      lastName: '',
      companyName: 'Acme Org',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      postcode: '',
    });
    store.setSuspenseNote('Investigate');
    store.saveSuspensePayment();
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    expect(nativeElement.querySelector('.govuk-summary-card__title')?.textContent).toContain('Suspense payment');
    expect(nativeElement.querySelectorAll('#fines-mci-payments .govuk-summary-list__row')).toHaveLength(8);
    expect(nativeElement.textContent).toContain('Suspense');
    expect(nativeElement.textContent).toContain('£12.50');
    expect(nativeElement.textContent).toContain('Notes and coins');
    expect(nativeElement.textContent).toContain('Fines overpayment (OF)');
    expect(nativeElement.textContent).toContain('Acme Org');
    expect(nativeElement.textContent).not.toContain('There are no payments');
    nativeElement.querySelector<HTMLAnchorElement>('#fines-mci-payments a')!.click();
    expect(store.suspensePayment()?.amount).toBe('12.50');
    expect(store.suspenseNote()).toBe('Investigate');
    expect(navigate).toHaveBeenCalledWith(
      ['/', 'fines', 'manual-cash-input', 'create', 'till', 'check-suspense-payment'],
      undefined,
    );
  });

  it.each([
    { method: 'postalOrder', reference: 'PO123', reason: 'advance', label: 'Fine paid in advance (FA)' },
    { method: 'cheque', reference: 'CH123', reason: 'miscellaneous', label: 'Miscellaneous payment (MS)' },
    { method: 'creditTransfer', reference: 'CT123', reason: 'unidentified', label: 'Unidentified amount (UN)' },
  ] as const)('shows a saved $method payment with its reference and reason', ({ method, reference, reason, label }) => {
    const store = TestBed.inject(FinesMciStore);
    store.setSuspensePayment({
      ...suspensePayment,
      methodOfPayment: method,
      paymentReferencePostalOrder: 'PO123',
      paymentReferenceCheque: 'CH123',
      paymentReferenceCreditTransfer: 'CT123',
      source: 'allpay',
      reason,
      relevantDetails: 'Awaiting identification',
    });
    store.saveSuspensePayment();
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).querySelector('#fines-mci-payments')!.textContent ?? '';
    expect(text).toContain(reference);
    expect(text).toContain(label);
    expect(text).toContain(method === 'creditTransfer' ? 'allpay' : 'Payment reference');
  });

  it.each(['postalOrder', 'cheque', 'creditTransfer'] as const)(
    'shows a dash when a %s payment has no reference',
    (methodOfPayment) => {
      const store = TestBed.inject(FinesMciStore);
      store.setSuspensePayment({ ...suspensePayment, methodOfPayment });
      store.saveSuspensePayment();
      fixture.detectChanges();
      const rows = Array.from(
        (fixture.nativeElement as HTMLElement).querySelectorAll('#fines-mci-payments .govuk-summary-list__row'),
      );
      const referenceRow = rows.find((row) => row.querySelector('dt')?.textContent === 'Payment reference');
      expect(referenceRow?.querySelector('dd')?.textContent?.trim()).toBe('—');
    },
  );

  it('shows a dash when a company payer has no name', () => {
    const store = TestBed.inject(FinesMciStore);
    store.setSuspensePayment(suspensePayment);
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
    store.saveSuspensePayment();
    fixture.detectChanges();
    const rows = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('#fines-mci-payments .govuk-summary-list__row'),
    );
    const nameRow = rows.find((row) => row.querySelector('dt')?.textContent === 'Payer name');
    expect(nameRow?.querySelector('.govuk-summary-list__value')?.textContent?.trim()).toBe('—');
  });

  it('shows missing suspense and payer values as dashes', () => {
    const store = TestBed.inject(FinesMciStore);
    store.setSuspensePayment({ ...suspensePayment, amount: '', methodOfPayment: null, reason: null });
    store.saveSuspensePayment();
    fixture.detectChanges();
    const values = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('#fines-mci-payments .govuk-summary-list__value'),
    ).map((element) => element.textContent?.trim());
    expect(values.filter((value) => value === '—').length).toBeGreaterThanOrEqual(5);
  });

  it('shows an individual payer without a name or address as dashes', () => {
    const store = TestBed.inject(FinesMciStore);
    store.setSuspensePayment(suspensePayment);
    store.setSuspensePayerDetails({
      payerType: 'individual',
      title: null,
      firstNames: '',
      lastName: '',
      companyName: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      postcode: '',
    });
    store.saveSuspensePayment();
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.textContent).toContain('Individual');
    expect(page.querySelectorAll('#fines-mci-payments .govuk-summary-list__value')).toHaveLength(8);
    expect(
      page
        .querySelector('#fines-mci-payments .govuk-summary-list__row:last-child .govuk-summary-list__value')
        ?.textContent?.trim(),
    ).toBe('—');
  });

  it('shows non-suspense payments while their journeys are still in progress', () => {
    const store = TestBed.inject(FinesMciStore);
    store.addPayment(store.ensureTill(), 'courtFee');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Court fee payment');
  });

  it('should block navigation away from the till details page', () => {
    expect(fixture.componentInstance.canDeactivate()).toBe(false);
  });

  it('should block browser refresh, reload, and exit', () => {
    fixture.detectChanges();
    const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });

    expect(window.dispatchEvent(beforeUnloadEvent)).toBe(false);
    expect(beforeUnloadEvent.defaultPrevented).toBe(true);
  });

  it('should navigate back to select business unit and preserve the selected business unit', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const store = TestBed.inject(FinesMciStore);
    const selectedBusinessUnit = store.businessUnit();
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>('.govuk-back-link')!.click();

    expect(store.businessUnit()).toEqual(selectedBusinessUnit);
    expect(navigateSpy).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create', 'till', 'select-bu'], {
      state: { preserveBusinessUnit: true },
    });
  });

  it('should navigate to payment category when Add payment is selected', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();

    fixture.debugElement.query(By.css('opal-lib-govuk-button')).triggerEventHandler('buttonClickEvent');

    expect(navigateSpy).toHaveBeenCalledWith(
      ['/', 'fines', 'manual-cash-input', 'create', 'till', 'payment-category'],
      undefined,
    );
  });

  it('should navigate to cancel till creation when Delete till is selected', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();

    fixture.debugElement.query(By.css('#fines-mci-delete-till')).triggerEventHandler('click', new Event('click'));

    expect(navigateSpy).toHaveBeenCalledWith(
      ['/', 'fines', 'manual-cash-input', 'create', 'till', 'cancel'],
      undefined,
    );
  });
});
