import { mount } from 'cypress/angular';
import { FinesDraftCreateAndManageTabsComponent } from 'src/app/flows/fines/fines-draft/fines-draft-create-and-manage/fines-draft-create-and-manage-tabs/fines-draft-create-and-manage-tabs.component';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import {
  DRAFT_SESSION_USER_STATE_INPUTTER_MOCK,
  DRAFT_SESSION_USER_STATE_MOCK,
} from './mocks/fines-draft-session-mock';
import { DOM_ELEMENTS } from './constants/fines_draft_cam_inputter_elements';
import {
  interceptGetApprovedAccounts,
  interceptGetDeletedAccounts,
  interceptGetInReviewAccounts,
  interceptGetRejectedAccounts,
} from './mocks/create-and-manage-intercepts';
import { FINES_ROUTING_PATHS } from 'src/app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from 'src/app/flows/fines/fines-mac/routing/constants/fines-mac-routing-paths.constant';

describe('FinesDraftCreateAndManageHeaderComponent', () => {
  const setupComponent = (userState = DRAFT_SESSION_USER_STATE_MOCK) => {
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
            useFactory: () => {
              const store = new GlobalStore();
              store.setUserState(userState);
              return store;
            },
          },
        ],
        componentProperties: {
          activeTab: 'review',
        },
      });
    });
  };

  const stubAllTabResponses = () => {
    interceptGetInReviewAccounts(200, { count: 0, summaries: [] });
    interceptGetRejectedAccounts(200, { count: 0, summaries: [] });
    interceptGetApprovedAccounts(200, { count: 0, summaries: [] });
    interceptGetDeletedAccounts(200, { count: 0, summaries: [] });
  };

  it(
    '(AC.1,AC.1a) should display a primary Create account button in the Create accounts header for inputters',
    { tags: ['@PO-2762'] },
    () => {
      stubAllTabResponses();
      setupComponent(DRAFT_SESSION_USER_STATE_INPUTTER_MOCK);

      cy.get(DOM_ELEMENTS.pageHeader).should('exist');
      cy.get(DOM_ELEMENTS.createAccountButton)
        .should('be.visible')
        .and('contain.text', 'Create account')
        .and('have.class', 'govuk-button');
    },
  );

  it('(AC.1b) clicking Create account should navigate to originator type', { tags: ['@PO-2762'] }, () => {
    stubAllTabResponses();
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
            useFactory: () => {
              const store = new GlobalStore();
              store.setUserState(DRAFT_SESSION_USER_STATE_INPUTTER_MOCK);
              return store;
            },
          },
        ],
        componentProperties: {
          activeTab: 'review',
        },
      }).then(({ fixture }) => {
        const router = fixture.componentRef.injector.get(Router);
        cy.spy(router, 'navigate').as('routerNavigate');
      });
    });

    cy.get(DOM_ELEMENTS.createAccountButton).click({ force: true });
    cy.get('@routerNavigate').should('have.been.calledOnceWith', [
      FINES_ROUTING_PATHS.root,
      FINES_MAC_ROUTING_PATHS.root,
      FINES_MAC_ROUTING_PATHS.children.originatorType,
    ]);
  });

  it(
    '(AC.1c) should hide Create account button for users without create/manage permission',
    { tags: ['@PO-2762'] },
    () => {
      stubAllTabResponses();
      setupComponent(DRAFT_SESSION_USER_STATE_MOCK);

      cy.get(DOM_ELEMENTS.createAccountButton).should('not.exist');
    },
  );

  it('(AC.1) should display Create account button across all active tabs', { tags: ['@PO-2762'] }, () => {
    stubAllTabResponses();
    setupComponent(DRAFT_SESSION_USER_STATE_INPUTTER_MOCK);

    const tabs: Array<'In review' | 'Rejected' | 'Approved' | 'Deleted'> = [
      'In review',
      'Rejected',
      'Approved',
      'Deleted',
    ];
    tabs.forEach((tab) => {
      cy.get(DOM_ELEMENTS.navigationLinks).contains(tab).click();
      cy.get(DOM_ELEMENTS.createAccountButton).should('be.visible').and('contain.text', 'Create account');
    });
  });
});
