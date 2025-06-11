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
import { REJECTED_ACCOUNT_SESSION_USER_STATE_MOCK } from './mocks/user_state_mock';
import { DOM_ELEMENTS } from './constants/fines_mac_review_account_elements';
import { getToday } from 'cypress/support/utils/dateUtils';
import { set } from 'cypress/types/lodash';

describe('FinesMacReviewAccountComponent - Rejected Account view', () => {
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
            globalStore.setUserState(REJECTED_ACCOUNT_SESSION_USER_STATE_MOCK);
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
            },
          },
        },
      ],
    });
  };
  beforeEach(() => {
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
  });

  it('AC.2,4 - should render correctly - AY', { tags: ['@PO-1073'] }, () => {
    let fetchMap = structuredClone(reviewAccountFetchMap);
    fetchMap.finesMacDraft.account_status = 'Publishing Failed';

    setupComponent(fetchMap);

    cy.get(DOM_ELEMENTS.heading).should('contain.text', 'Mr John DOE');
    cy.get(DOM_ELEMENTS.errorBanner).should(
      'contain.text',
      'There was a problem publishing this account. Please contact your line manager.',
    );
    cy.get(DOM_ELEMENTS.status).should('contain.text', 'Failed');

    cy.get(DOM_ELEMENTS.summaryCard).should('exist').and('have.length', 8);
    cy.get(DOM_ELEMENTS.summaryCard).eq(0).should('have.attr', 'ng-reflect-summary-card-list-id', 'account-details');
    cy.get(DOM_ELEMENTS.summaryCard).eq(1).should('have.attr', 'ng-reflect-summary-card-list-id', 'court-details');
    cy.get(DOM_ELEMENTS.summaryCard).eq(2).should('have.attr', 'ng-reflect-summary-card-list-id', 'personal-details');
    cy.get(DOM_ELEMENTS.summaryCard).eq(3).should('have.attr', 'ng-reflect-summary-card-list-id', 'contact-details');
    cy.get(DOM_ELEMENTS.summaryCard).eq(4).should('have.attr', 'ng-reflect-summary-card-list-id', 'employer-details');
    cy.get(DOM_ELEMENTS.summaryCard)
      .eq(5)
      .should('have.attr', 'ng-reflect-summary-card-list-id', 'offences-and-imposition');
    cy.get(DOM_ELEMENTS.summaryCard).eq(6).should('have.attr', 'ng-reflect-summary-card-list-id', 'payment-terms');
    cy.get(DOM_ELEMENTS.summaryCard)
      .eq(7)
      .should('have.attr', 'ng-reflect-summary-card-list-id', 'account-comments-and-notes');

    cy.get(DOM_ELEMENTS.summaryCard)
      .filter('[ng-reflect-summary-card-list-id="parent-guardian-details"]')
      .should('not.exist');
    cy.get(DOM_ELEMENTS.summaryCard).filter('[ng-reflect-summary-card-list-id="company-details"]').should('not.exist');

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

    //Confirm if this should exist AC3c
    cy.get(DOM_ELEMENTS.timelineAuthor).eq(0).should('contain.text', 'Admin2');
    cy.get(DOM_ELEMENTS.timelineDate).eq(0).should('contain.text', '02 February 2025');
    cy.get(DOM_ELEMENTS.timeLineTitle).eq(0).should('contain.text', 'Deleted');
    cy.get(DOM_ELEMENTS.timelineDescription).eq(0).should('contain.text', 'Created in error');

    //Confirm if this should exist AC3c
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
    fetchMap.finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'parentOrGuardianToPay';

    setupComponent(fetchMap);

    cy.get(DOM_ELEMENTS.heading).should('contain.text', 'Mr John DOE');
    cy.get(DOM_ELEMENTS.errorBanner).should(
      'contain.text',
      'There was a problem publishing this account. Please contact your line manager.',
    );
    cy.get(DOM_ELEMENTS.status).should('contain.text', 'Failed');

    cy.get(DOM_ELEMENTS.summaryCard).should('exist').and('have.length', 9);
    cy.get(DOM_ELEMENTS.summaryCard).eq(0).should('have.attr', 'ng-reflect-summary-card-list-id', 'account-details');
    cy.get(DOM_ELEMENTS.summaryCard).eq(1).should('have.attr', 'ng-reflect-summary-card-list-id', 'court-details');
    cy.get(DOM_ELEMENTS.summaryCard)
      .eq(2)
      .should('have.attr', 'ng-reflect-summary-card-list-id', 'parent-guardian-details');
    cy.get(DOM_ELEMENTS.summaryCard).eq(3).should('have.attr', 'ng-reflect-summary-card-list-id', 'contact-details');
    cy.get(DOM_ELEMENTS.summaryCard).eq(4).should('have.attr', 'ng-reflect-summary-card-list-id', 'defendant-details');
    cy.get(DOM_ELEMENTS.summaryCard).eq(5).should('have.attr', 'ng-reflect-summary-card-list-id', 'employer-details');
    cy.get(DOM_ELEMENTS.summaryCard)
      .eq(6)
      .should('have.attr', 'ng-reflect-summary-card-list-id', 'offences-and-imposition');
    cy.get(DOM_ELEMENTS.summaryCard).eq(7).should('have.attr', 'ng-reflect-summary-card-list-id', 'payment-terms');
    cy.get(DOM_ELEMENTS.summaryCard)
      .eq(8)
      .should('have.attr', 'ng-reflect-summary-card-list-id', 'account-comments-and-notes');

    cy.get(DOM_ELEMENTS.summaryCard).filter('[ng-reflect-summary-card-list-id="company-details"]').should('not.exist');

    cy.get(DOM_ELEMENTS.langPrefDocLanguage).should('not.exist');
    cy.get(DOM_ELEMENTS.langPrefCourtHeatingLanguage).should('not.exist');
  });

  it('AC.2,6 - should render correctly - COMP', { tags: ['@PO-1073'] }, () => {
    let fetchMap = structuredClone(reviewAccountFetchMap);
    fetchMap.finesMacDraft.account_status = 'Publishing Failed';
    fetchMap.finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

    setupComponent(fetchMap);

    cy.get(DOM_ELEMENTS.heading).should('contain.text', 'test company');
    cy.get(DOM_ELEMENTS.errorBanner).should(
      'contain.text',
      'There was a problem publishing this account. Please contact your line manager.',
    );
    cy.get(DOM_ELEMENTS.status).should('contain.text', 'Failed');

    cy.get(DOM_ELEMENTS.summaryCard).should('exist').and('have.length', 7);
    cy.get(DOM_ELEMENTS.summaryCard).eq(0).should('have.attr', 'ng-reflect-summary-card-list-id', 'account-details');
    cy.get(DOM_ELEMENTS.summaryCard).eq(1).should('have.attr', 'ng-reflect-summary-card-list-id', 'court-details');
    cy.get(DOM_ELEMENTS.summaryCard).eq(2).should('have.attr', 'ng-reflect-summary-card-list-id', 'company-details');
    cy.get(DOM_ELEMENTS.summaryCard).eq(3).should('have.attr', 'ng-reflect-summary-card-list-id', 'contact-details');
    cy.get(DOM_ELEMENTS.summaryCard)
      .eq(4)
      .should('have.attr', 'ng-reflect-summary-card-list-id', 'offences-and-imposition');
    cy.get(DOM_ELEMENTS.summaryCard).eq(5).should('have.attr', 'ng-reflect-summary-card-list-id', 'payment-terms');
    cy.get(DOM_ELEMENTS.summaryCard)
      .eq(6)
      .should('have.attr', 'ng-reflect-summary-card-list-id', 'account-comments-and-notes');

    cy.get(DOM_ELEMENTS.summaryCard).filter('[ng-reflect-summary-card-list-id="personal-details"]').should('not.exist');
    cy.get(DOM_ELEMENTS.summaryCard).filter('[ng-reflect-summary-card-list-id="employer-details"]').should('not.exist');
    cy.get(DOM_ELEMENTS.summaryCard)
      .filter('[ng-reflect-summary-card-list-id="parent-guardian-details"]')
      .should('not.exist');

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
// AC2. The Failed Account screen will be created as per the design artefact linked above, such that:

// AC2a. The full name of the defendant will be displayed as a heading in the format of <title> <first name> <LAST NAME> or <Company name>

// AC2b. Above the name of the defendant, a banner will be displayed stating the error message: "There was a problem publishing this account. Please contact your line manager."

// AC2bi. This banner should always be displayed for accounts that have a status of 'Publishing failed'

// AC2c. Below the defendant full name heading, will be a red status label displaying the text 'Failed'

// AC2d. Below the status label, will be a Review History section as described in AC3

// AC2e. Below the Review History section, will be an array of summary tables displaying the data entered during the manual account creation process, as described across AC4, 5 and 6.

// AC3. The Review History will be displayed as follows;

// AC3a. A heading of 'Review History' in bold

// AC3b. The list of the history actions described in AC3b in PO-594 will be displayed

// AC3c. History actions where an account has been approved or deleted, will not be shown

// AC3d. History items will be ordered by date, such that the most recent history items will be displayed first

// AC4. The array of summary tables will be displayed in the following order, if the defendant is an Adult or Youth only, displaying the associated data as described in the Data section above:

// AC4a. Business Unit, Account Type, Defendant type

// AC4ai. Language Preferences will also be displayed if the associated BU is Welsh speaking

// AC4b. Court Details

// AC4c. Personal Details

// AC4d. Contact Details

// AC4e. Employer Details

// AC4f. Offences and Impositions (a 'Hide' button will also be displayed against each offence)

// AC4g. Payment Terms

// AC4h. Account comments and notes

// AC5. The array of summary tables will be displayed in the following order, if the defendant is an Adult or Youth with a parent or guardian to pay, displaying the associated data as described in the Data section above:

// AC5a. Business Unit, Account Type, Defendant type

// AC5ai. Language Preferences will also be displayed if the associated BU is Welsh speaking

// AC5b. Court Details

// AC5c. Parent or guardian details

// AC5d. Contact Details

// AC5e. Employer Details

// AC5f. Personal Details

// AC5g. Offences and Impositions (a 'Hide' button will also be displayed against each offence)

// AC5h. Payment Terms

// AC5i. Account comments and notes
