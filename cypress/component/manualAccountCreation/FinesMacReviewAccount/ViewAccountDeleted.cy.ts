import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
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
import { MOCK_FINES_DRAFT_STATE_DELETE } from './mocks/mock_fines_draft_state_delete';
import { ACCOUNT_SESSION_USER_STATE_MOCK } from './mocks/user_state_mock';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { DOM_ELEMENTS } from './constants/fines_mac_review_account_elements';
import { getToday } from 'cypress/support/utils/dateUtils';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { interceptOffences } from 'cypress/component/CommonIntercepts/CommonIntercepts.cy';

describe('FinesMacReviewAccountComponent - View Deleted Account', () => {
  let finesMacState = structuredClone(FINES_AYG_CHECK_ACCOUNT_MOCK);
  let finesDraftState = structuredClone(MOCK_FINES_DRAFT_STATE_DELETE);
  let finesAccountPayload = FINES_MAC_PAYLOAD_ADD_ACCOUNT;

  let reviewAccountFetchMap = {
    finesMacState: finesMacState,
    finesMacDraft: finesDraftState,
    finesAccountPayload: finesAccountPayload,
    courts: OPAL_FINES_COURT_REF_DATA_MOCK,
    majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
    localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
    results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
    offences: OPAL_FINES_OFFENCES_REF_DATA_MOCK,
  };

  const setupComponent = (FetchMap = reviewAccountFetchMap) => {
    mount(FinesMacReviewAccountComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        UtilsService,
        FinesMacPayloadService,
        provideRouter([]),
        FinesMacStore,
        FinesDraftStore,

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
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                reviewAccountFetchMap: FetchMap,
              },
              paramMap: {
                get: (key: string) => {
                  if (key === 'draftAccountId') return '1';
                  return null;
                },
              },
            },
          },
        },
      ],
    });
  };
  beforeEach(() => {
    interceptOffences();
  });

  it('AC.2 The Reason for Deletion screen will be created as per the design artefact', { tags: ['@PO-603'] }, () => {
    let fetchMap = structuredClone(reviewAccountFetchMap);
    fetchMap.finesMacDraft.account_status = 'Deleted';
    setupComponent(fetchMap);

    cy.get(DOM_ELEMENTS.reviewComponent).should('exist');

    cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Mr John DOE');
    cy.get(DOM_ELEMENTS.accountStatus).should('exist').and('contain', 'Deleted');
    cy.get(DOM_ELEMENTS.reviewHistory).should('exist').and('contain', 'Review history');
  });

  it('AC.3 - should render Delete History section correctly', { tags: ['PO-603'] }, () => {
    let fetchMap = structuredClone(reviewAccountFetchMap);
    fetchMap.finesMacDraft.account_status = 'Deleted';

    fetchMap.finesMacDraft.timeline_data.pop();
    fetchMap.finesMacDraft.timeline_data.push({
      username: 'User.testone',
      status: 'Submitted',
      status_date: '2025-01-01',
      reason_text: '',
    });

    fetchMap.finesMacDraft.timeline_data.push({
      username: 'Admin.testone',
      status: 'Deleted',
      status_date: '2025-01-01',
      reason_text: 'Missing aliases',
    });

    fetchMap.finesMacDraft.timeline_data.push({
      username: 'User.testone',
      status: 'Resubmitted',
      status_date: '2025-01-02',
      reason_text: '',
    });

    setupComponent(fetchMap);

    cy.get(DOM_ELEMENTS.reviewHistory).should('contain.text', 'Review history');
    cy.get(DOM_ELEMENTS.timeLine).should('exist');
    cy.get(DOM_ELEMENTS.timeLineTitle).should('exist');
    cy.get(DOM_ELEMENTS.timelineAuthor).should('exist');
    cy.get(DOM_ELEMENTS.timelineDate).should('exist');
    cy.get(DOM_ELEMENTS.timelineDescription).should('exist');

    cy.get(DOM_ELEMENTS.timelineAuthor).eq(0).should('contain.text', 'User.testone');
    cy.get(DOM_ELEMENTS.timelineDate).eq(0).should('contain.text', '02 January 2025');
    cy.get(DOM_ELEMENTS.timeLineTitle).eq(0).should('contain.text', 'Resubmitted');
    cy.get(DOM_ELEMENTS.timelineDescription).eq(0).should('contain.text', '');

    cy.get(DOM_ELEMENTS.timelineAuthor).eq(1).should('contain.text', 'Admin.testone');
    cy.get(DOM_ELEMENTS.timelineDate).eq(1).should('contain.text', '01 January 2025');
    cy.get(DOM_ELEMENTS.timeLineTitle).eq(1).should('contain.text', 'Deleted');
    cy.get(DOM_ELEMENTS.timelineDescription).eq(1).should('contain.text', 'Missing aliases');

    cy.get(DOM_ELEMENTS.timelineAuthor).eq(2).should('contain.text', 'User.testone');
    cy.get(DOM_ELEMENTS.timelineDate).eq(2).should('contain.text', '01 January 2025');
    cy.get(DOM_ELEMENTS.timeLineTitle).eq(2).should('contain.text', 'Submitted');
    cy.get(DOM_ELEMENTS.timelineDescription).eq(2).should('contain.text', '');
  });

  it('AC.2,4 should render summary tables under review account for AY', { tags: ['@PO-603'] }, () => {
    let fetchMap = structuredClone(reviewAccountFetchMap);
    fetchMap.finesMacDraft.account_status = 'Deleted';

    setupComponent(fetchMap);

    cy.get(DOM_ELEMENTS.heading).should('contain.text', 'Mr John DOE');
    cy.get(DOM_ELEMENTS.status).should('contain.text', 'Deleted');

    cy.get(DOM_ELEMENTS.summaryCard).should('exist').and('have.length', 8);
    cy.get('#account-details-summary-card-list').should('exist');
    cy.get('#court-details-summary-card-list').should('exist');
    cy.get('#personal-details-summary-card-list').should('exist');
    cy.get('#contact-details-summary-card-list').should('exist');
    cy.get('#employer-details-summary-card-list').should('exist');
    cy.get('#offences-and-imposition-summary-card-list').should('exist');
    cy.get('#payment-terms-summary-card-list').should('exist');
    cy.get('#account-comments-and-notes-summary-card-list').should('exist');

    cy.get('#parent-guardian-details-summary-card-list').should('not.exist');
    cy.get('#company-details-summary-card-list').should('not.exist');
    cy.get('#defendant-details-summary-card-list').should('not.exist');

    cy.get(DOM_ELEMENTS.langPrefDocLanguage).should('not.exist');
    cy.get(DOM_ELEMENTS.langPrefCourtHeatingLanguage).should('not.exist');
  });

  it('(AC2,.5) should render all elements on the screen for AYPG', { tags: ['@PO-603'] }, () => {
    let fetchMap = structuredClone(reviewAccountFetchMap);
    fetchMap.finesMacDraft.account_status = 'Deleted';
    fetchMap.finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';

    setupComponent(fetchMap);

    cy.get(DOM_ELEMENTS.heading).should('contain.text', 'Mr John DOE');
    cy.get(DOM_ELEMENTS.status).should('contain.text', 'Deleted');

    cy.get(DOM_ELEMENTS.summaryCard).should('exist').and('have.length', 9);
    cy.get('#account-details-summary-card-list').should('exist');
    cy.get('#court-details-summary-card-list').should('exist');
    cy.get('#defendant-details-summary-card-list').should('exist');
    cy.get('#contact-details-summary-card-list').should('exist');
    cy.get('#employer-details-summary-card-list').should('exist');
    cy.get('#offences-and-imposition-summary-card-list').should('exist');
    cy.get('#payment-terms-summary-card-list').should('exist');
    cy.get('#account-comments-and-notes-summary-card-list').should('exist');
    cy.get('#parent-guardian-details-summary-card-list').should('exist');

    cy.get('#company-details-summary-card-list').should('not.exist');
    cy.get('#personal-details-summary-card-list').should('not.exist');

    cy.get(DOM_ELEMENTS.langPrefDocLanguage).should('not.exist');
    cy.get(DOM_ELEMENTS.langPrefCourtHeatingLanguage).should('not.exist');
  });

  it('(AC.6) should render all elements on the screen for company defendant type', { tags: ['@PO-603'] }, () => {
    let fetchMap = structuredClone(reviewAccountFetchMap);
    fetchMap.finesMacDraft.account_status = 'Deleted';
    fetchMap.finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

    setupComponent(fetchMap);

    cy.get(DOM_ELEMENTS.heading).should('contain.text', 'test company');
    cy.get(DOM_ELEMENTS.status).should('contain.text', 'Deleted');

    cy.get(DOM_ELEMENTS.summaryCard).should('exist').and('have.length', 7);
    cy.get('#account-details-summary-card-list').should('exist');
    cy.get('#court-details-summary-card-list').should('exist');
    cy.get('#company-details-summary-card-list').should('exist');
    cy.get('#contact-details-summary-card-list').should('exist');
    cy.get('#offences-and-imposition-summary-card-list').should('exist');
    cy.get('#payment-terms-summary-card-list').should('exist');
    cy.get('#account-comments-and-notes-summary-card-list').should('exist');

    cy.get('#parent-guardian-details-summary-card-list').should('not.exist');
    cy.get('#personal-details-summary-card-list').should('not.exist');
    cy.get('#employer-details-summary-card-list').should('not.exist');
    cy.get('#defendant-details-summary-card-list').should('not.exist');

    cy.get(DOM_ELEMENTS.langPrefDocLanguage).should('not.exist');
    cy.get(DOM_ELEMENTS.langPrefCourtHeatingLanguage).should('not.exist');
  });
  it('AC4ai - should show language preferences if business unit is welsh speaking - AY', { tags: ['PO-603'] }, () => {
    let fetchMap = structuredClone(reviewAccountFetchMap);
    fetchMap.finesMacDraft.account_status = 'Deleted';
    fetchMap.finesMacState.languagePreferences.formData.fm_language_preferences_document_language = 'CY';
    fetchMap.finesMacState.languagePreferences.formData.fm_language_preferences_hearing_language = 'CY';
    fetchMap.finesMacState.businessUnit.welsh_language = true;

    setupComponent(fetchMap);

    cy.get(DOM_ELEMENTS.langPrefDocLanguage).should('exist');
    cy.get(DOM_ELEMENTS.langPrefCourtHeatingLanguage).should('exist');
  });
  it('AC5ai - should show language preferences if business unit is welsh speaking - AYPG', { tags: ['PO-603'] }, () => {
    let fetchMap = structuredClone(reviewAccountFetchMap);
    fetchMap.finesMacDraft.account_status = 'Deleted';
    fetchMap.finesMacState.languagePreferences.formData.fm_language_preferences_document_language = 'CY';
    fetchMap.finesMacState.languagePreferences.formData.fm_language_preferences_hearing_language = 'CY';
    fetchMap.finesMacState.businessUnit.welsh_language = true;
    fetchMap.finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';

    setupComponent(fetchMap);

    cy.get(DOM_ELEMENTS.langPrefDocLanguage).should('exist');
    cy.get(DOM_ELEMENTS.langPrefCourtHeatingLanguage).should('exist');
  });
  it('AC6ai - should show language preferences if business unit is welsh speaking - COMP', { tags: ['PO-603'] }, () => {
    let fetchMap = structuredClone(reviewAccountFetchMap);
    fetchMap.finesMacDraft.account_status = 'Deleted';
    fetchMap.finesMacState.languagePreferences.formData.fm_language_preferences_document_language = 'CY';
    fetchMap.finesMacState.languagePreferences.formData.fm_language_preferences_hearing_language = 'CY';
    fetchMap.finesMacState.businessUnit.welsh_language = true;
    fetchMap.finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

    setupComponent(fetchMap);

    cy.get(DOM_ELEMENTS.langPrefDocLanguage).should('exist');
    cy.get(DOM_ELEMENTS.langPrefCourtHeatingLanguage).should('exist');
  });

  it('AC.7 - should show em-dash for empty values', { tags: ['PO-603'] }, () => {
    let fetchMap = structuredClone(reviewAccountFetchMap);
    fetchMap.finesMacDraft.account_status = 'Deleted';
    fetchMap.finesMacState.contactDetails.formData.fm_contact_details_email_address_1 = '';

    fetchMap.finesMacState.offenceDetails.push({
      formData: {
        fm_offence_details_date_of_sentence: getToday(),
        fm_offence_details_impositions: [
          {
            fm_offence_details_imposition_id: 0,
            fm_offence_details_result_id: 'FCOST',
            fm_offence_details_amount_imposed: 400,
            fm_offence_details_amount_paid: 50,
            fm_offence_details_balance_remaining: 350,
            fm_offence_details_needs_creditor: true,
            fm_offence_details_creditor: 'minor',
            fm_offence_details_major_creditor_id: null,
          },
        ],
        fm_offence_details_id: 1,
        fm_offence_details_offence_cjs_code: 'AK123456',
        fm_offence_details_offence_id: 123,
      },
      nestedFlow: false,
      childFormData: [
        {
          formData: {
            fm_offence_details_imposition_position: 0,
            fm_offence_details_minor_creditor_creditor_type: 'individual',
            fm_offence_details_minor_creditor_title: 'Mr',
            fm_offence_details_minor_creditor_forenames: 'James',
            fm_offence_details_minor_creditor_surname: 'LNAME',
            fm_offence_details_minor_creditor_company_name: null,
            fm_offence_details_minor_creditor_address_line_1: '1 Testing Lane',
            fm_offence_details_minor_creditor_address_line_2: 'Test Town',
            fm_offence_details_minor_creditor_address_line_3: 'Testing',
            fm_offence_details_minor_creditor_post_code: 'TE12 3ST',
            fm_offence_details_minor_creditor_pay_by_bacs: false,
            fm_offence_details_minor_creditor_bank_account_name: 'John Doe',
            fm_offence_details_minor_creditor_bank_sort_code: '123456',
            fm_offence_details_minor_creditor_bank_account_number: '12345678',
            fm_offence_details_minor_creditor_bank_account_ref: 'Testing',
          },
          nestedFlow: false,
        },
      ],
    });
    setupComponent(fetchMap);

    cy.get(DOM_ELEMENTS.heading).should('contain.text', 'Mr John DOE');

    cy.get(DOM_ELEMENTS.primaryEmailAddress).should('contain.text', '—');

    cy.get(DOM_ELEMENTS.minorCreditorPaymentMethodValue).children().should('contain.text', '—');
  });
});
