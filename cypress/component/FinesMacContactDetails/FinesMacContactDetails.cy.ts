import { mount } from 'cypress/angular';
import { FinesMacContactDetailsComponent } from '../../../src/app/flows/fines/fines-mac/fines-mac-contact-details/fines-mac-contact-details.component';
import { OpalFines } from '../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FINES_MAC_PERSONAL_DETAILS_FORM_MOCK } from '../../../src/app/flows/fines/fines-mac/fines-mac-personal-details/mocks/fines-mac-personal-details-form.mock';
import { INVALID_DETAILS } from './ErrorMessages/FinesMacContactDetailsErrors';
import { DOM_ELEMENTS } from './DOMElements/FinesMacContactDetailsElements';

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

  it('should render the component', () => {
    setupComponent(null);

    // Verify the component is rendered
    cy.get(DOM_ELEMENTS['primaryEmail']).should('exist');
  });

  it('should show errors for invalid contact details', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['primaryEmail']).focus().type('invalid-email', { delay: 0 });
    cy.get(DOM_ELEMENTS['secondaryEmail']).focus().type('invalid-email', { delay: 0 });
    cy.get(DOM_ELEMENTS['mobileTelephone']).focus().type('invalid-phone', { delay: 0 });
    cy.get(DOM_ELEMENTS['homeTelephone']).focus().type('invalid-phone', { delay: 0 });
    cy.get(DOM_ELEMENTS['workTelephone']).focus().type('invalid-phone', { delay: 0 });

    cy.get(DOM_ELEMENTS['submitButton']).click();

    for (const [key, value] of Object.entries(INVALID_DETAILS)) {
      cy.get(DOM_ELEMENTS['errorSummary']).should('contain', value);
    }
  });

  it('should accept valid contact details', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    cy.get(DOM_ELEMENTS['primaryEmail']).focus().clear().type('name@example.com', { delay: 0 });
    cy.get(DOM_ELEMENTS['secondaryEmail']).focus().clear().type('secondary@example.com', { delay: 0 });
    cy.get(DOM_ELEMENTS['mobileTelephone']).focus().clear().type('07700900982', { delay: 0 });
    cy.get(DOM_ELEMENTS['homeTelephone']).focus().clear().type('01632960001', { delay: 0 });
    cy.get(DOM_ELEMENTS['workTelephone']).focus().clear().type('01632960002', { delay: 0 });

    cy.get(DOM_ELEMENTS['submitButton']).click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });
});
