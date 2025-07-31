import { mount } from 'cypress/angular';
import { FinesMacFixedPenaltyDetailsComponent } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-fixed-penalty-details/fines-mac-fixed-penalty-details.component';
import { ActivatedRoute } from '@angular/router';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { FinesMacStore } from '../../../../../src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_MAC_STATE_MOCK } from '../../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FINES_FIXED_PENALTY_MOCK } from './mocks/fines_mac_fixed_penalty_mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '../../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { OPAL_FINES_PROSECUTOR_REF_DATA_MOCK } from '../../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-prosecutor-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '../../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { DOM_ELEMENTS } from './constants/fines_mac_manual_fixed_penalty_elements';
import { provideHttpClient } from '@angular/common/http';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '../../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { calculateWeeksInFuture } from '../../../../support/utils/dateUtils';

describe('FinesMacManualFixedPenalty', () => {
  let fixedPenaltyMock = structuredClone(FINES_FIXED_PENALTY_MOCK);

  const setupComponent = (formSubmit: any = null) => {
    mount(FinesMacFixedPenaltyDetailsComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        {
          provide: FinesMacStore,
          useFactory: () => {
            const store = new FinesMacStore();
            store.setFinesMacStore(fixedPenaltyMock);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                courts: OPAL_FINES_COURT_REF_DATA_MOCK,
                prosecutors: OPAL_FINES_PROSECUTOR_REF_DATA_MOCK,
                localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
              },
              parent: {
                url: [{ path: 'manual-account-creation' }],
              },
            },
          },
        },
      ],
      componentProperties: {
        handleFixedPenaltyDetailsSubmit: formSubmit,
      },
    });
  };

  beforeEach(() => {
    fixedPenaltyMock = structuredClone(FINES_FIXED_PENALTY_MOCK);

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

  it(
    '(AC1a-eii) The Fixed Penalty Details screen will be created as per the Design Artefacts',
    { tags: ['@PO-857'] },
    () => {
      fixedPenaltyMock.languagePreferences.formData.fm_language_preferences_document_language = 'CY';
      fixedPenaltyMock.languagePreferences.formData.fm_language_preferences_hearing_language = 'CY';
      fixedPenaltyMock.businessUnit.welsh_language = true;

      setupComponent(null);

      // AC1a - The Fixed Penalty Details screen will be created as per the Design Artefacts
      // Check personal details section
      cy.get(DOM_ELEMENTS.titleSelect).should('exist');
      cy.get(DOM_ELEMENTS.firstNameInput).should('exist');
      cy.get(DOM_ELEMENTS.lastNameInput).should('exist');
      cy.get(DOM_ELEMENTS.dobInput).should('exist');
      cy.get(DOM_ELEMENTS.addressLine1Input).should('exist');
      cy.get(DOM_ELEMENTS.addressLine2Input).should('exist');
      cy.get(DOM_ELEMENTS.postcodeInput).should('exist');

      // Check court details section
      cy.get(DOM_ELEMENTS.issuingAuthorityInput).should('exist');
      cy.get(DOM_ELEMENTS.enforcementCourtInput).should('exist');

      // Check fixed penalty details section
      cy.get(DOM_ELEMENTS.noticeNumberInput).should('exist');
      cy.get(DOM_ELEMENTS.dateOfOffenceInput).should('exist');
      cy.get(DOM_ELEMENTS.offenceCodeInput).should('exist');
      cy.get(DOM_ELEMENTS.timeOfOffenceInput).should('exist');
      cy.get(DOM_ELEMENTS.placeOfOffenceInput).should('exist');
      cy.get(DOM_ELEMENTS.amountImposedInput).should('exist');

      cy.get(DOM_ELEMENTS.vehicleRadioButton).should('exist');
      cy.get(DOM_ELEMENTS.nonVehicleRadioButton).should('exist');
      cy.get(DOM_ELEMENTS.vehicleRadioButton).check(); // Vehicle is default
      cy.get(DOM_ELEMENTS.vehicleRegistrationInput).should('exist');
      cy.get(DOM_ELEMENTS.drivingLicenceInput).should('exist');
      cy.get(DOM_ELEMENTS.ntoNthInput).should('exist');
      cy.get(DOM_ELEMENTS.dateNtoIssuedInput).should('exist');

      //Welsh BU
      cy.get(DOM_ELEMENTS.documentLanguageSelect).should('exist');
      cy.get(DOM_ELEMENTS.hearingLanguageSelect).should('exist');

      // Check form buttons
      cy.get(DOM_ELEMENTS.submitButton).should('exist');

      // Submit empty form to check all validation messages
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');
      cy.get(DOM_ELEMENTS.errorSummaryTitle).should('contain', 'There is a problem');

      // Verify all required field error messages are displayed
      const requiredErrorMessages = [
        'Select a title',
        "Enter defendant's first name(s)",
        "Enter defendant's last name",
        'Enter address line 1, typically the building and street',
        'Enter an Enforcement court',
        'Enter the issuing authority',
        'Enter Notice number',
        'Enter an offence code',
        'Enter where the offence took place',
        'Enter amount imposed',
        'Enter Registration number',
        'Enter Driving licence number',
      ];

      requiredErrorMessages.forEach((errorMsg) => {
        cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', errorMsg);
      });

      // AC1b - The following fields are type ahead fields and will adhere to the type ahead functionality

      // AC1bi - As a user types, the type-ahead list will automatically display and refine results based on the characters entered
      // Check Issuing Authority type-ahead
      cy.get(DOM_ELEMENTS.issuingAuthorityInput).type('Police', { delay: 0 });
      cy.get('[role="listbox"]').should('be.visible');
      cy.get('[role="option"]').should('contain', 'Police force (123)');

      // Check Enforcement Court type-ahead
      cy.get(DOM_ELEMENTS.issuingAuthorityInput).clear();
      cy.get(DOM_ELEMENTS.enforcementCourtInput).type('Port', { delay: 0 });
      cy.get('[role="listbox"]').should('be.visible');
      cy.get('[role="option"]').should('contain', 'Port Talbot');
      cy.get(DOM_ELEMENTS.enforcementCourtInput).clear();

      // AC1bii - The type-ahead fields require at least 1 character before the type-ahead functionality is triggered
      // Issuing Authority
      cy.get(DOM_ELEMENTS.issuingAuthorityInput).type('P', { delay: 0 });
      cy.get('[role="listbox"]').should('be.visible');

      // Enforcement Court
      cy.get(DOM_ELEMENTS.issuingAuthorityInput).clear();
      cy.get(DOM_ELEMENTS.enforcementCourtInput).type('P', { delay: 0 });
      cy.get('[role="listbox"]').should('be.visible');
      cy.get(DOM_ELEMENTS.enforcementCourtInput).clear();

      // AC1biii - The values listed within the type-ahead field will be selectable by a user
      // Issuing Authority
      cy.get(DOM_ELEMENTS.issuingAuthorityInput).clear().type('Police', { delay: 0 });

      cy.get(DOM_ELEMENTS.issuingAuthorityDropDown).should('be.visible').first().click();
      cy.get(DOM_ELEMENTS.issuingAuthorityInput).should('have.value', 'Police force (123)');

      cy.get(DOM_ELEMENTS.enforcementCourtInput).clear().type('Port', { delay: 0 });

      // Be specific about which dropdown we're targeting for Enforcement Court
      cy.get(DOM_ELEMENTS.enforcementCourtDropDown).should('be.visible').first().click();
      cy.get(DOM_ELEMENTS.enforcementCourtInput).should('have.value', 'Port Talbot Justice Centre (999)');

      // AC1c - For the Issuing Authority type-ahead field a user can search on both name and code
      // Search by name
      cy.get(DOM_ELEMENTS.issuingAuthorityInput).clear().type('Police', { delay: 0 });
      cy.get('[role="listbox"]').should('be.visible');
      cy.get('[role="option"]').should('contain', 'Police force (123)');

      // Search by code
      cy.get(DOM_ELEMENTS.issuingAuthorityInput).clear().type('123', { delay: 0 });
      cy.get('[role="listbox"]').should('be.visible');
      cy.get('[role="option"]').should('contain', '123');

      // AC1d - For the Enforcement Court type-ahead field, values will be displayed in format 'Enforcement court name (Enforcement court code)'
      cy.get(DOM_ELEMENTS.enforcementCourtInput).clear().type('Port', { delay: 0 });
      cy.get('[role="listbox"]').should('be.visible');
      cy.get('[role="option"]').first().should('contain', 'Port Talbot Justice Centre (999)'); // Full format check
      cy.get('[role="option"]').first().should('contain', '('); // Contains open parenthesis
      cy.get('[role="option"]').first().should('contain', ')'); // Contains close parenthesis

      // AC1ei - If a valid Offence Code is entered, a confirmation box will be displayed with the associated offence short title
      cy.get(DOM_ELEMENTS.offenceCodeInput).type('AK123456', { delay: 0 });

      cy.wait('@getOffenceByCjsCode');

      // For a valid code, it should show the offence description
      cy.get(DOM_ELEMENTS.offenceCodeInput).should('have.value', 'AK123456');

      cy.get(DOM_ELEMENTS.vehicleRadioButton).click();
      cy.get(DOM_ELEMENTS.offenceStatus).should('be.visible');
      cy.contains('ak test').should('be.visible');

      // AC1eii - If an invalid Offence code is entered, a confirmation box will be displayed informing them that an offence was not found
      cy.get(DOM_ELEMENTS.offenceCodeInput).clear().type('AK123457', { delay: 0 });

      cy.wait('@getOffenceByCjsCode');
      cy.get(DOM_ELEMENTS.nonVehicleRadioButton).click();
      cy.get(DOM_ELEMENTS.offenceStatus).should('be.visible');
      cy.contains('Offence not found').should('exist');
    },
  );

  it('(AC2) Validation will exist for the Issuing Authority field', { tags: ['@PO-857'] }, () => {
    setupComponent(null);

    // User does not provide a value
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter the issuing authority');

    // User enters more than 41 characters
    const longText = 'A'.repeat(42); // Exceeds 41 characters
    cy.get(DOM_ELEMENTS.issuingAuthorityInput).type(longText);
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter the issuing authority');

    // User enters non-alphanumeric characters (assuming there's validation for this)
    cy.get(DOM_ELEMENTS.issuingAuthorityInput).clear().type('Invalid@Authority#123');
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter the issuing authority');
  });

  it('(AC3) Validation will exist for the Enforcement Court field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    // User does not provide a value
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter an Enforcement court');

    // User enters more than 35 characters
    const longText = 'A'.repeat(36); // Exceeds 35 characters
    cy.get(DOM_ELEMENTS.enforcementCourtInput).type(longText);
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter an Enforcement court');

    // User enters non-alphanumeric characters (assuming there's validation for this)
    cy.get(DOM_ELEMENTS.enforcementCourtInput).clear().type('Invalid@Court#123');
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter an Enforcement court');
  });

  it('(AC4) Validation will exist for the Title field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    // User does not select a value
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Select a title');

    // Select a valid title to fix the error
    cy.get(DOM_ELEMENTS.titleSelect).select('Mr');
    cy.get(DOM_ELEMENTS.submitButton).click();

    // There should still be other errors but not the title error
    cy.get(DOM_ELEMENTS.errorSummaryList).should('not.contain', 'Select a title');
  });

  it('(AC5) Validation will exist for the First names field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    // User does not provide a value
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', "Enter defendant's first name(s)");

    // User enters more than 20 characters
    const longName = 'A'.repeat(21); // Exceeds 20 characters
    cy.get(DOM_ELEMENTS.firstNameInput).type(longName, { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      "The defendant's first name(s) must be 20 characters or fewer",
    );

    // User enters non-alphabetical characters
    cy.get(DOM_ELEMENTS.firstNameInput).clear().type('John123@#$', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      "The defendant's first name(s) must only contain alphabetical text",
    );
  });

  it('(AC6) Validation will exist for the Last name field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    // User does not provide a value
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', "Enter defendant's last name");

    // User enters more than 30 characters
    const longName = 'A'.repeat(31); // Exceeds 30 characters
    cy.get(DOM_ELEMENTS.lastNameInput).type(longName, { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', "The defendant's last name must be 30 characters or fewer");

    // User enters non-alphabetical characters
    cy.get(DOM_ELEMENTS.lastNameInput).clear().type('Smith123@#$', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      "The defendant's last name must only contain alphabetical text",
    );
  });

  it('(AC7) Validation will exist for the Date of birth field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    const futureDateStr = calculateWeeksInFuture(1);

    cy.get(DOM_ELEMENTS.dobInput).type(futureDateStr, { force: true, delay: 0 });

    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter a valid date of birth in the past');

    //letters, incorrect days or months, or special characters
    cy.get(DOM_ELEMENTS.dobInput).clear().type('abc/de/fghi', { force: true, delay: 0 });

    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter date of birth in the format DD/MM/YYYY');

    cy.get(DOM_ELEMENTS.dobInput).clear().type('32/13/2000', { force: true, delay: 0 });

    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter a valid date of birth');

    cy.get(DOM_ELEMENTS.dobInput).clear().type('01@01#2000', { force: true, delay: 0 });

    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter date of birth in the format DD/MM/YYYY');

    cy.get(DOM_ELEMENTS.dobInput).clear().type('01012000', { force: true, delay: 0 });

    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter date of birth in the format DD/MM/YYYY');
  });

  it('(AC8) Validation will exist for the Address Line 1 field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    // User does not provide a value
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter address line 1, typically the building and street');

    // User enters more than 30 characters
    const longAddress = 'A'.repeat(31); // Exceeds 30 characters
    cy.get(DOM_ELEMENTS.addressLine1Input).type(longAddress, { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'The address line 1 must be 30 characters or fewer');

    // User enters non-alphanumeric characters
    cy.get(DOM_ELEMENTS.addressLine1Input).clear().type('123 High Street $%^&*', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'The address line 1 must not contain special characters');
  });

  it('(AC9) Validation will exist for the Address Line 2 field', { tags: ['@PO-857'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit);

    // User enters more than 30 characters
    const longAddress = 'A'.repeat(31); // Exceeds 30 characters
    cy.get(DOM_ELEMENTS.addressLine2Input).type(longAddress, { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'The address line 2 must be 30 characters or fewer');

    // User enters non-alphanumeric characters
    cy.get(DOM_ELEMENTS.addressLine2Input).clear().type('Apartment 123 $%^&*', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'The address line 2 must not contain special characters');
  });

  it('(AC10) Validation will exist for the Address Line 3 field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    // User enters more than 16 characters
    const longAddress = 'A'.repeat(17); // Exceeds 16 characters
    cy.get(DOM_ELEMENTS.addressLine3Input).type(longAddress, { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'The address line 3 must be 16 characters or fewer');

    // User enters non-alphanumeric characters
    cy.get(DOM_ELEMENTS.addressLine3Input).clear().type('West $%^&*', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'The address line 3 must not contain special characters');
  });

  it('(AC11) Validation will exist for the Postcode field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    // User enters more than 8 characters
    const longPostcode = 'A'.repeat(9); // Exceeds 8 characters
    cy.get(DOM_ELEMENTS.postcodeInput).type(longPostcode, { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'The postcode must be 8 characters or fewer');

    // User enters non-alphanumeric characters
    cy.get(DOM_ELEMENTS.postcodeInput).clear().type('SW1A$%^&', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      'Postcode must only include letters a to z, numbers, hyphens, spaces and apostrophes',
    );
  });

  it('(AC12) Validation will exist for the Notice number field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    // User does not provide a value
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter Notice number');

    // User enters more than 16 characters
    const longNoticeNumber = 'A'.repeat(17); // Exceeds 16 characters
    cy.get(DOM_ELEMENTS.noticeNumberInput).type(longNoticeNumber, { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Notice number must be 16 characters or fewer');

    // User enters non-alphanumeric characters
    cy.get(DOM_ELEMENTS.noticeNumberInput).clear().type('FPN12 $%^&*', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      'Notice number must only include letters a to z, numbers, hyphens, spaces and apostrophes',
    );
  });

  it('(AC13) Validation will exist for the Registration number field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    // Select Vehicle radio button to make the field required
    cy.get(DOM_ELEMENTS.vehicleRadioButton).check();

    // User does not provide a value when Vehicle is selected
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter Registration number');

    // User enters more than 7 characters
    const longRegNumber = 'A'.repeat(8); // Exceeds 7 characters
    cy.get(DOM_ELEMENTS.vehicleRegistrationInput).type(longRegNumber, { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Registration number must be 7 characters or fewer');

    // User enters non-alphanumeric characters
    cy.get(DOM_ELEMENTS.vehicleRegistrationInput).clear().type('ABC1%^&', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      'Registration number must only include letters a to z, numbers, hyphens, spaces and apostrophes',
    );
  });

  it('(AC14) Validation will exist for the Driving licence number field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    // Select Vehicle radio button to make the field required
    cy.get(DOM_ELEMENTS.vehicleRadioButton).check();

    // User does not provide a value when Vehicle is selected
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter Driving licence number');

    // User does not enter a valid driving license
    cy.get(DOM_ELEMENTS.drivingLicenceInput).type('INVALID', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      'Driving licence number must be in a valid format (I.e. first 5 characters are the surname, second 6 are the DOB, 2 characters for the initials and 3 random characters)',
    );

    // User enters more than 16 characters
    const longDrivingLicense = 'A'.repeat(17); // Exceeds 16 characters
    cy.get(DOM_ELEMENTS.drivingLicenceInput).clear().type(longDrivingLicense, { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      'Driving licence number must be in a valid format (I.e. first 5 characters are the surname, second 6 are the DOB, 2 characters for the initials and 3 random characters)',
    );

    // User enters non-alphanumeric characters
    cy.get(DOM_ELEMENTS.drivingLicenceInput).clear().type('SMITH123$%^&*', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      'Driving licence number must be in a valid format (I.e. first 5 characters are the surname, second 6 are the DOB, 2 characters for the initials and 3 random characters)',
    );
  });

  it(
    '(AC15) Validation will exist for the Notice to owner or hirer number (NTO/NTH) field',
    { tags: ['@PO-857'] },
    () => {
      setupComponent();

      cy.get(DOM_ELEMENTS.vehicleRadioButton).check();
      // User enters more than 10 characters
      const longNtoNumber = 'A'.repeat(11); // Exceeds 10 characters
      cy.get(DOM_ELEMENTS.ntoNthInput).type(longNtoNumber, { delay: 0 });
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        'Notice to owner or hirer number (NTO/NTH) must be 10 characters or fewer',
      );

      // User enters non-alphanumeric characters
      cy.get(DOM_ELEMENTS.ntoNthInput).clear().type('NTO$%^&*', { delay: 0 });
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        'Notice to owner or hirer number (NTO/NTH) must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      );
    },
  );

  it('(AC16) Validation will exist for the Date notice to owner was issued field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.vehicleRadioButton).check();

    // User enters a future date
    const futureDateStr = calculateWeeksInFuture(1);
    cy.get(DOM_ELEMENTS.dateNtoIssuedInput).type(futureDateStr, { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Date notice to owner issued must be in the past');

    // User enters incorrect date format (incorrect days/months)
    cy.get(DOM_ELEMENTS.dateNtoIssuedInput).clear().type('40/30/2023', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter a valid notice to owner date');

    // User enters letters, incorrect formats, or special characters
    cy.get(DOM_ELEMENTS.dateNtoIssuedInput).clear().type('abc/de/fghi', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter notice to owner date in the format DD/MM/YYYY');

    cy.get(DOM_ELEMENTS.dateNtoIssuedInput).clear().type('01@01#2023', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter notice to owner date in the format DD/MM/YYYY');
  });

  it('(AC17) Validation will exist for the Date of offence field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    // User does not provide a value
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter date of offence');

    // User enters a future date
    const futureDateStr = calculateWeeksInFuture(1);
    cy.get(DOM_ELEMENTS.dateOfOffenceInput).type(futureDateStr, { force: true, delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Date of offence must be in the past');

    // User enters letters, incorrect days or months, or special characters
    cy.get(DOM_ELEMENTS.dateOfOffenceInput).clear({ force: true }).type('ab/cd/efgh', { force: true, delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Offence date must be in the format DD/MM/YYYY');

    cy.get(DOM_ELEMENTS.dateOfOffenceInput).clear({ force: true }).type('32/13/2023', { force: true, delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter a valid offence date');

    cy.get(DOM_ELEMENTS.dateOfOffenceInput).clear({ force: true }).type('01@01#2023', { force: true, delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Offence date must be in the format DD/MM/YYYY');

    cy.get(DOM_ELEMENTS.dateOfOffenceInput).clear({ force: true }).type('01012023', { force: true, delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Offence date must be in the format DD/MM/YYYY');
  });

  it('(AC18) Validation will exist for the Offence code field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    // User does not provide a value
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter an offence code');

    // User enters more than 8 characters
    const longOffenceCode = 'A'.repeat(9); // Exceeds 8 characters
    cy.get(DOM_ELEMENTS.offenceCodeInput).type(longOffenceCode, { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Offence code must be 7 or 8 characters');

    // User enters non-alphanumeric characters
    cy.get(DOM_ELEMENTS.offenceCodeInput).clear().type('CJ03$%^&*', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      'Offence code must only include letters a to z, numbers, hyphens, spaces and apostrophes',
    );
  });

  it('(AC19) Validation will exist for the Time of offence field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    // User enters time in wrong format or with special characters
    cy.get(DOM_ELEMENTS.timeOfOffenceInput).type('25:70', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      'Enter time of offence in the correct format, such as 02:00 or 14:00',
    );

    cy.get(DOM_ELEMENTS.timeOfOffenceInput).clear().type('14-30', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      'Enter time of offence in the correct format, such as 02:00 or 14:00',
    );

    cy.get(DOM_ELEMENTS.timeOfOffenceInput).clear().type('2:30pm', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      'Enter time of offence in the correct format, such as 02:00 or 14:00',
    );

    cy.get(DOM_ELEMENTS.timeOfOffenceInput).clear().type('@!:$%', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      'Enter time of offence in the correct format, such as 02:00 or 14:00',
    );
  });

  it('(AC20) Validation will exist for the Place of offence field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    // User does not provide a value
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter where the offence took place');

    // User enters more than 30 characters
    const longPlace = 'A'.repeat(30);
    cy.get(DOM_ELEMENTS.placeOfOffenceInput).type(longPlace, { delay: 0 });
    cy.get(DOM_ELEMENTS.placeOfOffenceInputHint).should('contain', 'You have 0 characters remaining');

    // User enters non-alphanumeric characters
    cy.get(DOM_ELEMENTS.placeOfOffenceInput).clear().type('High Street $%^&*', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      'Place of offence must only include letters a to z, numbers, hyphens, spaces and apostrophes',
    );
  });

  it('(AC21) Validation will exist for the Amount imposed field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    // User does not provide a value
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter amount imposed');

    // User enters amount with non-numeric characters
    cy.get(DOM_ELEMENTS.amountImposedInput).type('123.45abc', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter valid amount');

    // User enters amount with special characters
    cy.get(DOM_ELEMENTS.amountImposedInput).clear().type('100$%^&*', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter valid amount');

    // User enters amount with more than 18 integers and 2 decimal places
    const longAmount = '1'.repeat(19) + '.99';
    cy.get(DOM_ELEMENTS.amountImposedInput).clear().type(longAmount, { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      'Amount too long. Enter an amount that is less than 18 numbers before the decimal and 2 or less after',
    );

    // User enters amount with more than 2 decimal places
    cy.get(DOM_ELEMENTS.amountImposedInput).clear().type('123.456', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      'Amount too long. Enter an amount that is less than 18 numbers before the decimal and 2 or less after',
    );
  });

  it('(AC22) Validation will exist for the Add comment field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    // User enters more than 30 characters
    const longComment = 'A'.repeat(31); // Exceeds 30 characters
    cy.get(DOM_ELEMENTS.commentsInput).type(longComment, { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.commentsInputHint).should('contain', 'You have 0 characters remaining');

    // User enters non-alphanumeric characters
    cy.get(DOM_ELEMENTS.commentsInput).clear().type('Test comment $%^&*', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      'Add comment must only include letters a to z, numbers, hyphens, spaces and apostrophes',
    );
  });

  it('(AC23) Validation will exist for the Add account note field', { tags: ['@PO-857'] }, () => {
    setupComponent();

    // User enters more than 1000 characters
    const longNote = 'A'.repeat(1001); // Exceeds 1000 characters
    cy.get(DOM_ELEMENTS.accountNoteInput).type(longNote, { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.accountNoteInputHint).should('contain', 'You have 0 characters remaining');

    // User enters non-alphanumeric characters
    cy.get(DOM_ELEMENTS.accountNoteInput).clear().type('Test account note $%^&*', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should(
      'contain',
      'Add account note must only include letters a to z, numbers, hyphens, spaces and apostrophes',
    );
  });

  it.only(
    '(AC1a) The Fixed Penalty Details screen for company will be created as per the Design Artefacts',
    { tags: ['@PO-860'] },
    () => {
      fixedPenaltyMock.accountDetails.formData.fm_create_account_defendant_type = 'company';
      setupComponent(null);

      // Check company details section
      cy.get(DOM_ELEMENTS.companyName).should('exist');
      cy.get(DOM_ELEMENTS.companyAddressLine1Input).should('exist');
      cy.get(DOM_ELEMENTS.companyAddressLine2Input).should('exist');
      cy.get(DOM_ELEMENTS.companyAddressLine3Input).should('exist');
      cy.get(DOM_ELEMENTS.companyPostcodeInput).should('exist');

      // Check personal details do not exist
      cy.get(DOM_ELEMENTS.titleSelect).should('not.exist');
      cy.get(DOM_ELEMENTS.firstNameInput).should('not.exist');
      cy.get(DOM_ELEMENTS.lastNameInput).should('not.exist');
      cy.get(DOM_ELEMENTS.dobInput).should('not.exist');

      // Check court details section
      cy.get(DOM_ELEMENTS.issuingAuthorityInput).should('exist');
      cy.get(DOM_ELEMENTS.enforcementCourtInput).should('exist');

      // Check fixed penalty details section
      cy.get(DOM_ELEMENTS.noticeNumberInput).should('exist');
      cy.get(DOM_ELEMENTS.dateOfOffenceInput).should('exist');
      cy.get(DOM_ELEMENTS.offenceCodeInput).should('exist');
      cy.get(DOM_ELEMENTS.timeOfOffenceInput).should('exist');
      cy.get(DOM_ELEMENTS.placeOfOffenceInput).should('exist');
      cy.get(DOM_ELEMENTS.amountImposedInput).should('exist');

      cy.get(DOM_ELEMENTS.vehicleRadioButton).should('exist');
      cy.get(DOM_ELEMENTS.nonVehicleRadioButton).should('exist');
      cy.get(DOM_ELEMENTS.vehicleRadioButton).check(); // Vehicle is default
      cy.get(DOM_ELEMENTS.vehicleRegistrationInput).should('exist');
      cy.get(DOM_ELEMENTS.drivingLicenceInput).should('exist');
      cy.get(DOM_ELEMENTS.ntoNthInput).should('exist');
      cy.get(DOM_ELEMENTS.dateNtoIssuedInput).should('exist');

      // Check form buttons
      cy.get(DOM_ELEMENTS.submitButton).should('exist');
    },
  );

  it.only(
    '(AC1b, AC1c) Validation will exist for the Company Name field - no value provided',
    { tags: ['@PO-860'] },
    () => {
      fixedPenaltyMock.accountDetails.formData.fm_create_account_defendant_type = 'company';
      setupComponent(null);

      // User does not provide a value
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter company name');
    },
  );

  it.only('(AC1b, AC1c) Validation will exist for the Company Name field - max length', { tags: ['@PO-860'] }, () => {
    fixedPenaltyMock.accountDetails.formData.fm_create_account_defendant_type = 'company';
    setupComponent(null);

    // User enters more than 50 characters
    const longText = 'A'.repeat(51); // Exceeds 50 characters
    cy.get(DOM_ELEMENTS.companyName).type(longText);
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Company name must be 50 characters or fewer');
  });

  it.only(
    '(AC1b, AC1c) Validation will exist for the Company Name field - non-alphanumeric character check',
    { tags: ['@PO-860'] },
    () => {
      fixedPenaltyMock.accountDetails.formData.fm_create_account_defendant_type = 'company';
      setupComponent(null);

      // User enters non-alphanumeric characters
      cy.get(DOM_ELEMENTS.companyName).clear().type('Company!123');
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Company name must only contain letters');
    },
  );
});
