import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, provideRouter, Router, RouterLink } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';
import { filter, firstValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { RELEASE_1C_BANKING_INTERFACES_FEATURE_FLAG } from '../../constants/release-feature-flags.constant';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { IOpalFinesApr } from '../../services/opal-fines-service/interfaces/opal-fines-apr.interface';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK } from '../../services/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-latest.mock';
import { FINES_ACCOUNT_STATE } from '../constants/fines-acc-state.constant';
import { FinesAccDefendantDetailsPaymentTermsTabComponent } from '../fines-acc-defendant-details/fines-acc-defendant-details-payment-terms-tab/fines-acc-defendant-details-payment-terms-tab.component';
import { routing } from '../routing/fines-acc.routes';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FinesAccAprManageComponent } from './fines-acc-apr-manage.component';

@Component({
  imports: [FinesAccDefendantDetailsPaymentTermsTabComponent],
  template: `<app-fines-acc-defendant-details-payment-terms-tab
    [tabData]="tabData"
    [bankingInterfacesEnabled]="true"
    [hasManageAprPermission]="true"
  />`,
})
class PaymentTermsHostComponent {
  public readonly tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
}

@Component({
  imports: [RouterLink],
  template: `<a id="open-apr-manage" routerLink="/fines/account/defendant/123/alternate/payment/reference/manage"
    >Manage alternate payment references</a
  >`,
})
class PreviousJourneyHostComponent {}

@Component({ template: '<h1>Access denied</h1>' })
class AccessDeniedHostComponent {}

describe('APR Manage navigation from Payment terms', () => {
  const detailsUrl = '/fines/account/defendant/123/details';
  const manageUrl = '/fines/account/defendant/123/alternate/payment/reference/manage';
  let bankingInterfacesEnabled: boolean;
  let permittedBusinessUnitId: number;
  let references: IOpalFinesApr[];
  const reference: IOpalFinesApr = {
    alternate_payment_reference_id: 11,
    defendant_account_id: 123,
    business_unit_id: 77,
    relationship: 'APR',
    category: 'APR',
    apr_text: 'MOCK-REFERENCE',
    created_at: '2026-06-01T12:00:00Z',
    updated_at: null,
  };
  const opalFines = {
    getDefendantAccountHeadingData: vi.fn(() => of({})),
    getAprs: vi.fn(() => of({ references, version: '1' })),
    createApr: vi.fn(),
    updateApr: vi.fn(),
    deleteApr: vi.fn(),
  };

  async function clickAndNavigate(harness: RouterTestingHarness, selector: string): Promise<void> {
    const link = harness.routeNativeElement?.querySelector<HTMLElement>(selector);
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
    references = [];
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
          { path: 'previous-journey', component: PreviousJourneyHostComponent },
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
    vi.spyOn(TestBed.inject(FinesAccPayloadService), 'transformDefendantAccountHeaderForStore').mockReturnValue(
      TestBed.inject(FinesAccountStore).getAccountState(),
    );
  });

  it('opens the registered Manage page by clicking the Payment terms link and returns to the same tab', async () => {
    const harness = await RouterTestingHarness.create(`${detailsUrl}#payment-terms`);
    const link = harness.routeNativeElement?.querySelector<HTMLAnchorElement>('#manage-alternate-payment-references');
    expect(link?.getAttribute('href')).toBe(manageUrl);

    await clickAndNavigate(harness, '#manage-alternate-payment-references');

    expect(TestBed.inject(Router).url).toBe(manageUrl);
    expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(FinesAccAprManageComponent);
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent?.trim()).toContain(
      'Manage Alternate Payment References',
    );
    expect(harness.routeNativeElement?.textContent).toContain('123A - Mock defendant');
    expect(TestBed.inject(Title).getTitle()).toBe('OPAL - Manage Alternate Payment References');
    expect(opalFines.getDefendantAccountHeadingData).toHaveBeenCalledExactlyOnceWith(123);
    expect(opalFines.getAprs).toHaveBeenCalledExactlyOnceWith(123);

    await clickAndNavigate(harness, '#apr-back a');

    expect(TestBed.inject(Router).url).toBe(`${detailsUrl}#payment-terms`);
    expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(PaymentTermsHostComponent);
  });

  it('resolves the Manage URL directly for an authorised account', async () => {
    const harness = await RouterTestingHarness.create(manageUrl);

    expect(TestBed.inject(Router).url).toBe(manageUrl);
    expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(FinesAccAprManageComponent);
    await clickAndNavigate(harness, '#apr-back a');
    expect(TestBed.inject(Router).url).toBe(`${detailsUrl}#payment-terms`);
  });

  it('redirects direct entry to the shared denied page when banking interfaces is disabled', async () => {
    bankingInterfacesEnabled = false;
    const harness = await RouterTestingHarness.create(manageUrl);

    expect(TestBed.inject(Router).url).toBe('/access-denied');
    expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(AccessDeniedHostComponent);
    expect(opalFines.getAprs).not.toHaveBeenCalled();
  });

  it('denies the visible link when permission 24 is granted only in another business unit', async () => {
    permittedBusinessUnitId = 78;
    const harness = await RouterTestingHarness.create(`${detailsUrl}#payment-terms`);

    await clickAndNavigate(harness, '#manage-alternate-payment-references');

    expect(TestBed.inject(Router).url).toBe('/access-denied');
    expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(AccessDeniedHostComponent);
    expect(opalFines.getAprs).not.toHaveBeenCalled();
  });

  it.each([
    { action: 'add', selector: '#apr-add', heading: 'Add Alternate Payment Reference' },
    { action: 'change', selector: '#apr-change-11', heading: 'Change Alternate Payment Reference' },
  ])('opens the $action destination and returns without writing data', async ({ action, selector, heading }) => {
    references = action === 'add' ? [] : [reference];
    const harness = await RouterTestingHarness.create(manageUrl);

    await clickAndNavigate(harness, selector);

    const query = action === 'add' ? '' : '?alternatePaymentReferenceId=11';
    expect(TestBed.inject(Router).url).toBe(manageUrl.replace('/manage', `/${action}`) + query);
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(heading);
    await clickAndNavigate(harness, '#apr-action-back a, opal-lib-govuk-cancel-link a');
    expect(TestBed.inject(Router).url).toBe(manageUrl);
    expect(opalFines.createApr).not.toHaveBeenCalled();
    expect(opalFines.updateApr).not.toHaveBeenCalled();
    expect(opalFines.deleteApr).not.toHaveBeenCalled();
  });

  it.each(['APR', 'CONSOLIDATED', 'AMALGAMATED'] as const)(
    'keeps Remove hidden for %s references while its route is a stub',
    async (relationship) => {
      references = [{ ...reference, relationship }];
      const harness = await RouterTestingHarness.create(manageUrl);

      expect(harness.routeNativeElement?.querySelector('[data-reference-id="11"]')).not.toBeNull();
      expect(harness.routeNativeElement?.querySelector('[id^="apr-remove-"]')).toBeNull();
      expect(harness.routeNativeElement?.querySelector('#apr-change-11') !== null).toBe(relationship === 'APR');
      expect(opalFines.deleteApr).not.toHaveBeenCalled();
    },
  );

  it('preserves the previous destination and its query and fragment through an APR round trip', async () => {
    const previousUrl = '/previous-journey?filter=active#results';
    const harness = await RouterTestingHarness.create(previousUrl);

    await clickAndNavigate(harness, '#open-apr-manage');
    await clickAndNavigate(harness, '#apr-add');
    await clickAndNavigate(harness, '#apr-action-back a, opal-lib-govuk-cancel-link a');
    await clickAndNavigate(harness, '#apr-back a');

    expect(TestBed.inject(Router).url).toBe(previousUrl);
    expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(PreviousJourneyHostComponent);
  });

  it.each(['change', 'delete'])('redirects %s without a valid selected reference to Manage', async (action) => {
    references = [reference];
    await RouterTestingHarness.create(manageUrl.replace('/manage', `/${action}`));

    expect(TestBed.inject(Router).url).toBe(manageUrl);
  });

  it('continues to reject Change for inherited references', async () => {
    references = [{ ...reference, relationship: 'CONSOLIDATED' }];
    await RouterTestingHarness.create(manageUrl.replace('/manage', '/change') + '?alternatePaymentReferenceId=11');

    expect(TestBed.inject(Router).url).toBe(manageUrl);
  });
});
