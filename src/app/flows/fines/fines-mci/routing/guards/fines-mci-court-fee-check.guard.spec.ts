import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { finesMciCourtFeeCheckGuard } from './fines-mci-court-fee-check.guard';

describe('finesMciCourtFeeCheckGuard', () => {
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

  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([]), FinesMciStore] }));

  it('allows the check screen when both drafts are present', () => {
    const store = TestBed.inject(FinesMciStore);
    store.setCourtFeeDraft({ courtFeeId: 1, amountPaid: '25', numberOfItems: '2' });
    store.setCourtFeePaymentDetails(details);
    expect(TestBed.runInInjectionContext(() => finesMciCourtFeeCheckGuard({} as never, {} as never))).toBe(true);
  });

  it.each(['fee', 'payment'])('redirects to Court Fee Details when the %s draft is missing', (missing) => {
    const store = TestBed.inject(FinesMciStore);
    if (missing === 'payment') store.setCourtFeeDraft({ courtFeeId: 1, amountPaid: '25', numberOfItems: '2' });
    else store.setCourtFeePaymentDetails(details);
    const result = TestBed.runInInjectionContext(() => finesMciCourtFeeCheckGuard({} as never, {} as never));
    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe(
      '/fines/manual-cash-input/create/till/court-fee-details',
    );
  });
});
