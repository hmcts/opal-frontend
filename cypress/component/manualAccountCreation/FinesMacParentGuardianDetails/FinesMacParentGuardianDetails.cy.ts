import { mount } from 'cypress/angular';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FinesMacParentGuardianDetailsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-parent-guardian-details/fines-mac-parent-guardian-details.component';
import {
  DOM_ELEMENTS,
  getAliasFirstName,
  getAliasLastName,
} from './constants/fines_mac_parent_guardian_details_elements';
import {
  MAIN_PERSONAL_DETAILS,
  ALIAS_PERSONAL_DETAILS,
  LENGTH_VALIDATION,
  FORMAT_CHECK,
  CORRECTION_TEST_MESSAGES,
} from './constants/fines_mac_parent_guardian_details_errors';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';

describe('FinesMacParentGuardianDetailsComponent', () => {
  let finesMacState = structuredClone(FINES_MAC_STATE_MOCK);

  const setupComponent = (formSubmit: any, mockDefendantType: string = '') => {
    mount(FinesMacParentGuardianDetailsComponent, {
      providers: [
        OpalFines,
        {
          provide: FinesMacStore,
          useFactory: () => {
            const store = new FinesMacStore();
            store.setFinesMacStore(finesMacState);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              snapshot: {
                url: [{ path: 'manual-account-creation' }],
              },
            },
          },
        },
      ],
      componentProperties: {
        handleParentGuardianDetailsSubmit: formSubmit,
        defendantType: mockDefendantType,
      },
    });
  };

  afterEach(() => {
    cy.then(() => {
      finesMacState.parentGuardianDetails.formData = {
        fm_parent_guardian_details_forenames: '',
        fm_parent_guardian_details_surname: '',
        fm_parent_guardian_details_add_alias: false,
        fm_parent_guardian_details_aliases: [],
        fm_parent_guardian_details_dob: '',
        fm_parent_guardian_details_national_insurance_number: '',
        fm_parent_guardian_details_address_line_1: '',
        fm_parent_guardian_details_address_line_2: '',
        fm_parent_guardian_details_address_line_3: '',
        fm_parent_guardian_details_post_code: '',
        fm_parent_guardian_details_vehicle_make: '',
        fm_parent_guardian_details_vehicle_registration_mark: '',
      };
    });
  });

  it('should render the child component', () => {
    setupComponent(null);

    // Verify the child component is rendered
    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it('should load all elements on the screen correctly', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Parent or guardian details');

    cy.get(DOM_ELEMENTS.firstNameInput).should('exist');
    cy.get(DOM_ELEMENTS.lastNameInput).should('exist');
    cy.get(DOM_ELEMENTS.dobInput).should('exist');
    cy.get(DOM_ELEMENTS.addressLine1Input).should('exist');
    cy.get(DOM_ELEMENTS.addressLine2Input).should('exist');
    cy.get(DOM_ELEMENTS.addressLine3Input).should('exist');
    cy.get(DOM_ELEMENTS.postcodeInput).should('exist');
    cy.get(DOM_ELEMENTS.vehicle_makeInput).should('exist');
    cy.get(DOM_ELEMENTS.vehicle_registration_markInput).should('exist');
    cy.get(DOM_ELEMENTS.niNumberInput).should('exist');

    cy.get(DOM_ELEMENTS.firstNameLabel).should('contain', 'First names');
    cy.get(DOM_ELEMENTS.lastNameLabel).should('contain', 'Last name');
    cy.get(DOM_ELEMENTS.dobLabel).should('contain', 'Date of birth');
    cy.get(DOM_ELEMENTS.addressLine1Label).should('contain', 'Address line 1');
    cy.get(DOM_ELEMENTS.addressLine2Label).should('contain', 'Address line 2');
    cy.get(DOM_ELEMENTS.addressLine3Label).should('contain', 'Address line 3');
    cy.get(DOM_ELEMENTS.postcodeLabel).should('contain', 'Postcode');
    cy.get(DOM_ELEMENTS.vehicleMakeLabel).should('contain', 'Make and model');
    cy.get(DOM_ELEMENTS.vehicleRegistrationMarkLabel).should('contain', 'Registration number');
    cy.get(DOM_ELEMENTS.niNumberLabel).should('contain', 'National Insurance number');
    cy.get(DOM_ELEMENTS.firstNameHint).should('contain', 'Include their middle names');
    cy.get(DOM_ELEMENTS.DateHint).should('contain', 'For example, 31/01/2023');
    cy.get(DOM_ELEMENTS.legend).should('contain', 'Parent or guardian vehicle details');
    cy.get(DOM_ELEMENTS.legend).should('contain', 'Parent or guardian address');

    cy.get(DOM_ELEMENTS.cancelLink).should('exist');
    cy.get(DOM_ELEMENTS.aliasAdd).should('exist');
  });

  it('should load alias elements on the screen correctly', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.aliasAdd).click();
    cy.get(DOM_ELEMENTS.legend).should('contain', 'Alias 1');

    cy.get(getAliasFirstName(0)).should('exist');
    cy.get(getAliasFirstName(0)).should('exist');
    cy.get(DOM_ELEMENTS.aliasAddButton).should('exist');
  });

  it('should load button for next page for adultOrYouthOnly Defendant', () => {
    setupComponent(null, 'adultOrYouthOnly');

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Add contact details');
  });

  it('should load button for next page for AYPG Defendant', () => {
    setupComponent(null, 'parentOrGuardianToPay');

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Add contact details');
  });

  it('should display validation error when mandatory fields are missing', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    for (const [, value] of Object.entries(MAIN_PERSONAL_DETAILS)) {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
    }
  });

  it('should display validation error when date of birth is in the future', () => {
    setupComponent(null);

    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_dob = '01/01/3000';
    cy.get(DOM_ELEMENTS.submitButton).first().click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK['dateOfBirthInFuture']);
  });

  it('should display validation error when date of birth is invalid', () => {
    setupComponent(null);

    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_dob = '01/01/abc';
    cy.get(DOM_ELEMENTS.submitButton).first().click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK['dateOfBirthInvalid']);
  });

  it('should not have any asterisks in address lines', () => {
    setupComponent(null);

    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_1 = 'dsad*';
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_2 = 'asd*';
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_3 = 'asd*';
    cy.get(DOM_ELEMENTS.submitButton).first().click();

    for (let i = 1; i <= 3; i++) {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK[`addressLine${i}ContainsSpecialCharacters`]);
    }
  });

  it('should not have firstnames,last names, vehicle registration mark and Address lines 1,2 & 3 having more than max characters', () => {
    setupComponent(null);

    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_forenames =
      'John Smithy Michael John Smithy Michael long';
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_surname =
      'Astridge Lamsden Langley Treen long';
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_1 = 'a'.repeat(31);
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_2 = 'a'.repeat(31);
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_3 = 'a'.repeat(31);
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_vehicle_registration_mark = 'a'.repeat(31);
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_vehicle_make = 'a'.repeat(31);
    cy.get(DOM_ELEMENTS.submitButton).first().click();

    for (const [key, value] of Object.entries(LENGTH_VALIDATION)) {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
    }
  });

  it('should have working alias workflow and remove button', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.aliasAdd).click();
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_forenames_0: 'John',
      fm_parent_guardian_details_alias_surname_0: 'Smith',
    });

    for (let i = 1; i <= 2; i++) {
      cy.get(DOM_ELEMENTS.aliasAddButton).click();
      finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
        [`fm_parent_guardian_details_alias_forenames_${i}`]: 'John',
        [`fm_parent_guardian_details_alias_surname_${i}`]: 'Smith',
      });
    }

    cy.get(DOM_ELEMENTS.aliasRemoveButton).click().click();
    cy.get(DOM_ELEMENTS.aliasAdd).click().click();

    cy.get(getAliasFirstName(0)).should('have.value', '');
    cy.get(getAliasLastName(0)).should('have.value', '');
  });

  it('should show error for missing alias', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.aliasAdd).click();
    cy.get(DOM_ELEMENTS.submitButton).first().click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', ALIAS_PERSONAL_DETAILS.missingAlias);
  });

  it('should show error for missing alias last name', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.aliasAdd).click();
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_surname_0: 'Smith',
    });
    cy.get(DOM_ELEMENTS.submitButton).first().click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', ALIAS_PERSONAL_DETAILS.missingAlias);
  });

  it('should show error for missing alias first name', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.aliasAdd).click();
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_forenames_0: 'John',
    });
    cy.get(DOM_ELEMENTS.submitButton).first().click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', ALIAS_PERSONAL_DETAILS.missingAliasLastName);
  });

  it('should show error for missing additional alias first name', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.aliasAdd).click();
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_forenames_0: 'John',
      fm_parent_guardian_details_alias_surname_0: 'Smith',
    });
    cy.get(DOM_ELEMENTS.aliasAddButton).click();
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_surname_1: 'Smith',
    });
    cy.get(DOM_ELEMENTS.submitButton).first().click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', ALIAS_PERSONAL_DETAILS.missingAlias);
  });

  it('should show error for missing additional alias last name', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.aliasAdd).click();
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_forenames_0: 'John',
      fm_parent_guardian_details_alias_surname_0: 'Smith',
    });
    cy.get(DOM_ELEMENTS.aliasAddButton).click();
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_forenames_0: 'John',
    });
    cy.get(DOM_ELEMENTS.submitButton).first().click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', ALIAS_PERSONAL_DETAILS.missingAliasLastName);
  });

  it('should show error for future date of birth', () => {
    setupComponent(null);

    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_forenames = 'John';
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_surname = 'smith';
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_dob = '01/01/2500';
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_1 = '120 street';

    cy.get(DOM_ELEMENTS.submitButton).first().click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Enter a valid date of birth in the past');
  });

  it('should show error for invalid date format', () => {
    setupComponent(null);

    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_dob = '01/01/12.';
    cy.get(DOM_ELEMENTS.submitButton).first().click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK['dateOfBirthInvalid']);
  });

  it('should not accept national insurance number in the incorrect format', () => {
    setupComponent(null);

    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_forenames = 'John';
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_surname = 'smith';
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_dob = '01/01/1990';
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_1 = '120 street';
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_national_insurance_number = 'AB1234565C';

    cy.get(DOM_ELEMENTS.submitButton).first().click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK['validNationalInsuranceNumber']);
  });

  it('should show errors for invalid mandatory fields and allow corrections and submit form', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_forenames =
      'John Jacob Jingleheimer Schmidt Jingleheimer';
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_surname =
      'smith Johnson Alexander Williams Brown Davis';
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_1 = '120 street*';

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    for (const [, value] of Object.entries(CORRECTION_TEST_MESSAGES)) {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
    }

    cy.get(DOM_ELEMENTS.firstNameInput).clear().focus().type('Coca Cola', { delay: 0 });
    cy.get(DOM_ELEMENTS.lastNameInput).clear().focus().type('Cola Family', { delay: 0 });
    cy.get(DOM_ELEMENTS.addressLine1Input).clear().focus().type('Pepsi Road', { delay: 0 });

    cy.get(DOM_ELEMENTS.submitButton).first().click();
    cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });
});
