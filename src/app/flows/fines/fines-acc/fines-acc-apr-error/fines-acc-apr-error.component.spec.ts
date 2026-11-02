import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FINES_ACC_APR_DUPLICATE_MESSAGE } from './constants/fines-acc-apr-error-message.constant';
import { IFinesAccAprErrorContext } from './interfaces/fines-acc-apr-error-context.interface';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccAprErrorComponent } from './fines-acc-apr-error.component';

@Component({ template: 'APR destination' })
class AprErrorTestDestinationComponent {}

describe('FinesAccAprErrorComponent', () => {
  let accountStore: InstanceType<typeof FinesAccountStore>;
  const root = '/fines/account/defendant/141/alternate/payment/reference';
  const context: IFinesAccAprErrorContext = {
    accountId: 141,
    action: 'add',
    text: 'REJECTED-REFERENCE',
    message: FINES_ACC_APR_DUPLICATE_MESSAGE,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'fines/account/defendant/:accountId/alternate/payment/reference',
            children: [
              { path: 'error', component: FinesAccAprErrorComponent },
              { path: 'manage', component: AprErrorTestDestinationComponent },
              { path: ':mode', component: AprErrorTestDestinationComponent },
            ],
          },
        ]),
      ],
    }).compileComponents();
    accountStore = TestBed.inject(FinesAccountStore);
  });

  it('uses the shared heading and displays the duplicate message with a same-account Add return link', async () => {
    accountStore.setAprErrorContext(context);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${root}/error`, FinesAccAprErrorComponent);
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
    accountStore.setAprErrorContext(context);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${root}/error`, FinesAccAprErrorComponent);

    (harness.routeNativeElement!.querySelector('#apr-error-back') as HTMLAnchorElement).click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(`${root}/add`);
    expect(accountStore.consumeAprDraft(141, 'add')).toBe('REJECTED-REFERENCE');
  });

  it('returns a change failure to its selected reference and retains the change draft for that form', async () => {
    accountStore.setAprErrorContext({ ...context, action: 'change', referenceId: 11 });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${root}/error`, FinesAccAprErrorComponent);
    const link = harness.routeNativeElement!.querySelector('#apr-error-back') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe(`${root}/change?alternatePaymentReferenceId=11`);

    link.click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(`${root}/change?alternatePaymentReferenceId=11`);
    expect(accountStore.consumeAprDraft(141, 'change', 11)).toBe('REJECTED-REFERENCE');
  });

  it('renders a supplied supported error message without generating alternative business copy', async () => {
    accountStore.setAprErrorContext({ ...context, message: 'A supported APR processing problem' });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${root}/error`, FinesAccAprErrorComponent);

    expect(harness.routeNativeElement!.querySelector('#apr-error-message')?.textContent?.trim()).toBe(
      'A supported APR processing problem',
    );
  });

  it('redirects a cold error-page entry to the same account Manage page', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${root}/error`);
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(`${root}/manage`);
    expect(accountStore.aprErrorContext()).toBeNull();
  });

  it('clears mismatched account context and returns to the requested account Manage page', async () => {
    accountStore.setAprErrorContext({ ...context, accountId: 142 });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${root}/error`);
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(`${root}/manage`);
    expect(accountStore.aprErrorContext()).toBeNull();
  });

  it('does not expose a previous account error when Angular reuses the route for another account', async () => {
    accountStore.setAprErrorContext(context);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${root}/error`, FinesAccAprErrorComponent);

    await harness.navigateByUrl(`${root.replace('/141/', '/142/')}/error`);
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(`${root.replace('/141/', '/142/')}/manage`);
    expect(accountStore.aprErrorContext()).toBeNull();
    expect(harness.routeNativeElement?.textContent).not.toContain('The payment reference already exists');
  });
});
