import { mount } from 'cypress/angular';
import { FinesMacPersonalDetailsComponent } from '../../../src/app/flows/fines/fines-mac/fines-mac-personal-details/fines-mac-personal-details.component';
import { OpalFines } from '../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FINES_MAC_PERSONAL_DETAILS_FORM_MOCK } from '../../../src/app/flows/fines/fines-mac/fines-mac-personal-details/mocks/fines-mac-personal-details-form.mock';
import {
  FORMAT_CHECK,
  MAIN_PERSONAL_DETAILS,
  ALIAS_PERSONAL_DETAILS,
  LENGTH_VALIDATION,
  CORRECTION_TEST_MESSAGES,
  VEHICLE_DETAILS_ERRORS,
} from './constants/fines_mac_personal_details_errors';
import { DOM_ELEMENTS, getAliasFirstName, getAliasLastName } from './constants/fines_mac_personal_details_elements';

describe('FinesMacPersonalDetailsComponent', () => {
  let mockFinesService = {
    finesMacState: { ...FINES_MAC_STATE_MOCK },
  };

  afterEach(() => {
    cy.then(() => {
      mockFinesService.finesMacState.personalDetails.formData = {
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

  const setupComponent = (formSubmit: any, defendantTypeMock: string = '') => {
    mount(FinesMacPersonalDetailsComponent, {
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
        handlePersonalDetailsSubmit: formSubmit,
        defendantType: defendantTypeMock,
      },
    });
  };

  it('should render the component', () => {
    setupComponent(null);

    // Verify the component is rendered
    cy.get('app-fines-mac-personal-details-form').should('exist');
  });

  it('should call handlePersonalDetailsSubmit when formSubmit is emitted', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    // Emit the formSubmit event programmatically
    cy.get('app-fines-mac-personal-details-form').then(($child) => {
      const childElement = $child[0];
      const event = new CustomEvent('formSubmit', {
        detail: { ...FINES_MAC_PERSONAL_DETAILS_FORM_MOCK },
        bubbles: true,
        cancelable: true,
      });
      childElement.dispatchEvent(event);
    });

    // Verify the parent method was called
    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should display validation error when mandatory fields are missing', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['submitButton']).click();

    for (const [key, value] of Object.entries(MAIN_PERSONAL_DETAILS)) {
      cy.get(DOM_ELEMENTS['errorSummary']).should('contain', value);
    }
  });

  it('should display validation error when date of birth is in the future', () => {
    setupComponent(null);

    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/3000';
    cy.get(DOM_ELEMENTS['submitButton']).click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', FORMAT_CHECK['dateOfBirthInFuture']);
  });

  it('should display validation error when date of birth is invalid', () => {
    setupComponent(null);

    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/abc';
    cy.get(DOM_ELEMENTS['submitButton']).click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', FORMAT_CHECK['dateOfBirthInvalid']);
  });

  it('should not have any asterisks in address lines', () => {
    setupComponent(null);

    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_address_line_1 = 'asja*';
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_address_line_2 = 'asja*';
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_address_line_3 = 'asja*';
    cy.get(DOM_ELEMENTS['submitButton']).click();

    for (let i = 1; i <= 3; i++) {
      cy.get(DOM_ELEMENTS['errorSummary']).should('contain', FORMAT_CHECK[`addressLine${i}ContainsSpecialCharacters`]);
    }
  });

  it('should not have firstnames,last names and Address lines 1,2 & 3 having more than max characters', () => {
    setupComponent(null);

    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_forenames =
      'John Smithy Michael John Smithy Michael long';
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_surname =
      'Astridge Lamsden Langley Treen long';
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_address_line_1 = 'a'.repeat(31);
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_address_line_2 = 'a'.repeat(31);
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_address_line_3 = 'a'.repeat(31);

    cy.get(DOM_ELEMENTS['submitButton']).click();

    for (const [key, value] of Object.entries(LENGTH_VALIDATION)) {
      cy.get(DOM_ELEMENTS['errorSummary']).should('contain', value);
    }
  });

  it('should have working alias workflow and remove button', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['aliasAdd']).click();

    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_aliases.push({
      fm_personal_details_alias_forenames_0: 'John',
      fm_personal_details_alias_surname_0: 'Smith',
    });

    for (let i = 1; i <= 2; i++) {
      cy.get(DOM_ELEMENTS['aliasAddButton']).click();
      mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_aliases.push({
        [`fm_personal_details_alias_forenames_${i}`]: 'John',
        [`fm_personal_details_alias_surname_${i}`]: 'Smith',
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
    cy.get(DOM_ELEMENTS['submitButton']).click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', ALIAS_PERSONAL_DETAILS['missingAlias']);
  });

  it('should show error for missing alias last name', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['aliasAdd']).click();
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_aliases.push({
      fm_personal_details_alias_surname_0: 'Smith',
    });
    cy.get(DOM_ELEMENTS['submitButton']).click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', ALIAS_PERSONAL_DETAILS['missingAlias']);
  });

  it('should show error for missing alias first name', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['aliasAdd']).click();
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_aliases.push({
      fm_personal_details_alias_forenames_0: 'John',
    });
    cy.get(DOM_ELEMENTS['submitButton']).click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', ALIAS_PERSONAL_DETAILS['missingAliasLastName']);
  });

  it('should show error for missing additional alias first name', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['aliasAdd']).click();
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_aliases.push({
      fm_personal_details_alias_forenames_0: 'John',
      fm_personal_details_alias_surname_0: 'Smith',
    });
    cy.get(DOM_ELEMENTS['aliasAddButton']).click();
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_aliases.push({
      fm_personal_details_alias_surname_1: 'Smith',
    });
    cy.get(DOM_ELEMENTS['submitButton']).click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', ALIAS_PERSONAL_DETAILS['missingAlias']);
  });

  it('should show error for missing additional alias last name', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['aliasAdd']).click();
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_aliases.push({
      fm_personal_details_alias_forenames_0: 'John',
      fm_personal_details_alias_surname_0: 'Smith',
    });
    cy.get(DOM_ELEMENTS['aliasAddButton']).click();
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_aliases.push({
      fm_personal_details_alias_forenames_1: 'John',
    });
    cy.get(DOM_ELEMENTS['submitButton']).click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', ALIAS_PERSONAL_DETAILS['missingAliasLastName']);
  });

  it('should show error for future date of birth', () => {
    setupComponent(null);

    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_title = 'Mrs';
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_forenames = 'John';
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_forenames = 'Smith';
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/3000';
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_address_line_1 = '123 fake street';
    cy.get(DOM_ELEMENTS['submitButton']).click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', 'Enter a valid date of birth in the past');
  });

  it('should display age panel when entering a valid age', () => {
    setupComponent(null);

    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/1990';
    cy.get('.moj-ticket-panel').should('exist');
    cy.get(DOM_ELEMENTS['submitButton']).click();
  });

  it('should show error for invalid date format', () => {
    setupComponent(null);

    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/,.';
    cy.get(DOM_ELEMENTS['submitButton']).click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', FORMAT_CHECK['dateOfBirthInvalid']);
  });

  it('should not accept national insurance number in the incorrect format', () => {
    setupComponent(null);

    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_title = 'Mrs';
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_forenames = 'John';
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_forenames = 'Smith';
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/3000';
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_address_line_1 = '123 fake street';
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_national_insurance_number =
      'AB1234565C';

    cy.get(DOM_ELEMENTS['submitButton']).click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', FORMAT_CHECK['validNationalInsuranceNumber']);
  });

  it('should show errors for invalid mandatory fields and allow corrections', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_forenames =
      'Stuart Philips aarogyam Guuci Coach VII';
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_surname =
      'Chicago bulls Burberry RedBull 2445 PizzaHut';
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_address_line_1 = 'test Road *12';

    cy.get(DOM_ELEMENTS['submitButton']).click();

    for (const [, value] of Object.entries(CORRECTION_TEST_MESSAGES)) {
      cy.get(DOM_ELEMENTS['errorSummary']).should('contain', value);
    }

    cy.get(DOM_ELEMENTS['title']).select('Mr');
    cy.get(DOM_ELEMENTS['firstName']).clear().type('f', { delay: 0 });
    cy.get(DOM_ELEMENTS['lastName']).clear().type('s', { delay: 0 });
    cy.get(DOM_ELEMENTS['addressLine1']).clear().type('addr', { delay: 0 });

    cy.get(DOM_ELEMENTS['submitButton']).click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('not.exist');

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should render vehicle details for adultOrYouthOnly defendant type and validate max length of data', () => {
    setupComponent(null, 'adultOrYouthOnly');

    // Verify the vehicle details section is rendered
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_vehicle_make = 'a'.repeat(51);
    mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_vehicle_registration_mark = 'a'.repeat(
      24,
    );

    cy.get(DOM_ELEMENTS['submitButton']).first().click();

    for (const [, value] of Object.entries(VEHICLE_DETAILS_ERRORS)) {
      cy.get(DOM_ELEMENTS['errorSummary']).should('contain', value);
    }
  });

  it('should not render vehicle details for AY-PG defendant type', () => {
    setupComponent(null, 'parentOrGuardianToPay');

    // Verify the vehicle details section is not rendered
    cy.get(DOM_ELEMENTS['vehicleMake']).should('not.exist');
    cy.get(DOM_ELEMENTS['vehicleRegistration']).should('not.exist');
  });

  it('should not render vehicle details for company defendant type', () => {
    setupComponent(null, 'company');

    // Verify the vehicle details section is not rendered
    cy.get(DOM_ELEMENTS['vehicleMake']).should('not.exist');
    cy.get(DOM_ELEMENTS['vehicleRegistration']).should('not.exist');
  });
});
