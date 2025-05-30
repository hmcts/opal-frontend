import { mount } from 'cypress/angular';
import { FinesDraftCheckAndValidateTabsComponent } from 'src/app/flows/fines/fines-draft/fines-draft-check-and-validate/fines-draft-check-and-validate-tabs/fines-draft-check-and-validate-tabs.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { DRAFT_SESSION_USER_STATE_MOCK } from './mocks/check-and-validate-session-mock';
import { OPAL_FINES_DRAFT_VALIDATE_ACCOUNTS_MOCK } from './mocks/fines-draft-validate-account.mock';
import { DOM_ELEMENTS } from './constants/fines_draft_cav_elements';
import { NAVIGATION_LINKS, TABLE_HEADINGS } from './constants/fines_draft_cav_tableConstants';
import {
  interceptCAVGetDeletedAccounts,
  interceptCAVGetRejectedAccounts,
  interceptCAVGetToReviewAccounts,
} from './intercepts/check-and-validate-intercepts';
import { OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK } from './mocks/fines_draft_over_25_account_mock';
import { empty } from 'rxjs';

describe('FinesDraftCheckAndManageInReviewComponent', () => {
  const setupComponent = () => {
    cy.then(() => {
      mount(FinesDraftCheckAndValidateTabsComponent, {
        providers: [
          provideHttpClient(),
          provideRouter([]),
          OpalFines,
          DateService,
          FinesMacPayloadService,
          FinesDraftStore,
          {
            provide: GlobalStore,
            useFactory: () => {
              let store = new GlobalStore();
              store.setUserState(DRAFT_SESSION_USER_STATE_MOCK);
              return store;
            },
          },
        ],
        componentProperties: {},
      });
    });
  };

  it('(AC.1)should show all the tabs presented on the page', { tags: ['@PO-593'] }, () => {
    const emptyMockData = { count: 0, summaries: [] };

    interceptCAVGetRejectedAccounts(200, emptyMockData);
    interceptCAVGetToReviewAccounts(200, emptyMockData);
    interceptCAVGetDeletedAccounts(200, emptyMockData);

    setupComponent();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('To review').click();

    cy.get(DOM_ELEMENTS.navigationLinks).each((link, index) => {
      const expectedLink = NAVIGATION_LINKS[index];
      cy.wrap(link).should('contain', expectedLink);
      if (expectedLink === 'To review') {
        cy.wrap(link).should('have.attr', 'aria-current', 'page');
      } else {
        cy.wrap(link).should('not.have.attr', 'aria-current', 'page');
      }
    });
  });
});
