import { mount } from 'cypress/angular';
import { FinesMacReviewAccountComponent } from 'src/app/flows/fines/fines-mac/fines-mac-review-account/fines-mac-review-account.component';
import { ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
//../../../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-draft-add-account-payload.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { SESSION_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_AYG_CHECK_ACCOUNT_MOCK } from 'cypress/component/manualAccountCreation/FinesMacReviewAccount/mocks/fines_mac_review_account_mocks';
import { DOM_ELEMENTS } from 'cypress/component/manualAccountCreation/FinesDraft/FinesDraftCheckAndValidate/FinesDraftCheckAndValidate/constants/fines_draft_review_account_elements';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { FINES_DRAFT_STATE } from 'src/app/flows/fines/fines-draft/constants/fines-draft-state.constant';
import { FinesMacDeleteAccountConfirmationComponent } from 'src/app/flows/fines/fines-mac/fines-mac-delete-account-confirmation/fines-mac-delete-account-confirmation.component';

describe('ReviewAccountDeletionComponent', () => {
  let finesMacState = structuredClone(FINES_AYG_CHECK_ACCOUNT_MOCK);
  let finesDraftState = structuredClone(FINES_DRAFT_STATE);
  let finesAccountPayload = FINES_MAC_PAYLOAD_ADD_ACCOUNT;

  let store: any;
  const setupComponent = (
    finesDraftStateMock: any = finesDraftState,
    activatedRouteMock: any = null,
    amend: boolean = true,
    checker: boolean = true,
  ) => {
    mount(FinesMacDeleteAccountConfirmationComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        UtilsService,
        FinesMacPayloadService,
        Router,
        {
          provide: GlobalStore,
          useFactory: () => {
            let store = new GlobalStore();
            store.setUserState(SESSION_USER_STATE_MOCK);
            store.setError({
              error: false,
              message: '',
            });
            return store;
          },
        },
        {
          provide: FinesMacStore,
          useFactory: () => {
            let store = new FinesMacStore();
            store.setFinesMacStore(finesMacState);
            return store;
          },
        },
        {
          provide: FinesDraftStore,
          useFactory: () => {
            let store = new FinesDraftStore();
            store.setFinesDraftState(finesDraftStateMock);
            store.setAmend(amend);
            store.setChecker(checker);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                reviewAccountFetchMap: {
                  finesMacStore: finesMacState,
                  finesMacDraft: activatedRouteMock,
                },
                results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
                majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
                localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
                courts: OPAL_FINES_COURT_REF_DATA_MOCK,
              },
              parent: {
                snapshot: {
                  url: [{ path: 'manual-account-creation' }],
                },
              },
            },
          },
        },
      ],
      componentProperties: {},
    });
  };
  beforeEach(() => {
    cy.intercept('POST', '**/opal-fines-service/draft-accounts/**', {
      statusCode: 200,
      body: OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK,
    });
    cy.intercept('PUT', '**/opal-fines-service/draft-accounts/**', {
      statusCode: 200,
      body: OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK,
    });
    cy.intercept(
      {
        method: 'GET',
        pathname: '/opal-fines-service/offences',
      },
      (req) => {
        const requestedCjsCode = req.query['q'];
        const matchedOffences = OPAL_FINES_OFFENCES_REF_DATA_MOCK.refData.filter(
          (offence) => offence.get_cjs_code === requestedCjsCode,
        );
        req.reply({
          count: matchedOffences.length,
          refData: matchedOffences,
        });
      },
    ).as('getOffenceByCjsCode');
    cy.intercept('GET', '**/opal-fines-service/draft-accounts**', {
      statusCode: 200,
      body: OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK,
    }).as('getDraftAccounts');
    cy.then(() => {
      finesMacState = structuredClone(FINES_AYG_CHECK_ACCOUNT_MOCK);
      finesDraftState = structuredClone(FINES_DRAFT_STATE);
      finesAccountPayload = FINES_MAC_PAYLOAD_ADD_ACCOUNT;
    });
  });




})