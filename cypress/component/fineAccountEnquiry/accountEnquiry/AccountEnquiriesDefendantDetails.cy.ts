import { mount } from 'cypress/angular';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { FinesAccDefendantDetailsDefendantTabComponent } from '../../../../src/app/flows/fines/fines-acc/fines-acc-defendant-details/fines-acc-defendant-details-defendant-tab/fines-acc-defendant-details-defendant-tab.component';
import { FinesAccountStore } from '../../../../src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

import { DOM_ELEMENTS as DOM } from './constants/defendant_details_elements';
import { DEFENDANT_HEADER_MOCK, USER_STATE_MOCK_PERMISSION_BU77 } from './mocks/defendant_details_mock';
import { FinesAccDefendantDetailsComponent } from '../../../../src/app/flows/fines/fines-acc/fines-acc-defendant-details/fines-acc-defendant-details.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_TAB_MOCK, MOCK_FINES_ACCOUNT_STATE } from './mocks/defendant_details_tab_mock';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { interceptDefendantDetails } from './intercept/defendant_details_tab_intercept';
import { get } from 'https';

describe('Defendant Details Tab (Component)', () => {
  const setupComponent = (
    prefilledData = DEFENDANT_HEADER_MOCK,
    language = MOCK_FINES_ACCOUNT_STATE,
    userState: IOpalUserState,
  ) => {
    cy.then(() => {
      mount(FinesAccDefendantDetailsComponent, {
        providers: [
          provideHttpClient(),
          OpalFines,
          {
            provide: FinesAccountStore,
            useFactory: () => {
              const store = new FinesAccountStore();
              const mockState = structuredClone(MOCK_FINES_ACCOUNT_STATE);

              if (prefilledData.party_details.organisation_flag) {
                mockState.party_name = prefilledData.party_details.organisation_details?.organisation_name ?? '';
                mockState.party_type = 'Organisation';
              } else {
                mockState.party_name =
                  `${prefilledData.party_details.individual_details?.forenames ?? ''} ${prefilledData.party_details.individual_details?.surname ?? ''}`.trim();
                mockState.party_type = 'Individual';
              }

              store.setAccountState(mockState);
              return store;
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              fragment: of('defendant-account-parties'),
              snapshot: {
                data: {
                  defendantAccountHeadingData: prefilledData,
                },
                fragment: 'defendant-account-parties',
                parent: { snapshot: { url: [{ path: 'defendant' }] } },
              },
            },
          },
          UtilsService,
          {
            provide: GlobalStore,
            useFactory: () => {
              const store = new GlobalStore();
              store.setUserState(userState);
              return store;
            },
          },
          {
            provide: Router,
            useValue: {
              navigate: cy.stub().as('routerNavigate'),
            },
          },
        ],
      });
    });
  };

  it('AC1a, AC1b, AC1d. Defendant details tab layout, debtor flag true', { tags: ['PO-784'] }, () => {
    interceptDefendantDetails();
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE, USER_STATE_MOCK_PERMISSION_BU77);

    cy.get(DOM.pageHeader).should('exist');
    cy.get(DOM.headingWithCaption).should('exist');
    cy.get(DOM.headingName).should('exist').and('contain.text', 'Anna Graham');
    cy.get(DOM.accountInfo).should('exist');
    cy.get(DOM.summaryMetricBar).should('exist');
    cy.get(DOM.subnav).should('exist');
    cy.get(DOM.atAGlanceTabComponent).should('exist');
  });

  it('AC1c. Defendant details tab layout, debtor flag false', { tags: ['PO-784'] }, () => {
    interceptDefendantDetails();
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE, USER_STATE_MOCK_PERMISSION_BU77);
  });

  it('AC2a. Account maintenance permission', { tags: ['PO-784'] }, () => {
    interceptDefendantDetails();
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE, USER_STATE_MOCK_PERMISSION_BU77);
  });
});
