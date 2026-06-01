import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { SessionService } from '@hmcts/opal-frontend-common/services/session-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { mount } from 'cypress/angular';
import { BehaviorSubject, NEVER } from 'rxjs';
import { FINES_PERMISSIONS } from 'src/app/constants/fines-permissions.constant';
import { AppComponent } from 'src/app/app.component';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { PrimaryNavigationLocators as PrimaryNav } from '../../../shared/selectors/primary-navigation.locators';

const MANUAL_ACCOUNT_CREATION_JIRA_LABEL = '@JIRA-LABEL:manual-account-creation';
const RELEASE_1A_STORY_TAG = '@JIRA-STORY:PO-3719';
const RELEASE_EPIC_TAG = '@JIRA-EPIC:PO-3685';

type FeatureFlags = Record<string, boolean>;

const buildTags = (...tags: string[]) => [...tags, MANUAL_ACCOUNT_CREATION_JIRA_LABEL];

const createUserStateWithPermissions = (permissionIds: readonly number[]): IOpalUserState => {
  const userState = structuredClone(OPAL_USER_STATE_MOCK);
  const [firstBusinessUnit] = userState.business_unit_users;

  userState.business_unit_users = [
    {
      ...firstBusinessUnit,
      permissions: permissionIds.map((permissionId) => ({
        permission_id: permissionId,
        permission_name: `Permission ${permissionId}`,
      })),
    },
  ];

  return userState;
};

const createGlobalStore = (userState: IOpalUserState, featureFlags: FeatureFlags) => {
  const store = new GlobalStore();

  store.setAuthenticated(true);
  store.setUserState(userState);
  store.setFeatureFlags(featureFlags);

  return store;
};

const draftAccountPermissionIds = [
  FINES_PERMISSIONS['create-and-manage-draft-accounts'],
  FINES_PERMISSIONS['check-and-validate-draft-accounts'],
];

const consolidationPermissionIds = [FINES_PERMISSIONS['consolidate']];

describe('FinesDraftRelease1aFeatureToggles', () => {
  const setupAppComponent = (permissionIds: readonly number[], featureFlags: FeatureFlags) => {
    cy.then(() => {
      mount(AppComponent, {
        providers: [
          provideHttpClient(),
          provideRouter([]),
          {
            provide: GlobalStore,
            useFactory: () => createGlobalStore(createUserStateWithPermissions(permissionIds), featureFlags),
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
    });
  };

  const setupDashboardComponent = (permissionIds: readonly number[], featureFlags: FeatureFlags) => {
    const dashboardTypeParamMapSubject = new BehaviorSubject(convertToParamMap({ dashboardType: 'accounts' }));
    const userState = createUserStateWithPermissions(permissionIds);

    cy.then(() => {
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
              getUniquePermissions: () => [...permissionIds],
            },
          },
          {
            provide: GlobalStore,
            useValue: {
              userState: () => userState,
              featureFlags: () => featureFlags,
            },
          },
        ],
      });
    });
  };

  it(
    '(AC.1, AC.2, AC.4) should show Accounts in primary navigation for draft-account users when release-1a is enabled',
    { tags: [...buildTags(RELEASE_1A_STORY_TAG), RELEASE_EPIC_TAG, '@R1A'] },
    () => {
      setupAppComponent(draftAccountPermissionIds, { 'release-1a': true });

      cy.get(PrimaryNav.container).should('be.visible');
      cy.get(PrimaryNav.itemByText(PrimaryNav.labels.accounts)).should('be.visible');
    },
  );

  it(
    '(AC.3, AC.4) should hide Accounts in primary navigation for draft-account only users when release-1a is disabled',
    { tags: [...buildTags(RELEASE_1A_STORY_TAG), RELEASE_EPIC_TAG, '@R1AOff'] },
    () => {
      setupAppComponent(draftAccountPermissionIds, { 'release-1a': false });

      cy.get(PrimaryNav.container).should('be.visible');
      cy.get(PrimaryNav.itemByText(PrimaryNav.labels.accounts)).should('not.exist');
    },
  );

  it(
    '(AC.4, AC.5) should keep Accounts in primary navigation for consolidation users when release-1a is disabled',
    { tags: [...buildTags(RELEASE_1A_STORY_TAG), RELEASE_EPIC_TAG, '@R1AOff'] },
    () => {
      setupAppComponent(consolidationPermissionIds, { 'release-1a': false });

      cy.get(PrimaryNav.container).should('be.visible');
      cy.get(PrimaryNav.itemByText(PrimaryNav.labels.accounts)).should('be.visible');
    },
  );

  it(
    '(AC.1, AC.2, AC.4) should show the Draft accounts dashboard entry points when release-1a is enabled',
    { tags: [...buildTags(RELEASE_1A_STORY_TAG), RELEASE_EPIC_TAG, '@R1A'] },
    () => {
      setupDashboardComponent(draftAccountPermissionIds, { 'release-1a': true });

      cy.contains('h1', 'Accounts').should('be.visible');
      cy.contains('h2', 'Draft accounts').should('be.visible');
      cy.get('#finesCavInputterLink').should('be.visible').and('contain.text', 'Create and Manage Draft Accounts');
      cy.get('#finesCavCheckerLink').should('be.visible').and('contain.text', 'Check and Validate Draft Accounts');
    },
  );

  it(
    '(AC.3, AC.4) should hide the Draft accounts dashboard entry points when release-1a is disabled',
    { tags: [...buildTags(RELEASE_1A_STORY_TAG), RELEASE_EPIC_TAG, '@R1AOff'] },
    () => {
      setupDashboardComponent(draftAccountPermissionIds, { 'release-1a': false });

      cy.contains('h1', 'Accounts').should('be.visible');
      cy.contains('h2', 'Draft accounts').should('not.exist');
      cy.get('#finesCavInputterLink').should('not.exist');
      cy.get('#finesCavCheckerLink').should('not.exist');
    },
  );

  it(
    '(AC.4, AC.5) should keep non-R1A Accounts dashboard links available when release-1a is disabled',
    { tags: [...buildTags(RELEASE_1A_STORY_TAG), RELEASE_EPIC_TAG, '@R1AOff'] },
    () => {
      setupDashboardComponent(consolidationPermissionIds, { 'release-1a': false });

      cy.contains('h1', 'Accounts').should('be.visible');
      cy.get('#finesConsolidationLink').should('be.visible').and('contain.text', 'Consolidate accounts');
      cy.get('#finesCavInputterLink').should('not.exist');
      cy.get('#finesCavCheckerLink').should('not.exist');
    },
  );
});
