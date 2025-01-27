import { mount } from 'cypress/angular';
import { OpalFines } from '../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FinesMacParentGuardianDetailsComponent } from '../../../src/app/flows/fines/fines-mac/fines-mac-parent-guardian-details/fines-mac-parent-guardian-details.component';
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

describe('FinesMacParentGuardianDetailsComponent', () => {
  let mockFinesService = {
    finesMacState: { ...FINES_MAC_STATE_MOCK },
  };

  afterEach(() => {
    cy.then(() => {
      mockFinesService.finesMacState.parentGuardianDetails.formData = {
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

  const setupComponent = (formSubmit: any, mockDefendantType: string = '') => {
    const mockFinesService = {
      finesMacState: { ...FINES_MAC_STATE_MOCK },
    };

    mount(FinesMacParentGuardianDetailsComponent, {
      providers: [
        { provide: OpalFines, useValue: mockFinesService },
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

  it('should render the child component', () => {
    setupComponent(null);

    // Verify the child component is rendered
    cy.get('app-fines-mac-parent-guardian-details-form').should('exist');
  });

  it('should display validation error when mandatory fields are missing', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['submitButton']).first().click();

    for (const [key, value] of Object.entries(MAIN_PERSONAL_DETAILS)) {
      cy.get(DOM_ELEMENTS['errorSummary']).should('contain', value);
    }
  });

  it('should display validation error when date of birth is in the future', () => {
    setupComponent(null);

    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_dob = '01/01/3000';
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', FORMAT_CHECK['dateOfBirthInFuture']);
  });

  it('should display validation error when date of birth is invalid', () => {
    setupComponent(null);

    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_dob = '01/01/abc';
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', FORMAT_CHECK['dateOfBirthInvalid']);
  });

  it('should not have any asterisks in address lines', () => {
    setupComponent(null);

    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_1 = 'dsad*';
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_2 = 'asd*';
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_3 = 'asd*';
    cy.get(DOM_ELEMENTS['submitButton']).first().click();

    for (let i = 1; i <= 3; i++) {
      cy.get(DOM_ELEMENTS['errorSummary']).should('contain', FORMAT_CHECK[`addressLine${i}ContainsSpecialCharacters`]);
    }
  });

  it('should not have firstnames,last names, vehicle registration mark and Address lines 1,2 & 3 having more than max characters', () => {
    setupComponent(null);

    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_forenames =
      'John Smithy Michael John Smithy Michael long';
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_surname =
      'Astridge Lamsden Langley Treen long';
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_1 =
      'a'.repeat(31);
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_2 =
      'a'.repeat(31);
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_3 =
      'a'.repeat(31);
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_vehicle_registration_mark =
      'a'.repeat(31);
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_vehicle_make = 'a'.repeat(
      31,
    );
    cy.get(DOM_ELEMENTS['submitButton']).first().click();

    for (const [key, value] of Object.entries(LENGTH_VALIDATION)) {
      cy.get(DOM_ELEMENTS['errorSummary']).should('contain', value);
    }
  });

  it('should have working alias workflow and remove button', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['aliasAdd']).click();
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_forenames_0: 'John',
      fm_parent_guardian_details_alias_surname_0: 'Smith',
    });

    for (let i = 1; i <= 2; i++) {
      cy.get(DOM_ELEMENTS['aliasAddButton']).click();
      mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
        [`fm_parent_guardian_details_alias_forenames_${i}`]: 'John',
        [`fm_parent_guardian_details_alias_surname_${i}`]: 'Smith',
      });
    }

    cy.get(DOM_ELEMENTS['aliasRemoveButton']).click().click();
    cy.get(DOM_ELEMENTS['aliasAdd']).click().click();

    cy.get(getAliasFirstName(0)).should('have.value', '');
    cy.get(getAliasLastName(0)).should('have.value', '');
  });

  it('should show error for missing alias', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['aliasAdd']).click();
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', ALIAS_PERSONAL_DETAILS['missingAlias']);
  });

  it('should show error for missing alias last name', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['aliasAdd']).click();
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_surname_0: 'Smith',
    });
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', ALIAS_PERSONAL_DETAILS['missingAlias']);
  });

  it('should show error for missing alias first name', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['aliasAdd']).click();
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_forenames_0: 'John',
    });
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', ALIAS_PERSONAL_DETAILS['missingAliasLastName']);
  });

  it('should show error for missing additional alias first name', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['aliasAdd']).click();
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_forenames_0: 'John',
      fm_parent_guardian_details_alias_surname_0: 'Smith',
    });
    cy.get(DOM_ELEMENTS['aliasAddButton']).click();
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_surname_1: 'Smith',
    });
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', ALIAS_PERSONAL_DETAILS['missingAlias']);
  });

  it('should show error for missing additional alias last name', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['aliasAdd']).click();
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_forenames_0: 'John',
      fm_parent_guardian_details_alias_surname_0: 'Smith',
    });
    cy.get(DOM_ELEMENTS['aliasAddButton']).click();
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_aliases.push({
      fm_parent_guardian_details_alias_forenames_0: 'John',
    });
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', ALIAS_PERSONAL_DETAILS['missingAliasLastName']);
  });

  it('should show error for future date of birth', () => {
    setupComponent(null);

    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_forenames = 'John';
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_surname = 'smith';
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_dob = '01/01/2500';
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_1 =
      '120 street';

    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', 'Enter a valid date of birth in the past');
  });

  it('should show error for invalid date format', () => {
    setupComponent(null);

    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_dob = '01/01/12.';
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', FORMAT_CHECK['dateOfBirthInvalid']);
  });

  it('should not accept national insurance number in the incorrect format', () => {
    setupComponent(null);

    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_forenames = 'John';
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_surname = 'smith';
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_dob = '01/01/1990';
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_1 =
      '120 street';
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_national_insurance_number =
      'AB1234565C';

    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', FORMAT_CHECK['validNationalInsuranceNumber']);
  });

  it('should show errors for invalid mandatory fields and allow corrections and submit form', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_forenames =
      'John Jacob Jingleheimer Schmidt Jingleheimer';
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_surname =
      'smith Johnson Alexander Williams Brown Davis';
    mockFinesService.finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_address_line_1 =
      '120 street*';

    cy.get(DOM_ELEMENTS['submitButton']).first().click();

    for (const [, value] of Object.entries(CORRECTION_TEST_MESSAGES)) {
      cy.get(DOM_ELEMENTS['errorSummary']).should('contain', value);
    }

    cy.get(DOM_ELEMENTS['firstName']).clear().focus().type('Coca Cola', { delay: 0 });
    cy.get(DOM_ELEMENTS['lastName']).clear().focus().type('Cola Family', { delay: 0 });
    cy.get(DOM_ELEMENTS['addressLine1']).clear().focus().type('Pepsi Road', { delay: 0 });

    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('not.exist');

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });
});
