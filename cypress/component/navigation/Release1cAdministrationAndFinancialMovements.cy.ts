import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { mount } from 'cypress/angular';
import { BehaviorSubject, NEVER } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { SessionService } from '@hmcts/opal-frontend-common/services/session-service';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { PrimaryNavigationLocators as PrimaryNav } from '../../shared/selectors/primary-navigation.locators';
import {
  RELEASE_1C_ADMINISTRATION_FEATURE_FLAG,
  RELEASE_1C_FINANCIAL_MOVEMENTS_FEATURE_FLAG,
} from '@app/flows/fines/constants/release-feature-flags.constant';
import { FINES_PERMISSIONS } from 'src/app/constants/fines-permissions.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';

const NAVIGATION_JIRA_LABEL = '@JIRA-LABEL:primary-nav-and-dashboards';
const RELEASE_1C_STORY_TAG = '@JIRA-STORY:PO-7266';
const RELEASE_1C_EPIC_TAG = '@JIRA-EPIC:PO-3685';

type FeatureFlags = Record<string, boolean>;

const DEFAULT_RELEASE_FEATURE_FLAGS = {
  [RELEASE_1C_ADMINISTRATION_FEATURE_FLAG]: true,
  [RELEASE_1C_FINANCIAL_MOVEMENTS_FEATURE_FLAG]: true,
};

const createUserState = () => {
  const userState = structuredClone(OPAL_USER_STATE_MOCK);

  userState.business_unit_users = userState.business_unit_users.map((businessUnitUser) => ({
    ...businessUnitUser,
    permissions: [
      {
        permission_id: FINES_PERMISSIONS['operational-report-by-enforcement'],
        permission_name: 'Permission',
      },
    ],
  }));

  return userState;
};

const setupAppComponent = (featureFlags: FeatureFlags) =>
  mount(AppComponent, {
    providers: [
      provideHttpClient(),
      provideRouter([]),
      {
        provide: GlobalStore,
        useFactory: () => {
          const store = new GlobalStore();
          store.setAuthenticated(true);
          store.setUserState(createUserState());
          store.setFeatureFlags({ ...DEFAULT_RELEASE_FEATURE_FLAGS, ...featureFlags });
          return store;
        },
      },
      {
        provide: SessionService,
        useValue: {
          getTokenExpiry: () => NEVER,
        },
      },
      {
        provide: AppInsightsService,
        useValue: {
          logPageView: () => null,
        },
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
  });

const setupDashboardComponent = (dashboardType: string, featureFlags: FeatureFlags) => {
  const dashboardTypeParamMapSubject = new BehaviorSubject(convertToParamMap({ dashboardType }));

  return mount(DashboardComponent, {
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: {
          paramMap: dashboardTypeParamMapSubject.asObservable(),
        },
      },
      {
        provide: PermissionsService,
        useValue: {
          getUniquePermissions: () => [FINES_PERMISSIONS['operational-report-by-enforcement']],
        },
      },
      {
        provide: GlobalStore,
        useValue: {
          userState: () => null,
          featureFlags: () => ({ ...DEFAULT_RELEASE_FEATURE_FLAGS, ...featureFlags }),
        },
      },
    ],
  }).then(({ fixture }) => {
    const router = fixture.componentRef.injector.get(Router);
    cy.stub(router, 'navigateByUrl').callsFake(() => Promise.resolve(true));
    fixture.detectChanges();
  });
};

describe(
  'Release1cAdministrationAndFinancialMovements',
  { tags: [NAVIGATION_JIRA_LABEL, RELEASE_1C_STORY_TAG, RELEASE_1C_EPIC_TAG] },
  () => {
    it('shows Administration and Finance in the primary navigation when both flags are enabled', {tags: ['@JIRA-TEST-KEY:PO-8351']}, () => {
      setupAppComponent({});

      cy.get(PrimaryNav.container).should('exist');
      cy.get(PrimaryNav.itemByText(PrimaryNav.labels.administration)).should('exist');
      cy.get(PrimaryNav.itemByText(PrimaryNav.labels.finance)).should('exist');
    });

    it('hides Administration and Finance from the primary navigation when both flags are disabled', {tags: ['@JIRA-TEST-KEY:PO-8352']}, () => {
      setupAppComponent({
        [RELEASE_1C_ADMINISTRATION_FEATURE_FLAG]: false,
        [RELEASE_1C_FINANCIAL_MOVEMENTS_FEATURE_FLAG]: false,
      });

      cy.get(PrimaryNav.container).should('exist');
      cy.get(PrimaryNav.itemByText(PrimaryNav.labels.administration)).should('not.exist');
      cy.get(PrimaryNav.itemByText(PrimaryNav.labels.finance)).should('not.exist');
    });

    it('shows the Administration dashboard placeholder when release-1c-administration is enabled', {tags: ['@JIRA-TEST-KEY:PO-8353']}, () => {
      setupDashboardComponent(FINES_DASHBOARD_ROUTING_PATHS.children.administration, {});

      cy.contains('h1', 'Administration').should('be.visible');
      cy.contains('h2', 'Pending development').should('be.visible');
      cy.get('#testAdministrationLink').should('be.visible').and('contain.text', 'Test Administration Link');
    });

    it('hides Administration dashboard content when release-1c-administration is disabled', {tags: ['@JIRA-TEST-KEY:PO-8354']}, () => {
      setupDashboardComponent(FINES_DASHBOARD_ROUTING_PATHS.children.administration, {
        [RELEASE_1C_ADMINISTRATION_FEATURE_FLAG]: false,
      });

      cy.contains('h1', 'Administration').should('be.visible');
      cy.contains('h2', 'Pending development').should('not.exist');
      cy.get('#testAdministrationLink').should('not.exist');
    });

    it('shows the Finance dashboard placeholder when release-1c-financial-movements is enabled', {tags: ['@JIRA-TEST-KEY:PO-8355']}, () => {
      setupDashboardComponent(FINES_DASHBOARD_ROUTING_PATHS.children.finance, {});

      cy.contains('h1', 'Finance').should('be.visible');
      cy.contains('h2', 'Pending development').should('be.visible');
      cy.get('#testFinanceLink').should('be.visible').and('contain.text', 'Test Finance Link');
    });

    it('hides Finance dashboard content when release-1c-financial-movements is disabled', {tags: ['@JIRA-TEST-KEY:PO-8356']}, () => {
      setupDashboardComponent(FINES_DASHBOARD_ROUTING_PATHS.children.finance, {
        [RELEASE_1C_FINANCIAL_MOVEMENTS_FEATURE_FLAG]: false,
      });

      cy.contains('h1', 'Finance').should('be.visible');
      cy.contains('h2', 'Pending development').should('not.exist');
      cy.get('#testFinanceLink').should('not.exist');
    });
  },
);
