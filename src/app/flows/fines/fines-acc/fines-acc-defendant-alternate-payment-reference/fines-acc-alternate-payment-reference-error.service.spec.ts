import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesAccAlternatePaymentReferenceErrorService } from './fines-acc-alternate-payment-reference-error.service';

describe('FinesAccAlternatePaymentReferenceErrorService', () => {
  let service: FinesAccAlternatePaymentReferenceErrorService;
  let routerEvents: Subject<NavigationEnd>;
  const addContext = {
    accountId: 141,
    action: 'add' as const,
    text: 'Case-Sensitive-APR',
    message: 'The payment reference already exists',
  };
  const editContext = { ...addContext, action: 'edit' as const, referenceId: 11 };

  beforeEach(() => {
    routerEvents = new Subject<NavigationEnd>();
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: { events: routerEvents.asObservable() } }],
    });
    service = TestBed.inject(FinesAccAlternatePaymentReferenceErrorService);
  });

  it('starts without a retry context', () => {
    expect(service.context()).toBeNull();
    expect(service.consumeDraft(141, 'add')).toBeNull();
  });

  it('remembers the rejected value and replaces an earlier failure context', () => {
    service.remember(addContext);
    expect(service.context()).toEqual(addContext);

    service.remember(editContext);
    expect(service.context()).toEqual(editContext);
  });

  it('restores a matching add draft exactly once without altering its case', () => {
    service.remember(addContext);

    expect(service.consumeDraft(141, 'add')).toBe('Case-Sensitive-APR');
    expect(service.context()).toBeNull();
    expect(service.consumeDraft(141, 'add')).toBeNull();
  });

  it('restores an edit draft only for its matching account and reference', () => {
    service.remember(editContext);

    expect(service.consumeDraft(141, 'edit', 11)).toBe('Case-Sensitive-APR');
    expect(service.context()).toBeNull();
  });

  it('discards a draft when another account asks to consume it', () => {
    service.remember(addContext);

    expect(service.consumeDraft(142, 'add')).toBeNull();
    expect(service.context()).toBeNull();
  });

  it('discards a draft when another APR action asks to consume it', () => {
    service.remember(editContext);

    expect(service.consumeDraft(141, 'add')).toBeNull();
    expect(service.context()).toBeNull();
  });

  it.each([undefined, 12])('discards an edit draft when the selected reference is %s', (referenceId) => {
    service.remember(editContext);

    expect(service.consumeDraft(141, 'edit', referenceId)).toBeNull();
    expect(service.context()).toBeNull();
  });

  it('clears a remembered error and its draft', () => {
    service.remember(editContext);
    service.clear();

    expect(service.context()).toBeNull();
    expect(service.consumeDraft(141, 'edit', 11)).toBeNull();
  });

  it.each([
    '/fines/account/defendant/141/alternate/payment/reference/error',
    '/fines/account/defendant/141/alternate/payment/reference/edit?alternatePaymentReferenceId=11',
  ])('retains the edit draft while navigating within its error and retry journey: %s', (url) => {
    service.remember(editContext);

    routerEvents.next(new NavigationEnd(1, url, url));

    expect(service.context()).toEqual(editContext);
  });

  it.each([
    '/fines/account/defendant/142/alternate/payment/reference/error',
    '/fines/account/defendant/141/alternate/payment/reference/list',
    '/fines/account/defendant/141/alternate/payment/reference/add',
    '/fines/account/defendant/141/details#payment-terms',
  ])('discards the edit draft after leaving its account or retry journey: %s', (url) => {
    service.remember(editContext);

    routerEvents.next(new NavigationEnd(1, url, url));

    expect(service.context()).toBeNull();
  });
});
