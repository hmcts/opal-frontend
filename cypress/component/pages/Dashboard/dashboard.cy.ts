import { mount } from 'cypress/angular';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { CAM_CAV_DASHBOARD_USER_STATE_MOCK } from './mocks/cam_cav_dashboard_user_state_mock';
import { DashboardLocators as L } from '../../../shared/selectors/dashboard.locators';
import { CreateManageDraftsLocators as CMDLocators } from '../../../shared/selectors/create-manage-drafts.locators';
import { CAV_DASHBOARD_USER_STATE_MOCK } from './mocks/cav_dashboard_user_state_mock';
import { CAM_DASHBOARD_USER_STATE_MOCK } from './mocks/cam_dashboard_user_state_mock';
import { NO_PERMS_DASHBOARD_USER_STATE_MOCK } from './mocks/no_perms_dashboard_user_state_mock';
describe('DashboardComponent', () => {
  const setupComponent = (StateMock: any) => {
    mount(DashboardComponent, {
      providers: [
        RouterModule,
        GlobalStore,
        PermissionsService,
        {
          provide: GlobalStore,
          useFactory: () => {
            let store = new GlobalStore();
            store.setUserState(StateMock);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              snapshot: {},
            },
          },
        },
      ],

      componentProperties: {},
    });
  };

  it('should render component', {tags: ['@JIRA-KEY:POT-4435']}, () => {
    setupComponent(CAM_CAV_DASHBOARD_USER_STATE_MOCK);
    cy.get(L.app).should('exist');
  });

  // TODO(PO-2761): Dashboard no longer renders Manual Account Creation (#finesMacLink).
  // Re-enable these permission tests once assertions are updated to current dashboard links.
  it.skip('should only show CAV when user has correct permissions', { tags: ['@PO-604'] }, () => {
    setupComponent(CAV_DASHBOARD_USER_STATE_MOCK);
    cy.get('span').contains('testUserCAV@HMCTS.NET').should('exist');
    cy.get(CMDLocators.manualAccountCreationLink).contains('Manual Account Creation').should('exist');
    cy.get(L.checkAndValidateDraftAccountsLink).contains('Check and Validate Draft Accounts').should('exist');
    cy.get(L.createAndManageDraftAccountsLink).should('not.exist');
  });

  it.skip('should only show CAM when user has correct permissions', { tags: ['@PO-604'] }, () => {
    setupComponent(CAM_DASHBOARD_USER_STATE_MOCK);
    cy.get('span').contains('testUserCAM@HMCTS.NET').should('exist');
    cy.get(CMDLocators.manualAccountCreationLink).contains('Manual Account Creation').should('exist');
    cy.get(L.createAndManageDraftAccountsLink).contains('Create and Manage Draft Accounts').should('exist');
    cy.get(L.checkAndValidateDraftAccountsLink).should('not.exist');
  });

  it.skip('(AC.1c)should show CAV and CAM when user has the correct permissions', { tags: ['@PO-604'] }, () => {
    setupComponent(CAM_CAV_DASHBOARD_USER_STATE_MOCK);
    cy.get('span').contains('testUserCAM_CAV@HMCTS.NET').should('exist');
    cy.get(CMDLocators.manualAccountCreationLink).contains('Manual Account Creation').should('exist');
    cy.get(L.createAndManageDraftAccountsLink).contains('Create and Manage Draft Accounts').should('exist');
    cy.get(L.checkAndValidateDraftAccountsLink).contains('Check and Validate Draft Accounts').should('exist');
  });

  it.skip(
    'should not show CAV and CAM links when user does not have correct permissions',
    { tags: ['@PO-604'] },
    () => {
      setupComponent(NO_PERMS_DASHBOARD_USER_STATE_MOCK);
      cy.get('span').contains('noPermissionsTestUser@HMCTS.NET').should('exist');
      cy.get(CMDLocators.manualAccountCreationLink).contains('Manual Account Creation').should('exist');
      cy.get(L.createAndManageDraftAccountsLink).should('not.exist');
      cy.get(L.checkAndValidateDraftAccountsLink).should('not.exist');
    },
  );
});
