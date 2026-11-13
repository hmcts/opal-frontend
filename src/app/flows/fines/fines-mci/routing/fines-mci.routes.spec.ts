import { describe, expect, it } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, Routes } from '@angular/router';
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

describe('finesMci routes', () => {
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
          routePermissionCodes: [FINES_PERMISSIONS['process-and-allocate-payments']],
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
          routePermissionCodes: [FINES_PERMISSIONS['process-and-allocate-payments']],
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

  it.each([
    ['search', FINES_MCI_ROUTING_TITLES.children.paymentCategoryCriminalSearch],
    ['matches', FINES_MCI_ROUTING_TITLES.children.paymentCategoryCriminalMatches],
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
      page,
    ]);
    expect(snapshot.data).toEqual(expect.objectContaining({ ...PRIMARY_NAV_HIDDEN_ROUTE_DATA, title }));
  });

  it('should guard navigation away from payment category when a radio option has been selected', () => {
    const paymentCategoryRoute = createTillRoute?.children?.find(
      (route) => route.path === FINES_MCI_ROUTING_PATHS.children.paymentCategory,
    );

    expect(paymentCategoryRoute?.canDeactivate).toEqual([canDeactivateGuard]);
  });

  it.each([
    [FINES_MCI_ROUTING_PATHS.children.details, FINES_MCI_ROUTING_TITLES.children.createTillDetails],
    [FINES_MCI_ROUTING_PATHS.children.paymentCategory, FINES_MCI_ROUTING_TITLES.children.createTillPaymentCategory],
    [FINES_MCI_ROUTING_PATHS.children.suspenseDetails, FINES_MCI_ROUTING_TITLES.children.createTillSuspenseDetails],
    [FINES_MCI_ROUTING_PATHS.children.courtFeeDetails, FINES_MCI_ROUTING_TITLES.children.createTillCourtFeeDetails],
    [FINES_MCI_ROUTING_PATHS.children.searchAccount, FINES_MCI_ROUTING_TITLES.children.createTillSearchAccount],
    [FINES_MCI_ROUTING_PATHS.children.cancel, FINES_MCI_ROUTING_TITLES.children.createTillCancel],
  ])('should expose the guarded create till %s route', (path, title) => {
    const childRoute = createTillRoute?.children?.find((route) => route.path === path);

    expect(childRoute).toEqual(
      expect.objectContaining({
        path,
        canActivate: [authGuard, routePermissionsGuard, finesMciFlowStateGuard],
        data: expect.objectContaining({
          permission: 'PROCESS_AND_ALLOCATE_PAYMENTS',
          routePermissionCodes: [FINES_PERMISSIONS['process-and-allocate-payments']],
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
    'should render the PO-3530 placeholder at the criminal account URL for an %s',
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
      expect(harness.routeNativeElement?.textContent).toContain('Successful confirm account');
      expect(harness.routeNativeElement?.textContent).toContain(
        'Placeholder page. This page will be fully implemented under ticket PO-3530.',
      );
    },
  );
});
