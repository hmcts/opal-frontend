import { mount } from 'cypress/angular';
import { FinesMacPersonalDetailsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-personal-details/fines-mac-personal-details.component';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import {
  FORMAT_CHECK,
  MAIN_PERSONAL_DETAILS,
  ALIAS_PERSONAL_DETAILS,
  LENGTH_VALIDATION,
  CORRECTION_TEST_MESSAGES,
  VEHICLE_DETAILS_ERRORS,
} from './constants/fines_mac_personal_details_errors';
import { DOM_ELEMENTS, getAliasFirstName, getAliasLastName } from './constants/fines_mac_personal_details_elements';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { calculateDOB } from 'cypress/support/utils/dateUtils';

describe('FinesMacPersonalDetailsComponent', () => {
  let finesMacState = structuredClone(FINES_MAC_STATE_MOCK);

  const setupComponent = (formSubmit: any, defendantTypeMock: string = '') => {
    mount(FinesMacPersonalDetailsComponent, {
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
        handlePersonalDetailsSubmit: formSubmit,
        defendantType: defendantTypeMock,
      },
    });
  };

  afterEach(() => {
    cy.then(() => {
      finesMacState.personalDetails.formData = {
        fm_personal_details_title: '',
        fm_personal_details_forenames: '',
        fm_personal_details_surname: '',
        fm_personal_details_add_alias: null,
        fm_personal_details_aliases: [],
        fm_personal_details_dob: '',
        fm_personal_details_national_insurance_number: '',
        fm_personal_details_address_line_1: '',
        fm_personal_details_address_line_2: '',
        fm_personal_details_address_line_3: '',
        fm_personal_details_post_code: '',
        fm_personal_details_vehicle_make: '',
        fm_personal_details_vehicle_registration_mark: '',
      };
    });
  });
  it('(AC.1a) should load all elements on the screen correctly', { tags: ['@PO-272', '@PO-360'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Personal details');

    cy.get(DOM_ELEMENTS.firstNameInput).should('exist');
    cy.get(DOM_ELEMENTS.lastNameInput).should('exist');
    cy.get(DOM_ELEMENTS.dobInput).should('exist');
    cy.get(DOM_ELEMENTS.addressLine1Input).should('exist');
    cy.get(DOM_ELEMENTS.addressLine2Input).should('exist');
    cy.get(DOM_ELEMENTS.addressLine3Input).should('exist');
    cy.get(DOM_ELEMENTS.postcodeInput).should('exist');
    cy.get(DOM_ELEMENTS.niNumberInput).should('exist');

    cy.get(DOM_ELEMENTS.firstNameLabel).should('contain', 'First names');
    cy.get(DOM_ELEMENTS.lastNameLabel).should('contain', 'Last name');
    cy.get(DOM_ELEMENTS.dobLabel).should('contain', 'Date of birth');
    cy.get(DOM_ELEMENTS.addressLine1Label).should('contain', 'Address line 1');
    cy.get(DOM_ELEMENTS.addressLine2Label).should('contain', 'Address line 2');
    cy.get(DOM_ELEMENTS.addressLine3Label).should('contain', 'Address line 3');
    cy.get(DOM_ELEMENTS.postcodeLabel).should('contain', 'Postcode');
    cy.get(DOM_ELEMENTS.niNumberLabel).should('contain', 'National Insurance number');
    cy.get(DOM_ELEMENTS.firstNameHint).should('contain', 'Include their middle names');
    cy.get(DOM_ELEMENTS.DateHint).should('contain', 'For example, 31/01/2023');
    cy.get(DOM_ELEMENTS.legend).should('contain', 'Address');

    cy.get(DOM_ELEMENTS.cancelLink).should('exist');
    cy.get(DOM_ELEMENTS.aliasAdd).should('exist');
  });

  it('(AC.1) should load button for next page for adultOrYouthOnly Defendant', { tags: ['@PO-272', '@PO-433'] }, () => {
    setupComponent(null, 'adultOrYouthOnly');

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Add contact details');
  });

  it('(AC.2) should load button for next page for AYPG Defendant', { tags: ['@PO-344', '@PO-369'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Add offence details');
  });

  it(
    '(AC.2, AC.3) should display validation error when mandatory fields are missing',
    { tags: ['@PO-272', '@PO-360'] },
    () => {
      setupComponent(null);

      cy.get(DOM_ELEMENTS.submitButton).click();

      for (const [key, value] of Object.entries(MAIN_PERSONAL_DETAILS)) {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
      }
    },
  );

  it('(AC.1b) should not have any asterisks in address lines', { tags: ['@PO-272', '@PO-360'] }, () => {
    setupComponent(null);

    finesMacState.personalDetails.formData.fm_personal_details_address_line_1 = 'asja*';
    finesMacState.personalDetails.formData.fm_personal_details_address_line_2 = 'asja*';
    finesMacState.personalDetails.formData.fm_personal_details_address_line_3 = 'asja*';
    cy.get(DOM_ELEMENTS.submitButton).click();

    for (let i = 1; i <= 3; i++) {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK[`addressLine${i}ContainsSpecialCharacters`]);
    }
  });

  it(
    '(AC.1a) should not allow first names,last names and Address lines 1,2 & 3 to have more than max characters',
    { tags: ['@PO-272', '@PO-360'] },
    () => {
      setupComponent(null);

      finesMacState.personalDetails.formData.fm_personal_details_forenames =
        'John Smithy Michael John Smithy Michael long';
      finesMacState.personalDetails.formData.fm_personal_details_surname = 'Astridge Lamsden Langley Treen long';
      finesMacState.personalDetails.formData.fm_personal_details_address_line_1 = 'a'.repeat(31);
      finesMacState.personalDetails.formData.fm_personal_details_address_line_2 = 'a'.repeat(31);
      finesMacState.personalDetails.formData.fm_personal_details_address_line_3 = 'a'.repeat(31);

      cy.get(DOM_ELEMENTS.submitButton).click();

      for (const [key, value] of Object.entries(LENGTH_VALIDATION)) {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
      }
    },
  );
  it('(AC.4) should validate the functionality of the Add Aliases tick box', { tags: ['@PO-272', '@PO-360'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.aliasAdd).click();
    cy.get(DOM_ELEMENTS.legend).should('contain', 'Alias 1');

    cy.get(getAliasFirstName(0)).should('exist');
    cy.get(getAliasLastName(0)).should('exist');

    cy.get(DOM_ELEMENTS.aliasAddButton).should('exist');
    cy.get(DOM_ELEMENTS.aliasRemoveButton).should('not.exist');
  });

  it(
    '(AC.5, AC.6, AC.7) should have working alias workflow and remove button',
    { tags: ['@PO-272', '@PO-360'] },
    () => {
      setupComponent(null);

      cy.get(DOM_ELEMENTS.aliasAdd).click();
      cy.get(DOM_ELEMENTS.aliasAddButton).click();

      cy.get(getAliasFirstName(0)).should('exist');
      cy.get(getAliasLastName(0)).should('exist');

      cy.get(getAliasFirstName(1)).should('exist');
      cy.get(getAliasLastName(1)).should('exist');
      cy.get(DOM_ELEMENTS.legend).should('contain', 'Alias 2');
      cy.get(DOM_ELEMENTS.aliasRemoveButton).should('exist');

      cy.get(DOM_ELEMENTS.aliasAddButton).click();
      cy.get(getAliasFirstName(2)).should('exist');
      cy.get(getAliasLastName(2)).should('exist');
      cy.get(DOM_ELEMENTS.legend).should('contain', 'Alias 3');
      cy.get(DOM_ELEMENTS.aliasRemoveButton).should('exist');

      cy.get(DOM_ELEMENTS.aliasAddButton).click();
      cy.get(getAliasFirstName(3)).should('exist');
      cy.get(getAliasLastName(3)).should('exist');
      cy.get(DOM_ELEMENTS.legend).should('contain', 'Alias 4');
      cy.get(DOM_ELEMENTS.aliasRemoveButton).should('exist');

      cy.get(DOM_ELEMENTS.aliasAddButton).click();
      cy.get(getAliasFirstName(4)).should('exist');
      cy.get(getAliasLastName(4)).should('exist');
      cy.get(DOM_ELEMENTS.legend).should('contain', 'Alias 5');
      cy.get(DOM_ELEMENTS.aliasRemoveButton).should('exist');

      cy.get(DOM_ELEMENTS.aliasRemoveButton).click();
      cy.get(getAliasFirstName(4)).should('not.exist');
      cy.get(getAliasLastName(4)).should('not.exist');
      cy.get(DOM_ELEMENTS.legend).should('not.contain', 'Alias 5');

      cy.get(DOM_ELEMENTS.aliasRemoveButton).click();
      cy.get(getAliasFirstName(3)).should('not.exist');
      cy.get(getAliasLastName(3)).should('not.exist');
      cy.get(DOM_ELEMENTS.legend).should('not.contain', 'Alias 4');

      cy.get(DOM_ELEMENTS.aliasRemoveButton).click();
      cy.get(getAliasFirstName(2)).should('not.exist');
      cy.get(getAliasLastName(2)).should('not.exist');
      cy.get(DOM_ELEMENTS.legend).should('not.contain', 'Alias 3');

      cy.get(DOM_ELEMENTS.aliasRemoveButton).click();
      cy.get(getAliasFirstName(1)).should('not.exist');
      cy.get(getAliasLastName(1)).should('not.exist');
      cy.get(DOM_ELEMENTS.legend).should('not.contain', 'Alias 2');
    },
  );

  it('(AC.8) should validate unticking add aliases removes all aliases', { tags: ['@PO-272', '@PO-360'] }, () => {
    setupComponent(null);
    cy.get(DOM_ELEMENTS.aliasAdd).check();
    cy.get(DOM_ELEMENTS.aliasAddButton).click();
    finesMacState.personalDetails.formData.fm_personal_details_aliases.push({
      [`fm_personal_details_alias_forenames_${0}`]: 'AliasFNAME1',
      [`fm_personal_details_alias_surname_${0}`]: 'AliasLNAME1',
    });
    finesMacState.personalDetails.formData.fm_personal_details_aliases.push({
      [`fm_personal_details_alias_forenames_${1}`]: 'AliasFNAME2',
      [`fm_personal_details_alias_surname_${1}`]: 'AliasLNAME2',
    });
    cy.get(getAliasFirstName(0)).should('have.value', 'AliasFNAME1');
    cy.get(getAliasLastName(0)).should('have.value', 'AliasLNAME1');
    cy.get(getAliasFirstName(1)).should('have.value', 'AliasFNAME2');
    cy.get(getAliasLastName(1)).should('have.value', 'AliasLNAME2');

    cy.get(DOM_ELEMENTS.aliasAdd).uncheck();
    cy.get(DOM_ELEMENTS.aliasAdd).check();
    cy.get(getAliasFirstName(0)).should('have.value', '');
    cy.get(getAliasLastName(0)).should('have.value', '');

    cy.get(getAliasFirstName(1)).should('not.exist');
    cy.get(getAliasLastName(1)).should('not.exist');
  });

  it('(AC.10) should show error for missing alias', { tags: ['@PO-272', '@PO-360'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.aliasAdd).click();
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', ALIAS_PERSONAL_DETAILS.missingAliasFirstName);
  });

  it('(AC.10) should show error for missing alias last name', { tags: ['@PO-272', '@PO-360'] }, () => {
    setupComponent(null);

    finesMacState.personalDetails.formData.fm_personal_details_add_alias = true;
    finesMacState.personalDetails.formData.fm_personal_details_aliases.push({
      fm_personal_details_alias_surname_0: 'Smith',
    });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', ALIAS_PERSONAL_DETAILS.missingAliasFirstName);
    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', ALIAS_PERSONAL_DETAILS.missingAliasLastName);
  });

  it('(AC.10) should show error for missing alias first name', { tags: ['@PO-272', '@PO-360'] }, () => {
    setupComponent(null);

    finesMacState.personalDetails.formData.fm_personal_details_add_alias = true;
    finesMacState.personalDetails.formData.fm_personal_details_aliases.push({
      fm_personal_details_alias_forenames_0: 'John',
    });
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', ALIAS_PERSONAL_DETAILS.missingAliasLastName);
    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', ALIAS_PERSONAL_DETAILS.missingAliasFirstName);
  });

  it('(AC.10) should show error for missing additional alias first name', { tags: ['@PO-272', '@PO-360'] }, () => {
    setupComponent(null);

    finesMacState.personalDetails.formData.fm_personal_details_add_alias = true;
    finesMacState.personalDetails.formData.fm_personal_details_aliases.push({
      fm_personal_details_alias_forenames_0: 'John',
      fm_personal_details_alias_surname_0: 'Smith',
    });
    cy.get(DOM_ELEMENTS.aliasAddButton).click();
    finesMacState.personalDetails.formData.fm_personal_details_aliases.push({
      fm_personal_details_alias_surname_1: 'Smith',
    });
    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', `${ALIAS_PERSONAL_DETAILS.missingAliasFirstName} 1`);
    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', `${ALIAS_PERSONAL_DETAILS.missingAliasLastName} 1`);

    cy.get(DOM_ELEMENTS.errorSummary).should('contain', `${ALIAS_PERSONAL_DETAILS.missingAliasFirstName} 2`);
    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', `${ALIAS_PERSONAL_DETAILS.missingAliasLastName} 2`);

    cy.get(DOM_ELEMENTS.errorSummary).should('contain', `${ALIAS_PERSONAL_DETAILS.missingAliasFirstName} 3`);
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', `${ALIAS_PERSONAL_DETAILS.missingAliasLastName} 3`);
  });

  it('(AC.10) should show error for missing additional alias last name', { tags: ['@PO-272', '@PO-360'] }, () => {
    setupComponent(null);

    finesMacState.personalDetails.formData.fm_personal_details_add_alias = true;
    finesMacState.personalDetails.formData.fm_personal_details_aliases.push({
      fm_personal_details_alias_forenames_0: 'John',
      fm_personal_details_alias_surname_0: 'Smith',
    });
    cy.get(DOM_ELEMENTS.aliasAddButton).click();
    finesMacState.personalDetails.formData.fm_personal_details_aliases.push({
      fm_personal_details_alias_forenames_1: 'John',
    });
    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', `${ALIAS_PERSONAL_DETAILS.missingAliasFirstName} 1`);
    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', `${ALIAS_PERSONAL_DETAILS.missingAliasLastName} 1`);

    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', `${ALIAS_PERSONAL_DETAILS.missingAliasFirstName} 2`);
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', `${ALIAS_PERSONAL_DETAILS.missingAliasLastName} 2`);

    cy.get(DOM_ELEMENTS.errorSummary).should('contain', `${ALIAS_PERSONAL_DETAILS.missingAliasFirstName} 3`);
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', `${ALIAS_PERSONAL_DETAILS.missingAliasLastName} 3`);
  });

  it('(AC.9) should show error for future date of birth', { tags: ['@PO-272', '@PO-360'] }, () => {
    setupComponent(null);

    finesMacState.personalDetails.formData.fm_personal_details_title = 'Mrs';
    finesMacState.personalDetails.formData.fm_personal_details_forenames = 'John';
    finesMacState.personalDetails.formData.fm_personal_details_forenames = 'Smith';
    finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/3000';
    finesMacState.personalDetails.formData.fm_personal_details_address_line_1 = '123 fake street';
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Enter a valid date of birth in the past');
  });

  it('(AC.9) should show error for invalid date format', { tags: ['@PO-272', '@PO-360'] }, () => {
    setupComponent(null);

    finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/,.';
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK['dateOfBirthInvalid']);
  });

  it(
    '(AC.11) should not accept national insurance number in the incorrect format',
    { tags: ['@PO-272', '@PO-360'] },
    () => {
      setupComponent(null);

      finesMacState.personalDetails.formData.fm_personal_details_title = 'Mrs';
      finesMacState.personalDetails.formData.fm_personal_details_forenames = 'John';
      finesMacState.personalDetails.formData.fm_personal_details_forenames = 'Smith';
      finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/3000';
      finesMacState.personalDetails.formData.fm_personal_details_address_line_1 = '123 fake street';
      finesMacState.personalDetails.formData.fm_personal_details_national_insurance_number = 'AB1234565C';

      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK['validNationalInsuranceNumber']);
    },
  );

  it(
    '(AC.12) should show errors for invalid mandatory fields and allow corrections',
    { tags: ['@PO-272', '@PO-360'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');

      setupComponent(mockFormSubmit, 'adultOrYouthOnly');

      finesMacState.personalDetails.formData.fm_personal_details_forenames = 'Stuart Philips aarogyam Guuci Coach VII';
      finesMacState.personalDetails.formData.fm_personal_details_surname =
        'Chicago bulls Burberry RedBull 2445 PizzaHut';
      finesMacState.personalDetails.formData.fm_personal_details_address_line_1 = 'test Road *12';

      cy.get(DOM_ELEMENTS.submitButton).contains('Return to account details').click();

      for (const [, value] of Object.entries(CORRECTION_TEST_MESSAGES)) {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
      }

      cy.get(DOM_ELEMENTS.titleInput).select('Mr');
      cy.get(DOM_ELEMENTS.firstNameInput).clear().type('f', { delay: 0 });
      cy.get(DOM_ELEMENTS.lastNameInput).clear().type('s', { delay: 0 });
      cy.get(DOM_ELEMENTS.addressLine1Input).clear().type('addr', { delay: 0 });

      cy.get(DOM_ELEMENTS.submitButton).contains('Return to account details').click();
      cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');

      cy.get('@formSubmitSpy').should('have.been.calledOnce');
    },
  );

  it(
    '(AC.5) should render vehicle details for adultOrYouthOnly defendant type and validate max length of data',
    { tags: ['@PO-272', '@PO-502'] },
    () => {
      setupComponent(null, 'adultOrYouthOnly');

      // Verify the vehicle details section is rendered
      cy.get(DOM_ELEMENTS.vehicleRegistrationMarkLabel).should('contain', 'Registration number');
      cy.get(DOM_ELEMENTS.vehicleMakeLabel).should('contain', 'Make and model');
      cy.get(DOM_ELEMENTS.vehicle_makeInput).should('exist');
      cy.get(DOM_ELEMENTS.vehicle_registration_markInput).should('exist');
      finesMacState.personalDetails.formData.fm_personal_details_vehicle_make = 'a'.repeat(51);
      finesMacState.personalDetails.formData.fm_personal_details_vehicle_registration_mark = 'a'.repeat(24);

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      for (const [, value] of Object.entries(VEHICLE_DETAILS_ERRORS)) {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
      }
    },
  );
  it('(AC.2) should display age panel when entering a valid age for youth', { tags: ['@PO-272', '@PO-502'] }, () => {
    setupComponent(null);
    const age = 17;
    finesMacState.personalDetails.formData.fm_personal_details_dob = calculateDOB(age);
    cy.get('.moj-ticket-panel').should('exist');
    cy.get('opal-lib-moj-ticket-panel').find('strong').should('contain.text', age);
    cy.get('.moj-ticket-panel').find('p').should('contain.text', 'Youth');
  });
  it('(AC.3) should display age panel when entering a valid age for adult', { tags: ['@PO-272', '@PO-502'] }, () => {
    setupComponent(null);
    const age = 18;
    finesMacState.personalDetails.formData.fm_personal_details_dob = calculateDOB(age);
    cy.get('.moj-ticket-panel').should('exist');
    cy.get('opal-lib-moj-ticket-panel').find('strong').should('contain.text', age);
    cy.get('.moj-ticket-panel').find('p').should('contain.text', 'Adult');
  });

  it('(AC.5) should not render vehicle details for AY-PG defendant type', { tags: ['@PO-344', '@PO-505'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');

    // Verify the vehicle details section is not rendered
    cy.get(DOM_ELEMENTS.vehicleRegistrationMarkLabel).should('not.exist');
    cy.get(DOM_ELEMENTS.vehicleMakeLabel).should('not.exist');
    cy.get(DOM_ELEMENTS.vehicle_makeInput).should('not.exist');
    cy.get(DOM_ELEMENTS.vehicle_registration_markInput).should('not.exist');
  });
  it('(AC.1) (AC.2) Personal details should capitalise - AYPG', { tags: ['@PO-344', '@PO-1449'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit, 'parentOrGuardianToPay');

    cy.get(DOM_ELEMENTS.titleInput).select('Mr');
    cy.get(DOM_ELEMENTS.firstNameInput).clear().type('fname', { delay: 0 });
    cy.get(DOM_ELEMENTS.addressLine1Input).clear().type('addr', { delay: 0 });

    cy.get(DOM_ELEMENTS.lastNameInput).type('lname', { delay: 0 });
    cy.get(DOM_ELEMENTS.lastNameInput).blur();
    cy.get(DOM_ELEMENTS.postcodeInput).type('sl86et', { delay: 0 });
    cy.get(DOM_ELEMENTS.postcodeInput).blur();
    cy.get(DOM_ELEMENTS.niNumberInput).type('ab712348b', { delay: 0 });
    cy.get(DOM_ELEMENTS.niNumberInput).blur();

    cy.get(DOM_ELEMENTS.lastNameInput).should('have.value', 'LNAME');
    cy.get(DOM_ELEMENTS.postcodeInput).should('have.value', 'SL86ET');
    cy.get(DOM_ELEMENTS.niNumberInput).should('have.value', 'AB712348B');
    cy.get(DOM_ELEMENTS.aliasAdd).click();
    cy.get(getAliasFirstName(0)).type('alias0fname');
    cy.get(getAliasLastName(0)).type('alias0lname').should('have.value', 'ALIAS0LNAME');

    // Add the remaining four aliases using loop
    for (let i = 1; i < 5; i++) {
      cy.get(DOM_ELEMENTS.aliasAddButton).click();
      cy.get(getAliasFirstName(i)).type(`alias${i + 1}fname`);
      cy.get(getAliasLastName(i))
        .type(`alias${i + 1}lname`)
        .should('have.value', `ALIAS${i + 1}LNAME`);
    }

    cy.get(DOM_ELEMENTS.submitButton).contains('Return to account details').click();
  });
});
