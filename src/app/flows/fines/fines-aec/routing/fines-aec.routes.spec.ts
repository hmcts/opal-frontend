import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { FINES_PERMISSIONS } from '@constants/fines-permissions.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-enforcement-account-types.mock';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RELEASE_1C_ADMINISTRATION_FEATURE_FLAG } from '../../constants/release-feature-flags.constant';
import { finesSectionPermissionsGuard } from '../../routing/guards/fines-section-permissions/fines-section-permissions.guard';
import { FinesAecComponent } from '../fines-aec.component';
import { FinesAecStore } from '../stores/fines-aec.store';
import { FinesAecConfigComponent } from '../fines-aec-config/fines-aec-config.component';
import { FinesAecPlaceholderComponent } from '../fines-aec-placeholder/fines-aec-placeholder.component';
import { FINES_AEC_ROUTING_PATHS } from './constants/fines-aec-routing-paths.constant';
import { FINES_AEC_ROUTING_TITLES } from './constants/fines-aec-routing-titles.constant';
import { routing } from './fines-aec.routes';

@Component({ selector: 'app-aec-test-access-denied', template: '<h1>Access denied</h1>' })
class AccessDeniedTestComponent {}

@Component({ selector: 'app-aec-test-outside', template: '<h1>Outside Auto-enforcement</h1>' })
class OutsideAutoEnforcementTestComponent {}

describe('fines aec routes', () => {
  it('should redirect the Auto-Enforcement root to configuration', () => {
    const rootRoute = routing.find((route) => route.path === '');

    expect(rootRoute?.redirectTo).toBe(FINES_AEC_ROUTING_PATHS.children.config);
    expect(rootRoute?.pathMatch).toBe('full');
  });

  it('should protect and title the Auto-Enforcement configuration route', () => {
    const configRoute = routing.find((route) => route.path === FINES_AEC_ROUTING_PATHS.children.config);

    expect(configRoute?.canActivate).toEqual([authGuard, routePermissionsGuard]);
    expect(configRoute?.data).toEqual({
      routePermissionId: [FINES_PERMISSIONS['auto-enforcement']],
      title: FINES_AEC_ROUTING_TITLES.children.config,
    });
    expect(configRoute?.resolve).toEqual({ title: TitleResolver });
  });

  it('should lazy-load the Auto-Enforcement configuration component', async () => {
    const configRoute = routing.find((route) => route.path === FINES_AEC_ROUTING_PATHS.children.config);

    await expect(configRoute?.loadComponent?.()).resolves.toBe(FinesAecConfigComponent);
  });

  it.each(['navigation', 'amendValues'] as const)('protects and titles the %s placeholder route', (page) => {
    const route = routing.find((candidate) => candidate.path === FINES_AEC_ROUTING_PATHS.children[page]);

    expect(route?.canActivate).toEqual([authGuard, routePermissionsGuard]);
    expect(route?.data).toEqual({
      routePermissionId: [FINES_PERMISSIONS['auto-enforcement']],
      title: FINES_AEC_ROUTING_TITLES.children[page],
      heading: FINES_AEC_ROUTING_TITLES.children[page],
    });
    expect(route?.resolve).toEqual({ title: TitleResolver });
  });

  it.each(['navigation', 'amendValues'] as const)('lazy-loads the %s placeholder component', async (page) => {
    const route = routing.find((candidate) => candidate.path === FINES_AEC_ROUTING_PATHS.children[page]);

    await expect(route?.loadComponent?.()).resolves.toBe(FinesAecPlaceholderComponent);
  });
});

describe('Auto-enforcement configuration navigation', () => {
  const configUrl = '/fines/auto-enforcement/config';
  let globalStore: InstanceType<typeof GlobalStore>;
  let store: InstanceType<typeof FinesAecStore>;
  let opalFines: { getEnforcementAccountTypes: ReturnType<typeof vi.fn>; clearCache: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    opalFines = {
      getEnforcementAccountTypes: vi.fn(() => of(structuredClone(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK))),
      clearCache: vi.fn(),
    };

    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'fines/auto-enforcement',
            component: FinesAecComponent,
            canActivate: [finesSectionPermissionsGuard],
            data: { sectionKey: 'administration' },
            children: routing,
          },
          { path: 'access-denied', component: AccessDeniedTestComponent },
          { path: 'outside', component: OutsideAutoEnforcementTestComponent },
        ]),
        { provide: OpalFines, useValue: opalFines },
        { provide: AuthService, useValue: { checkAuthenticated: () => of(true) } },
        {
          provide: OpalUserService,
          useValue: {
            getLoggedInUserState: () => of(globalStore.userState()),
            clearUserStateCache: () => undefined,
          },
        },
      ],
    }).compileComponents();

    globalStore = TestBed.inject(GlobalStore);
    store = TestBed.inject(FinesAecStore);
    const userState = structuredClone(OPAL_USER_STATE_MOCK);
    userState.business_unit_users = userState.business_unit_users.map((businessUnitUser) => ({
      ...businessUnitUser,
      permissions: [{ permission_id: FINES_PERMISSIONS['auto-enforcement'], permission_name: 'Auto enforcement' }],
    }));
    globalStore.setAuthenticated(true);
    globalStore.setUserState(userState);
    globalStore.setFeatureFlags({ [RELEASE_1C_ADMINISTRATION_FEATURE_FLAG]: true });
  });

  const clickLink = async (harness: RouterTestingHarness, selector: string): Promise<void> => {
    const link = harness.routeNativeElement?.querySelector<HTMLAnchorElement>(selector);
    expect(link, `Expected navigation link ${selector}`).toBeTruthy();
    link!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
  };

  it.each([
    ['COL', 2],
    ['A', 4],
    ['Y', 8],
    ['CO', 6],
  ] as const)(
    'opens Change for %s with its low-path record ID and returns to Account types',
    async (accountType, id) => {
      const harness = await RouterTestingHarness.create(configUrl);
      await clickLink(harness, `#aec-change-${accountType}`);

      expect(TestBed.inject(Router).url).toBe(`/fines/auto-enforcement/amend-values?enforcementAccountTypeId=${id}`);
      expect(harness.routeNativeElement!.querySelector('#aec-placeholder-heading')?.textContent).toContain(
        'Amend enforcement values',
      );

      await clickLink(harness, '#aec-placeholder-back');

      expect(TestBed.inject(Router).url).toBe(`${configUrl}#account-types`);
      expect(harness.routeNativeElement!.querySelector('#aec-account-types-table')).toBeTruthy();
    },
  );

  it('clears the flow state, account types cache and request banner when leaving Auto-enforcement', async () => {
    const harness = await RouterTestingHarness.create(`${configUrl}#run-parameters`);
    store.setSuccessMessage('Enforcement values updated');
    const resetBannerError = vi.spyOn(globalStore, 'resetBannerError');

    await harness.navigateByUrl('/outside');

    expect(store.activeTab()).toBe('account-types');
    expect(store.successMessage()).toBeNull();
    expect(opalFines.clearCache).toHaveBeenCalledExactlyOnceWith('enforcementAccountTypesCache$');
    expect(resetBannerError).toHaveBeenCalledOnce();
  });

  it('denies direct access when the Administration release flag is disabled', async () => {
    globalStore.setFeatureFlags({ [RELEASE_1C_ADMINISTRATION_FEATURE_FLAG]: false });
    const harness = await RouterTestingHarness.create(configUrl);

    expect(TestBed.inject(Router).url).toBe('/access-denied');
    expect(harness.routeNativeElement!.textContent).toContain('Access denied');
    expect(opalFines.getEnforcementAccountTypes).not.toHaveBeenCalled();
  });

  it('denies direct access when the user lacks Auto enforcement permission', async () => {
    const userState = structuredClone(globalStore.userState());
    userState.business_unit_users = userState.business_unit_users.map((businessUnitUser) => ({
      ...businessUnitUser,
      permissions: [],
    }));
    globalStore.setUserState(userState);
    const harness = await RouterTestingHarness.create(configUrl);

    expect(TestBed.inject(Router).url).toBe('/access-denied');
    expect(harness.routeNativeElement!.textContent).toContain('Access denied');
    expect(opalFines.getEnforcementAccountTypes).not.toHaveBeenCalled();
  });
});
