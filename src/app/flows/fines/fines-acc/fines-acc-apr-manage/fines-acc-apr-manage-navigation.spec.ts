import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';
import { filter, firstValueFrom, map, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { RELEASE_1C_BANKING_INTERFACES_FEATURE_FLAG } from '../../constants/release-feature-flags.constant';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK } from '../../services/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-latest.mock';
import { FINES_ACCOUNT_STATE } from '../constants/fines-acc-state.constant';
import { FinesAccDefendantDetailsPaymentTermsTabComponent } from '../fines-acc-defendant-details/fines-acc-defendant-details-payment-terms-tab/fines-acc-defendant-details-payment-terms-tab.component';
import { routing } from '../routing/fines-acc.routes';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccAprManageComponent } from './fines-acc-apr-manage.component';
import { FinesAccAprAccessDeniedComponent } from '../fines-acc-apr-access-denied/fines-acc-apr-access-denied.component';

@Component({
  imports: [AsyncPipe, FinesAccDefendantDetailsPaymentTermsTabComponent],
  template: `<app-fines-acc-defendant-details-payment-terms-tab
    [tabData]="tabData"
    [bankingInterfacesEnabled]="true"
    [hasManageAprPermission]="true"
    [canManageApr]="(canManageApr$ | async) === true"
  />`,
})
class PaymentTermsHostComponent {
  private readonly accountStore = inject(FinesAccountStore);
  private readonly permissionsService = inject(PermissionsService);
  public readonly canManageApr$ = inject(OpalUserService)
    .getLoggedInUserState()
    .pipe(
      map((userState) =>
        this.permissionsService.hasBusinessUnitPermissionAccess(
          FINES_PERMISSIONS['manage-alternate-payment-references'],
          Number(this.accountStore.business_unit_id()),
          userState.business_unit_users,
        ),
      ),
    );
  public readonly tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
}

@Component({ template: '<h1>Access denied</h1>' })
class AccessDeniedHostComponent {}

describe('APR Manage navigation from Payment terms', () => {
  const detailsUrl = '/fines/account/defendant/123/details';
  const manageUrl = '/fines/account/defendant/123/alternate/payment/reference/manage';
  const deniedUrl = '/fines/account/defendant/123/alternate/payment/reference/denied';
  let bankingInterfacesEnabled: boolean;
  let permittedBusinessUnitId: number;
  const opalFines = { getDefendantAccountHeadingData: vi.fn() };

  async function followLink(harness: RouterTestingHarness, selector: string): Promise<void> {
    const link = harness.routeNativeElement?.querySelector<HTMLAnchorElement>(selector);
    expect(link).toBeTruthy();
    const completed = firstValueFrom(
      TestBed.inject(Router).events.pipe(filter((event) => event instanceof NavigationEnd)),
    );
    link!.click();
    await completed;
    harness.detectChanges();
  }

  beforeEach(async () => {
    bankingInterfacesEnabled = true;
    permittedBusinessUnitId = 77;
    vi.clearAllMocks();
    const accountRoute = routing.find(
      (route) => route.path === `${FINES_ACC_DEFENDANT_ROUTING_PATHS.root}/:accountId`,
    )!;

    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'fines/account',
            children: [
              {
                ...accountRoute,
                children: accountRoute.children?.map((route) =>
                  route.path === FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details
                    ? { path: route.path, component: PaymentTermsHostComponent }
                    : route,
                ),
              },
            ],
          },
          { path: 'access-denied', component: AccessDeniedHostComponent },
        ]),
        { provide: AuthService, useValue: { checkAuthenticated: () => of(true) } },
        {
          provide: OpalUserService,
          useValue: {
            getLoggedInUserState: () =>
              of({
                business_unit_users: [
                  {
                    business_unit_id: permittedBusinessUnitId,
                    permissions: [
                      { permission_id: FINES_PERMISSIONS['search-and-view-accounts'] },
                      { permission_id: FINES_PERMISSIONS['manage-alternate-payment-references'] },
                    ],
                  },
                ],
              }),
          },
        },
        {
          provide: GlobalStore,
          useValue: {
            featureFlags: () => ({ [RELEASE_1C_BANKING_INTERFACES_FEATURE_FLAG]: bankingInterfacesEnabled }),
          },
        },
        { provide: LaunchDarklyService, useValue: {} },
        { provide: OpalFines, useValue: opalFines },
      ],
    }).compileComponents();
    TestBed.inject(FinesAccountStore).setAccountState({
      ...FINES_ACCOUNT_STATE,
      account_id: 123,
      account_number: '123A',
      business_unit_id: '77',
      party_name: 'Mock defendant',
    });
  });

  it('opens the registered Manage page by clicking the Payment terms link and returns to the same tab', async () => {
    const harness = await RouterTestingHarness.create(detailsUrl);
    const link = harness.routeNativeElement?.querySelector<HTMLAnchorElement>('#manage-alternate-payment-references');
    expect(link?.getAttribute('href')).toBe(manageUrl);

    await followLink(harness, '#manage-alternate-payment-references');

    expect(TestBed.inject(Router).url).toBe(manageUrl);
    expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(FinesAccAprManageComponent);
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent?.trim()).toContain(
      'Manage Alternate Payment References',
    );
    expect(harness.routeNativeElement?.textContent).toContain('123A - Mock defendant');
    expect(TestBed.inject(Title).getTitle()).toBe('OPAL - Manage Alternate Payment References');
    expect(opalFines.getDefendantAccountHeadingData).not.toHaveBeenCalled();

    await followLink(harness, '#apr-back a');

    expect(TestBed.inject(Router).url).toBe(`${detailsUrl}#payment-terms`);
    expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(PaymentTermsHostComponent);
  });

  it('resolves the Manage URL directly for an authorised account', async () => {
    const harness = await RouterTestingHarness.create(manageUrl);

    expect(TestBed.inject(Router).url).toBe(manageUrl);
    expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(FinesAccAprManageComponent);
  });

  it('redirects direct entry to the shared denied page when banking interfaces is disabled', async () => {
    bankingInterfacesEnabled = false;
    const harness = await RouterTestingHarness.create(manageUrl);

    expect(TestBed.inject(Router).url).toBe('/access-denied');
    expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(AccessDeniedHostComponent);
  });

  it('denies the visible link when permission 24 is granted only in another business unit', async () => {
    permittedBusinessUnitId = 78;
    const harness = await RouterTestingHarness.create(detailsUrl);

    await followLink(harness, '#manage-alternate-payment-references');

    expect(TestBed.inject(Router).url).toBe(deniedUrl);
    expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(FinesAccAprAccessDeniedComponent);
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(
      'You cannot manage alternate payment references',
    );
    expect(harness.routeNativeElement?.textContent).toContain('123A - Mock defendant');
    expect(harness.routeNativeElement?.textContent).toContain(
      'You do not have the required permissions for this business unit.',
    );
    expect(harness.routeNativeElement?.querySelector('#go-back')?.classList.contains('govuk-button--secondary')).toBe(
      true,
    );
    expect(opalFines.getDefendantAccountHeadingData).not.toHaveBeenCalled();

    await followLink(harness, '#go-back');

    expect(TestBed.inject(Router).url).toBe(`${detailsUrl}#payment-terms`);
    expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(PaymentTermsHostComponent);
  });

  it('keeps direct Manage navigation protected by the business-unit guard', async () => {
    permittedBusinessUnitId = 78;
    const harness = await RouterTestingHarness.create(manageUrl);

    expect(TestBed.inject(Router).url).toBe('/access-denied');
    expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(AccessDeniedHostComponent);
  });

  it('returns direct APR denied entry to the same account Payment terms tab', async () => {
    const harness = await RouterTestingHarness.create(deniedUrl);

    expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(FinesAccAprAccessDeniedComponent);

    await followLink(harness, '#go-back');

    expect(TestBed.inject(Router).url).toBe(`${detailsUrl}#payment-terms`);
  });

  it('redirects denied entry to account details when the account state does not match', async () => {
    TestBed.inject(FinesAccountStore).setAccountState({ ...FINES_ACCOUNT_STATE, account_id: 999 });

    await RouterTestingHarness.create(deniedUrl);

    expect(TestBed.inject(Router).url).toBe(detailsUrl);
  });
});
