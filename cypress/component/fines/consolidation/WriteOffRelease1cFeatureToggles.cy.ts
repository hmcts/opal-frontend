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

const CONSOLIDATION_JIRA_LABEL = '@JIRA-LABEL:consolidation';
const RELEASE_1C_WRITE_OFF_STORY_TAG = '@JIRA-STORY:PO-3757';
const RELEASE_EPIC_TAG = '@JIRA-EPIC:PO-3685';

type FeatureFlags = Record<string, boolean>;

const buildTags = (...tags: string[]) => [...tags, CONSOLIDATION_JIRA_LABEL];

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

describe('WriteOffRelease1cFeatureToggles', () => {
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
    'should make Accounts available in primary navigation for consolidation users when release-1c-write-off is enabled',
    { tags: [...buildTags(RELEASE_1C_WRITE_OFF_STORY_TAG), RELEASE_EPIC_TAG, '@R1CWriteOff'] },
    () => {
      setupAppComponent(consolidationPermissionIds, { 'release-1a': false, 'release-1c-write-off': true });

      cy.get(PrimaryNav.container).should('be.visible');
      cy.get(PrimaryNav.itemByText(PrimaryNav.labels.accounts)).should('be.visible');
    },
  );

  it(
    'should hide Accounts from primary navigation for consolidation-only users when release-1c-write-off is disabled',
    { tags: [...buildTags(RELEASE_1C_WRITE_OFF_STORY_TAG), RELEASE_EPIC_TAG, '@R1CWriteOffOff'] },
    () => {
      setupAppComponent(consolidationPermissionIds, { 'release-1a': true, 'release-1c-write-off': false });

      cy.get(PrimaryNav.container).should('be.visible');
      cy.get(PrimaryNav.itemByText(PrimaryNav.labels.accounts)).should('not.exist');
    },
  );

  it(
    'should keep Accounts available in primary navigation for draft-account users when release-1c-write-off is disabled',
    { tags: [...buildTags(RELEASE_1C_WRITE_OFF_STORY_TAG), RELEASE_EPIC_TAG, '@R1CWriteOffOff'] },
    () => {
      setupAppComponent(draftAccountPermissionIds, { 'release-1a': true, 'release-1c-write-off': false });

      cy.get(PrimaryNav.container).should('be.visible');
      cy.get(PrimaryNav.itemByText(PrimaryNav.labels.accounts)).should('be.visible');
    },
  );

  it(
    'should make the Consolidate accounts entry point available on the Accounts dashboard when release-1c-write-off is enabled',
    { tags: [...buildTags(RELEASE_1C_WRITE_OFF_STORY_TAG), RELEASE_EPIC_TAG, '@R1CWriteOff'] },
    () => {
      setupDashboardComponent(consolidationPermissionIds, { 'release-1a': false, 'release-1c-write-off': true });

      cy.contains('h1', 'Accounts').should('be.visible');
      cy.contains('h2', 'Account management').should('be.visible');
      cy.get('#finesConsolidationLink').should('be.visible').and('contain.text', 'Consolidate accounts');
    },
  );

  it(
    'should hide the Consolidate accounts entry point from the Accounts dashboard when release-1c-write-off is disabled',
    { tags: [...buildTags(RELEASE_1C_WRITE_OFF_STORY_TAG), RELEASE_EPIC_TAG, '@R1CWriteOffOff'] },
    () => {
      setupDashboardComponent(consolidationPermissionIds, { 'release-1a': false, 'release-1c-write-off': false });

      cy.contains('h1', 'Accounts').should('be.visible');
      cy.contains('h2', 'Account management').should('not.exist');
      cy.get('#finesConsolidationLink').should('not.exist');
    },
  );

  it(
    'should keep existing draft account dashboard entry points available when release-1c-write-off is disabled',
    { tags: [...buildTags(RELEASE_1C_WRITE_OFF_STORY_TAG), RELEASE_EPIC_TAG, '@R1CWriteOffOff'] },
    () => {
      setupDashboardComponent(draftAccountPermissionIds, { 'release-1a': true, 'release-1c-write-off': false });

      cy.contains('h1', 'Accounts').should('be.visible');
      cy.contains('h2', 'Draft accounts').should('be.visible');
      cy.get('#finesCavInputterLink').should('be.visible').and('contain.text', 'Create and Manage Draft Accounts');
      cy.get('#finesCavCheckerLink').should('be.visible').and('contain.text', 'Check and Validate Draft Accounts');
      cy.get('#finesConsolidationLink').should('not.exist');
    },
  );
});
