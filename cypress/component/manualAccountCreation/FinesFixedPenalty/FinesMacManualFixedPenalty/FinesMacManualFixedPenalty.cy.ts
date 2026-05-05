import { mount } from 'cypress/angular';
import { FinesMacFixedPenaltyDetailsComponent } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-fixed-penalty-details/fines-mac-fixed-penalty-details.component';
import { ActivatedRoute } from '@angular/router';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { FinesMacStore } from '../../../../../src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_FIXED_PENALTY_MOCK } from './mocks/fines_mac_fixed_penalty_mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '../../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { OPAL_FINES_PROSECUTOR_REF_DATA_MOCK } from '../../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-prosecutor-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '../../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { IOpalFinesLocalJusticeAreaRefData } from '../../../../../src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
import { MacFixedPenaltyDetailsLocators as DOM_ELEMENTS } from '../../../../shared/selectors/manual-account-creation/mac.fixed-penalty.details.locators';
import { provideHttpClient } from '@angular/common/http';
import { calculateWeeksInFuture } from '../../../../support/utils/dateUtils';
import { interceptOffences } from 'cypress/component/CommonIntercepts/CommonIntercepts';

const MANUAL_ACCOUNT_CREATION_JIRA_LABEL = '@JIRA-LABEL:manual-account-creation';
const ADD_COMMENT_ALLOWED_CHARACTERS_ERROR =
  'Add comment must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)';
const ADD_ACCOUNT_NOTE_ALLOWED_CHARACTERS_ERROR =
  'Add account note must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)';
const DRIVING_LICENCE_NUMBER_FORMAT_ERROR = 'Enter Driving licence number in the correct format';

const buildTags = (...tags: string[]) => [...tags, MANUAL_ACCOUNT_CREATION_JIRA_LABEL];

describe('FinesMacManualFixedPenalty', () => {
  let fixedPenaltyMock = structuredClone(FINES_FIXED_PENALTY_MOCK);

  const setupComponent = (
    formSubmit?: any,
    localJusticeAreas: IOpalFinesLocalJusticeAreaRefData = OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
  ) => {
    fixedPenaltyMock = structuredClone(fixedPenaltyMock);

    return mount(FinesMacFixedPenaltyDetailsComponent, {
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
                localJusticeAreas,
              },
              parent: {
                url: [{ path: 'manual-account-creation' }],
              },
            },
          },
        },
      ],
      componentProperties: {},
    }).then(({ fixture }) => {
      if (!formSubmit) {
        return;
      }

      const comp: any = fixture.componentInstance as any;

      if (comp?.handleFixedPenaltyDetailsSubmit?.subscribe) {
        comp.handleFixedPenaltyDetailsSubmit.subscribe((...args: any[]) => (formSubmit as any)(...args));
      } else if (typeof comp?.handleFixedPenaltyDetailsSubmit === 'function') {
        comp.handleFixedPenaltyDetailsSubmit = formSubmit;
      }

      fixture.detectChanges();
    });
  };
  beforeEach(() => {
    interceptOffences();
  });

  beforeEach(() => {
    fixedPenaltyMock = structuredClone(FINES_FIXED_PENALTY_MOCK);
  });

  it(
    '(AC1a-eii) The Fixed Penalty Details screen will be created as per the Design Artefacts',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
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
        'Enter an enforcement court',
        'Enter the issuing authority',
        'Enter Notice number',
        'Enter an offence code',
        'Enter where the offence took place',
        'Enter amount imposed',
        'Enter Registration number',
      ];

      requiredErrorMessages.forEach((errorMsg) => {
        cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', errorMsg);
      });
      cy.get(DOM_ELEMENTS.errorSummaryList).should('not.contain', 'Driving licence number');

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

  it(
    '(AC2) Validation will exist for the Issuing Authority field',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
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
    },
  );

  it(
    '(AC3) Validation will exist for the Enforcement Court field',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      setupComponent();

      // User does not provide a value
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter an enforcement court');

      // User enters more than 35 characters
      const longText = 'A'.repeat(36); // Exceeds 35 characters
      cy.get(DOM_ELEMENTS.enforcementCourtInput).type(longText);
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter an enforcement court');

      // User enters non-alphanumeric characters (assuming there's validation for this)
      cy.get(DOM_ELEMENTS.enforcementCourtInput).clear().type('Invalid@Court#123');
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter an enforcement court');
    },
  );

  it(
    '(AC4) Validation will exist for the Title field',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
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
    },
  );

  it(
    '(AC5) Validation will exist for the First names field - required field',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      // User does not provide a value
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', "Enter defendant's first name(s)");
    },
  );

  it(
    '(AC5) Validation will exist for the First names field - max length',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      // User enters more than 20 characters
      const longName = 'A'.repeat(21); // Exceeds 20 characters
      fixedPenaltyMock.personalDetails.formData.fm_personal_details_forenames = longName;
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        "Defendant's first name(s) must be 20 characters or fewer",
      );
    },
  );

  it.only(
    '(AC5) Validation will exist for the First names field - does not allow non-single-byte ASCII characters',
    {
      tags: [
        ...buildTags('@JIRA-STORY:PO-857', '@JIRA-STORY:PO-3415', '@JIRA-LABEL:populate-and-submit'),
        '@JIRA-KEY:POT-7202',
        '@JIRA-EPIC:PO-855',
        '@JIRA-EPIC:PO-2219',
      ],
    },
    () => {
      // User enters non-alphabetical characters
      fixedPenaltyMock.personalDetails.formData.fm_personal_details_forenames = '©µ±ö€•';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        "Defendant's first name(s) must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas",
      );
    },
  );

  it(
    '(AC6) Validation will exist for the Last name field - required field',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      // User does not provide a value
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', "Enter defendant's last name");
    },
  );

  it(
    '(AC6) Validation will exist for the Last name field - max length',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      // User enters more than 30 characters
      const longName = 'A'.repeat(31); // Exceeds 30 characters
      fixedPenaltyMock.personalDetails.formData.fm_personal_details_surname = longName;
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', "Defendant's last name must be 30 characters or fewer");
    },
  );

  it.only(
    '(AC6) Validation will exist for the Last name field - does not allow non-single-byte ASCII characters',
    {
      tags: [
        ...buildTags('@JIRA-STORY:PO-857', '@JIRA-STORY:PO-3415', '@JIRA-LABEL:populate-and-submit'),
        '@JIRA-KEY:POT-7205',
        '@JIRA-EPIC:PO-855',
        '@JIRA-EPIC:PO-2219',
      ],
    },
    () => {
      // User enters non-alphabetical characters
      fixedPenaltyMock.personalDetails.formData.fm_personal_details_surname = '©µ±ö€•';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        "Defendant's last name must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas",
      );
    },
  );

  it(
    '(AC7) Validation will exist for the Date of birth field - future date',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      const futureDateStr = calculateWeeksInFuture(1);

      // Future date validation
      fixedPenaltyMock.personalDetails.formData.fm_personal_details_dob = futureDateStr;
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter a valid date of birth in the past');
    },
  );

  it(
    '(AC7) Validation will exist for the Date of birth field - incorrect format',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      // Letters, incorrect days or months validation
      fixedPenaltyMock.personalDetails.formData.fm_personal_details_dob = 'abc/de/fghi';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter date of birth in the format DD/MM/YYYY');
    },
  );

  it(
    '(AC7) Validation will exist for the Date of birth field - invalid date',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      // Invalid date validation
      fixedPenaltyMock.personalDetails.formData.fm_personal_details_dob = '32/13/2000';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter a valid date of birth');
    },
  );

  it(
    '(AC7) Validation will exist for the Date of birth field - special characters',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      // Special characters validation
      fixedPenaltyMock.personalDetails.formData.fm_personal_details_dob = '01@01#2000';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter date of birth in the format DD/MM/YYYY');
    },
  );

  it(
    '(AC7e) Validation will exist for the Date of birth field - no separators',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.personalDetails.formData.fm_personal_details_dob = '01012000';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter date of birth in the format DD/MM/YYYY');
    },
  );

  it(
    '(AC8) Validation will exist for the Address Line 1 field - empty value',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      // User does not provide a value
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        'Enter address line 1, typically the building and street',
      );
    },
  );

  it(
    '(AC8) Validation will exist for the Address Line 1 field - max length',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      // User enters more than 30 characters
      const longAddress = 'A'.repeat(31); // Exceeds 30 characters
      fixedPenaltyMock.personalDetails.formData.fm_personal_details_address_line_1 = longAddress;
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Address line 1 must be 30 characters or fewer');
    },
  );

  it(
    '(AC8) Validation will exist for the Address Line 1 field - special characters',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.personalDetails.formData.fm_personal_details_address_line_1 = '123 High Street $%^&*';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Address line 1 must only contain letters or numbers');
    },
  );

  it(
    '(AC9) Validation will exist for the Address Line 2 field - max length',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      // User enters more than 30 characters
      const longAddress = 'A'.repeat(31); // Exceeds 30 characters
      fixedPenaltyMock.personalDetails.formData.fm_personal_details_address_line_2 = longAddress;
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Address line 2 must be 30 characters or fewer');
    },
  );

  it(
    '(AC9) Validation will exist for the Address Line 2 field - special characters',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      // User enters non-alphanumeric characters
      fixedPenaltyMock.personalDetails.formData.fm_personal_details_address_line_2 = 'Apartment 123 $%^&*';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Address line 2 must only contain letters or numbers');
    },
  );

  it(
    '(AC10) Validation will exist for the Address Line 3 field - max length',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      // User enters more than 16 characters
      const longAddress = 'A'.repeat(17); // Exceeds 16 characters
      fixedPenaltyMock.personalDetails.formData.fm_personal_details_address_line_3 = longAddress;
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Address line 3 must be 16 characters or fewer');
    },
  );

  it(
    '(AC10) Validation will exist for the Address Line 3 field - special characters',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      // User enters non-alphanumeric characters
      fixedPenaltyMock.personalDetails.formData.fm_personal_details_address_line_3 = 'West $%^&*';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Address line 3 must only contain letters or numbers');
    },
  );

  it(
    '(AC11) Validation will exist for the Postcode field - max length',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      // User enters more than 8 characters
      const longPostcode = 'A'.repeat(9); // Exceeds 8 characters
      fixedPenaltyMock.personalDetails.formData.fm_personal_details_post_code = longPostcode;
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Postcode must be 8 characters or fewer');
    },
  );

  it(
    '(AC11) Validation will exist for the Postcode field - special characters',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      // User enters non-alphanumeric characters
      fixedPenaltyMock.personalDetails.formData.fm_personal_details_post_code = 'SW1A$%^&';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Postcode must only contain letters or numbers');
    },
  );

  it(
    '(AC12) Validation will exist for the Notice number field - required field',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      setupComponent();

      // User does not provide a value
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter Notice number');
    },
  );

  it(
    '(AC12) Validation will exist for the Notice number field - max length',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_notice_number = 'A'.repeat(17); // Exceeds 16 characters
      setupComponent();
      // User enters more than 16 characters
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Notice number must be 16 characters or fewer');
    },
  );

  it(
    '(AC12) Validation will exist for the Notice number field - special characters',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_notice_number = 'FPN12 $%^&*';
      setupComponent();

      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Notice number must only contain letters or numbers');
    },
  );

  it(
    '(AC13) Validation will exist for the Registration number field - required field',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      setupComponent();

      // Select Vehicle radio button to make the field required
      cy.get(DOM_ELEMENTS.vehicleRadioButton).check();

      // User does not provide a value when Vehicle is selected
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter Registration number');
    },
  );

  it(
    '(AC13) Validation will exist for the Registration number field - max length',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      const longRegNumber = 'A'.repeat(8); // Exceeds 7 characters
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_vehicle_registration_number = longRegNumber;
      setupComponent();
      cy.get(DOM_ELEMENTS.vehicleRadioButton).check();

      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Registration number must be 7 characters or fewer');
    },
  );

  it(
    '(AC13) Validation will exist for the Registration number field - special characters',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_vehicle_registration_number = 'ABC1%^&';
      setupComponent();
      cy.get(DOM_ELEMENTS.vehicleRadioButton).check();

      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        'Registration number must only contain letters or numbers',
      );
    },
  );

  it(
    '(AC14, AC5, AC6) Validation for the Driving licence number field is only triggered when an adult or youth defendant enters a value',
    { tags: [...buildTags('@JIRA-STORY:PO-857', '@JIRA-STORY:PO-3414'), '@JIRA-EPIC:PO-855'] },
    () => {
      setupComponent();
      cy.get(DOM_ELEMENTS.vehicleRadioButton).check();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');
      cy.get(DOM_ELEMENTS.errorSummaryList).should('not.contain', 'Driving licence number');
    },
  );

  it(
    '(AC14, AC2, AC3) Validation for the Driving licence number field accepts 1 to 5 surname characters using the correct 9 padding when a value is entered',
    { tags: [...buildTags('@JIRA-STORY:PO-857', '@JIRA-STORY:PO-3414'), '@JIRA-EPIC:PO-855'] },
    () => {
      const validDrivingLicences = [
        'SMITH010203ABXYZ',
        'SMIT9010203ABXYZ',
        'SMI99010203ABXYZ',
        'SM999010203ABXYZ',
        'S9999010203ABXYZ',
      ];

      setupComponent();
      cy.get(DOM_ELEMENTS.vehicleRadioButton).check();

      validDrivingLicences.forEach((drivingLicence) => {
        cy.get(DOM_ELEMENTS.drivingLicenceInput).clear().type(drivingLicence, { delay: 0 });
        cy.get(DOM_ELEMENTS.submitButton).click();
        cy.get(DOM_ELEMENTS.errorSummaryList).should('not.contain', DRIVING_LICENCE_NUMBER_FORMAT_ERROR);
      });
    },
  );

  it(
    '(AC14, AC1) Validation for the Driving licence number field rejects values longer than 16 characters',
    { tags: [...buildTags('@JIRA-STORY:PO-857', '@JIRA-STORY:PO-3414'), '@JIRA-EPIC:PO-855'] },
    () => {
      const longDrivingLicense = 'A'.repeat(17); // Exceeds 16 characters
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_driving_licence_number = longDrivingLicense;
      setupComponent();
      cy.get(DOM_ELEMENTS.vehicleRadioButton).check();

      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Driving licence number must be 16 characters or fewer');
    },
  );

  it(
    '(AC14, AC2, AC3, AC4) Validation for the Driving licence number field rejects invalid surname block values',
    { tags: [...buildTags('@JIRA-STORY:PO-857', '@JIRA-STORY:PO-3414'), '@JIRA-EPIC:PO-855'] },
    () => {
      const invalidDrivingLicences = ['99999010203ABXYZ', 'SMIT8010203ABXYZ'];

      setupComponent();
      cy.get(DOM_ELEMENTS.vehicleRadioButton).check();

      invalidDrivingLicences.forEach((drivingLicence) => {
        cy.get(DOM_ELEMENTS.drivingLicenceInput).clear().type(drivingLicence, { delay: 0 });
        cy.get(DOM_ELEMENTS.submitButton).click();
        cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', DRIVING_LICENCE_NUMBER_FORMAT_ERROR);
      });
    },
  );

  it(
    '(AC14) Validation will exist for the Driving licence number field - special characters',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_driving_licence_number = 'SMITH123$%^&*';
      setupComponent();
      cy.get(DOM_ELEMENTS.vehicleRadioButton).check();

      // User enters non-alphanumeric characters
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        'Driving licence number must only contain letters or numbers',
      );
    },
  );

  it(
    '(AC15) Validation for NTO/NTH field - max length',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_nto_nth = 'A'.repeat(11); // Exceeds 10 characters
      setupComponent();
      cy.get(DOM_ELEMENTS.vehicleRadioButton).check();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        'Notice to owner or hirer number (NTO/NTH) must be 10 characters or fewer',
      );
    },
  );

  it(
    '(AC15) Validation for NTO/NTH field - special characters',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_nto_nth = 'NTO$%^&*';
      setupComponent();
      cy.get(DOM_ELEMENTS.vehicleRadioButton).check();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        'Notice to owner or hirer number (NTO/NTH) must only contain letters or numbers',
      );
    },
  );

  it(
    '(AC16) Validation will exist for the Date notice to owner was issued field - future date',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_date_nto_issued = calculateWeeksInFuture(1);
      setupComponent();
      cy.get(DOM_ELEMENTS.vehicleRadioButton).check();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Date notice to owner issued must be in the past');
    },
  );

  it(
    '(AC16) Validation will exist for the Date notice to owner was issued field - invalid date',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_date_nto_issued = '40/30/2023';
      setupComponent();
      cy.get(DOM_ELEMENTS.vehicleRadioButton).check();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter a valid notice to owner date');
    },
  );

  it(
    '(AC16) Validation will exist for the Date notice to owner was issued field - incorrect format',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_date_nto_issued = 'abc/de/fghi';
      setupComponent();
      cy.get(DOM_ELEMENTS.vehicleRadioButton).check();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter notice to owner date in the format DD/MM/YYYY');
    },
  );

  it(
    '(AC16) Validation will exist for the Date notice to owner was issued field - special characters',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_date_nto_issued = '01@01#2023';
      setupComponent();
      cy.get(DOM_ELEMENTS.vehicleRadioButton).check();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter notice to owner date in the format DD/MM/YYYY');
    },
  );

  it(
    '(AC17) Validation will exist for the Date of offence field - required field',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      setupComponent();

      // User does not provide a value
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter date of offence');
    },
  );

  it(
    '(AC17) Validation will exist for the Date of offence field - future date',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_date_of_offence = calculateWeeksInFuture(1);
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Date of offence must be in the past');
    },
  );

  it(
    '(AC17) Validation will exist for the Date of offence field - format',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_date_of_offence = 'ab/cd/efgh';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Offence date must be in the format DD/MM/YYYY');
    },
  );

  it(
    '(AC17) Validation will exist for the Date of offence field - invalid date',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_date_of_offence = '32/13/2023';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter a valid offence date');
    },
  );

  it(
    '(AC17) Validation will exist for the Date of offence field - special characters',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_date_of_offence = '01@01#2023';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Offence date must be in the format DD/MM/YYYY');
    },
  );

  it(
    '(AC17) Validation will exist for the Date of offence field - no separators',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_date_of_offence = '01012023';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Offence date must be in the format DD/MM/YYYY');
    },
  );

  it(
    '(AC18) Validation will exist for the Offence code field - required field',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      setupComponent();

      // User does not provide a value
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter an offence code');
    },
  );

  it(
    '(AC18) Validation will exist for the Offence code field - max length',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      setupComponent();

      // User enters more than 8 characters
      const longOffenceCode = 'A'.repeat(9); // Exceeds 8 characters
      cy.get(DOM_ELEMENTS.offenceCodeInput).type(longOffenceCode, { delay: 0 });
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Offence code must be 7 or 8 characters');
    },
  );

  it(
    '(AC18) Validation will exist for the Offence code field - special characters',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      setupComponent();

      // User enters non-alphanumeric characters
      cy.get(DOM_ELEMENTS.offenceCodeInput).clear().type('CJ03$%^&', { delay: 0 });
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Offence code must only contain letters or numbers');
    },
  );

  it(
    '(AC19) Validation will exist for the Time of offence field - invalid hours',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_time_of_offence = '25:30';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        'Enter time of offence in the correct format, such as 02:00 or 14:00',
      );
    },
  );

  it(
    '(AC19) Validation will exist for the Time of offence field - invalid minutes',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_time_of_offence = '14:70';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        'Enter time of offence in the correct format, such as 02:00 or 14:00',
      );
    },
  );

  it(
    '(AC19) Validation will exist for the Time of offence field - incorrect format',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_time_of_offence = '14-30';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        'Enter time of offence in the correct format, such as 02:00 or 14:00',
      );
    },
  );

  it(
    '(AC19) Validation will exist for the Time of offence field - AM/PM format',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_time_of_offence = '2:30pm';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        'Enter time of offence in the correct format, such as 02:00 or 14:00',
      );
    },
  );

  it(
    '(AC19) Validation will exist for the Time of offence field - special characters',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_time_of_offence = '@!:$%';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        'Enter time of offence in the correct format, such as 02:00 or 14:00',
      );
    },
  );

  it(
    '(AC20) Validation will exist for the Place of offence field - required field',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      setupComponent();

      // User does not provide a value
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter where the offence took place');
    },
  );

  it(
    '(AC20) Validation will exist for the Place of offence field - max length',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_place_of_offence = 'A'.repeat(31); // Exceeds 30 characters
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Place of offence must be 30 characters or fewer');
    },
  );

  it(
    '(AC20) Validation will exist for the Place of offence field - special characters',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.fixedPenaltyDetails.formData.fm_offence_details_place_of_offence = 'High Street $%^&*';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        'Place of offence must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
      );
    },
  );

  it(
    '(AC21) Validation will exist for the Amount imposed field - required field',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      setupComponent();

      // User does not provide a value
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter amount imposed');
    },
  );

  it(
    '(AC21) Validation will exist for the Amount imposed field - non-numeric characters',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      setupComponent();

      // User enters amount with non-numeric characters
      cy.get(DOM_ELEMENTS.amountImposedInput).type('123.45abc', { delay: 0 });
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter valid amount');
    },
  );

  it(
    '(AC21) Validation will exist for the Amount imposed field - special characters',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      setupComponent();

      // User enters amount with special characters
      cy.get(DOM_ELEMENTS.amountImposedInput).clear().type('100$%^&*', { delay: 0 });
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter valid amount');
    },
  );

  it(
    '(AC21) Validation will exist for the Amount imposed field - max length',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      setupComponent();

      // User enters amount with more than 18 integers and 2 decimal places
      const longAmount = '1'.repeat(19) + '.99';
      cy.get(DOM_ELEMENTS.amountImposedInput).clear().type(longAmount, { delay: 0 });
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        'Enter an amount with no more than 18 digits before the decimal and 2 or fewer after',
      );
    },
  );

  it(
    '(AC21) Validation will exist for the Amount imposed field - decimal places',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      setupComponent();

      // User enters amount with more than 2 decimal places
      cy.get(DOM_ELEMENTS.amountImposedInput).clear().type('123.456', { delay: 0 });
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        'Enter an amount with no more than 18 digits before the decimal and 2 or fewer after',
      );
    },
  );

  it(
    '(AC22) Validation will exist for the Add comment field - max length',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.accountCommentsNotes.formData.fm_account_comments_notes_comments = 'A'.repeat(30);
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.characterCountHint).should('contain', 'You have 0 characters remaining');
    },
  );

  it.only(
    '(AC22) Validation will exist for the Add comment field - non-single-byte ASCII characters',
    {
      tags: [
        ...buildTags('@JIRA-STORY:PO-857', '@JIRA-STORY:PO-3415', '@JIRA-LABEL:populate-and-submit'),
        '@JIRA-KEY:POT-7259',
        '@JIRA-EPIC:PO-855',
        '@JIRA-EPIC:PO-2219',
      ],
    },
    () => {
      fixedPenaltyMock.accountCommentsNotes.formData.fm_account_comments_notes_comments = 'Test comment ©µ±ö€•';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ADD_COMMENT_ALLOWED_CHARACTERS_ERROR);
    },
  );

  it(
    '(AC23) Validation will exist for the Add account note field - max length',
    { tags: [...buildTags('@JIRA-STORY:PO-857'), '@JIRA-EPIC:PO-855'] },
    () => {
      // User enters more than 1000 characters
      fixedPenaltyMock.accountCommentsNotes.formData.fm_account_comments_notes_notes = 'A'.repeat(1000);
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.characterCountHint).should('contain', 'You have 0 characters remaining');
    },
  );

  it.only(
    '(AC23) Validation will exist for the Add account note field - non-single-byte ASCII characters',
    {
      tags: [
        ...buildTags('@JIRA-STORY:PO-857', '@JIRA-STORY:PO-3415', '@JIRA-LABEL:populate-and-submit'),
        '@JIRA-KEY:POT-7261',
        '@JIRA-EPIC:PO-855',
        '@JIRA-EPIC:PO-2219',
      ],
    },
    () => {
      // User enters non-alphanumeric characters
      fixedPenaltyMock.accountCommentsNotes.formData.fm_account_comments_notes_notes = 'Test account note ©µ±ö€•';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ADD_ACCOUNT_NOTE_ALLOWED_CHARACTERS_ERROR);
    },
  );

  it(
    'Validation will exist for Add comment and Add account note fields - special characters',
    { tags: [...buildTags('@JIRA-STORY:PO-3713'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.accountCommentsNotes.formData.fm_account_comments_notes_comments = 'Test comment $%^&*';
      fixedPenaltyMock.accountCommentsNotes.formData.fm_account_comments_notes_notes = 'Test account note $%^&*';
      setupComponent();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ADD_COMMENT_ALLOWED_CHARACTERS_ERROR);
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ADD_ACCOUNT_NOTE_ALLOWED_CHARACTERS_ERROR);
      cy.get(DOM_ELEMENTS.commentsErrorMessage).should('contain', ADD_COMMENT_ALLOWED_CHARACTERS_ERROR);
      cy.get(DOM_ELEMENTS.accountNoteErrorMessage).should('contain', ADD_ACCOUNT_NOTE_ALLOWED_CHARACTERS_ERROR);
    },
  );

  it(
    '(AC1a) The Fixed Penalty Details screen for company will be created as per the Design Artefacts',
    { tags: [...buildTags('@JIRA-STORY:PO-860'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.accountDetails.formData.fm_create_account_defendant_type = 'company';
      setupComponent(null);

      // Check company details section
      cy.get(DOM_ELEMENTS.companyNameInput).should('exist');
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

  it(
    '(AC5, AC6) Validation for the Driving licence number field is only triggered when a company defendant enters a value',
    { tags: [...buildTags('@JIRA-STORY:PO-860', '@JIRA-STORY:PO-3414'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.accountDetails.formData.fm_create_account_defendant_type = 'company';
      setupComponent(null);

      cy.get(DOM_ELEMENTS.vehicleRadioButton).check();
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');
      cy.get(DOM_ELEMENTS.errorSummaryList).should('not.contain', 'Driving licence number');
    },
  );

  it(
    '(AC1b, AC1c) Validation will exist for the Company Name field - no value provided',
    { tags: [...buildTags('@JIRA-STORY:PO-860'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.accountDetails.formData.fm_create_account_defendant_type = 'company';
      setupComponent(null);

      // User does not provide a value
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter company name');
    },
  );

  it(
    '(AC1b, AC1c) Validation will exist for the Company Name field - max length',
    { tags: [...buildTags('@JIRA-STORY:PO-860'), '@JIRA-EPIC:PO-855'] },
    () => {
      fixedPenaltyMock.accountDetails.formData.fm_create_account_defendant_type = 'company';
      setupComponent(null);

      // User enters more than 50 characters
      const longText = 'A'.repeat(51); // Exceeds 50 characters
      fixedPenaltyMock.companyDetails.formData.fm_company_details_company_name = longText;
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Company name must be 50 characters or fewer');
    },
  );

  it.only(
    '(AC1b, AC1c) Validation will exist for the Company Name field - non-single-byte ASCII characters',
    {
      tags: [
        ...buildTags('@JIRA-STORY:PO-860', '@JIRA-STORY:PO-3415', '@JIRA-LABEL:populate-and-submit'),
        '@JIRA-KEY:POT-7265',
        '@JIRA-EPIC:PO-855',
        '@JIRA-EPIC:PO-2219',
      ],
    },
    () => {
      fixedPenaltyMock.accountDetails.formData.fm_create_account_defendant_type = 'company';
      setupComponent(null);

      // User enters non-alphanumeric characters
      fixedPenaltyMock.companyDetails.formData.fm_company_details_company_name = 'Company©µ±ö€•';
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummaryList).should(
        'contain',
        'Company name must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas',
      );
    },
  );

  it(
    '(AC1a) If a user selects the "Search the offence list" link from the Fixed Penalty Details screen - a new tab will open within the relevant browser, displaying the "Search Offences" screen',
    { tags: [...buildTags('@JIRA-STORY:PO-1104'), '@JIRA-EPIC:PO-855'] },
    () => {
      setupComponent(null);

      cy.get(DOM_ELEMENTS.searchOffenceListLink).should('exist');
      cy.get(DOM_ELEMENTS.searchOffenceListLink).should('contain.text', 'search the offence list');

      cy.get(DOM_ELEMENTS.searchOffenceListLink).should('have.attr', 'target', '_blank');
      cy.get(DOM_ELEMENTS.searchOffenceListLink).should('have.attr', 'href').and('include', 'search-offences');

      cy.get(DOM_ELEMENTS.searchOffenceListLink).should('be.visible');
    },
  );

  it(
    '(AC2) AC1 will hold true whether the defendant is an Adult or Youth defendant',
    { tags: [...buildTags('@JIRA-STORY:PO-1104'), '@JIRA-EPIC:PO-855'] },
    () => {
      // Test with Adult/Youth defendant (default defendant type)
      setupComponent(null);
      cy.get(DOM_ELEMENTS.searchOffenceListLink).should('exist');
      cy.get(DOM_ELEMENTS.searchOffenceListLink).should('contain.text', 'search the offence list');
      cy.get(DOM_ELEMENTS.searchOffenceListLink).should('have.attr', 'target', '_blank');
      cy.get(DOM_ELEMENTS.searchOffenceListLink).should('have.attr', 'href').and('include', 'search-offences');
    },
  );

  it(
    '(AC2) AC1 will hold true whether the defendant is a Company defendant',
    { tags: [...buildTags('@JIRA-STORY:PO-1104'), '@JIRA-EPIC:PO-855'] },
    () => {
      // Test with Company defendant
      fixedPenaltyMock.accountDetails.formData.fm_create_account_defendant_type = 'company';
      setupComponent(null);

      cy.get(DOM_ELEMENTS.searchOffenceListLink).should('exist');
      cy.get(DOM_ELEMENTS.searchOffenceListLink).should('contain.text', 'search the offence list');
      cy.get(DOM_ELEMENTS.searchOffenceListLink).should('have.attr', 'target', '_blank');
      cy.get(DOM_ELEMENTS.searchOffenceListLink).should('have.attr', 'href').and('include', 'search-offences');
    },
  );

  it(
    '(AC5) should keep Prosecutors (All) visible and selectable as originators for non-filtered journeys',
    { tags: [...buildTags('@JIRA-STORY:PO-2761'), '@JIRA-EPIC:PO-2750'] },
    () => {
      const filteredLocalJusticeAreas: IOpalFinesLocalJusticeAreaRefData = {
        count: 1,
        refData: [OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK.refData[0]],
      };

      setupComponent(null, filteredLocalJusticeAreas);

      cy.get(DOM_ELEMENTS.issuingAuthorityInput).focus().click();
      cy.get(DOM_ELEMENTS.issuingAuthorityDropDown).should('contain', 'Central ticket office (998)');
      cy.get(DOM_ELEMENTS.issuingAuthorityDropDown).should('contain', 'Police force (123)');
      cy.get(DOM_ELEMENTS.issuingAuthorityDropDown).should('contain', 'Other (433)');

      cy.get(DOM_ELEMENTS.issuingAuthorityInput).clear().type('Police', { delay: 0 });
      cy.get(DOM_ELEMENTS.issuingAuthorityDropDown).first().click();
      cy.get(DOM_ELEMENTS.issuingAuthorityInput).should('have.value', 'Police force (123)');
    },
  );
});
