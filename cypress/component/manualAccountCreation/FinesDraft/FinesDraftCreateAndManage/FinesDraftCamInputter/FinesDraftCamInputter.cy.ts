import { mount } from 'cypress/angular';
import { FinesDraftCamInputterComponent } from 'src/app/flows/fines/fines-draft/fines-draft-cam/fines-draft-cam-inputter/fines-draft-cam-inputter.component';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from './mocks/fines-draft-account.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from 'src/app/stores/global/global.store';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { DateService } from '@services/date-service/date.service';
import { DRAFT_SESSION_USER_STATE_MOCK } from './mocks/fines-draft-session-mock';

describe('FinesDraftCamInputterComponent', () => {
  let store: any;
  const setupComponent = () => {
    mount(FinesDraftCamInputterComponent, {
      providers: [
        provideHttpClient(),
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

        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              snapshot: {
                url: [{ path: 'manual-account-creation' }],
              },
            },
          },
        },
      ],
      componentProperties: {
        activeTab: 'review',
      },
    });
  };
  beforeEach(() => {
    cy.intercept('GET', '*opal-fines-service/draft-accounts?business_unit=77&status=Rejected', {
      statusCode: 200,
      body: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
    }).as('getDraftAccounts');

    cy.intercept('GET', '*opal-fines-service/draft-accounts?business_unit=77&status=Submitted&status=Resubmitted', {
      statusCode: 200,
      body: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
    }).as('getSubmitted&ResubmittedDraftAccounts');
  });

  it('should render component', () => {
    cy.wait('@getDraftAccounts');
    setupComponent();
    cy.contains('a', 'Rejected').click();
  });
});
