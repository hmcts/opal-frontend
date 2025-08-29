import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { mount } from 'cypress/angular';
import { FinesMacReviewAccountComponent } from 'src/app/flows/fines/fines-mac/fines-mac-review-account/fines-mac-review-account.component';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { FINES_AYG_CHECK_ACCOUNT_MOCK } from './mocks/fines_mac_review_account_mocks';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { MOCK_FINES_DRAFT_STATE } from './mocks/mock_fines_draft_state';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { ACCOUNT_SESSION_USER_STATE_MOCK } from './mocks/user_state_mock';
import { DOM_ELEMENTS } from './constants/fines_mac_review_account_elements';
import { getToday } from 'cypress/support/utils/dateUtils';
import { data } from 'cypress/types/jquery';
import { interceptOffences } from 'cypress/component/CommonIntercepts/CommonIntercepts.cy';
import { FINES_MAC_ACCOUNT_TYPES } from 'src/app/flows/fines/fines-mac/constants/fines-mac-account-types';

describe('FinesMacReviewAccountComponent - Rejected Account view', () => {
  let finesMacState = structuredClone(FINES_AYG_CHECK_ACCOUNT_MOCK);
  let finesDraftState = structuredClone(MOCK_FINES_DRAFT_STATE);

  const setupComponent = (isReadOnly?: boolean) => {
    mount(FinesMacReviewAccountComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        UtilsService,
        FinesMacPayloadService,
        Router,
        {
          provide: GlobalStore,
          useFactory: () => {
            let globalStore = new GlobalStore();
            globalStore.setUserState(ACCOUNT_SESSION_USER_STATE_MOCK);
            globalStore.setError({
              error: false,
              message: '',
            });
            return globalStore;
          },
        },
        {
          provide: FinesMacStore,
          useFactory: () => {
            let finesMacStore = new FinesMacStore();
            finesMacStore.setFinesMacStore(finesMacState);
            return finesMacStore;
          },
        },
        {
          provide: FinesDraftStore,
          useFactory: () => {
            let finesDraftStore = new FinesDraftStore();
            finesDraftStore.setFinesDraftState(finesDraftState);
            finesDraftStore.setAmend(true);
            return finesDraftStore;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'draftAccountId' ? '42' : null),
              },
              data: {
                finesMacState: {},
                finesDraftState: {},
                courts: OPAL_FINES_COURT_REF_DATA_MOCK,
                localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
                results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
                majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
              },
            },
            parent: {
              snapshot: {
                url: [{ path: 'manual-account-creation' }],
              },
            },
          },
        },
      ],

      componentProperties: {
        isReadOnly: isReadOnly,
      },
    });
  };

  beforeEach(() => {
    interceptOffences();
  });

  it(
    '(AC.1,2) should send a PUT request containing correct derived values when a rejected account is resubmitted',
    { tags: ['@PO-964'] },
    () => {
      cy.intercept('PUT', '**/opal-fines-service/draft-accounts/**', { statusCode: 201 }).as('putDraftAccount');

      setupComponent(false);
      cy.get(DOM_ELEMENTS.submitButton).click();

      cy.wait('@putDraftAccount').then(({ request }) => {
        expect(request.body).to.exist;
        //AC1 - Check the request URL and method are of type PUT and the URL is correct
        expect(request.url).to.include('/opal-fines-service/draft-accounts/123');
        expect(request.method).to.equal('PUT');

        expect(request.body).to.have.property('draft_account_id', 123);
        expect(request.body).to.have.property('business_unit_id', 61);
        expect(request.body).to.have.property('submitted_by', 'L017KG');
        expect(request.body).to.have.property('submitted_by_name', 'Timmy Tester');

        //Checking a few of the values in the account object are correct
        expect(request.body).to.have.property('account');
        expect(request.body.account).to.have.property('account_type', FINES_MAC_ACCOUNT_TYPES.Fine);
        expect(request.body.account).to.have.property('defendant_type', 'adultOrYouthOnly');
        expect(request.body.account.defendant).to.have.property('title', 'Mr');
        expect(request.body.account.defendant).to.have.property('surname', 'Doe');
        expect(request.body.account.defendant).to.have.property('forenames', 'John');
        expect(request.body.account.defendant).to.have.property('dob', '2000-01-01');
        expect(request.body.account.defendant).to.have.property('address_line_1', '123 Fake Street');
        expect(request.body.account.defendant).to.have.property('address_line_2', 'Fake Town');
        expect(request.body.account.defendant).to.have.property('address_line_3', 'Fake City');
        expect(request.body.account.defendant).to.have.property('post_code', 'AB12 3CD');

        expect(request.body).to.have.property('account_type', FINES_MAC_ACCOUNT_TYPES.Fine);
        expect(request.body).to.have.property('account_status', 'Resubmitted');
        expect(request.body).to.have.property('timeline_data');

        //This timeline data was already present
        expect(request.body.timeline_data[0]).to.have.property('username', 'Test User 1');
        expect(request.body.timeline_data[0]).to.have.property('status', 'Rejected');
        expect(request.body.timeline_data[0]).to.have.property('status_date', '2025-01-01');
        expect(request.body.timeline_data[0]).to.have.property('reason_text', '');

        //This Timeline data is added as a result of the user clicking the submit button
        expect(request.body.timeline_data[1]).to.have.property('username', 'Timmy Tester');
        expect(request.body.timeline_data[1]).to.have.property('status', 'Resubmitted');
        expect(request.body.timeline_data[1]).to.have.property('status_date', getToday());
        expect(request.body.timeline_data[1]).to.have.property('reason_text', null);
      });
    },
  );

  it(
    'should send PUT request with correct Fixed Penalty account data and timeline when rejected account is resubmitted',
    { tags: ['@PO-1809'] },
    () => {
      cy.intercept('PUT', '**/opal-fines-service/draft-accounts/**', { statusCode: 201 }).as('putDraftAccount');

      setupComponent(false);
      cy.get(DOM_ELEMENTS.submitButton).click();

      finesMacState.accountDetails.formData.fm_create_account_account_type = FINES_MAC_ACCOUNT_TYPES['Fixed Penalty'];

      cy.wait('@putDraftAccount').then(({ request }) => {
        expect(request.body).to.exist;
        //AC4 - Check the request URL and method are of type PUT and the URL is correct
        expect(request.url).to.include('/opal-fines-service/draft-accounts/123');
        expect(request.method).to.equal('PUT');

        // AC4a
        expect(request.body).to.have.property('business_unit_id', 61);

        // AC4b
        expect(request.body).to.have.property('submitted_by', 'L017KG');

        // AC4c
        expect(request.body).to.have.property('submitted_by_name', 'Timmy Tester');

        // AC4d
        expect(request.body).to.have.property('account');
        expect(request.body.account).to.have.property('account_type', FINES_MAC_ACCOUNT_TYPES['Fixed Penalty']);
        expect(request.body.account).to.have.property('defendant_type', 'adultOrYouthOnly');
        expect(request.body.account.defendant).to.have.property('title', 'Mr');
        expect(request.body.account.defendant).to.have.property('surname', 'Doe');
        expect(request.body.account.defendant).to.have.property('forenames', 'John');
        expect(request.body.account.defendant).to.have.property('dob', '2000-01-01');
        expect(request.body.account.defendant).to.have.property('address_line_1', '123 Fake Street');
        expect(request.body.account.defendant).to.have.property('address_line_2', 'Fake Town');
        expect(request.body.account.defendant).to.have.property('address_line_3', 'Fake City');
        expect(request.body.account.defendant).to.have.property('post_code', 'AB12 3CD');

        // AC4e - account_type = 'Fixed Penalty'
        expect(request.body).to.have.property('account_type', FINES_MAC_ACCOUNT_TYPES['Fixed Penalty']);

        // AC4f - account_status_message = null
        expect(request.body).to.have.property('account_status_message', null);

        // Account status should be 'Resubmitted' when resubmitting
        expect(request.body).to.have.property('account_status', 'Resubmitted');

        // AC4g - timeline_data with specific structure
        expect(request.body).to.have.property('timeline_data');

        //This timeline data was already present (existing rejected entry)
        expect(request.body.timeline_data[0]).to.have.property('username', 'Test User 1');
        expect(request.body.timeline_data[0]).to.have.property('status', 'Rejected');
        expect(request.body.timeline_data[0]).to.have.property('status_date', '2025-01-01');
        expect(request.body.timeline_data[0]).to.have.property('reason_text', '');

        //AC4g - New timeline data added as result of resubmission
        expect(request.body.timeline_data[1]).to.have.property('username', 'Timmy Tester');
        expect(request.body.timeline_data[1]).to.have.property('status', 'Resubmitted');
        expect(request.body.timeline_data[1]).to.have.property('status_date', getToday());
        expect(request.body.timeline_data[1]).to.have.property('reason_text', null);
      });
    },
  );
});
