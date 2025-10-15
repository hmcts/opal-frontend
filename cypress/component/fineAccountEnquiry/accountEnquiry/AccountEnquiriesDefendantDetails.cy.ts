import { mount } from 'cypress/angular';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { FinesAccDefendantDetailsDefendantTabComponent } from '../../../../src/app/flows/fines/fines-acc/fines-acc-defendant-details/fines-acc-defendant-details-defendant-tab/fines-acc-defendant-details-defendant-tab.component';
import { FinesAccountStore } from '../../../../src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { FinesAccComponent } from '../../../../src/app/flows/fines/fines-acc/fines-acc.component';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

import { DOM_ELEMENTS as DOM } from './constants/defendant_details_elements';
import { DEFENDANT_HEADER_MOCK, USER_STATE_MOCK_PERMISSION_BU77 } from './mocks/defendant_details_mock';
import { FinesAccDefendantDetailsComponent } from '../../../../src/app/flows/fines/fines-acc/fines-acc-defendant-details/fines-acc-defendant-details.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_TAB_MOCK, MOCK_FINES_ACCOUNT_STATE } from './mocks/defendant_details_tab_mock';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { interceptDefendantDetails } from './intercept/interceptDefendantDetails';
import { IFinesAccountState } from 'src/app/flows/fines/fines-acc/interfaces/fines-acc-state-interface';
import { FinesAccPayloadService } from 'src/app/flows/fines/fines-acc/services/fines-acc-payload.service';
import { url } from 'inspector';
import { IOpalFinesAccountDefendantDetailsHeader } from 'src/app/flows/fines/fines-acc/fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';

describe('Defendant Details Tab (Component)', () => {
  let payloadService: FinesAccPayloadService;
  let transformedHeadingData: IFinesAccountState;

  const setupComponent = (
    prefilledData = DEFENDANT_HEADER_MOCK,
    language = MOCK_FINES_ACCOUNT_STATE,
    userState: IOpalUserState,
  ) => {
    cy.then(() => {
      mount(FinesAccDefendantDetailsComponent, {
        providers: [
          provideHttpClient(),
          provideRouter([
            {
              path: '**',
              component: FinesAccDefendantDetailsComponent,
              resolve: {
                defendantAccountHeadingData: prefilledData,
              },
              runGuardsAndResolvers: 'always',
            },
          ]),
          OpalFines,
          FinesAccPayloadService,
          {
            provide: FinesAccPayloadService,
            useFactory: () => {
              payloadService = new FinesAccPayloadService();
              transformedHeadingData = payloadService.transformAccountHeaderForStore(6000000001, prefilledData);
              cy.log('Transformed Data in PayloadService: ' + JSON.stringify(transformedHeadingData));
              return payloadService;
            },
          },
          {
            provide: FinesAccountStore,
            useFactory: () => {
              const store = new FinesAccountStore();
              cy.log('account state', store.getAccountState());
              //transformedHeadingData = payloadService.transformAccountHeaderForStore(6000000001, prefilledData);
              store.setAccountState(transformedHeadingData);
              cy.log('Base version: ' + store.getAccountState().base_version);
              return store;
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              fragment: of('defendant'),
              snapshot: {
                data: {
                  defendantAccountHeadingData: prefilledData,
                },
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

  beforeEach(() => {
    payloadService = new FinesAccPayloadService();
    transformedHeadingData = payloadService.transformAccountHeaderForStore(6000000001, DEFENDANT_HEADER_MOCK);
  });

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

  it.only('AC2a. Account maintenance permission', { tags: ['PO-784'] }, () => {
    interceptDefendantDetails();
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE, USER_STATE_MOCK_PERMISSION_BU77);
  });
});
