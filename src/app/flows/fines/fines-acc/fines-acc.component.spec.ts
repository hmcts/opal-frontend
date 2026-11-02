import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FinesAccComponent } from './fines-acc.component';
import { FinesAccEnfActionAddNewComponent } from './fines-acc-enf-action-add-new/fines-acc-enf-action-add-new.component';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from './fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { FinesAccPayloadService } from './services/fines-acc-payload.service';
import { FinesAccountStore } from './stores/fines-acc.store';
import { FINES_ACC_APR_DUPLICATE_MESSAGE } from './fines-acc-apr-error/constants/fines-acc-apr-error-message.constant';
import { IFinesAccAprErrorContext } from './fines-acc-apr-error/interfaces/fines-acc-apr-error-context.interface';
import { MOCK_FINES_ACCOUNT_STATE } from './mocks/fines-acc-state.mock';

@Component({ template: '' })
class TestFormPage extends AbstractFormParentBaseComponent {}

describe('FinesAccComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'account',
            component: FinesAccComponent,
            children: [{ path: 'form', component: TestFormPage }],
          },
        ]),
        { provide: OpalFines, useValue: { clearAccountDetailsCache: vi.fn() } },
      ],
    }).compileComponents();
  });

  async function navigateToAccount(path = '/account/form') {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(path);
    harness.detectChanges();
    const routeElement = harness.routeDebugElement!;
    const component = routeElement.componentInstance as FinesAccComponent;
    const outlet = routeElement.query(By.directive(RouterOutlet)).injector.get(RouterOutlet);
    return { component, outlet };
  }

  it('creates the account flow wrapper', async () => {
    const { component } = await navigateToAccount();

    expect(component).toBeInstanceOf(FinesAccComponent);
  });

  it('allows unloading when there is no active form', async () => {
    const { component } = await navigateToAccount('/account');

    expect(component.handleBeforeUnload()).toBe(true);
  });

  it('allows unloading when the active form has no unsaved changes', async () => {
    const { component, outlet } = await navigateToAccount();
    const activePage = outlet.component as TestFormPage;
    activePage.stateUnsavedChanges = false;

    expect(component.handleBeforeUnload()).toBe(true);
  });

  it('prevents unloading when the active form has unsaved changes', async () => {
    const { component, outlet } = await navigateToAccount();
    const activePage = outlet.component as TestFormPage;
    activePage.stateUnsavedChanges = true;

    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);

    expect(component.handleBeforeUnload()).toBe(false);
    expect(event.defaultPrevented).toBe(true);
  });
});

describe('FinesAccComponent APR retry navigation', () => {
  const aprRoot = '/fines/account/defendant/141/alternate/payment/reference';
  const context: IFinesAccAprErrorContext = {
    accountId: 141,
    action: 'change',
    referenceId: 11,
    text: 'REJECTED-REFERENCE',
    message: FINES_ACC_APR_DUPLICATE_MESSAGE,
  };
  let accountStore: InstanceType<typeof FinesAccountStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'fines/account',
            component: FinesAccComponent,
            children: [
              {
                path: 'defendant/:accountId/alternate/payment/reference',
                children: [
                  { path: 'error', component: TestFormPage },
                  { path: 'manage', component: TestFormPage },
                  { path: ':mode', component: TestFormPage },
                ],
              },
              { path: 'defendant/:accountId/details', component: TestFormPage },
              { path: 'blocked', component: TestFormPage, canActivate: [() => false] },
            ],
          },
          { path: 'fines/dashboard', component: TestFormPage },
        ]),
        { provide: OpalFines, useValue: { clearAccountDetailsCache: vi.fn() } },
      ],
    }).compileComponents();
    accountStore = TestBed.inject(FinesAccountStore);
  });

  it('retains a change retry when the real router moves between its error page and selected form', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${aprRoot}/error`);
    accountStore.setAprErrorContext(context);

    await harness.navigateByUrl(`${aprRoot}/change?alternatePaymentReferenceId=11`);
    expect(accountStore.aprErrorContext()).toEqual(context);
    await harness.navigateByUrl(`${aprRoot}/error`);
    expect(accountStore.aprErrorContext()).toEqual(context);
  });

  it.each([
    `${aprRoot}/manage`,
    `${aprRoot}/add`,
    '/fines/account/defendant/141/details#payment-terms',
    '/fines/account/defendant/142/alternate/payment/reference/error',
  ])('clears the rejected text only after completed navigation outside its retry path: %s', async (destination) => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${aprRoot}/error`);
    accountStore.setAprErrorContext(context);

    await harness.navigateByUrl(destination);

    expect(TestBed.inject(Router).url).toBe(destination);
    expect(accountStore.aprErrorContext()).toBeNull();
  });

  it('keeps the retry draft when navigation is cancelled', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${aprRoot}/error`);
    accountStore.setAprErrorContext(context);

    await harness.navigateByUrl('/fines/account/blocked');

    expect(TestBed.inject(Router).url).toBe(`${aprRoot}/error`);
    expect(accountStore.aprErrorContext()).toEqual(context);
  });

  it('resets account state and the APR draft when the account shell is destroyed', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${aprRoot}/error`);
    accountStore.setAccountState({ ...MOCK_FINES_ACCOUNT_STATE, account_id: 141 });
    accountStore.setAprErrorContext(context);

    await harness.navigateByUrl('/fines/dashboard');

    expect(accountStore.account_id()).toBeNull();
    expect(accountStore.aprErrorContext()).toBeNull();
    expect(TestBed.inject(OpalFines).clearAccountDetailsCache).toHaveBeenCalledOnce();
  });
});

describe('FinesAccComponent add-new enforcement action route', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'account',
            component: FinesAccComponent,
            children: [
              {
                path: 'defendant/:accountId/enforcement/action/add-new',
                component: FinesAccEnfActionAddNewComponent,
                resolve: { defendantAccountHeadingData: () => FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK },
              },
            ],
          },
        ]),
        { provide: OpalFines, useValue: { clearAccountDetailsCache: vi.fn() } },
        {
          provide: FinesAccPayloadService,
          useValue: {
            transformDefendantAccountHeaderForStore: () => ({
              account_number: '177A',
              account_id: 12345,
              party_name: 'Ms Anna GRAHAM',
            }),
          },
        },
      ],
    }).compileComponents();
  });

  it('warns on browser unload after the user selects an add-new answer', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/account/defendant/12345/enforcement/action/add-new');
    harness.detectChanges();

    const routeElement = harness.routeDebugElement!;
    const wrapper = routeElement.componentInstance as FinesAccComponent;
    const outlet = routeElement.query(By.directive(RouterOutlet)).injector.get(RouterOutlet);
    const activePage = outlet.component as FinesAccEnfActionAddNewComponent;
    const yesRadio = harness.routeNativeElement!.querySelector<HTMLInputElement>(
      'input[name="facc_enf_action_add_new"][value="true"]',
    );

    expect(activePage).toBeInstanceOf(FinesAccEnfActionAddNewComponent);
    expect(wrapper.handleBeforeUnload()).toBe(true);
    expect(yesRadio).not.toBeNull();

    yesRadio!.click();
    harness.detectChanges();

    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);

    expect(activePage.stateUnsavedChanges).toBe(true);
    expect(wrapper.handleBeforeUnload()).toBe(false);
    expect(event.defaultPrevented).toBe(true);
  });
});
