import { mount } from 'cypress/angular';
import { FinesMacPersonalDetailsComponent } from '../../src/app/flows/fines/fines-mac/fines-mac-personal-details/fines-mac-personal-details.component';
import { OpalFines } from '../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FINES_MAC_PERSONAL_DETAILS_FORM_MOCK } from '../../src/app/flows/fines/fines-mac/fines-mac-personal-details/mocks/fines-mac-personal-details-form.mock';

describe('FinesMacPersonalDetailsComponent', () => {
  const setupComponent = (formSubmit: any) => {
    const mockFinesService = {
      finesMacState: { ...FINES_MAC_STATE_MOCK },
    };

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
      },
    });
  };

  const ERROR_MESSAGES: { [key: string]: string } = {
    missingTitle: 'Select a title',
    missingFirstName: "Enter defendant's first name(s)",
    missingLastName: "Enter defendant's last name",
    missingAddressLine1: 'Enter address line 1, typically the building and street',
    dateOfBirthInFuture: 'Enter a valid date of birth in the past',
    dateOfBirthInvalid: 'Enter date of birth in the format DD/MM/YYYY',
    missingAlias: 'Enter first name(s) for alias',
    missingAliasLastName: 'Enter last name for alias',
    firstNameTooLong: "The defendant's first name(s) must be 20 characters or fewer",
    lastNameTooLong: "The defendant's last name must be 30 characters or fewer",
    addressLine1ContainsSpecialCharacters: 'The address line 1 must not contain special characters',
    addressLine2ContainsSpecialCharacters: 'The address line 2 must not contain special characters',
    addressLine3ContainsSpecialCharacters: 'The address line 3 must not contain special characters',
    addressLine1TooLong: 'The address line 1 must be 30 characters or fewer',
    addressLine2TooLong: 'The address line 2 must be 30 characters or fewer',
    addressLine3TooLong: 'The address line 3 must be 16 characters or fewer',
    validNationalInsuranceNumber: 'Enter a National Insurance number in the format AANNNNNNA',
  };

  it('should render the component', () => {
    setupComponent(null);

    // Verify the component is rendered
    cy.get('app-fines-mac-personal-details-form').should('exist');
  });

  it('should call handlePersonalDetailsSubmit when formSubmit is emitted', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    // Mount the component
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

    cy.get('button[type="submit"]').click();
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['missingTitle']);
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['missingFirstName']);
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['missingLastName']);
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['missingAddressLine1']);
  });

  it('should display validation error when date of birth is in the future', () => {
    setupComponent(null);

    cy.get('input[id="fm_personal_details_dob"]').focus().type('01/01/3000', { delay: 0 });
    cy.get('button[type="submit"]').click();
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['dateOfBirthInFuture']);
  });
  it('should display validation error when date of birth is invalid', () => {
    setupComponent(null);

    cy.get('input[id="fm_personal_details_dob"]').focus().type('01/01/abc', { delay: 0 });
    cy.get('button[type="submit"]').click();
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['dateOfBirthInvalid']);
  });

  it('should not have any asterisks in address lines', () => {
    setupComponent(null);

    cy.get('input[id="fm_personal_details_address_line_1"]').focus().type('dsad*', { delay: 0 });
    cy.get('input[id="fm_personal_details_address_line_2"]').focus().type('asd*', { delay: 0 });
    cy.get('input[id="fm_personal_details_address_line_3"]').focus().type('asd*', { delay: 0 });
    cy.get('button[type="submit"]').click();

    for (let i = 1; i <= 3; i++) {
      cy.get(`.govuk-error-message`).should('contain', ERROR_MESSAGES[`addressLine${i}ContainsSpecialCharacters`]);
    }
  });

  it('should not have firstnames,last names and Address lines 1,2 & 3 having more than max characters', () => {
    setupComponent(null);

    cy.get('input[id="fm_personal_details_forenames"]')
      .focus()
      .type('John Smithy Michael John Smithy Michael long', { delay: 0 });
    cy.get('input[id="fm_personal_details_surname"]').focus().type('Astridge Lamsden Langley Treen long', { delay: 0 });
    cy.get('input[id="fm_personal_details_address_line_1"]').focus().type('a'.repeat(31), { delay: 0 });
    cy.get('input[id="fm_personal_details_address_line_2"]').focus().type('a'.repeat(31), { delay: 0 });
    cy.get('input[id="fm_personal_details_address_line_3"]').focus().type('a'.repeat(31), { delay: 0 });
    cy.get('button[type="submit"]').click();

    const errorMessages = [
      ERROR_MESSAGES['firstNameTooLong'],
      ERROR_MESSAGES['lastNameTooLong'],
      ERROR_MESSAGES['addressLine1TooLong'],
      ERROR_MESSAGES['addressLine2TooLong'],
      ERROR_MESSAGES['addressLine3TooLong'],
    ];

    cy.get('button[type="submit"]').click();

    errorMessages.forEach((errorMessage) => {
      cy.get('.govuk-error-message').should('contain', errorMessage);
    });
  });

  it('should have working alias workflow and remove button', () => {
    setupComponent(null);

    cy.get('#fm_personal_details_add_alias').click();
    cy.get('input[id="fm_personal_details_alias_forenames_0"]').focus().type('John', { delay: 0 });
    cy.get('input[id="fm_personal_details_alias_surname_0"]').focus().type('Smith', { delay: 0 });

    for (let i = 1; i <= 2; i++) {
      cy.get('button[id="addAlias"]').click();
      cy.get(`input[id="fm_personal_details_alias_forenames_${i}"]`).focus().type('John', { delay: 0 });
      cy.get(`input[id="fm_personal_details_alias_surname_${i}"]`).focus().type('Smith', { delay: 0 });
    }

    cy.get('.govuk-link--no-visited-state').click().click();
    cy.get(`#fm_personal_details_add_alias`).click().click();

    cy.get('input[id="fm_personal_details_alias_forenames_0"]').should('have.value', '');
    cy.get('input[id="fm_personal_details_alias_surname_0"]').should('have.value', '');
  });

  it('should show error for missing alias', () => {
    setupComponent(null);

    cy.get('#fm_personal_details_add_alias').click();
    cy.get('button[type="submit"]').click();
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['missingAlias']);
  });

  it('should show error for missing alias first name', () => {
    setupComponent(null);

    cy.get('#fm_personal_details_add_alias').click();
    cy.get('input[id="fm_personal_details_alias_surname_0"]').focus().type('Smith', { delay: 0 });
    cy.get('button[type="submit"]').click();
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['missingAlias']);
  });

  it('should show error for missing alias last name', () => {
    setupComponent(null);

    cy.get('#fm_personal_details_add_alias').click();
    cy.get('input[id="fm_personal_details_alias_forenames_0"]').focus().type('John', { delay: 0 });
    cy.get('button[type="submit"]').click();
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['missingAliasLastName']);
  });

  it('should show error for missing additional alias first name', () => {
    setupComponent(null);

    cy.get('#fm_personal_details_add_alias').click();
    cy.get('input[id="fm_personal_details_alias_forenames_0"]').focus().type('John', { delay: 0 });
    cy.get('input[id="fm_personal_details_alias_surname_0"]').focus().type('Smith', { delay: 0 });
    cy.get('button[id="addAlias"]').click();
    cy.get('input[id="fm_personal_details_alias_surname_1"]').focus().type('Smith', { delay: 0 });
    cy.get('button[type="submit"]').click();
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['missingAlias']);
  });

  it('should show error for missing additional alias last name', () => {
    setupComponent(null);

    cy.get('#fm_personal_details_add_alias').click();
    cy.get('input[id="fm_personal_details_alias_forenames_0"]').focus().type('John', { delay: 0 });
    cy.get('input[id="fm_personal_details_alias_surname_0"]').focus().type('Smith', { delay: 0 });
    cy.get('button[id="addAlias"]').click();
    cy.get('input[id="fm_personal_details_alias_forenames_1"]').focus().type('john', { delay: 0 });
    cy.get('button[type="submit"]').click();
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['missingAliasLastName']);
  });

  it('should show error for future date of birth', () => {
    setupComponent(null);

    cy.get('select[id="fm_personal_details_title"]').select('Mrs');
    cy.get('input[id="fm_personal_details_forenames"]').focus().type('John Smithy Michael', { delay: 0 });
    cy.get('input[id="fm_personal_details_surname"]').focus().type('Astridge Lamsden Langley Treen', { delay: 0 });
    cy.get('input[id="fm_personal_details_dob"]').focus().type('01/01/2500', { delay: 0 });
    cy.get('input[id="fm_personal_details_address_line_1"]').focus().type('120 Deuchar street', { delay: 0 });

    cy.get('button[type="submit"]').click();
    cy.get('.govuk-error-message').should('contain', 'Enter a valid date of birth in the past');
  });

  it('should display age panel when entering a valid age', () => {
    setupComponent(null);

    cy.get('input[id="fm_personal_details_dob"]').focus().type('01/01/1990', { delay: 0 });
    cy.get('.moj-ticket-panel').should('exist');
    cy.get('button[type="submit"]').click();
  });

  it('should show error for invalid date format', () => {
    setupComponent(null);

    cy.get('input[id="fm_personal_details_dob"]').focus().type('01/92', { delay: 0 });
    cy.get('button[type="submit"]').click();
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['dateOfBirthInvalid']);
  });

  it('should not accept national insurance number in the incorrect format', () => {
    setupComponent(null);

    cy.get('select[id="fm_personal_details_title"]').select('Mrs');
    cy.get('input[id="fm_personal_details_forenames"]').focus().type('John Smithy Michael', { delay: 0 });
    cy.get('input[id="fm_personal_details_surname"]').focus().type('Astridge Lamsden Langley Treen', { delay: 0 });
    cy.get('input[id="fm_personal_details_dob"]').focus().type('01/01/1990', { delay: 0 });
    cy.get('input[id="fm_personal_details_address_line_1"]').focus().type('120 Deuchar street', { delay: 0 });

    cy.get('input[id="fm_personal_details_national_insurance_number"]').focus().type('AB1234565C', { delay: 0 });
    cy.get('button[type="submit"]').click();
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['validNationalInsuranceNumber']);
  });

  it('should show errors for invalid mandatory fields and allow corrections', () => {
    setupComponent(null);

    cy.get('input[id="fm_personal_details_forenames"]')
      .focus()
      .type('Stuart Philips aarogyam Guuci Coach VII', { delay: 0 });
    cy.get('input[id="fm_personal_details_surname"]')
      .focus()
      .type('Chicago bulls Burberry RedBull 2445 PizzaHut', { delay: 0 });
    cy.get('input[id="fm_personal_details_address_line_1"]').focus().type('test Road *12', { delay: 0 });

    cy.get('button[type="submit"]').click();

    const errorMessages = [
      ERROR_MESSAGES['missingTitle'],
      ERROR_MESSAGES['firstNameTooLong'],
      ERROR_MESSAGES['lastNameTooLong'],
      ERROR_MESSAGES['addressLine1ContainsSpecialCharacters'],
    ];

    errorMessages.forEach((errorMessage) => {
      cy.get('.govuk-error-message').should('contain', errorMessage);
    });

    cy.get('select[id="fm_personal_details_title"]').select('Mr');
    cy.get('input[id="fm_personal_details_forenames"]').clear().focus().type('Coca Cola', { delay: 0 });
    cy.get('input[id="fm_personal_details_surname"]').clear().focus().type('Cola Family', { delay: 0 });
    cy.get('input[id="fm_personal_details_address_line_1"]').clear().focus().type('Pepsi Road', { delay: 0 });

    cy.get('select[id="fm_personal_details_title"]').should('have.value', 'Mr');
    cy.get('input[id="fm_personal_details_forenames"]').should('have.value', 'Coca Cola');
    cy.get('input[id="fm_personal_details_surname"]').should('have.value', 'Cola Family');
    cy.get('input[id="fm_personal_details_address_line_1"]').should('have.value', 'Pepsi Road');
  });
});
