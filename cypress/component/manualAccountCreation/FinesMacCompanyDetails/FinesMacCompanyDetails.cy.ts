import { mount } from 'cypress/angular';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FinesMacCompanyDetailsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-company-details/fines-mac-company-details.component';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_COMPANY_DETAILS_MOCK } from './mocks/fines-mac-company-details-mock';
import {
  REQUIRED_VALIDATION,
  SPECIAL_CHARACTERS_PATTERN_VALIDATION,
  MAX_LENGTH_VALIDATION,
  ALPHABETICAL_TEXT_PATTERN_VALIDATION,
} from './constants/fines-mac-company-details-errors';
import { DOM_ELEMENTS } from './constants/fines-mac-company-details-elements';

describe('FinesMacCompanyDetailsComponent', () => {
  let finesMacState = structuredClone(FINES_COMPANY_DETAILS_MOCK);

  const setupComponent = (formSubmit: any, defendantTypeMock: string = '') => {
    mount(FinesMacCompanyDetailsComponent, {
      providers: [
        OpalFines,
        {
          provide: FinesMacStore,
          useFactory: () => {
            const store = new FinesMacStore();
            store.setFinesMacStore(finesMacState);
            return store;
          },
        },
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
    setupComponent(null, 'company');

    // Verify the component is rendered
    cy.get('app-fines-mac-company-details-form').should('exist');
  });

  afterEach(() => {
    cy.then(() => {
      finesMacState.companyDetails.formData = {
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

  it(
    '(AC.8) should error when submitted without mandatory fields but has included optional input - Return to account details + Add contact details',
    { tags: ['@PO-345', '@PO-365'] },
    () => {
      setupComponent(null, 'company');

      finesMacState.companyDetails.formData.fm_company_details_address_line_2 = 'Addr2';

      cy.get(DOM_ELEMENTS.submitButton).contains('Return to account details').click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredName);
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAddressLine1);

      cy.get(DOM_ELEMENTS.addContactDetailsButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredName);
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAddressLine1);
    },
  );

  it('(AC.1) should be created as per the design artefact', () => {
    setupComponent(null, 'company');

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
    cy.get(DOM_ELEMENTS.addContactDetailsButton).should('exist');
    cy.get(DOM_ELEMENTS.cancelLink).should('exist');
    cy.get(DOM_ELEMENTS.cancelLink).should('exist');
  });

  it('(AC.2) should register all fields for aliases correctly', { tags: ['@PO-345', '@PO-365'] }, () => {
    setupComponent(null, 'company');

    cy.get(DOM_ELEMENTS.addAlias).check();
    cy.get(DOM_ELEMENTS.aliasCompanyName1Label).should('contain', 'Alias 1');
    cy.get(DOM_ELEMENTS.aliasCompanyName1Input).prev().should('contain', 'Company name');
    cy.get(DOM_ELEMENTS.aliasCompanyName1Input).should('exist');

    cy.get(DOM_ELEMENTS.additionalAlias).should('exist');
  });

  it('(AC.3) should allow users to add another aliases', { tags: ['@PO-345', '@PO-365'] }, () => {
    setupComponent(null, 'company');

    cy.get(DOM_ELEMENTS.addAlias).check();

    cy.get(DOM_ELEMENTS.aliasRemoveLink).should('not.exist');
    cy.get(DOM_ELEMENTS.aliasCompanyName2Label).should('not.exist');
    cy.get(DOM_ELEMENTS.aliasCompanyName2Input).should('not.exist');

    cy.get(DOM_ELEMENTS.additionalAlias).first().click();

    cy.get(DOM_ELEMENTS.aliasCompanyName1Label).should('have.text', 'Alias 1');
    cy.get(DOM_ELEMENTS.aliasCompanyName1Input).should('exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName2Label).should('have.text', 'Alias 2');
    cy.get(DOM_ELEMENTS.aliasCompanyName2Input).should('exist');

    cy.get(DOM_ELEMENTS.aliasRemoveLink).should('exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName3Label).should('not.exist');
    cy.get(DOM_ELEMENTS.aliasCompanyName3Input).should('not.exist');
  });

  it('(AC.4) should allow users to add up to 5 aliases', { tags: ['@PO-345', '@PO-365'] }, () => {
    setupComponent(null, 'company');

    cy.get(DOM_ELEMENTS.addAlias).check();

    cy.get(DOM_ELEMENTS.aliasRemoveLink).should('not.exist');
    cy.get(DOM_ELEMENTS.aliasCompanyName1Label).should('have.text', 'Alias 1');
    cy.get(DOM_ELEMENTS.aliasCompanyName1Input).should('exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName2Label).should('not.exist');
    cy.get(DOM_ELEMENTS.aliasCompanyName2Input).should('not.exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName3Label).should('not.exist');
    cy.get(DOM_ELEMENTS.aliasCompanyName3Input).should('not.exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName4Label).should('not.exist');
    cy.get(DOM_ELEMENTS.aliasCompanyName4Input).should('not.exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName5Label).should('not.exist');
    cy.get(DOM_ELEMENTS.aliasCompanyName5Input).should('not.exist');

    //Add Alias 2
    cy.get(DOM_ELEMENTS.additionalAlias).first().click();
    cy.get(DOM_ELEMENTS.aliasRemoveLink).should('exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName2Label).should('have.text', 'Alias 2');
    cy.get(DOM_ELEMENTS.aliasCompanyName2Input).should('exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName3Label).should('not.exist');
    cy.get(DOM_ELEMENTS.aliasCompanyName3Input).should('not.exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName4Label).should('not.exist');
    cy.get(DOM_ELEMENTS.aliasCompanyName4Input).should('not.exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName5Label).should('not.exist');
    cy.get(DOM_ELEMENTS.aliasCompanyName5Input).should('not.exist');

    //Add Alias 3
    cy.get(DOM_ELEMENTS.additionalAlias).first().click();
    cy.get(DOM_ELEMENTS.aliasRemoveLink).should('exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName3Label).should('have.text', 'Alias 3');
    cy.get(DOM_ELEMENTS.aliasCompanyName3Input).should('exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName4Label).should('not.exist');
    cy.get(DOM_ELEMENTS.aliasCompanyName4Input).should('not.exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName5Label).should('not.exist');
    cy.get(DOM_ELEMENTS.aliasCompanyName5Input).should('not.exist');

    //Add Alias 4
    cy.get(DOM_ELEMENTS.additionalAlias).first().click();
    cy.get(DOM_ELEMENTS.aliasRemoveLink).should('exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName4Label).should('have.text', 'Alias 4');
    cy.get(DOM_ELEMENTS.aliasCompanyName4Input).should('exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName5Label).should('not.exist');
    cy.get(DOM_ELEMENTS.aliasCompanyName5Input).should('not.exist');

    //Add Alias 5
    cy.get(DOM_ELEMENTS.additionalAlias).first().click();
    cy.get(DOM_ELEMENTS.aliasRemoveLink).should('exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName1Label).should('have.text', 'Alias 1');
    cy.get(DOM_ELEMENTS.aliasCompanyName1Input).should('exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName2Label).should('have.text', 'Alias 2');
    cy.get(DOM_ELEMENTS.aliasCompanyName2Input).should('exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName3Label).should('have.text', 'Alias 3');
    cy.get(DOM_ELEMENTS.aliasCompanyName3Input).should('exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName4Label).should('have.text', 'Alias 4');
    cy.get(DOM_ELEMENTS.aliasCompanyName4Input).should('exist');

    cy.get(DOM_ELEMENTS.aliasCompanyName5Label).should('have.text', 'Alias 5');
    cy.get(DOM_ELEMENTS.aliasCompanyName5Input).should('exist');

    cy.get(DOM_ELEMENTS.additionalAlias).should('not.exist');
  });

  it(
    '(AC.5) should allow users to remove an alias when an additional alias has been added for the first time',
    { tags: ['@PO-345', '@PO-365'] },
    () => {
      setupComponent(null, 'company');

      cy.get(DOM_ELEMENTS.addAlias).check();
      cy.get(DOM_ELEMENTS.additionalAlias).first().click();
      cy.get(DOM_ELEMENTS.aliasRemoveLink).should('exist');

      cy.get(DOM_ELEMENTS.aliasCompanyName1Label).should('have.text', 'Alias 1');
      cy.get(DOM_ELEMENTS.aliasCompanyName1Input).should('exist');

      cy.get(DOM_ELEMENTS.aliasCompanyName2Label).should('have.text', 'Alias 2');
      cy.get(DOM_ELEMENTS.aliasCompanyName2Input).should('exist');

      cy.get(DOM_ELEMENTS.aliasRemoveLink).click();

      cy.get(DOM_ELEMENTS.aliasCompanyName1Label).should('have.text', 'Alias 1');
      cy.get(DOM_ELEMENTS.aliasCompanyName1Input).should('exist');

      cy.get(DOM_ELEMENTS.aliasCompanyName2Label).should('not.exist');
      cy.get(DOM_ELEMENTS.aliasCompanyName2Input).should('not.exist');
    },
  );

  it(
    '(AC.6) should allow users to remove an alias when multiple additional aliases have been added',
    { tags: ['@PO-345', '@PO-365'] },
    () => {
      setupComponent(null, 'company');

      cy.get(DOM_ELEMENTS.addAlias).check();
      cy.get(DOM_ELEMENTS.additionalAlias).first().click();
      cy.get(DOM_ELEMENTS.additionalAlias).first().click();
      cy.get(DOM_ELEMENTS.additionalAlias).first().click();
      cy.get(DOM_ELEMENTS.additionalAlias).first().click();
      cy.get(DOM_ELEMENTS.aliasRemoveLink).should('exist');

      cy.get(DOM_ELEMENTS.aliasCompanyName5Label).should('have.text', 'Alias 5');
      cy.get(DOM_ELEMENTS.aliasCompanyName5Input).should('exist');

      cy.get(DOM_ELEMENTS.aliasRemoveLink).click();

      cy.get(DOM_ELEMENTS.aliasCompanyName1Label).should('have.text', 'Alias 1');
      cy.get(DOM_ELEMENTS.aliasCompanyName1Input).should('exist');

      cy.get(DOM_ELEMENTS.aliasCompanyName2Label).should('have.text', 'Alias 2');
      cy.get(DOM_ELEMENTS.aliasCompanyName2Input).should('exist');

      cy.get(DOM_ELEMENTS.aliasCompanyName3Label).should('have.text', 'Alias 3');
      cy.get(DOM_ELEMENTS.aliasCompanyName3Input).should('exist');

      cy.get(DOM_ELEMENTS.aliasCompanyName4Label).should('have.text', 'Alias 4');
      cy.get(DOM_ELEMENTS.aliasCompanyName4Input).should('exist');

      cy.get(DOM_ELEMENTS.aliasCompanyName5Label).should('not.exist');
      cy.get(DOM_ELEMENTS.aliasCompanyName5Input).should('not.exist');

      cy.get(DOM_ELEMENTS.aliasRemoveLink).click();

      cy.get(DOM_ELEMENTS.aliasCompanyName1Label).should('have.text', 'Alias 1');
      cy.get(DOM_ELEMENTS.aliasCompanyName1Input).should('exist');

      cy.get(DOM_ELEMENTS.aliasCompanyName2Label).should('have.text', 'Alias 2');
      cy.get(DOM_ELEMENTS.aliasCompanyName2Input).should('exist');

      cy.get(DOM_ELEMENTS.aliasCompanyName3Label).should('have.text', 'Alias 3');
      cy.get(DOM_ELEMENTS.aliasCompanyName3Input).should('exist');

      cy.get(DOM_ELEMENTS.aliasCompanyName4Label).should('not.exist');
      cy.get(DOM_ELEMENTS.aliasCompanyName4Input).should('not.exist');

      cy.get(DOM_ELEMENTS.aliasRemoveLink).click();

      cy.get(DOM_ELEMENTS.aliasCompanyName1Label).should('have.text', 'Alias 1');
      cy.get(DOM_ELEMENTS.aliasCompanyName1Input).should('exist');

      cy.get(DOM_ELEMENTS.aliasCompanyName2Label).should('have.text', 'Alias 2');
      cy.get(DOM_ELEMENTS.aliasCompanyName2Input).should('exist');

      cy.get(DOM_ELEMENTS.aliasCompanyName3Label).should('not.exist');
      cy.get(DOM_ELEMENTS.aliasCompanyName3Input).should('not.exist');

      cy.get(DOM_ELEMENTS.aliasRemoveLink).click();

      cy.get(DOM_ELEMENTS.aliasCompanyName1Label).should('have.text', 'Alias 1');
      cy.get(DOM_ELEMENTS.aliasCompanyName1Input).should('exist');

      cy.get(DOM_ELEMENTS.aliasCompanyName2Label).should('not.exist');
      cy.get(DOM_ELEMENTS.aliasCompanyName2Input).should('not.exist');
    },
  );

  it('(AC.7) should not retain alias information when checkbox is unticked', { tags: ['@PO-345', '@PO-365'] }, () => {
    setupComponent(null, 'company');

    cy.get(DOM_ELEMENTS.addAlias).check();
    cy.get(DOM_ELEMENTS.additionalAlias).first().click();

    finesMacState.companyDetails.formData.fm_company_details_aliases.push({
      fm_company_details_alias_company_name_0: 'Alias 1',
    });
    finesMacState.companyDetails.formData.fm_company_details_aliases.push({
      fm_company_details_alias_company_name_1: 'Alias 2',
    });

    cy.get(DOM_ELEMENTS.addAlias).uncheck();
    cy.get(DOM_ELEMENTS.aliasCompanyName1Input).should('not.exist');
    cy.get(DOM_ELEMENTS.aliasCompanyName2Input).should('not.exist');

    cy.get(DOM_ELEMENTS.addAlias).check();
    cy.get(DOM_ELEMENTS.aliasCompanyName1Input).should('have.value', '');
    cy.get(DOM_ELEMENTS.aliasCompanyName2Input).should('not.exist');
  });

  it('(AC.12) should allow form to be submitted with valid data', { tags: ['@PO-345', '@PO-365'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit);

    finesMacState.companyDetails.formData.fm_company_details_company_name = 'Company Name';
    finesMacState.companyDetails.formData.fm_company_details_address_line_1 = '123 Fake Street';
    finesMacState.companyDetails.formData.fm_company_details_postcode = 'AB12 3CD';

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get('@formSubmitSpy').should('be.called');
  });

  it(
    '(AC.9) should errors when form is submitted with empty aliases fields - Return to account details + Add contact details',
    { tags: ['@PO-345', '@PO-365'] },
    () => {
      setupComponent(null, 'company');

      cy.get(DOM_ELEMENTS.addAlias).check();

      cy.get(DOM_ELEMENTS.submitButton).contains('Return to account details').click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias1);

      cy.get(DOM_ELEMENTS.addContactDetailsButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias1);
    },
  );

  it(
    '(AC.10) should error when submitted with many empty aliases fields - Return to account details + Add contact details',
    { tags: ['@PO-345', '@PO-365'] },
    () => {
      setupComponent(null, 'company');

      cy.get(DOM_ELEMENTS.addAlias).check();

      cy.get(DOM_ELEMENTS.additionalAlias).first().click();
      cy.get(DOM_ELEMENTS.additionalAlias).first().click();
      cy.get(DOM_ELEMENTS.additionalAlias).first().click();
      cy.get(DOM_ELEMENTS.additionalAlias).first().click();

      cy.get(DOM_ELEMENTS.submitButton).contains('Return to account details').click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias1);
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias2);
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias3);
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias4);
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias5);

      cy.get(DOM_ELEMENTS.aliasCompanyName3Input).type('Alias 3', { delay: 0 });

      cy.get(DOM_ELEMENTS.submitButton).contains('Return to account details').click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias1);
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias2);
      cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', REQUIRED_VALIDATION.requiredAlias3);
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias4);
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias5);

      cy.get(DOM_ELEMENTS.addContactDetailsButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias1);
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias2);
      cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', REQUIRED_VALIDATION.requiredAlias3);
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias4);
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias5);
    },
  );

  it(
    '(AC.1) should show maxlength errors when form fields exceed character limits',
    { tags: ['@PO-345', '@PO-365'] },
    () => {
      setupComponent(null, 'company');

      cy.get(DOM_ELEMENTS.addAlias).check();

      for (let i = 0; i < 4; i++) {
        cy.get(DOM_ELEMENTS.additionalAlias).first().click();
      }

      finesMacState.companyDetails.formData.fm_company_details_company_name = 'A'.repeat(51);
      finesMacState.companyDetails.formData.fm_company_details_address_line_1 = 'A'.repeat(31);
      finesMacState.companyDetails.formData.fm_company_details_address_line_2 = 'A'.repeat(31);
      finesMacState.companyDetails.formData.fm_company_details_address_line_3 = 'A'.repeat(17);
      finesMacState.companyDetails.formData.fm_company_details_postcode = 'A'.repeat(9);

      finesMacState.companyDetails.formData.fm_company_details_aliases.push({
        fm_company_details_alias_company_name_0: 'A'.repeat(51),
      });
      finesMacState.companyDetails.formData.fm_company_details_aliases.push({
        fm_company_details_alias_company_name_1: 'A'.repeat(31),
      });
      finesMacState.companyDetails.formData.fm_company_details_aliases.push({
        fm_company_details_alias_company_name_2: 'A'.repeat(31),
      });
      finesMacState.companyDetails.formData.fm_company_details_aliases.push({
        fm_company_details_alias_company_name_3: 'A'.repeat(31),
      });
      finesMacState.companyDetails.formData.fm_company_details_aliases.push({
        fm_company_details_alias_company_name_4: 'A'.repeat(31),
      });
      cy.get(DOM_ELEMENTS.submitButton).first().click();

      for (const [, value] of Object.entries(MAX_LENGTH_VALIDATION)) {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
      }
    },
  );

  it(
    '(AC.1) should show errors when address line fields contain asterisks (*)',
    { tags: ['@PO-345', '@PO-365'] },
    () => {
      setupComponent(null, 'company');

      finesMacState.companyDetails.formData.fm_company_details_address_line_1 = '123 Fake Street*';
      finesMacState.companyDetails.formData.fm_company_details_address_line_2 = '123 Fake Street*';
      finesMacState.companyDetails.formData.fm_company_details_address_line_3 = '123 Fake Street*';

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      for (const [, value] of Object.entries(SPECIAL_CHARACTERS_PATTERN_VALIDATION)) {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
      }
    },
  );

  it.skip(
    '(AC.1) should validate type check to ensure name fields are only alphabetical letters A-Z',
    { tags: ['@PO-345', '@PO-365'] },
    () => {
      setupComponent(null, 'company');

      cy.get(DOM_ELEMENTS.addAlias).check();

      for (let i = 0; i < 4; i++) {
        cy.get(DOM_ELEMENTS.additionalAlias).first().click();
      }

      finesMacState.companyDetails.formData.fm_company_details_company_name = '123% Fake Street';
      for (let i = 0; i < 5; i++) {
        finesMacState.companyDetails.formData.fm_company_details_aliases.push({
          [`fm_company_details_alias_company_name_${i}`]: '123% Fake Street',
        });
      }

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      for (const [, value] of Object.entries(ALPHABETICAL_TEXT_PATTERN_VALIDATION)) {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
      }
    },
  );
  it(
    '(AC.11) should allow form to be submitted when validation errors are corrected - Return to account details + Add contact details',
    { tags: ['@PO-345', '@PO-365'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');
      setupComponent(mockFormSubmit, 'company');

      cy.get(DOM_ELEMENTS.submitButton).contains('Return to account details').click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');
      cy.get('@formSubmitSpy').should('not.have.been.called');
      cy.then(() => {
        setupComponent(mockFormSubmit, 'company');
        finesMacState.companyDetails.formData.fm_company_details_company_name = 'CNAME';
        finesMacState.companyDetails.formData.fm_company_details_address_line_1 = 'addr1';

        cy.get(DOM_ELEMENTS.submitButton).contains('Return to account details').click();
        cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');
        cy.get('@formSubmitSpy').should('have.been.called');

        cy.get(DOM_ELEMENTS.addContactDetailsButton).click();
        cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');
        cy.get('@formSubmitSpy').should('have.been.called');
      });
    },
  );

  it(
    '(AC.12) should allow form to be submitted with valid data with aliases - Return to account details + Add contact details',
    { tags: ['@PO-345', '@PO-365'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');
      setupComponent(mockFormSubmit, 'company');

      finesMacState.companyDetails.formData.fm_company_details_company_name = 'Company Name';
      finesMacState.companyDetails.formData.fm_company_details_address_line_1 = '123 Fake Street';
      finesMacState.companyDetails.formData.fm_company_details_postcode = 'AB12 3CD';
      finesMacState.companyDetails.formData.fm_company_details_add_alias = true;
      finesMacState.companyDetails.formData.fm_company_details_aliases = [
        { fm_company_details_alias_company_name_0: 'Alias 1' },
        { fm_company_details_alias_company_name_1: 'Alias 2' },
        { fm_company_details_alias_company_name_2: 'Alias 3' },
        { fm_company_details_alias_company_name_3: 'Alias 4' },
        { fm_company_details_alias_company_name_4: 'Alias 5' },
      ];

      cy.get(DOM_ELEMENTS.submitButton).contains('Return to account details').click();
      cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');

      cy.get('@formSubmitSpy').should('be.called');

      cy.get(DOM_ELEMENTS.addContactDetailsButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');

      cy.get('@formSubmitSpy').should('be.called');
    },
  );
  it(
    '(AC.1) should convert specified company details fields to uppercase on user input',
    { tags: ['@PO-345', '@PO-1450'] },
    () => {
      setupComponent(null, 'company');

      cy.get(DOM_ELEMENTS.companyNameInput)
        .type('example company', { delay: 0 })
        .should('have.value', 'EXAMPLE COMPANY');
      cy.get(DOM_ELEMENTS.postcodeInput).type('ab12 3cd', { delay: 0 }).should('have.value', 'AB12 3CD');

      cy.get(DOM_ELEMENTS.addAlias).check();
      cy.get(DOM_ELEMENTS.aliasCompanyName1Input)
        .type('alias company', { delay: 0 })
        .should('have.value', 'ALIAS COMPANY');

      // Add the remaining four aliases using a loop
      for (let i = 1; i < 5; i++) {
        cy.get(DOM_ELEMENTS.additionalAlias).click();
        cy.get(DOM_ELEMENTS[`aliasCompanyName${i + 1}Input` as keyof typeof DOM_ELEMENTS])
          .type(`alias company ${i + 1}`, { delay: 0 })
          .should('have.value', `ALIAS COMPANY ${i + 1}`);
      }
    },
  );
});
