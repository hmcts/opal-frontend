import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { SessionService } from '@hmcts/opal-frontend-common/services/session-service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { mount } from 'cypress/angular';
import { NEVER } from 'rxjs';
import { FINES_PERMISSIONS } from 'src/app/constants/fines-permissions.constant';
import { AppComponent } from 'src/app/app.component';
import { FinesDraftCreateAndManageTabsComponent } from 'src/app/flows/fines/fines-draft/fines-draft-create-and-manage/fines-draft-create-and-manage-tabs/fines-draft-create-and-manage-tabs.component';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { OpalFines } from 'src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { PrimaryNavigationLocators as PrimaryNav } from '../../shared/selectors/primary-navigation.locators';
import { DraftAccountsTableLocators as Table } from '../../shared/selectors/draft-accounts-table.locators';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '../manualAccountCreation/FinesDraft/FinesDraftCreateAndManage/FinesDraftCreateAndManageComponent/mocks/fines-draft-account.mock';
import { DRAFT_SESSION_USER_STATE_MOCK } from '../manualAccountCreation/FinesDraft/FinesDraftCreateAndManage/FinesDraftCreateAndManageComponent/mocks/fines-draft-session-mock';
import {
  interceptGetApprovedAccounts,
  interceptGetRejectedAccounts,
} from '../manualAccountCreation/FinesDraft/FinesDraftCreateAndManage/FinesDraftCreateAndManageComponent/mocks/create-and-manage-intercepts';
import { FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK } from 'src/app/flows/fines/fines-draft/fines-draft-table-wrapper/mocks/fines-draft-table-wrapper-table-data.mock';

const MANUAL_ACCOUNT_CREATION_JIRA_LABEL = '@JIRA-LABEL:manual-account-creation';
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

describe('FinesRelease1bFeatureToggles', () => {
  const searchPermissionIds = [FINES_PERMISSIONS['search-and-view-accounts']];

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
          activeTab: 'approved',
        },
      });
    });
  };

  it(
    'should show Search in primary navigation when release-1b is enabled',
    { tags: [...buildTags(RELEASE_1B_STORY_TAG), RELEASE_EPIC_TAG, '@R1B', '@JIRA-TEST-KEY:PO-3720'] },
    () => {
      setupAppComponent(searchPermissionIds, { 'release-1b': true });

      cy.get(PrimaryNav.container).should('be.visible');
      cy.get(PrimaryNav.itemByText(PrimaryNav.labels.search)).should('be.visible');
    },
  );

  it(
    'should hide Search in primary navigation when release-1b is disabled',
    { tags: [...buildTags(RELEASE_1B_STORY_TAG), RELEASE_EPIC_TAG, '@R1BOff', '@JIRA-TEST-KEY:PO-3720'] },
    () => {
      setupAppComponent(searchPermissionIds, { 'release-1b': false });

      cy.get(PrimaryNav.container).should('be.visible');
      cy.get(PrimaryNav.itemByText(PrimaryNav.labels.search)).should('not.exist');
    },
  );

  it(
    'should hide approved account links when release-1b is disabled',
    { tags: [...buildTags(RELEASE_1B_STORY_TAG), RELEASE_EPIC_TAG, '@R1BOff', '@JIRA-TEST-KEY:PO-3720'] },
    () => {
      setupApprovedAccounts({ 'release-1b': false });

      cy.contains('a.moj-sub-navigation__link', 'Approved').click();
      cy.contains('h2', 'Approved').should('be.visible');
      cy.get(Table.cells.accountLink).should('not.exist');
      cy.get('#account').should('contain.text', 'FINE123456');
    },
  );

  it(
    'should show approved account links when release-1b is enabled',
    { tags: [...buildTags(RELEASE_1B_STORY_TAG), RELEASE_EPIC_TAG, '@R1B', '@JIRA-TEST-KEY:PO-3720'] },
    () => {
      setupApprovedAccounts({ 'release-1b': true }, true);

      cy.contains('a.moj-sub-navigation__link', 'Approved').click();
      cy.contains('h2', 'Approved').should('be.visible');
      cy.get(Table.cells.accountLink).should('have.length', 2);
      cy.get(Table.cells.accountLink).eq(0).should('contain.text', 'FINE123456');
      cy.get(Table.cells.accountLink).eq(1).should('contain.text', 'FP123456');
    },
  );
});
