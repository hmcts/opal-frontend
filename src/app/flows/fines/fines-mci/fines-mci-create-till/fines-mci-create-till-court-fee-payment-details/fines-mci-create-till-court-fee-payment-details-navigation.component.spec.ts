import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { provideLocationMocks, SpyLocation } from '@angular/common/testing';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, provideRouter, ResolveStart, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { filter, firstValueFrom, of, Subject, take } from 'rxjs';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FinesMciCreateTillCourtFeePaymentDetailsComponent } from './fines-mci-create-till-court-fee-payment-details.component';
import { FinesMciCreateTillCourtFeeCheckComponent } from '../fines-mci-create-till-court-fee-check/fines-mci-create-till-court-fee-check.component';
import { FinesMciCreateTillCourtFeeDetailsComponent } from '../fines-mci-create-till-court-fee-details/fines-mci-create-till-court-fee-details.component';
import { FinesMciCreateTillPaymentCategoryComponent } from '../fines-mci-create-till-payment-category/fines-mci-create-till-payment-category.component';
import { FinesMciCreateTillOverUnderpaymentConfirmationComponent } from '../fines-mci-create-till-over-underpayment-confirmation/fines-mci-create-till-over-underpayment-confirmation.component';
import { FinesMciCreateTillDetailsComponent } from '../fines-mci-create-till-details/fines-mci-create-till-details.component';
import { finesMciCourtFeeCheckGuard } from '../../routing/guards/fines-mci-court-fee-check.guard';
import { finesMciCourtFeeDraftGuard } from '../../routing/guards/fines-mci-court-fee-draft.guard';
import { FinesMciPaymentMappingsService } from '../../services/fines-mci-payment-mappings.service';
import { finesMciPaymentMappingsResolver } from '../../routing/resolvers/fines-mci-payment-mappings.resolver';

@Component({ template: 'Previous screen' })
class PreviousScreenComponent {}

describe('Court fee payment details navigation', () => {
  const paymentUrl = '/till/court-fee-payment-details';
  const mappings = {
    methods: [{ code: 'NC', display_name: 'Notes and coins' }],
    sources: [{ code: 'ALLPAY', display_name: 'allpay' }],
  };
  const draft = { courtFeeId: 1, amountPaid: '25.00', numberOfItems: '2' };
  const loadMappings = vi.fn();

  beforeEach(() => {
    loadMappings.mockReset().mockReturnValue(of(mappings));
    TestBed.configureTestingModule({
      providers: [
        FinesMciStore,
        provideLocationMocks(),
        { provide: FinesMciPaymentMappingsService, useValue: { load: loadMappings } },
        provideRouter([
          {
            path: 'till',
            children: [
              { path: 'court-fee-details', component: PreviousScreenComponent },
              { path: 'over-underpayment-confirmation', component: PreviousScreenComponent },
              { path: 'details', component: PreviousScreenComponent },
              { path: 'payment-category', component: PreviousScreenComponent },
              {
                path: 'check-court-fee',
                component: FinesMciCreateTillCourtFeeCheckComponent,
                canActivate: [finesMciCourtFeeCheckGuard],
                canDeactivate: [canDeactivateGuard],
              },
              {
                path: 'court-fee-payment-details',
                component: FinesMciCreateTillCourtFeePaymentDetailsComponent,
                canActivate: [finesMciCourtFeeDraftGuard],
                canDeactivate: [canDeactivateGuard],
                data: { paymentMappings: mappings },
              },
            ],
          },
          { path: 'fines/manual-cash-input/create/till/court-fee-details', component: PreviousScreenComponent },
        ]),
      ],
    });
    const store = TestBed.inject(FinesMciStore);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.ensureTill();
    store.setDraftJourney('courtFee');
    store.setCourtFeeDraft(draft);
  });

  afterEach(() => vi.restoreAllMocks());

  it.each([
    ['37.50', '3', false],
    ['30.00', '2', true],
  ])(
    'retains saved payment details after editing the amount to %s',
    async (changedAmount, changedItems, overpayment) => {
      const router = TestBed.inject(Router);
      const routes = router.config[0].children!;
      const tillRoute = routes.find((route) => route.path === 'details')!;
      tillRoute.component = FinesMciCreateTillDetailsComponent;
      tillRoute.canDeactivate = [canDeactivateGuard];
      const feeRoute = routes.find((route) => route.path === 'court-fee-details')!;
      feeRoute.component = FinesMciCreateTillCourtFeeDetailsComponent;
      feeRoute.canDeactivate = [canDeactivateGuard];
      feeRoute.data = {
        courtFees: { court_fees: [{ court_fee_id: 1, court_fee_code: 'C01', description: 'Court fee', amount: 12.5 }] },
      };
      const confirmationRoute = routes.find((route) => route.path === 'over-underpayment-confirmation')!;
      confirmationRoute.component = FinesMciCreateTillOverUnderpaymentConfirmationComponent;
      confirmationRoute.canDeactivate = [canDeactivateGuard];
      confirmationRoute.data = feeRoute.data;
      routes.find((route) => route.path === 'check-court-fee')!.data = {
        courtFees: { court_fees: [{ court_fee_id: 1, court_fee_code: 'C01', description: 'Court fee', amount: 12.5 }] },
        paymentMappings: mappings,
      };
      router.resetConfig([{ path: 'fines/manual-cash-input/create/till', children: routes }]);
      const store = TestBed.inject(FinesMciStore);
      const tillId = store.tills()[0].tillId;
      const payment = {
        courtFeeId: 1,
        amountPaid: '25.00',
        numberOfItems: '2',
        courtFeeLabel: 'C01 – Court fee (£12.50)',
        amountLabel: '£25.00',
        paymentDetails: {
          paymentReceivedFrom: 'applicant',
          paymentMethod: 'NC',
          payerType: 'company',
          companyName: 'Example Ltd',
          addressLine1: null,
          addressLine2: null,
          addressLine3: null,
          postcode: null,
        },
        suspenseNote: 'Original note',
      };
      store.saveCourtFeePayment(tillId, payment);
      const paymentId = store.tills()[0].payments[0].paymentId;
      const confirm = vi.spyOn(window, 'confirm');
      const harness = await RouterTestingHarness.create('/fines/manual-cash-input/create/till/details');
      harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.govuk-summary-list__actions a')!.click();
      await harness.fixture.whenStable();
      harness.detectChanges();
      expect(router.url).toBe('/fines/manual-cash-input/create/till/check-court-fee');
      expect(confirm).not.toHaveBeenCalled();
      expect(harness.routeNativeElement!.querySelector<HTMLTextAreaElement>('#suspenseNote')?.value).toBe(
        'Original note',
      );
      const amountRow = Array.from(harness.routeNativeElement!.querySelectorAll('.govuk-summary-list__row')).find(
        (row) => row.querySelector('dt')?.textContent?.trim() === 'Amount',
      )!;
      amountRow.querySelector<HTMLAnchorElement>('a')!.click();
      await harness.fixture.whenStable();
      harness.detectChanges();
      const amount = harness.routeNativeElement!.querySelector<HTMLInputElement>('#amountPaid')!;
      amount.value = changedAmount;
      amount.dispatchEvent(new Event('input', { bubbles: true }));
      const items = harness.routeNativeElement!.querySelector<HTMLInputElement>('#numberOfItems')!;
      items.value = changedItems;
      items.dispatchEvent(new Event('input', { bubbles: true }));
      harness.routeNativeElement!.querySelector<HTMLButtonElement>('#submitForm')!.click();
      await harness.fixture.whenStable();
      harness.detectChanges();
      if (overpayment) {
        expect(router.url).toBe('/fines/manual-cash-input/create/till/over-underpayment-confirmation');
        harness.routeNativeElement!.querySelector<HTMLButtonElement>('#confirm-overpayment')!.click();
        await harness.fixture.whenStable();
        harness.detectChanges();
      }
      expect(router.url).toBe('/fines/manual-cash-input/create/till/court-fee-payment-details');
      expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('input[value="applicant"]')?.checked).toBe(
        true,
      );
      expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#companyName')?.value).toBe('Example Ltd');
      expect(store.courtFeePaymentDetails()).toEqual(payment.paymentDetails);
      harness
        .routeNativeElement!.querySelector('form')!
        .dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
      await harness.fixture.whenStable();
      harness.detectChanges();
      expect(router.url).toBe('/fines/manual-cash-input/create/till/check-court-fee');
      const note = harness.routeNativeElement!.querySelector<HTMLTextAreaElement>('#suspenseNote')!;
      note.value = 'Updated note';
      note.dispatchEvent(new Event('input', { bubbles: true }));
      expect(store.tills()[0].payments[0].courtFee?.suspenseNote).toBe('Original note');
      harness.routeNativeElement!.querySelector<HTMLButtonElement>('#save-and-review-till')!.click();
      await harness.fixture.whenStable();
      expect(router.url).toBe('/fines/manual-cash-input/create/till/details');
      expect(store.tills()[0].payments).toHaveLength(1);
      expect(store.tills()[0].payments[0].paymentId).toBe(paymentId);
      expect(store.tills()[0].payments[0].courtFee?.suspenseNote).toBe('Updated note');
      expect(store.tills()[0].payments[0].courtFee?.amountPaid).toBe(changedAmount);
      expect(store.tills()[0].payments[0].courtFee?.numberOfItems).toBe(changedItems);
    },
  );

  it('keeps the original saved payment when an edit is cancelled', async () => {
    const router = TestBed.inject(Router);
    router.config[0].children!.find((route) => route.path === 'check-court-fee')!.data = {
      courtFees: { court_fees: [{ court_fee_id: 1, court_fee_code: 'C01', description: 'Court fee', amount: 12.5 }] },
      paymentMappings: mappings,
    };
    const store = TestBed.inject(FinesMciStore);
    const tillId = store.tills()[0].tillId;
    const payment = {
      courtFeeId: 1,
      amountPaid: '25.00',
      numberOfItems: '2',
      courtFeeLabel: 'C01 – Court fee (£12.50)',
      amountLabel: '£25.00',
      paymentDetails: {
        paymentReceivedFrom: 'applicant',
        paymentMethod: 'NC',
        payerType: 'company',
        companyName: 'Example Ltd',
        addressLine1: null,
        addressLine2: null,
        addressLine3: null,
        postcode: null,
      },
      suspenseNote: 'Original note',
    };
    store.saveCourtFeePayment(tillId, payment);
    const paymentId = store.tills()[0].payments[0].paymentId;
    store.beginCourtFeePaymentEdit(tillId, paymentId);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const harness = await RouterTestingHarness.create('/till/check-court-fee');
    const note = harness.routeNativeElement!.querySelector<HTMLTextAreaElement>('#suspenseNote')!;
    note.value = 'Discarded edit';
    note.dispatchEvent(new Event('input', { bubbles: true }));
    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.button-link')!.click();
    await harness.fixture.whenStable();
    expect(router.url).toBe('/till/details');
    expect(store.tills()[0].payments).toEqual([{ paymentId, journey: 'courtFee', courtFee: payment }]);
    expect(store.editingCourtFeePaymentId()).toBeNull();
  });

  it('keeps the draft when Cancel is declined and discards it on confirmation', async () => {
    const router = TestBed.inject(Router);
    const checkRoute = router.config[0].children!.find((route) => route.path === 'check-court-fee')!;
    checkRoute.data = {
      courtFees: { court_fees: [{ court_fee_id: 1, court_fee_code: 'C01', description: 'Court fee', amount: 12.5 }] },
      paymentMappings: mappings,
    };
    const store = TestBed.inject(FinesMciStore);
    const tillId = store.tills()[0].tillId;
    store.addPayment(tillId, 'criminal');
    store.setDraftJourney('courtFee');
    const details = {
      paymentReceivedFrom: 'applicant',
      paymentMethod: 'NC',
      payerType: 'company',
      companyName: 'Example Ltd',
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      postcode: null,
    };
    store.setCourtFeePaymentDetails(details);
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const harness = await RouterTestingHarness.create('/till/check-court-fee');
    const note = harness.routeNativeElement!.querySelector<HTMLTextAreaElement>('#suspenseNote')!;
    note.value = 'Payment note';
    note.dispatchEvent(new Event('input', { bubbles: true }));
    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.button-link')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(confirm).toHaveBeenCalledOnce();
    expect(router.url).toBe('/till/check-court-fee');
    expect(store.courtFeeDraft()).toEqual(draft);
    expect(store.courtFeePaymentDetails()).toEqual(details);
    expect(harness.routeNativeElement!.querySelector<HTMLTextAreaElement>('#suspenseNote')?.value).toBe('Payment note');

    confirm.mockReturnValue(true);
    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.button-link')!.click();
    await harness.fixture.whenStable();
    expect(router.url).toBe('/till/details');
    expect(store.courtFeeDraft()).toBeNull();
    expect(store.courtFeePaymentDetails()).toBeNull();
    expect(store.courtFeeSuspenseNote()).toBe('');
    expect(store.tills()[0].payments).toHaveLength(1);
  });

  it('clears the draft after confirmed browser history navigation to the till', async () => {
    const router = TestBed.inject(Router);
    const store = TestBed.inject(FinesMciStore);
    store.setCourtFeePaymentDetails({
      paymentReceivedFrom: 'applicant',
      paymentMethod: 'NC',
      payerType: 'company',
      companyName: 'Example Ltd',
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      postcode: null,
    });
    store.setCourtFeeSuspenseNote('Payment note');
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const harness = await RouterTestingHarness.create('/till/details');
    router.setUpLocationChangeListener();
    await harness.navigateByUrl('/till/check-court-fee', FinesMciCreateTillCourtFeeCheckComponent);
    const navigated = firstValueFrom(
      router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
      ),
    );
    (TestBed.inject(Location) as SpyLocation).simulateUrlPop('/till/details');
    await navigated;
    expect(confirm).toHaveBeenCalledOnce();
    expect(store.courtFeeDraft()).toBeNull();
    expect(store.courtFeePaymentDetails()).toBeNull();
    expect(store.courtFeeSuspenseNote()).toBe('');
  });

  it.each([
    ['save-and-review-till', '/till/details'],
    ['save-and-add-payment', '/till/payment-category'],
  ])('saves the payment and navigates to %s', async (buttonId, destination) => {
    const router = TestBed.inject(Router);
    const checkRoute = router.config[0].children!.find((route) => route.path === 'check-court-fee')!;
    if (destination === '/till/payment-category') {
      router.config[0].children!.find((route) => route.path === 'payment-category')!.component =
        FinesMciCreateTillPaymentCategoryComponent;
    }
    checkRoute.data = {
      courtFees: { court_fees: [{ court_fee_id: 1, court_fee_code: 'C01', description: 'Court fee', amount: 12.5 }] },
      paymentMappings: mappings,
    };
    const store = TestBed.inject(FinesMciStore);
    const details = {
      paymentReceivedFrom: 'applicant',
      paymentMethod: 'NC',
      payerType: 'company',
      companyName: 'Example Ltd',
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      postcode: null,
    };
    store.setCourtFeePaymentDetails(details);
    const confirm = vi.spyOn(window, 'confirm');
    const harness = await RouterTestingHarness.create('/till/check-court-fee');
    const note = harness.routeNativeElement!.querySelector<HTMLTextAreaElement>('#suspenseNote')!;
    note.value = 'Payment note';
    note.dispatchEvent(new Event('input', { bubbles: true }));
    harness.routeNativeElement!.querySelector<HTMLButtonElement>(`#${buttonId}`)!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(router.url).toBe(destination);
    expect(confirm).not.toHaveBeenCalled();
    expect(store.tills()[0].payments).toEqual([
      expect.objectContaining({
        journey: 'courtFee',
        courtFee: expect.objectContaining({
          courtFeeId: 1,
          amountPaid: '25.00',
          numberOfItems: '2',
          paymentDetails: details,
          suspenseNote: 'Payment note',
        }),
      }),
    ]);
    expect(store.courtFeeDraft()).toBeNull();
    expect(store.courtFeePaymentDetails()).toBeNull();
    expect(store.courtFeeSuspenseNote()).toBe('');
    if (destination === '/till/payment-category') {
      expect(
        (harness.routeDebugElement!.componentInstance as FinesMciCreateTillPaymentCategoryComponent)
          .stateUnsavedChanges,
      ).toBe(false);
    }
  });

  it('retains payment details when a user changes the court fee from the check screen', async () => {
    const router = TestBed.inject(Router);
    const routes = router.config[0].children!;
    const feeRoute = routes.find((route) => route.path === 'court-fee-details')!;
    const checkRoute = routes.find((route) => route.path === 'check-court-fee')!;
    const courtFees = {
      court_fees: [{ court_fee_id: 1, court_fee_code: 'C01', description: 'Court fee', amount: 12.5 }],
    };
    feeRoute.component = FinesMciCreateTillCourtFeeDetailsComponent;
    feeRoute.canDeactivate = [canDeactivateGuard];
    feeRoute.data = { courtFees };
    checkRoute.data = { courtFees, paymentMappings: mappings };
    const store = TestBed.inject(FinesMciStore);
    const details = {
      paymentReceivedFrom: 'applicant',
      paymentMethod: 'NC',
      payerType: 'company',
      companyName: 'Example Ltd',
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      postcode: null,
    };
    store.setCourtFeePaymentDetails(details);
    const confirm = vi.spyOn(window, 'confirm');
    const harness = await RouterTestingHarness.create('/till/check-court-fee');
    const note = harness.routeNativeElement!.querySelector<HTMLTextAreaElement>('#suspenseNote')!;
    note.value = 'Payment note';
    note.dispatchEvent(new Event('input', { bubbles: true }));
    const amountRow = Array.from(harness.routeNativeElement!.querySelectorAll('.govuk-summary-list__row')).find(
      (row) => row.querySelector('dt')?.textContent?.trim() === 'Amount',
    )!;
    amountRow.querySelector<HTMLAnchorElement>('a')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(router.url).toBe('/till/court-fee-details');
    expect(confirm).not.toHaveBeenCalled();
    expect(store.courtFeePaymentDetails()).toEqual(details);
    expect(store.courtFeeSuspenseNote()).toBe('Payment note');
    const feeComponent = harness.routeDebugElement!.componentInstance as FinesMciCreateTillCourtFeeDetailsComponent;
    feeComponent.handleSubmit({
      formData: { courtFeeId: 1, amountPaid: '37.50', numberOfItems: '3' },
      nestedFlow: false,
    });
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(router.url).toBe(paymentUrl);
    expect(store.courtFeePaymentDetails()).toEqual(details);
    expect(store.courtFeeSuspenseNote()).toBe('Payment note');
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#companyName')?.value).toBe('Example Ltd');
    harness
      .routeNativeElement!.querySelector('form')!
      .dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(router.url).toBe('/till/check-court-fee');
    expect(harness.routeNativeElement!.querySelector<HTMLTextAreaElement>('#suspenseNote')?.value).toBe('Payment note');
  });

  it.each(['/till/court-fee-details', '/till/over-underpayment-confirmation'])(
    'returns to %s without warning when no payment details were entered',
    async (previousUrl) => {
      const confirm = vi.spyOn(window, 'confirm');
      const harness = await RouterTestingHarness.create(previousUrl);
      await harness.navigateByUrl(paymentUrl, FinesMciCreateTillCourtFeePaymentDetailsComponent);

      harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.govuk-back-link')!.click();
      await harness.fixture.whenStable();

      expect(TestBed.inject(Router).url).toBe(previousUrl);
      expect(confirm).not.toHaveBeenCalled();
      expect(TestBed.inject(FinesMciStore).courtFeeDraft()).toEqual(draft);
    },
  );

  it.each(['/till/court-fee-details', '/till/over-underpayment-confirmation'])(
    'keeps entries when Back is declined and returns to %s when accepted',
    async (previousUrl) => {
      const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const harness = await RouterTestingHarness.create(previousUrl);
      await harness.navigateByUrl(paymentUrl, FinesMciCreateTillCourtFeePaymentDetailsComponent);
      harness.routeNativeElement!.querySelector<HTMLInputElement>('input[value="applicant"]')!.click();

      harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.govuk-back-link')!.click();
      await harness.fixture.whenStable();
      expect(confirm).toHaveBeenCalledOnce();
      expect(TestBed.inject(Router).url).toBe(paymentUrl);
      expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('input[value="applicant"]')!.checked).toBe(
        true,
      );
      expect(TestBed.inject(FinesMciStore).courtFeeDraft()).toEqual(draft);

      confirm.mockReturnValue(true);
      harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.govuk-back-link')!.click();
      await harness.fixture.whenStable();
      expect(TestBed.inject(Router).url).toBe(previousUrl);
      expect(TestBed.inject(FinesMciStore).courtFeeDraft()).toEqual(draft);
    },
  );

  it('retains the draft when Cancel is declined and clears it only after returning to the till', async () => {
    const store = TestBed.inject(FinesMciStore);
    const tillId = store.tills()[0].tillId;
    store.addPayment(tillId, 'criminal');
    store.setDraftJourney('courtFee');
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const harness = await RouterTestingHarness.create('/till/court-fee-details');
    await harness.navigateByUrl(paymentUrl, FinesMciCreateTillCourtFeePaymentDetailsComponent);
    harness.routeNativeElement!.querySelector<HTMLInputElement>('input[value="applicant"]')!.click();

    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.button-link')!.click();
    await harness.fixture.whenStable();
    expect(confirm).toHaveBeenCalledOnce();
    expect(TestBed.inject(Router).url).toBe(paymentUrl);
    expect(store.courtFeeDraft()).toEqual(draft);
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('input[value="applicant"]')!.checked).toBe(true);

    confirm.mockReturnValue(true);
    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.button-link')!.click();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/till/details');
    expect(store.courtFeeDraft()).toBeNull();
    expect(store.draftJourney()).toBeNull();
    expect(store.tills()[0].payments).toHaveLength(1);
  });

  it('redirects a browser history navigation to payment details after Cancel clears the draft', async () => {
    const harness = await RouterTestingHarness.create('/till/court-fee-details');
    await harness.navigateByUrl(paymentUrl, FinesMciCreateTillCourtFeePaymentDetailsComponent);
    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.button-link')!.click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(FinesMciStore).courtFeeDraft()).toBeNull();
    expect(TestBed.inject(Router).url).toBe('/till/details');

    const router = TestBed.inject(Router);
    router.setUpLocationChangeListener();
    const redirected = firstValueFrom(
      router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
      ),
    );
    (TestBed.inject(Location) as SpyLocation).simulateUrlPop(paymentUrl);
    await redirected;
    harness.detectChanges();

    expect(router.url).toBe('/fines/manual-cash-input/create/till/court-fee-details');
    expect(harness.routeNativeElement?.textContent).toContain('Previous screen');
  });

  it.each(['/till/court-fee-details', '/till/over-underpayment-confirmation'])(
    'saves validated details and restores them after returning from the check screen for %s',
    async (previousUrl) => {
      const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const store = TestBed.inject(FinesMciStore);
      const harness = await RouterTestingHarness.create(previousUrl);
      await harness.navigateByUrl(paymentUrl, FinesMciCreateTillCourtFeePaymentDetailsComponent);
      const page = harness.routeNativeElement!;
      page.querySelector<HTMLInputElement>('input[value="applicant"]')!.click();
      page.querySelector<HTMLInputElement>('input[value="NC"]')!.click();
      page.querySelector<HTMLInputElement>('input[value="company"]')!.click();
      harness.detectChanges();
      const companyName = page.querySelector<HTMLInputElement>('#companyName')!;
      companyName.value = 'Example Ltd';
      companyName.dispatchEvent(new Event('input', { bubbles: true }));
      const postcode = page.querySelector<HTMLInputElement>('#postcode')!;
      postcode.value = 'SW1A 1AA';
      postcode.dispatchEvent(new Event('input', { bubbles: true }));
      page.querySelector('form')!.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
      await harness.fixture.whenStable();
      harness.detectChanges();

      expect(TestBed.inject(Router).url).toBe('/till/check-court-fee');
      expect(harness.routeNativeElement?.textContent).toContain('Check payment');
      expect(confirm).not.toHaveBeenCalled();
      expect(store.courtFeeDraft()).toEqual(draft);
      expect(store.courtFeePaymentDetails()).toMatchObject({
        paymentReceivedFrom: 'applicant',
        paymentMethod: 'NC',
        payerType: 'company',
        companyName: 'Example Ltd',
        postcode: 'SW1A 1AA',
      });

      harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.govuk-back-link')!.click();
      await harness.fixture.whenStable();
      harness.detectChanges();
      expect(TestBed.inject(Router).url).toBe(paymentUrl);
      expect(confirm).not.toHaveBeenCalled();
      expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#companyName')?.value).toBe('Example Ltd');
      expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#postcode')?.value).toBe('SW1A 1AA');

      harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.govuk-back-link')!.click();
      await harness.fixture.whenStable();
      expect(confirm).toHaveBeenCalledOnce();
      expect(TestBed.inject(Router).url).toBe(previousUrl);
      expect(store.courtFeePaymentDetails()).toBeNull();
      expect(store.courtFeeDraft()).toEqual(draft);
    },
  );

  it('does not navigate or save details when the form is invalid', async () => {
    const harness = await RouterTestingHarness.create('/till/court-fee-details');
    await harness.navigateByUrl(paymentUrl, FinesMciCreateTillCourtFeePaymentDetailsComponent);
    harness
      .routeNativeElement!.querySelector('form')!
      .dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe(paymentUrl);
    expect(TestBed.inject(FinesMciStore).courtFeePaymentDetails()).toBeNull();
  });

  it('clears saved payment details after browser Back reaches court fee details', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const store = TestBed.inject(FinesMciStore);
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location) as SpyLocation;
    const harness = await RouterTestingHarness.create('/till/court-fee-details');
    router.setUpLocationChangeListener();
    await harness.navigateByUrl(paymentUrl, FinesMciCreateTillCourtFeePaymentDetailsComponent);
    const page = harness.routeNativeElement!;
    page.querySelector<HTMLInputElement>('input[value="applicant"]')!.click();
    page.querySelector<HTMLInputElement>('input[value="NC"]')!.click();
    page.querySelector<HTMLInputElement>('input[value="company"]')!.click();
    harness.detectChanges();
    const company = page.querySelector<HTMLInputElement>('#companyName')!;
    company.value = 'Example Ltd';
    company.dispatchEvent(new Event('input', { bubbles: true }));
    page.querySelector('form')!.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    await harness.fixture.whenStable();
    expect(router.url).toBe('/till/check-court-fee');

    const backToPayment = firstValueFrom(
      router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
      ),
    );
    location.simulateUrlPop(paymentUrl);
    await backToPayment;
    harness.detectChanges();
    expect(store.courtFeePaymentDetails()?.companyName).toBe('Example Ltd');

    confirm.mockReturnValueOnce(false);
    expect(await router.navigateByUrl('/till/court-fee-details')).toBe(false);
    expect(store.courtFeePaymentDetails()?.companyName).toBe('Example Ltd');

    const backToFee = firstValueFrom(
      router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
      ),
    );
    location.simulateUrlPop('/till/court-fee-details');
    await backToFee;
    expect(confirm).toHaveBeenCalled();
    expect(router.url).toBe('/till/court-fee-details');
    expect(store.courtFeePaymentDetails()).toBeNull();
    expect(store.courtFeeDraft()).toEqual(draft);
  });

  it('retries failed mappings when returning from check and restores the saved form', async () => {
    const router = TestBed.inject(Router);
    const paymentRoute = router.config[0].children!.find((route) => route.path === 'court-fee-payment-details')!;
    paymentRoute.resolve = { paymentMappings: finesMciPaymentMappingsResolver };
    loadMappings.mockReturnValueOnce(of(null)).mockReturnValueOnce(of(mappings));
    const store = TestBed.inject(FinesMciStore);
    const details = {
      paymentReceivedFrom: 'applicant',
      paymentMethod: 'NC',
      payerType: 'company',
      companyName: 'Example Ltd',
      addressLine1: '12 Example Street',
      addressLine2: null,
      addressLine3: null,
      postcode: 'SW1A 1AA',
    };
    store.setCourtFeePaymentOrigin('over-underpayment-confirmation');
    store.setCourtFeePaymentDetails(details);
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const harness = await RouterTestingHarness.create('/till/court-fee-details');
    await harness.navigateByUrl('/till/check-court-fee', FinesMciCreateTillCourtFeeCheckComponent);

    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.govuk-back-link')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(router.url).toBe(paymentUrl);
    expect(harness.routeNativeElement!.querySelector('[role="alert"]')?.textContent).toContain(
      'Payment options could not be loaded',
    );
    expect(store.courtFeePaymentDetails()).toEqual(details);

    harness.routeNativeElement!.querySelector<HTMLButtonElement>('#retry-payment-options')!.click();
    harness.detectChanges();
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#companyName')?.value).toBe('Example Ltd');
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#addressLine1')?.value).toBe(
      '12 Example Street',
    );
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#postcode')?.value).toBe('SW1A 1AA');
    expect(store.courtFeePaymentDetails()).toEqual(details);
    expect(confirm).not.toHaveBeenCalled();
  });

  it('protects saved details if another navigation interrupts a pending Continue', async () => {
    const router = TestBed.inject(Router);
    const gate = new Subject<boolean>();
    const check = router.config[0].children!.find((route) => route.path === 'check-court-fee')!;
    check.resolve = { waiting: () => gate.asObservable() };
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const harness = await RouterTestingHarness.create('/till/court-fee-details');
    await harness.navigateByUrl(paymentUrl, FinesMciCreateTillCourtFeePaymentDetailsComponent);
    const page = harness.routeNativeElement!;
    page.querySelector<HTMLInputElement>('input[value="applicant"]')!.click();
    page.querySelector<HTMLInputElement>('input[value="NC"]')!.click();
    page.querySelector<HTMLInputElement>('input[value="company"]')!.click();
    harness.detectChanges();
    const companyName = page.querySelector<HTMLInputElement>('#companyName')!;
    companyName.value = 'Example Ltd';
    companyName.dispatchEvent(new Event('input', { bubbles: true }));
    const resolveStarted = firstValueFrom(
      router.events.pipe(
        filter((event) => event instanceof ResolveStart),
        take(1),
      ),
    );
    page.querySelector('form')!.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    await resolveStarted;
    harness.detectChanges();
    expect(page.textContent).toContain('Loading next screen');
    expect(confirm).not.toHaveBeenCalled();

    expect(await router.navigateByUrl('/till/details')).toBe(false);
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(confirm).toHaveBeenCalledOnce();
    expect(router.url).toBe(paymentUrl);
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#companyName')?.value).toBe('Example Ltd');
    expect(TestBed.inject(FinesMciStore).courtFeePaymentDetails()?.companyName).toBe('Example Ltd');
    gate.complete();
  });

  it('protects the till if another navigation interrupts Back from the check screen', async () => {
    const router = TestBed.inject(Router);
    const store = TestBed.inject(FinesMciStore);
    store.setCourtFeePaymentDetails({
      paymentReceivedFrom: 'applicant',
      paymentMethod: 'NC',
      payerType: 'company',
      companyName: 'Example Ltd',
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      postcode: null,
    });
    const gate = new Subject<boolean>();
    const payment = router.config[0].children!.find((route) => route.path === 'court-fee-payment-details')!;
    payment.resolve = { waiting: () => gate.asObservable() };
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const harness = await RouterTestingHarness.create('/till/court-fee-details');
    await harness.navigateByUrl('/till/check-court-fee', FinesMciCreateTillCourtFeeCheckComponent);
    const resolveStarted = firstValueFrom(
      router.events.pipe(
        filter((event) => event instanceof ResolveStart),
        take(1),
      ),
    );
    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.govuk-back-link')!.click();
    await resolveStarted;
    expect(confirm).not.toHaveBeenCalled();

    expect(await router.navigateByUrl('/till/details')).toBe(false);
    await harness.fixture.whenStable();
    expect(confirm).toHaveBeenCalledOnce();
    expect(router.url).toBe('/till/check-court-fee');
    expect(store.courtFeePaymentDetails()?.companyName).toBe('Example Ltd');
    gate.complete();
  });
});
