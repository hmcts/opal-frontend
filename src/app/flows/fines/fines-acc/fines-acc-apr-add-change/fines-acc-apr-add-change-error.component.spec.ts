import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterOutlet } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { httpRetryInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-retry';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { finesAccAprHttpErrorInterceptor } from '@app/interceptors/fines-acc-apr-http-error.interceptor';
import { FinesAccComponent } from '../fines-acc.component';
import { FINES_ACC_APR_DUPLICATE_MESSAGE } from '../fines-acc-apr-error/constants/fines-acc-apr-error-message.constant';
import { IFinesAccAprErrorContext } from '../fines-acc-apr-error/interfaces/fines-acc-apr-error-context.interface';
import { MOCK_FINES_ACCOUNT_STATE } from '../mocks/fines-acc-state.mock';
import { routing as accountRouting } from '../routing/fines-acc.routes';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccAprAddChangeComponent } from './fines-acc-apr-add-change.component';
import { FINES_ACC_APR_ROUTING_PATHS } from '../fines-acc-apr-manage/constants/fines-acc-apr-routing-paths.constant';

const routing = accountRouting
  .flatMap((route) => route.children ?? [])
  .flatMap((route) => route.children ?? [])
  .find((route) => route.path === FINES_ACC_APR_ROUTING_PATHS.root)!.children!;

@Component({ template: 'APR manage destination' })
class AprErrorManageDestinationComponent {}

@Component({ selector: 'app-standard-error-test-destination', template: 'Standard error destination' })
class StandardErrorDestinationComponent {}

const root = '/fines/account/defendant/141/alternate/payment/reference';
const postUrl = '/opal-fines-service/defendant-accounts/141/alternate-payment-references';
const duplicateProblem = {
  type: 'https://hmcts.gov.uk/problems/BusinessRuleViolationException',
  title: 'Alternate Payment Reference text already exists in business unit',
};

describe('Alternate payment reference Add and Error integration', () => {
  let http: HttpTestingController;
  let accountStore: InstanceType<typeof FinesAccountStore>;
  let globalStore: { setBannerError: ReturnType<typeof vi.fn>; resetBannerError: ReturnType<typeof vi.fn> };
  let insights: { logException: ReturnType<typeof vi.fn> };

  const renderAdd = async () => {
    const harness = await RouterTestingHarness.create();
    const wrapper = await harness.navigateByUrl(`${root}/add`, FinesAccComponent);
    const activeAdd = () =>
      harness.routeDebugElement!.query(By.directive(RouterOutlet)).injector.get(RouterOutlet)
        .component as FinesAccAprAddChangeComponent;
    const enter = (value: string) => {
      const input = harness.routeNativeElement!.querySelector('#apr_text') as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const save = () =>
      harness
        .routeNativeElement!.querySelector('form')!
        .dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    return { harness, wrapper, activeAdd, enter, save };
  };

  beforeEach(async () => {
    globalStore = { setBannerError: vi.fn(), resetBannerError: vi.fn() };
    insights = { logException: vi.fn() };
    const formRoute = routing.find((route) => route.path === ':mode')!;
    const errorRoute = routing.find((route) => route.path === 'error')!;
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([finesAccAprHttpErrorInterceptor, httpRetryInterceptor])),
        provideHttpClientTesting(),
        { provide: GlobalStore, useValue: globalStore },
        { provide: AppInsightsService, useValue: insights },
        { provide: UtilsService, useValue: { scrollToTop: vi.fn() } },
        provideRouter([
          { path: 'error/:type', component: StandardErrorDestinationComponent },
          {
            path: 'fines/account',
            component: FinesAccComponent,
            children: [
              {
                path: 'defendant/:accountId/alternate/payment/reference',
                children: [
                  { ...errorRoute, canActivate: [] },
                  { path: 'manage', component: AprErrorManageDestinationComponent },
                  {
                    ...formRoute,
                    canActivate: [],
                    resolve: {
                      aprs: (route: ActivatedRouteSnapshot) => {
                        TestBed.inject(FinesAccountStore).setAccountState({
                          ...MOCK_FINES_ACCOUNT_STATE,
                          account_id: Number(route.paramMap.get('accountId')),
                          base_version: '"7"',
                        });
                        return { references: [], version: '"7"' };
                      },
                    },
                  },
                ],
              },
            ],
          },
        ]),
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    accountStore = TestBed.inject(FinesAccountStore);
  });

  afterEach(() => {
    http.verify();
    vi.restoreAllMocks();
  });

  it.each([undefined, false])(
    'takes a duplicate Save to the real error page without a leave warning or global error for retriable=%s',
    async (retriable) => {
      const { harness, wrapper, activeAdd, enter, save } = await renderAdd();
      const add = activeAdd();
      const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
      enter(' AbC-123 ');
      save();
      const request = http.expectOne(postUrl);
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual({ apr_text: ' AbC-123 ' });
      expect(request.request.headers.get('If-Match')).toBe('"7"');

      request.flush({ ...duplicateProblem, retriable }, { status: 422, statusText: 'Unprocessable Entity' });
      await harness.fixture.whenStable();
      harness.detectChanges();

      expect(TestBed.inject(Router).url).toBe(`${root}/error`);
      expect(harness.routeNativeElement!.querySelector('#apr-error-message')?.textContent?.trim()).toBe(
        'The payment reference already exists',
      );
      expect(add.stateUnsavedChanges).toBe(false);
      expect(wrapper.handleBeforeUnload()).toBe(true);
      expect(confirm).not.toHaveBeenCalled();
      expect(globalStore.setBannerError).not.toHaveBeenCalled();
      expect(insights.logException).not.toHaveBeenCalled();
      http.expectNone(postUrl);
    },
  );

  it('restores the exact rejected value on Go back and protects it on Cancel and browser unload', async () => {
    const { harness, activeAdd, enter, save } = await renderAdd();
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    enter(' AbC-123 ');
    save();
    http.expectOne(postUrl).flush(duplicateProblem, { status: 422, statusText: 'Unprocessable Entity' });
    await harness.fixture.whenStable();
    harness.detectChanges();

    (harness.routeNativeElement!.querySelector('#apr-error-back') as HTMLAnchorElement).click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe(`${root}/add`);
    expect((harness.routeNativeElement!.querySelector('#apr_text') as HTMLInputElement).value).toBe(' AbC-123 ');
    expect(activeAdd().stateUnsavedChanges).toBe(true);
    expect(accountStore.aprErrorContext()).toBeNull();
    expect(confirm).not.toHaveBeenCalled();
    const unload = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(unload);
    expect(unload.defaultPrevented).toBe(true);

    (harness.routeNativeElement!.querySelector('opal-lib-govuk-cancel-link a') as HTMLAnchorElement).click();
    await harness.fixture.whenStable();
    expect(confirm).toHaveBeenCalledOnce();
    expect(TestBed.inject(Router).url).toBe(`${root}/add`);
    expect((harness.routeNativeElement!.querySelector('#apr_text') as HTMLInputElement).value).toBe(' AbC-123 ');

    confirm.mockReturnValue(true);
    (harness.routeNativeElement!.querySelector('opal-lib-govuk-cancel-link a') as HTMLAnchorElement).click();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe(`${root}/manage`);
    await harness.navigateByUrl(`${root}/add`);
    expect((harness.routeNativeElement!.querySelector('#apr_text') as HTMLInputElement).value).toBe('');
    expect(activeAdd().stateUnsavedChanges).toBe(false);
    http.expectNone(postUrl);
  });

  it.each([
    { accountId: 142, action: 'add' },
    { accountId: 141, action: 'change', referenceId: 11 },
    { accountId: 141, action: 'add', referenceId: 11 },
  ] as const)('does not restore a draft scoped to another account, action or reference: %j', async (scope) => {
    accountStore.setAprErrorContext({
      ...scope,
      text: 'OTHER-DRAFT',
      message: FINES_ACC_APR_DUPLICATE_MESSAGE,
    } satisfies IFinesAccAprErrorContext);

    const { harness, activeAdd } = await renderAdd();

    expect((harness.routeNativeElement!.querySelector('#apr_text') as HTMLInputElement).value).toBe('');
    expect(activeAdd().stateUnsavedChanges).toBe(false);
    expect(accountStore.aprErrorContext()).toBeNull();
  });

  it('keeps entered text and ordinary shared technical-error feedback after a non-duplicate failure', async () => {
    const { harness, activeAdd, enter, save } = await renderAdd();
    enter('Retry-Reference');
    save();

    http
      .expectOne(postUrl)
      .flush(
        { title: 'Temporary failure', detail: 'Test technical failure' },
        { status: 503, statusText: 'Service Unavailable' },
      );
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(`${root}/add`);
    expect((harness.routeNativeElement!.querySelector('#apr_text') as HTMLInputElement).value).toBe('Retry-Reference');
    expect(activeAdd().stateUnsavedChanges).toBe(true);
    expect(globalStore.setBannerError).toHaveBeenCalledOnce();
    expect(insights.logException).toHaveBeenCalledOnce();
    expect(accountStore.aprErrorContext()).toBeNull();
    http.expectNone(postUrl);
  });

  it.each([
    [409, '/error/concurrency-failure'],
    [403, '/error/permission-denied'],
    [500, '/error/internal-server'],
  ] as const)(
    'allows the shared non-retriable %s redirect without prompting to discard the failed submission',
    async (status, destination) => {
      const { harness, activeAdd, enter, save } = await renderAdd();
      const add = activeAdd();
      const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
      enter('Unsaved-Reference');
      expect(add.stateUnsavedChanges).toBe(true);
      save();

      http
        .expectOne(postUrl)
        .flush({ title: 'Test non-retriable failure', retriable: false }, { status, statusText: 'Test failure' });
      await harness.fixture.whenStable();

      expect(TestBed.inject(Router).url).toBe(destination);
      expect(add.stateUnsavedChanges).toBe(false);
      expect(confirm).not.toHaveBeenCalled();
      expect(globalStore.setBannerError).not.toHaveBeenCalled();
      expect(insights.logException).toHaveBeenCalledOnce();
      http.expectNone(postUrl);
    },
  );
});
