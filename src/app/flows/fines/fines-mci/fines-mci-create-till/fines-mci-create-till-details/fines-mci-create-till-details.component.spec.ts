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

  it('shows the saved suspense journey under the payment table headings and opens it for amendment', () => {
    const store = TestBed.inject(FinesMciStore);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    store.setSuspensePayment({ ...suspensePayment, amount: '50.00', methodOfPayment: 'cheque' });
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

    const table = (fixture.nativeElement as HTMLElement).querySelector<HTMLTableElement>('#fines-mci-payments')!;
    expect(Array.from(table.querySelectorAll('thead th'), (header) => header.textContent?.trim())).toEqual([
      'Category',
      'Name',
      'Amount',
      'Received from',
      'Method',
      'Actions',
    ]);
    expect(
      Array.from(table.querySelectorAll('tbody tr:first-child > td'), (cell) => cell.textContent?.trim()).slice(0, 5),
    ).toEqual(['Suspense', 'Acme Org', '£50.00', 'Defendant', 'Cheque']);
    expect(Array.from(table.querySelectorAll('tbody a'), (link) => link.textContent?.trim())).toEqual([
      'Change payment 1',
      'Remove payment 1',
    ]);

    table.querySelector<HTMLAnchorElement>('a')!.click();
    expect(store.suspensePayment()?.amount).toBe('50.00');
    expect(store.suspenseNote()).toBe('Investigate');
    expect(navigate).toHaveBeenCalledWith(
      ['/', 'fines', 'manual-cash-input', 'create', 'till', 'check-suspense-payment'],
      undefined,
    );
  });

  it.each([
    { methodOfPayment: 'notesCoins', method: 'Notes and coins', payerType: 'thirdParty', receivedFrom: '3rd party' },
    { methodOfPayment: 'postalOrder', method: 'Postal order', payerType: null, receivedFrom: '—' },
    { methodOfPayment: 'creditTransfer', method: 'Credit transfer', payerType: 'defendant', receivedFrom: 'Defendant' },
    { methodOfPayment: null, method: '—', payerType: null, receivedFrom: '—' },
  ] as const)(
    'shows the $methodOfPayment payment method and received-from value',
    ({ methodOfPayment, method, payerType, receivedFrom }) => {
      const store = TestBed.inject(FinesMciStore);
      store.setSuspensePayment({ ...suspensePayment, methodOfPayment, payerType });
      store.saveSuspensePayment();
      fixture.detectChanges();
      const cells = (fixture.nativeElement as HTMLElement).querySelectorAll('#fines-mci-payments tbody td');
      expect(cells[3].textContent?.trim()).toBe(receivedFrom);
      expect(cells[4].textContent?.trim()).toBe(method);
    },
  );

  it('shows an individual payer and a dash for missing payment values', () => {
    const store = TestBed.inject(FinesMciStore);
    store.setSuspensePayment({ ...suspensePayment, amount: '', methodOfPayment: null });
    store.setSuspensePayerDetails({
      payerType: 'individual',
      title: null,
      firstNames: 'Alex',
      lastName: 'Smith',
      companyName: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      postcode: '',
    });
    store.saveSuspensePayment();
    fixture.detectChanges();
    const cells = (fixture.nativeElement as HTMLElement).querySelectorAll('#fines-mci-payments tbody td');
    expect(cells[1].textContent?.trim()).toBe('Alex Smith');
    expect(cells[2].textContent?.trim()).toBe('—');
  });

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
    expect(
      (fixture.nativeElement as HTMLElement)
        .querySelector('#fines-mci-payments tbody td:nth-child(2)')
        ?.textContent?.trim(),
    ).toBe('—');
  });

  it('removes only the selected payment and shows the empty state after the last removal', () => {
    const store = TestBed.inject(FinesMciStore);
    store.setSuspensePayment(suspensePayment);
    store.saveSuspensePayment();
    store.setSuspensePayment({ ...suspensePayment, amount: '25.00' });
    store.saveSuspensePayment();
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelectorAll('#fines-mci-payments tbody tr')).toHaveLength(2);

    page.querySelector<HTMLAnchorElement>('#fines-mci-payments tbody tr:first-child a:last-of-type')!.click();
    fixture.detectChanges();
    expect(store.tills()[0].payments).toHaveLength(1);
    expect(page.querySelectorAll('#fines-mci-payments tbody tr')).toHaveLength(1);
    expect(page.querySelector('#fines-mci-payments')?.textContent).toContain('£25.00');

    page.querySelector<HTMLAnchorElement>('#fines-mci-payments tbody tr a:last-of-type')!.click();
    fixture.detectChanges();
    expect(store.tills()[0].payments).toHaveLength(0);
    expect(page.querySelector('#fines-mci-payments')).toBeNull();
    expect(page.textContent).toContain('There are no payments');
  });

  it.each([
    { journey: 'criminal', category: 'Criminal' },
    { journey: 'courtFee', category: 'Court fee' },
  ] as const)('shows a $category payment while its journey is in progress', ({ journey, category }) => {
    const store = TestBed.inject(FinesMciStore);
    store.addPayment(store.ensureTill(), journey);
    fixture.detectChanges();
    const row = (fixture.nativeElement as HTMLElement).querySelector('#fines-mci-payments tbody tr')!;
    expect(row.querySelectorAll('td')[0].textContent).toBe(category);
    expect(row.querySelectorAll('td')[1].textContent?.trim()).toBe('—');
    expect(row.querySelectorAll('a')).toHaveLength(1);
    expect(row.querySelector('a')?.textContent).toContain('Remove');
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
