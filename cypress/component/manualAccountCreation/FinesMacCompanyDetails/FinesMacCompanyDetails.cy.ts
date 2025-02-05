import { mount } from 'cypress/angular';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FinesMacCompanyDetailsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-company-details/fines-mac-company-details.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { DateService } from '@services/date-service/date.service';
import { FINES_COMPANY_DETAILS_MOCK } from './mocks/fines-mac-company-details-mock';
import {
  REQUIRED_VALIDATION,
  SPECIAL_CHARACTERS_PATTERN_VALIDATION,
  MAX_LENGTH_VALIDATION,
  ALPHABETICAL_TEXT_PATTERN_VALIDATION,
} from './constants/fines-mac-company-details-errors';
import { DOM_ELEMENTS } from './constants/fines-mac-company-details-elements';

describe('FinesMacCompanyDetailsComponent', () => {
  let mockFinesService = new FinesService(new DateService());
  mockFinesService.finesMacState = { ...FINES_COMPANY_DETAILS_MOCK };

  const DOM_ELEMENTS_BASE: { [key: string]: string } = DOM_ELEMENTS;

  const setupComponent = (formSubmit: any, defendantTypeMock: string = '') => {
    mount(FinesMacCompanyDetailsComponent, {
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
        handleCompanyDetailsSubmit: formSubmit,
        defendantType: defendantTypeMock,
      },
    });
  };

  it('should render the component', () => {
    setupComponent(null);

    // Verify the component is rendered
    cy.get('app-fines-mac-company-details-form').should('exist');
  });

  afterEach(() => {
    cy.then(() => {
      mockFinesService.finesMacState.companyDetails.formData = {
        fm_company_details_company_name: '',
        fm_company_details_add_alias: null,
        fm_company_details_aliases: [],
        fm_company_details_address_line_1: '',
        fm_company_details_address_line_2: '',
        fm_company_details_address_line_3: '',
        fm_company_details_postcode: '',
      };
    });
  });

  it('should show errors when form is submitted without required fields', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.submitButton).first().click();
    cy.get(DOM_ELEMENTS.errorSummary).should(
      'contain',
      REQUIRED_VALIDATION.requiredName,
      REQUIRED_VALIDATION.requiredAddressLine1,
    );
  });

  it('should load button for next page for Company Defendant', () => {
    setupComponent(null, 'company');

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Add contact details');
  });

  it('should register all fields correctly', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Company details');
    cy.get(DOM_ELEMENTS.companyNameLabel).should('contain', 'Company name');
    cy.get(DOM_ELEMENTS.Legend).should('contain', 'Address');
    cy.get(DOM_ELEMENTS.addressLine1Label).should('contain', 'Address line 1');
    cy.get(DOM_ELEMENTS.addressLine2Label).should('contain', 'Address line 2');
    cy.get(DOM_ELEMENTS.addressLine3Label).should('contain', 'Address line 3');
    cy.get(DOM_ELEMENTS.postcodeLabel).should('contain', 'Postcode');
    cy.get(DOM_ELEMENTS.addAlias).should('exist');

    cy.get(DOM_ELEMENTS.companyNameInput).should('exist');
    cy.get(DOM_ELEMENTS.addressLine1Input).should('exist');
    cy.get(DOM_ELEMENTS.addressLine2Input).should('exist');
    cy.get(DOM_ELEMENTS.addressLine3Input).should('exist');
    cy.get(DOM_ELEMENTS.postcodeInput).should('exist');

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Return to account details');
    cy.get(DOM_ELEMENTS.cancelLink).should('exist');
  });

  it('should register all fields for aliases correctly', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.addAlias).first().click();
    cy.get(DOM_ELEMENTS.Legend).should('contain', 'Alias 1');
    cy.get(DOM_ELEMENTS.aliasCompanyName1Label).should('contain', 'Company name');
    cy.get(DOM_ELEMENTS.aliasCompanyName1).should('exist');

    cy.get(DOM_ELEMENTS.additionalAlias).should('exist');
  });

  it('should allow form to be submitted with valid data', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit);

    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_company_name = 'Company Name';
    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_address_line_1 = '123 Fake Street';
    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_postcode = 'AB12 3CD';

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get('@formSubmitSpy').should('be.called');
  });

  it('should show errors when form is submitted with empty aliases fields', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.addAlias).first().click();

    for (let i = 0; i < 4; i++) {
      cy.get(DOM_ELEMENTS.additionalAlias).first().click();
    }

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    for (const [, value] of Object.entries(REQUIRED_VALIDATION)) {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
    }
  });

  it('should show maxlength errors when form fields exceed character limits', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.addAlias).first().click();

    for (let i = 0; i < 4; i++) {
      cy.get(DOM_ELEMENTS.additionalAlias).first().click();
    }

    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_company_name = 'A'.repeat(51);
    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_address_line_1 = 'A'.repeat(31);
    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_address_line_2 = 'A'.repeat(31);
    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_address_line_3 = 'A'.repeat(17);
    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_postcode = 'A'.repeat(9);

    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_aliases.push({
      fm_company_details_alias_company_name_0: 'A'.repeat(51),
    });
    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_aliases.push({
      fm_company_details_alias_company_name_1: 'A'.repeat(31),
    });
    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_aliases.push({
      fm_company_details_alias_company_name_2: 'A'.repeat(31),
    });
    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_aliases.push({
      fm_company_details_alias_company_name_3: 'A'.repeat(31),
    });
    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_aliases.push({
      fm_company_details_alias_company_name_4: 'A'.repeat(31),
    });
    cy.get(DOM_ELEMENTS.submitButton).first().click();

    for (const [, value] of Object.entries(MAX_LENGTH_VALIDATION)) {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
    }
  });

  it('should show errors when address line fields contain asterisks (*)', () => {
    setupComponent(null);

    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_address_line_1 = '123 Fake Street*';
    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_address_line_2 = '123 Fake Street*';
    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_address_line_3 = '123 Fake Street*';

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    for (const [, value] of Object.entries(SPECIAL_CHARACTERS_PATTERN_VALIDATION)) {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
    }
  });

  it('should validate type check to ensure name fields are only alphabetical letters A-Z', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.addAlias).first().click();

    for (let i = 0; i < 4; i++) {
      cy.get(DOM_ELEMENTS.additionalAlias).first().click();
    }

    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_company_name = '123% Fake Street';
    for (let i = 0; i < 5; i++) {
      mockFinesService.finesMacState.companyDetails.formData.fm_company_details_aliases.push({
        [`fm_company_details_alias_company_name_${i}`]: '123% Fake Street',
      });
    }

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    for (const [, value] of Object.entries(ALPHABETICAL_TEXT_PATTERN_VALIDATION)) {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
    }
  });

  it('should allow form to be submitted with valid data with aliases', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit);

    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_company_name = 'Company Name';
    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_address_line_1 = '123 Fake Street';
    mockFinesService.finesMacState.companyDetails.formData.fm_company_details_postcode = 'AB12 3CD';

    cy.get(DOM_ELEMENTS.addAlias).first().click();
    cy.get(DOM_ELEMENTS.aliasCompanyName1).type('Alias 1', { delay: 0 });

    for (let i = 0; i < 4; i++) {
      cy.get(DOM_ELEMENTS.additionalAlias).first().click();
      cy.get(DOM_ELEMENTS_BASE[`aliasCompanyName${i + 2}`]).type(`Alias ${i + 2}`, { delay: 0 });
    }

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get('@formSubmitSpy').should('be.called');
  });

  it('should allow workflow for alias fields to be removed', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.addAlias).first().click();

    for (let i = 0; i < 4; i++) {
      cy.get(DOM_ELEMENTS.additionalAlias).first().click();
    }

    for (let i = 0; i < 4; i++) {
      cy.get(DOM_ELEMENTS.aliasRemoveButton).first().click();
    }

    cy.get(DOM_ELEMENTS.addAlias).first().click();
  });
});
