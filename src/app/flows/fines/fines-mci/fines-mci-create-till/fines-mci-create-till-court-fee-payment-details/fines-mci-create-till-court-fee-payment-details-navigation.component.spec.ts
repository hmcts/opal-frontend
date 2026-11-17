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
      expect(harness.routeNativeElement?.textContent).toContain('Check court fee');
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
