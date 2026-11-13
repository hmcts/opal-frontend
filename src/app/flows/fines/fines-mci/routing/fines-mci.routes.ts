import { Routes } from '@angular/router';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { PRIMARY_NAV_HIDDEN_ROUTE_DATA } from '@app/constants/route-data.constant';
import { fetchBusinessUnitsResolver } from '@app/flows/fines/routing/resolvers/fetch-business-units-resolver/fetch-business-units.resolver';
import { FINES_MCI_ROUTING_PATHS } from './constants/fines-mci-routing-paths.constant';
import { FINES_MCI_ROUTING_TITLES } from './constants/fines-mci-routing-titles.constant';
import { finesMciFlowStateGuard } from './guards/fines-mci-flow-state.guard';
import { finesMciCourtFeesResolver } from './resolvers/fines-mci-court-fees.resolver';
import { finesMciCriminalAccountsResolver } from './resolvers/fines-mci-criminal-accounts/fines-mci-criminal-accounts.resolver';

export const routing: Routes = [
  {
    path: '',
    redirectTo: FINES_MCI_ROUTING_PATHS.children.createAllocate,
    pathMatch: 'full',
  },
  {
    path: FINES_MCI_ROUTING_PATHS.children.createAllocate,
    loadComponent: () =>
      import('../fines-mci-create-allocate/fines-mci-create-allocate.component').then(
        (c) => c.FinesMciCreateAllocateComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
      title: FINES_MCI_ROUTING_TITLES.children.createAllocate,
    },
    resolve: {
      title: TitleResolver,
    },
  },
  {
    path: FINES_MCI_ROUTING_PATHS.children.create,
    children: [
      {
        path: FINES_MCI_ROUTING_PATHS.children.till,
        data: {
          ...PRIMARY_NAV_HIDDEN_ROUTE_DATA,
        },
        children: [
          {
            path: FINES_MCI_ROUTING_PATHS.children.selectBusinessUnit,
            loadComponent: () =>
              import('../fines-mci-create-till/fines-mci-create-till-select-bu/fines-mci-create-till-select-bu.component').then(
                (c) => c.FinesMciCreateTillSelectBuComponent,
              ),
            canActivate: [authGuard, routePermissionsGuard],
            canDeactivate: [canDeactivateGuard],
            data: {
              permission: 'PROCESS_AND_ALLOCATE_PAYMENTS',
              routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
              title: FINES_MCI_ROUTING_TITLES.children.createTillSelectBusinessUnit,
            },
            resolve: {
              businessUnits: fetchBusinessUnitsResolver,
              title: TitleResolver,
            },
          },
          {
            path: FINES_MCI_ROUTING_PATHS.children.details,
            loadComponent: () =>
              import('../fines-mci-create-till/fines-mci-create-till-details/fines-mci-create-till-details.component').then(
                (c) => c.FinesMciCreateTillDetailsComponent,
              ),
            canActivate: [authGuard, routePermissionsGuard, finesMciFlowStateGuard],
            canDeactivate: [canDeactivateGuard],
            data: {
              permission: 'PROCESS_AND_ALLOCATE_PAYMENTS',
              routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
              title: FINES_MCI_ROUTING_TITLES.children.createTillDetails,
            },
            resolve: {
              title: TitleResolver,
            },
          },
          {
            path: FINES_MCI_ROUTING_PATHS.children.paymentCategory,
            loadComponent: () =>
              import('../fines-mci-create-till/fines-mci-create-till-payment-category/fines-mci-create-till-payment-category.component').then(
                (c) => c.FinesMciCreateTillPaymentCategoryComponent,
              ),
            canActivate: [authGuard, routePermissionsGuard, finesMciFlowStateGuard],
            canDeactivate: [canDeactivateGuard],
            data: {
              permission: 'PROCESS_AND_ALLOCATE_PAYMENTS',
              routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
              title: FINES_MCI_ROUTING_TITLES.children.createTillPaymentCategory,
            },
            resolve: {
              title: TitleResolver,
            },
          },
          {
            path: FINES_MCI_ROUTING_PATHS.children.payment,
            children: [
              {
                path: FINES_MCI_ROUTING_PATHS.children.category,
                children: [
                  {
                    path: FINES_MCI_ROUTING_PATHS.children.criminal,
                    children: [
                      {
                        path: FINES_MCI_ROUTING_PATHS.children.search,
                        loadComponent: () =>
                          import('../fines-mci-payment-category-criminal-search/fines-mci-payment-category-criminal-search.component').then(
                            (c) => c.FinesMciPaymentCategoryCriminalSearchComponent,
                          ),
                        canActivate: [authGuard, routePermissionsGuard, finesMciFlowStateGuard],
                        canDeactivate: [canDeactivateGuard],
                        data: {
                          routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
                          title: FINES_MCI_ROUTING_TITLES.children.paymentCategoryCriminalSearch,
                        },
                        resolve: {
                          title: TitleResolver,
                        },
                      },
                      {
                        path: FINES_MCI_ROUTING_PATHS.children.matches,
                        loadComponent: () =>
                          import('../fines-mci-payment-category-criminal-matches/fines-mci-payment-category-criminal-matches.component').then(
                            (c) => c.FinesMciPaymentCategoryCriminalMatchesComponent,
                          ),
                        canActivate: [authGuard, routePermissionsGuard, finesMciFlowStateGuard],
                        data: {
                          routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
                          title: FINES_MCI_ROUTING_TITLES.children.paymentCategoryCriminalMatches,
                        },
                        resolve: {
                          criminalAccounts: finesMciCriminalAccountsResolver,
                          title: TitleResolver,
                        },
                      },
                      {
                        path: `${FINES_MCI_ROUTING_PATHS.children.account}/:accountId/:type`,
                        loadComponent: () =>
                          import('../fines-mci-payment-category-criminal-account/fines-mci-payment-category-criminal-account.component').then(
                            (c) => c.FinesMciPaymentCategoryCriminalAccountComponent,
                          ),
                        canActivate: [authGuard, routePermissionsGuard, finesMciFlowStateGuard],
                        data: {
                          routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
                          title: FINES_MCI_ROUTING_TITLES.children.paymentCategoryCriminalAccount,
                        },
                        resolve: { title: TitleResolver },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: FINES_MCI_ROUTING_PATHS.children.searchAccount,
            loadComponent: () =>
              import('../fines-mci-placeholder/fines-mci-placeholder.component').then(
                (c) => c.FinesMciPlaceholderComponent,
              ),
            canActivate: [authGuard, routePermissionsGuard, finesMciFlowStateGuard],
            data: {
              heading: FINES_MCI_ROUTING_TITLES.children.createTillSearchAccount,
              permission: 'PROCESS_AND_ALLOCATE_PAYMENTS',
              routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
              title: FINES_MCI_ROUTING_TITLES.children.createTillSearchAccount,
            },
            resolve: {
              title: TitleResolver,
            },
          },
          {
            path: FINES_MCI_ROUTING_PATHS.children.suspenseDetails,
            loadComponent: () =>
              import('../fines-mci-placeholder/fines-mci-placeholder.component').then(
                (c) => c.FinesMciPlaceholderComponent,
              ),
            canActivate: [authGuard, routePermissionsGuard, finesMciFlowStateGuard],
            data: {
              heading: FINES_MCI_ROUTING_TITLES.children.createTillSuspenseDetails,
              permission: 'PROCESS_AND_ALLOCATE_PAYMENTS',
              routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
              title: FINES_MCI_ROUTING_TITLES.children.createTillSuspenseDetails,
            },
            resolve: {
              title: TitleResolver,
            },
          },
          {
            path: FINES_MCI_ROUTING_PATHS.children.courtFeeDetails,
            loadComponent: () =>
              import('../fines-mci-create-till/fines-mci-create-till-court-fee-details/fines-mci-create-till-court-fee-details.component').then(
                (c) => c.FinesMciCreateTillCourtFeeDetailsComponent,
              ),
            canActivate: [authGuard, routePermissionsGuard, finesMciFlowStateGuard],
            canDeactivate: [canDeactivateGuard],
            data: {
              heading: FINES_MCI_ROUTING_TITLES.children.createTillCourtFeeDetails,
              permission: 'PROCESS_AND_ALLOCATE_PAYMENTS',
              routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
              title: FINES_MCI_ROUTING_TITLES.children.createTillCourtFeeDetails,
            },
            resolve: {
              courtFees: finesMciCourtFeesResolver,
              title: TitleResolver,
            },
          },
          {
            path: FINES_MCI_ROUTING_PATHS.children.courtFeePaymentDetails,
            loadComponent: () =>
              import('../fines-mci-placeholder/fines-mci-placeholder.component').then(
                (c) => c.FinesMciPlaceholderComponent,
              ),
            canActivate: [authGuard, routePermissionsGuard, finesMciFlowStateGuard],
            data: {
              heading: FINES_MCI_ROUTING_TITLES.children.createTillCourtFeePaymentDetails,
              permission: 'PROCESS_AND_ALLOCATE_PAYMENTS',
              routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
              title: FINES_MCI_ROUTING_TITLES.children.createTillCourtFeePaymentDetails,
            },
            resolve: {
              title: TitleResolver,
            },
          },
          {
            path: FINES_MCI_ROUTING_PATHS.children.overUnderpaymentConfirmation,
            loadComponent: () =>
              import('../fines-mci-create-till/fines-mci-create-till-over-underpayment-confirmation/fines-mci-create-till-over-underpayment-confirmation.component').then(
                (c) => c.FinesMciCreateTillOverUnderpaymentConfirmationComponent,
              ),
            canActivate: [authGuard, routePermissionsGuard, finesMciFlowStateGuard],
            canDeactivate: [canDeactivateGuard],
            data: {
              heading: FINES_MCI_ROUTING_TITLES.children.createTillOverUnderpaymentConfirmation,
              permission: 'PROCESS_AND_ALLOCATE_PAYMENTS',
              routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
              title: FINES_MCI_ROUTING_TITLES.children.createTillOverUnderpaymentConfirmation,
            },
            resolve: {
              courtFees: finesMciCourtFeesResolver,
              title: TitleResolver,
            },
          },
          {
            path: FINES_MCI_ROUTING_PATHS.children.cancel,
            loadComponent: () =>
              import('../fines-mci-placeholder/fines-mci-placeholder.component').then(
                (c) => c.FinesMciPlaceholderComponent,
              ),
            canActivate: [authGuard, routePermissionsGuard, finesMciFlowStateGuard],
            data: {
              heading: FINES_MCI_ROUTING_TITLES.children.createTillCancel,
              permission: 'PROCESS_AND_ALLOCATE_PAYMENTS',
              routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
              title: FINES_MCI_ROUTING_TITLES.children.createTillCancel,
            },
            resolve: {
              title: TitleResolver,
            },
          },
        ],
      },
    ],
  },
];
