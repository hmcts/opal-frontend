import { mount } from 'cypress/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { FinesMacStore } from '../../../../../src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FinesMacReviewAccountComponent } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-review-account/fines-mac-review-account.component';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '../../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '../../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { FINES_AYG_FIXED_PENALTY_ACCOUNT_MOCK } from './mocks/fines_mac_review_fixed_penalty_data_mock';
import { FINES_COMPANY_FIXED_PENALTY_ACCOUNT_MOCK } from './mocks/fines_mac_review_fixed_penalty_company_data_mock';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { SESSION_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-add-account-payload.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { OPAL_FINES_PROSECUTOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-prosecutor-ref-data.mock';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { FINES_DRAFT_STATE } from 'src/app/flows/fines/fines-draft/constants/fines-draft-state.constant';
import { DOM_ELEMENTS } from './constants/fines_mac_review_fixed_penalty';
import { IFinesMacState } from '../../../../../src/app/flows/fines/fines-mac/interfaces/fines-mac-state.interface';
import { FINES_MAC_ACCOUNT_TYPES } from 'src/app/flows/fines/fines-mac/constants/fines-mac-account-types';

describe('FinesMacReviewFixedPenalty using ReviewAccountComponent', () => {
  let fixedPenaltyMock: IFinesMacState;

  // Mock data map based on defendant type
  const mockDataMap: { [key: string]: IFinesMacState } = {
    adultOrYouthOnly: FINES_AYG_FIXED_PENALTY_ACCOUNT_MOCK,
    company: FINES_COMPANY_FIXED_PENALTY_ACCOUNT_MOCK,
  };

  beforeEach(() => {
    cy.intercept('POST', '**/opal-fines-service/draft-accounts**', {
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

    // Default to adult/youth mock
    cy.then(() => {
      fixedPenaltyMock = structuredClone(FINES_AYG_FIXED_PENALTY_ACCOUNT_MOCK);
    });
  });

  const setupComponent = (activatedRouteMock: any = FINES_DRAFT_STATE, defendantType: string = 'adultOrYouthOnly') => {
    // Select the appropriate mock data based on defendant type
    fixedPenaltyMock = structuredClone(mockDataMap[defendantType] || FINES_AYG_FIXED_PENALTY_ACCOUNT_MOCK);

    console.log(`Setting up component with mock data for ${defendantType}:`, fixedPenaltyMock);

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
            const store = new FinesMacStore();
            store.setFinesMacStore(fixedPenaltyMock);
            console.log('Store account type:', store.getAccountType());
            return store;
          },
        },
        {
          provide: FinesDraftStore,
          useFactory: () => {
            const store = new FinesDraftStore();
            store.setFinesDraftState(activatedRouteMock);
            return store;
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
                // Provide empty object for reviewAccountFetchMap to prevent overriding our store values
                reviewAccountFetchMap: null,
                results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
                majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
                localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
                courts: OPAL_FINES_COURT_REF_DATA_MOCK,
                prosecutors: OPAL_FINES_PROSECUTOR_REF_DATA_MOCK,
              },
              parent: {
                url: [{ path: 'manual-account-creation' }],
              },
            },
          },
        },
      ],
      componentProperties: {
        isReadOnly: false,
      },
    });
  };

  it(
    '(AC2, AC2a, AC5a) should display tables in correct order and correct content for adult/youth',
    { tags: ['@PO-861'] },
    () => {
      setupComponent(FINES_DRAFT_STATE, 'adultOrYouthOnly');
      cy.wait('@getOffenceByCjsCode');

      // Check the page heading
      cy.get(DOM_ELEMENTS.pageHeading).should('contain', 'Check fixed penalty account details').and('be.visible');

      // Verify the sections are displayed in the correct order
      const expectedSections = [
        'Issuing authority and court details',
        'Personal details',
        'Offence Details',
        'Account comments and notes',
      ];

      // Get all section headings and check they appear in order
      cy.get(DOM_ELEMENTS.summaryCardTitles).each(($el, index) => {
        cy.wrap($el).should('contain', expectedSections[index]);
      });

      // Section 1 - Account Details (No heading)
      cy.get(DOM_ELEMENTS.businessUnit).should('contain', 'Test Business Unit');
      cy.get(DOM_ELEMENTS.accountType).should('contain', FINES_MAC_ACCOUNT_TYPES['Fixed Penalty']);
      cy.get(DOM_ELEMENTS.defendantType).should('contain', 'Adult');

      // Section 2 - Issuing Authority and Court Details
      cy.get(DOM_ELEMENTS.issuingAuthority).should('exist').and('contain', 'Police force');
      // The card title should reflect this is for issuing authority too
      cy.get(DOM_ELEMENTS.enforcementCourt).should('exist').and('contain', 'Historic Debt Database (101)');

      // Section 3 - Personal Details (Adult/Youth)
      cy.get(DOM_ELEMENTS.title).should('contain', 'Mr');
      cy.get(DOM_ELEMENTS.forenames).should('contain', 'John');
      cy.get(DOM_ELEMENTS.surname).should('contain', 'Doe');

      //should display field values with correct formatting (AC2b)'
      cy.get(DOM_ELEMENTS.dateOfBirth).should('contain', '1 January 2000 (Adult)');

      cy.get(DOM_ELEMENTS.addressLine1)
        .should('contain', '123 Fake Street')
        .and('contain', 'Fake Town')
        .and('contain', 'Fake City')
        .and('contain', 'AB12 3CD');

      // Section 5 - Offence Details
      cy.get(DOM_ELEMENTS.noticeNumber).should('contain', 'FP12345');
      cy.get(DOM_ELEMENTS.offenceType).should('contain', 'Vehicle');
      cy.get(DOM_ELEMENTS.registrationNumber).should('contain', 'AB12CDE');
      cy.get(DOM_ELEMENTS.drivingLicenceNumber).should('contain', 'DRIVER123');
      cy.get(DOM_ELEMENTS.ntoNth).should('contain', 'NTO123');
      cy.get(DOM_ELEMENTS.dateNtoIssued).should('contain', '20 June 2025');
      cy.get(DOM_ELEMENTS.dateOfOffence).should('contain', '15 June 2025');
      cy.get(DOM_ELEMENTS.timeOfOffence).should('contain', '14:30');
      cy.get(DOM_ELEMENTS.placeOfOffence).should('contain', 'Main Street');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£100.00');

      // Section 6 - Account comments and notes
      cy.get(DOM_ELEMENTS.comments).should('contain', 'test comments');
      cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'test notes');
    },
  );

  it('(AC2bi, AC5a) should display an em-dash for unpopulated fields (adult/youth only)', { tags: ['@PO-861'] }, () => {
    setupComponent(FINES_DRAFT_STATE, 'adultOrYouthOnly');

    // Clear out fixed penalty field which are optional
    fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_offence_type = 'non-vehicle';
    fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_time_of_offence = '';
    fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_nto_nth = '';
    fixedPenaltyMock.accountCommentsNotes.formData.fm_account_comments_notes_comments = '';
    fixedPenaltyMock.accountCommentsNotes.formData.fm_account_comments_notes_notes = '';
    fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_date_of_offence = '';
    fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_driving_licence_number = '';
    fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_vehicle_registration_number = '';
    fixedPenaltyMock.personalDetails.formData.fm_personal_details_dob = '';

    // Visual verification - check for em-dashes
    cy.get(DOM_ELEMENTS.timeOfOffence).should('contain', '—');
    cy.get(DOM_ELEMENTS.comments).should('contain', '—');
    cy.get(DOM_ELEMENTS.accountNotes).should('contain', '—');
    cy.get(DOM_ELEMENTS.ntoNth).should('contain', '—');
    cy.get(DOM_ELEMENTS.dateOfOffence).should('contain', '—');
    cy.get(DOM_ELEMENTS.drivingLicenceNumber).should('contain', '—');
    cy.get(DOM_ELEMENTS.registrationNumber).should('contain', '—');
    cy.get(DOM_ELEMENTS.dateOfBirth).should('contain', '—');

    // Accessibility verification - check for screen readers (AC2bia)
    cy.get(DOM_ELEMENTS.timeOfOffence)
      .find('app-fines-mac-review-account-not-provided p')
      .should('have.attr', 'aria-label', 'Not provided');
    cy.get(DOM_ELEMENTS.comments)
      .find('app-fines-mac-review-account-not-provided p')
      .should('have.attr', 'aria-label', 'Not provided');
    cy.get(DOM_ELEMENTS.accountNotes)
      .find('app-fines-mac-review-account-not-provided p')
      .should('have.attr', 'aria-label', 'Not provided');
    cy.get(DOM_ELEMENTS.ntoNth)
      .find('app-fines-mac-review-account-not-provided p')
      .should('have.attr', 'aria-label', 'Not provided');
    cy.get(DOM_ELEMENTS.dateOfOffence)
      .find('app-fines-mac-review-account-not-provided p')
      .should('have.attr', 'aria-label', 'Not provided');
    cy.get(DOM_ELEMENTS.drivingLicenceNumber)
      .find('app-fines-mac-review-account-not-provided p')
      .should('have.attr', 'aria-label', 'Not provided');
    cy.get(DOM_ELEMENTS.registrationNumber)
      .find('app-fines-mac-review-account-not-provided p')
      .should('have.attr', 'aria-label', 'Not provided');
    cy.get(DOM_ELEMENTS.dateOfBirth)
      .find('app-fines-mac-review-account-not-provided p')
      .should('have.attr', 'aria-label', 'Not provided');
  });

  it(
    '(AC2, AC2a, AC5a) should display Welsh language preferences Business Unit supports Welsh (AdultOrYouthOnly)',
    { tags: ['@PO-861'] },
    () => {
      setupComponent(FINES_DRAFT_STATE, 'adultOrYouthOnly');

      // Create a mock with Welsh language support
      fixedPenaltyMock.businessUnit.welsh_language = true;
      fixedPenaltyMock.languagePreferences.formData.fm_language_preferences_document_language = 'CY';
      fixedPenaltyMock.languagePreferences.formData.fm_language_preferences_hearing_language = 'CY';

      // Verify language preferences section shows Welsh options
      cy.get(DOM_ELEMENTS.documentLanguage).should('contain', 'Welsh and English');
      cy.get(DOM_ELEMENTS.hearingLanguage).should('contain', 'Welsh and English');
    },
  );

  it(
    '(AC2, AC2a, AC5b) should display Welsh language preferences when Business Unit supports Welsh (Company)',
    { tags: ['@PO-861'] },
    () => {
      setupComponent(FINES_DRAFT_STATE, 'company');

      // Create a mock with Welsh language support
      fixedPenaltyMock.businessUnit.welsh_language = true;
      fixedPenaltyMock.languagePreferences.formData.fm_language_preferences_document_language = 'CY';
      fixedPenaltyMock.languagePreferences.formData.fm_language_preferences_hearing_language = 'CY';

      // Verify language preferences section shows Welsh options
      cy.get(DOM_ELEMENTS.documentLanguage).should('contain', 'Welsh and English');
      cy.get(DOM_ELEMENTS.hearingLanguage).should('contain', 'Welsh and English');
    },
  );

  it(
    '(AC2, AC2a, AC5b) should display tables in correct order and correct content for company defendant',
    { tags: ['@PO-861'] },
    () => {
      setupComponent(FINES_DRAFT_STATE, 'company');

      // Check the page heading
      cy.get(DOM_ELEMENTS.pageHeading).should('contain', 'Check fixed penalty account details').and('be.visible');

      // Section 1 - Account Details
      cy.get(DOM_ELEMENTS.businessUnit).should('contain', 'Corporate Penalties Unit');
      cy.get(DOM_ELEMENTS.accountType).should('contain', FINES_MAC_ACCOUNT_TYPES['Fixed Penalty']);
      cy.get(DOM_ELEMENTS.defendantType).should('contain', 'Company');

      // Section 2 - Court Details
      cy.get(DOM_ELEMENTS.issuingAuthority).should('exist').and('contain', 'Police force (123)');
      cy.get(DOM_ELEMENTS.enforcementCourt).should('exist').and('contain', 'Historic Debt Database (101)');

      // Section 3 - Company Details
      cy.get(DOM_ELEMENTS.companyDetails.companyName).should('contain', 'Example Corporation Ltd');
      cy.get(DOM_ELEMENTS.companyDetails.companyAddress)
        .should('contain', '123 Business Park')
        .and('contain', 'Commerce Way')
        .and('contain', 'London')
        .and('contain', 'EC1A 1BB');

      // Section 3 - Offence Details
      cy.get(DOM_ELEMENTS.noticeNumber).should('contain', 'FPC20250715');
      cy.get(DOM_ELEMENTS.registrationNumber).should('contain', 'CP12 COR');
      cy.get(DOM_ELEMENTS.drivingLicenceNumber).should('contain', 'DRIVER123');
      cy.get(DOM_ELEMENTS.ntoNth).should('contain', 'CORP2025/456');
      cy.get(DOM_ELEMENTS.dateNtoIssued).should('contain', '05 July 2025');
      cy.get(DOM_ELEMENTS.dateOfOffence).should('contain', '01 July 2025');
      cy.get(DOM_ELEMENTS.timeOfOffence).should('contain', '10:15');
      cy.get(DOM_ELEMENTS.placeOfOffence).should('contain', 'London Borough of Westminster');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£500.00');

      // Section 4 - Account comments and notes
      cy.get(DOM_ELEMENTS.comments).should('contain', 'Corporate fixed penalty notice');
      cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Contact company secretary for all correspondence');
    },
  );

  it(
    '(AC2bi, AC5b) should display an em-dash for unpopulated fields in company defendant view',
    { tags: ['@PO-861'] },
    () => {
      setupComponent(FINES_DRAFT_STATE, 'company');

      // Clear out fixed penalty fields which are optional for company
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_time_of_offence = '';
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_nto_nth = '';
      fixedPenaltyMock.accountCommentsNotes.formData.fm_account_comments_notes_comments = '';
      fixedPenaltyMock.accountCommentsNotes.formData.fm_account_comments_notes_notes = '';
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_date_of_offence = '';
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_vehicle_registration_number = '';
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_place_of_offence = '';

      // Visual verification - check for em-dashes
      cy.get(DOM_ELEMENTS.timeOfOffence).should('contain', '—');
      cy.get(DOM_ELEMENTS.comments).should('contain', '—');
      cy.get(DOM_ELEMENTS.accountNotes).should('contain', '—');
      cy.get(DOM_ELEMENTS.ntoNth).should('contain', '—');
      cy.get(DOM_ELEMENTS.dateOfOffence).should('contain', '—');
      cy.get(DOM_ELEMENTS.registrationNumber).should('contain', '—');
      cy.get(DOM_ELEMENTS.placeOfOffence).should('contain', '—');

      // Accessibility verification - check for screen readers (AC2bia)
      cy.get(DOM_ELEMENTS.timeOfOffence)
        .find('app-fines-mac-review-account-not-provided p')
        .should('have.attr', 'aria-label', 'Not provided');
      cy.get(DOM_ELEMENTS.comments)
        .find('app-fines-mac-review-account-not-provided p')
        .should('have.attr', 'aria-label', 'Not provided');
      cy.get(DOM_ELEMENTS.accountNotes)
        .find('app-fines-mac-review-account-not-provided p')
        .should('have.attr', 'aria-label', 'Not provided');
      cy.get(DOM_ELEMENTS.ntoNth)
        .find('app-fines-mac-review-account-not-provided p')
        .should('have.attr', 'aria-label', 'Not provided');
      cy.get(DOM_ELEMENTS.dateOfOffence)
        .find('app-fines-mac-review-account-not-provided p')
        .should('have.attr', 'aria-label', 'Not provided');
      cy.get(DOM_ELEMENTS.registrationNumber)
        .find('app-fines-mac-review-account-not-provided p')
        .should('have.attr', 'aria-label', 'Not provided');
      cy.get(DOM_ELEMENTS.placeOfOffence)
        .find('app-fines-mac-review-account-not-provided p')
        .should('have.attr', 'aria-label', 'Not provided');
    },
  );
});
