import { mount } from 'cypress/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { FinesMacStore } from '../../../../../src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FinesMacReviewAccountComponent } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-review-account/fines-mac-review-account.component';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '../../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '../../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { FINES_AYG_FIXED_PENALTY_ACCOUNT_MOCK } from './mocks/fines_mac_review_fixed_penalty_data_mock';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { SESSION_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-add-account-payload.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { FINES_DRAFT_STATE } from 'src/app/flows/fines/fines-draft/constants/fines-draft-state.constant';
import { DOM_ELEMENTS } from './constants/fines_mac_review_fixed_penalty';

describe('FinesMacReviewFixedPenalty using ReviewAccountComponent', () => {
  let fixedPenaltyMock = structuredClone(FINES_AYG_FIXED_PENALTY_ACCOUNT_MOCK);

  beforeEach(() => {
    cy.intercept('POST', '**/opal-fines-service/draft-accounts**', {
      statusCode: 200,
      body: OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK,
    });
    cy.intercept('PUT', '**/opal-fines-service/draft-accounts/**', {
      statusCode: 200,
      body: OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK,
    });
    
    // Mock the offence request - catch all requests to the offences endpoint
    cy.intercept('GET', '**/opal-fines-service/offences*', (req) => {
      const requestedCjsCode = req.query ? (req.query['q'] || 'CJS123') : 'CJS123';
      
      // Try to find a matching offence in the mock data
      let matchedOffences = OPAL_FINES_OFFENCES_REF_DATA_MOCK.refData.filter(
        (offence) => offence.get_cjs_code === requestedCjsCode,
      );
      
      // If no matches found, create a mock offence for this code
      if (matchedOffences.length === 0) {
        matchedOffences = [{
          business_unit_id: 61,
          date_used_from: '2020-01-01',
          date_used_to: null,
          get_cjs_code: requestedCjsCode.toString(),
          offence_id: 123,
          offence_oas: `OAS for ${requestedCjsCode}`,
          offence_oas_cy: null,
          offence_title: `Mock offence for ${requestedCjsCode}`,
          offence_title_cy: null
        }];
      }
      
      req.reply({
        count: matchedOffences.length,
        refData: matchedOffences
      });
    }).as('getOffenceByCjsCode');
    
    cy.intercept('GET', '**/opal-fines-service/draft-accounts**', {
      statusCode: 200,
      body: OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK,
    }).as('getDraftAccounts');
    
    cy.then(() => {
      fixedPenaltyMock = structuredClone(FINES_AYG_FIXED_PENALTY_ACCOUNT_MOCK);
    });
  });

  const setupComponent = (
    activatedRouteMock: any = FINES_DRAFT_STATE
  ) => {
    console.log('Setting up component with mock data:', fixedPenaltyMock);
    
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

  
  it('should display fixed penalty details', { tags: ['@PO-861'] }, () => {
    setupComponent();
    
    // Check that the page heading is correct
    cy.get(DOM_ELEMENTS.pageHeading).should('contain', 'Check fixed penalty account details');
    cy.get(DOM_ELEMENTS.pageHeading).should('be.visible');

    // Check that the sections are displayed
    cy.get(DOM_ELEMENTS.offenceDetailsCard).should('exist');
    cy.get(DOM_ELEMENTS.noticeNumber).should('exist').and('contain', 'FP12345');
    
    // Check payment terms section
    cy.get(DOM_ELEMENTS.paymentTermsCard).should('exist');
    cy.get(DOM_ELEMENTS.payByDate).should('exist').and('contain', '22 August 2025');
  });

  it('should display summary tables in correct order (AC2, AC2a)', { tags: ['@PO-861'] }, () => {
    setupComponent();

    // Check the page heading
    cy.get(DOM_ELEMENTS.pageHeading).should('contain', 'Check fixed penalty account details').and('be.visible');
    
    // Verify the sections are displayed in the correct order
    const expectedSections = [
      'Court Details',
      'Personal details',
      'Offence Details',
      'Account comments and notes'
    ];
    
    // Get all section headings and check they appear in order
    cy.get(DOM_ELEMENTS.summaryCardTitles).each(($el, index) => {
      cy.wrap($el).should('contain', expectedSections[index]);
    });
  });

  it('should display field values with correct formatting (AC2b)', { tags: ['@PO-861'] }, () => {
    setupComponent();

    // Check date formatting (DD MMM YYYY)
    cy.get(DOM_ELEMENTS.dateOfBirth).should('contain', '1 January 2000 (Adult)');

    // Check address formatting (line-by-line with uppercase postcode)
    cy.get(DOM_ELEMENTS.addressLine1).should('contain', '123 Fake Street')
      .and('contain', 'Fake Town')
      .and('contain', 'Fake City')
      .and('contain', 'AB12 3CD');
    // Check notice number (uppercase)
    cy.get(DOM_ELEMENTS.noticeNumber).should('contain', 'FP12345');
    
    // Check vehicle registration (uppercase)
    cy.get(DOM_ELEMENTS.registrationNumber).should('contain', 'AB12CDE');
  });

  it('should display an em-dash for unpopulated fields (AC2bi)', { tags: ['@PO-861'] }, () => {
    
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

    setupComponent();
    
    cy.get(DOM_ELEMENTS.timeOfOffence).should('contain', '—');
    cy.get(DOM_ELEMENTS.comments).should('contain', '—');
    cy.get(DOM_ELEMENTS.accountNotes).should('contain', '—');
    cy.get(DOM_ELEMENTS.ntoNth).should('contain', '—');
    cy.get(DOM_ELEMENTS.dateOfOffence).should('contain', '—');
    cy.get(DOM_ELEMENTS.drivingLicenceNumber).should('contain', '—');
    cy.get(DOM_ELEMENTS.registrationNumber).should('contain', '—');
    cy.get(DOM_ELEMENTS.dateOfBirth).should('contain', '—');


  });

  it('should display Welsh language preferences when Business Unit supports Welsh', { tags: ['@PO-861'] }, () => {
    // Create a mock with Welsh language support
    fixedPenaltyMock.businessUnit.welsh_language = true;
    fixedPenaltyMock.languagePreferences.formData.fm_language_preferences_document_language = 'CY';
    fixedPenaltyMock.languagePreferences.formData.fm_language_preferences_hearing_language = 'CY';

    setupComponent();
    
    // Verify language preferences section shows Welsh options
    cy.get(DOM_ELEMENTS.documentLanguage).should('contain', 'Welsh and English');
    cy.get(DOM_ELEMENTS.hearingLanguage).should('contain', 'Welsh and English');
  });
});