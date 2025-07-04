import { mount } from 'cypress/angular';
import { FinesMacFixedPenaltyDetailsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-fixed-penalty-details/fines-mac-fixed-penalty-details.component';
import { ActivatedRoute } from '@angular/router';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { FinesMacStore } from '../../../../src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_MAC_STATE_MOCK } from '../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FINES_FIXED_PENALTY_MOCK } from './mocks/fines_mac_fixed_penalty_mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { DOM_ELEMENTS } from './constants/fines_mac_manual_fixed_penalty_elements';
import { ERROR_MESSAGES } from './constants/fines_mac_manual_fixed_penalty_error_messages';
import { provideHttpClient } from '@angular/common/http';

describe('FinesMacManualFixedPenalty', () => {
  const setupComponent = (formSubmit: any = null, mockData = FINES_MAC_STATE_MOCK) => {
    mount(FinesMacFixedPenaltyDetailsComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        {
          provide: FinesMacStore,
          useFactory: () => {
            const store = new FinesMacStore();
            store.setFinesMacStore(mockData);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                courts: OPAL_FINES_COURT_REF_DATA_MOCK
              },
              parent: {
                url: [{ path: 'manual-account-creation' }],
              },
            },
          },
        },
      ],
      componentProperties: {
        handleFixedPenaltyDetailsSubmit: formSubmit
      },
    });
  };

  it('(AC1) The Fixed Penalty Details screen will be created as per the Design Artefacts', { tags: ['@PO-857'] }, () => {
    setupComponent();
    
    // Check personal details section
    cy.get(DOM_ELEMENTS.titleSelect).should('exist');
    cy.get(DOM_ELEMENTS.firstNameInput).should('exist');
    cy.get(DOM_ELEMENTS.lastNameInput).should('exist');
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
    cy.get(DOM_ELEMENTS.vehicleRegistrationInput).should('exist');
    cy.get(DOM_ELEMENTS.drivingLicenceInput).should('exist');
    cy.get(DOM_ELEMENTS.ntoNthInput).should('exist');
    cy.get(DOM_ELEMENTS.dateNtoIssuedInput).should('exist');

    // Check form buttons
    cy.get(DOM_ELEMENTS.submitButton).should('exist');
    
    // Submit empty form to check all validation messages
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.errorSummaryTitle).should('contain', 'There is a problem');
    
    // Verify all required field error messages are displayed
    const requiredErrorMessages = [
      'Select a title',
      'Enter defendant\'s first name(s)',
      'Enter defendant\'s last name',
      'Enter address line 1, typically the building and street',
      'Enter an Enforcement court',
      'Enter the issuing authority',
      'Enter Notice number',
      'Enter an offence code',
      'Enter where the offence took place',
      'Enter amount imposed',
      'Enter Registration number',
      'Enter Driving licence number'
    ];
    
    requiredErrorMessages.forEach(errorMsg => {
      cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', errorMsg);
    });
  });

  it('(AC2) Validation will exist for the Issuing Authority field', { tags: ['@PO-857'] }, () => {
    setupComponent();
    
    // User does not provide a value
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter the issuing authority');
    
    // User enters more than 41 characters
    const longText = 'A'.repeat(42); // Exceeds 41 characters
    cy.get(DOM_ELEMENTS.issuingAuthorityInput).type(longText);
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ERROR_MESSAGES.issuingAuthorityLength);
    
    // User enters non-alphanumeric characters (assuming there's validation for this)
    cy.get(DOM_ELEMENTS.issuingAuthorityInput).clear().type('Invalid@Authority#123');
    cy.get(DOM_ELEMENTS.submitButton).click();
    
    // Enter valid issuing authority
    cy.get(DOM_ELEMENTS.issuingAuthorityInput).clear().type(FINES_FIXED_PENALTY_MOCK.validIssuingAuthority);
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
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ERROR_MESSAGES.enforcementCourtLength);
    
    // User enters non-alphanumeric characters (assuming there's validation for this)
    cy.get(DOM_ELEMENTS.enforcementCourtInput).clear().type('Invalid@Court#123');
    cy.get(DOM_ELEMENTS.submitButton).click();
    
    // Enter valid enforcement court
    cy.get(DOM_ELEMENTS.enforcementCourtInput).clear().type(FINES_FIXED_PENALTY_MOCK.validEnforcementCourt);
  });

  it.only('(AC4) should submit form with all valid fields populated and verify form submission', { tags: ['@PO-857'] }, () => {
    // Create a spy for form submission
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit, FINES_FIXED_PENALTY_MOCK);
    
    // Section 1 - Court Details
    cy.get(DOM_ELEMENTS.issuingAuthorityInput).should('contain', "West London Police");
    cy.get(DOM_ELEMENTS.enforcementCourtInput).should('contain', "Westminster Magistrates' Court");
    
    // Section 2 - Personal Details
    cy.get(DOM_ELEMENTS.titleSelect).should('contain', 'Mr');
    cy.get(DOM_ELEMENTS.firstNameInput).should('contain', 'John');
    cy.get(DOM_ELEMENTS.lastNameInput).should('contain', 'Smith');
    cy.get(DOM_ELEMENTS.dobInput).should('have.value', '01/01/1990');
    
    // Section 3 - Address
    cy.get(DOM_ELEMENTS.addressLine1Input).should('contain', '123 Test Street');
    cy.get(DOM_ELEMENTS.addressLine2Input).should('contain', 'Test Area');
    cy.get(DOM_ELEMENTS.postcodeInput).should('contain', 'SW1A 1AA');
    
    // Section 5 - Offence Details
    cy.get(DOM_ELEMENTS.noticeNumberInput).should('contain', 'FPN12345678');
    cy.get(DOM_ELEMENTS.vehicleRegistrationInput).should('contain', 'AB12CDE');
    cy.get(DOM_ELEMENTS.drivingLicenceInput).should('contain', 'SMITH901011J99AB');
    cy.get(DOM_ELEMENTS.dateOfOffenceInput).should('have.value', '01/01/2023');
    cy.get(DOM_ELEMENTS.offenceCodeInput).should('have.value', 'CJ03507');
    cy.get(DOM_ELEMENTS.timeOfOffenceInput).should('have.value', '14:30');
    cy.get(DOM_ELEMENTS.placeOfOffenceInput).should('contain', 'Oxford Street, London');
    cy.get(DOM_ELEMENTS.amountImposedInput).should('have.value', '150');
    
    // Submit the form
    cy.get(DOM_ELEMENTS.submitButton).click();
    
    // No validation errors should be present
    cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');
    
    // Verify form submission was called
    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('(AC5) Optional fields can be submitted without values', { tags: ['@PO-857'] }, () => {
    setupComponent();
    
    // Fill in all required fields only
    cy.get(DOM_ELEMENTS.issuingAuthorityInput).type(FINES_FIXED_PENALTY_MOCK.validIssuingAuthority);
    cy.get(DOM_ELEMENTS.enforcementCourtInput).type(FINES_FIXED_PENALTY_MOCK.validEnforcementCourt);
    cy.get(DOM_ELEMENTS.titleSelect).select(FINES_FIXED_PENALTY_MOCK.validTitle);
    cy.get(DOM_ELEMENTS.firstNameInput).type(FINES_FIXED_PENALTY_MOCK.validFirstName);
    cy.get(DOM_ELEMENTS.lastNameInput).type(FINES_FIXED_PENALTY_MOCK.validLastName);
    cy.get(DOM_ELEMENTS.addressLine1Input).type(FINES_FIXED_PENALTY_MOCK.validAddressLine1);
    cy.get(DOM_ELEMENTS.postcodeInput).type(FINES_FIXED_PENALTY_MOCK.validPostcode);
    cy.get(DOM_ELEMENTS.noticeNumberInput).type(FINES_FIXED_PENALTY_MOCK.validNoticeNumber);
    cy.get(DOM_ELEMENTS.vehicleRadioButton).click();
    cy.get(DOM_ELEMENTS.vehicleRegistrationInput).type(FINES_FIXED_PENALTY_MOCK.validVehicleRegistration);
    cy.get(DOM_ELEMENTS.drivingLicenceInput).type(FINES_FIXED_PENALTY_MOCK.validDrivingLicence);
    cy.get(DOM_ELEMENTS.dateOfOffenceInput).type(FINES_FIXED_PENALTY_MOCK.validDateOfOffence);
    cy.get(DOM_ELEMENTS.offenceCodeInput).type(FINES_FIXED_PENALTY_MOCK.validOffenceCode);
    cy.get(DOM_ELEMENTS.placeOfOffenceInput).type(FINES_FIXED_PENALTY_MOCK.validPlaceOfOffence);
    cy.get(DOM_ELEMENTS.amountImposedInput).type(FINES_FIXED_PENALTY_MOCK.validAmountImposed);
    
    // Deliberately leave optional fields blank:
    // - Date of Birth (dobInput)
    // - Address Line 2 (addressLine2Input)
    // - Address Line 3 (addressLine3Input)
    // - Time of Offence (timeOfOffenceInput)
    // - NTO/NTH (ntoNthInput)
    // - Date NTO Issued (dateNtoIssuedInput)
    
    // Submit the form
    cy.get(DOM_ELEMENTS.submitButton).click();
    
    // No validation errors should be present
    cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');
  });
  
  it('(AC6) Date of Birth validation and age calculation', { tags: ['@PO-857'] }, () => {
    setupComponent();
    
    // Fill in all required fields
    cy.get(DOM_ELEMENTS.issuingAuthorityInput).type(FINES_FIXED_PENALTY_MOCK.validIssuingAuthority);
    cy.get(DOM_ELEMENTS.enforcementCourtInput).type(FINES_FIXED_PENALTY_MOCK.validEnforcementCourt);
    cy.get(DOM_ELEMENTS.titleSelect).select(FINES_FIXED_PENALTY_MOCK.validTitle);
    cy.get(DOM_ELEMENTS.firstNameInput).type(FINES_FIXED_PENALTY_MOCK.validFirstName);
    cy.get(DOM_ELEMENTS.lastNameInput).type(FINES_FIXED_PENALTY_MOCK.validLastName);
    cy.get(DOM_ELEMENTS.addressLine1Input).type(FINES_FIXED_PENALTY_MOCK.validAddressLine1);
    cy.get(DOM_ELEMENTS.postcodeInput).type(FINES_FIXED_PENALTY_MOCK.validPostcode);
    cy.get(DOM_ELEMENTS.noticeNumberInput).type(FINES_FIXED_PENALTY_MOCK.validNoticeNumber);
    cy.get(DOM_ELEMENTS.vehicleRadioButton).click();
    cy.get(DOM_ELEMENTS.vehicleRegistrationInput).type(FINES_FIXED_PENALTY_MOCK.validVehicleRegistration);
    cy.get(DOM_ELEMENTS.drivingLicenceInput).type(FINES_FIXED_PENALTY_MOCK.validDrivingLicence);
    cy.get(DOM_ELEMENTS.dateOfOffenceInput).type(FINES_FIXED_PENALTY_MOCK.validDateOfOffence);
    cy.get(DOM_ELEMENTS.offenceCodeInput).type(FINES_FIXED_PENALTY_MOCK.validOffenceCode);
    cy.get(DOM_ELEMENTS.placeOfOffenceInput).type(FINES_FIXED_PENALTY_MOCK.validPlaceOfOffence);
    cy.get(DOM_ELEMENTS.amountImposedInput).type(FINES_FIXED_PENALTY_MOCK.validAmountImposed);
    
    // Test future date of birth validation
    cy.get(DOM_ELEMENTS.dobInput).type(FINES_FIXED_PENALTY_MOCK.futureDob);
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', ERROR_MESSAGES.dateOfBirthFuture);
    
    // Test valid date of birth and age calculation
    cy.get(DOM_ELEMENTS.dobInput).clear().type(FINES_FIXED_PENALTY_MOCK.validDob);
    
    // Current date is June 30, 2025, validDob is 01/01/1990
    // Expected age is 35
    cy.get(DOM_ELEMENTS.ageCalcDisplay).should('contain', '35');
    cy.get(DOM_ELEMENTS.ageTypeDisplay).should('contain', 'Adult');
    
    // Test youth age type (under 18)
    const youthDob = '01/01/2010'; // 15 years old in 2025
    cy.get(DOM_ELEMENTS.dobInput).clear().type(youthDob);
    cy.get(DOM_ELEMENTS.ageCalcDisplay).should('contain', '15');
    cy.get(DOM_ELEMENTS.ageTypeDisplay).should('contain', 'Youth');
    
    // Submit form with valid DOB
    cy.get(DOM_ELEMENTS.dobInput).clear().type(FINES_FIXED_PENALTY_MOCK.validDob);
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');
  });
  
  it('(AC7) Vehicle vs Non-Vehicle offence type validation', { tags: ['@PO-857'] }, () => {
    setupComponent();
    
    // Fill in common required fields
    cy.get(DOM_ELEMENTS.issuingAuthorityInput).type(FINES_FIXED_PENALTY_MOCK.validIssuingAuthority);
    cy.get(DOM_ELEMENTS.enforcementCourtInput).type(FINES_FIXED_PENALTY_MOCK.validEnforcementCourt);
    cy.get(DOM_ELEMENTS.titleSelect).select(FINES_FIXED_PENALTY_MOCK.validTitle);
    cy.get(DOM_ELEMENTS.firstNameInput).type(FINES_FIXED_PENALTY_MOCK.validFirstName);
    cy.get(DOM_ELEMENTS.lastNameInput).type(FINES_FIXED_PENALTY_MOCK.validLastName);
    cy.get(DOM_ELEMENTS.addressLine1Input).type(FINES_FIXED_PENALTY_MOCK.validAddressLine1);
    cy.get(DOM_ELEMENTS.postcodeInput).type(FINES_FIXED_PENALTY_MOCK.validPostcode);
    cy.get(DOM_ELEMENTS.noticeNumberInput).type(FINES_FIXED_PENALTY_MOCK.validNoticeNumber);
    cy.get(DOM_ELEMENTS.dateOfOffenceInput).type(FINES_FIXED_PENALTY_MOCK.validDateOfOffence);
    cy.get(DOM_ELEMENTS.offenceCodeInput).type(FINES_FIXED_PENALTY_MOCK.validOffenceCode);
    cy.get(DOM_ELEMENTS.placeOfOffenceInput).type(FINES_FIXED_PENALTY_MOCK.validPlaceOfOffence);
    cy.get(DOM_ELEMENTS.amountImposedInput).type(FINES_FIXED_PENALTY_MOCK.validAmountImposed);
    
    // Verify Vehicle is selected by default and vehicle-specific fields are visible
    cy.get(DOM_ELEMENTS.vehicleRadioButton).should('be.checked');
    cy.get(DOM_ELEMENTS.vehicleRegistrationInput).should('be.visible');
    cy.get(DOM_ELEMENTS.drivingLicenceInput).should('be.visible');
    cy.get(DOM_ELEMENTS.ntoNthInput).should('be.visible');
    cy.get(DOM_ELEMENTS.dateNtoIssuedInput).should('be.visible');
    
    // Submit without entering vehicle fields
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter Registration number');
    cy.get(DOM_ELEMENTS.errorSummaryList).should('contain', 'Enter Driving licence number');
    
    // Enter vehicle fields
    cy.get(DOM_ELEMENTS.vehicleRegistrationInput).type(FINES_FIXED_PENALTY_MOCK.validVehicleRegistration);
    cy.get(DOM_ELEMENTS.drivingLicenceInput).type(FINES_FIXED_PENALTY_MOCK.validDrivingLicence);
    
    // Switch to non-vehicle
    cy.get(DOM_ELEMENTS.nonVehicleRadioButton).click();
    
    // Verify vehicle fields are hidden
    cy.get(DOM_ELEMENTS.vehicleRegistrationInput).should('not.be.visible');
    cy.get(DOM_ELEMENTS.drivingLicenceInput).should('not.be.visible');
    cy.get(DOM_ELEMENTS.ntoNthInput).should('not.be.visible');
    cy.get(DOM_ELEMENTS.dateNtoIssuedInput).should('not.be.visible');
    
    // Submit form with non-vehicle and verify no vehicle field errors
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');
  });
  
  it('(AC6) should submit form and validate form submission', { tags: ['@PO-857'] }, () => {
    // Create a spy for form submission
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    
    // Setup component with form submission handler
    setupComponent(mockFormSubmit);
    
    // Section 1 - Court Details
    cy.get(DOM_ELEMENTS.issuingAuthorityInput).type(FINES_FIXED_PENALTY_MOCK.validIssuingAuthority);
    cy.get(DOM_ELEMENTS.enforcementCourtInput).type(FINES_FIXED_PENALTY_MOCK.validEnforcementCourt);
    
    // Section 2 - Personal Details
    cy.get(DOM_ELEMENTS.titleSelect).select(FINES_FIXED_PENALTY_MOCK.validTitle);
    cy.get(DOM_ELEMENTS.firstNameInput).type(FINES_FIXED_PENALTY_MOCK.validFirstName);
    cy.get(DOM_ELEMENTS.lastNameInput).type(FINES_FIXED_PENALTY_MOCK.validLastName);
    cy.get(DOM_ELEMENTS.dobInput).type(FINES_FIXED_PENALTY_MOCK.validDob);
    
    // Section 3 - Address
    cy.get(DOM_ELEMENTS.addressLine1Input).type(FINES_FIXED_PENALTY_MOCK.validAddressLine1);
    cy.get(DOM_ELEMENTS.postcodeInput).type(FINES_FIXED_PENALTY_MOCK.validPostcode);
    
    // Section 5 - Offence Details (minimal required fields)
    cy.get(DOM_ELEMENTS.noticeNumberInput).type(FINES_FIXED_PENALTY_MOCK.validNoticeNumber);
    cy.get(DOM_ELEMENTS.vehicleRadioButton).click();
    cy.get(DOM_ELEMENTS.vehicleRegistrationInput).type(FINES_FIXED_PENALTY_MOCK.validVehicleRegistration);
    cy.get(DOM_ELEMENTS.dateOfOffenceInput).type(FINES_FIXED_PENALTY_MOCK.validDateOfOffence);
    cy.get(DOM_ELEMENTS.offenceCodeInput).type(FINES_FIXED_PENALTY_MOCK.validOffenceCode);
    
    // Submit the form
    cy.get(DOM_ELEMENTS.submitButton).click();
    
    // No validation errors should be present
    cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');
    
    // Verify form submission was called
    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });
});