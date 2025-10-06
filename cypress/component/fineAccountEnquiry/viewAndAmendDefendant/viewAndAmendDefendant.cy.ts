import { mount } from 'cypress/angular';
import { FinesAccDebtorAddAmend } from 'src/app/flows/fines/fines-acc/fines-acc-debtor-add-amend/fines-acc-debtor-add-amend.component';
import { ActivatedRoute } from '@angular/router';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { DOM_ELEMENTS, getAliasForenamesInput, getAliasSurnameInput } from './constants/viewAndAmendDefendant_elements';
import { MOCK_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA, VIEW_AND_AMEND_DEFENDANT_MINIMAL_MOCK } from './mocks/viewAndAmendDefendant.mock';

describe('FinesAccDebtorAddAmend - View and Amend Defendant', () => {
  let fullMock = structuredClone(MOCK_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA);
  let minimalMock = structuredClone(VIEW_AND_AMEND_DEFENDANT_MINIMAL_MOCK);

  beforeEach(() => {
    fullMock = structuredClone(MOCK_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA);
    minimalMock = structuredClone(VIEW_AND_AMEND_DEFENDANT_MINIMAL_MOCK);
  });
  const setupComponent = (
    partyType: string = 'INDIVIDUAL', 
    formData = MOCK_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA,
    welshSpeaking: string = 'N'
  ) => {
    const mockDateService = {
      getPreviousDate: cy.stub().returns('2024-01-01'),
      isValidDate: cy.stub().returns(true),
      calculateAge: cy.stub().returns(25),
      getAgeObject: cy.stub().returns({ value: 25, group: 'Adult' }),
      getFromFormat: cy.stub().callsFake((value: string) => value),
      toFormat: cy.stub().callsFake((value: string) => value),
      getFromFormatToFormat: cy.stub().callsFake((value: string) => value),
    };

    mount(FinesAccDebtorAddAmend, {
      providers: [
        { provide: DateService, useValue: mockDateService },
        {
          provide: FinesAccountStore,
          useFactory: () => {
            const store = new FinesAccountStore();
            // Set the required signal values
            store.welsh_speaking.set(welshSpeaking);
            store.account_number.set('ACC123456');
            store.party_name.set('John Doe');
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                debtorAmendFormData: formData,
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
    cy.then(() => {
      // Reset any state if needed
    });
  });

  it('AC1a. The "Defendant Details (Change)" screen will be built as per the design artefacts provided with aliases in mock data', { tags: ['@PO-1110'] }, () => {
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
    cy.get(DOM_ELEMENTS.aliasSurnameInput3).should('have.value', 'Smith2');

    // Verify Fifth alias from mock data (Test Smith3)
    cy.get(DOM_ELEMENTS.aliasForenamesInput4).should('have.value', 'Test');
    cy.get(DOM_ELEMENTS.aliasSurnameInput4).should('have.value', 'Smith3');

    // Date of birth

    cy.get(DOM_ELEMENTS.dobInput).should('exist');
    cy.get(DOM_ELEMENTS.dobLabel).should('contain', 'Date of birth');

    // Age display should show calculated age from DOB in mock data
    cy.get(DOM_ELEMENTS.ageDisplay).should('exist');
    cy.get(DOM_ELEMENTS.ageValue).should('contain', 'Age: 25');
    cy.get(DOM_ELEMENTS.ageGroup).should('contain', 'Adult');

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
  });

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
    // Start with minimal mock clone so no aliases are present initially
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
    cy.contains('legend', 'Alias 1').parent('fieldset').within(() => {
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
    // Create a local modified clone leaving required fields blank without mutating source mocks
    const emptyCoreMock = structuredClone(minimalMock);
    emptyCoreMock.formData = {
      ...emptyCoreMock.formData,
      facc_debtor_add_amend_title: '',
      facc_debtor_add_amend_forenames: '',
      facc_debtor_add_amend_surname: '',
      facc_debtor_add_amend_address_line_1: '',
    };
    setupComponent('INDIVIDUAL', emptyCoreMock);

    // Pre-condition: no error summary
    cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');

    // Ensure mandatory fields are empty (they are null in minimal mock)
    cy.get(DOM_ELEMENTS.titleSelect).should('have.value', '');
    cy.get(DOM_ELEMENTS.forenamesInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.surnameInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.addressLine1Input).should('have.value', '');

    // Submit to trigger validation
    cy.get(DOM_ELEMENTS.submitButton).click();

    const coreRequiredMessages = [
      "Select a title",
      "Enter defendant's first name(s)",
      "Enter defendant's last name",
      'Enter address line 1, typically the building and street',
    ];

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    coreRequiredMessages.forEach((msg) => {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', msg);
    });

    // Employer required errors should NOT appear because no employer fields were interacted with (conditional requirement)
    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain.text', 'Enter employer name');
    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain.text', 'Enter employee reference or National Insurance number');
  });

  it('AC5. Required field validation (employer conditional)', { tags: ['@PO-1110'] }, () => {
    setupComponent('INDIVIDUAL', minimalMock);

    cy.get(DOM_ELEMENTS.employerCompanyInput).focus().blur();

    // Leave all employer values blank then submit
    cy.get(DOM_ELEMENTS.submitButton).click();

    // Now the employer required messages SHOULD appear (conditional activation)
    const employerRequiredMessages = [
      'Enter employer name',
      'Enter employee reference or National Insurance number',
      'Enter address line 1, typically the building and street',
    ];

    employerRequiredMessages.forEach((msg) => {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', msg);
    });
  });

  it('AC5. Required field validation (alias)', { tags: ['@PO-1110'] }, () => {
   setupComponent('INDIVIDUAL', minimalMock);

    // Alias validation: enable aliases (one blank alias row added automatically)
    cy.get(DOM_ELEMENTS.aliasCheckbox).check({ force: true }).should('be.checked');
    cy.get(DOM_ELEMENTS.aliasSection).should('exist');
    // Attempt to submit to show alias 1 errors
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', 'Enter alias 1 first name(s)');
    cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', 'Enter alias 1 last name');

    // Add a second alias row and submit again to see alias 2 errors
    cy.get(DOM_ELEMENTS.addAliasButton).click();
    cy.contains('legend', 'Alias 2').should('exist');
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', 'Enter alias 2 first name(s)');
    cy.get(DOM_ELEMENTS.errorSummary).should('contain.text', 'Enter alias 2 last name');

  });

  // AC6: Format validation tests
  it('AC6a. DOB with non-numerical characters shows format error', { tags: ['@PO-1110'] }, () => {
    minimalMock.formData.facc_debtor_add_amend_dob = "AA/BB/CCCC";
    setupComponent('INDIVIDUAL', minimalMock);

    // Clear DOB and enter invalid format with letters
    cy.get(DOM_ELEMENTS.submitButton).click();


    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', 'Enter date of birth in the format DD/MM/YYYY');
  });

  it('AC6b. DOB in the future shows past-date error', { tags: ['@PO-1110'] }, () => {
    minimalMock.formData.facc_debtor_add_amend_dob = '01/01/2099'
    setupComponent('INDIVIDUAL', minimalMock);

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', 'Enter a valid date of birth in the past');
  });

  it('AC6c. NI number invalid format shows NI format error', { tags: ['@PO-1110'] }, () => {
    minimalMock.formData.facc_debtor_add_amend_national_insurance_number = '12345';
    setupComponent('INDIVIDUAL', minimalMock);

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain.text', 'Enter a National Insurance number in the format AANNNNNNA');
  });

  // AC7: Email format validation
  it('AC7a. Primary email invalid format shows primary email format error', { tags: ['@PO-1110'] }, () => {
    minimalMock.formData.facc_debtor_add_amend_contact_email_address_1 = 'invalid_email'; // missing @ and domain
    setupComponent('INDIVIDUAL', minimalMock);

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain.text', 'Enter primary email address in the correct format, like name@example.com');
  });

  it('AC7b. Secondary email invalid format shows secondary email format error', { tags: ['@PO-1110'] }, () => {
    minimalMock.formData.facc_debtor_add_amend_contact_email_address_2 = 'bad.second'; // missing @
    setupComponent('INDIVIDUAL', minimalMock);

    cy.get(DOM_ELEMENTS.submitButton).click(); 

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain.text', 'Enter secondary email address in the correct format, like name@example.com');
  });

  it('AC7c. Employer email invalid format shows employer email format error', { tags: ['@PO-1110'] }, () => {
    minimalMock.formData.facc_debtor_add_amend_employer_details_employer_email_address = 'employer#mail'; // invalid char & structure
    setupComponent('INDIVIDUAL', minimalMock);

    cy.get(DOM_ELEMENTS.submitButton).click(); 

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain.text', 'Enter employer email address in the correct format, like name@example.com');
  });

  // AC8: Telephone number format validation
  it('AC8a. Home telephone invalid format shows home telephone error', { tags: ['@PO-1110'] }, () => {
    minimalMock.formData.facc_debtor_add_amend_contact_telephone_number_home = '01632A960001'; // alpha char
    setupComponent('INDIVIDUAL', minimalMock);
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain.text', 'Enter a valid home telephone number, like 01632 960 001');
  });

  it('AC8b. Work telephone invalid format shows work telephone error', { tags: ['@PO-1110'] }, () => {
    minimalMock.formData.facc_debtor_add_amend_contact_telephone_number_business = '01632-960-001X'; // invalid char X
    setupComponent('INDIVIDUAL', minimalMock);
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain.text', 'Enter a valid work telephone number, like 01632 960 001 or 07700 900 982');
  });

  it('AC8c. Mobile telephone invalid length/format shows mobile telephone error', { tags: ['@PO-1110'] }, () => {
    minimalMock.formData.facc_debtor_add_amend_contact_telephone_number_mobile = '0770090098'; // 10 digits (should be 11)
    setupComponent('INDIVIDUAL', minimalMock);
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain.text', 'Enter a valid mobile telephone number, like 07700 900 982');
  });

  it('AC8d. Employer telephone invalid format shows employer telephone error', { tags: ['@PO-1110'] }, () => {
    minimalMock.formData.facc_debtor_add_amend_employer_details_employer_telephone_number = '01263 76612X'; // invalid char X
    setupComponent('INDIVIDUAL', minimalMock);
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain.text', 'Enter a valid employer telephone number in the correct format, like 07700 900 982 or 01263 766122');
  });



});