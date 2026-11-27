import { Subject } from 'rxjs';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../../fines-acc/fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { Component } from '@angular/core';
import { RouterTestingHarness } from '@angular/router/testing';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { routing } from '../routing/fines-mci.routes';
import { TestBed } from '@angular/core/testing';
import { Navigation, NavigationCancel, NavigationEnd, NavigationError, provideRouter, Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { FinesMciStore } from '../stores/fines-mci.store';
import { IFinesMciCriminalPayment } from '../stores/interfaces/fines-mci.interface';
import { FinesMciPaymentCategoryCriminalCheckPaymentComponent } from './fines-mci-payment-category-criminal-check-payment.component';

const PAYMENT: IFinesMciCriminalPayment = {
  amount: '75.00',
  payerType: 'defendant',
  thirdPartyName: '',
  methodOfPayment: 'cheque',
  paymentReferencePostalOrder: 'POSTAL-REFERENCE',
  paymentReferenceCheque: 'CHEQUE-REFERENCE',
  paymentReferenceCreditTransfer: 'TRANSFER-REFERENCE',
  source: 'allpay',
};

@Component({ template: '' })
class DestinationComponent {}

describe('FinesMciPaymentCategoryCriminalCheckPaymentComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));
  afterEach(() => vi.restoreAllMocks());

  function render(payment: IFinesMciCriminalPayment = PAYMENT, balance = 100, company = false) {
    const store = TestBed.inject(FinesMciStore);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.setSelectedCriminalAccount(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0]);
    store.setSelectedCriminalAccountAtAGlance({
      ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
      account_number: 'TEST001',
      account_balance: balance,
      party_details: {
        party_id: 'test-party',
        organisation_flag: company,
        organisation_details: company ? { organisation_name: 'Test Company', organisation_aliases: null } : null,
        individual_details: company
          ? null
          : {
              title: 'Mr',
              forenames: 'Test',
              surname: 'Defendant',
              date_of_birth: null,
              age: null,
              national_insurance_number: null,
              individual_aliases: null,
            },
      },
    });
    store.setCriminalPayment(payment);
    const fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalCheckPaymentComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const rows = () =>
      Object.fromEntries(
        Array.from(element.querySelectorAll('.govuk-summary-list__row')).map((row) => [
          row.querySelector('dt')!.textContent!.trim(),
          row.querySelector('dd')!.textContent!.trim(),
        ]),
      );
    return { fixture, element, store, rows };
  }

  it('displays the business unit and criminal payment fields in the specified order', () => {
    const { element, rows } = render();
    expect(element.querySelector('h1')?.textContent).toBe('Check payment');
    expect(element.querySelector('.govuk-caption-l')?.textContent).toBe(
      OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_name,
    );
    expect(rows()).toEqual({
      Defendant: 'Test DEFENDANT (TEST001)',
      Amount: '£75.00',
      'Payment received from': 'Defendant',
      'Method of payment': 'Cheque',
      'Payment reference': 'CHEQUE-REFERENCE',
    });
    expect(element.textContent).not.toContain('Court fee');
    expect(element.querySelector('[aria-label="Overpayment"]')).toBeNull();
  });

  it('displays an organisation without uppercasing its name and shows a third party payer', () => {
    const { rows } = render({ ...PAYMENT, payerType: 'thirdParty', thirdPartyName: 'Test Payer' }, 100, true);
    expect(rows()['Defendant']).toBe('Test Company (TEST001)');
    expect(rows()['Payment received from']).toBe('Third party');
    expect(rows()['Name']).toBe('Test Payer');
    expect(Object.keys(rows())).toEqual([
      'Defendant',
      'Amount',
      'Payment received from',
      'Name',
      'Method of payment',
      'Payment reference',
    ]);
  });

  it('hides the third party name when the payer is the defendant', () => {
    const { rows, element } = render({ ...PAYMENT, thirdPartyName: 'Test Payer' });
    expect(rows()['Name']).toBeUndefined();
    expect(element.textContent).not.toContain('Test Payer');
  });

  it('returns to payment details when the third party name is changed, preserving the draft', async () => {
    const payment = { ...PAYMENT, payerType: 'thirdParty' as const, thirdPartyName: 'Test Payer' };
    const { element, fixture, store } = render(payment);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const confirm = vi.spyOn(window, 'confirm');
    const nameRow = Array.from(element.querySelectorAll('.govuk-summary-list__row')).find(
      (row) => row.querySelector('dt')?.textContent?.trim() === 'Name',
    )!;
    nameRow.querySelector<HTMLAnchorElement>('a')!.click();
    await fixture.whenStable();
    expect(navigate).toHaveBeenCalledWith([
      '/',
      'fines',
      'manual-cash-input',
      'create',
      'till',
      'payment',
      'category',
      'criminal',
      'payment-details',
      store.selectedCriminalAccount()?.defendant_account_id,
    ]);
    expect(store.criminalPayment()).toEqual(payment);
    expect(fixture.componentInstance.canDeactivate()).toBe(true);
    expect(confirm).not.toHaveBeenCalled();
  });

  it.each([
    ['notesCoins', 'Notes and coins', '—'],
    ['postalOrder', 'Postal order', 'POSTAL-REFERENCE'],
    ['cheque', 'Cheque', 'CHEQUE-REFERENCE'],
    ['creditTransfer', 'Credit transfer', 'TRANSFER-REFERENCE'],
  ] as const)(
    'displays the selected %s reference and conditionally displays source',
    (methodOfPayment, method, reference) => {
      const { rows } = render({ ...PAYMENT, methodOfPayment });
      expect(rows()['Method of payment']).toBe(method);
      expect(rows()['Payment reference']).toBe(reference);
      expect(rows()['Source']).toBe(methodOfPayment === 'creditTransfer' ? 'allpay' : undefined);
    },
  );

  it('uses a dash for a blank optional reference', () => {
    expect(render({ ...PAYMENT, paymentReferenceCheque: '' }).rows()['Payment reference']).toBe('—');
  });

  it.each(['74.99', '75.00'])('omits the overpayment banner for amount %s at or below the balance', (amount) => {
    const { element } = render({ ...PAYMENT, amount }, 75);
    expect(element.querySelector('.moj-alert')).toBeNull();
  });

  it.each([
    ['75.01', 75, '£0.01'],
    ['80.00', 75, '£5.00'],
    ['999999999999999999.99', 75, '£999,999,999,999,999,924.99'],
  ])('displays the exact overpayment for %s', (amount, balance, expected) => {
    const { element } = render({ ...PAYMENT, amount }, balance);
    expect(element.querySelector('.moj-alert--information')?.textContent).toContain(
      `This amount contains a ${expected} overpayment.`,
    );
  });

  it('formats a negative amount and omits an overpayment', () => {
    const { element, rows } = render({ ...PAYMENT, amount: '-5.50' });
    expect(rows()['Amount']).toBe('-£5.50');
    expect(element.querySelector('.moj-alert')).toBeNull();
  });

  it.each(['Amount', 'Payment received from', 'Method of payment', 'Source', 'Payment reference'])(
    'returns to payment details with the draft intact when %s is changed',
    async (label) => {
      const payment = { ...PAYMENT, methodOfPayment: 'creditTransfer' as const };
      const { element, fixture, store } = render(payment);
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const confirm = vi.spyOn(window, 'confirm');
      const row = Array.from(element.querySelectorAll('.govuk-summary-list__row')).find(
        (item) => item.querySelector('dt')?.textContent?.trim() === label,
      )!;
      row.querySelector<HTMLAnchorElement>('a')!.click();
      await fixture.whenStable();
      expect(navigate).toHaveBeenCalledWith([
        '/',
        'fines',
        'manual-cash-input',
        'create',
        'till',
        'payment',
        'category',
        'criminal',
        'payment-details',
        store.selectedCriminalAccount()?.defendant_account_id,
      ]);
      expect(store.criminalPayment()).toEqual(payment);
      expect(fixture.componentInstance.canDeactivate()).toBe(true);
      expect(confirm).not.toHaveBeenCalled();
    },
  );

  it.each([
    ['save-review-till', 'details'],
    ['save-add-payment', 'payment-category'],
  ])('saves and opens %s without a warning', async (buttonId, destination) => {
    const tillRoot = 'fines/manual-cash-input/create/till';
    const checkRoute = routing
      .find((route) => route.path === 'create')!
      .children!.find((route) => route.path === 'till')!
      .children!.find((route) => route.path === 'check-payment')!;
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { ...checkRoute, path: `${tillRoot}/check-payment`, canActivate: [], resolve: {} },
          { path: `${tillRoot}/details`, component: DestinationComponent },
          { path: `${tillRoot}/payment-category`, component: DestinationComponent },
        ]),
      ],
    });
    const { store, fixture } = render();
    store.setDraftJourney('criminal');
    const account = store.selectedCriminalAccount();
    const businessUnit = store.businessUnit();
    const tillId = store.ensureTill();
    store.addPayment(tillId, 'suspense');
    const existingPayment = store.tills()[0].payments[0];
    fixture.destroy();
    const harness = await RouterTestingHarness.create(`/${tillRoot}/check-payment`);
    const confirm = vi.spyOn(window, 'confirm');
    const button = harness.routeNativeElement!.querySelector<HTMLButtonElement>(`#${buttonId}`)!;
    expect(button.disabled).toBe(false);
    button.click();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe(`/${tillRoot}/${destination}`);
    expect(confirm).not.toHaveBeenCalled();
    expect(store.tills()[0].payments).toEqual([
      existingPayment,
      { paymentId: expect.any(String), journey: 'criminal', criminalPayment: PAYMENT, criminalAccount: account },
    ]);
    expect(store.businessUnit()).toEqual(businessUnit);
    expect(store.criminalPayment()).toBeNull();
    expect(store.selectedCriminalAccount()).toBeNull();
    expect(store.selectedCriminalAccountAtAGlance()).toBeNull();
    expect(store.draftJourney()).toBeNull();
  });

  it('prevents duplicate saves and disables both buttons while navigation is pending', async () => {
    const { element, fixture, store } = render();
    let completeNavigation!: (success: boolean) => void;
    const navigate = vi
      .spyOn(TestBed.inject(Router), 'navigate')
      .mockReturnValue(new Promise<boolean>((resolve) => (completeNavigation = resolve)));
    const review = element.querySelector<HTMLButtonElement>('#save-review-till')!;
    const add = element.querySelector<HTMLButtonElement>('#save-add-payment')!;
    review.click();
    add.click();
    fixture.detectChanges();
    expect(review.disabled).toBe(true);
    expect(add.disabled).toBe(true);
    expect(fixture.componentInstance.handleBeforeUnload()).toBe(false);
    expect(store.tills()[0].payments).toHaveLength(1);
    expect(navigate).toHaveBeenCalledOnce();
    completeNavigation(true);
    await fixture.whenStable();
    expect(store.tills()[0].payments).toHaveLength(1);
  });

  for (const action of ['defendant', 'cancel', 'leave'] as const) {
    it.each([true, false])(`uses the shared guard on ${action}: %s`, async (accepted) => {
      const tillRoot = 'fines/manual-cash-input/create/till';
      const checkRoute = routing
        .find((route) => route.path === 'create')!
        .children!.find((route) => route.path === 'till')!
        .children!.find((route) => route.path === 'check-payment')!;
      expect(checkRoute.canDeactivate).toEqual([canDeactivateGuard]);
      TestBed.configureTestingModule({
        providers: [
          provideRouter([
            { ...checkRoute, path: `${tillRoot}/check-payment`, canActivate: [], resolve: {} },
            { path: `${tillRoot}/details`, component: DestinationComponent },
            { path: `${tillRoot}/payment/category/criminal/search`, component: DestinationComponent },
            { path: 'elsewhere', component: DestinationComponent },
          ]),
        ],
      });
      const { store, fixture } = render();
      store.setDraftJourney('criminal');
      store.ensureTill();
      const originalTills = store.tills();
      fixture.destroy();
      const harness = await RouterTestingHarness.create(`/${tillRoot}/check-payment`);
      const confirm = vi.spyOn(window, 'confirm').mockReturnValue(accepted);
      if (action === 'leave') {
        await TestBed.inject(Router).navigateByUrl('/elsewhere');
      } else {
        const element = harness.routeNativeElement!;
        const link =
          action === 'defendant'
            ? element.querySelector<HTMLAnchorElement>('.govuk-summary-list__actions a')!
            : element.querySelector<HTMLAnchorElement>('#cancel-criminal-payment')!;
        link.click();
      }
      await harness.fixture.whenStable();
      expect(confirm).toHaveBeenCalledOnce();
      expect(store.criminalPayment()).toEqual(accepted ? null : PAYMENT);
      expect(store.draftJourney()).toBe(accepted ? null : 'criminal');
      expect(store.tills()).toEqual(originalTills);
      const destination =
        action === 'leave'
          ? '/elsewhere'
          : action === 'cancel'
            ? `/${tillRoot}/details`
            : `/${tillRoot}/payment/category/criminal/search`;
      expect(TestBed.inject(Router).url).toBe(accepted ? destination : `/${tillRoot}/check-payment`);
    });
  }

  it.each([false, 'rejected'])('restores leave protection when amendment navigation returns %s', async (result) => {
    const { element, fixture, store } = render();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
    if (result === false) navigate.mockResolvedValue(false);
    else navigate.mockRejectedValue(new Error('Navigation failed'));
    element.querySelectorAll<HTMLAnchorElement>('.govuk-summary-list__actions a')[1].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.canDeactivate()).toBe(false);
    expect(store.criminalPayment()).toEqual(PAYMENT);
  });

  it('preserves the draft when cancellation navigation fails', async () => {
    const { element, fixture, store } = render();
    vi.spyOn(TestBed.inject(Router), 'navigate').mockRejectedValue(new Error('Navigation failed'));
    element.querySelector<HTMLAnchorElement>('#cancel-criminal-payment')!.click();
    await fixture.whenStable();
    expect(store.criminalPayment()).toEqual(PAYMENT);
  });
  it.each([
    null,
    { ...PAYMENT, amount: 'invalid' },
    { ...PAYMENT, payerType: null },
    { ...PAYMENT, methodOfPayment: null },
  ])('does not show a misleading summary for missing or incomplete payment state: %j', (payment) => {
    const { fixture, store, element } = render();
    store.setCriminalPayment(payment);
    fixture.detectChanges();
    expect(element.querySelectorAll('.govuk-summary-list__row')).toHaveLength(0);
    expect(element.querySelector('.moj-alert')).toBeNull();
  });

  it('uses the header balance when at-a-glance balance is absent', () => {
    const { fixture, store, element } = render({ ...PAYMENT, amount: '80.00' });
    store.setSelectedCriminalAccountAtAGlance({
      ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
      account_balance: undefined,
    });
    store.setSelectedCriminalAccountHeader({
      ...FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK,
      payment_state_summary: { ...FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.payment_state_summary, account_balance: 75 },
    });
    fixture.detectChanges();
    expect(element.querySelector('.moj-alert')?.textContent).toContain('£5.00 overpayment');
  });

  it.each([undefined, NaN, Infinity])('omits overpayment when the balance is unavailable: %s', (balance) => {
    const { fixture, store, element } = render();
    store.setSelectedCriminalAccountAtAGlance({
      ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
      account_balance: balance,
    });
    fixture.detectChanges();
    expect(element.querySelector('.moj-alert')).toBeNull();
  });

  it.each([false, true])('uses the selected account when fresh name data is unavailable (company=%s)', (company) => {
    const { fixture, store, rows } = render();
    store.setSelectedCriminalAccount({
      ...store.selectedCriminalAccount()!,
      organisation_flag: company,
      organisation_name: 'Test Company',
      defendant_firstnames: 'Test',
      defendant_surname: 'Person',
      account_number: 'TEST002',
    });
    store.setCriminalPayment(PAYMENT);
    fixture.detectChanges();
    expect(rows()['Defendant']).toBe(`${company ? 'Test Company' : 'Test PERSON'} (TEST002)`);
  });

  it('shows a dash when neither account source provides a name, and omits a missing account number', () => {
    const { fixture, store, rows } = render();
    store.setSelectedCriminalAccount(null);
    store.setCriminalPayment(PAYMENT);
    fixture.detectChanges();
    expect(rows()['Defendant']).toBe('—');
  });

  it('blocks saving when the draft is absent and allows unloading an empty page', async () => {
    const { fixture, store, element } = render();
    store.setCriminalPayment(null);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
    element.querySelector<HTMLButtonElement>('#save-review-till')!.click();
    await fixture.whenStable();
    expect(navigate).not.toHaveBeenCalled();
    expect(fixture.componentInstance.handleBeforeUnload()).toBe(true);
    expect(fixture.componentInstance.canDeactivate()).toBe(true);
  });

  it('retains the draft when changing defendant fails', async () => {
    const { fixture, store, element } = render();
    vi.spyOn(TestBed.inject(Router), 'navigate').mockRejectedValue(new Error('Navigation failed'));
    element.querySelector<HTMLAnchorElement>('.govuk-summary-list__actions a')!.click();
    await fixture.whenStable();
    expect(store.criminalPayment()).toEqual(PAYMENT);
    expect(fixture.componentInstance.canDeactivate()).toBe(false);
  });

  for (const buttonId of ['save-review-till', 'save-add-payment']) {
    it.each([false, 'rejected'])(
      `restores the draft and permits a retry after ${buttonId} navigation fails: %s`,
      async (result) => {
        const { fixture, store, element, rows } = render();
        store.setDraftJourney('criminal');
        const tillId = store.ensureTill();
        store.addPayment(tillId, 'suspense');
        const existingTills = store.tills();
        const account = store.selectedCriminalAccount();
        const accountDetails = store.selectedCriminalAccountAtAGlance();
        const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
        if (result === false) navigate.mockResolvedValueOnce(false);
        else navigate.mockRejectedValueOnce(new Error('Navigation failed'));
        element.querySelector<HTMLButtonElement>(`#${buttonId}`)!.click();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(store.tills()).toEqual(existingTills);
        expect(store.criminalPayment()).toEqual(PAYMENT);
        expect(store.draftJourney()).toBe('criminal');
        expect(store.selectedCriminalAccount()).toEqual(account);
        expect(store.selectedCriminalAccountAtAGlance()).toEqual(accountDetails);
        expect(rows()['Amount']).toBe('£75.00');
        expect(element.querySelector('[role="alert"]')?.textContent).toContain(
          'The payment could not be saved. Try again.',
        );
        expect(fixture.componentInstance.canDeactivate()).toBe(false);
        expect(fixture.componentInstance.handleBeforeUnload()).toBe(false);
        for (const button of element.querySelectorAll<HTMLButtonElement>('.govuk-button'))
          expect(button.disabled).toBe(false);
        navigate.mockResolvedValueOnce(true);
        element.querySelector<HTMLButtonElement>(`#${buttonId}`)!.click();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(store.tills()[0].payments).toHaveLength(2);
        expect(store.tills()[0].payments[0]).toEqual(existingTills[0].payments[0]);
        expect(store.tills()[0].payments[1].criminalPayment).toEqual(PAYMENT);
        expect(store.criminalPayment()).toBeNull();
        expect(element.querySelector('[role="alert"]')).toBeNull();
      },
    );
  }

  it('ignores Change and Cancel while a save navigation is pending', async () => {
    const { fixture, element } = render();
    let finish!: (value: boolean) => void;
    const navigate = vi
      .spyOn(TestBed.inject(Router), 'navigate')
      .mockReturnValue(new Promise<boolean>((resolve) => (finish = resolve)));
    element.querySelector<HTMLButtonElement>('#save-review-till')!.click();
    element.querySelector<HTMLAnchorElement>('.govuk-summary-list__actions a')!.click();
    element.querySelector<HTMLAnchorElement>('#cancel-criminal-payment')!.click();
    expect(navigate).toHaveBeenCalledOnce();
    finish(true);
    await fixture.whenStable();
  });
  it('registers browser unload protection for the payment draft and releases it when empty', () => {
    const { fixture, store } = render();
    const blocked = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(blocked);
    expect(blocked.defaultPrevented).toBe(true);
    store.setCriminalPayment(null);
    fixture.detectChanges();
    const allowed = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(allowed);
    expect(allowed.defaultPrevented).toBe(false);
  });
  it('preserves the draft when returning to the real Payment Details screen', async () => {
    const tillRoot = 'fines/manual-cash-input/create/till';
    const checkRoute = routing
      .find((route) => route.path === 'create')!
      .children!.find((route) => route.path === 'till')!
      .children!.find((route) => route.path === 'check-payment')!;
    const { FinesMciPaymentCategoryCriminalPaymentDetailsComponent } =
      await import('../fines-mci-payment-category-criminal-payment-details/fines-mci-payment-category-criminal-payment-details.component');
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { ...checkRoute, path: `${tillRoot}/check-payment`, canActivate: [], resolve: {} },
          {
            path: `${tillRoot}/payment/category/criminal/payment-details/:accountId`,
            component: FinesMciPaymentCategoryCriminalPaymentDetailsComponent,
          },
        ]),
      ],
    });
    const { store, fixture } = render();
    fixture.destroy();
    const harness = await RouterTestingHarness.create(`/${tillRoot}/check-payment`);
    const confirm = vi.spyOn(window, 'confirm');
    harness.routeNativeElement!.querySelectorAll<HTMLAnchorElement>('.govuk-summary-list__actions a')[1].click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(store.criminalPayment()).toEqual(PAYMENT);
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#amount')!.value).toBe(PAYMENT.amount);
    expect(confirm).not.toHaveBeenCalled();
  });

  it.each(['cancelled', 'rejected'])('preserves the draft when an unrelated departure is %s', async (result) => {
    const tillRoot = 'fines/manual-cash-input/create/till';
    const checkRoute = routing
      .find((route) => route.path === 'create')!
      .children!.find((route) => route.path === 'till')!
      .children!.find((route) => route.path === 'check-payment')!;
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { ...checkRoute, path: `${tillRoot}/check-payment`, canActivate: [], resolve: {} },
          {
            path: 'elsewhere',
            component: DestinationComponent,
            canActivate: [
              () => {
                if (result === 'rejected') throw new Error('Navigation failed');
                return false;
              },
            ],
          },
        ]),
      ],
    });
    const { store, fixture } = render();
    fixture.destroy();
    const harness = await RouterTestingHarness.create(`/${tillRoot}/check-payment`);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    await TestBed.inject(Router)
      .navigateByUrl('/elsewhere')
      .catch(() => false);
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe(`/${tillRoot}/check-payment`);
    expect(store.criminalPayment()).toEqual(PAYMENT);
  });
  it.each(['cancelled', 'rejected'])('does not discard the draft after teardown if navigation is %s', (result) => {
    const { fixture, store } = render();
    const router = TestBed.inject(Router);
    const events = new Subject<NavigationEnd | NavigationCancel | NavigationError>();
    vi.spyOn(router, 'events', 'get').mockReturnValue(events.asObservable());
    vi.spyOn(router, 'currentNavigation').mockReturnValue({ id: 123 } as Navigation);
    fixture.destroy();
    events.next(new NavigationEnd(999, '/elsewhere', '/elsewhere'));
    expect(store.criminalPayment()).toEqual(PAYMENT);
    events.next(
      result === 'cancelled'
        ? new NavigationCancel(123, '/elsewhere', 'cancelled')
        : new NavigationError(123, '/elsewhere', new Error('Navigation failed')),
    );
    expect(store.criminalPayment()).toEqual(PAYMENT);
  });

  it('clears an abandoned draft even when the selected account has already been cleared', () => {
    const { fixture, store } = render();
    store.setSelectedCriminalAccount(null);
    store.setCriminalPayment(PAYMENT);
    const router = TestBed.inject(Router);
    const events = new Subject<NavigationEnd>();
    vi.spyOn(router, 'events', 'get').mockReturnValue(events.asObservable());
    vi.spyOn(router, 'currentNavigation').mockReturnValue({ id: 123 } as Navigation);
    fixture.destroy();
    events.next(new NavigationEnd(123, '/elsewhere', '/elsewhere'));
    expect(store.criminalPayment()).toBeNull();
  });
});
