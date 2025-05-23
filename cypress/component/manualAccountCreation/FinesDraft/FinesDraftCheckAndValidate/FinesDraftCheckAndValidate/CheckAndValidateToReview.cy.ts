import { mount } from 'cypress/angular';
import { FinesDraftCheckAndManageTabsComponent } from 'src/app/flows/fines/fines-draft/fines-draft-check-and-manage/fines-draft-check-and-manage-tabs/fines-draft-check-and-manage-tabs.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { DRAFT_SESSION_USER_STATE_MOCK } from './mocks/fines-draft-session-mock';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from './mocks/fines-draft-account.mock';
import { routes } from './constants/fines_draft_cam_inputter_routes';
import { DOM_ELEMENTS } from './constants/fines_draft_cam_inputter_elements';
import { NAVIGATION_LINKS, TABLE_HEADINGS } from './constants/fines_draft_cam_inputter_tableConstants';
import {
  interceptGetRejectedAccounts,
  interceptGetInReviewAccounts,
  interceptGetDeletedAccounts,
  interceptGetApprovedAccounts,
} from './intercepts/fines-draft-intercepts';
import { OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK } from './mocks/fines_draft_over_25_account_mock';

describe('FinesDraftCheckAndManageInReviewComponent', () => {
  const setupComponent = () => {
    cy.then(() => {
      mount(FinesDraftCheckAndValidateTabsComponent, {
        providers: [
          provideHttpClient(),
          provideRouter(routes),
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
    const approvedMockData = { count: 2, summaries: OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries };
    const rejectedMockData = { count: 0, summaries: OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries };
    interceptGetApprovedAccounts(200, approvedMockData);
    interceptGetRejectedAccounts(200, rejectedMockData);

    setupComponent();
  });
});
