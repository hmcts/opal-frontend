import { IOpalFinesSourceMapping } from 'src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-source-mapping.interface';
import { fetchSourceMappingsResolver } from 'src/app/flows/fines/routing/resolvers/fetch-source-mappings-resolver/fetch-source-mappings.resolver';
import { OPAL_FINES_SOURCE_MAPPINGS_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-source-mappings.mock';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpErrorInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-error';
import { provideRouter, Router, Routes } from '@angular/router';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { SessionService } from '@hmcts/opal-frontend-common/services/session-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { mount } from 'cypress/angular';
import { NEVER } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { ACCOUNTS_PERMISSIONS } from 'src/app/flows/fines/constants/accounts-permissions.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { RELEASE_FEATURE_FLAGS } from 'src/app/flows/fines/constants/release-feature-flags.constant';
import { REPORTS_PERMISSIONS } from 'src/app/flows/fines/constants/reports-permissions.constant';
import { FINES_ROUTING_PATHS } from 'src/app/flows/fines/routing/constants/fines-routing-paths.constant';
import { SEARCH_PERMISSIONS } from 'src/app/flows/fines/constants/search-permissions.constant';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { FINES_PERMISSIONS } from 'src/app/constants/fines-permissions.constant';
import { FinesApiComponent } from 'src/app/flows/fines/fines-api/fines-api.component';
import { FinesApiProcessAllocateComponent } from 'src/app/flows/fines/fines-api/fines-api-process-allocate/fines-api-process-allocate.component';
import { FinesApiSelectBusComponent } from 'src/app/flows/fines/fines-api/fines-api-select-bus/fines-api-select-bus.component';
import { FinesApiConfirmProcessComponent } from 'src/app/flows/fines/fines-api/fines-api-confirm-process/fines-api-confirm-process.component';
import { FinesApiSummaryReportComponent } from 'src/app/flows/fines/fines-api/fines-api-summary-report/fines-api-summary-report.component';
import { FinesMciCreateAllocateComponent } from 'src/app/flows/fines/fines-mci/fines-mci-create-allocate/fines-mci-create-allocate.component';
import { FinesMciCreateTillSelectBuComponent } from 'src/app/flows/fines/fines-mci/fines-mci-create-till/fines-mci-create-till-select-bu/fines-mci-create-till-select-bu.component';
import { FinesMciCreateTillDetailsComponent } from 'src/app/flows/fines/fines-mci/fines-mci-create-till/fines-mci-create-till-details/fines-mci-create-till-details.component';
import { FinesMciCreateTillPaymentCategoryComponent } from 'src/app/flows/fines/fines-mci/fines-mci-create-till/fines-mci-create-till-payment-category/fines-mci-create-till-payment-category.component';
import { FinesMciPlaceholderComponent } from 'src/app/flows/fines/fines-mci/fines-mci-placeholder/fines-mci-placeholder.component';
import { FinesMciStore } from 'src/app/flows/fines/fines-mci/stores/fines-mci.store';
import { FinesApiStore } from 'src/app/flows/fines/fines-api/stores/fines-api.store';
import { FINES_API_ROUTING_PATHS } from 'src/app/flows/fines/fines-api/routing/constants/fines-api-routing-paths.constant';
import { FINES_MCI_ROUTING_PATHS } from 'src/app/flows/fines/fines-mci/routing/constants/fines-mci-routing-paths.constant';
import { OPAL_FINES_BUSINESS_UNIT_OUTSTANDING_AUTO_PAYMENT_COUNTS_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-business-unit-outstanding-auto-payment-counts.mock';
import { IOpalFinesBusinessUnitRefData } from 'src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';

export type FinanceComponentSetupOptions = {
  dashboardType?: string;
  sourceMappings?: IOpalFinesSourceMapping[];
  featureFlags?: Record<string, boolean>;
  permissionIds?: readonly number[];
  paymentPermissionBusinessUnitIds?: readonly number[];
  businessUnits?: IOpalFinesBusinessUnitRefData;
};

const DEFAULT_FEATURE_FLAGS = {
  ...Object.fromEntries(RELEASE_FEATURE_FLAGS.map((featureFlag) => [featureFlag, true])),
};

const DEFAULT_REPRESENTATIVE_PERMISSION_IDS = [
  ...new Set([...SEARCH_PERMISSIONS, ...ACCOUNTS_PERMISSIONS, ...REPORTS_PERMISSIONS]),
];
const DEFAULT_PAYMENT_PERMISSION_BUSINESS_UNIT_IDS = [OPAL_USER_STATE_MOCK.business_unit_users[0].business_unit_id];
const DEFAULT_DASHBOARD_TYPE = FINES_DASHBOARD_ROUTING_PATHS.children.search;

const FINANCE_COMPONENT_ROUTES: Routes = [
  {
    path: `${FINES_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.root}/:dashboardType`,
    component: DashboardComponent,
  },
  {
    path: [FINES_ROUTING_PATHS.root, FINES_ROUTING_PATHS.children.autoPaymentIn.root].join('/'),
    component: FinesApiComponent,
    canDeactivate: [canDeactivateGuard],
    children: [
      {
        path: FINES_ROUTING_PATHS.children.autoPaymentIn.children.selectBusinessUnits,
        component: FinesApiSelectBusComponent,
        data: {
          businessUnitCounts: OPAL_FINES_BUSINESS_UNIT_OUTSTANDING_AUTO_PAYMENT_COUNTS_MOCK,
        },
      },
      {
        path: FINES_ROUTING_PATHS.children.autoPaymentIn.children.processAllocate,
        component: FinesApiProcessAllocateComponent,
        resolve: { sourceMappings: fetchSourceMappingsResolver },
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: FINES_API_ROUTING_PATHS.children.confirmProcess,
        component: FinesApiConfirmProcessComponent,
      },
      {
        path: `${FINES_API_ROUTING_PATHS.children.tillSummary}/:tillId`,
        component: FinesApiSummaryReportComponent,
      },
    ],
  },
  {
    path: [FINES_ROUTING_PATHS.root, FINES_ROUTING_PATHS.children.mci.root].join('/'),
    children: [
      {
        path: '',
        redirectTo: FINES_MCI_ROUTING_PATHS.children.createAllocate,
        pathMatch: 'full',
      },
      {
        path: FINES_MCI_ROUTING_PATHS.children.createAllocate,
        component: FinesMciCreateAllocateComponent,
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: [
          FINES_MCI_ROUTING_PATHS.children.create,
          FINES_MCI_ROUTING_PATHS.children.till,
          FINES_MCI_ROUTING_PATHS.children.selectBusinessUnit,
        ].join('/'),
        component: FinesMciCreateTillSelectBuComponent,
        canDeactivate: [canDeactivateGuard],
        data: {
          businessUnits: {
            count: 1,
            refData: [
              {
                business_unit_id: 77,
                business_unit_name: 'Camden and Islington',
              },
            ],
          },
        },
      },
      {
        path: [
          FINES_MCI_ROUTING_PATHS.children.create,
          FINES_MCI_ROUTING_PATHS.children.till,
          FINES_MCI_ROUTING_PATHS.children.details,
        ].join('/'),
        component: FinesMciCreateTillDetailsComponent,
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: [
          FINES_MCI_ROUTING_PATHS.children.create,
          FINES_MCI_ROUTING_PATHS.children.till,
          FINES_MCI_ROUTING_PATHS.children.paymentCategory,
        ].join('/'),
        component: FinesMciCreateTillPaymentCategoryComponent,
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: [
          FINES_MCI_ROUTING_PATHS.children.create,
          FINES_MCI_ROUTING_PATHS.children.till,
          FINES_MCI_ROUTING_PATHS.children.cancel,
        ].join('/'),
        component: FinesMciPlaceholderComponent,
        data: { heading: 'Cancel till creation' },
      },
    ],
  },
];

const createUserStateWithPermissions = (
  permissionIds: readonly number[],
  paymentPermissionBusinessUnitIds: readonly number[],
): IOpalUserState => {
  const userState = structuredClone(OPAL_USER_STATE_MOCK);

  userState.business_unit_users = userState.business_unit_users.map((businessUnitUser) => ({
    ...businessUnitUser,
    permissions: [
      ...new Set([
        ...permissionIds,
        ...(paymentPermissionBusinessUnitIds.includes(businessUnitUser.business_unit_id)
          ? [FINES_PERMISSIONS['process-and-allocate-payments']]
          : []),
      ]),
    ].map((permissionId) => ({
      permission_id: permissionId,
      permission_name: `Permission ${permissionId}`,
    })),
  }));

  return userState;
};

const createGlobalStore = ({
  featureFlags = {},
  paymentPermissionBusinessUnitIds = [],
  permissionIds = [],
}: FinanceComponentSetupOptions) => {
  const store = new GlobalStore();

  store.setAuthenticated(true);
  store.setUserState(createUserStateWithPermissions(permissionIds, paymentPermissionBusinessUnitIds));
  store.setFeatureFlags({ ...DEFAULT_FEATURE_FLAGS, ...featureFlags });

  return store;
};

/**
 * Mounts the representative Finance page: the real application shell, primary navigation,
 * and routed Finance dashboard configuration. Mocks are limited to authentication and permissions.
 */
export const setupFinancePageComponent = ({
  dashboardType = DEFAULT_DASHBOARD_TYPE,
  sourceMappings = OPAL_FINES_SOURCE_MAPPINGS_MOCK,
  paymentPermissionBusinessUnitIds = DEFAULT_PAYMENT_PERMISSION_BUSINESS_UNIT_IDS,
  permissionIds = DEFAULT_REPRESENTATIVE_PERMISSION_IDS,
  ...options
}: FinanceComponentSetupOptions = {}) => {
  cy.intercept('GET', '/opal-fines-service/mappings/source', sourceMappings).as('sourceMappings');
  cy.then(() => {
    const routes = FINANCE_COMPONENT_ROUTES.map((route) => ({
      ...route,
      data: route.data ? { ...route.data } : undefined,
      children: route.children?.map((childRoute) => ({
        ...childRoute,
        data: childRoute.data ? { ...childRoute.data } : undefined,
      })),
    }));
    const selectBusinessUnitRoute = routes
      .find((route) => route.path === [FINES_ROUTING_PATHS.root, FINES_ROUTING_PATHS.children.mci.root].join('/'))
      ?.children?.find(
        (route) =>
          route.path ===
          [
            FINES_MCI_ROUTING_PATHS.children.create,
            FINES_MCI_ROUTING_PATHS.children.till,
            FINES_MCI_ROUTING_PATHS.children.selectBusinessUnit,
          ].join('/'),
      );

    if (options.businessUnits && selectBusinessUnitRoute) {
      selectBusinessUnitRoute.data = { businessUnits: options.businessUnits };
    }

    mount(AppComponent, {
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideRouter(routes),
        {
          provide: GlobalStore,
          useFactory: () => createGlobalStore({ ...options, paymentPermissionBusinessUnitIds, permissionIds }),
        },
        {
          provide: SessionService,
          useValue: { getTokenExpiry: () => NEVER },
        },
        {
          provide: AppInsightsService,
          useValue: { logException: () => null, logPageView: () => null },
        },
        {
          provide: LaunchDarklyService,
          useValue: {
            initializeLaunchDarklyClient: () => null,
            initializeLaunchDarklyFlags: () => Promise.resolve(),
            initializeLaunchDarklyChangeListener: () => null,
          },
        },
      ],
    }).then(({ fixture }) => {
      const router = fixture.componentRef.injector.get(Router);
      const finesApiStore = fixture.componentRef.injector.get(FinesApiStore);
      const finesMciStore = fixture.componentRef.injector.get(FinesMciStore);
      cy.wrap(fixture.componentInstance).as('appComponent');
      cy.wrap(router).as('financeRouter');
      cy.wrap(finesApiStore).as('finesApiStore');
      cy.wrap(finesMciStore).as('finesMciStore');

      return router
        .navigate(['/', FINES_ROUTING_PATHS.root, FINES_DASHBOARD_ROUTING_PATHS.root, dashboardType])
        .then((navigationSucceeded) => {
          expect(navigationSucceeded).to.be.true;
          fixture.detectChanges();
        });
    });
  });
};
