import { describe, expect, it } from 'vitest';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { PRIMARY_NAV_HIDDEN_ROUTE_DATA } from '@app/constants/route-data.constant';
import { fetchBusinessUnitsResolver } from '@app/flows/fines/routing/resolvers/fetch-business-units-resolver/fetch-business-units.resolver';
import { routing } from './fines-mci.routes';
import { FINES_MCI_ROUTING_PATHS } from './constants/fines-mci-routing-paths.constant';
import { FINES_MCI_ROUTING_TITLES } from './constants/fines-mci-routing-titles.constant';
import { finesMciFlowStateGuard } from './guards/fines-mci-flow-state.guard';
import { finesMciCourtFeesResolver } from './resolvers/fines-mci-court-fees.resolver';
import { FinesMciCreateTillCourtFeeDetailsComponent } from '../fines-mci-create-till/fines-mci-create-till-court-fee-details/fines-mci-create-till-court-fee-details.component';
import { FinesMciCreateTillOverUnderpaymentConfirmationComponent } from '../fines-mci-create-till/fines-mci-create-till-over-underpayment-confirmation/fines-mci-create-till-over-underpayment-confirmation.component';
import { FinesMciPlaceholderComponent } from '../fines-mci-placeholder/fines-mci-placeholder.component';

describe('finesMci routes', () => {
  const createTillRoute = routing
    .find((route) => route.path === 'create')
    ?.children?.find((route) => route.path === 'till');

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

  it('loads the Court Fee Details screen from the category journey', async () => {
    const courtFeeRoute = createTillRoute?.children?.find(
      (route) => route.path === FINES_MCI_ROUTING_PATHS.children.courtFeeDetails,
    );

    expect(await courtFeeRoute?.loadComponent?.()).toBe(FinesMciCreateTillCourtFeeDetailsComponent);
    expect(courtFeeRoute?.canDeactivate).toEqual([canDeactivateGuard]);
    expect(courtFeeRoute?.resolve?.['courtFees']).toBe(finesMciCourtFeesResolver);
  });

  it('loads the temporary Court Fee Payment Details destination', async () => {
    const route = createTillRoute?.children?.find(
      (child) => child.path === FINES_MCI_ROUTING_PATHS.children.courtFeePaymentDetails,
    );

    expect(await route?.loadComponent?.()).toBe(FinesMciPlaceholderComponent);
    expect(route?.data?.['heading']).toBe(FINES_MCI_ROUTING_TITLES.children.createTillCourtFeePaymentDetails);
  });

  it('loads the overpayment and underpayment confirmation screen', async () => {
    const route = createTillRoute?.children?.find(
      (child) => child.path === FINES_MCI_ROUTING_PATHS.children.overUnderpaymentConfirmation,
    );

    expect(await route?.loadComponent?.()).toBe(FinesMciCreateTillOverUnderpaymentConfirmationComponent);
    expect(route?.canDeactivate).toEqual([canDeactivateGuard]);
    expect(route?.resolve?.['courtFees']).toBe(finesMciCourtFeesResolver);
    expect(route?.data?.['heading']).toBe(FINES_MCI_ROUTING_TITLES.children.createTillOverUnderpaymentConfirmation);
  });

  it.each([
    [FINES_MCI_ROUTING_PATHS.children.details, FINES_MCI_ROUTING_TITLES.children.createTillDetails],
    [FINES_MCI_ROUTING_PATHS.children.paymentCategory, FINES_MCI_ROUTING_TITLES.children.createTillPaymentCategory],
    [FINES_MCI_ROUTING_PATHS.children.suspenseDetails, FINES_MCI_ROUTING_TITLES.children.createTillSuspenseDetails],
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
        canActivate: [authGuard, routePermissionsGuard, finesMciFlowStateGuard],
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
});
