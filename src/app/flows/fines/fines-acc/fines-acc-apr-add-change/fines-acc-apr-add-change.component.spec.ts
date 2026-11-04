import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { Subject, of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import {
  IOpalFinesAprResponse,
  IOpalFinesAprsResponse,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { MOCK_FINES_ACCOUNT_STATE } from '../mocks/fines-acc-state.mock';
import { routing as accountRouting } from '../routing/fines-acc.routes';
import { FinesAccAprAddChangeComponent } from './fines-acc-apr-add-change.component';
import { FINES_ACC_APR_ROUTING_PATHS } from '../fines-acc-apr-manage/constants/fines-acc-apr-routing-paths.constant';

const routing = accountRouting
  .flatMap((route) => route.children ?? [])
  .flatMap((route) => route.children ?? [])
  .find((route) => route.path === FINES_ACC_APR_ROUTING_PATHS.root)!.children!;

@Component({ template: '<p>APR manage</p>' })
class ManagePageComponent {}

const response: IOpalFinesAprResponse = {
  reference: {
    alternate_payment_reference_id: 11,
    defendant_account_id: 141,
    relationship: 'APR',
    category: 'APR',
    business_unit_id: 77,
    apr_text: 'AbC-123',
    created_at: '2026-06-01T12:00:00Z',
    updated_at: null,
  },
  version: '"8"',
};
const addUrl = '/fines/account/defendant/141/alternate/payment/reference/add';
const manageUrl = '/fines/account/defendant/141/alternate/payment/reference/manage';

describe('FinesAccAprAddChangeComponent add mode', () => {
  let accountStore: InstanceType<typeof FinesAccountStore>;
  let api: {
    createApr: ReturnType<typeof vi.fn>;
    clearAccountDetailsCache: ReturnType<typeof vi.fn>;
  };
  let utils: { scrollToTop: ReturnType<typeof vi.fn> };
  let initialVersion: string | null;

  const render = async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(addUrl, FinesAccAprAddChangeComponent);
    const enter = (value: string) => {
      const input = harness.routeNativeElement!.querySelector('#apr_text') as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const save = () =>
      harness
        .routeNativeElement!.querySelector('form')!
        .dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    const cancel = () =>
      (harness.routeNativeElement!.querySelector('opal-lib-govuk-cancel-link a') as HTMLAnchorElement).click();
    return { harness, component, enter, save, cancel };
  };

  beforeEach(async () => {
    initialVersion = '"7"';
    const sharedResolvedData: IOpalFinesAprsResponse = { references: [], version: initialVersion };
    api = { createApr: vi.fn().mockReturnValue(of(response)), clearAccountDetailsCache: vi.fn() };
    utils = { scrollToTop: vi.fn() };
    const formRoute = routing.find((route) => route.path === ':mode')!;
    await TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: api },
        { provide: UtilsService, useValue: utils },
        provideRouter([
          {
            path: 'fines/account/defendant/:accountId/alternate/payment/reference',
            children: [
              { path: 'manage', component: ManagePageComponent },
              {
                ...formRoute,
                canActivate: [],
                resolve: {
                  aprs: (route: ActivatedRouteSnapshot) => {
                    const accountId = Number(route.paramMap.get('accountId'));
                    accountStore.setAccountState({
                      ...MOCK_FINES_ACCOUNT_STATE,
                      account_id: accountId,
                      account_number: `${accountId}A`,
                      party_name: `APR TEST ${accountId}`,
                      base_version: accountId === 141 ? initialVersion : '"9"',
                    });
                    sharedResolvedData.version = accountStore.base_version();
                    return sharedResolvedData;
                  },
                },
              },
            ],
          },
        ]),
      ],
    }).compileComponents();
    accountStore = TestBed.inject(FinesAccountStore);
  });

  afterEach(() => vi.restoreAllMocks());

  it('sends the exact entered reference and quoted current account version, then returns fresh Manage page feedback', async () => {
    const { harness, component, enter, save } = await render();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
    const confirm = vi.spyOn(window, 'confirm');
    expect(harness.routeNativeElement!.textContent).toContain('141A - APR TEST 141');
    enter(' AbC-123 ');
    save();
    await navigate.mock.results[0].value;

    expect(api.createApr).toHaveBeenCalledExactlyOnceWith(141, { apr_text: ' AbC-123 ' }, '"7"');
    expect(api.clearAccountDetailsCache).toHaveBeenCalledOnce();
    expect(accountStore.base_version()).toBe('"8"');
    expect(accountStore.successMessage()).toBe('Alternate payment reference added');
    expect(component.stateUnsavedChanges).toBe(false);
    expect(TestBed.inject(Router).url).toBe(manageUrl);
    expect(confirm).not.toHaveBeenCalled();
  });

  it('keeps entered text and the unsaved warning after an API failure, without success feedback', async () => {
    const failure = { status: 500 };
    api.createApr.mockReturnValue(throwError(() => failure));
    const { harness, component, enter, save } = await render();
    enter('Retry-Reference');
    save();

    expect(component.pending()).toBe(false);
    expect(component.stateUnsavedChanges).toBe(true);
    expect((harness.routeNativeElement!.querySelector('#apr_text') as HTMLInputElement).value).toBe('Retry-Reference');
    expect(accountStore.base_version()).toBe('"7"');
    expect(accountStore.successMessage()).toBeNull();
    expect(api.clearAccountDetailsCache).not.toHaveBeenCalled();
    expect(utils.scrollToTop).toHaveBeenCalledOnce();
    expect(TestBed.inject(Router).url).toBe(addUrl);
  });

  it('permits only one pending request and disables Save', async () => {
    const result = new Subject<IOpalFinesAprResponse>();
    api.createApr.mockReturnValue(result);
    const { harness, component, enter, save } = await render();
    enter('Pending');
    save();
    harness.detectChanges();
    component.handleSubmit({ formData: { apr_text: 'Pending' }, nestedFlow: false });

    expect(component.pending()).toBe(true);
    expect(api.createApr).toHaveBeenCalledOnce();
    expect((harness.routeNativeElement!.querySelector('#apr-save') as HTMLButtonElement).matches(':disabled')).toBe(
      true,
    );
  });

  it('returns to manage on pristine Cancel without writing or confirming', async () => {
    const { harness, cancel } = await render();
    const confirm = vi.spyOn(window, 'confirm');
    cancel();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(manageUrl);
    expect(api.createApr).not.toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
  });

  it('keeps dirty text when the user declines leaving, and discards it when leaving is confirmed', async () => {
    const { harness, enter, cancel } = await render();
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    enter('Unsaved');
    cancel();
    await harness.fixture.whenStable();

    expect(confirm).toHaveBeenCalledOnce();
    expect(TestBed.inject(Router).url).toBe(addUrl);
    expect((harness.routeNativeElement!.querySelector('#apr_text') as HTMLInputElement).value).toBe('Unsaved');
    confirm.mockReturnValue(true);
    cancel();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe(manageUrl);
    expect(api.createApr).not.toHaveBeenCalled();
  });

  it('resets Add validation and an unchanged empty baseline when the same resolver response object is reused for another account', async () => {
    const { harness, component, enter, save } = await render();
    const resolvedData = component.formContext()['aprs'];
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    enter('1234567890123456789');
    save();
    expect(harness.routeNativeElement!.querySelector('.govuk-error-summary')).not.toBeNull();
    expect(api.createApr).not.toHaveBeenCalled();

    const reused = await harness.navigateByUrl(addUrl.replace('/141/', '/142/'), FinesAccAprAddChangeComponent);

    expect(reused).toBe(component);
    expect(component.formContext()['aprs']).toBe(resolvedData);
    expect(component.stateUnsavedChanges).toBe(false);
    expect(component.initialValue()).toBe('');
    expect(component.savedValue()).toBe('');
    expect((harness.routeNativeElement!.querySelector('#apr_text') as HTMLInputElement).value).toBe('');
    expect(harness.routeNativeElement!.querySelector('.govuk-error-summary')).toBeNull();
    expect(harness.routeNativeElement!.textContent).toContain('142A - APR TEST 142');
    enter('New-Account');
    save();
    await harness.fixture.whenStable();
    expect(api.createApr).toHaveBeenCalledExactlyOnceWith(142, { apr_text: 'New-Account' }, '"9"');
    expect(TestBed.inject(Router).url).toBe(manageUrl.replace('/141/', '/142/'));
  });

  it('cancels the old pending subscription when route context changes so its response cannot alter the new account', async () => {
    const result = new Subject<IOpalFinesAprResponse>();
    api.createApr.mockReturnValue(result);
    const { harness, component, enter, save } = await render();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    enter('Old-Account');
    save();

    await harness.navigateByUrl(addUrl.replace('/141/', '/142/'), FinesAccAprAddChangeComponent);
    result.next(response);

    expect(component.pending()).toBe(false);
    expect(result.observed).toBe(false);
    expect(accountStore.account_id()).toBe(142);
    expect(accountStore.base_version()).toBe('"9"');
    expect(accountStore.successMessage()).toBeNull();
    expect(api.clearAccountDetailsCache).not.toHaveBeenCalled();
    expect(TestBed.inject(Router).url).toBe(addUrl.replace('/141/', '/142/'));
  });

  it('does not submit without an account version', async () => {
    initialVersion = null;
    const { component, harness } = await render();

    component.handleSubmit({ formData: { apr_text: 'Valid' }, nestedFlow: false });
    await harness.fixture.whenStable();

    expect(api.createApr).not.toHaveBeenCalled();
  });

  it('keeps the resolved page version paired with the entered reference when other requests change account state', async () => {
    const { component, harness } = await render();
    accountStore.setAccountState({ ...accountStore.getAccountState(), base_version: '"99"' });

    component.handleSubmit({ formData: { apr_text: 'Original-Snapshot' }, nestedFlow: false });
    await harness.fixture.whenStable();

    expect(api.createApr).toHaveBeenCalledExactlyOnceWith(141, { apr_text: 'Original-Snapshot' }, '"7"');
  });
});
