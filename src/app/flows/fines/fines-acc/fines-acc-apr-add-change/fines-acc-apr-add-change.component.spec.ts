import { HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, ResolveStart, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { EMPTY, filter, firstValueFrom, Observable, Subject, of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesApr } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { IOpalFinesAprResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr-response.interface';
import { IOpalFinesAprsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-aprs-response.interface';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { MOCK_FINES_ACCOUNT_STATE } from '../mocks/fines-acc-state.mock';
import { routing as accountRouting } from '../routing/fines-acc.routes';
import { FinesAccAprAddChangeComponent } from './fines-acc-apr-add-change.component';
import { FINES_ACC_APR_ROUTING_PATHS } from '../fines-acc-apr-manage/constants/fines-acc-apr-routing-paths.constant';
import { httpErrorInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-error';
import { contentDigestInterceptor } from '@hmcts/opal-frontend-common/interceptors/content-digest';
import { httpRetryInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-retry';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

const routing = accountRouting
  .flatMap((route) => route.children ?? [])
  .flatMap((route) => route.children ?? [])
  .filter((route) => route.path?.startsWith(`${FINES_ACC_APR_ROUTING_PATHS.root}/`));

@Component({ template: '<p>APR manage</p>' })
class ManagePageComponent {}

const addResponse: IOpalFinesAprResponse = {
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
  let manageAprs$: Observable<IOpalFinesAprsResponse>;

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
    manageAprs$ = of({ references: [], version: '"8"' });
    const sharedResolvedData: IOpalFinesAprsResponse = { references: [], version: initialVersion };
    api = { createApr: vi.fn().mockReturnValue(of(addResponse)), clearAccountDetailsCache: vi.fn() };
    utils = { scrollToTop: vi.fn() };
    const formRoute = routing.find((route) => route.path === `${FINES_ACC_APR_ROUTING_PATHS.root}/:mode`)!;
    await TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: api },
        { provide: UtilsService, useValue: utils },
        provideRouter([
          {
            path: 'fines/account/defendant/:accountId',
            children: [
              {
                path: `${FINES_ACC_APR_ROUTING_PATHS.root}/manage`,
                component: ManagePageComponent,
                resolve: { aprs: () => manageAprs$ },
              },
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

  it('releases Save after an API failure, retaining entered text for a manual retry', async () => {
    const failure = { status: 500 };
    const result = new Subject<IOpalFinesAprResponse>();
    api.createApr.mockReturnValue(result);
    const { harness, component, enter, save } = await render();
    enter('Retry-Reference');
    save();
    harness.detectChanges();
    expect((harness.routeNativeElement!.querySelector('#apr-save') as HTMLButtonElement).disabled).toBe(true);
    result.error(failure);
    harness.detectChanges();

    expect(component.pending()).toBe(false);
    expect((harness.routeNativeElement!.querySelector('#apr-save') as HTMLButtonElement).disabled).toBe(false);
    expect(component.stateUnsavedChanges).toBe(true);
    expect((harness.routeNativeElement!.querySelector('#apr_text') as HTMLInputElement).value).toBe('Retry-Reference');
    expect(accountStore.base_version()).toBe('"7"');
    expect(accountStore.successMessage()).toBeNull();
    expect(api.clearAccountDetailsCache).not.toHaveBeenCalled();
    expect(utils.scrollToTop).toHaveBeenCalledOnce();
    expect(TestBed.inject(Router).url).toBe(addUrl);

    api.createApr.mockReturnValue(of(addResponse));
    save();
    await harness.fixture.whenStable();
    expect(api.createApr).toHaveBeenCalledTimes(2);
    expect(api.createApr).toHaveBeenLastCalledWith(141, { apr_text: 'Retry-Reference' }, '"7"');
    expect(TestBed.inject(Router).url).toBe(manageUrl);
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

  it('keeps Save locked after POST completes while Manage is still resolving', async () => {
    const manageResult = new Subject<IOpalFinesAprsResponse>();
    manageAprs$ = manageResult;
    const { harness, component, enter, save } = await render();
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate');
    const resolvingManage = firstValueFrom(
      router.events.pipe(filter((event) => event instanceof ResolveStart && event.url === manageUrl)),
    );
    enter('Saved-Reference');
    save();
    await resolvingManage;
    harness.detectChanges();

    expect(manageResult.observed).toBe(true);
    expect(router.url).toBe(addUrl);
    expect(accountStore.base_version()).toBe('"8"');
    expect(component.pending()).toBe(true);
    expect((harness.routeNativeElement!.querySelector('#apr-save') as HTMLButtonElement).disabled).toBe(true);
    save();
    component.handleSubmit({ formData: { apr_text: 'Saved-Reference' }, nestedFlow: false });
    expect(api.createApr).toHaveBeenCalledExactlyOnceWith(141, { apr_text: 'Saved-Reference' }, '"7"');

    manageResult.next({ references: [], version: '"8"' });
    manageResult.complete();
    await navigate.mock.results[0].value;
    expect(router.url).toBe(manageUrl);
  });

  it('releases Save when shared error handling completes the request without a response', async () => {
    api.createApr.mockReturnValue(EMPTY);
    const { harness, component, enter, save } = await render();
    enter('Unchanged-Request');
    save();
    harness.detectChanges();

    expect(component.pending()).toBe(false);
    expect((harness.routeNativeElement!.querySelector('#apr-save') as HTMLButtonElement).disabled).toBe(false);
    expect(accountStore.successMessage()).toBeNull();
    expect(api.clearAccountDetailsCache).not.toHaveBeenCalled();
    expect(TestBed.inject(Router).url).toBe(addUrl);
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
    result.next(addResponse);

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

const reference: IOpalFinesApr = {
  alternate_payment_reference_id: 11,
  defendant_account_id: 141,
  relationship: 'APR',
  category: 'APR',
  business_unit_id: 77,
  apr_text: 'Original',
  created_at: '2026-06-01T12:00:00Z',
  updated_at: null,
};
const changeResponse: IOpalFinesAprResponse = {
  reference: { ...reference, apr_text: 'Changed' },
  version: '"8"',
};
const changeUrl = '/fines/account/defendant/141/alternate/payment/reference/change?alternatePaymentReferenceId=11';

describe('FinesAccAprAddChangeComponent change mode', () => {
  let accountStore: InstanceType<typeof FinesAccountStore>;
  let api: {
    createApr: ReturnType<typeof vi.fn>;
    updateApr: ReturnType<typeof vi.fn>;
    clearAccountDetailsCache: ReturnType<typeof vi.fn>;
  };
  let utils: { scrollToTop: ReturnType<typeof vi.fn> };
  let reuseResolvedData: boolean;
  let manageAprs$: Observable<IOpalFinesAprsResponse>;

  const render = async (url = changeUrl) => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(url, FinesAccAprAddChangeComponent);
    const input = () => harness.routeNativeElement!.querySelector('#apr_text') as HTMLInputElement;
    const enter = (value: string) => {
      input().value = value;
      input().dispatchEvent(new Event('input', { bubbles: true }));
    };
    const save = () =>
      harness
        .routeNativeElement!.querySelector('form')!
        .dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    const cancel = () =>
      (harness.routeNativeElement!.querySelector('opal-lib-govuk-cancel-link a') as HTMLAnchorElement).click();
    return { harness, component, input, enter, save, cancel };
  };

  beforeEach(async () => {
    reuseResolvedData = false;
    manageAprs$ = of({ references: [changeResponse.reference], version: changeResponse.version });
    const sharedResolvedData: IOpalFinesAprsResponse = { references: [], version: '"7"' };
    api = {
      createApr: vi.fn().mockReturnValue(of(changeResponse)),
      updateApr: vi.fn().mockReturnValue(of(changeResponse)),
      clearAccountDetailsCache: vi.fn(),
    };
    utils = { scrollToTop: vi.fn() };
    const formRoute = routing.find((route) => route.path === `${FINES_ACC_APR_ROUTING_PATHS.root}/:mode`)!;
    await TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: api },
        { provide: UtilsService, useValue: utils },
        provideRouter([
          {
            path: 'fines/account/defendant/:accountId',
            children: [
              {
                path: `${FINES_ACC_APR_ROUTING_PATHS.root}/manage`,
                component: ManagePageComponent,
                resolve: { aprs: () => manageAprs$ },
              },
              {
                ...formRoute,
                canActivate: [],
                resolve: {
                  aprs: (route: ActivatedRouteSnapshot) => {
                    const accountId = Number(route.paramMap.get('accountId'));
                    const referenceId = Number(route.queryParamMap.get('alternatePaymentReferenceId'));
                    const mode = route.paramMap.get('mode');
                    const version = reuseResolvedData
                      ? mode === 'add'
                        ? '"7"'
                        : '"9"'
                      : referenceId === 11
                        ? '"7"'
                        : '"9"';
                    accountStore.setAccountState({
                      ...MOCK_FINES_ACCOUNT_STATE,
                      account_id: accountId,
                      account_number: `${accountId}A`,
                      party_name: `APR TEST ${accountId}`,
                      base_version: version,
                    });
                    const resolvedData: IOpalFinesAprsResponse = {
                      references:
                        mode === 'add'
                          ? []
                          : [
                              { ...reference, defendant_account_id: accountId },
                              {
                                ...reference,
                                defendant_account_id: accountId,
                                alternate_payment_reference_id: 12,
                                apr_text: 'Second',
                              },
                              {
                                ...reference,
                                defendant_account_id: accountId,
                                alternate_payment_reference_id: 21,
                                apr_text: 'Other-Account',
                              },
                              { ...reference, alternate_payment_reference_id: 31, category: 'ACC' },
                              {
                                ...reference,
                                defendant_account_id: accountId,
                                alternate_payment_reference_id: 32,
                                relationship: 'CONSOLIDATED',
                              },
                              {
                                ...reference,
                                defendant_account_id: accountId,
                                alternate_payment_reference_id: 33,
                                relationship: 'AMALGAMATED',
                              },
                              {
                                ...reference,
                                defendant_account_id: accountId,
                                alternate_payment_reference_id: 34,
                                relationship: 'CONSOLIDATED',
                                category: 'ACC',
                              },
                              {
                                ...reference,
                                defendant_account_id: accountId,
                                alternate_payment_reference_id: 35,
                                relationship: 'AMALGAMATED',
                                category: 'ACC',
                              },
                            ],
                      version,
                    };
                    if (reuseResolvedData) {
                      Object.assign(sharedResolvedData, resolvedData);
                      return sharedResolvedData;
                    }
                    return resolvedData;
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

  it('displays the current account and selected reference as a saved baseline', async () => {
    const { harness, component, input } = await render();

    expect(harness.routeNativeElement!.textContent).toContain('141A - APR TEST 141');
    expect(harness.routeNativeElement!.querySelector('h1')!.textContent).toContain(
      'Change Alternate Payment Reference',
    );
    expect(harness.routeNativeElement!.querySelector('label')!.textContent.trim()).toBe(
      'Change alternate payment reference',
    );
    expect(input().value).toBe('Original');
    expect(component.savedValue()).toBe('Original');
    expect(component.stateUnsavedChanges).toBe(false);
  });

  it('patches the selected ID with exact entered text and the resolved quoted version, then refreshes manage feedback', async () => {
    const { harness, component, enter, save } = await render();
    const confirm = vi.spyOn(window, 'confirm');
    accountStore.setAccountState({ ...accountStore.getAccountState(), base_version: '"99"' });
    enter(' MiXeD-123 ');
    save();
    await harness.fixture.whenStable();

    expect(api.updateApr).toHaveBeenCalledExactlyOnceWith(141, 11, { apr_text: ' MiXeD-123 ' }, '"7"');
    expect(accountStore.base_version()).toBe('"8"');
    expect(accountStore.successMessage()).toBe('Alternate payment reference updated');
    expect(api.clearAccountDetailsCache).toHaveBeenCalledOnce();
    expect(component.stateUnsavedChanges).toBe(false);
    expect(TestBed.inject(Router).url).toBe(manageUrl);
    expect(confirm).not.toHaveBeenCalled();
  });

  it.each([false, true])(
    'returns unchanged Save to manage without PATCH or success feedback after editing=$0',
    async (edited) => {
      const { harness, component, enter, save } = await render();
      const confirm = vi.spyOn(window, 'confirm');
      if (edited) {
        enter('Temporary');
        enter('Original');
      }
      save();
      await harness.fixture.whenStable();

      expect(component.stateUnsavedChanges).toBe(false);
      expect(api.updateApr).not.toHaveBeenCalled();
      expect(api.clearAccountDetailsCache).not.toHaveBeenCalled();
      expect(accountStore.successMessage()).toBeNull();
      expect(TestBed.inject(Router).url).toBe(manageUrl);
      expect(confirm).not.toHaveBeenCalled();
    },
  );

  it.each(['', '   ', '1234567890123456789'])(
    'rejects invalid changed text %j using the shared form',
    async (value) => {
      const { harness, enter, save } = await render();
      enter(value);
      save();

      expect(api.updateApr).not.toHaveBeenCalled();
      expect(TestBed.inject(Router).url).toBe(changeUrl);
      expect(harness.routeNativeElement!.querySelector('.govuk-error-summary')).not.toBeNull();
    },
  );

  it('returns pristine Cancel to manage without writing or confirming', async () => {
    const { harness, cancel } = await render();
    const confirm = vi.spyOn(window, 'confirm');
    cancel();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(manageUrl);
    expect(confirm).not.toHaveBeenCalled();
    expect(api.updateApr).not.toHaveBeenCalled();
  });

  it('keeps changed text when leaving is declined and discards it on confirmed Cancel', async () => {
    const { harness, input, enter, cancel } = await render();
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    enter('Unsaved');
    cancel();
    await harness.fixture.whenStable();

    expect(confirm).toHaveBeenCalledOnce();
    expect(TestBed.inject(Router).url).toBe(changeUrl);
    expect(input().value).toBe('Unsaved');
    confirm.mockReturnValue(true);
    cancel();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe(manageUrl);
    expect(api.updateApr).not.toHaveBeenCalled();
  });

  it.each([
    [32, 'CONSOLIDATED'],
    [33, 'AMALGAMATED'],
  ] as const)(
    'changes inherited reference %s with relationship %s using the master account and captured ETag',
    async (referenceId, relationship) => {
      const enteredText = ' Inherited-Edit ';
      api.updateApr.mockReturnValue(
        of({
          reference: { ...reference, alternate_payment_reference_id: referenceId, relationship, apr_text: enteredText },
          version: '"10"',
        }),
      );
      const { harness, input, enter, save } = await render(changeUrl.replace('Id=11', `Id=${referenceId}`));
      expect(input().value).toBe('Original');
      expect(harness.routeNativeElement?.textContent).toContain('141A - APR TEST 141');

      enter(enteredText);
      save();
      await harness.fixture.whenStable();

      expect(api.updateApr).toHaveBeenCalledExactlyOnceWith(141, referenceId, { apr_text: enteredText }, '"9"');
      expect(api.createApr).not.toHaveBeenCalled();
      expect(api.clearAccountDetailsCache).toHaveBeenCalledOnce();
      expect(accountStore.base_version()).toBe('"10"');
      expect(accountStore.successMessage()).toBe('Alternate payment reference updated');
      expect(TestBed.inject(Router).url).toBe(manageUrl);
    },
  );

  it('keeps Save locked after PATCH completes while Manage is still resolving', async () => {
    const manageResult = new Subject<IOpalFinesAprsResponse>();
    manageAprs$ = manageResult;
    const { harness, component, enter, save } = await render();
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate');
    const resolvingManage = firstValueFrom(
      router.events.pipe(filter((event) => event instanceof ResolveStart && event.url === manageUrl)),
    );
    enter('Changed-Reference');
    save();
    await resolvingManage;
    harness.detectChanges();

    expect(manageResult.observed).toBe(true);
    expect(router.url).toBe(changeUrl);
    expect(accountStore.base_version()).toBe('"8"');
    expect(component.pending()).toBe(true);
    expect((harness.routeNativeElement!.querySelector('#apr-save') as HTMLButtonElement).disabled).toBe(true);
    save();
    component.handleSubmit({ formData: { apr_text: 'Changed-Reference' }, nestedFlow: false });
    expect(api.updateApr).toHaveBeenCalledExactlyOnceWith(141, 11, { apr_text: 'Changed-Reference' }, '"7"');
    expect(api.createApr).not.toHaveBeenCalled();

    manageResult.next({ references: [changeResponse.reference], version: changeResponse.version });
    manageResult.complete();
    await navigate.mock.results[0].value;
    expect(router.url).toBe(manageUrl);
  });

  it('allows only one pending update and disables Save', async () => {
    api.updateApr.mockReturnValue(new Subject<IOpalFinesAprResponse>());
    const { harness, component, enter, save } = await render();
    enter('Pending');
    save();
    harness.detectChanges();
    component.handleSubmit({ formData: { apr_text: 'Pending' }, nestedFlow: false });

    expect(api.updateApr).toHaveBeenCalledOnce();
    expect(component.pending()).toBe(true);
    expect((harness.routeNativeElement!.querySelector('#apr-save') as HTMLButtonElement).matches(':disabled')).toBe(
      true,
    );
  });

  it('retains changed text, the baseline and dirty warning after a retryable processing failure', async () => {
    api.updateApr.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 503, error: { retriable: true } })));
    const { component, input, enter, save } = await render();
    enter('Retry-Value');
    save();

    expect(component.pending()).toBe(false);
    expect(component.stateUnsavedChanges).toBe(true);
    expect(component.savedValue()).toBe('Original');
    expect(input().value).toBe('Retry-Value');
    expect(accountStore.base_version()).toBe('"7"');
    expect(accountStore.successMessage()).toBeNull();
    expect(api.clearAccountDetailsCache).not.toHaveBeenCalled();
    expect(utils.scrollToTop).toHaveBeenCalledOnce();
    expect(TestBed.inject(Router).url).toBe(changeUrl);
  });

  it.each(['12', '999'])(
    'keeps the selected reference and edits when query-only navigation to %s is declined',
    async (selectedId) => {
      const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const { harness, component, input, enter, save } = await render();
      const originalContext = component.formContext();
      enter('Keep-This-Edit');

      const router = TestBed.inject(Router);
      const navigated = await router.navigateByUrl(changeUrl.replace('Id=11', `Id=${selectedId}`));
      await harness.fixture.whenStable();

      expect(navigated).toBe(false);
      expect(confirm).toHaveBeenCalledOnce();
      expect(router.url).toBe(changeUrl);
      expect(component.formContext()).toBe(originalContext);
      expect(component.savedValue()).toBe('Original');
      expect(component.stateUnsavedChanges).toBe(true);
      expect(input().value).toBe('Keep-This-Edit');
      expect(accountStore.base_version()).toBe('"7"');
      expect(api.updateApr).not.toHaveBeenCalled();

      save();
      await harness.fixture.whenStable();

      expect(api.updateApr).toHaveBeenCalledExactlyOnceWith(141, 11, { apr_text: 'Keep-This-Edit' }, '"7"');
    },
  );

  it('keeps a pending update active when a selected-reference change is declined', async () => {
    const result = new Subject<IOpalFinesAprResponse>();
    api.updateApr.mockReturnValue(result);
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const { harness, component, input, enter, save } = await render();
    enter('Pending-Edit');
    save();

    const router = TestBed.inject(Router);
    const navigated = await router.navigateByUrl(changeUrl.replace('Id=11', 'Id=12'));

    expect(navigated).toBe(false);
    expect(confirm).toHaveBeenCalledOnce();
    expect(router.url).toBe(changeUrl);
    expect(result.observed).toBe(true);
    expect(component.pending()).toBe(true);
    expect(input().value).toBe('Pending-Edit');
    expect(api.updateApr).toHaveBeenCalledExactlyOnceWith(141, 11, { apr_text: 'Pending-Edit' }, '"7"');

    result.next(changeResponse);
    result.complete();
    await harness.fixture.whenStable();

    expect(router.url).toBe(manageUrl);
    expect(accountStore.successMessage()).toBe('Alternate payment reference updated');
  });

  it('changes the selected reference after the user confirms discarding their edits', async () => {
    const { harness, component, input, enter, save } = await render();
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    enter('Discard-First');

    const reused = await harness.navigateByUrl(changeUrl.replace('Id=11', 'Id=12'), FinesAccAprAddChangeComponent);

    expect(confirm).toHaveBeenCalledOnce();
    expect(reused).toBe(component);
    expect(component.stateUnsavedChanges).toBe(false);
    expect(component.savedValue()).toBe('Second');
    expect(input().value).toBe('Second');
    enter('Changed-Second');
    save();
    await harness.fixture.whenStable();
    expect(api.updateApr).toHaveBeenCalledExactlyOnceWith(141, 12, { apr_text: 'Changed-Second' }, '"9"');
  });

  it('changes a pristine selected reference without prompting and refreshes its account version', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const { harness, component, input } = await render();
    const nextUrl = changeUrl.replace('Id=11', 'Id=12');

    const reused = await harness.navigateByUrl(nextUrl, FinesAccAprAddChangeComponent);

    expect(reused).toBe(component);
    expect(confirm).not.toHaveBeenCalled();
    expect(TestBed.inject(Router).url).toBe(nextUrl);
    expect(component.savedValue()).toBe('Second');
    expect(component.stateUnsavedChanges).toBe(false);
    expect(input().value).toBe('Second');
    expect(accountStore.base_version()).toBe('"9"');
    expect(api.updateApr).not.toHaveBeenCalled();
  });

  it.each(['invalid', '999', '31', '34', '35'])(
    'returns query-only selection %s to Manage when it is missing or cannot be changed',
    async (selectedId) => {
      const { harness } = await render();

      await harness.navigateByUrl(changeUrl.replace('Id=11', `Id=${selectedId}`));
      await harness.fixture.whenStable();

      expect(TestBed.inject(Router).url).toBe(manageUrl);
      expect(api.updateApr).not.toHaveBeenCalled();
      expect(api.createApr).not.toHaveBeenCalled();
    },
  );

  it('reloads the account caption, selected reference and version when the account changes', async () => {
    const { harness, component, input, enter, save } = await render();
    const nextUrl = changeUrl.replace('/141/', '/142/').replace('Id=11', 'Id=21');

    const reused = await harness.navigateByUrl(nextUrl, FinesAccAprAddChangeComponent);

    expect(reused).toBe(component);
    expect(harness.routeNativeElement!.textContent).toContain('142A - APR TEST 142');
    expect(input().value).toBe('Other-Account');
    enter('New-Account');
    save();
    await harness.fixture.whenStable();
    expect(api.updateApr).toHaveBeenCalledExactlyOnceWith(142, 21, { apr_text: 'New-Account' }, '"9"');
    expect(TestBed.inject(Router).url).toBe(manageUrl.replace('/141/', '/142/'));
  });

  it('cancels an old pending update when the selected reference changes so its response cannot mutate new page state', async () => {
    const result = new Subject<IOpalFinesAprResponse>();
    api.updateApr.mockReturnValue(result);
    const { harness, component, input, enter, save } = await render();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    enter('Old-Pending');
    save();
    const nextUrl = changeUrl.replace('Id=11', 'Id=12');

    await harness.navigateByUrl(nextUrl, FinesAccAprAddChangeComponent);
    result.next(changeResponse);

    expect(result.observed).toBe(false);
    expect(component.pending()).toBe(false);
    expect(component.stateUnsavedChanges).toBe(false);
    expect(input().value).toBe('Second');
    expect(accountStore.base_version()).toBe('"9"');
    expect(accountStore.successMessage()).toBeNull();
    expect(api.clearAccountDetailsCache).not.toHaveBeenCalled();
    expect(TestBed.inject(Router).url).toBe(nextUrl);
  });

  it('reuses one parent across Add, Change and Add with an identical resolver object, refreshing each form context and cancelling the old PATCH', async () => {
    reuseResolvedData = true;
    const pendingUpdate = new Subject<IOpalFinesAprResponse>();
    api.updateApr.mockReturnValue(pendingUpdate);
    const { harness, component, input, enter, save } = await render(addUrl);
    const resolvedData = component.formContext()['aprs'];
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    expect(component.mode()).toBe('add');
    expect(component.savedValue()).toBe('');
    expect(input().value).toBe('');
    expect(harness.routeNativeElement!.querySelector('h1')!.textContent).toContain('Add Alternate Payment Reference');
    expect(harness.routeNativeElement!.querySelector('label')!.textContent.trim()).toBe('Enter payment reference');
    enter('1234567890123456789');
    save();
    expect(harness.routeNativeElement!.querySelector('.govuk-error-summary')).not.toBeNull();

    const change = await harness.navigateByUrl(changeUrl, FinesAccAprAddChangeComponent);

    expect(change).toBe(component);
    expect(component.formContext()['aprs']).toBe(resolvedData);
    expect(component.mode()).toBe('change');
    expect(component.savedValue()).toBe('Original');
    expect(input().value).toBe('Original');
    expect(component.stateUnsavedChanges).toBe(false);
    expect(harness.routeNativeElement!.querySelector('.govuk-error-summary')).toBeNull();
    expect(harness.routeNativeElement!.querySelector('h1')!.textContent).toContain(
      'Change Alternate Payment Reference',
    );
    expect(harness.routeNativeElement!.querySelector('label')!.textContent.trim()).toBe(
      'Change alternate payment reference',
    );
    enter('Pending-Change');
    save();
    harness.detectChanges();
    expect(api.updateApr).toHaveBeenCalledExactlyOnceWith(141, 11, { apr_text: 'Pending-Change' }, '"9"');
    expect(api.createApr).not.toHaveBeenCalled();
    expect(component.pending()).toBe(true);

    const add = await harness.navigateByUrl(addUrl, FinesAccAprAddChangeComponent);
    pendingUpdate.next(changeResponse);

    expect(add).toBe(component);
    expect(component.formContext()['aprs']).toBe(resolvedData);
    expect(pendingUpdate.observed).toBe(false);
    expect(component.mode()).toBe('add');
    expect(component.pending()).toBe(false);
    expect(component.initialValue()).toBe('');
    expect(component.savedValue()).toBe('');
    expect(component.stateUnsavedChanges).toBe(false);
    expect(input().value).toBe('');
    expect(harness.routeNativeElement!.querySelector('.govuk-error-summary')).toBeNull();
    expect(harness.routeNativeElement!.querySelector('h1')!.textContent).toContain('Add Alternate Payment Reference');
    expect(harness.routeNativeElement!.querySelector('label')!.textContent.trim()).toBe('Enter payment reference');
    expect(accountStore.base_version()).toBe('"7"');
    expect(accountStore.successMessage()).toBeNull();
    expect(api.clearAccountDetailsCache).not.toHaveBeenCalled();
    enter('Added-After-Change');
    save();
    await harness.fixture.whenStable();

    expect(api.createApr).toHaveBeenCalledExactlyOnceWith(141, { apr_text: 'Added-After-Change' }, '"7"');
    expect(accountStore.successMessage()).toBe('Alternate payment reference added');
    expect(TestBed.inject(Router).url).toBe(manageUrl);
  });

  it('cancels a pending Add when the same parent becomes Change so a late POST cannot overwrite its selected reference', async () => {
    const pendingCreate = new Subject<IOpalFinesAprResponse>();
    api.createApr.mockReturnValue(pendingCreate);
    const { harness, component, input, enter, save } = await render(addUrl);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    enter('Pending-Add');
    save();

    const change = await harness.navigateByUrl(changeUrl, FinesAccAprAddChangeComponent);
    pendingCreate.next(changeResponse);

    expect(change).toBe(component);
    expect(pendingCreate.observed).toBe(false);
    expect(component.pending()).toBe(false);
    expect(component.mode()).toBe('change');
    expect(component.savedValue()).toBe('Original');
    expect(input().value).toBe('Original');
    expect(component.stateUnsavedChanges).toBe(false);
    expect(accountStore.base_version()).toBe('"7"');
    expect(accountStore.successMessage()).toBeNull();
    expect(api.clearAccountDetailsCache).not.toHaveBeenCalled();
    expect(TestBed.inject(Router).url).toBe(changeUrl);
    enter('Changed-After-Add');
    save();
    await harness.fixture.whenStable();

    expect(api.updateApr).toHaveBeenCalledExactlyOnceWith(141, 11, { apr_text: 'Changed-After-Add' }, '"7"');
    expect(accountStore.successMessage()).toBe('Alternate payment reference updated');
  });
});

describe('APR forms with the shared API error interceptor', () => {
  let http: HttpTestingController;
  let accountStore: InstanceType<typeof FinesAccountStore>;
  let globalStore: InstanceType<typeof GlobalStore>;

  const duplicateProblem = {
    status: 422,
    type: 'https://hmcts.gov.uk/problems/BusinessRuleViolationException',
    title: 'Alternate Payment Reference text already exists in business unit',
    detail: 'This payment reference is already used in this business unit.',
    is_warning: true,
    is_retryable: false,
  };
  const render = async (mode: 'add' | 'change') => {
    const url = mode === 'add' ? addUrl : changeUrl;
    const requestUrl = `/opal-fines-service/defendant-accounts/141/alternate-payment-references${mode === 'change' ? '/11' : ''}`;
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(url, FinesAccAprAddChangeComponent);
    const input = harness.routeNativeElement!.querySelector('#apr_text') as HTMLInputElement;
    input.value = 'Taken-Reference';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    harness
      .routeNativeElement!.querySelector('form')!
      .dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    const request = await vi.waitFor(() => http.expectOne(requestUrl));
    expect(request.request.method).toBe(mode === 'add' ? 'POST' : 'PATCH');
    expect(request.request.serializeBody()).toBe(JSON.stringify({ apr_text: 'Taken-Reference' }));
    expect(request.request.headers.get('If-Match')).toBe('"7"');
    return { harness, component, input, request, requestUrl, url };
  };

  beforeEach(async () => {
    vi.stubGlobal('crypto', { subtle: { digest: async () => new ArrayBuffer(64) } });
    const formRoute = routing.find((route) => route.path === `${FINES_ACC_APR_ROUTING_PATHS.root}/:mode`)!;
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor, contentDigestInterceptor, httpRetryInterceptor])),
        provideHttpClientTesting(),
        { provide: AppInsightsService, useValue: { logException: vi.fn() } },
        { provide: UtilsService, useValue: { scrollToTop: vi.fn() } },
        provideRouter([
          {
            path: 'fines/account/defendant/:accountId',
            children: [
              {
                ...formRoute,
                canActivate: [],
                resolve: {
                  aprs: (route: ActivatedRouteSnapshot) => ({
                    references: route.paramMap.get('mode') === 'change' ? [reference] : [],
                    version: '"7"',
                  }),
                },
              },
              { path: `${FINES_ACC_APR_ROUTING_PATHS.root}/manage`, component: ManagePageComponent },
            ],
          },
          { path: 'error/internal-server', component: ManagePageComponent },
        ]),
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    accountStore = TestBed.inject(FinesAccountStore);
    globalStore = TestBed.inject(GlobalStore);
    accountStore.setAccountState({ ...MOCK_FINES_ACCOUNT_STATE, account_id: 141, base_version: '"7"' });
  });

  afterEach(() => {
    http.verify();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it.each(['add', 'change'] as const)(
    'retains the generic redirect for an explicitly non-retriable %s error',
    async (mode) => {
      const { harness, component, request, requestUrl } = await render(mode);
      const confirm = vi.spyOn(window, 'confirm');

      request.flush({ ...duplicateProblem, retriable: false }, { status: 422, statusText: 'Unprocessable Content' });
      await harness.fixture.whenStable();

      expect(TestBed.inject(Router).url).toBe('/error/internal-server');
      expect(component.pending()).toBe(false);
      expect(component.stateUnsavedChanges).toBe(false);
      expect(confirm).not.toHaveBeenCalled();
      expect(globalStore.bannerError().error).toBeFalsy();
      expect(accountStore.successMessage()).toBeNull();
      http.expectNone(requestUrl);
    },
  );
});
