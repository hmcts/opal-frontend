import { mount } from 'cypress/angular';
import { ActivatedRoute } from '@angular/router';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { FinesAccPartyAddAmendConvert } from 'src/app/flows/fines/fines-acc/fines-acc-party-add-amend-convert/fines-acc-party-add-amend-convert.component';
import {
  DOM_ELEMENTS,
  getAliasForenamesInput,
  getAliasSurnameInput,
} from '../../../shared/selectors/accountEnquiriesViewDetails.locators';
import {
  ERROR_MESSAGES,
  INDIVIDUAL_REQUIRED_MESSAGES,
  EMPLOYER_REQUIRED_MESSAGES,
  INDIVIDUAL_MAX_LENGTH_ERRORS,
  INDIVIDUAL_ALL_DATA_TYPE_ERRORS,
  COMPANY_MAX_LENGTH_ERRORS,
  COMPANY_ALL_DATA_TYPE_ERRORS,
  NON_PAYING_MAX_LENGTH_ERRORS,
  NON_PAYING_ALL_DATA_TYPE_ERRORS,
} from '../../../shared/errorMessages/accountEnquiriesViewDetails.errorMessages';
import { VIEW_AND_AMEND_DEFENDANT_COMPANY_FULL_MOCK } from './mocks/view-and-amend-defendant-company-full.mock';
import { VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_FULL_MOCK } from './mocks/view-and-amend-defendant-individual-full.mock';
import { VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_MINIMAL_MOCK } from './mocks/view-and-amend-defendant-individual-minimal.mock';
import { MOCK_FINES_ACCOUNT_STATE } from 'src/app/flows/fines/fines-acc/mocks/fines-acc-state.mock';

describe('FinesAccPartyAddAmendConvert - View and Amend Defendant', () => {
  let fullMock = structuredClone(VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_FULL_MOCK);
  let minimalMock = structuredClone(VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_MINIMAL_MOCK);
  let companyfullMock = structuredClone(VIEW_AND_AMEND_DEFENDANT_COMPANY_FULL_MOCK);

  beforeEach(() => {
    fullMock = structuredClone(VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_FULL_MOCK);
    minimalMock = structuredClone(VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_MINIMAL_MOCK);
    companyfullMock = structuredClone(VIEW_AND_AMEND_DEFENDANT_COMPANY_FULL_MOCK);
  });
  const setupComponent = (
    partyType: string = 'INDIVIDUAL',
    partyPayload = VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_FULL_MOCK,
    welshSpeaking: string = 'N',
  ) => {
    mount(FinesAccPartyAddAmendConvert, {
      providers: [
        provideHttpClient(),
        DateService,
        {
          provide: FinesAccountStore,
          useFactory: () => {
            const store = new FinesAccountStore();
            const state = structuredClone(MOCK_FINES_ACCOUNT_STATE);
            state.account_number = 'ACC123456';
            state.party_name = 'John Doe';
            state.party_type = partyType?.toLowerCase?.() ?? state.party_type;
            state.welsh_speaking = welshSpeaking;
            store.setAccountState(state);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                partyAddAmendConvertData: partyPayload,
              },
              params: {
                partyType: partyType.toLowerCase(),
              },
            },
            data: of({}),
          },
        },
      ],
    });
  };

  afterEach(() => {
    cy.then(() => {});
  });

  it(
    'AC1a. The "Defendant Details (Change)" screen will be built as per the design artefacts provided with aliases in mock data',
    { tags: ['@PO-1110'] },
    () => {
      setupComponent('INDIVIDUAL', fullMock);

      // Verify page heading and caption
      cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Defendant details');

      // Verify title dropdown options
      cy.get(DOM_ELEMENTS.titleSelect).find('option').should('contain', 'Mr');
      cy.get(DOM_ELEMENTS.titleSelect).find('option').should('contain', 'Mrs');
      cy.get(DOM_ELEMENTS.titleSelect).find('option').should('contain', 'Miss');
      cy.get(DOM_ELEMENTS.titleSelect).find('option').should('contain', 'Ms');

      cy.get(DOM_ELEMENTS.forenamesInput).should('exist');
      cy.get(DOM_ELEMENTS.forenamesLabel).should('contain', 'First names');
      cy.get(DOM_ELEMENTS.forenamesHint).should('contain', 'Include their middle names');

      cy.get(DOM_ELEMENTS.surnameInput).should('exist');
      cy.get(DOM_ELEMENTS.surnameLabel).should('contain', 'Last name');

      // Add aliases checkbox - should be ticked by default when mock data has aliases
      cy.get(DOM_ELEMENTS.aliasCheckbox).should('exist');
      cy.get(DOM_ELEMENTS.aliasCheckbox).should('be.checked');

      // Alias section should be visible when checkbox is checked
      cy.get(DOM_ELEMENTS.aliasSection).should('exist');

      // Verify first alias from mock data (Johnny Smith)
      cy.get(DOM_ELEMENTS.aliasForenamesInput).should('have.value', 'Johnny');
      cy.get(DOM_ELEMENTS.aliasSurnameInput).should('have.value', 'Smith');

      // Verify second alias from mock data (Jon Johnson)
      cy.get(DOM_ELEMENTS.aliasForenamesInput1).should('have.value', 'Jon');
      cy.get(DOM_ELEMENTS.aliasSurnameInput1).should('have.value', 'Johnson');

      // Verify third alias from mock data (Test Smith)
      cy.get(DOM_ELEMENTS.aliasForenamesInput2).should('have.value', 'Test');
      cy.get(DOM_ELEMENTS.aliasSurnameInput2).should('have.value', 'Smith');

      // Verify Fourth alias from mock data (Test Smith2)
      cy.get(DOM_ELEMENTS.aliasForenamesInput3).should('have.value', 'Test');
      cy.get(DOM_ELEMENTS.aliasSurnameInput3).should('have.value', 'Smith');

      // Verify Fifth alias from mock data (Test Smith3)
      cy.get(DOM_ELEMENTS.aliasForenamesInput4).should('have.value', 'Test');
      cy.get(DOM_ELEMENTS.aliasSurnameInput4).should('have.value', 'Smith');

      // Date of birth

      cy.get(DOM_ELEMENTS.dobInput).should('exist');
      cy.get(DOM_ELEMENTS.dobLabel).should('contain', 'Date of birth');

      // Age display should show calculated age from DOB in mock data
      const dateService = new DateService();
      const dob = fullMock.defendant_account_party.party_details.individual_details?.date_of_birth ?? '';
      const expectedAge = dateService.calculateAge(dob, 'dd/MM/yyyy');
      const expectedAgeGroup = dateService.getAgeObject(dob)?.group ?? '';

      cy.get(DOM_ELEMENTS.ageDisplay).should('exist');
      cy.get(DOM_ELEMENTS.ageValue).should('contain', `Age: ${expectedAge}`);
      cy.get(DOM_ELEMENTS.ageGroup).should('contain', expectedAgeGroup);

      // National Insurance number
      cy.get(DOM_ELEMENTS.niNumberInput).should('exist');
      cy.get(DOM_ELEMENTS.niNumberLabel).should('contain', 'National Insurance number');
      cy.get(DOM_ELEMENTS.niNumberInput).should('have.value', 'AB123456C');

      // Address Section
      cy.get(DOM_ELEMENTS.addressFieldset).should('exist');
      cy.get(DOM_ELEMENTS.addressLegend).should('contain', 'Address');

      cy.get(DOM_ELEMENTS.addressLine1Input).should('exist');
      cy.get(DOM_ELEMENTS.addressLine1Label).should('contain', 'Address line 1');
      cy.get(DOM_ELEMENTS.addressLine1Input).should('have.value', '123 Test Street');

      cy.get(DOM_ELEMENTS.addressLine2Input).should('exist');
      cy.get(DOM_ELEMENTS.addressLine2Label).should('contain', 'Address line 2');
      cy.get(DOM_ELEMENTS.addressLine2Input).should('have.value', 'Second Floor');

      cy.get(DOM_ELEMENTS.addressLine3Input).should('exist');
      cy.get(DOM_ELEMENTS.addressLine3Label).should('contain', 'Address line 3');
      cy.get(DOM_ELEMENTS.addressLine3Input).should('have.value', 'City Center');

      cy.get(DOM_ELEMENTS.postcodeInput).should('exist');
      cy.get(DOM_ELEMENTS.postcodeLabel).should('contain', 'Postcode');
      cy.get(DOM_ELEMENTS.postcodeInput).should('have.value', 'TE5T 1NG');

      // Contact Details Section
      cy.get(DOM_ELEMENTS.contactFieldset).should('exist');
      cy.get(DOM_ELEMENTS.contactLegend).should('contain', 'Contact details');

      cy.get(DOM_ELEMENTS.email1Input).should('exist');
      cy.get(DOM_ELEMENTS.email1Label).should('contain', 'Primary email address');
      cy.get(DOM_ELEMENTS.email1Input).should('have.value', 'john@example.com');

      cy.get(DOM_ELEMENTS.email2Input).should('exist');
      cy.get(DOM_ELEMENTS.email2Label).should('contain', 'Secondary email address');
      cy.get(DOM_ELEMENTS.email2Input).should('have.value', 'john.doe@secondary.com');

      cy.get(DOM_ELEMENTS.mobilePhoneInput).should('exist');
      cy.get(DOM_ELEMENTS.mobilePhoneLabel).should('contain', 'Mobile telephone number');
      cy.get(DOM_ELEMENTS.mobilePhoneInput).should('have.value', '07123456789');

      cy.get(DOM_ELEMENTS.homePhoneInput).should('exist');
      cy.get(DOM_ELEMENTS.homePhoneLabel).should('contain', 'Home telephone number');
      cy.get(DOM_ELEMENTS.homePhoneInput).should('have.value', '01234567890');

      cy.get(DOM_ELEMENTS.businessPhoneInput).should('exist');
      cy.get(DOM_ELEMENTS.businessPhoneLabel).should('contain', 'Work telephone number');
      cy.get(DOM_ELEMENTS.businessPhoneInput).should('have.value', '02087654321');

      // Vehicle Details Section
      cy.get(DOM_ELEMENTS.vehicleFieldset).should('exist');
      cy.get(DOM_ELEMENTS.vehicleLegend).should('contain', 'Vehicle details');

      cy.get(DOM_ELEMENTS.vehicleMakeInput).should('exist');
      cy.get(DOM_ELEMENTS.vehicleMakeLabel).should('contain', 'Make and model');
      cy.get(DOM_ELEMENTS.vehicleMakeInput).should('have.value', 'Toyota Corolla');

      cy.get(DOM_ELEMENTS.vehicleRegistrationInput).should('exist');
      cy.get(DOM_ELEMENTS.vehicleRegistrationLabel).should('contain', 'Registration number');
      cy.get(DOM_ELEMENTS.vehicleRegistrationInput).should('have.value', 'ABC123');

      // Employer Details Section
      cy.get(DOM_ELEMENTS.employerFieldset).should('exist');
      cy.get(DOM_ELEMENTS.employerLegend).should('contain', 'Employer details');

      cy.get(DOM_ELEMENTS.employerCompanyInput).should('exist');
      cy.get(DOM_ELEMENTS.employerCompanyLabel).should('contain', 'Employer name');
      cy.get(DOM_ELEMENTS.employerCompanyInput).should('have.value', 'Test Company');

      cy.get(DOM_ELEMENTS.employerReferenceInput).should('exist');
      cy.get(DOM_ELEMENTS.employerReferenceLabel).should('contain', 'Employee reference');
      cy.get(DOM_ELEMENTS.employerReferenceInput).should('have.value', 'EMP123');

      cy.get(DOM_ELEMENTS.employerEmailInput).should('exist');
      cy.get(DOM_ELEMENTS.employerEmailLabel).should('contain', 'Employer email address');
      cy.get(DOM_ELEMENTS.employerEmailInput).should('have.value', 'hr@company.com');

      cy.get(DOM_ELEMENTS.employerPhoneInput).should('exist');
      cy.get(DOM_ELEMENTS.employerPhoneLabel).should('contain', 'Employer telephone');
      cy.get(DOM_ELEMENTS.employerPhoneInput).should('have.value', '01234567890');

      // Employer Address Section
      cy.get(DOM_ELEMENTS.employerAddressFieldset).should('exist');
      cy.get(DOM_ELEMENTS.employerAddressLegend).should('contain', 'Employer address');

      cy.get(DOM_ELEMENTS.employerAddressLine1Input).should('exist');
      cy.get(DOM_ELEMENTS.employerAddressLine1Label).should('contain', 'Address line 1');
      cy.get(DOM_ELEMENTS.employerAddressLine1Input).should('have.value', '456 Business Park');

      cy.get(DOM_ELEMENTS.employerAddressLine2Input).should('exist');
      cy.get(DOM_ELEMENTS.employerAddressLine2Label).should('contain', 'Address line 2');
      cy.get(DOM_ELEMENTS.employerAddressLine2Input).should('have.value', 'Suite 200');

      cy.get(DOM_ELEMENTS.employerAddressLine3Input).should('exist');
      cy.get(DOM_ELEMENTS.employerAddressLine3Label).should('contain', 'Address line 3');
      cy.get(DOM_ELEMENTS.employerAddressLine3Input).should('have.value', 'Industrial Estate');

      cy.get(DOM_ELEMENTS.employerAddressLine4Input).should('exist');
      cy.get(DOM_ELEMENTS.employerAddressLine4Label).should('contain', 'Address line 4');
      cy.get(DOM_ELEMENTS.employerAddressLine4Input).should('have.value', 'Business District');

      cy.get(DOM_ELEMENTS.employerAddressLine5Input).should('exist');
      cy.get(DOM_ELEMENTS.employerAddressLine5Label).should('contain', 'Address line 5');
      cy.get(DOM_ELEMENTS.employerAddressLine5Input).should('have.value', 'Metropolitan Area');

      cy.get(DOM_ELEMENTS.employerPostcodeInput).should('exist');
      cy.get(DOM_ELEMENTS.employerPostcodeLabel).should('contain', 'Postcode');
      cy.get(DOM_ELEMENTS.employerPostcodeInput).should('have.value', 'BU5 1NE');

      // Non-welsh Speaking
      cy.get(DOM_ELEMENTS.languagePreferencesFieldset).should('not.exist');

      // Form Actions
      cy.get(DOM_ELEMENTS.submitButton).should('exist').should('contain', 'Save changes');
      cy.get(DOM_ELEMENTS.cancelButton).should('exist');
    },
  );

  it('AC1a. Should show alias checkbox unticked when no aliases exist in data', { tags: ['@PO-1110'] }, () => {
    setupComponent('INDIVIDUAL', minimalMock);

    // Add aliases checkbox should be unticked when no aliases in mock data
    cy.get(DOM_ELEMENTS.aliasCheckbox).should('exist');
    cy.get(DOM_ELEMENTS.aliasCheckbox).should('not.be.checked');

    // Alias section should not be visible when checkbox is unchecked
    cy.get(DOM_ELEMENTS.aliasSection).should('not.exist');
  });

  it('AC1a. Language preferences should appear for Welsh speaking business units', { tags: ['@PO-1110'] }, () => {
    setupComponent('INDIVIDUAL', fullMock, 'Y');

    // Language Preferences Section should exist for Welsh speaking BUs
    cy.get(DOM_ELEMENTS.languagePreferencesFieldset).should('exist');
    cy.get(DOM_ELEMENTS.languagePreferencesLegend).should('contain', 'Language preferences');
    cy.get(DOM_ELEMENTS.documentLanguageFieldset).should('exist');
    cy.get(DOM_ELEMENTS.documentLanguageLegend).should('contain', 'Documents');
    cy.get(DOM_ELEMENTS.hearingLanguageFieldset).should('exist');
    cy.get(DOM_ELEMENTS.hearingLanguageLegend).should('contain', 'Court hearings');
  });

  it('AC2. Alias add/remove and clear behaviour', { tags: ['@PO-1110'] }, () => {
    setupComponent('INDIVIDUAL', minimalMock);

    // Pre-condition: checkbox unchecked & section hidden
    cy.get(DOM_ELEMENTS.aliasCheckbox).should('not.be.checked');
    cy.get(DOM_ELEMENTS.aliasSection).should('not.exist');

    // AC2: Tick the Add aliases checkbox
    cy.get(DOM_ELEMENTS.aliasCheckbox).check({ force: true }).should('be.checked');
    cy.get(DOM_ELEMENTS.aliasSection).should('exist');

    // AC2a: Subheading 'Alias 1' displayed
    cy.contains('legend', 'Alias 1').should('exist').and('have.class', 'govuk-fieldset__legend');

    // AC2b: Two free text boxes with titles First names / Last name for Alias 1
    cy.get(DOM_ELEMENTS.aliasForenamesInput).should('exist').and('have.value', '');
    cy.get(DOM_ELEMENTS.aliasSurnameInput).should('exist').and('have.value', '');
    cy.get(DOM_ELEMENTS.aliasForenamesLabel).should('contain', 'First names');
    cy.get(DOM_ELEMENTS.aliasSurnameLabel).should('contain', 'Last name');

    // Enter some data to later verify clearing behaviour (AC2f)
    cy.get(DOM_ELEMENTS.aliasForenamesInput).type('Alpha');
    cy.get(DOM_ELEMENTS.aliasSurnameInput).type('One');

    // AC2c: Grey 'Add another alias' button displayed
    cy.get(DOM_ELEMENTS.addAliasButton).should('exist').and('contain', 'Add another alias');

    // Helper to add alias and assert its presence
    const addAliasAndAssert = (aliasNumber: number) => {
      cy.get(DOM_ELEMENTS.addAliasButton).click();
      cy.contains('legend', `Alias ${aliasNumber}`).should('exist');
      const index = aliasNumber - 1;
      cy.get(getAliasForenamesInput(index)).should('exist');
      cy.get(getAliasSurnameInput(index)).should('exist');
    };

    // AC2d / AC2di: Add aliases 2 through 5 incrementally
    addAliasAndAssert(2);
    cy.get('a.govuk-link').contains('Remove').should('exist'); // remove link appears when >1 alias
    addAliasAndAssert(3);
    addAliasAndAssert(4);
    addAliasAndAssert(5);

    // AC2dii: Once 5 alias rows added, add button disappears
    cy.get(DOM_ELEMENTS.addAliasButton).should('not.exist');

    // AC2e / AC2ei: Remove link present (for >1 alias) & not within Alias 1 fieldset
    cy.get('a.govuk-link').contains('Remove').should('exist');
    cy.contains('legend', 'Alias 1')
      .parent('fieldset')
      .within(() => {
        cy.contains('Remove').should('not.exist');
      });

    // AC2eii: Remove last alias (Alias 5). Expect Alias 5 legend to disappear & button reappear
    cy.get('a.govuk-link').contains('Remove').click();
    cy.contains('legend', 'Alias 5').should('not.exist');
    cy.get(DOM_ELEMENTS.addAliasButton).should('exist');

    // Add back up to 5 to demonstrate cap again
    addAliasAndAssert(5);
    cy.get(DOM_ELEMENTS.addAliasButton).should('not.exist');

    // AC2f: Untick Add aliases checkbox hides & wipes alias data
    cy.get(DOM_ELEMENTS.aliasCheckbox).uncheck({ force: true }).should('not.be.checked');
    cy.get(DOM_ELEMENTS.aliasSection).should('not.exist');

    // Re-check and ensure a fresh empty Alias 1 row (data wiped)
    cy.get(DOM_ELEMENTS.aliasCheckbox).check({ force: true }).should('be.checked');
    cy.get(DOM_ELEMENTS.aliasSection).should('exist');
    cy.get(DOM_ELEMENTS.aliasForenamesInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.aliasSurnameInput).should('have.value', '');
  });

  it('AC5. Required field validation (core)', { tags: ['@PO-1110'] }, () => {
    const emptyCoreMock = structuredClone(minimalMock);
    // Clear required fields to trigger validation
    emptyCoreMock.defendant_account_party.party_details.individual_details!.title = null;
    emptyCoreMock.defendant_account_party.party_details.individual_details!.forenames = '';
    emptyCoreMock.defendant_account_party.party_details.individual_details!.surname = '';
    emptyCoreMock.defendant_account_party.address.address_line_1 = '';
    setupComponent('INDIVIDUAL', emptyCoreMock);

    // Pre-condition: no error summary
    cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');

    // Ensure mandatory fields are empty (they are null in minimal mock)
    cy.get(DOM_ELEMENTS.titleSelect).should('have.value', null);
    cy.get(DOM_ELEMENTS.forenamesInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.surnameInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.addressLine1Input).should('have.value', '');

    // Submit to trigger validation
    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    INDIVIDUAL_REQUIRED_MESSAGES.forEach((msg) => {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', msg);
    });

    // Employer required errors should NOT appear because no employer fields were interacted with (conditional requirement)
    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain.text', ERROR_MESSAGES.REQUIRED_EMPLOYER_NAME);
    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain.text', ERROR_MESSAGES.REQUIRED_EMPLOYER_REFERENCE_OR_NI);
  });

  it('AC5. Required field validation (employer name)', { tags: ['@PO-1110'] }, () => {
    minimalMock.defendant_account_party.employer_details!.employer_name = 'Test Company';
    setupComponent('INDIVIDUAL', minimalMock);

    // Leave all employer values blank then submit
    cy.get(DOM_ELEMENTS.submitButton).click();

    // Now the employer required messages appears (conditional activation)
    EMPLOYER_REQUIRED_MESSAGES.forEach((msg) => {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', msg);
    });
  });

  it('AC5. Required field validation (employer address)', { tags: ['@PO-1110'] }, () => {
    minimalMock.defendant_account_party.employer_details!.employer_address!.address_line_1 = 'Address';
    setupComponent('INDIVIDUAL', minimalMock);

    // Leave all employer values blank then submit
    cy.get(DOM_ELEMENTS.submitButton).click();

    // Now the employer required messages appears (conditional activation)
    const employerRequiredMessages = [
      ERROR_MESSAGES.REQUIRED_EMPLOYER_REFERENCE_OR_NI,
      ERROR_MESSAGES.REQUIRED_EMPLOYER_NAME,
    ];

    employerRequiredMessages.forEach((msg) => {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', msg);
    });
  });

  it('AC5. Required field validation (employer reference number)', { tags: ['@PO-1110'] }, () => {
    minimalMock.defendant_account_party.employer_details!.employer_reference = 'Ref123';
    setupComponent('INDIVIDUAL', minimalMock);

    // Leave all employer values blank then submit
    cy.get(DOM_ELEMENTS.submitButton).click();

    // Now the employer required messages appears (conditional activation)
    const employerRequiredMessages = [
      ERROR_MESSAGES.REQUIRED_EMPLOYER_ADDRESS_LINE_1,
      ERROR_MESSAGES.REQUIRED_EMPLOYER_NAME,
    ];

    employerRequiredMessages.forEach((msg) => {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', msg);
    });
  });

  it('AC5h, AC5i, AC5j. Required field validation for all alias rows (N=1 to 5)', { tags: ['@PO-1110'] }, () => {
    setupComponent('INDIVIDUAL', minimalMock);
    cy.get(DOM_ELEMENTS.aliasCheckbox).check({ force: true }).should('be.checked');
    cy.get(DOM_ELEMENTS.aliasSection).should('exist');

    for (let i = 2; i <= 5; i++) {
      cy.get(DOM_ELEMENTS.addAliasButton).click();
      cy.contains('legend', `Alias ${i}`).should('exist');
    }
    cy.get(DOM_ELEMENTS.addAliasButton).should('not.exist');

    cy.get(DOM_ELEMENTS.submitButton).click();

    // AC5h: Verify all alias first name and last name required errors appear
    for (let aliasNumber = 1; aliasNumber <= 5; aliasNumber++) {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', ERROR_MESSAGES.REQUIRED_ALIAS_FORENAMES(aliasNumber));
      cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', ERROR_MESSAGES.REQUIRED_ALIAS_SURNAME(aliasNumber));
    }

    // AC5i: Test partial completion - fill only first names, leave last names empty
    for (let aliasIndex = 0; aliasIndex < 5; aliasIndex++) {
      cy.get(getAliasForenamesInput(aliasIndex))
        .clear()
        .type(`FirstName${aliasIndex + 1}`, { delay: 0 });
    }

    cy.get(DOM_ELEMENTS.submitButton).click();

    for (let aliasNumber = 1; aliasNumber <= 5; aliasNumber++) {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', ERROR_MESSAGES.REQUIRED_ALIAS_SURNAME(aliasNumber));
    }

    for (let aliasNumber = 1; aliasNumber <= 5; aliasNumber++) {
      cy.get(DOM_ELEMENTS.errorSummary).should(
        'not.contain.text',
        ERROR_MESSAGES.REQUIRED_ALIAS_FORENAMES(aliasNumber),
      );
    }

    // AC5j: Test partial completion - clear first names, fill only last names
    for (let aliasIndex = 0; aliasIndex < 5; aliasIndex++) {
      cy.get(getAliasForenamesInput(aliasIndex)).clear();
      cy.get(getAliasSurnameInput(aliasIndex))
        .clear()
        .type(`LastName${aliasIndex + 1}`, { delay: 0 });
    }

    cy.get(DOM_ELEMENTS.submitButton).click();

    for (let aliasNumber = 1; aliasNumber <= 5; aliasNumber++) {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', ERROR_MESSAGES.REQUIRED_ALIAS_FORENAMES(aliasNumber));
    }

    for (let aliasNumber = 1; aliasNumber <= 5; aliasNumber++) {
      cy.get(DOM_ELEMENTS.errorSummary).should('not.contain.text', ERROR_MESSAGES.REQUIRED_ALIAS_SURNAME(aliasNumber));
    }
  });

  it('AC6a. DOB with non-numerical characters shows format error', { tags: ['@PO-1110'] }, () => {
    minimalMock.defendant_account_party.party_details.individual_details!.date_of_birth = 'AA/BB/CCCC';
    setupComponent('INDIVIDUAL', minimalMock);

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', ERROR_MESSAGES.FORMAT_DOB_INVALID);
  });

  it('AC6b. DOB in the future shows past-date error', { tags: ['@PO-1110'] }, () => {
    minimalMock.defendant_account_party.party_details.individual_details!.date_of_birth = '01/01/2099';
    setupComponent('INDIVIDUAL', minimalMock);

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', ERROR_MESSAGES.FORMAT_DOB_FUTURE);
  });

  it('AC6c. NI number invalid format shows NI format error', { tags: ['@PO-1110'] }, () => {
    minimalMock.defendant_account_party.party_details.individual_details!.national_insurance_number = '12345';
    setupComponent('INDIVIDUAL', minimalMock);

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', ERROR_MESSAGES.FORMAT_NI_NUMBER);
  });

  // AC7: Email format validation
  it('AC7a. Primary email invalid format shows primary email format error', { tags: ['@PO-1110'] }, () => {
    minimalMock.defendant_account_party.contact_details!.primary_email_address = 'invalid_email'; // missing @ and domain
    setupComponent('INDIVIDUAL', minimalMock);

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', ERROR_MESSAGES.FORMAT_EMAIL_PRIMARY);
  });

  it('AC7b. Secondary email invalid format shows secondary email format error', { tags: ['@PO-1110'] }, () => {
    minimalMock.defendant_account_party.contact_details!.secondary_email_address = 'bad.second'; // missing @
    setupComponent('INDIVIDUAL', minimalMock);

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', ERROR_MESSAGES.FORMAT_EMAIL_SECONDARY);
  });

  it('AC7c. Employer email invalid format shows employer email format error', { tags: ['@PO-1110'] }, () => {
    minimalMock.defendant_account_party.employer_details!.employer_email_address = 'employer#mail'; // invalid char & structure
    setupComponent('INDIVIDUAL', minimalMock);

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', ERROR_MESSAGES.FORMAT_EMAIL_EMPLOYER);
  });

  it('AC8a. Home telephone invalid format shows home telephone error', { tags: ['@PO-1110'] }, () => {
    minimalMock.defendant_account_party.contact_details!.home_telephone_number = '01632A960001'; // alpha char
    setupComponent('INDIVIDUAL', minimalMock);
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', ERROR_MESSAGES.FORMAT_PHONE_HOME);
  });

  it('AC8b. Work telephone invalid format shows work telephone error', { tags: ['@PO-1110'] }, () => {
    minimalMock.defendant_account_party.contact_details!.work_telephone_number = '01632-960-001X'; // invalid char X
    setupComponent('INDIVIDUAL', minimalMock);
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', ERROR_MESSAGES.FORMAT_PHONE_WORK);
  });

  it('AC8c. Mobile telephone invalid length/format shows mobile telephone error', { tags: ['@PO-1110'] }, () => {
    minimalMock.defendant_account_party.contact_details!.mobile_telephone_number = '0770090098'; // 10 digits (should be 11)
    setupComponent('INDIVIDUAL', minimalMock);
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', ERROR_MESSAGES.FORMAT_PHONE_MOBILE);
  });

  it('AC8d. Employer telephone invalid format shows employer telephone error', { tags: ['@PO-1110'] }, () => {
    minimalMock.defendant_account_party.employer_details!.employer_telephone_number = '01263 76612X'; // invalid char X
    setupComponent('INDIVIDUAL', minimalMock);
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', ERROR_MESSAGES.FORMAT_PHONE_EMPLOYER);
  });

  it('AC9. Max length validation retains user on form and shows per-field errors', { tags: ['@PO-1110'] }, () => {
    const maxLengthMock = structuredClone(minimalMock);
    const primaryEmail = `${'a'.repeat(65)}@example.com`;
    const secondaryEmail = `${'b'.repeat(65)}@example.com`;
    const employerEmail = `${'c'.repeat(65)}@example.com`;

    // Set up data with values exceeding max length
    maxLengthMock.defendant_account_party.party_details.individual_details!.forenames = 'A'.repeat(21);
    maxLengthMock.defendant_account_party.party_details.individual_details!.surname = 'B'.repeat(31);
    maxLengthMock.defendant_account_party.party_details.individual_details!.individual_aliases = [
      {
        alias_id: '1',
        sequence_number: 1,
        forenames: 'C'.repeat(21),
        surname: 'D'.repeat(31),
      },
    ];
    maxLengthMock.defendant_account_party.party_details.individual_details!.national_insurance_number = 'AB123456CD';
    maxLengthMock.defendant_account_party.address!.address_line_1 = 'E'.repeat(31);
    maxLengthMock.defendant_account_party.address!.address_line_2 = 'F'.repeat(31);
    maxLengthMock.defendant_account_party.address!.address_line_3 = 'G'.repeat(17);
    maxLengthMock.defendant_account_party.address!.postcode = 'POSTCODE9';
    maxLengthMock.defendant_account_party.contact_details!.primary_email_address = primaryEmail;
    maxLengthMock.defendant_account_party.contact_details!.secondary_email_address = secondaryEmail;
    maxLengthMock.defendant_account_party.vehicle_details!.vehicle_make_and_model = 'H'.repeat(31);
    maxLengthMock.defendant_account_party.vehicle_details!.vehicle_registration = 'I'.repeat(21);
    maxLengthMock.defendant_account_party.employer_details!.employer_name = 'J'.repeat(51);
    maxLengthMock.defendant_account_party.employer_details!.employer_reference = 'K'.repeat(21);
    maxLengthMock.defendant_account_party.employer_details!.employer_email_address = employerEmail;
    maxLengthMock.defendant_account_party.employer_details!.employer_address!.address_line_1 = 'L'.repeat(31);
    maxLengthMock.defendant_account_party.employer_details!.employer_address!.address_line_2 = 'M'.repeat(31);
    maxLengthMock.defendant_account_party.employer_details!.employer_address!.address_line_3 = 'N'.repeat(31);
    maxLengthMock.defendant_account_party.employer_details!.employer_address!.address_line_4 = 'O'.repeat(31);
    maxLengthMock.defendant_account_party.employer_details!.employer_address!.address_line_5 = 'P'.repeat(31);
    maxLengthMock.defendant_account_party.employer_details!.employer_address!.postcode = 'EMPPOSTC9';

    setupComponent('INDIVIDUAL', maxLengthMock);

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Defendant details');
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');

    INDIVIDUAL_MAX_LENGTH_ERRORS.forEach((message) => {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', message);
    });
  });

  it('AC10. Data type validation for alphabetical and alphanumeric fields', { tags: ['@PO-1110'] }, () => {
    const dataTypeValidationMock = structuredClone(minimalMock);

    // Set up data with invalid characters for validation testing
    dataTypeValidationMock.defendant_account_party.party_details.individual_details!.forenames = 'John123';
    dataTypeValidationMock.defendant_account_party.party_details.individual_details!.surname = 'Doe@Smith';
    dataTypeValidationMock.defendant_account_party.party_details.individual_details!.individual_aliases = [
      {
        alias_id: '1',
        sequence_number: 1,
        forenames: 'Johnny$',
        surname: 'Smith#Brown',
      },
    ];
    dataTypeValidationMock.defendant_account_party.address!.address_line_1 = '123 Main St @#$';
    dataTypeValidationMock.defendant_account_party.address!.address_line_2 = 'Apt 4B %^&';
    dataTypeValidationMock.defendant_account_party.address!.address_line_3 = 'Building C *()+=';
    dataTypeValidationMock.defendant_account_party.address!.postcode = 'M1& 1AA';
    dataTypeValidationMock.defendant_account_party.vehicle_details!.vehicle_make_and_model = 'Toyota Corolla {}[]';
    dataTypeValidationMock.defendant_account_party.vehicle_details!.vehicle_registration = 'ABC123|\\';
    dataTypeValidationMock.defendant_account_party.employer_details!.employer_name = 'Test Company <>?/';
    dataTypeValidationMock.defendant_account_party.employer_details!.employer_reference = 'EMP123~`';
    dataTypeValidationMock.defendant_account_party.employer_details!.employer_address!.address_line_1 =
      '456 Business Park !@#';
    dataTypeValidationMock.defendant_account_party.employer_details!.employer_address!.address_line_2 = 'Suite 200 $%^';
    dataTypeValidationMock.defendant_account_party.employer_details!.employer_address!.address_line_3 =
      'Industrial Estate &*()';
    dataTypeValidationMock.defendant_account_party.employer_details!.employer_address!.address_line_4 =
      'Business District +={}';
    dataTypeValidationMock.defendant_account_party.employer_details!.employer_address!.address_line_5 =
      'Metropolitan Area []|\\';
    dataTypeValidationMock.defendant_account_party.employer_details!.employer_address!.postcode = 'BU5& 1NE';

    setupComponent('INDIVIDUAL', dataTypeValidationMock);

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Defendant details');
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');

    // Verify all expected error messages appear
    INDIVIDUAL_ALL_DATA_TYPE_ERRORS.forEach((message) => {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', message);
    });
  });

  it('AC1. Amend Company Details screen opens successfully', { tags: ['@PO-1111'] }, () => {
    setupComponent('COMPANY', companyfullMock);

    // Verify the page loads successfully
    cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Company details');

    // === Company Details Section ===
    cy.get(DOM_ELEMENTS.organisationNameInput).should('exist');
    cy.get(DOM_ELEMENTS.organisationNameInput).should('have.value', 'ABC Corporation Ltd');
    cy.get(DOM_ELEMENTS.organisationNameLabel).should('contain', 'Company name');

    // Verify company aliases checkbox (ticked when aliases are present)
    cy.get(DOM_ELEMENTS.aliasCheckbox).should('exist');
    cy.get(DOM_ELEMENTS.aliasCheckbox).should('be.checked');
    cy.get(DOM_ELEMENTS.aliasSection).should('exist');

    // Verify all 5 organisation aliases from mock data
    cy.get(DOM_ELEMENTS.organisationAliasInput0).should('have.value', 'ABC Corp');
    cy.get(DOM_ELEMENTS.organisationAliasLabel0).should('contain', 'Company name');

    cy.get(DOM_ELEMENTS.organisationAliasInput1).should('have.value', 'ABC Limited');
    cy.get(DOM_ELEMENTS.organisationAliasLabel1).should('contain', 'Company name');

    cy.get(DOM_ELEMENTS.organisationAliasInput2).should('have.value', 'ABC Trading');
    cy.get(DOM_ELEMENTS.organisationAliasLabel2).should('contain', 'Company name');

    cy.get(DOM_ELEMENTS.organisationAliasInput3).should('have.value', 'ABC Enterprises');
    cy.get(DOM_ELEMENTS.organisationAliasLabel3).should('contain', 'Company name');

    cy.get(DOM_ELEMENTS.organisationAliasInput4).should('have.value', 'ABC Holdings');
    cy.get(DOM_ELEMENTS.organisationAliasLabel4).should('contain', 'Company name');

    // === Individual fields should NOT be present for company ===
    cy.get(DOM_ELEMENTS.titleSelect).should('not.exist');
    cy.get(DOM_ELEMENTS.forenamesInput).should('not.exist');
    cy.get(DOM_ELEMENTS.surnameInput).should('not.exist');
    cy.get(DOM_ELEMENTS.dobInput).should('not.exist');
    cy.get(DOM_ELEMENTS.niNumberInput).should('not.exist');

    // === Address Information ===
    cy.get(DOM_ELEMENTS.addressFieldset).should('exist');
    cy.get(DOM_ELEMENTS.addressLegend).should('contain', 'Address');

    cy.get(DOM_ELEMENTS.addressLine1Input).should('exist');
    cy.get(DOM_ELEMENTS.addressLine1Input).should('have.value', '100 Corporate Plaza');
    cy.get(DOM_ELEMENTS.addressLine1Label).should('contain', 'Address line 1');

    cy.get(DOM_ELEMENTS.addressLine2Input).should('exist');
    cy.get(DOM_ELEMENTS.addressLine2Input).should('have.value', '25th Floor');
    cy.get(DOM_ELEMENTS.addressLine2Label).should('contain', 'Address line 2');

    cy.get(DOM_ELEMENTS.addressLine3Input).should('exist');
    cy.get(DOM_ELEMENTS.addressLine3Input).should('have.value', 'Financial');
    cy.get(DOM_ELEMENTS.addressLine3Label).should('contain', 'Address line 3');

    cy.get(DOM_ELEMENTS.postcodeInput).should('exist');
    cy.get(DOM_ELEMENTS.postcodeInput).should('have.value', 'EC2Y 8DS');
    cy.get(DOM_ELEMENTS.postcodeLabel).should('contain', 'Postcode');

    // === Contact Information ===
    cy.get(DOM_ELEMENTS.contactFieldset).should('exist');
    cy.get(DOM_ELEMENTS.contactLegend).should('contain', 'Contact details');

    cy.get(DOM_ELEMENTS.email1Input).should('exist');
    cy.get(DOM_ELEMENTS.email1Input).should('have.value', 'contact@abccorporation.co.uk');
    cy.get(DOM_ELEMENTS.email1Label).should('contain', 'Primary email address');

    cy.get(DOM_ELEMENTS.email2Input).should('exist');
    cy.get(DOM_ELEMENTS.email2Input).should('have.value', 'legal@abccorporation.co.uk');
    cy.get(DOM_ELEMENTS.email2Label).should('contain', 'Secondary email address');

    cy.get(DOM_ELEMENTS.mobilePhoneInput).should('exist');
    cy.get(DOM_ELEMENTS.mobilePhoneInput).should('have.value', '07900123456');
    cy.get(DOM_ELEMENTS.mobilePhoneLabel).should('contain', 'Mobile telephone number');

    cy.get(DOM_ELEMENTS.homePhoneInput).should('exist');
    cy.get(DOM_ELEMENTS.homePhoneInput).should('have.value', '02071234567');
    cy.get(DOM_ELEMENTS.homePhoneLabel).should('contain', 'Home telephone number');

    cy.get(DOM_ELEMENTS.businessPhoneInput).should('exist');
    cy.get(DOM_ELEMENTS.businessPhoneInput).should('have.value', '02071234567');
    cy.get(DOM_ELEMENTS.businessPhoneLabel).should('contain', 'Work telephone number');

    // Should not be present for non-Welsh speaking BU
    cy.get(DOM_ELEMENTS.languagePreferencesFieldset).should('not.exist');

    // === Vehicle Information ===
    cy.get(DOM_ELEMENTS.vehicleFieldset).should('exist');
    cy.get(DOM_ELEMENTS.vehicleLegend).should('contain', 'Vehicle details');

    cy.get(DOM_ELEMENTS.vehicleMakeInput).should('exist');
    cy.get(DOM_ELEMENTS.vehicleMakeInput).should('have.value', 'Mercedes Sprinter');
    cy.get(DOM_ELEMENTS.vehicleMakeLabel).should('contain', 'Make and model');

    cy.get(DOM_ELEMENTS.vehicleRegistrationInput).should('exist');
    cy.get(DOM_ELEMENTS.vehicleRegistrationInput).should('have.value', 'ABC123D');
    cy.get(DOM_ELEMENTS.vehicleRegistrationLabel).should('contain', 'Registration number');

    // Employer section is not relevant for companies
    cy.get(DOM_ELEMENTS.employerFieldset).should('not.exist');

    cy.get(DOM_ELEMENTS.submitButton).should('exist').should('contain', 'Save changes');
  });

  it(
    'AC1b. Company Details screen shows language preferences for Welsh speaking business units',
    { tags: ['@PO-1111'] },
    () => {
      setupComponent('COMPANY', companyfullMock, 'Y');

      cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Company details');

      cy.get(DOM_ELEMENTS.languagePreferencesFieldset).should('exist');
      cy.get(DOM_ELEMENTS.languagePreferencesLegend).should('contain', 'Language preferences');

      cy.get(DOM_ELEMENTS.documentLanguageFieldset).should('exist');
      cy.get(DOM_ELEMENTS.documentLanguageLegend).should('contain', 'Documents');

      // Check for radio buttons instead of input fields
      cy.get(DOM_ELEMENTS.documentLanguageRadioEN).should('exist');
      cy.get(DOM_ELEMENTS.documentLanguageRadioCY).should('exist');
      cy.get(DOM_ELEMENTS.documentLanguageRadioLabelEN).should('contain', 'English only');
      cy.get(DOM_ELEMENTS.documentLanguageRadioLabelCY).should('contain', 'Welsh and English');

      cy.get(DOM_ELEMENTS.hearingLanguageFieldset).should('exist');
      cy.get(DOM_ELEMENTS.hearingLanguageLegend).should('contain', 'Court hearings');

      cy.get(DOM_ELEMENTS.hearingLanguageRadioEN).should('exist');
      cy.get(DOM_ELEMENTS.hearingLanguageRadioCY).should('exist');
      cy.get(DOM_ELEMENTS.hearingLanguageRadioLabelEN).should('contain', 'English only');
      cy.get(DOM_ELEMENTS.hearingLanguageRadioLabelCY).should('contain', 'Welsh and English');

      // Verify the "English" radio button is selected by default
      cy.get(DOM_ELEMENTS.documentLanguageRadioEN).should('be.checked');
      cy.get(DOM_ELEMENTS.hearingLanguageRadioEN).should('be.checked');
    },
  );

  it('AC1d. Optional fields display as blank when no data is entered for company', { tags: ['@PO-1111'] }, () => {
    const companyMinimalMock = structuredClone(companyfullMock);

    // Clear optional fields to test blank state
    companyMinimalMock.defendant_account_party.party_details.organisation_details!.organisation_aliases = [];
    companyMinimalMock.defendant_account_party.address!.address_line_2 = null;
    companyMinimalMock.defendant_account_party.address!.address_line_3 = null;
    companyMinimalMock.defendant_account_party.address!.postcode = null;
    companyMinimalMock.defendant_account_party.contact_details!.primary_email_address = null;
    companyMinimalMock.defendant_account_party.contact_details!.secondary_email_address = null;
    companyMinimalMock.defendant_account_party.contact_details!.mobile_telephone_number = null;
    companyMinimalMock.defendant_account_party.contact_details!.home_telephone_number = null;
    companyMinimalMock.defendant_account_party.contact_details!.work_telephone_number = null;
    companyMinimalMock.defendant_account_party.vehicle_details!.vehicle_make_and_model = null;
    companyMinimalMock.defendant_account_party.vehicle_details!.vehicle_registration = null;

    setupComponent('COMPANY', companyMinimalMock);

    cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Company details');

    // Verify company aliases checkbox is unchecked and alias section not visible
    cy.get(DOM_ELEMENTS.organisationAliasCheckbox).should('not.be.checked');
    cy.get(DOM_ELEMENTS.organisationAliasSection).should('not.exist');

    // Verify optional address fields are blank
    cy.get(DOM_ELEMENTS.addressLine2Input).should('have.value', '');
    cy.get(DOM_ELEMENTS.addressLine3Input).should('have.value', '');
    cy.get(DOM_ELEMENTS.postcodeInput).should('have.value', '');

    // Verify optional contact fields are blank
    cy.get(DOM_ELEMENTS.email1Input).should('have.value', '');
    cy.get(DOM_ELEMENTS.email2Input).should('have.value', '');
    cy.get(DOM_ELEMENTS.mobilePhoneInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.homePhoneInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.businessPhoneInput).should('have.value', '');

    // Verify optional vehicle fields are blank
    cy.get(DOM_ELEMENTS.vehicleMakeInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.vehicleRegistrationInput).should('have.value', '');
  });

  it('AC2. Company alias add/remove and clear behaviour', { tags: ['@PO-1111'] }, () => {
    // Start with company mock without aliases
    const testMock = structuredClone(companyfullMock);
    testMock.defendant_account_party.party_details.organisation_details!.organisation_aliases = [];

    setupComponent('COMPANY', testMock);

    // AC2 - Initially, alias checkbox should be unchecked and alias section hidden
    cy.get(DOM_ELEMENTS.organisationAliasCheckbox).should('not.be.checked');

    // AC2a - Check the "Add aliases" checkbox to reveal alias section
    cy.get(DOM_ELEMENTS.organisationAliasCheckbox).check();
    cy.get(DOM_ELEMENTS.organisationAliasSection).should('be.visible');

    // AC2a - Verify "Alias 1" subheading is displayed in bold
    cy.get(DOM_ELEMENTS.organisationAliasSection).should('contain', 'Alias 1');

    // AC2b - Verify "Company name" field is displayed below subheading
    cy.get(DOM_ELEMENTS.organisationAliasInput0).should('exist');
    cy.get(DOM_ELEMENTS.organisationAliasLabel0).should('contain', 'Company name');

    // AC2c - Verify "Add another alias" button is displayed
    cy.get(DOM_ELEMENTS.addOrganisationAliasButton).should('exist');
    cy.get(DOM_ELEMENTS.addOrganisationAliasButton).should('contain', 'Add another alias');

    // AC2d - Click "Add another alias" for the first time
    cy.get(DOM_ELEMENTS.addOrganisationAliasButton).click();

    // AC2di - Verify "Alias 2" subheading is displayed
    cy.get(DOM_ELEMENTS.organisationAliasSection).should('contain', 'Alias 2');
    cy.get(DOM_ELEMENTS.organisationAliasInput1).should('exist');
    cy.get(DOM_ELEMENTS.organisationAliasLabel1).should('contain', 'Company name');

    // AC2e, AC2ei - Verify remove button exists for Alias 2 but not for Alias 1
    cy.get(DOM_ELEMENTS.removeOrganisationAliasButton).should('have.length', 1);

    // Add more aliases to test incremental numbering
    cy.get(DOM_ELEMENTS.addOrganisationAliasButton).click(); // Add Alias 3
    cy.get(DOM_ELEMENTS.organisationAliasSection).should('contain', 'Alias 3');
    cy.get(DOM_ELEMENTS.organisationAliasInput2).should('exist');

    cy.get(DOM_ELEMENTS.addOrganisationAliasButton).click(); // Add Alias 4
    cy.get(DOM_ELEMENTS.organisationAliasSection).should('contain', 'Alias 4');
    cy.get(DOM_ELEMENTS.organisationAliasInput3).should('exist');

    cy.get(DOM_ELEMENTS.addOrganisationAliasButton).click(); // Add Alias 5
    cy.get(DOM_ELEMENTS.organisationAliasSection).should('contain', 'Alias 5');
    cy.get(DOM_ELEMENTS.organisationAliasInput4).should('exist');

    // AC2dii - Verify "Add another alias" button is no longer displayed after 5 aliases
    cy.get(DOM_ELEMENTS.addOrganisationAliasButton).should('not.exist');

    // Fill in some test data for alias removal test
    cy.get(DOM_ELEMENTS.organisationAliasInput0).type('Company One', { delay: 0 });
    cy.get(DOM_ELEMENTS.organisationAliasInput1).type('Company Two', { delay: 0 });
    cy.get(DOM_ELEMENTS.organisationAliasInput2).type('Company Three', { delay: 0 });
    cy.get(DOM_ELEMENTS.organisationAliasInput3).type('Company Four', { delay: 0 });
    cy.get(DOM_ELEMENTS.organisationAliasInput4).type('Company Five', { delay: 0 });

    // AC2eii - Test removing and verify renumbering
    cy.get(DOM_ELEMENTS.removeOrganisationAliasButton).click();

    cy.get(DOM_ELEMENTS.organisationAliasSection).should('contain', 'Alias 1');
    cy.get(DOM_ELEMENTS.organisationAliasSection).should('contain', 'Alias 2');
    cy.get(DOM_ELEMENTS.organisationAliasSection).should('contain', 'Alias 3');
    cy.get(DOM_ELEMENTS.organisationAliasSection).should('contain', 'Alias 4');
    cy.get(DOM_ELEMENTS.organisationAliasSection).should('not.contain', 'Alias 5');

    // Verify data has been adjusted accordingly
    cy.get(DOM_ELEMENTS.organisationAliasInput0).should('have.value', 'COMPANY ONE');
    cy.get(DOM_ELEMENTS.organisationAliasInput1).should('have.value', 'COMPANY TWO');
    cy.get(DOM_ELEMENTS.organisationAliasInput2).should('have.value', 'COMPANY THREE');
    cy.get(DOM_ELEMENTS.organisationAliasInput3).should('have.value', 'COMPANY FOUR');

    // Verify "Add another alias" button reappears since we're now under 5 aliases
    cy.get(DOM_ELEMENTS.addOrganisationAliasButton).should('exist');

    // AC2f - Test unchecking "Add aliases" checkbox clears all data and hides section
    cy.get(DOM_ELEMENTS.organisationAliasCheckbox).uncheck();

    // Re-check to verify all alias data has been wiped
    cy.get(DOM_ELEMENTS.organisationAliasCheckbox).check();
    cy.get(DOM_ELEMENTS.organisationAliasSection).should('be.visible');

    // Should only show Alias 1 with empty data
    cy.get(DOM_ELEMENTS.organisationAliasSection).should('contain', 'Alias 1');
    cy.get(DOM_ELEMENTS.organisationAliasSection).should('not.contain', 'Alias 2');
    cy.get(DOM_ELEMENTS.organisationAliasInput0).should('have.value', '');
    cy.get(DOM_ELEMENTS.removeOrganisationAliasButton).should('not.exist');
  });

  it('AC3. Required field validation for company mandatory fields', { tags: ['@PO-1111'] }, () => {
    const testMock = structuredClone(companyfullMock);
    testMock.defendant_account_party.party_details.organisation_details!.organisation_name = '';
    testMock.defendant_account_party.address!.address_line_1 = '';
    testMock.defendant_account_party.party_details.organisation_details!.organisation_aliases = [
      { alias_id: '1', sequence_number: 1, organisation_name: '' },
      { alias_id: '2', sequence_number: 2, organisation_name: '' },
    ];

    setupComponent('COMPANY', testMock);

    cy.get(DOM_ELEMENTS.organisationAliasCheckbox).check();
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Company details');

    // AC3a. Verify Company name error message
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ERROR_MESSAGES.REQUIRED_COMPANY_NAME);

    // AC3b. Verify Address Line 1 error message
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ERROR_MESSAGES.REQUIRED_ADDRESS_LINE_1);

    // AC3c. Verify Alias Company name error messages for each alias row
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ERROR_MESSAGES.REQUIRED_COMPANY_ALIAS(1));

    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ERROR_MESSAGES.REQUIRED_COMPANY_ALIAS(2));
    cy.get(DOM_ELEMENTS.errorSummaryList).find('li').should('have.length', 4);

    cy.get(DOM_ELEMENTS.organisationNameInput).type('Test Company Ltd');
    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummaryList).should('not.contain', ERROR_MESSAGES.REQUIRED_COMPANY_NAME);
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ERROR_MESSAGES.REQUIRED_ADDRESS_LINE_1);
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ERROR_MESSAGES.REQUIRED_COMPANY_ALIAS(1));
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ERROR_MESSAGES.REQUIRED_COMPANY_ALIAS(2));
    cy.get(DOM_ELEMENTS.errorSummaryList).find('li').should('have.length', 3);

    cy.get(DOM_ELEMENTS.addressLine1Input).type('123 Business Street');
    cy.get(DOM_ELEMENTS.submitButton).click();

    // Verify address error is gone but alias errors remain
    cy.get(DOM_ELEMENTS.errorSummaryList).should('not.contain', ERROR_MESSAGES.REQUIRED_ADDRESS_LINE_1);
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ERROR_MESSAGES.REQUIRED_COMPANY_ALIAS(1));
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ERROR_MESSAGES.REQUIRED_COMPANY_ALIAS(2));
    cy.get(DOM_ELEMENTS.errorSummaryList).find('li').should('have.length', 2);

    // Fix first alias
    cy.get(DOM_ELEMENTS.organisationAliasInput0).type('First Alias Company');
    cy.get(DOM_ELEMENTS.submitButton).click();

    // Verify first alias error is gone but second alias error remains
    cy.get(DOM_ELEMENTS.errorSummaryList).should('not.contain', ERROR_MESSAGES.REQUIRED_COMPANY_ALIAS(1));
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ERROR_MESSAGES.REQUIRED_COMPANY_ALIAS(2));
    cy.get(DOM_ELEMENTS.errorSummaryList).find('li').should('have.length', 1);

    // Fix second alias
    cy.get(DOM_ELEMENTS.organisationAliasInput1).type('Second Alias Company');
    cy.get(DOM_ELEMENTS.submitButton).click();

    // Verify all errors are gone
    cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');
  });

  it('AC4. Email format validation for company forms', { tags: ['@PO-1111'] }, () => {
    const testMock = structuredClone(companyfullMock);
    testMock.defendant_account_party.contact_details!.primary_email_address = 'invalid-email-no-at';
    testMock.defendant_account_party.contact_details!.secondary_email_address = 'missing-domain@';

    setupComponent('COMPANY', testMock);

    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Company details');

    // AC4a. Verify Primary email address error message
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ERROR_MESSAGES.FORMAT_EMAIL_PRIMARY);

    // AC4b. Verify Secondary email address error message
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ERROR_MESSAGES.FORMAT_EMAIL_SECONDARY);

    cy.get(DOM_ELEMENTS.email1Input).clear();
    cy.get(DOM_ELEMENTS.email2Input).clear();
    cy.get(DOM_ELEMENTS.submitButton).click();

    // Verify all errors are gone
    cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');
  });

  it('AC5a. Home telephone invalid format shows home telephone error for company', { tags: ['@PO-1111'] }, () => {
    const testMock = structuredClone(companyfullMock);
    testMock.defendant_account_party.contact_details!.home_telephone_number = '01632A960001'; // alpha char
    setupComponent('COMPANY', testMock);
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', ERROR_MESSAGES.FORMAT_PHONE_HOME);
  });

  it('AC5b. Work telephone invalid format shows work telephone error for company', { tags: ['@PO-1111'] }, () => {
    const testMock = structuredClone(companyfullMock);
    testMock.defendant_account_party.contact_details!.work_telephone_number = '01632-960-001X'; // invalid char X
    setupComponent('COMPANY', testMock);
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', ERROR_MESSAGES.FORMAT_PHONE_WORK);
  });

  it(
    'AC5c. Mobile telephone invalid length/format shows mobile telephone error for company',
    { tags: ['@PO-1111'] },
    () => {
      const testMock = structuredClone(companyfullMock);
      testMock.defendant_account_party.contact_details!.mobile_telephone_number = '0770090098'; // 10 digits (should be 11)
      setupComponent('COMPANY', testMock);
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', ERROR_MESSAGES.FORMAT_PHONE_MOBILE);
    },
  );

  it(
    'AC6. Max length validation for company forms retains user on form and shows per-field errors',
    { tags: ['@PO-1111'] },
    () => {
      const maxLengthCompanyMock = structuredClone(companyfullMock);

      // Set all fields to exceed max length using API structure
      maxLengthCompanyMock.defendant_account_party.party_details.organisation_details!.organisation_name = 'C'.repeat(
        51,
      );
      maxLengthCompanyMock.defendant_account_party.party_details.organisation_details!.organisation_aliases = [
        {
          alias_id: '1',
          sequence_number: 1,
          organisation_name: 'A'.repeat(21),
        },
        {
          alias_id: '2',
          sequence_number: 2,
          organisation_name: 'B'.repeat(21),
        },
      ];
      maxLengthCompanyMock.defendant_account_party.address!.address_line_1 = 'D'.repeat(31);
      maxLengthCompanyMock.defendant_account_party.address!.address_line_2 = 'E'.repeat(31);
      maxLengthCompanyMock.defendant_account_party.address!.address_line_3 = 'F'.repeat(17);
      maxLengthCompanyMock.defendant_account_party.address!.postcode = 'POSTCODE9';
      maxLengthCompanyMock.defendant_account_party.contact_details!.primary_email_address = `${'a'.repeat(65)}@example.com`;
      maxLengthCompanyMock.defendant_account_party.contact_details!.secondary_email_address = `${'a'.repeat(65)}@example.com`;
      maxLengthCompanyMock.defendant_account_party.vehicle_details!.vehicle_make_and_model = 'V'.repeat(31);
      maxLengthCompanyMock.defendant_account_party.vehicle_details!.vehicle_registration = 'R'.repeat(12);

      setupComponent('COMPANY', maxLengthCompanyMock);

      cy.get(DOM_ELEMENTS.submitButton).click();

      cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Company details');
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');

      COMPANY_MAX_LENGTH_ERRORS.forEach((message) => {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', message);
      });
    },
  );

  it(
    'AC7. Data type validation for alphabetical and alphanumeric fields in company forms',
    { tags: ['@PO-1111'] },
    () => {
      const dataTypeCompanyMock = structuredClone(companyfullMock);

      // Set all fields with invalid characters using API structure
      dataTypeCompanyMock.defendant_account_party.party_details.organisation_details!.organisation_name =
        'ABC Company Ltd @#$';
      dataTypeCompanyMock.defendant_account_party.party_details.organisation_details!.organisation_aliases = [
        {
          alias_id: '1',
          sequence_number: 1,
          organisation_name: 'Alias One Corp 123!',
        },
        {
          alias_id: '2',
          sequence_number: 2,
          organisation_name: 'Alias Two Ltd %^&',
        },
      ];
      // AC7b: Alphanumeric fields (letters, numbers, hyphens, spaces, apostrophes only)
      dataTypeCompanyMock.defendant_account_party.address!.address_line_1 = '123 Main St @#$';
      dataTypeCompanyMock.defendant_account_party.address!.address_line_2 = 'Suite 4B %^&';
      dataTypeCompanyMock.defendant_account_party.address!.address_line_3 = 'Building C *()+=';
      dataTypeCompanyMock.defendant_account_party.address!.postcode = 'M1& 1AA';
      dataTypeCompanyMock.defendant_account_party.vehicle_details!.vehicle_make_and_model = 'Mercedes Sprinter <>?/';
      dataTypeCompanyMock.defendant_account_party.vehicle_details!.vehicle_registration = 'ABC123~`';

      setupComponent('COMPANY', dataTypeCompanyMock);

      cy.get(DOM_ELEMENTS.submitButton).click();

      cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Company details');
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');

      // Verify all expected error messages appear
      COMPANY_ALL_DATA_TYPE_ERRORS.forEach((message) => {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', message);
      });
    },
  );

  it(
    'AC1. The "Defendant Details (Change)" screen will be built for a non-paying adult or youth with all fields populated',
    { tags: ['@PO-2315'] },
    () => {
      // Create a non-paying adult/youth defendant mock
      const nonPayingAdultYouthMock = structuredClone(fullMock);
      nonPayingAdultYouthMock.defendant_account_party.defendant_account_party_type = 'ADULT_YOUTH_ONLY';
      nonPayingAdultYouthMock.defendant_account_party.is_debtor = false;

      setupComponent('INDIVIDUAL', nonPayingAdultYouthMock);

      cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Defendant details');

      // Verify title dropdown options
      cy.get(DOM_ELEMENTS.titleSelect).should('exist');
      cy.get(DOM_ELEMENTS.titleSelect).find('option').should('contain', 'Mr');
      cy.get(DOM_ELEMENTS.titleSelect).find('option').should('contain', 'Mrs');
      cy.get(DOM_ELEMENTS.titleSelect).find('option').should('contain', 'Miss');
      cy.get(DOM_ELEMENTS.titleSelect).find('option').should('contain', 'Ms');

      cy.get(DOM_ELEMENTS.forenamesInput).should('exist');
      cy.get(DOM_ELEMENTS.forenamesLabel).should('contain', 'First names');
      cy.get(DOM_ELEMENTS.forenamesHint).should('contain', 'Include their middle names');
      cy.get(DOM_ELEMENTS.forenamesInput).should('have.value', 'John');

      cy.get(DOM_ELEMENTS.surnameInput).should('exist');
      cy.get(DOM_ELEMENTS.surnameLabel).should('contain', 'Last name');
      cy.get(DOM_ELEMENTS.surnameInput).should('have.value', 'Doe');

      // Add aliases checkbox - should be ticked by default when mock data has aliases
      cy.get(DOM_ELEMENTS.aliasCheckbox).should('exist');
      cy.get(DOM_ELEMENTS.aliasCheckbox).should('be.checked');

      // Alias section should be visible when checkbox is checked
      cy.get(DOM_ELEMENTS.aliasSection).should('exist');

      // Verify first alias from mock data (Johnny Smith)
      cy.get(DOM_ELEMENTS.aliasForenamesInput).should('have.value', 'Johnny');
      cy.get(DOM_ELEMENTS.aliasSurnameInput).should('have.value', 'Smith');

      // Verify second alias from mock data (Jon Johnson)
      cy.get(DOM_ELEMENTS.aliasForenamesInput1).should('have.value', 'Jon');
      cy.get(DOM_ELEMENTS.aliasSurnameInput1).should('have.value', 'Johnson');

      // Verify third alias from mock data (Test Smith)
      cy.get(DOM_ELEMENTS.aliasForenamesInput2).should('have.value', 'Test');
      cy.get(DOM_ELEMENTS.aliasSurnameInput2).should('have.value', 'Smith');

      // Verify Fourth alias from mock data (Test Smith2)
      cy.get(DOM_ELEMENTS.aliasForenamesInput3).should('have.value', 'Test');
      cy.get(DOM_ELEMENTS.aliasSurnameInput3).should('have.value', 'Smith');

      // Verify Fifth alias from mock data (Test Smith3)
      cy.get(DOM_ELEMENTS.aliasForenamesInput4).should('have.value', 'Test');
      cy.get(DOM_ELEMENTS.aliasSurnameInput4).should('have.value', 'Smith');

      // Date of birth
      cy.get(DOM_ELEMENTS.dobInput).should('exist');
      cy.get(DOM_ELEMENTS.dobLabel).should('contain', 'Date of birth');
      cy.get(DOM_ELEMENTS.dobInput).should('have.value', '01/01/1990');

      // Age display should show calculated age from DOB in mock data
      const dateService = new DateService();
      const dob = nonPayingAdultYouthMock.defendant_account_party.party_details.individual_details!.date_of_birth ?? '';
      const expectedAge = dateService.calculateAge(dob, 'dd/MM/yyyy');
      const expectedAgeGroup = dateService.getAgeObject(dob)?.group ?? '';

      cy.get(DOM_ELEMENTS.ageDisplay).should('exist');
      cy.get(DOM_ELEMENTS.ageValue).should('contain', `Age: ${expectedAge}`);
      cy.get(DOM_ELEMENTS.ageGroup).should('contain', expectedAgeGroup);

      // National Insurance number
      cy.get(DOM_ELEMENTS.niNumberInput).should('exist');
      cy.get(DOM_ELEMENTS.niNumberLabel).should('contain', 'National Insurance number');
      cy.get(DOM_ELEMENTS.niNumberInput).should('have.value', 'AB123456C');

      // Address Section
      cy.get(DOM_ELEMENTS.addressFieldset).should('exist');
      cy.get(DOM_ELEMENTS.addressLegend).should('contain', 'Address');

      cy.get(DOM_ELEMENTS.addressLine1Input).should('exist');
      cy.get(DOM_ELEMENTS.addressLine1Label).should('contain', 'Address line 1');
      cy.get(DOM_ELEMENTS.addressLine1Input).should('have.value', '123 Test Street');

      cy.get(DOM_ELEMENTS.addressLine2Input).should('exist');
      cy.get(DOM_ELEMENTS.addressLine2Label).should('contain', 'Address line 2');
      cy.get(DOM_ELEMENTS.addressLine2Input).should('have.value', 'Second Floor');

      cy.get(DOM_ELEMENTS.addressLine3Input).should('exist');
      cy.get(DOM_ELEMENTS.addressLine3Label).should('contain', 'Address line 3');
      cy.get(DOM_ELEMENTS.addressLine3Input).should('have.value', 'City Center');

      cy.get(DOM_ELEMENTS.postcodeInput).should('exist');
      cy.get(DOM_ELEMENTS.postcodeLabel).should('contain', 'Postcode');
      cy.get(DOM_ELEMENTS.postcodeInput).should('have.value', 'TE5T 1NG');

      // Contact Details, Vehicle Details, and Employer Details should NOT be present for non-paying defendants
      cy.get(DOM_ELEMENTS.contactFieldset).should('not.exist');
      cy.get(DOM_ELEMENTS.vehicleFieldset).should('not.exist');
      cy.get(DOM_ELEMENTS.employerFieldset).should('not.exist');
      cy.get(DOM_ELEMENTS.employerAddressFieldset).should('not.exist');
      cy.get(DOM_ELEMENTS.languagePreferencesFieldset).should('not.exist');

      // Form Actions
      cy.get(DOM_ELEMENTS.submitButton).should('exist').should('contain', 'Save changes');
      cy.get(DOM_ELEMENTS.cancelButton).should('exist');
    },
  );

  it(
    'AC1a. Should show alias checkbox unticked when no aliases exist in data for non-paying defendant',
    { tags: ['@PO-2315'] },
    () => {
      const nonPayingMinimalMock = structuredClone(minimalMock);
      nonPayingMinimalMock.defendant_account_party.defendant_account_party_type = 'ADULT_YOUTH_ONLY';
      nonPayingMinimalMock.defendant_account_party.is_debtor = false;

      setupComponent('INDIVIDUAL', nonPayingMinimalMock);

      // Add aliases checkbox should be unticked when no aliases in mock data
      cy.get(DOM_ELEMENTS.aliasCheckbox).should('exist');
      cy.get(DOM_ELEMENTS.aliasCheckbox).should('not.be.checked');

      // Alias section should not be visible when checkbox is unchecked
      cy.get(DOM_ELEMENTS.aliasSection).should('not.exist');
    },
  );

  it('AC2. Alias add/remove and clear behaviour for non-paying defendant', { tags: ['@PO-2315'] }, () => {
    const nonPayingMinimalMock = structuredClone(minimalMock);
    nonPayingMinimalMock.defendant_account_party.defendant_account_party_type = 'ADULT_YOUTH_ONLY';
    nonPayingMinimalMock.defendant_account_party.is_debtor = false;

    setupComponent('INDIVIDUAL', nonPayingMinimalMock);

    // Pre-condition: checkbox unchecked & section hidden
    cy.get(DOM_ELEMENTS.aliasCheckbox).should('not.be.checked');
    cy.get(DOM_ELEMENTS.aliasSection).should('not.exist');

    // AC2: Tick the Add aliases checkbox
    cy.get(DOM_ELEMENTS.aliasCheckbox).check({ force: true }).should('be.checked');
    cy.get(DOM_ELEMENTS.aliasSection).should('exist');

    // AC2a: Subheading 'Alias 1' displayed
    cy.contains('legend', 'Alias 1').should('exist').and('have.class', 'govuk-fieldset__legend');

    // AC2b: Two free text boxes with titles First names / Last name for Alias 1
    cy.get(DOM_ELEMENTS.aliasForenamesInput).should('exist').and('have.value', '');
    cy.get(DOM_ELEMENTS.aliasSurnameInput).should('exist').and('have.value', '');
    cy.get(DOM_ELEMENTS.aliasForenamesLabel).should('contain', 'First names');
    cy.get(DOM_ELEMENTS.aliasSurnameLabel).should('contain', 'Last name');

    // Enter some data to later verify clearing behaviour (AC2f)
    cy.get(DOM_ELEMENTS.aliasForenamesInput).type('Alpha');
    cy.get(DOM_ELEMENTS.aliasSurnameInput).type('One');

    // AC2c: Grey 'Add another alias' button displayed
    cy.get(DOM_ELEMENTS.addAliasButton).should('exist').and('contain', 'Add another alias');

    // Helper to add alias and assert its presence
    const addAliasAndAssert = (aliasNumber: number) => {
      cy.get(DOM_ELEMENTS.addAliasButton).click();
      cy.contains('legend', `Alias ${aliasNumber}`).should('exist');
      const index = aliasNumber - 1;
      cy.get(getAliasForenamesInput(index)).should('exist');
      cy.get(getAliasSurnameInput(index)).should('exist');
    };

    // AC2d / AC2di: Add aliases 2 through 5 incrementally
    addAliasAndAssert(2);
    cy.get('a.govuk-link').contains('Remove').should('exist'); // remove link appears when >1 alias
    addAliasAndAssert(3);
    addAliasAndAssert(4);
    addAliasAndAssert(5);

    // AC2dii: Once 5 alias rows added, add button disappears
    cy.get(DOM_ELEMENTS.addAliasButton).should('not.exist');

    // AC2e / AC2ei: Remove link present (for >1 alias) & not within Alias 1 fieldset
    cy.get('a.govuk-link').contains('Remove').should('exist');
    cy.contains('legend', 'Alias 1')
      .parent('fieldset')
      .within(() => {
        cy.contains('Remove').should('not.exist');
      });

    // AC2eii: Remove last alias (Alias 5). Expect Alias 5 legend to disappear & button reappear
    cy.get('a.govuk-link').contains('Remove').click();
    cy.contains('legend', 'Alias 5').should('not.exist');
    cy.get(DOM_ELEMENTS.addAliasButton).should('exist');

    // Add back up to 5 to demonstrate cap again
    addAliasAndAssert(5);
    cy.get(DOM_ELEMENTS.addAliasButton).should('not.exist');

    // AC2f: Untick Add aliases checkbox hides & wipes alias data
    cy.get(DOM_ELEMENTS.aliasCheckbox).uncheck({ force: true }).should('not.be.checked');
    cy.get(DOM_ELEMENTS.aliasSection).should('not.exist');

    // Re-check and ensure a fresh empty Alias 1 row (data wiped)
    cy.get(DOM_ELEMENTS.aliasCheckbox).check({ force: true }).should('be.checked');
    cy.get(DOM_ELEMENTS.aliasSection).should('exist');
    cy.get(DOM_ELEMENTS.aliasForenamesInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.aliasSurnameInput).should('have.value', '');
  });

  it('AC5. Required field validation (core) for non-paying defendant', { tags: ['@PO-2315'] }, () => {
    const nonPayingEmptyCoreMock = structuredClone(minimalMock);
    nonPayingEmptyCoreMock.defendant_account_party.defendant_account_party_type = 'ADULT_YOUTH_ONLY';
    nonPayingEmptyCoreMock.defendant_account_party.is_debtor = false;
    // Clear required fields to trigger validation
    nonPayingEmptyCoreMock.defendant_account_party.party_details.individual_details!.title = null;
    nonPayingEmptyCoreMock.defendant_account_party.party_details.individual_details!.forenames = '';
    nonPayingEmptyCoreMock.defendant_account_party.party_details.individual_details!.surname = '';
    nonPayingEmptyCoreMock.defendant_account_party.address.address_line_1 = '';

    setupComponent('INDIVIDUAL', nonPayingEmptyCoreMock);

    // Pre-condition: no error summary
    cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');

    // Ensure mandatory fields are empty
    cy.get(DOM_ELEMENTS.titleSelect).should('have.value', null);
    cy.get(DOM_ELEMENTS.forenamesInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.surnameInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.addressLine1Input).should('have.value', '');

    // Submit to trigger validation
    cy.get(DOM_ELEMENTS.submitButton).click();

    // AC5a, AC5b, AC5c, AC5d: Required field error messages for non-paying defendant
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    INDIVIDUAL_REQUIRED_MESSAGES.forEach((msg) => {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', msg);
    });
  });

  it(
    'AC5h, AC5i, AC5j. Required field validation for all alias rows (N=1 to 5) for non-paying defendant',
    { tags: ['@PO-2315'] },
    () => {
      const nonPayingMinimalMock = structuredClone(minimalMock);
      nonPayingMinimalMock.defendant_account_party.defendant_account_party_type = 'ADULT_YOUTH_ONLY';
      nonPayingMinimalMock.defendant_account_party.is_debtor = false;

      setupComponent('INDIVIDUAL', nonPayingMinimalMock);
      cy.get(DOM_ELEMENTS.aliasCheckbox).check({ force: true }).should('be.checked');
      cy.get(DOM_ELEMENTS.aliasSection).should('exist');

      for (let i = 2; i <= 5; i++) {
        cy.get(DOM_ELEMENTS.addAliasButton).click();
        cy.contains('legend', `Alias ${i}`).should('exist');
      }
      cy.get(DOM_ELEMENTS.addAliasButton).should('not.exist');

      cy.get(DOM_ELEMENTS.submitButton).click();

      // AC5h: Verify all alias first name and last name required errors appear
      for (let aliasNumber = 1; aliasNumber <= 5; aliasNumber++) {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', ERROR_MESSAGES.REQUIRED_ALIAS_FORENAMES(aliasNumber));
        cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', ERROR_MESSAGES.REQUIRED_ALIAS_SURNAME(aliasNumber));
      }

      // AC5i: Test partial completion - fill only first names, leave last names empty
      for (let aliasIndex = 0; aliasIndex < 5; aliasIndex++) {
        cy.get(getAliasForenamesInput(aliasIndex))
          .clear()
          .type(`FirstName${aliasIndex + 1}`, { delay: 0 });
      }

      cy.get(DOM_ELEMENTS.submitButton).click();

      for (let aliasNumber = 1; aliasNumber <= 5; aliasNumber++) {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', ERROR_MESSAGES.REQUIRED_ALIAS_SURNAME(aliasNumber));
      }

      for (let aliasNumber = 1; aliasNumber <= 5; aliasNumber++) {
        cy.get(DOM_ELEMENTS.errorSummary).should(
          'not.contain.text',
          ERROR_MESSAGES.REQUIRED_ALIAS_FORENAMES(aliasNumber),
        );
      }

      // AC5j: Test partial completion - clear first names, fill only last names
      for (let aliasIndex = 0; aliasIndex < 5; aliasIndex++) {
        cy.get(getAliasForenamesInput(aliasIndex)).clear();
        cy.get(getAliasSurnameInput(aliasIndex))
          .clear()
          .type(`LastName${aliasIndex + 1}`, { delay: 0 });
      }

      cy.get(DOM_ELEMENTS.submitButton).click();

      for (let aliasNumber = 1; aliasNumber <= 5; aliasNumber++) {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', ERROR_MESSAGES.REQUIRED_ALIAS_FORENAMES(aliasNumber));
      }

      for (let aliasNumber = 1; aliasNumber <= 5; aliasNumber++) {
        cy.get(DOM_ELEMENTS.errorSummary).should(
          'not.contain.text',
          ERROR_MESSAGES.REQUIRED_ALIAS_SURNAME(aliasNumber),
        );
      }
    },
  );

  it(
    'AC6a. DOB with non-numerical characters shows format error for non-paying defendant',
    { tags: ['@PO-2315'] },
    () => {
      const nonPayingMinimalMock = structuredClone(minimalMock);
      nonPayingMinimalMock.defendant_account_party.defendant_account_party_type = 'ADULT_YOUTH_ONLY';
      nonPayingMinimalMock.defendant_account_party.is_debtor = false;
      nonPayingMinimalMock.defendant_account_party.party_details.individual_details!.date_of_birth = 'AA/BB/CCCC';

      setupComponent('INDIVIDUAL', nonPayingMinimalMock);

      cy.get(DOM_ELEMENTS.submitButton).click();

      cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', ERROR_MESSAGES.FORMAT_DOB_INVALID);
    },
  );

  it('AC6b. DOB in the future shows past-date error for non-paying defendant', { tags: ['@PO-2315'] }, () => {
    const nonPayingMinimalMock = structuredClone(minimalMock);
    nonPayingMinimalMock.defendant_account_party.defendant_account_party_type = 'ADULT_YOUTH_ONLY';
    nonPayingMinimalMock.defendant_account_party.is_debtor = false;
    nonPayingMinimalMock.defendant_account_party.party_details.individual_details!.date_of_birth = '01/01/2099';

    setupComponent('INDIVIDUAL', nonPayingMinimalMock);

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', ERROR_MESSAGES.FORMAT_DOB_FUTURE);
  });

  it('AC6c. NI number invalid format shows NI format error for non-paying defendant', { tags: ['@PO-2315'] }, () => {
    const nonPayingMinimalMock = structuredClone(minimalMock);
    nonPayingMinimalMock.defendant_account_party.defendant_account_party_type = 'ADULT_YOUTH_ONLY';
    nonPayingMinimalMock.defendant_account_party.is_debtor = false;
    nonPayingMinimalMock.defendant_account_party.party_details.individual_details!.national_insurance_number = '12345';

    setupComponent('INDIVIDUAL', nonPayingMinimalMock);

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', ERROR_MESSAGES.FORMAT_NI_NUMBER);
  });

  it(
    'AC7. Max length validation retains user on form and shows per-field errors for non-paying defendant',
    { tags: ['@PO-2315'] },
    () => {
      const nonPayingMaxLengthMock = structuredClone(minimalMock);
      nonPayingMaxLengthMock.defendant_account_party.defendant_account_party_type = 'ADULT_YOUTH_ONLY';
      nonPayingMaxLengthMock.defendant_account_party.is_debtor = false;

      // Set up data with values exceeding max length
      nonPayingMaxLengthMock.defendant_account_party.party_details.individual_details!.forenames = 'A'.repeat(21);
      nonPayingMaxLengthMock.defendant_account_party.party_details.individual_details!.surname = 'B'.repeat(31);
      nonPayingMaxLengthMock.defendant_account_party.party_details.individual_details!.individual_aliases = [
        {
          alias_id: '1',
          sequence_number: 1,
          forenames: 'C'.repeat(21),
          surname: 'D'.repeat(31),
        },
      ];
      nonPayingMaxLengthMock.defendant_account_party.party_details.individual_details!.national_insurance_number =
        'AB123456CD';
      nonPayingMaxLengthMock.defendant_account_party.address!.address_line_1 = 'E'.repeat(31);
      nonPayingMaxLengthMock.defendant_account_party.address!.address_line_2 = 'F'.repeat(31);
      nonPayingMaxLengthMock.defendant_account_party.address!.address_line_3 = 'G'.repeat(17);
      nonPayingMaxLengthMock.defendant_account_party.address!.postcode = 'POSTCODE9';

      setupComponent('INDIVIDUAL', nonPayingMaxLengthMock);

      cy.get(DOM_ELEMENTS.submitButton).click();

      cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Defendant details');
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');

      NON_PAYING_MAX_LENGTH_ERRORS.forEach((message) => {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', message);
      });
    },
  );

  it(
    'AC9. Data type validation for alphabetical and alphanumeric fields for non-paying defendant',
    { tags: ['@PO-2315'] },
    () => {
      const nonPayingDataTypeValidationMock = structuredClone(minimalMock);
      nonPayingDataTypeValidationMock.defendant_account_party.defendant_account_party_type = 'ADULT_YOUTH_ONLY';
      nonPayingDataTypeValidationMock.defendant_account_party.is_debtor = false;

      // Set up data with invalid characters for validation testing
      nonPayingDataTypeValidationMock.defendant_account_party.party_details.individual_details!.forenames = 'John123';
      nonPayingDataTypeValidationMock.defendant_account_party.party_details.individual_details!.surname = 'Doe@Smith';
      nonPayingDataTypeValidationMock.defendant_account_party.party_details.individual_details!.individual_aliases = [
        {
          alias_id: '1',
          sequence_number: 1,
          forenames: 'Johnny$',
          surname: 'Smith#Brown',
        },
      ];
      nonPayingDataTypeValidationMock.defendant_account_party.address!.address_line_1 = '123 Main St @#$';
      nonPayingDataTypeValidationMock.defendant_account_party.address!.address_line_2 = 'Apt 4B %^&';
      nonPayingDataTypeValidationMock.defendant_account_party.address!.address_line_3 = 'Building C *()+=';
      nonPayingDataTypeValidationMock.defendant_account_party.address!.postcode = 'M1& 1AA';

      setupComponent('INDIVIDUAL', nonPayingDataTypeValidationMock);

      cy.get(DOM_ELEMENTS.submitButton).click();

      cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Defendant details');
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');

      // Verify all expected error messages appear
      NON_PAYING_ALL_DATA_TYPE_ERRORS.forEach((message) => {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', message);
      });
    },
  );
});
