import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  ALTERNATE_PAYMENT_REFERENCE_DUPLICATE_MESSAGE,
  FinesAccAlternatePaymentReferenceErrorService,
  IFinesAccAlternatePaymentReferenceErrorContext,
} from '../fines-acc-defendant-alternate-payment-reference/fines-acc-alternate-payment-reference-error.service';
import { FinesAccDefendantAlternatePaymentReferenceErrorComponent } from './fines-acc-defendant-alternate-payment-reference-error.component';

@Component({ template: 'APR destination' })
class AprErrorTestDestinationComponent {}

describe('FinesAccDefendantAlternatePaymentReferenceErrorComponent', () => {
  let errorService: FinesAccAlternatePaymentReferenceErrorService;
  const root = '/fines/account/defendant/141/alternate/payment/reference';
  const context: IFinesAccAlternatePaymentReferenceErrorContext = {
    accountId: 141,
    action: 'add',
    text: 'REJECTED-REFERENCE',
    message: ALTERNATE_PAYMENT_REFERENCE_DUPLICATE_MESSAGE,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'fines/account/defendant/:accountId/alternate/payment/reference',
            children: [
              { path: 'error', component: FinesAccDefendantAlternatePaymentReferenceErrorComponent },
              ...['add', 'edit', 'list'].map((path) => ({ path, component: AprErrorTestDestinationComponent })),
            ],
          },
        ]),
      ],
    }).compileComponents();
    errorService = TestBed.inject(FinesAccAlternatePaymentReferenceErrorService);
  });

  it('uses the shared heading and displays the duplicate message with a same-account Add return link', async () => {
    errorService.remember(context);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${root}/error`, FinesAccDefendantAlternatePaymentReferenceErrorComponent);
    const element = harness.routeNativeElement!;

    expect(element.querySelector('opal-lib-govuk-heading-with-caption h1')?.textContent?.trim()).toBe(
      'There is a problem',
    );
    expect(element.querySelector('#apr-error-message')?.textContent?.trim()).toBe(
      'The payment reference already exists',
    );
    expect(element.querySelector('#apr-error-back')?.textContent?.trim()).toBe('Go back');
    expect(element.querySelector('#apr-error-back')?.getAttribute('href')).toBe(`${root}/add`);
    expect(element.textContent).not.toContain('REJECTED-REFERENCE');
  });

  it('returns to Add without submitting or consuming the rejected value on the error page', async () => {
    errorService.remember(context);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${root}/error`, FinesAccDefendantAlternatePaymentReferenceErrorComponent);

    (harness.routeNativeElement!.querySelector('#apr-error-back') as HTMLAnchorElement).click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(`${root}/add`);
    expect(errorService.consumeDraft(141, 'add')).toBe('REJECTED-REFERENCE');
  });

  it('returns an edit failure to its selected reference and retains the edit draft for that form', async () => {
    errorService.remember({ ...context, action: 'edit', referenceId: 11 });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${root}/error`, FinesAccDefendantAlternatePaymentReferenceErrorComponent);
    const link = harness.routeNativeElement!.querySelector('#apr-error-back') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe(`${root}/edit?alternatePaymentReferenceId=11`);

    link.click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(`${root}/edit?alternatePaymentReferenceId=11`);
    expect(errorService.consumeDraft(141, 'edit', 11)).toBe('REJECTED-REFERENCE');
  });

  it('renders a supplied supported error message without generating alternative business copy', async () => {
    errorService.remember({ ...context, message: 'A supported APR processing problem' });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${root}/error`, FinesAccDefendantAlternatePaymentReferenceErrorComponent);

    expect(harness.routeNativeElement!.querySelector('#apr-error-message')?.textContent?.trim()).toBe(
      'A supported APR processing problem',
    );
  });

  it('redirects a cold error-page entry to the same account list', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${root}/error`);
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(`${root}/list`);
    expect(errorService.context()).toBeNull();
  });

  it('clears mismatched account context and returns to the requested account list', async () => {
    errorService.remember({ ...context, accountId: 142 });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${root}/error`);
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(`${root}/list`);
    expect(errorService.context()).toBeNull();
  });

  it('does not expose a previous account error when Angular reuses the route for another account', async () => {
    errorService.remember(context);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${root}/error`, FinesAccDefendantAlternatePaymentReferenceErrorComponent);

    await harness.navigateByUrl(`${root.replace('/141/', '/142/')}/error`);
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(`${root.replace('/141/', '/142/')}/list`);
    expect(errorService.context()).toBeNull();
    expect(harness.routeNativeElement?.textContent).not.toContain('The payment reference already exists');
  });
});
