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

  const ERROR_MESSAGES = {
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
    addressContainsSpecialCharacters: 'The address line 1 must not contain special characters',
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
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES.missingTitle);
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES.missingFirstName);
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES.missingLastName);
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES.missingAddressLine1);
  });

  it('should display validation error when date of birth is in the future', () => {
    setupComponent(null);

    cy.get('input[id="fm_personal_details_dob"]').focus().type('01/01/3000');
    cy.get('button[type="submit"]').click();
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES.dateOfBirthInFuture);
  });
  it('should display validation error when date of birth is invalid', () => {
    setupComponent(null);

    cy.get('input[id="fm_personal_details_dob"]').focus().type('01/01/abc');
    cy.get('button[type="submit"]').click();
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES.dateOfBirthInvalid);
  });
});
