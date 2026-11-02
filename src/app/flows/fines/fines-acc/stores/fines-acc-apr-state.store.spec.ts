import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FINES_ACC_APR_DUPLICATE_MESSAGE } from '../fines-acc-apr-error/constants/fines-acc-apr-error-message.constant';
import { IFinesAccAprErrorContext } from '../fines-acc-apr-error/interfaces/fines-acc-apr-error-context.interface';
import { MOCK_FINES_ACCOUNT_STATE } from '../mocks/fines-acc-state.mock';
import { FinesAccountStore } from './fines-acc.store';

describe('FinesAccountStore APR retry state', () => {
  let store: InstanceType<typeof FinesAccountStore>;
  const addContext: IFinesAccAprErrorContext = {
    accountId: 141,
    action: 'add',
    text: ' Case-Sensitive-APR ',
    message: FINES_ACC_APR_DUPLICATE_MESSAGE,
  };
  const changeContext: IFinesAccAprErrorContext = { ...addContext, action: 'change', referenceId: 11 };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FinesAccountStore] });
    store = TestBed.inject(FinesAccountStore);
  });

  it('starts without a retry context and requires no router dependency', () => {
    expect(store.aprErrorContext()).toBeNull();
    expect(store.consumeAprDraft(141, 'add')).toBeNull();
  });

  it('replaces an earlier context without sharing the caller object', () => {
    store.setAprErrorContext(addContext);
    expect(store.aprErrorContext()).toEqual(addContext);
    expect(store.aprErrorContext()).not.toBe(addContext);

    store.setAprErrorContext(changeContext);
    expect(store.aprErrorContext()).toEqual(changeContext);
  });

  it('restores matching add text once without altering its case or whitespace', () => {
    store.setAprErrorContext(addContext);

    expect(store.consumeAprDraft(141, 'add')).toBe(' Case-Sensitive-APR ');
    expect(store.aprErrorContext()).toBeNull();
    expect(store.consumeAprDraft(141, 'add')).toBeNull();
  });

  it('restores a matching change only for its account and reference', () => {
    store.setAprErrorContext(changeContext);

    expect(store.consumeAprDraft(141, 'change', 11)).toBe(' Case-Sensitive-APR ');
    expect(store.aprErrorContext()).toBeNull();
  });

  it.each([
    { accountId: 142, action: 'change' as const, referenceId: 11 },
    { accountId: 141, action: 'add' as const, referenceId: 11 },
    { accountId: 141, action: 'change' as const, referenceId: undefined },
    { accountId: 141, action: 'change' as const, referenceId: 12 },
  ])('clears a retry draft without exposing it to mismatched context %j', ({ accountId, action, referenceId }) => {
    store.setAprErrorContext(changeContext);

    expect(store.consumeAprDraft(accountId, action, referenceId)).toBeNull();
    expect(store.aprErrorContext()).toBeNull();
  });

  it('clears the error message and draft together', () => {
    store.setAprErrorContext(changeContext);
    store.clearAprErrorContext();

    expect(store.aprErrorContext()).toBeNull();
    expect(store.consumeAprDraft(141, 'change', 11)).toBeNull();
  });

  it.each([
    '/fines/account/defendant/141/alternate/payment/reference/error',
    '/fines/account/defendant/141/alternate/payment/reference/error?source=change#message',
    '/fines/account/defendant/141/alternate/payment/reference/change?alternatePaymentReferenceId=11',
  ])('retains a change draft within its same-account error and retry paths: %s', (url) => {
    store.setAprErrorContext(changeContext);

    store.clearAprErrorContextForNavigation(url);

    expect(store.aprErrorContext()).toEqual(changeContext);
  });

  it('retains an Add draft when returning to its same-account Add form', () => {
    store.setAprErrorContext(addContext);

    store.clearAprErrorContextForNavigation('/fines/account/defendant/141/alternate/payment/reference/add');

    expect(store.aprErrorContext()).toEqual(addContext);
  });

  it.each([
    '/fines/account/defendant/142/alternate/payment/reference/error',
    '/fines/account/defendant/141/alternate/payment/reference/manage',
    '/fines/account/defendant/141/alternate/payment/reference/add',
    '/fines/account/defendant/141/details#payment-terms',
    '/fines/dashboard',
  ])('discards a change draft outside its account or retry path: %s', (url) => {
    store.setAprErrorContext(changeContext);

    store.clearAprErrorContextForNavigation(url);

    expect(store.aprErrorContext()).toBeNull();
  });

  it('does not change account metadata when there is no APR navigation context', () => {
    store.setAccountState(MOCK_FINES_ACCOUNT_STATE);

    store.clearAprErrorContextForNavigation('/fines/dashboard');

    expect(store.getAccountState()).toEqual(MOCK_FINES_ACCOUNT_STATE);
    expect(store.aprErrorContext()).toBeNull();
  });

  it.each([null, 141, 142])(
    'preserves a matching retry while setting account context from previous account %s',
    (accountId) => {
      store.setAccountState({ ...MOCK_FINES_ACCOUNT_STATE, account_id: accountId });
      store.setAprErrorContext(changeContext);

      store.setAccountState({ ...MOCK_FINES_ACCOUNT_STATE, account_id: 141, base_version: '"9"' });

      expect(store.aprErrorContext()).toEqual(changeContext);
      expect(store.consumeAprDraft(141, 'change', 11)).toBe(' Case-Sensitive-APR ');
      expect(store.base_version()).toBe('"9"');
    },
  );

  it.each([null, 142])('clears an old-account retry when new account state is %s', (accountId) => {
    store.setAprErrorContext(changeContext);

    store.setAccountState({ ...MOCK_FINES_ACCOUNT_STATE, account_id: accountId });

    expect(store.aprErrorContext()).toBeNull();
  });

  it('keeps transient error data out of the account metadata snapshot', () => {
    store.setAccountState({ ...MOCK_FINES_ACCOUNT_STATE, account_id: 141 });
    store.setAprErrorContext(changeContext);

    expect(store.getAccountState()).toEqual({ ...MOCK_FINES_ACCOUNT_STATE, account_id: 141 });
    expect(store.getAccountState()).not.toHaveProperty('aprErrorContext');
  });

  it.each(['clearAccountState', 'resetStore'] as const)('%s clears any APR error and draft', (method) => {
    store.setAprErrorContext(changeContext);

    store[method]();

    expect(store.aprErrorContext()).toBeNull();
  });

  it('clears the APR draft when its injector is destroyed', () => {
    store.setAprErrorContext(changeContext);

    TestBed.resetTestingModule();

    expect(store.aprErrorContext()).toBeNull();
  });
});
