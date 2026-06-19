import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { SessionService } from '@hmcts/opal-frontend-common/services/session-service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { mount } from 'cypress/angular';
import { BehaviorSubject, NEVER } from 'rxjs';
import { FINES_PERMISSIONS } from 'src/app/constants/fines-permissions.constant';
import { AppComponent } from 'src/app/app.component';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { FinesDraftCreateAndManageTabsComponent } from 'src/app/flows/fines/fines-draft/fines-draft-create-and-manage/fines-draft-create-and-manage-tabs/fines-draft-create-and-manage-tabs.component';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { OpalFines } from 'src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from './FinesDraftCreateAndManage/FinesDraftCreateAndManageComponent/mocks/fines-draft-account.mock';
import { DRAFT_SESSION_USER_STATE_MOCK } from './FinesDraftCreateAndManage/FinesDraftCreateAndManageComponent/mocks/fines-draft-session-mock';
import {
  interceptGetApprovedAccounts,
  interceptGetRejectedAccounts,
} from './FinesDraftCreateAndManage/FinesDraftCreateAndManageComponent/mocks/create-and-manage-intercepts';
import { PrimaryNavigationLocators as PrimaryNav } from '../../../shared/selectors/primary-navigation.locators';
import { DraftAccountsTableLocators as Table } from '../../../shared/selectors/draft-accounts-table.locators';

const MANUAL_ACCOUNT_CREATION_JIRA_LABEL = '@JIRA-LABEL:manual-account-creation';
const RELEASE_1A_STORY_TAG = '@JIRA-STORY:PO-3719';
const RELEASE_1B_STORY_TAG = '@JIRA-STORY:PO-3720';
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

  const setupApprovedAccounts = (featureFlags: FeatureFlags, approvedAccountLinkEnabled = false) => {
    interceptGetRejectedAccounts(200, { count: 0, summaries: [] });
    interceptGetApprovedAccounts(200, {
      count: OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries.length,
      summaries: OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries,
    });

    const userState = structuredClone(DRAFT_SESSION_USER_STATE_MOCK);

    if (approvedAccountLinkEnabled) {
      userState.business_unit_users = userState.business_unit_users.map((businessUnitUser) => ({
        ...businessUnitUser,
        permissions: [
          ...businessUnitUser.permissions,
          {
            permission_id: FINES_PERMISSIONS['search-and-view-accounts'],
            permission_name: 'Search and View Accounts',
          },
        ],
      }));
    }

    cy.then(() => {
      mount(FinesDraftCreateAndManageTabsComponent, {
        providers: [
          provideHttpClient(),
          OpalFines,
          DateService,
          FinesMacPayloadService,
          FinesDraftStore,
          provideRouter([]),
          {
            provide: GlobalStore,
            useFactory: () => createGlobalStore(userState, featureFlags),
          },
        ],
        componentProperties: {
          activeTab: 'review',
        },
      });
    });
    cy.contains('a.moj-sub-navigation__link', 'Approved').should('be.visible').click();
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
      setupAppComponent(consolidationPermissionIds, { 'release-1a': false, 'release-1c-write-off': true });

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
      setupDashboardComponent(consolidationPermissionIds, { 'release-1a': false, 'release-1c-write-off': true });

      cy.contains('h1', 'Accounts').should('be.visible');
      cy.get('#finesConsolidationLink').should('be.visible').and('contain.text', 'Consolidate accounts');
      cy.get('#finesCavInputterLink').should('not.exist');
      cy.get('#finesCavCheckerLink').should('not.exist');
    },
  );

  it(
    '(AC.5) should show approved account numbers as links when release-1b is enabled',
    { tags: [...buildTags(RELEASE_1A_STORY_TAG, RELEASE_1B_STORY_TAG), RELEASE_EPIC_TAG, '@R1A', '@R1B'] },
    () => {
      setupApprovedAccounts({ 'release-1a': true, 'release-1b': true }, true);

      cy.get(Table.cells.accountLink).should('have.length', 2);
      cy.contains(Table.cells.accountLink, 'FINE123456').should('be.visible');
      cy.contains(Table.cells.accountLink, 'FP123456').should('be.visible');
    },
  );
});
