import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router, Routes } from '@angular/router';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { SessionService } from '@hmcts/opal-frontend-common/services/session-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
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

export type FinanceComponentSetupOptions = {
  dashboardType?: string;
  featureFlags?: Record<string, boolean>;
  permissionIds?: readonly number[];
  paymentPermissionBusinessUnitIds?: readonly number[];
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
  paymentPermissionBusinessUnitIds = DEFAULT_PAYMENT_PERMISSION_BUSINESS_UNIT_IDS,
  permissionIds = DEFAULT_REPRESENTATIVE_PERMISSION_IDS,
  ...options
}: FinanceComponentSetupOptions = {}) => {
  cy.then(() => {
    mount(AppComponent, {
      providers: [
        provideHttpClient(),
        provideRouter(FINANCE_COMPONENT_ROUTES),
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
          useValue: { logPageView: () => null },
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
      return router
        .navigate(['/', FINES_ROUTING_PATHS.root, FINES_DASHBOARD_ROUTING_PATHS.root, dashboardType])
        .then((navigationSucceeded) => {
          expect(navigationSucceeded).to.be.true;
          fixture.detectChanges();
        });
    });
  });
};
