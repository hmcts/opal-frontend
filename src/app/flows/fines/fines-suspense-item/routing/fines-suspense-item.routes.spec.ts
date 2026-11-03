import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { provideRouter, Router, RouterLink } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesSuspenseItemSearchComponent } from '../fines-suspense-item-search/fines-suspense-item-search.component';
import { routing } from './fines-suspense-item.routes';

import { finesRouting } from '../../routing/fines.routes';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { RELEASE_1C_SUSPENSE_FEATURE_FLAG } from '../../constants/release-feature-flags.constant';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { of } from 'rxjs';

import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';

@Component({
  imports: [RouterLink],
  template: '<h1>Finance</h1><a routerLink="/fines/suspense-item/search">Manage Suspense Items</a>',
})
class TestFinanceComponent {}

describe('Suspense item navigation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'fines/suspense-item', children: routing },
          { path: 'fines/dashboard/finance', component: TestFinanceComponent },
        ]),
      ],
    });
  });

  it('redirects the suspense root to the search screen', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/fines/suspense-item', FinesSuspenseItemSearchComponent);

    expect(TestBed.inject(Router).url).toBe('/fines/suspense-item/search');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Search for suspense item');
  });

  it('opens the search URL with a page title, unavailable message and link back to Finance', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/fines/suspense-item/search', FinesSuspenseItemSearchComponent);

    expect(TestBed.inject(Title).getTitle()).toBe('OPAL - Search for suspense item');
    expect(harness.routeNativeElement?.querySelector('p')?.textContent).toBe('This page is not available yet.');
    const backLink = harness.routeNativeElement?.querySelector('a');
    expect(backLink?.textContent).toBe('Back to finance');
    expect(backLink?.getAttribute('href')).toBe('/fines/dashboard/finance');
  });

  it('returns to Finance when the back link is selected', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/fines/suspense-item/search', FinesSuspenseItemSearchComponent);

    const backLink = harness.routeNativeElement?.querySelector<HTMLAnchorElement>('a');
    expect(backLink).not.toBeNull();
    backLink!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/fines/dashboard/finance');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Finance');
  });
});

@Component({ template: '<h1>Access denied</h1>' })
class TestAccessDeniedComponent {}

describe('Suspense entry access', () => {
  let suspenseEnabled: boolean;
  let permissionIds: number[];

  beforeEach(() => {
    suspenseEnabled = true;
    permissionIds = [24];
    const suspenseRoute = finesRouting
      .find((route) => route.children)
      ?.children?.find((route) => route.path === FINES_ROUTING_PATHS.children.suspenseItem.root);
    if (!suspenseRoute) {
      throw new Error('Suspense entry route is missing');
    }

    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            ...suspenseRoute,
            path: 'fines/suspense-item',
            // Authentication is covered separately; retain the actual feature and permission guards.
            canActivate: suspenseRoute.canActivate?.filter((guard) => guard !== authGuard),
          },
          { path: 'fines/dashboard/finance', component: TestFinanceComponent },
          { path: 'access-denied', component: TestAccessDeniedComponent },
        ]),
        {
          provide: GlobalStore,
          useValue: { featureFlags: () => ({ [RELEASE_1C_SUSPENSE_FEATURE_FLAG]: suspenseEnabled }) },
        },
        { provide: LaunchDarklyService, useValue: {} },
        {
          provide: OpalUserService,
          useValue: {
            getLoggedInUserState: () => {
              const userState = structuredClone(OPAL_USER_STATE_MOCK);
              userState.business_unit_users = [
                {
                  ...userState.business_unit_users[0],
                  permissions: permissionIds.map((id) => ({ permission_id: id, permission_name: `Permission ${id}` })),
                },
              ];
              return of(userState);
            },
          },
        },
      ],
    });
  });

  it.each([
    { enabled: true, permissions: [24], allowed: true },
    { enabled: true, permissions: [25], allowed: true },
    { enabled: true, permissions: [24, 25], allowed: true },
    { enabled: true, permissions: [], allowed: false },
    { enabled: true, permissions: [16, 18, 19], allowed: false },
    { enabled: false, permissions: [24], allowed: false },
    { enabled: false, permissions: [25], allowed: false },
    { enabled: false, permissions: [24, 25], allowed: false },
    { enabled: false, permissions: [], allowed: false },
  ])(
    'direct entry: enabled=$enabled, permissions=$permissions, allowed=$allowed',
    async ({ enabled, permissions, allowed }) => {
      suspenseEnabled = enabled;
      permissionIds = permissions;
      const harness = await RouterTestingHarness.create();

      await harness.navigateByUrl('/fines/suspense-item/search');

      expect(TestBed.inject(Router).url).toBe(allowed ? '/fines/suspense-item/search' : '/access-denied');
      expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe(
        allowed ? 'Search for suspense item' : 'Access denied',
      );
    },
  );

  it.each([true, false])('checks permissions when a Finance link is clicked (allowed=%s)', async (allowed) => {
    permissionIds = allowed ? [25] : [];
    const harness = await RouterTestingHarness.create('/fines/dashboard/finance');

    harness.routeNativeElement?.querySelector<HTMLAnchorElement>('a')?.click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(allowed ? '/fines/suspense-item/search' : '/access-denied');
  });
});
