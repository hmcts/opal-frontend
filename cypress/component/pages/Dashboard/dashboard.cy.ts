import { mount } from 'cypress/angular';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GlobalStore } from 'src/app/stores/global/global.store';
import { PermissionsService } from '@services/permissions-service/permissions.service';
import { DASHBOARD_USER_STATE_MOCK } from './mocks/dashboard_user_state_mock';
import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';
import { DOM_ELEMENTS } from './constants/dashboard_elements';
describe('DashboardComponent', () => {
  const setupComponent = (StateMock: any = DASHBOARD_USER_STATE_MOCK) => {
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

  it('should render component', () => {
    setupComponent();
    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it('should only show CAV when user has correct permissions', { tags: ['@PO-604'] }, () => {
    let cavMock = DASHBOARD_USER_STATE_MOCK;
    cavMock.business_unit_user[0].permissions[2].permission_id = 0;
    setupComponent(cavMock);
    cy.get('span').contains('timmyTest@HMCTS.NET').should('exist');
    cy.get(DOM_ELEMENTS.finesMacLink).contains('Manual Account Creation').should('exist');
    cy.get(DOM_ELEMENTS.CAVlink).contains('Check and Validate Draft Accounts').should('exist');
  });

  it('(AC.1c)should only show CAV and CAM when user has the correct permissions', { tags: ['@PO-604'] }, () => {
    setupComponent();
    cy.get('span').contains('timmyTest@HMCTS.NET').should('exist');
    cy.get(DOM_ELEMENTS.finesMacLink).contains('Manual Account Creation').should('exist');
    cy.get(DOM_ELEMENTS.CAMlink).contains('Create and Manage Draft Accounts').should('exist');
    cy.get(DOM_ELEMENTS.CAVlink).contains('Check and Validate Draft Accounts').should('exist');
  });

  it('should not show CAV and CAM links when user does not have correct permissions', { tags: ['@PO-604'] }, () => {
    setupComponent(SESSION_USER_STATE_MOCK);
    cy.get('span').contains('timmyTest@HMCTS.NET').should('exist');
    cy.get(DOM_ELEMENTS.finesMacLink).contains('Manual Account Creation').should('exist');
    cy.get(DOM_ELEMENTS.CAMlink).should('not.exist');
    cy.get(DOM_ELEMENTS.CAVlink).should('not.exist');
  });
});
