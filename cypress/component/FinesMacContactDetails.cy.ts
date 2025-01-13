import { mount } from 'cypress/angular';
import { FinesMacContactDetailsComponent } from '../../src/app/flows/fines/fines-mac/fines-mac-contact-details/fines-mac-contact-details.component';
import { OpalFines } from '../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FINES_MAC_PERSONAL_DETAILS_FORM_MOCK } from '../../src/app/flows/fines/fines-mac/fines-mac-personal-details/mocks/fines-mac-personal-details-form.mock';

describe('FinesMacContactDetailsComponent', () => {
  const setupComponent = (formSubmit: any) => {
    const mockFinesService = {
      finesMacState: { ...FINES_MAC_STATE_MOCK },
    };

    mount(FinesMacContactDetailsComponent, {
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
        handleContactDetailsSubmit: formSubmit,
      },
    });
  };

  const ERROR_MESSAGES: { [key: string]: string } = {
    missingPrimaryEmail: 'Enter a primary email address',
    invalidPrimaryEmail: 'Enter primary email address in the correct format like, name@example.com',
    missingSecondaryEmail: 'Enter a secondary email address',
    invalidSecondaryEmail: 'Enter secondary email address in the correct format like, name@example.com',
    missingMobileTelephone: 'Enter a mobile telephone number',
    invalidMobileTelephone: 'Enter a mobile telephone number, like 07700 900 982',
    missingHomeTelephone: 'Enter a home telephone number',
    invalidHomeTelephone: 'Enter a home telephone number, like 01632 960 001',
    missingWorkTelephone: 'Enter a work telephone number',
    invalidWorkTelephone: 'Enter a work telephone number, like 01632 960 001 or 07700 900 982',
  };

  it('should render the component', () => {
    setupComponent(null);

    // Verify the component is rendered
    cy.get('app-fines-mac-contact-details-form').should('exist');
  });

  it('should show errors for invalid contact details', () => {
    setupComponent(null);

    cy.get('input[id="fm_contact_details_email_address_1"]').focus().type('invalid-email', { delay: 0 });
    cy.get('input[id="fm_contact_details_email_address_2"]').focus().type('invalid-email', { delay: 0 });
    cy.get('input[id="fm_contact_details_telephone_number_mobile"]').focus().type('invalid-phone', { delay: 0 });
    cy.get('input[id="fm_contact_details_telephone_number_home"]').focus().type('invalid-phone', { delay: 0 });
    cy.get('input[id="fm_contact_details_telephone_number_business"]').focus().type('invalid-phone', { delay: 0 });

    cy.get('button[type="submit"]').click();

    const errorMessages = [
      ERROR_MESSAGES['invalidPrimaryEmail'],
      ERROR_MESSAGES['invalidSecondaryEmail'],
      ERROR_MESSAGES['invalidMobileTelephone'],
      ERROR_MESSAGES['invalidHomeTelephone'],
      ERROR_MESSAGES['invalidWorkTelephone'],
    ];

    errorMessages.forEach((errorMessage) => {
      cy.get('.govuk-error-message').should('contain', errorMessage);
    });
  });

  it('should accept valid contact details', () => {
    setupComponent(null);

    cy.get('input[id="fm_contact_details_email_address_1"]').focus().clear().type('name@example.com', { delay: 0 });
    cy.get('input[id="fm_contact_details_email_address_2"]')
      .focus()
      .clear()
      .type('secondary@example.com', { delay: 0 });
    cy.get('input[id="fm_contact_details_telephone_number_mobile"]').focus().clear().type('07700900982', { delay: 0 });
    cy.get('input[id="fm_contact_details_telephone_number_home"]').focus().clear().type('01632960001', { delay: 0 });
    cy.get('input[id="fm_contact_details_telephone_number_business"]')
      .focus()
      .clear()
      .type('01632960002', { delay: 0 });

    // Verify no error messages are displayed
    cy.get('.govuk-error-message').should('not.exist');
  });
});
