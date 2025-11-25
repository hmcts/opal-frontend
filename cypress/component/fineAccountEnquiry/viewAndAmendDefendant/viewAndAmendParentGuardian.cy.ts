import { mount } from 'cypress/angular';
import { ActivatedRoute } from '@angular/router';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { FinesAccPartyAddAmendConvert } from 'src/app/flows/fines/fines-acc/fines-acc-party-add-amend-convert/fines-acc-party-add-amend-convert.component';
import {
  DOM_ELEMENTS,
  getAliasForenamesInput,
  getAliasSurnameInput,
  getFieldErrorFor,
} from '../../../shared/selectors/accountEnquiriesViewDetails.locators';
import {
  coreRequiredMessages,
  expectedErrors,
  allExpectedErrors,
} from '../../../shared/errorMessages/accountEnquiriesViewDetails.errorMessages';
import {
  VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_FULL_MOCK,
  VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_MINIMAL_MOCK,
} from './mocks/viewAndAmendDefendant-api.mock';
import { MOCK_FINES_ACCOUNT_STATE } from 'src/app/flows/fines/fines-acc/mocks/fines-acc-state.mock';
import { IOpalFinesAccountDefendantAccountParty } from 'src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';

describe('FinesAccPartyAddAmendConvert - View and Amend Parent or Guardian', () => {
  let fullMock: IOpalFinesAccountDefendantAccountParty;
  let minimalMock: IOpalFinesAccountDefendantAccountParty;

  beforeEach(() => {
    fullMock = structuredClone(VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_FULL_MOCK);
    minimalMock = structuredClone(VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_MINIMAL_MOCK);
  });
  const setupComponent = (
    partyType: string,
    formData: IOpalFinesAccountDefendantAccountParty,
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
            state.account_number = 'ACC135790';
            state.party_name = 'Heather Dale';
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
                partyAddAmendConvertData: formData,
              },
              params: {
                partyType: partyType,
              },
            },
          },
        },
      ],
    });
  };

  it(
    'AC1a. The "Parent Guardian Details (Change)" screen will be built as per the design artefacts provided with aliases in mock data',
    { tags: ['@PO-1112'] },
    () => {
      setupComponent('parentGuardian', fullMock);

      cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Parent or guardian details');

      cy.get(DOM_ELEMENTS.titleSelect).should('not.exist');
      cy.get(DOM_ELEMENTS.forenamesInput).should('exist');
      cy.get(DOM_ELEMENTS.forenamesLabel).should('contain', 'First names');
      cy.get(DOM_ELEMENTS.forenamesHint).should('contain', 'Include their middle names');

      cy.get(DOM_ELEMENTS.surnameInput).should('exist');
      cy.get(DOM_ELEMENTS.surnameLabel).should('contain', 'Last name');

      cy.get(DOM_ELEMENTS.aliasCheckbox).should('exist');
      cy.get(DOM_ELEMENTS.aliasCheckbox).should('be.checked');
      cy.get(DOM_ELEMENTS.aliasSection).should('exist');

      cy.get(DOM_ELEMENTS.aliasForenamesInput).should('have.value', 'Johnny');
      cy.get(DOM_ELEMENTS.aliasSurnameInput).should('have.value', 'Smith');
      cy.get(DOM_ELEMENTS.aliasForenamesInput1).should('have.value', 'Jon');
      cy.get(DOM_ELEMENTS.aliasSurnameInput1).should('have.value', 'Johnson');
      cy.get(DOM_ELEMENTS.aliasForenamesInput2).should('have.value', 'Test');
      cy.get(DOM_ELEMENTS.aliasSurnameInput2).should('have.value', 'Smith');
      cy.get(DOM_ELEMENTS.aliasForenamesInput3).should('have.value', 'Test');
      cy.get(DOM_ELEMENTS.aliasSurnameInput3).should('have.value', 'Smith2');
      cy.get(DOM_ELEMENTS.aliasForenamesInput4).should('have.value', 'Test');
      cy.get(DOM_ELEMENTS.aliasSurnameInput4).should('have.value', 'Smith3');

      cy.get(DOM_ELEMENTS.dobInput).should('exist');
      cy.get(DOM_ELEMENTS.dobLabel).should('contain', 'Date of birth');

      const dateService = new DateService();
      const dob = fullMock.defendant_account_party.party_details.individual_details!.date_of_birth ?? '';
      const expectedAge = dateService.calculateAge(dob, 'dd/MM/yyyy');
      const expectedAgeGroup = dateService.getAgeObject(dob)?.group ?? '';

      cy.get(DOM_ELEMENTS.ageDisplay).should('exist');
      cy.get(DOM_ELEMENTS.ageValue).should('contain', `Age: ${expectedAge}`);
      cy.get(DOM_ELEMENTS.ageGroup).should('contain', expectedAgeGroup);

      cy.get(DOM_ELEMENTS.niNumberInput).should('exist');
      cy.get(DOM_ELEMENTS.niNumberLabel).should('contain', 'National Insurance number');
      cy.get(DOM_ELEMENTS.niNumberInput).should('have.value', 'AB123456C');

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

      cy.get(DOM_ELEMENTS.vehicleFieldset).should('exist');
      cy.get(DOM_ELEMENTS.vehicleLegend).should('contain', 'Vehicle details');

      cy.get(DOM_ELEMENTS.vehicleMakeInput).should('exist');
      cy.get(DOM_ELEMENTS.vehicleMakeLabel).should('contain', 'Make and model');
      cy.get(DOM_ELEMENTS.vehicleMakeInput).should('have.value', 'Toyota Corolla');

      cy.get(DOM_ELEMENTS.vehicleRegistrationInput).should('exist');
      cy.get(DOM_ELEMENTS.vehicleRegistrationLabel).should('contain', 'Registration number');
      cy.get(DOM_ELEMENTS.vehicleRegistrationInput).should('have.value', 'ABC123');

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

      cy.get(DOM_ELEMENTS.languagePreferencesFieldset).should('not.exist');

      cy.get(DOM_ELEMENTS.submitButton).should('exist').should('contain', 'Save changes');
      cy.get(DOM_ELEMENTS.cancelButton).should('exist');
    },
  );

  it(
    'AC1a. Parent/Guardian - Should show alias checkbox unticked when no aliases exist in data',
    { tags: ['@PO-1112'] },
    () => {
      setupComponent('parentGuardian', minimalMock);

      cy.get(DOM_ELEMENTS.aliasCheckbox).should('exist');
      cy.get(DOM_ELEMENTS.aliasCheckbox).should('not.be.checked');
      cy.get(DOM_ELEMENTS.aliasSection).should('not.exist');
    },
  );

  it(
    'AC1a. Parent/Guardian - Language preferences should appear for Welsh speaking business units',
    { tags: ['@PO-1112'] },
    () => {
      setupComponent('parentGuardian', fullMock, 'Y');

      cy.get(DOM_ELEMENTS.languagePreferencesFieldset).should('exist');
      cy.get(DOM_ELEMENTS.languagePreferencesLegend).should('contain', 'Language preferences');
      cy.get(DOM_ELEMENTS.documentLanguageFieldset).should('exist');
      cy.get(DOM_ELEMENTS.documentLanguageLegend).should('contain', 'Documents');
      cy.get(DOM_ELEMENTS.hearingLanguageFieldset).should('exist');
      cy.get(DOM_ELEMENTS.hearingLanguageLegend).should('contain', 'Court hearings');
    },
  );

  it('AC2. Parent/Guardian - Alias add/remove and clear behaviour', { tags: ['@PO-1112'] }, () => {
    setupComponent('parentGuardian', minimalMock);

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

  it('AC5. Parent/Guardian - Required field validation (core)', { tags: ['@PO-1112'] }, () => {
    const emptyCoreMock = structuredClone(minimalMock);
    emptyCoreMock.defendant_account_party.party_details.individual_details!.title = '';
    emptyCoreMock.defendant_account_party.party_details.individual_details!.forenames = '';
    emptyCoreMock.defendant_account_party.party_details.individual_details!.surname = '';
    emptyCoreMock.defendant_account_party.address!.address_line_1 = '';

    setupComponent('parentGuardian', emptyCoreMock);

    cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');

    cy.get(DOM_ELEMENTS.forenamesInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.surnameInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.addressLine1Input).should('have.value', '');

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');

    // Verify parent/guardian specific error messages
    coreRequiredMessages.forEach((msg) => {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', msg);
    });

    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain.text', 'Enter employer name');
    cy.get(DOM_ELEMENTS.errorSummary).should(
      'not.contain.text',
      'Enter employee reference or National Insurance number',
    );
  });

  it('AC5. Parent/Guardian - Required field validation (employer name)', { tags: ['@PO-1112'] }, () => {
    const testMock = structuredClone(minimalMock);
    testMock.defendant_account_party.employer_details!.employer_name = 'Quality Corp';
    setupComponent('parentGuardian', testMock);

    cy.get(DOM_ELEMENTS.submitButton).click();
    const employerRequiredMessages = [
      'Enter employee reference or National Insurance number',
      'Enter address line 1, typically the building and street',
    ];

    employerRequiredMessages.forEach((msg) => {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', msg);
    });
  });

  it('AC5. Parent/Guardian - Required field validation (employer address)', { tags: ['@PO-1112'] }, () => {
    const testMock = structuredClone(minimalMock);
    testMock.defendant_account_party.employer_details!.employer_address!.address_line_1 = '123 Office Park';
    setupComponent('parentGuardian', testMock);

    cy.get(DOM_ELEMENTS.submitButton).click();
    const employerRequiredMessages = ['Enter employee reference or National Insurance number', 'Enter employer name'];

    employerRequiredMessages.forEach((msg) => {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', msg);
    });
  });

  it('AC5. Parent/Guardian - Required field validation (employer reference number)', { tags: ['@PO-1112'] }, () => {
    const testMock = structuredClone(minimalMock);
    testMock.defendant_account_party.employer_details!.employer_reference = 'Empref123';
    setupComponent('parentGuardian', testMock);

    cy.get(DOM_ELEMENTS.submitButton).click();
    const employerRequiredMessages = ['Enter address line 1, typically the building and street', 'Enter employer name'];

    employerRequiredMessages.forEach((msg) => {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', msg);
    });
  });

  it(
    'AC5h, AC5i, AC5j. Parent/Guardian - Required field validation for all alias rows (N=1 to 5)',
    { tags: ['@PO-1112'] },
    () => {
      setupComponent('parentGuardian', minimalMock);
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
        cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', `Enter alias ${aliasNumber} first name(s)`);
        cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', `Enter alias ${aliasNumber} last name`);
      }

      // AC5i: Test partial completion - fill only first names, leave last names empty
      for (let aliasIndex = 0; aliasIndex < 5; aliasIndex++) {
        cy.get(getAliasForenamesInput(aliasIndex))
          .clear()
          .type(`FirstName${aliasIndex + 1}`, { delay: 0 });
      }

      cy.get(DOM_ELEMENTS.submitButton).click();

      for (let aliasNumber = 1; aliasNumber <= 5; aliasNumber++) {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', `Enter alias ${aliasNumber} last name`);
      }

      for (let aliasNumber = 1; aliasNumber <= 5; aliasNumber++) {
        cy.get(DOM_ELEMENTS.errorSummary).should('not.contain.text', `Enter alias ${aliasNumber} first name(s)`);
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
        cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', `Enter alias ${aliasNumber} first name(s)`);
      }

      for (let aliasNumber = 1; aliasNumber <= 5; aliasNumber++) {
        cy.get(DOM_ELEMENTS.errorSummary).should('not.contain.text', `Enter alias ${aliasNumber} last name`);
      }
    },
  );

  it('AC6a. Parent/Guardian - DOB with non-numerical characters shows format error', { tags: ['@PO-1112'] }, () => {
    const testMock = structuredClone(minimalMock);
    testMock.defendant_account_party.party_details.individual_details!.date_of_birth = '!5/02/1980';
    setupComponent('parentGuardian', testMock);

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain.text', 'Enter date of birth in the format DD/MM/YYYY');
  });

  it('AC6b. Parent/Guardian - DOB in the future shows past-date error', { tags: ['@PO-1112'] }, () => {
    const testMock = structuredClone(minimalMock);
    testMock.defendant_account_party.party_details.individual_details!.date_of_birth = '01/01/2099';
    setupComponent('parentGuardian', testMock);

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', 'Enter a valid date of birth in the past');
  });

  it('AC6c. Parent/Guardian - NI number invalid format shows NI format error', { tags: ['@PO-1112'] }, () => {
    const testMock = structuredClone(minimalMock);
    testMock.defendant_account_party.party_details.individual_details!.national_insurance_number = '12AB3';
    setupComponent('parentGuardian', testMock);

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain.text', 'Enter a National Insurance number in the format AANNNNNNA');
  });

  it(
    'AC7a. Parent/Guardian - Primary email invalid format shows primary email format error',
    { tags: ['@PO-1112'] },
    () => {
      const testMock = structuredClone(minimalMock);
      testMock.defendant_account_party.contact_details!.primary_email_address = 'invalid_email';
      setupComponent('parentGuardian', testMock);

      cy.get(DOM_ELEMENTS.submitButton).click();

      cy.get(DOM_ELEMENTS.errorSummary)
        .should('exist')
        .and('contain.text', 'Enter primary email address in the correct format, like name@example.com');
    },
  );

  it(
    'AC7b. Parent/Guardian - Secondary email invalid format shows secondary email format error',
    { tags: ['@PO-1112'] },
    () => {
      const testMock = structuredClone(minimalMock);
      testMock.defendant_account_party.contact_details!.secondary_email_address = 'wrong.secondemail';
      setupComponent('parentGuardian', testMock);

      cy.get(DOM_ELEMENTS.submitButton).click();

      cy.get(DOM_ELEMENTS.errorSummary)
        .should('exist')
        .and('contain.text', 'Enter secondary email address in the correct format, like name@example.com');
    },
  );

  it(
    'AC7c. Parent/Guardian - Employer email invalid format shows employer email format error',
    { tags: ['@PO-1112'] },
    () => {
      const testMock = structuredClone(minimalMock);
      testMock.defendant_account_party.employer_details!.employer_email_address = 'employer#email@gmail.com';
      setupComponent('parentGuardian', testMock);

      cy.get(DOM_ELEMENTS.submitButton).click();

      cy.get(DOM_ELEMENTS.errorSummary)
        .should('exist')
        .and('contain.text', 'Enter employer email address in the correct format, like name@example.com');
    },
  );

  it('AC8a. Parent/Guardian - Home telephone invalid format shows home telephone error', { tags: ['@PO-1112'] }, () => {
    const testMock = structuredClone(minimalMock);
    testMock.defendant_account_party.contact_details!.home_telephone_number = '0207A214875';
    setupComponent('parentGuardian', testMock);
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain.text', 'Enter a valid home telephone number, like 01632 960 001');
  });

  it('AC8b. Parent/Guardian - Work telephone invalid format shows work telephone error', { tags: ['@PO-1112'] }, () => {
    const testMock = structuredClone(minimalMock);
    testMock.defendant_account_party.contact_details!.work_telephone_number = '01632-960-001A';
    setupComponent('parentGuardian', testMock);
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain.text', 'Enter a valid work telephone number, like 01632 960 001 or 07700 900 982');
  });

  it(
    'AC8c. Parent/Guardian - Mobile telephone invalid length/format shows mobile telephone error',
    { tags: ['@PO-1112'] },
    () => {
      const testMock = structuredClone(minimalMock);
      testMock.defendant_account_party.contact_details!.mobile_telephone_number = '0207821734';
      setupComponent('parentGuardian', testMock);
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary)
        .should('exist')
        .and('contain.text', 'Enter a valid mobile telephone number, like 07700 900 982');
    },
  );

  it(
    'AC8d. Parent/Guardian - Employer telephone invalid format shows employer telephone error',
    { tags: ['@PO-1112'] },
    () => {
      const testMock = structuredClone(minimalMock);
      testMock.defendant_account_party.employer_details!.employer_telephone_number = '0207A214875';
      setupComponent('parentGuardian', testMock);
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary)
        .should('exist')
        .and(
          'contain.text',
          'Enter a valid employer telephone number in the correct format, like 07700 900 982 or 01263 766122',
        );
    },
  );

  it(
    'AC9. Parent/Guardian - Max length validation retains user on form and shows per-field errors',
    { tags: ['@PO-1112'] },
    () => {
      const maxLengthMock = structuredClone(minimalMock);
      const primaryEmail = `${'a'.repeat(65)}@example.com`;
      const secondaryEmail = `${'b'.repeat(65)}@example.com`;
      const employerEmail = `${'c'.repeat(65)}@example.com`;

      // Set all fields to exceed max length using API structure
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

      setupComponent('parentGuardian', maxLengthMock);

      cy.get(DOM_ELEMENTS.submitButton).click();

      cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Parent or guardian details');
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');

      expectedErrors.forEach((message) => {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', message);
      });
    },
  );

  it(
    'AC10. Parent/Guardian - Data type validation for alphabetical and alphanumeric fields',
    { tags: ['@PO-1112'] },
    () => {
      const dataTypeValidationMock = structuredClone(minimalMock);

      // Set all fields with invalid characters using API structure
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
      dataTypeValidationMock.defendant_account_party.employer_details!.employer_address!.address_line_2 =
        'Suite 200 $%^';
      dataTypeValidationMock.defendant_account_party.employer_details!.employer_address!.address_line_3 =
        'Industrial Estate &*()';
      dataTypeValidationMock.defendant_account_party.employer_details!.employer_address!.address_line_4 =
        'Business District +={}';
      dataTypeValidationMock.defendant_account_party.employer_details!.employer_address!.address_line_5 =
        'Metropolitan Area []|\\';
      dataTypeValidationMock.defendant_account_party.employer_details!.employer_address!.postcode = 'BU5& 1NE';

      setupComponent('parentGuardian', dataTypeValidationMock);

      cy.get(DOM_ELEMENTS.submitButton).click();

      cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Parent or guardian details');
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');

      allExpectedErrors.forEach((message) => {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', message);
      });
    },
  );
});
