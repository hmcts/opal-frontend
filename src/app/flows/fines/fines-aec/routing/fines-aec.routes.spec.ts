import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { FINES_PERMISSIONS } from '@constants/fines-permissions.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-enforcement-account-types.mock';
import { IOpalFinesEnforcementAccountTypesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-enforcement-account-types-response.interface';
import { IOpalFinesEnforcementAccountTypeUpdate } from '@services/fines/opal-fines-service/interfaces/opal-fines-enforcement-account-type-update.interface';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RELEASE_1C_ADMINISTRATION_FEATURE_FLAG } from '../../constants/release-feature-flags.constant';
import { finesSectionPermissionsGuard } from '../../routing/guards/fines-section-permissions/fines-section-permissions.guard';
import { FinesAecComponent } from '../fines-aec.component';
import { FinesAecStore } from '../stores/fines-aec.store';
import { FinesAecConfigComponent } from '../fines-aec-config/fines-aec-config.component';
import { FinesAecPlaceholderComponent } from '../fines-aec-placeholder/fines-aec-placeholder.component';
import { FinesAecAmendValuesComponent } from '../fines-aec-amend-values/fines-aec-amend-values.component';
import { FINES_AEC_ROUTING_PATHS } from './constants/fines-aec-routing-paths.constant';
import { FINES_AEC_ROUTING_TITLES } from './constants/fines-aec-routing-titles.constant';
import { routing } from './fines-aec.routes';
import { finesAecEnforcementAccountTypeResolver } from './resolvers/fines-aec-enforcement-account-type.resolver';

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

  it('protects and titles the navigation placeholder route', () => {
    const route = routing.find((candidate) => candidate.path === FINES_AEC_ROUTING_PATHS.children.navigation);

    expect(route?.canActivate).toEqual([authGuard, routePermissionsGuard]);
    expect(route?.data).toEqual({
      routePermissionId: [FINES_PERMISSIONS['auto-enforcement']],
      title: FINES_AEC_ROUTING_TITLES.children.navigation,
      heading: FINES_AEC_ROUTING_TITLES.children.navigation,
    });
    expect(route?.resolve).toEqual({ title: TitleResolver });
  });

  it('lazy-loads the navigation placeholder component', async () => {
    const route = routing.find((candidate) => candidate.path === FINES_AEC_ROUTING_PATHS.children.navigation);

    await expect(route?.loadComponent?.()).resolves.toBe(FinesAecPlaceholderComponent);
  });

  it('protects the amend form and reloads the selected account type when query parameters change', () => {
    const route = routing.find((candidate) => candidate.path === FINES_AEC_ROUTING_PATHS.children.amendValues);

    expect(route?.canActivate).toEqual([authGuard, routePermissionsGuard]);
    expect(route?.canDeactivate).toEqual([canDeactivateGuard]);
    expect(route?.runGuardsAndResolvers).toBe('paramsOrQueryParamsChange');
    expect(route?.data).toEqual({
      routePermissionId: [FINES_PERMISSIONS['auto-enforcement']],
      title: FINES_AEC_ROUTING_TITLES.children.amendValues,
    });
    expect(route?.resolve).toEqual({
      title: TitleResolver,
      enforcementAccountType: finesAecEnforcementAccountTypeResolver,
    });
  });

  it('lazy-loads the real amend enforcement values form', async () => {
    const route = routing.find((candidate) => candidate.path === FINES_AEC_ROUTING_PATHS.children.amendValues);

    await expect(route?.loadComponent?.()).resolves.toBe(FinesAecAmendValuesComponent);
  });
});

describe('Auto-enforcement configuration navigation', () => {
  const configUrl = '/fines/auto-enforcement/config';
  const amendUrl = '/fines/auto-enforcement/amend-values';
  let globalStore: InstanceType<typeof GlobalStore>;
  let store: InstanceType<typeof FinesAecStore>;
  let response: IOpalFinesEnforcementAccountTypesResponse;
  let opalFines: {
    getEnforcementAccountTypes: ReturnType<typeof vi.fn>;
    updateEnforcementAccountTypes: ReturnType<typeof vi.fn>;
    clearCache: ReturnType<typeof vi.fn>;
  };

  afterEach(() => vi.restoreAllMocks());

  beforeEach(async () => {
    response = structuredClone(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK);
    opalFines = {
      getEnforcementAccountTypes: vi.fn(() => of(structuredClone(response))),
      updateEnforcementAccountTypes: vi.fn((updates: IOpalFinesEnforcementAccountTypeUpdate[]) => {
        response.enforcement_account_types = response.enforcement_account_types.map((record) => {
          const update = updates.find((item) => item.id === record.id);
          return update ? { ...record, minimum_balance: update.minimum_balance, version: record.version + 1 } : record;
        });
        return of(structuredClone(response));
      }),
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
    const link = harness.routeNativeElement?.querySelector<HTMLElement>(selector);
    expect(link, `Expected navigation link ${selector}`).toBeTruthy();
    link!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
  };

  const enterAmount = (harness: RouterTestingHarness, field: string, value: string): void => {
    const input = harness.routeNativeElement!.querySelector<HTMLInputElement>(`#${field}`);
    expect(input, `Expected amount input ${field}`).toBeTruthy();
    input!.value = value;
    input!.dispatchEvent(new Event('input', { bubbles: true }));
    harness.detectChanges();
  };

  it.each([
    ['COL', 2, 'Adult - Collection order', '100.00', '1000.00'],
    ['A', 4, 'Adult - No collection order', '75.00', ''],
    ['Y', 8, 'Youth', '50.00', '200.00'],
    ['CO', 6, 'Company', '25.00', '500.00'],
  ] as const)(
    'opens Change for %s with the selected account type and returns without saving',
    async (accountType, id, name, minimum, high) => {
      const confirm = vi.spyOn(window, 'confirm');
      const harness = await RouterTestingHarness.create(configUrl);
      await clickLink(harness, `#aec-change-${accountType}`);

      expect(TestBed.inject(Router).url).toBe(`${amendUrl}?enforcementAccountTypeId=${id}`);
      expect(harness.routeNativeElement!.querySelector('h1')?.textContent).toContain(name);
      expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#minimum_balance')?.value).toBe(minimum);
      expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#high_value')?.value).toBe(high);

      await clickLink(harness, 'opal-lib-govuk-cancel-link a');

      expect(TestBed.inject(Router).url).toBe(`${configUrl}#account-types`);
      expect(harness.routeNativeElement!.querySelector('#aec-account-types-table')).toBeTruthy();
      expect(harness.routeNativeElement!.querySelector('#aec-account-types-success')).toBeNull();
      expect(confirm).not.toHaveBeenCalled();
      expect(opalFines.updateEnforcementAccountTypes).not.toHaveBeenCalled();
    },
  );

  it.each([true, false])('protects dirty Cancel navigation when confirmation is %s', async (confirmation) => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(confirmation);
    const targetUrl = `${amendUrl}?enforcementAccountTypeId=2`;
    const harness = await RouterTestingHarness.create(targetUrl);
    const flow = harness.routeDebugElement!.componentInstance as FinesAecComponent;
    enterAmount(harness, 'minimum_balance', '125.00');
    expect(flow.handleBeforeUnload()).toBe(false);

    await clickLink(harness, 'opal-lib-govuk-cancel-link a');

    expect(confirm).toHaveBeenCalledOnce();
    expect(TestBed.inject(Router).url).toBe(confirmation ? `${configUrl}#account-types` : targetUrl);
    expect(opalFines.updateEnforcementAccountTypes).not.toHaveBeenCalled();
    expect(harness.routeNativeElement!.querySelector('#aec-account-types-success')).toBeNull();
    expect(flow.handleBeforeUnload()).toBe(confirmation);
    if (!confirmation) {
      expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#minimum_balance')?.value).toBe('125.00');
    }
  });

  it('submits the actual form, then reloads the changed thresholds and displays the success banner', async () => {
    const confirm = vi.spyOn(window, 'confirm');
    const harness = await RouterTestingHarness.create(`${amendUrl}?enforcementAccountTypeId=2`);
    const getCount = opalFines.getEnforcementAccountTypes.mock.calls.length;
    enterAmount(harness, 'minimum_balance', '125.00');
    enterAmount(harness, 'high_value', '2500.00');

    await clickLink(harness, '#aec-amend-save');

    expect(opalFines.updateEnforcementAccountTypes).toHaveBeenCalledExactlyOnceWith([
      { id: 2, version: 2, minimum_balance: 125 },
      { id: 1, version: 1, minimum_balance: 2500 },
    ]);
    expect(opalFines.getEnforcementAccountTypes).toHaveBeenCalledTimes(getCount + 1);
    expect(TestBed.inject(Router).url).toBe(`${configUrl}#account-types`);
    expect(harness.routeNativeElement!.querySelector('#aec-minimum-COL')?.textContent).toContain('£125.00');
    expect(harness.routeNativeElement!.querySelector('#aec-high-COL')?.textContent).toContain('£2,500.00');
    expect(harness.routeNativeElement!.querySelector('#aec-account-types-success')?.textContent).toContain(
      'Enforcement values updated.',
    );
    expect((harness.routeDebugElement!.componentInstance as FinesAecComponent).handleBeforeUnload()).toBe(true);
    expect(confirm).not.toHaveBeenCalled();
  });

  it('clears an optional high value through the real form without replacing it with zero', async () => {
    const harness = await RouterTestingHarness.create(`${amendUrl}?enforcementAccountTypeId=2`);
    enterAmount(harness, 'high_value', '');

    await clickLink(harness, '#aec-amend-save');

    expect(opalFines.updateEnforcementAccountTypes).toHaveBeenCalledExactlyOnceWith([
      { id: 2, version: 2, minimum_balance: 100 },
      { id: 1, version: 1, minimum_balance: null },
    ]);
    expect(harness.routeNativeElement!.querySelector('#aec-high-COL')?.textContent?.trim()).toBe('-');
  });

  it('guards query changes and resets the reused form to the newly selected account type', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const originalUrl = `${amendUrl}?enforcementAccountTypeId=2`;
    const nextUrl = `${amendUrl}?enforcementAccountTypeId=4`;
    const harness = await RouterTestingHarness.create(originalUrl);
    enterAmount(harness, 'minimum_balance', '125.00');

    expect(await TestBed.inject(Router).navigateByUrl(nextUrl)).toBe(false);
    expect(TestBed.inject(Router).url).toBe(originalUrl);
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#minimum_balance')?.value).toBe('125.00');

    confirm.mockReturnValue(true);
    await harness.navigateByUrl(nextUrl);

    expect(confirm).toHaveBeenCalledTimes(2);
    expect(harness.routeNativeElement!.querySelector('h1')?.textContent).toContain('Adult - No collection order');
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#minimum_balance')?.value).toBe('75.00');
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#high_value')?.value).toBe('');
    expect(opalFines.updateEnforcementAccountTypes).not.toHaveBeenCalled();
  });

  it.each(['', '?enforcementAccountTypeId=999', '?enforcementAccountTypeId=1'])(
    'returns a missing, unknown or high-path selection %s to Account types',
    async (query) => {
      const harness = await RouterTestingHarness.create(`${amendUrl}${query}`);

      expect(TestBed.inject(Router).url).toBe(`${configUrl}#account-types`);
      expect(harness.routeNativeElement!.querySelector('#aec-account-types-table')).toBeTruthy();
      expect(harness.routeNativeElement!.querySelector('#aec-amend-values-form')).toBeNull();
      expect(opalFines.updateEnforcementAccountTypes).not.toHaveBeenCalled();
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

  it.each([configUrl, `${amendUrl}?enforcementAccountTypeId=2`])(
    'denies %s when Administration is disabled',
    async (url) => {
      globalStore.setFeatureFlags({ [RELEASE_1C_ADMINISTRATION_FEATURE_FLAG]: false });
      const harness = await RouterTestingHarness.create(url);

      expect(TestBed.inject(Router).url).toBe('/access-denied');
      expect(harness.routeNativeElement!.textContent).toContain('Access denied');
      expect(opalFines.getEnforcementAccountTypes).not.toHaveBeenCalled();
    },
  );

  it.each([configUrl, `${amendUrl}?enforcementAccountTypeId=2`])(
    'denies %s without Auto enforcement permission',
    async (url) => {
      const userState = structuredClone(globalStore.userState());
      userState.business_unit_users = userState.business_unit_users.map((businessUnitUser) => ({
        ...businessUnitUser,
        permissions: [],
      }));
      globalStore.setUserState(userState);
      const harness = await RouterTestingHarness.create(url);

      expect(TestBed.inject(Router).url).toBe('/access-denied');
      expect(harness.routeNativeElement!.textContent).toContain('Access denied');
      expect(opalFines.getEnforcementAccountTypes).not.toHaveBeenCalled();
    },
  );
});
