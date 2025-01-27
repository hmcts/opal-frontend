import { mount } from 'cypress/angular';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FinesMacEmployerDetailsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-employer-details/fines-mac-employer-details.component';
import {
  LENGTH_VALIDATION,
  FORMAT_VALIDATION,
  REQUIRED_FIELDS_VALIDATION,
} from './constants/fines_mac_employer_details_error';
import { DOM_ELEMENTS } from './constants/fines_mac_employer_details_elements';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { DateService } from '@services/date-service/date.service';
import { FINES_EMPLOYER_DETAILS_MOCK } from './mocks/fines-employer-details-mock';
import { mock } from 'node:test';

describe('FinesMacEmployerDetailsComponent', () => {
  let mockFinesService = new FinesService(new DateService());

  mockFinesService.finesMacState = { ...FINES_EMPLOYER_DETAILS_MOCK };

  afterEach(() => {
    cy.then(() => {
      mockFinesService.finesMacState.employerDetails.formData = {
        fm_employer_details_employer_company_name: '',
        fm_employer_details_employer_reference: '',
        fm_employer_details_employer_email_address: '',
        fm_employer_details_employer_telephone_number: '',
        fm_employer_details_employer_address_line_1: '',
        fm_employer_details_employer_address_line_2: '',
        fm_employer_details_employer_address_line_3: '',
        fm_employer_details_employer_address_line_4: '',
        fm_employer_details_employer_address_line_5: '',
        fm_employer_details_employer_post_code: '',
      };
    });
  });

  const setupComponent = (formSubmit: any, defendantTypeMock: string = '') => {
    mount(FinesMacEmployerDetailsComponent, {
      providers: [
        { provide: OpalFines, useValue: mockFinesService },
        { provide: FinesService, useValue: mockFinesService },
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
        handleEmployerDetailsSubmit: formSubmit,
        defendantType: defendantTypeMock,
      },
    });
  };

  it('should render the component', () => {
    setupComponent(null);

    // Verify the component is rendered
    cy.get('app-fines-mac-employer-details-form').should('exist');
  });

  it('should not show the error summary on initial load', () => {
    setupComponent(null);

    // Verify the error summary is not visible
    cy.get(DOM_ELEMENTS['errorSummary']).should('not.exist');
  });

  it('should allow for form submission with valid data', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit);

    mockFinesService.finesMacState.employerDetails.formData = {
      fm_employer_details_employer_company_name: 'Test Employer',
      fm_employer_details_employer_reference: '1234567890',
      fm_employer_details_employer_email_address: 'test@test.com',
      fm_employer_details_employer_telephone_number: '07700900982',
      fm_employer_details_employer_address_line_1: 'Address Line 1',
      fm_employer_details_employer_address_line_2: 'Address Line 2',
      fm_employer_details_employer_address_line_3: 'Address Line 3',
      fm_employer_details_employer_address_line_4: 'Address Line 4',
      fm_employer_details_employer_address_line_5: 'Address Line 5',
      fm_employer_details_employer_post_code: '12345',
    };

    cy.get(DOM_ELEMENTS['submitButton']).first().click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should display error messages for incorrect format and character limit', () => {
    setupComponent(null);

    const incorrectData = {
      fm_employer_details_employer_company_name: 'A very long employer name that exceeds the character limit',
      fm_employer_details_employer_reference: 'A very long employee reference that exceeds the character limit',
      fm_employer_details_employer_email_address: 'a'.repeat(77),
      fm_employer_details_employer_telephone_number: 'invalid-telephone-format',
      fm_employer_details_employer_address_line_1: 'A very long address line 1 that exceeds the character limit',
      fm_employer_details_employer_address_line_2: 'A very long address line 2 that exceeds the character limit',
      fm_employer_details_employer_address_line_3: 'A very long address line 3 that exceeds the character limit',
      fm_employer_details_employer_address_line_4: 'A very long address line 4 that exceeds the character limit',
      fm_employer_details_employer_address_line_5: 'A very long address line 5 that exceeds the character limit',
      fm_employer_details_employer_post_code: 'invalid-postcode-format',
    };

    mockFinesService.finesMacState.employerDetails.formData = incorrectData;

    cy.get(DOM_ELEMENTS['submitButton']).first().click();

    for (const [, value] of Object.entries(LENGTH_VALIDATION)) {
      cy.get(DOM_ELEMENTS['errorSummary']).should('contain', value);
    }
  });

  it('should display error messages for required fields', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['submitButton']).first().click();

    for (const [, value] of Object.entries(REQUIRED_FIELDS_VALIDATION)) {
      cy.get(DOM_ELEMENTS['errorSummary']).should('contain', value);
    }
  });

  it('should display error messages for incorrect format and special characters', () => {
    setupComponent(null);

    const incorrectData = {
      fm_employer_details_employer_company_name: 'John Maddy & co., Limited company',
      fm_employer_details_employer_reference: 'XNJ#5567',
      fm_employer_details_employer_email_address: 'test-test-com',
      fm_employer_details_employer_telephone_number: '0123 456 789#',
      fm_employer_details_employer_address_line_1: '12* test road',
      fm_employer_details_employer_address_line_2: 'Avenue_test*',
      fm_employer_details_employer_address_line_3: 'Avenue_test*',
      fm_employer_details_employer_address_line_4: 'Avenue_test*',
      fm_employer_details_employer_address_line_5: 'Avenue_test*',
      fm_employer_details_employer_post_code: 'AB124BM#',
    };

    mockFinesService.finesMacState.employerDetails.formData = incorrectData;

    cy.get(DOM_ELEMENTS['submitButton']).first().click();

    for (const [, value] of Object.entries(FORMAT_VALIDATION)) {
      cy.get(DOM_ELEMENTS['errorSummary']).should('contain', value);
    }
  });
});
