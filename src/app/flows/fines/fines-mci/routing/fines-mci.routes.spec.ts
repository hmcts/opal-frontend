import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { FINES_MCI_CRIMINAL_SEARCH_MOCK } from '../mocks/fines-mci-criminal-search.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { filter, firstValueFrom, of, take } from 'rxjs';
import { FinesMciCriminalAccountService } from '../services/fines-mci-criminal-account.service';
import { EMPTY } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, provideRouter, Router, Routes } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { PRIMARY_NAV_HIDDEN_ROUTE_DATA } from '@app/constants/route-data.constant';
import { fetchBusinessUnitsResolver } from '@app/flows/fines/routing/resolvers/fetch-business-units-resolver/fetch-business-units.resolver';
import { finesMciCriminalAccountsResolver } from './resolvers/fines-mci-criminal-accounts/fines-mci-criminal-accounts.resolver';
import { routing } from './fines-mci.routes';
import { FINES_MCI_ROUTING_PATHS } from './constants/fines-mci-routing-paths.constant';
import { FINES_MCI_ROUTING_TITLES } from './constants/fines-mci-routing-titles.constant';
import { finesMciFlowStateGuard } from './guards/fines-mci-flow-state.guard';
import { finesMciCourtFeeDraftGuard } from './guards/fines-mci-court-fee-draft.guard';
import { finesMciCourtFeesResolver } from './resolvers/fines-mci-court-fees.resolver';
import { finesMciPaymentMappingsResolver } from './resolvers/fines-mci-payment-mappings.resolver';
import { finesMciCourtFeeCheckGuard } from './guards/fines-mci-court-fee-check.guard';
import { FinesMciCreateTillCourtFeeCheckComponent } from '../fines-mci-create-till/fines-mci-create-till-court-fee-check/fines-mci-create-till-court-fee-check.component';
import { FinesMciCreateTillCourtFeeDetailsComponent } from '../fines-mci-create-till/fines-mci-create-till-court-fee-details/fines-mci-create-till-court-fee-details.component';
import { FinesMciCreateTillOverUnderpaymentConfirmationComponent } from '../fines-mci-create-till/fines-mci-create-till-over-underpayment-confirmation/fines-mci-create-till-over-underpayment-confirmation.component';
import { FinesMciCreateTillCourtFeePaymentDetailsComponent } from '../fines-mci-create-till/fines-mci-create-till-court-fee-payment-details/fines-mci-create-till-court-fee-payment-details.component';
import { FinesMciPaymentCategoryCriminalAccountComponent } from '../fines-mci-payment-category-criminal-account/fines-mci-payment-category-criminal-account.component';
import { FinesMciStore } from '../stores/fines-mci.store';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../../fines-acc/fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';

@Component({ template: '' })
class RouteDestinationComponent {}

// Exercise the production URL hierarchy and inherited data independently of authentication and API calls.
const routesForRecognition = (routes: Routes): Routes =>
  routes.map((route) => ({
    path: route.path,
    pathMatch: route.pathMatch,
    redirectTo: route.redirectTo,
    data: route.data,
    component: route.loadComponent ? RouteDestinationComponent : undefined,
    children: route.children ? routesForRecognition(route.children) : undefined,
  }));
import { FinesMciCreateTillPayerDetailsComponent } from '../fines-mci-create-till/fines-mci-create-till-payer-details/fines-mci-create-till-payer-details.component';

describe('finesMci routes', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [{ provide: FinesMciCriminalAccountService, useValue: { loadMasterAccountDetails: () => EMPTY } }],
    }),
  );
  const createTillRoute = routing
    .find((route) => route.path === 'create')
    ?.children?.find((route) => route.path === 'till');

  const criminalRoute = createTillRoute?.children
    ?.find((route) => route.path === FINES_MCI_ROUTING_PATHS.children.payment)
    ?.children?.find((route) => route.path === FINES_MCI_ROUTING_PATHS.children.category)
    ?.children?.find((route) => route.path === FINES_MCI_ROUTING_PATHS.children.criminal);

  it('should redirect the manual cash input root to create allocate', () => {
    expect(routing[0]).toEqual({
      path: '',
      redirectTo: FINES_MCI_ROUTING_PATHS.children.createAllocate,
      pathMatch: 'full',
    });
  });

  it('should expose a create allocate placeholder route', () => {
    const createAllocateRoute = routing.find((route) => route.path === FINES_MCI_ROUTING_PATHS.children.createAllocate);

    expect(createAllocateRoute).toEqual(
      expect.objectContaining({
        path: FINES_MCI_ROUTING_PATHS.children.createAllocate,
        canActivate: [authGuard, routePermissionsGuard],
        data: {
          routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
          title: FINES_MCI_ROUTING_TITLES.children.createAllocate,
        },
        resolve: expect.objectContaining({
          title: TitleResolver,
        }),
      }),
    );
    expect(createAllocateRoute?.loadComponent).toEqual(expect.any(Function));
  });

  it('should expose a guarded create till select business unit placeholder route', () => {
    const createRoute = routing.find((route) => route.path === FINES_MCI_ROUTING_PATHS.children.create);
    const createTillRoute = createRoute?.children?.find(
      (route) => route.path === FINES_MCI_ROUTING_PATHS.children.till,
    );
    const createTillSelectBusinessUnitRoute = createTillRoute?.children?.find(
      (route) => route.path === FINES_MCI_ROUTING_PATHS.children.selectBusinessUnit,
    );

    expect(createTillSelectBusinessUnitRoute).toEqual(
      expect.objectContaining({
        path: FINES_MCI_ROUTING_PATHS.children.selectBusinessUnit,
        canActivate: [authGuard, routePermissionsGuard],
        data: {
          permission: 'PROCESS_AND_ALLOCATE_PAYMENTS',
          routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
          title: FINES_MCI_ROUTING_TITLES.children.createTillSelectBusinessUnit,
        },
        resolve: expect.objectContaining({
          businessUnits: fetchBusinessUnitsResolver,
          title: TitleResolver,
        }),
      }),
    );
    expect(createTillSelectBusinessUnitRoute?.loadComponent).toEqual(expect.any(Function));
  });

  it('should hide the primary navigation throughout the create till journey', () => {
    expect(createTillRoute?.data).toEqual(PRIMARY_NAV_HIDDEN_ROUTE_DATA);
  });

  it('should guard navigation away from payment category when a radio option has been selected', () => {
    const paymentCategoryRoute = createTillRoute?.children?.find(
      (route) => route.path === FINES_MCI_ROUTING_PATHS.children.paymentCategory,
    );

    expect(paymentCategoryRoute?.canDeactivate).toEqual([canDeactivateGuard]);
  });

  it('should guard navigation away from suspense details when form data has been entered', () => {
    const suspenseDetailsRoute = createTillRoute?.children?.find(
      (route) => route.path === FINES_MCI_ROUTING_PATHS.children.suspenseDetails,
    );

    expect(suspenseDetailsRoute?.canDeactivate).toEqual([canDeactivateGuard]);
  });

  it('should guard navigation away from payer details when form data has been entered', () => {
    const payerDetailsRoute = createTillRoute?.children?.find(
      (route) => route.path === FINES_MCI_ROUTING_PATHS.children.payerDetails,
    );
    expect(payerDetailsRoute?.canDeactivate).toEqual([canDeactivateGuard]);
  });

  it('loads the payer details screen after suspense details', async () => {
    const payerDetailsRoute = createTillRoute?.children?.find(
      (route) => route.path === FINES_MCI_ROUTING_PATHS.children.payerDetails,
    );
    expect(await payerDetailsRoute?.loadComponent?.()).toBe(FinesMciCreateTillPayerDetailsComponent);
  });

  it.each([
    ['search', FINES_MCI_ROUTING_TITLES.children.paymentCategoryCriminalSearch],
    ['matches', FINES_MCI_ROUTING_TITLES.children.paymentCategoryCriminalMatches],
    ['payment-details/1', FINES_MCI_ROUTING_TITLES.children.paymentCategoryCriminalPaymentDetails],
  ])('should resolve the existing criminal %s URL and inherit the till navigation setting', async (page, title) => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'fines', children: [{ path: 'manual-cash-input', children: routesForRecognition(routing) }] },
        ]),
      ],
    });
    const harness = await RouterTestingHarness.create();
    const url = `/fines/manual-cash-input/create/till/payment/category/criminal/${page}`;

    await harness.navigateByUrl(url, RouteDestinationComponent);

    const router = TestBed.inject(Router);
    let snapshot = router.routerState.snapshot.root;
    while (snapshot.firstChild) snapshot = snapshot.firstChild;
    expect(router.url).toBe(url);
    expect(snapshot.pathFromRoot.map((route) => route.routeConfig?.path).filter(Boolean)).toEqual([
      'fines',
      'manual-cash-input',
      'create',
      'till',
      'payment',
      'category',
      'criminal',
      page.startsWith('payment-details') ? 'payment-details/:accountId' : page,
    ]);
    expect(snapshot.data).toEqual(expect.objectContaining({ ...PRIMARY_NAV_HIDDEN_ROUTE_DATA, title }));
  });

  it('should guard navigation away from payment category when a radio option has been selected', () => {
    const paymentCategoryRoute = createTillRoute?.children?.find(
      (route) => route.path === FINES_MCI_ROUTING_PATHS.children.paymentCategory,
    );

    expect(paymentCategoryRoute?.canDeactivate).toEqual([canDeactivateGuard]);
  });

  it('loads the Court Fee Details screen from the category journey', async () => {
    const courtFeeRoute = createTillRoute?.children?.find(
      (route) => route.path === FINES_MCI_ROUTING_PATHS.children.courtFeeDetails,
    );

    expect(await courtFeeRoute?.loadComponent?.()).toBe(FinesMciCreateTillCourtFeeDetailsComponent);
    expect(courtFeeRoute?.canDeactivate).toEqual([canDeactivateGuard]);
    expect(courtFeeRoute?.resolve?.['courtFees']).toBe(finesMciCourtFeesResolver);
  });

  it('loads the Court Fee Payment Details screen', async () => {
    expect(
      createTillRoute?.children?.filter(
        (child) => child.path === FINES_MCI_ROUTING_PATHS.children.courtFeePaymentDetails,
      ),
    ).toHaveLength(1);
    const route = createTillRoute?.children?.find(
      (child) => child.path === FINES_MCI_ROUTING_PATHS.children.courtFeePaymentDetails,
    );

    expect(await route?.loadComponent?.()).toBe(FinesMciCreateTillCourtFeePaymentDetailsComponent);
    expect(route?.canActivate).toContain(finesMciCourtFeeDraftGuard);
    expect(route?.canDeactivate).toEqual([canDeactivateGuard]);
    expect(route?.resolve?.['paymentMappings']).toBe(finesMciPaymentMappingsResolver);
    expect(route?.data?.['heading']).toBe(FINES_MCI_ROUTING_TITLES.children.createTillCourtFeePaymentDetails);
  });

  it('loads the temporary Court Fee check screen with draft and leave protection', async () => {
    const route = createTillRoute?.children?.find(
      (child) => child.path === FINES_MCI_ROUTING_PATHS.children.checkCourtFee,
    );
    expect(await route?.loadComponent?.()).toBe(FinesMciCreateTillCourtFeeCheckComponent);
    expect(route?.canActivate).toContain(finesMciCourtFeeCheckGuard);
    expect(route?.canDeactivate).toEqual([canDeactivateGuard]);
  });

  it('loads the overpayment and underpayment confirmation screen', async () => {
    expect(
      createTillRoute?.children?.filter(
        (child) => child.path === FINES_MCI_ROUTING_PATHS.children.overUnderpaymentConfirmation,
      ),
    ).toHaveLength(1);
    const route = createTillRoute?.children?.find(
      (child) => child.path === FINES_MCI_ROUTING_PATHS.children.overUnderpaymentConfirmation,
    );

    expect(await route?.loadComponent?.()).toBe(FinesMciCreateTillOverUnderpaymentConfirmationComponent);
    expect(route?.canDeactivate).toEqual([canDeactivateGuard]);
    expect(route?.resolve?.['courtFees']).toBe(finesMciCourtFeesResolver);
    expect(route?.data?.['heading']).toBe(FINES_MCI_ROUTING_TITLES.children.createTillOverUnderpaymentConfirmation);
  });

  it('should guard navigation away from suspense details when form data has been entered', () => {
    const suspenseDetailsRoute = createTillRoute?.children?.find(
      (route) => route.path === FINES_MCI_ROUTING_PATHS.children.suspenseDetails,
    );

    expect(suspenseDetailsRoute?.canDeactivate).toEqual([canDeactivateGuard]);
  });

  it.each([
    [FINES_MCI_ROUTING_PATHS.children.details, FINES_MCI_ROUTING_TITLES.children.createTillDetails],
    [FINES_MCI_ROUTING_PATHS.children.paymentCategory, FINES_MCI_ROUTING_TITLES.children.createTillPaymentCategory],
    [FINES_MCI_ROUTING_PATHS.children.suspenseDetails, FINES_MCI_ROUTING_TITLES.children.createTillSuspenseDetails],
    [FINES_MCI_ROUTING_PATHS.children.payerDetails, FINES_MCI_ROUTING_TITLES.children.createTillPayerDetails],
    [FINES_MCI_ROUTING_PATHS.children.courtFeeDetails, FINES_MCI_ROUTING_TITLES.children.createTillCourtFeeDetails],
    [
      FINES_MCI_ROUTING_PATHS.children.courtFeePaymentDetails,
      FINES_MCI_ROUTING_TITLES.children.createTillCourtFeePaymentDetails,
    ],
    [
      FINES_MCI_ROUTING_PATHS.children.overUnderpaymentConfirmation,
      FINES_MCI_ROUTING_TITLES.children.createTillOverUnderpaymentConfirmation,
    ],
    [FINES_MCI_ROUTING_PATHS.children.searchAccount, FINES_MCI_ROUTING_TITLES.children.createTillSearchAccount],
    [FINES_MCI_ROUTING_PATHS.children.cancel, FINES_MCI_ROUTING_TITLES.children.createTillCancel],
  ])('should expose the guarded create till %s route', (path, title) => {
    const childRoute = createTillRoute?.children?.find((route) => route.path === path);

    expect(childRoute).toEqual(
      expect.objectContaining({
        path,
        canActivate: expect.arrayContaining([authGuard, routePermissionsGuard, finesMciFlowStateGuard]),
        data: expect.objectContaining({
          permission: 'PROCESS_AND_ALLOCATE_PAYMENTS',
          routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
          title,
        }),
        resolve: expect.objectContaining({
          title: TitleResolver,
        }),
      }),
    );
    expect(childRoute?.loadComponent).toEqual(expect.any(Function));
  });

  it('should expose a guarded criminal account search route', () => {
    const criminalAccountSearchRoute = criminalRoute?.children?.find(
      (route) => route.path === FINES_MCI_ROUTING_PATHS.children.search,
    );

    expect(criminalAccountSearchRoute).toEqual(
      expect.objectContaining({
        path: FINES_MCI_ROUTING_PATHS.children.search,
        canActivate: [authGuard, routePermissionsGuard, finesMciFlowStateGuard],
        canDeactivate: [canDeactivateGuard],
        data: {
          routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
          title: FINES_MCI_ROUTING_TITLES.children.paymentCategoryCriminalSearch,
        },
        resolve: expect.objectContaining({
          title: TitleResolver,
        }),
      }),
    );
    expect(criminalAccountSearchRoute?.loadComponent).toEqual(expect.any(Function));
  });

  it('should expose a guarded criminal account matches placeholder route', () => {
    const criminalAccountMatchesRoute = criminalRoute?.children?.find(
      (route) => route.path === FINES_MCI_ROUTING_PATHS.children.matches,
    );

    expect(criminalAccountMatchesRoute).toEqual(
      expect.objectContaining({
        path: FINES_MCI_ROUTING_PATHS.children.matches,
        canActivate: [authGuard, routePermissionsGuard, finesMciFlowStateGuard],
        data: {
          routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
          title: FINES_MCI_ROUTING_TITLES.children.paymentCategoryCriminalMatches,
        },
        resolve: expect.objectContaining({
          title: TitleResolver,
          criminalAccounts: finesMciCriminalAccountsResolver,
        }),
      }),
    );
    expect(criminalAccountMatchesRoute?.loadComponent).toEqual(expect.any(Function));
  });

  it.each(['individual', 'company'])(
    'should render the confirmation screen at the criminal account URL for an %s',
    async (type) => {
      const accountRoute = criminalRoute!.children!.find(
        (route) => route.path === `${FINES_MCI_ROUTING_PATHS.children.account}/:accountId/:type`,
      )!;
      expect(accountRoute.canActivate).toEqual([authGuard, routePermissionsGuard, finesMciFlowStateGuard]);
      expect(accountRoute.data?.['routePermissionId']).toEqual([FINES_PERMISSIONS['process-and-allocate-payments']]);
      expect(accountRoute.resolve).toEqual({ title: TitleResolver });
      TestBed.configureTestingModule({
        providers: [
          provideRouter([
            {
              ...accountRoute,
              path: `fines/manual-cash-input/create/till/payment/category/criminal/${accountRoute.path}`,
              canActivate: [],
              resolve: {},
            },
          ]),
        ],
      });
      const harness = await RouterTestingHarness.create();
      const url = `/fines/manual-cash-input/create/till/payment/category/criminal/account/2/${type}`;
      const store = TestBed.inject(FinesMciStore);
      store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
      store.setSelectedCriminalAccount(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[1]);
      store.setSelectedCriminalAccountAtAGlance(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      store.setSelectedCriminalAccountHeader(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
      await harness.navigateByUrl(url, FinesMciPaymentCategoryCriminalAccountComponent);

      expect(TestBed.inject(Router).url).toBe(url);
      expect(harness.routeNativeElement?.textContent).toContain('Confirm account');
      expect(harness.routeNativeElement?.querySelector('#fines-mci-confirm-account')).toBeTruthy();
    },
  );
  it('protects the payment details placeholder with the same guards as confirmation', async () => {
    const route = criminalRoute!.children!.find((route) => route.path === 'payment-details/:accountId')!;
    expect(route.canActivate).toEqual([authGuard, routePermissionsGuard, finesMciFlowStateGuard]);
    expect(route.data?.['routePermissionId']).toEqual([FINES_PERMISSIONS['process-and-allocate-payments']]);
    expect(route.resolve).toEqual({ title: TitleResolver });
    TestBed.configureTestingModule({ providers: [provideRouter([{ ...route, canActivate: [], resolve: {} }])] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/payment-details/1');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent?.trim()).toBe('Payment details');
  });
  it('navigates from confirmation to payment details with the same account ID', async () => {
    const accountRoute = criminalRoute!.children!.find((route) => route.path === 'account/:accountId/:type')!;
    const paymentRoute = criminalRoute!.children!.find((route) => route.path === 'payment-details/:accountId')!;
    const root = '/fines/manual-cash-input/create/till/payment/category/criminal';
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: root.slice(1),
            children: [
              { ...accountRoute, canActivate: [], resolve: {} },
              { ...paymentRoute, canActivate: [], resolve: {} },
            ],
          },
        ]),
      ],
    });
    const store = TestBed.inject(FinesMciStore);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.setSelectedCriminalAccount(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0]);
    store.setSelectedCriminalAccountAtAGlance({
      ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
      account_status_code: 'L',
      account_balance: 175,
    });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`${root}/account/1/individual`);
    harness.routeNativeElement!.querySelector<HTMLButtonElement>('#fines-mci-confirm-account')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe(`${root}/payment-details/1`);
    expect(harness.routeNativeElement!.querySelector('h1')!.textContent!.trim()).toBe('Payment details');
    expect(store.selectedCriminalAccount()?.defendant_account_id).toBe(1);
  });
  it('renders the restricted account at the same URL and returns Pay into suspense to the MCI landing page', async () => {
    const accountRoute = criminalRoute!.children!.find((route) => route.path === 'account/:accountId/:type')!;
    const landingRoute = routing.find((route) => route.path === FINES_MCI_ROUTING_PATHS.children.createAllocate)!;
    const tillRoot = '/fines/manual-cash-input/create/till';
    const criminalPath = 'payment/category/criminal';
    const accountId = '9007199254740993';
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: tillRoot.slice(1),
            children: [{ path: criminalPath, children: [{ ...accountRoute, canActivate: [], resolve: {} }] }],
          },
          {
            ...landingRoute,
            path: 'fines/manual-cash-input/create-allocate',
            component: RouteDestinationComponent,
            loadComponent: undefined,
            canActivate: [],
            canDeactivate: [],
            resolve: {},
          },
        ]),
      ],
    });
    const store = TestBed.inject(FinesMciStore);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.setDraftJourney('criminal');
    store.setSelectedCriminalAccount({
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0],
      defendant_account_id: accountId,
    });
    store.setSelectedCriminalAccountAtAGlance({
      ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
      account_status_code: 'WO',
      account_balance: 0,
    });
    const harness = await RouterTestingHarness.create();
    const url = `${tillRoot}/${criminalPath}/account/${accountId}/individual`;
    await harness.navigateByUrl(url);
    expect(TestBed.inject(Router).url).toBe(url);
    expect(harness.routeNativeElement!.querySelector('h1')!.textContent!.trim()).toBe(
      'You cannot pay into this account',
    );
    expect(harness.routeNativeElement!.querySelector('#fines-mci-account-warning')!.textContent!.trim()).toBe(
      'Account has been written off in full',
    );
    expect(harness.routeNativeElement!.querySelector('a[target="_blank"]')!.getAttribute('href')).toBe(
      `/fines/account/defendant/${accountId}/details`,
    );
    harness.routeNativeElement!.querySelector<HTMLButtonElement>('#fines-mci-pay-into-suspense')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/fines/manual-cash-input/create-allocate');
    expect(harness.routeDebugElement!.componentInstance).toBeInstanceOf(RouteDestinationComponent);
    expect(store.selectedCriminalAccount()).toBeNull();
    expect(store.draftJourney()).toBeNull();
  });
  it.each([
    ['L', false, 'Confirm account'],
    ['WO', true, 'You cannot pay into this account'],
  ])('loads a %s master and returns browser Back to the preserved search results', async (status, company, heading) => {
    const accountRoute = criminalRoute!.children!.find((route) => route.path === 'account/:accountId/:type')!;
    const matchesRoute = criminalRoute!.children!.find(
      (route) => route.path === FINES_MCI_ROUTING_PATHS.children.matches,
    )!;
    const getDefendantAccounts = vi.fn().mockReturnValue(of({ count: 0, defendant_accounts: [] }));
    const root = 'fines/manual-cash-input/create/till/payment/category/criminal';
    const masterId = '9007199254740993';
    const masterDetails = {
      ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
      defendant_account_id: masterId,
      account_number: 'MASTER123',
      account_status_code: status as string,
      account_balance: 175,
      party_details: {
        ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK.party_details,
        organisation_flag: company as boolean,
      },
    };
    TestBed.configureTestingModule({
      providers: [
        FinesMciCriminalAccountService,
        provideLocationMocks(),
        {
          provide: OpalFines,
          useValue: {
            clearCache: () => {},
            getDefendantAccounts,
            getDefendantAccountMaster: () => of({ defendant_account_id: masterId }),
            getDefendantAccountAtAGlance: () => of(masterDetails),
            getDefendantAccountHeadingData: () => of(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
          },
        },
        provideRouter([
          {
            path: root,
            children: [
              { ...matchesRoute, canActivate: [], resolve: { criminalAccounts: finesMciCriminalAccountsResolver } },
              { ...accountRoute, canActivate: [], resolve: {} },
            ],
          },
        ]),
      ],
    });
    const store = TestBed.inject(FinesMciStore);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.setCriminalSearch(FINES_MCI_CRIMINAL_SEARCH_MOCK);
    store.setCriminalSearchResults(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`/${root}/matches`);
    await harness.fixture.whenStable();
    store.setSelectedCriminalAccount(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0]);
    store.setSelectedCriminalAccountAtAGlance({
      ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
      account_status_code: 'CS',
      account_balance: 0,
    });
    const component = await harness.navigateByUrl(
      `/${root}/account/1/individual`,
      FinesMciPaymentCategoryCriminalAccountComponent,
    );
    harness.routeNativeElement!.querySelector<HTMLInputElement>('input[value="master"]')!.click();
    harness
      .routeNativeElement!.querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe(`/${root}/account/${masterId}/${company ? 'company' : 'individual'}`);
    expect(harness.routeDebugElement!.componentInstance).toBe(component);
    expect(harness.routeNativeElement!.querySelector('h1')!.textContent!.trim()).toBe(heading);
    expect(harness.routeNativeElement!.textContent).toContain('MASTER123');
    expect(harness.routeNativeElement!.querySelector('form')).toBeNull();
    expect(store.selectedCriminalAccountAtAGlance()).toEqual(masterDetails);
    const enquiryLink = harness.routeNativeElement!.querySelector<HTMLAnchorElement>('a[target="_blank"]')!;
    expect(enquiryLink.getAttribute('href')).toBe(`/fines/account/defendant/${masterId}/details`);
    expect(enquiryLink.target).toBe('_blank');
    expect(store.businessUnit()).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    const router = TestBed.inject(Router);
    // Match application bootstrap so Location.back() triggers a router navigation.
    router.setUpLocationChangeListener();
    const navigationEnd = firstValueFrom(
      router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
      ),
    );
    TestBed.inject(Location).back();
    await navigationEnd;
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(router.url).toBe(`/${root}/matches`);
    expect(harness.routeNativeElement!.querySelector('h1')!.textContent!.trim()).toBe('Search results');
    expect(harness.routeNativeElement!.textContent).toContain(
      OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0].account_number,
    );
    expect(store.criminalSearchResults()).toBe(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK);
    expect(getDefendantAccounts).not.toHaveBeenCalled();
  });
  it('returns Cancel to Till Details and clears the account search and payment draft', async () => {
    const accountRoute = criminalRoute!.children!.find((route) => route.path === 'account/:accountId/:type')!;
    const detailsRoute = createTillRoute!.children!.find(
      (route) => route.path === FINES_MCI_ROUTING_PATHS.children.details,
    )!;
    const root = 'fines/manual-cash-input/create/till';
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: root,
            children: [
              { path: 'payment/category/criminal', children: [{ ...accountRoute, canActivate: [], resolve: {} }] },
              { ...detailsRoute, canActivate: [], resolve: {} },
            ],
          },
        ]),
      ],
    });
    const store = TestBed.inject(FinesMciStore);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.ensureTill();
    store.setDraftJourney('criminal');
    store.setCriminalSearch(FINES_MCI_CRIMINAL_SEARCH_MOCK);
    store.setCriminalSearchResults(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK);
    store.setSelectedCriminalAccount(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0]);
    store.setSelectedCriminalAccountHeader(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
    store.setSelectedCriminalAccountAtAGlance({
      ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
      account_status_code: 'CS',
      account_balance: 0,
    });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`/${root}/payment/category/criminal/account/1/individual`);
    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('opal-lib-govuk-cancel-link a')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe(`/${root}/details`);
    expect(harness.routeNativeElement!.querySelector('h1')!.textContent!.trim()).toBe('Till details');
    expect(store.criminalSearch()).toBeNull();
    expect(store.criminalSearchResults()).toBeNull();
    expect(store.selectedCriminalAccount()).toBeNull();
    expect(store.selectedCriminalAccountHeader()).toBeNull();
    expect(store.selectedCriminalAccountAtAGlance()).toBeNull();
    expect(store.draftJourney()).toBeNull();
    expect(store.businessUnit()).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    expect(store.tills()).toHaveLength(1);
  });
});
