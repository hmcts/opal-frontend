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
import {
  permittedSpecialCharacters,
  nonPermittedSpecialCharacters,
} from './constants/fines_mac_parent_guardian_details_character_check';

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

  it('should render the ParentGuardianDetails component', () => {
    setupComponent(null, 'parentOrGuardianToPay');
    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it(
    '(AC.1) should load all elements on the screen correctly',
    { tags: ['@PO-344', '@PO-364', '@PO-436', '@PO-569'] },
    () => {
      setupComponent(null, 'parentOrGuardianToPay');

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
      cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).should('exist');
      cy.get(DOM_ELEMENTS.addContactDetailsButton).should('exist');
    },
  );

  it('(AC.1) should have length validation on first name field', { tags: ['@PO-344', '@PO-569'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_forenames = 'a'.repeat(31);

    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', LENGTH_VALIDATION.firstNameTooLong);
  });
  it(
    '(AC.1) should permit a selection of special characters on first name field',
    { tags: ['@PO-344', '@PO-569'] },
    () => {
      cy.wrap(permittedSpecialCharacters).each((character: string) => {
        cy.then(() => {
          finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_forenames = character;
          setupComponent(null, 'parentOrGuardianToPay');
        });
        cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
        cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', FORMAT_CHECK.invalidFirstNames);
      });

      cy.wrap(nonPermittedSpecialCharacters).each((character: string) => {
        cy.then(() => {
          finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_forenames = character;
          setupComponent(null, 'parentOrGuardianToPay');
        });
        cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
        cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK.invalidFirstNames);
      });
    },
  );
  it('(AC.1) should have length validation on last name field', { tags: ['@PO-344', '@PO-569'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_surname = 'a'.repeat(31);

    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', LENGTH_VALIDATION.lastNameTooLong);
  });

  it(
    '(AC.1) should permit a selection of special characters on last name field',
    { tags: ['@PO-344', '@PO-569'] },
    () => {
      cy.wrap(permittedSpecialCharacters).each((character: string) => {
        cy.then(() => {
          finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_surname = character;
          setupComponent(null, 'parentOrGuardianToPay');
        });
        cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
        cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', FORMAT_CHECK.invalidLastNames);
      });

      cy.wrap(nonPermittedSpecialCharacters).each((character: string) => {
        cy.then(() => {
          finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_surname = character;
          setupComponent(null, 'parentOrGuardianToPay');
        });
        cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
        cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK.invalidLastNames);
      });
    },
  );

  it('(AC.2) should reqiure first name field input', { tags: ['@PO-344', '@PO-569'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');

    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', MAIN_PERSONAL_DETAILS.missingFirstName);
  });

  it('(AC.2) should reqiure last name field input', { tags: ['@PO-344', '@PO-569'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');

    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', MAIN_PERSONAL_DETAILS.missingLastName);
  });

  it('(AC.3) should validate the functionality of the Add Aliases tick box', { tags: ['@PO-344', '@PO-569'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');

    cy.get(DOM_ELEMENTS.aliasAdd).click();
    cy.get(DOM_ELEMENTS.legend).should('contain', 'Alias 1');

    cy.get(getAliasFirstName(0)).should('exist');
    cy.get(getAliasLastName(0)).should('exist');

    cy.get(DOM_ELEMENTS.aliasAddButton).should('exist');
    cy.get(DOM_ELEMENTS.aliasRemoveButton).should('not.exist');
  });

  it(
    '(AC.4, AC.5, AC.6) should have working alias workflow and remove button',
    { tags: ['@PO-344', '@PO-569'] },
    () => {
      setupComponent(null, 'parentOrGuardianToPay');

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

  it('(AC.7) should validate unticking add aliases removes all aliases', { tags: ['@PO-344', '@PO-569'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');
    cy.get(DOM_ELEMENTS.aliasAdd).check();
    cy.get(DOM_ELEMENTS.aliasAddButton).click();
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      [`fm_parent_guardian_details_alias_forenames_${0}`]: 'AliasFNAME1',
      [`fm_parent_guardian_details_alias_surname_${0}`]: 'AliasLNAME1',
    });
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      [`fm_parent_guardian_details_alias_forenames_${1}`]: 'AliasFNAME2',
      [`fm_parent_guardian_details_alias_surname_${1}`]: 'AliasLNAME2',
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

  it('(AC.8) should show error for missing alias', { tags: ['@PO-344', '@PO-569'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');

    cy.get(DOM_ELEMENTS.aliasAdd).click();
    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', ALIAS_PERSONAL_DETAILS.missingAlias + ' 1');
  });

  it('(AC.8) should show error for missing alias last name', { tags: ['@PO-344', '@PO-569'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');

    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_add_alias = true;
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_surname_0: 'Smith',
    });
    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', ALIAS_PERSONAL_DETAILS.missingAlias + ' 1');
    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', ALIAS_PERSONAL_DETAILS.missingAliasLastName + ' 1');
  });

  it('(AC.8) should show error for missing alias first name', { tags: ['@PO-344', '@PO-569'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');

    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_add_alias = true;
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_forenames_0: 'John',
    });
    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', ALIAS_PERSONAL_DETAILS.missingAliasLastName + ' 1');
    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', ALIAS_PERSONAL_DETAILS.missingAlias + ' 1');
  });

  it('(AC.8) should show error for missing additional alias first name', { tags: ['@PO-344', '@PO-569'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');

    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_add_alias = true;
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_forenames_0: 'John',
      fm_parent_guardian_details_alias_surname_0: 'Smith',
    });
    cy.get(DOM_ELEMENTS.aliasAddButton).click();
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_surname_1: 'Smith',
    });
    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', `${ALIAS_PERSONAL_DETAILS.missingAlias} 1`);
    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', `${ALIAS_PERSONAL_DETAILS.missingAliasLastName} 1`);

    cy.get(DOM_ELEMENTS.errorSummary).should('contain', `${ALIAS_PERSONAL_DETAILS.missingAlias} 2`);
    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', `${ALIAS_PERSONAL_DETAILS.missingAliasLastName} 2`);

    cy.get(DOM_ELEMENTS.errorSummary).should('contain', `${ALIAS_PERSONAL_DETAILS.missingAlias} 3`);
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', `${ALIAS_PERSONAL_DETAILS.missingAliasLastName} 3`);
  });

  it('(AC.8) should show error for missing additional alias last name', { tags: ['@PO-344', '@PO-569'] }, () => {
    setupComponent(null), 'parentOrGuardianToPay';

    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_add_alias = true;
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_forenames_0: 'John',
      fm_parent_guardian_details_alias_surname_0: 'Smith',
    });
    cy.get(DOM_ELEMENTS.aliasAddButton).click();
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_forenames_1: 'John',
    });
    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', `${ALIAS_PERSONAL_DETAILS.missingAlias} 1`);
    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', `${ALIAS_PERSONAL_DETAILS.missingAliasLastName} 1`);

    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', `${ALIAS_PERSONAL_DETAILS.missingAlias} 2`);
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', `${ALIAS_PERSONAL_DETAILS.missingAliasLastName} 2`);

    cy.get(DOM_ELEMENTS.errorSummary).should('contain', `${ALIAS_PERSONAL_DETAILS.missingAlias} 3`);
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', `${ALIAS_PERSONAL_DETAILS.missingAliasLastName} 3`);
  });

  it(
    '(AC.3) should display validation error when date of birth is in the future',
    { tags: ['@PO-344', '@PO-364'] },
    () => {
      setupComponent(null, 'parentOrGuardianToPay');

      finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_dob = '01/01/3000';
      cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK['dateOfBirthInFuture']);
    },
  );

  it('(AC.3) should display validation error when date of birth is invalid', { tags: ['@PO-344', '@PO-364'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');

    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_dob = '01/01/abc';
    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK['dateOfBirthInvalid']);
  });

  it(
    '(AC.4) should not accept national insurance number in the incorrect format',
    { tags: ['@PO-344', '@PO-436'] },
    () => {
      setupComponent(null, 'parentOrGuardianToPay');
      finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_national_insurance_number = 'AB1234565C';

      cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK.validNationalInsuranceNumber);
    },
  );

  it('(AC.1) should have max length validation for address line 1', { tags: ['@PO-344', '@PO-364'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_1 = 'a'.repeat(31);

    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', LENGTH_VALIDATION.addressLine1TooLong);
  });

  it('(AC.1) should not permit asterisks in address line 1', { tags: ['@PO-344', '@PO-364'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_1 = 'addr1*';

    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK.addressLine1ContainsSpecialCharacters);
  });
  it('(AC.1) should have max length validation for address line 2', { tags: ['@PO-344', '@PO-364'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_2 = 'a'.repeat(31);

    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', LENGTH_VALIDATION.addressLine2TooLong);
  });

  it('(AC.1) should not permit asterisks in address line 2', { tags: ['@PO-344', '@PO-364'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_2 = 'addr2*';

    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK.addressLine2ContainsSpecialCharacters);
  });
  it('(AC.9) should have max length validation for address line 3', { tags: ['@PO-344', '@PO-569'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_3 = 'a'.repeat(14);

    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', LENGTH_VALIDATION.addressLine3TooLong);
  });

  it('(AC.1) should not permit asterisks in address line 3', { tags: ['@PO-344', '@PO-436'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_3 = 'addr3*';

    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK.addressLine3ContainsSpecialCharacters);
  });
  it('(AC.1) should have max length validation for postcode', { tags: ['@PO-344', '@PO-364'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_post_code = 'a'.repeat(9);

    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', LENGTH_VALIDATION.postcodeTooLong);
  });

  it('(AC.10) should have max length validation for make and model field', { tags: ['@PO-344', '@PO-569'] }, () => {
    setupComponent(null, 'parentOrGuardianToPay');
    finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_vehicle_make = 'a'.repeat(31);

    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', LENGTH_VALIDATION.vehicleMakeTooLong);
  });
  it(
    '(AC.10) should have max length validation for registration number field',
    { tags: ['@PO-344', '@PO-569'] },
    () => {
      setupComponent(null, 'parentOrGuardianToPay');
      finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_vehicle_registration_mark = 'a'.repeat(
        12,
      );

      cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', LENGTH_VALIDATION.vehicleRegistrationTooLong);
    },
  );

  it(
    '(AC.5) should show errors for invalid mandatory fields and allow corrections and submit form',
    { tags: ['@PO-344', '@PO-364'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');

      setupComponent(mockFormSubmit, 'parentOrGuardianToPay');

      finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_forenames =
        'John Jacob Jingleheimer Schmidt Jingleheimer';
      finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_surname =
        'smith Johnson Alexander Williams Brown Davis';
      finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_1 = '120 street*';

      cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();

      for (const [, value] of Object.entries(CORRECTION_TEST_MESSAGES)) {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
      }

      cy.get(DOM_ELEMENTS.firstNameInput).clear().focus().type('Coca Cola', { delay: 0 });
      cy.get(DOM_ELEMENTS.lastNameInput).clear().focus().type('Cola Family', { delay: 0 });
      cy.get(DOM_ELEMENTS.addressLine1Input).clear().focus().type('Pepsi Road', { delay: 0 });

      cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');

      cy.get('@formSubmitSpy').should('have.been.calledOnce');
    },
  );

  it(
    '(AC.6) should show errors for invalid mandatory fields and allow corrections and submit form',
    { tags: ['@PO-344', '@PO-364'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');

      setupComponent(mockFormSubmit, 'parentOrGuardianToPay');

      finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_forenames = 'FNAME';
      finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_surname = 'LNAME';
      finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_1 = 'ADDR1';

      cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');

      cy.get('@formSubmitSpy').should('have.been.calledOnce');
    },
  );

  it('(AC.1) Parent or guardian details should capitalise - AYPG', { tags: ['@PO-344', '@PO-1449'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit, 'parentOrGuardianToPay');

    cy.get(DOM_ELEMENTS.firstNameInput).type('fname', { delay: 0 });
    cy.get(DOM_ELEMENTS.firstNameInput).blur();

    cy.get(DOM_ELEMENTS.lastNameInput).type('lname', { delay: 0 });
    cy.get(DOM_ELEMENTS.lastNameInput).blur();

    cy.get(DOM_ELEMENTS.addressLine1Input).type('12 avenue', { delay: 0 });
    cy.get(DOM_ELEMENTS.addressLine1Input).blur();

    cy.get(DOM_ELEMENTS.postcodeInput).type('sl86et', { delay: 0 });
    cy.get(DOM_ELEMENTS.postcodeInput).blur();

    cy.get(DOM_ELEMENTS.niNumberInput).type('ab712348b', { delay: 0 });
    cy.get(DOM_ELEMENTS.niNumberInput).blur();

    cy.get(DOM_ELEMENTS.vehicle_registration_markInput).type('ap12 slu', { delay: 0 });
    cy.get(DOM_ELEMENTS.vehicle_registration_markInput).blur();

    cy.get(DOM_ELEMENTS.aliasAdd).click();
    cy.get(getAliasFirstName(0)).type('alias0fname');
    cy.get(getAliasLastName(0)).type('alias0lname').should('have.value', 'ALIAS0LNAME');
    cy.get(DOM_ELEMENTS.lastNameInput).should('have.value', 'LNAME');
    cy.get(DOM_ELEMENTS.postcodeInput).should('have.value', 'SL86ET');
    cy.get(DOM_ELEMENTS.niNumberInput).should('have.value', 'AB712348B');
    cy.get(DOM_ELEMENTS.vehicle_registration_markInput).should('have.value', 'AP12 SLU');

    // Add the remaining four aliases using loop
    for (let i = 1; i < 5; i++) {
      cy.get(DOM_ELEMENTS.aliasAddButton).click();
      cy.get(getAliasFirstName(i)).type(`alias${i + 1}fname`);
      cy.get(getAliasLastName(i))
        .type(`alias${i + 1}lname`)
        .should('have.value', `ALIAS${i + 1}LNAME`);
    }

    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });
});
