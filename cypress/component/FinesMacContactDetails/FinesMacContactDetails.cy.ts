import { mount } from 'cypress/angular';
import { FinesMacContactDetailsComponent } from '../../../src/app/flows/fines/fines-mac/fines-mac-contact-details/fines-mac-contact-details.component';
import { OpalFines } from '../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FINES_MAC_PERSONAL_DETAILS_FORM_MOCK } from '../../../src/app/flows/fines/fines-mac/fines-mac-personal-details/mocks/fines-mac-personal-details-form.mock';
import { INVALID_DETAILS } from './constants/FinesMacContactDetailsErrors';
import { DOM_ELEMENTS } from './constants/FinesMacContactDetailsElements';

describe('FinesMacContactDetailsComponent', () => {
  let mockFinesService = {
    finesMacState: { ...FINES_MAC_STATE_MOCK },
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
  const setupComponent = (formSubmit: any) => {
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

    mockFinesService.finesMacState.contactDetails.formData = {
      fm_contact_details_email_address_1: 'invalid-email',
      fm_contact_details_email_address_2: 'invalid-email',
      fm_contact_details_telephone_number_mobile: 'invalid-phone',
      fm_contact_details_telephone_number_home: 'invalid-phone',
      fm_contact_details_telephone_number_business: 'invalid-phone',
    };

    cy.get(DOM_ELEMENTS['submitButton']).click();

    for (const [, value] of Object.entries(INVALID_DETAILS)) {
      cy.get(DOM_ELEMENTS['errorSummary']).should('contain', value);
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

    cy.get(DOM_ELEMENTS['submitButton']).click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });
});
