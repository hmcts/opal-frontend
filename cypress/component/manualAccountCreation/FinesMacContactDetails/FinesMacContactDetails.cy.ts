import { mount } from 'cypress/angular';
import { FinesMacContactDetailsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-contact-details/fines-mac-contact-details.component';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { INVALID_DETAILS } from './constants/fines_mac_contact_details_errors';
import { DOM_ELEMENTS } from './constants/fines_mac_contact_details_elements';

describe('FinesMacContactDetailsComponent', () => {
  let mockFinesService = {
    finesMacState: { ...FINES_MAC_STATE_MOCK },
  };

  const setupComponent = (formSubmit: any, defendantType: string = '') => {
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
        defendantType: defendantType,
      },
    });
  };
  afterEach(() => {
    cy.then(() => {
      mockFinesService.finesMacState.contactDetails.formData = {
        fm_contact_details_email_address_1: '',
        fm_contact_details_email_address_2: '',
        fm_contact_details_telephone_number_mobile: '',
        fm_contact_details_telephone_number_home: '',
        fm_contact_details_telephone_number_business: '',
      };
    });
  });

  it('should render the component', () => {
    setupComponent(null);

    // Verify the component is rendered
    cy.get(DOM_ELEMENTS.primaryEmailInput).should('exist');
  });

  it('should load button for next page for adultOrYouthOnly Defendant', () => {
    setupComponent(null, 'adultOrYouthOnly');

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Add employer details');
  });

  it('should load button for next page for AYPG Defendant', () => {
    setupComponent(null, 'parentOrGuardianToPay');

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Add employer details');
  });

  it('should load button for next page for Company Defendant', () => {
    setupComponent(null, 'company');

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Add offence details');
  });

  it('should load all elements on the screen correctly', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Defendant contact details');

    cy.get(DOM_ELEMENTS.primaryEmailInput).should('exist');
    cy.get(DOM_ELEMENTS.secondaryEmailInput).should('exist');
    cy.get(DOM_ELEMENTS.mobileTelephoneInput).should('exist');
    cy.get(DOM_ELEMENTS.homeTelephoneInput).should('exist');
    cy.get(DOM_ELEMENTS.workTelephoneInput).should('exist');
    cy.get(DOM_ELEMENTS.submitButton).should('exist');

    cy.get(DOM_ELEMENTS.primaryEmailSubheading).should('contain', 'Primary email address');
    cy.get(DOM_ELEMENTS.secondaryEmailSubheading).should('contain', 'Secondary email address');
    cy.get(DOM_ELEMENTS.mobileTelephoneSubheading).should('contain', 'Mobile telephone number');
    cy.get(DOM_ELEMENTS.homeTelephoneSubheading).should('contain', 'Home telephone number');
    cy.get(DOM_ELEMENTS.workTelephoneSubheading).should('contain', 'Work telephone number');

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Return to account details');
    cy.get(DOM_ELEMENTS.cancelLink).should('contain', 'Cancel');
  });

  it('should show errors for invalid contact details', () => {
    setupComponent(null);

    mockFinesService.finesMacState.contactDetails.formData = {
      fm_contact_details_email_address_1: 'invalid-email',
      fm_contact_details_email_address_2: 'invalid-email',
      fm_contact_details_telephone_number_mobile: 'invalid-phone',
      fm_contact_details_telephone_number_home: 'invalid-phone',
      fm_contact_details_telephone_number_business: 'invalid-phone',
    };

    cy.get(DOM_ELEMENTS.submitButton).click();

    for (const [, value] of Object.entries(INVALID_DETAILS)) {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
    }
  });

  it('should accept valid contact details', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    mockFinesService.finesMacState.contactDetails.formData = {
      fm_contact_details_email_address_1: 'name@example.com',
      fm_contact_details_email_address_2: 'secondary@example.com',
      fm_contact_details_telephone_number_mobile: '07700900982',
      fm_contact_details_telephone_number_home: '01632960001',
      fm_contact_details_telephone_number_business: '01632960002',
    };

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });
});
