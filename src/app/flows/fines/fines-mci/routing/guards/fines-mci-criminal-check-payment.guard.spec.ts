import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, RouterStateSnapshot, UrlTree } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { finesMciCriminalCheckPaymentGuard } from './fines-mci-criminal-check-payment.guard';

const ROOT = '/fines/manual-cash-input/create/till/payment/category/criminal';

describe('finesMciCriminalCheckPaymentGuard', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  function run() {
    return TestBed.runInInjectionContext(() =>
      finesMciCriminalCheckPaymentGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );
  }

  function setAccount() {
    TestBed.inject(FinesMciStore).setSelectedCriminalAccount(
      OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0],
    );
  }

  function setPayment() {
    TestBed.inject(FinesMciStore).setCriminalPayment({
      amount: '25.00',
      payerType: 'defendant',
      thirdPartyName: '',
      methodOfPayment: 'notesCoins',
      paymentReferencePostalOrder: '',
      paymentReferenceCheque: '',
      paymentReferenceCreditTransfer: '',
      source: null,
    });
  }

  it('allows a saved payment with a selected account', () => {
    setAccount();
    setPayment();
    expect(run()).toBe(true);
  });

  it('redirects to payment details when the account exists but the payment is missing', () => {
    setAccount();
    const accountId = TestBed.inject(FinesMciStore).selectedCriminalAccount()!.defendant_account_id;
    expect((run() as UrlTree).toString()).toBe(`${ROOT}/payment-details/${accountId}`);
  });

  it('redirects to account search when there is no selected account or payment', () => {
    expect((run() as UrlTree).toString()).toBe(`${ROOT}/search`);
  });

  it('redirects to account search when a payment exists without a selected account', () => {
    setPayment();
    expect((run() as UrlTree).toString()).toBe(`${ROOT}/search`);
  });
});
