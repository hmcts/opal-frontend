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
import { MOCK_FINES_DRAFT_STATE } from './mocks/mock_fines_draft_state';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { ACCOUNT_SESSION_USER_STATE_MOCK } from './mocks/user_state_mock';
import { DOM_ELEMENTS } from './constants/fines_mac_review_account_elements';
import { getToday } from 'cypress/support/utils/dateUtils';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from 'src/app/flows/fines/fines-mac/constants/fines-mac-defendant-types-keys';
import { interceptOffences } from 'cypress/component/CommonIntercepts/CommonIntercepts.cy';

describe('FinesMacReviewAccountComponent - View Failed Account', () => {
  let finesMacState = structuredClone(FINES_AYG_CHECK_ACCOUNT_MOCK);
  let finesDraftState = structuredClone(MOCK_FINES_DRAFT_STATE);
  let reviewAccountFetchMap = {
    finesMacState: finesMacState,
    finesMacDraft: finesDraftState,
    courts: OPAL_FINES_COURT_REF_DATA_MOCK,
    majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
    localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
    results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
    offences: OPAL_FINES_OFFENCES_REF_DATA_MOCK,
  };

  let defendantTypesKeys = FINES_MAC_DEFENDANT_TYPES_KEYS;

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
  before(() => {
    interceptOffences();
  });

  it('AC.2,4 - should render correctly - AY', { tags: ['@PO-1073'] }, () => {
    let fetchMap = structuredClone(reviewAccountFetchMap);
    fetchMap.finesMacDraft.account_status = 'Publishing Failed';
    fetchMap.finesMacState.accountDetails.formData.fm_create_account_defendant_type =
      defendantTypesKeys.adultOrYouthOnly;

    setupComponent(fetchMap);

    cy.get(DOM_ELEMENTS.heading).should('contain.text', 'Mr John DOE');
    cy.get(DOM_ELEMENTS.errorBanner).should(
      'contain.text',
      'There was a problem publishing this account. Please contact your line manager.',
    );
    cy.get(DOM_ELEMENTS.status).should('contain.text', 'Failed');

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

  it('AC.3 - should render Review History section correctly', { tags: ['@PO-1073'] }, () => {
    let fetchMap = structuredClone(reviewAccountFetchMap);
    fetchMap.finesMacDraft.account_status = 'Publishing Failed';
    fetchMap.finesMacDraft.timeline_data.push({
      username: 'Admin1',
      status: 'Approved',
      status_date: '2025-02-01',
      reason_text: 'All good',
    });

    fetchMap.finesMacDraft.timeline_data.push({
      username: 'Admin2',
      status: 'Deleted',
      status_date: '2025-02-02',
      reason_text: 'Created in error',
    });

    setupComponent(fetchMap);

    cy.get(DOM_ELEMENTS.reviewHistory).should('contain.text', 'Review history');
    cy.get(DOM_ELEMENTS.timeLine).should('exist');
    cy.get(DOM_ELEMENTS.timeLineTitle).should('exist');
    cy.get(DOM_ELEMENTS.timelineAuthor).should('exist');
    cy.get(DOM_ELEMENTS.timelineDate).should('exist');
    cy.get(DOM_ELEMENTS.timelineDescription).should('exist');

    cy.get(DOM_ELEMENTS.timelineAuthor).eq(0).should('contain.text', 'Admin2');
    cy.get(DOM_ELEMENTS.timelineDate).eq(0).should('contain.text', '02 February 2025');
    cy.get(DOM_ELEMENTS.timeLineTitle).eq(0).should('contain.text', 'Deleted');
    cy.get(DOM_ELEMENTS.timelineDescription).eq(0).should('contain.text', 'Created in error');

    cy.get(DOM_ELEMENTS.timelineAuthor).eq(1).should('contain.text', 'Admin1');
    cy.get(DOM_ELEMENTS.timelineDate).eq(1).should('contain.text', '01 February 2025');
    cy.get(DOM_ELEMENTS.timeLineTitle).eq(1).should('contain.text', 'Approved');
    cy.get(DOM_ELEMENTS.timelineDescription).eq(1).should('contain.text', 'All good');

    cy.get(DOM_ELEMENTS.timelineAuthor).should('contain.text', 'Test User 1');
    cy.get(DOM_ELEMENTS.timelineDate).should('contain.text', '01 January 2025');
    cy.get(DOM_ELEMENTS.timeLineTitle).should('contain.text', 'Rejected');
    cy.get(DOM_ELEMENTS.timelineDescription).should('contain.text', '');
  });

  it('AC.2,5 - should render correctly - AYPG', { tags: ['@PO-1073'] }, () => {
    let fetchMap = structuredClone(reviewAccountFetchMap);
    fetchMap.finesMacDraft.account_status = 'Publishing Failed';
    fetchMap.finesMacState.accountDetails.formData.fm_create_account_defendant_type =
      defendantTypesKeys.parentOrGuardianToPay;

    setupComponent(fetchMap);

    cy.get(DOM_ELEMENTS.heading).should('contain.text', 'Mr John DOE');
    cy.get(DOM_ELEMENTS.errorBanner).should(
      'contain.text',
      'There was a problem publishing this account. Please contact your line manager.',
    );
    cy.get(DOM_ELEMENTS.status).should('contain.text', 'Failed');

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

  it('AC.2,6 - should render correctly - COMP', { tags: ['@PO-1073'] }, () => {
    let fetchMap = structuredClone(reviewAccountFetchMap);
    fetchMap.finesMacDraft.account_status = 'Publishing Failed';
    fetchMap.finesMacState.accountDetails.formData.fm_create_account_defendant_type = defendantTypesKeys.company;

    setupComponent(fetchMap);

    cy.get(DOM_ELEMENTS.heading).should('contain.text', 'test company');
    cy.get(DOM_ELEMENTS.errorBanner).should(
      'contain.text',
      'There was a problem publishing this account. Please contact your line manager.',
    );
    cy.get(DOM_ELEMENTS.status).should('contain.text', 'Failed');

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

  it('AC4ai - should show language preferences if business unit is welsh speaking - AY', { tags: ['@PO-1073'] }, () => {
    let fetchMap = structuredClone(reviewAccountFetchMap);
    fetchMap.finesMacDraft.account_status = 'Publishing Failed';
    fetchMap.finesMacState.languagePreferences.formData.fm_language_preferences_document_language = 'CY';
    fetchMap.finesMacState.languagePreferences.formData.fm_language_preferences_hearing_language = 'CY';
    fetchMap.finesMacState.businessUnit.welsh_language = true;

    setupComponent(fetchMap);

    cy.get(DOM_ELEMENTS.langPrefDocLanguage).should('exist');
    cy.get(DOM_ELEMENTS.langPrefCourtHeatingLanguage).should('exist');
  });
  it(
    'AC5ai - should show language preferences if business unit is welsh speaking - AYPG',
    { tags: ['@PO-1073'] },
    () => {
      let fetchMap = structuredClone(reviewAccountFetchMap);
      fetchMap.finesMacDraft.account_status = 'Publishing Failed';
      fetchMap.finesMacState.languagePreferences.formData.fm_language_preferences_document_language = 'CY';
      fetchMap.finesMacState.languagePreferences.formData.fm_language_preferences_hearing_language = 'CY';
      fetchMap.finesMacState.businessUnit.welsh_language = true;
      fetchMap.finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'parentOrGuardianToPay';

      setupComponent(fetchMap);

      cy.get(DOM_ELEMENTS.langPrefDocLanguage).should('exist');
      cy.get(DOM_ELEMENTS.langPrefCourtHeatingLanguage).should('exist');
    },
  );
  it(
    'AC6ai - should show language preferences if business unit is welsh speaking - COMP',
    { tags: ['@PO-1073'] },
    () => {
      let fetchMap = structuredClone(reviewAccountFetchMap);
      fetchMap.finesMacDraft.account_status = 'Publishing Failed';
      fetchMap.finesMacState.languagePreferences.formData.fm_language_preferences_document_language = 'CY';
      fetchMap.finesMacState.languagePreferences.formData.fm_language_preferences_hearing_language = 'CY';
      fetchMap.finesMacState.businessUnit.welsh_language = true;
      fetchMap.finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

      setupComponent(fetchMap);

      cy.get(DOM_ELEMENTS.langPrefDocLanguage).should('exist');
      cy.get(DOM_ELEMENTS.langPrefCourtHeatingLanguage).should('exist');
    },
  );

  it('AC.7 - should show em-dash for empty values', { tags: ['@PO-1073'] }, () => {
    let fetchMap = structuredClone(reviewAccountFetchMap);
    fetchMap.finesMacDraft.account_status = 'Publishing Failed';
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
