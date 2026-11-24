import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, type Routes } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authenticatedAccountGuard } from '@hmcts/opal-frontend-common/guards/account';
import { REDIRECT_TO_SSO, REDIRECT_TO_SSO_LOGOUT } from '@hmcts/opal-frontend-common/guards/auth';
import { signedInGuard } from '@hmcts/opal-frontend-common/guards/signed-in';
import { SSO_ENDPOINTS } from '@hmcts/opal-frontend-common/services/auth-service/constants';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

const USER_STATE_ENDPOINT = '/api/user-state';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class TestRouteComponent {}

const routes: Routes = [
  {
    path: 'fines',
    component: TestRouteComponent,
    canActivateChild: [authenticatedAccountGuard],
    children: [
      {
        path: 'accounts/:accountId',
        component: TestRouteComponent,
        children: [
          { path: 'overview', component: TestRouteComponent },
          { path: 'history', component: TestRouteComponent },
        ],
      },
    ],
  },
  { path: 'sign-in', component: TestRouteComponent, canActivate: [signedInGuard] },
];

const userStateResponse = {
  user_id: 1,
  username: 'test-user',
  name: 'Test user',
  status: 'ACTIVE',
  version: 1,
  cache_name: null,
  domains: { fines: { business_unit_users: [] } },
};

describe('fines authentication routing', () => {
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: REDIRECT_TO_SSO, useValue: vi.fn() },
        { provide: REDIRECT_TO_SSO_LOGOUT, useValue: vi.fn() },
      ],
    });

    const globalStore = TestBed.inject(GlobalStore);
    globalStore.setSsoEnabled(false);
    globalStore.setUserStateDomain('fines');
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  it('redirects a 200 false nested deep link without requesting user state', async () => {
    const navigation = router.navigateByUrl('/fines/accounts/1/overview');
    await new Promise((resolve) => setTimeout(resolve));

    httpMock.expectNone(USER_STATE_ENDPOINT);
    httpMock.expectOne(SSO_ENDPOINTS.authenticated).flush(false);

    await expect(navigation).resolves.toBe(true);
    expect(router.url).toBe('/sign-in');
    httpMock.expectNone(SSO_ENDPOINTS.authenticated);
    httpMock.expectNone(USER_STATE_ENDPOINT);
    httpMock.verify();
  });

  it('redirects a legacy 401 nested deep link without requesting user state', async () => {
    const navigation = router.navigateByUrl('/fines/accounts/1/overview');
    await new Promise((resolve) => setTimeout(resolve));

    httpMock.expectOne(SSO_ENDPOINTS.authenticated).flush(false, { status: 401, statusText: 'Unauthorized' });

    await expect(navigation).resolves.toBe(true);
    expect(router.url).toBe('/sign-in');
    httpMock.expectNone(SSO_ENDPOINTS.authenticated);
    httpMock.expectNone(USER_STATE_ENDPOINT);
    httpMock.verify();
  });

  it('makes one authentication request per navigation and reuses cached user state', async () => {
    const firstNavigation = router.navigateByUrl('/fines/accounts/1/overview');
    await new Promise((resolve) => setTimeout(resolve));

    httpMock.expectNone(USER_STATE_ENDPOINT);
    httpMock.expectOne(SSO_ENDPOINTS.authenticated).flush(true);
    httpMock.expectOne(USER_STATE_ENDPOINT).flush(userStateResponse);

    await expect(firstNavigation).resolves.toBe(true);
    expect(router.url).toBe('/fines/accounts/1/overview');
    httpMock.expectNone(SSO_ENDPOINTS.authenticated);

    const secondNavigation = router.navigateByUrl('/fines/accounts/1/history');
    await new Promise((resolve) => setTimeout(resolve));
    httpMock.expectOne(SSO_ENDPOINTS.authenticated).flush(true);

    await expect(secondNavigation).resolves.toBe(true);
    expect(router.url).toBe('/fines/accounts/1/history');
    httpMock.expectNone(SSO_ENDPOINTS.authenticated);
    httpMock.expectNone(USER_STATE_ENDPOINT);
    httpMock.verify();
  });
});
