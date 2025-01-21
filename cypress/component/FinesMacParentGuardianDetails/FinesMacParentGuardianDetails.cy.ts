import { mount } from 'cypress/angular';
import { OpalFines } from '../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FinesMacParentGuardianDetailsComponent } from '../../../src/app/flows/fines/fines-mac/fines-mac-parent-guardian-details/fines-mac-parent-guardian-details.component';
import { DOM_ELEMENTS, getAliasFirstName, getAliasLastName } from './constants/FinesMacParentGuardianDetailsElements';
import {
  MAIN_PERSONAL_DETAILS,
  ALIAS_PERSONAL_DETAILS,
  LENGTH_VALIDATION,
  FORMAT_CHECK,
  CORRECTION_TEST_MESSAGES,
} from './constants/FinesMacParentGuardianDetailsErrors';

describe('FinesMacParentGuardianDetailsComponent', () => {
  const setupComponent = (formSubmit: any) => {
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

    cy.get(DOM_ELEMENTS['dob']).focus().type('01/01/3000', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', FORMAT_CHECK['dateOfBirthInFuture']);
  });

  it('should display validation error when date of birth is invalid', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['dob']).focus().type('01/01/abc', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', FORMAT_CHECK['dateOfBirthInvalid']);
  });

  it('should not have any asterisks in address lines', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['addressLine1']).focus().type('dsad*', { delay: 0 });
    cy.get(DOM_ELEMENTS['addressLine2']).focus().type('asd*', { delay: 0 });
    cy.get(DOM_ELEMENTS['addressLine3']).focus().type('asd*', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).first().click();

    for (let i = 1; i <= 3; i++) {
      cy.get(DOM_ELEMENTS['errorSummary']).should('contain', FORMAT_CHECK[`addressLine${i}ContainsSpecialCharacters`]);
    }
  });

  it('should not have firstnames,last names, vehicle registration mark and Address lines 1,2 & 3 having more than max characters', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['firstName']).focus().type('John Smithy Michael John Smithy Michael long', { delay: 0 });
    cy.get(DOM_ELEMENTS['lastName']).focus().type('Astridge Lamsden Langley Treen long', { delay: 0 });
    cy.get(DOM_ELEMENTS['addressLine1']).focus().type('a'.repeat(31), { delay: 0 });
    cy.get(DOM_ELEMENTS['addressLine2']).focus().type('a'.repeat(31), { delay: 0 });
    cy.get(DOM_ELEMENTS['addressLine3']).focus().type('a'.repeat(31), { delay: 0 });
    cy.get(DOM_ELEMENTS['vehicle_registration_mark']).focus().type('a'.repeat(31), { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).first().click();

    for (const [key, value] of Object.entries(LENGTH_VALIDATION)) {
      cy.get(DOM_ELEMENTS['errorSummary']).should('contain', value);
    }
  });

  it('should have working alias workflow and remove button', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['aliasAdd']).click();
    cy.get(getAliasFirstName(0)).focus().type('John', { delay: 0 });
    cy.get(getAliasLastName(0)).focus().type('Smith', { delay: 0 });

    for (let i = 1; i <= 2; i++) {
      cy.get(DOM_ELEMENTS['aliasAddButton']).click();
      cy.get(getAliasFirstName(i)).focus().type('John', { delay: 0 });
      cy.get(getAliasLastName(i)).focus().type('Smith', { delay: 0 });
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
    cy.get(getAliasLastName(0)).focus().type('Smith', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', ALIAS_PERSONAL_DETAILS['missingAlias']);
  });

  it('should show error for missing alias first name', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['aliasAdd']).click();
    cy.get(getAliasFirstName(0)).focus().type('John', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', ALIAS_PERSONAL_DETAILS['missingAliasLastName']);
  });

  it('should show error for missing additional alias first name', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['aliasAdd']).click();
    cy.get(getAliasFirstName(0)).focus().type('John', { delay: 0 });
    cy.get(getAliasLastName(0)).focus().type('Smith', { delay: 0 });
    cy.get(DOM_ELEMENTS['aliasAddButton']).click();
    cy.get(getAliasLastName(1)).focus().type('Smith', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', ALIAS_PERSONAL_DETAILS['missingAlias']);
  });

  it('should show error for missing additional alias last name', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['aliasAdd']).click();
    cy.get(getAliasFirstName(0)).focus().type('John', { delay: 0 });
    cy.get(getAliasLastName(0)).focus().type('Smith', { delay: 0 });
    cy.get(DOM_ELEMENTS['aliasAddButton']).click();
    cy.get(getAliasFirstName(1)).focus().type('john', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', ALIAS_PERSONAL_DETAILS['missingAliasLastName']);
  });

  it('should show error for future date of birth', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['firstName']).focus().type('John Smithy Michael', { delay: 0 });
    cy.get(DOM_ELEMENTS['lastName']).focus().type('Astridge Lamsden Langley Treen', { delay: 0 });
    cy.get(DOM_ELEMENTS['dob']).focus().type('01/01/2500', { delay: 0 });
    cy.get(DOM_ELEMENTS['addressLine1']).focus().type('120 Deuchar street', { delay: 0 });

    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', 'Enter a valid date of birth in the past');
  });

  it('should show error for invalid date format', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['dob']).focus().type('01/92', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', FORMAT_CHECK['dateOfBirthInvalid']);
  });

  it('should not accept national insurance number in the incorrect format', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['firstName']).focus().type('John Smithy Michael', { delay: 0 });
    cy.get(DOM_ELEMENTS['lastName']).focus().type('Astridge Lamsden Langley Treen', { delay: 0 });
    cy.get(DOM_ELEMENTS['dob']).focus().type('01/01/1990', { delay: 0 });
    cy.get(DOM_ELEMENTS['addressLine1']).focus().type('120 Deuchar street', { delay: 0 });

    cy.get(DOM_ELEMENTS['niNumber']).focus().type('AB1234565C', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', FORMAT_CHECK['validNationalInsuranceNumber']);
  });

  it('should show errors for invalid mandatory fields and allow corrections', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    cy.get(DOM_ELEMENTS['firstName']).focus().type('Stuart Philips aarogyam Guuci Coach VII', { delay: 0 });
    cy.get(DOM_ELEMENTS['lastName']).focus().type('Chicago bulls Burberry RedBull 2445 PizzaHut', { delay: 0 });
    cy.get(DOM_ELEMENTS['addressLine1']).focus().type('test Road *12', { delay: 0 });

    cy.get(DOM_ELEMENTS['submitButton']).first().click();

    for (const [, value] of Object.entries(CORRECTION_TEST_MESSAGES)) {
      cy.get(DOM_ELEMENTS['errorSummary']).should('contain', value);
    }

    cy.get(DOM_ELEMENTS['firstName']).clear().focus().type('Coca Cola', { delay: 0 });
    cy.get(DOM_ELEMENTS['lastName']).clear().focus().type('Cola Family', { delay: 0 });
    cy.get(DOM_ELEMENTS['addressLine1']).clear().focus().type('Pepsi Road', { delay: 0 });

    cy.get(DOM_ELEMENTS['firstName']).should('have.value', 'Coca Cola');
    cy.get(DOM_ELEMENTS['lastName']).should('have.value', 'Cola Family');
    cy.get(DOM_ELEMENTS['addressLine1']).should('have.value', 'Pepsi Road');

    cy.get(DOM_ELEMENTS['submitButton']).first().click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });
});
