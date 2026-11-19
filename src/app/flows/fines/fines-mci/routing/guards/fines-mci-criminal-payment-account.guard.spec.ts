import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  convertToParamMap,
  provideRouter,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../../../fines-acc/fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { finesMciCriminalPaymentAccountGuard } from './fines-mci-criminal-payment-account.guard';

describe('finesMciCriminalPaymentAccountGuard', () => {
  let store: InstanceType<typeof FinesMciStore>;
  const account = OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0];
  const root = '/fines/manual-cash-input/create/till/payment/category/criminal';
  function run(accountId = String(account.defendant_account_id)) {
    return TestBed.runInInjectionContext(() =>
      finesMciCriminalPaymentAccountGuard(
        { paramMap: convertToParamMap({ accountId }) } as ActivatedRouteSnapshot,
        { url: `${root}/payment-details/${accountId}` } as RouterStateSnapshot,
      ),
    );
  }
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    store = TestBed.inject(FinesMciStore);
    store.setSelectedCriminalAccount(account);
    store.setSelectedCriminalAccountAtAGlance({
      ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
      account_balance: 100,
    });
  });
  it('allows the selected account with a known balance', () => expect(run()).toBe(true));
  it('accepts header balance when the at-a-glance balance is omitted', () => {
    store.setSelectedCriminalAccountAtAGlance({
      ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
      account_balance: undefined,
    });
    store.setSelectedCriminalAccountHeader(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
    expect(run()).toBe(true);
  });
  it('redirects mismatched account IDs to search', () =>
    expect((run('different-account') as UrlTree).toString()).toBe(`${root}/search`));
  it('redirects missing selections to search', () => {
    store.resetCriminalSearch();
    expect((run() as UrlTree).toString()).toBe(`${root}/search`);
  });
  it.each([undefined, NaN, Infinity])('redirects unavailable or invalid balance %s to search', (account_balance) => {
    store.setSelectedCriminalAccountAtAGlance({ ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, account_balance });
    expect((run() as UrlTree).toString()).toBe(`${root}/search`);
  });
});
