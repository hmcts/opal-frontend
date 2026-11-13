import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FinesMciCreateTillCourtFeePaymentDetailsComponent } from './fines-mci-create-till-court-fee-payment-details.component';

@Component({ template: 'Previous screen' })
class PreviousScreenComponent {}

describe('Court fee payment details navigation', () => {
  const paymentUrl = '/till/court-fee-payment-details';
  const mappings = {
    methods: [{ code: 'NC', display_name: 'Notes and coins' }],
    sources: [{ code: 'ALLPAY', display_name: 'allpay' }],
  };
  const draft = { courtFeeId: 1, amountPaid: '25.00', numberOfItems: '2' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FinesMciStore,
        provideRouter([
          {
            path: 'till',
            children: [
              { path: 'court-fee-details', component: PreviousScreenComponent },
              { path: 'over-underpayment-confirmation', component: PreviousScreenComponent },
              { path: 'details', component: PreviousScreenComponent },
              {
                path: 'court-fee-payment-details',
                component: FinesMciCreateTillCourtFeePaymentDetailsComponent,
                canDeactivate: [canDeactivateGuard],
                data: { paymentMappings: mappings },
              },
            ],
          },
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
});
