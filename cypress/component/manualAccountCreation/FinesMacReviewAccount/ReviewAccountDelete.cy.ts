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
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { getToday } from 'cypress/support/utils/dateUtils';

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
    // cy.intercept(
    //   {
    //     method: 'GET',
    //     pathname: '/opal-fines-service/offences',
    //   },
    //   (req) => {
    //     const requestedCjsCode = req.query['q'];
    //     const matchedOffences = OPAL_FINES_OFFENCES_REF_DATA_MOCK.refData.filter(
    //       (offence) => offence.get_cjs_code === requestedCjsCode,
    //     );
    //     req.reply({
    //       count: matchedOffences.length,
    //       refData: matchedOffences,
    //     });
    //   },
    // ).as('getOffenceByCjsCode');
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

  it.only('AC.1, AC.2 Reason for deletion screen created as per the design artefact', { tags: ['@PO-597'] }, () => {
    setupComponent(finesAccountPayload, finesAccountPayload, true);

    cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Are you sure you want to delete this account?');

    cy.get(DOM_ELEMENTS.reasonLabel).should('exist').and('contain', 'Reason');
    cy.get(DOM_ELEMENTS.commentCharHint).should('exist').and('contain', 'You have 250 characters remaining');
    cy.get(DOM_ELEMENTS.commentInput).clear().type('a'.repeat(5), { delay: 0 });
    cy.get(DOM_ELEMENTS.commentCharHint).should('contain', 'You have 245 characters remaining');
  });
  it(
    'AC.3ai,AC.3aii Yes - Delete button under the character count once a reason is entered ',
    { tags: ['@PO-597'] },
    () => {
      setupComponent(finesAccountPayload, finesAccountPayload, true);
      cy.get(DOM_ELEMENTS.deleteConfirmation).should('exist').click();
      cy.get('p').should('contain', 'Enter reason for deletion');
      cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Are you sure you want to delete this account?');

      cy.get(DOM_ELEMENTS.deleteConfirmation).should('exist').type('a23;b:');
      cy.get(DOM_ELEMENTS.deleteConfirmation).should('exist').click();
      cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Are you sure you want to delete this account?');

      cy.get(DOM_ELEMENTS.cancelLink).should('exist');
    },
  );

  it(
    'AC.3bii a request to update draft account with patch method with status of deleted',
    { tags: ['@PO-597'] },
    () => {
      cy.intercept('PATCH', '**/opal-fines-service/draft-accounts/**', { statusCode: 200 }).as('patchDraftAccount');
      let payload = structuredClone(finesAccountPayload);
      payload.draft_account_id = 342;
      setupComponent(finesAccountPayload, payload, false, true);

      cy.get(DOM_ELEMENTS.deleteConfirmation).should('exist').type('test reason');
      cy.get(DOM_ELEMENTS.deleteConfirmation).should('exist').click();

      cy.wait('@patchDraftAccount').then(({ request }) => {
        expect(request.body).to.exist;
        expect(request.url).to.include('/opal-fines-service/draft-accounts/342');
        expect(request.method).to.equal('PATCH');

        expect(request.body).to.have.property('account_status', 'Deleted');
        expect(request.body).to.have.property('timeline_data');

        expect(request.body.timeline_data[0]).to.have.property('username', 'Test 1');
        expect(request.body.timeline_data[0]).to.have.property('status', 'Submitted');
        expect(request.body.timeline_data[0]).to.have.property('status_date', '2023-07-03');
        expect(request.body.timeline_data[0]).to.have.property('reason_text', null);

        expect(request.body.timeline_data[1]).to.have.property('username', 'Timmy Test');
        expect(request.body.timeline_data[1]).to.have.property('status', 'Deleted');
        expect(request.body.timeline_data[1]).to.have.property('status_date', getToday());
        expect(request.body.timeline_data[1]).to.have.property(
          'reason_text',
          'I have rejected this account because the surname is incorrect',
        );
      });
    },
  );

});
