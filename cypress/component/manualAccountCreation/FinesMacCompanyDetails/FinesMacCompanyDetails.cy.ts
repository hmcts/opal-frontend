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
import { MacCompanyDetailsLocators as L } from '../../../shared/selectors/manual-account-creation/mac.company-details.locators';
import { of } from 'rxjs';

describe('FinesMacCompanyDetailsComponent', () => {
  let finesMacState = structuredClone(FINES_COMPANY_DETAILS_MOCK);

  const setupComponent = (formSubmit?: any, defendantTypeMock: string = '') => {
    finesMacState.accountDetails.formData.fm_create_account_defendant_type = defendantTypeMock;
    return mount(FinesMacCompanyDetailsComponent, {
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
            parent: of('manual-account-creation'),
          },
        },
      ],
      componentProperties: {
        // only Inputs here
        defendantType: defendantTypeMock,
      },
    }).then(({ fixture }) => {
      if (!formSubmit) return;
      const comp: any = fixture.componentInstance as any;
      // Prefer subscribing to an EventEmitter-style output if present
      if (comp?.handleCompanyDetailsSubmit?.subscribe) {
        comp.handleCompanyDetailsSubmit.subscribe((...args: any[]) => (formSubmit as any)(...args));
      } else if (typeof comp?.handleCompanyDetailsSubmit === 'function') {
        // Fallback to overriding method after mount
        comp.handleCompanyDetailsSubmit = formSubmit;
      }
      fixture.detectChanges();
    });
  };

  it('should render the component', () => {
    setupComponent(null, 'company');

    // Verify the component is rendered
    cy.get(L.componentRoot).should('exist');
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

      cy.get(L.submitButton).contains('Return to account details').click();
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredName);
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAddressLine1);

      cy.get(L.addContactDetailsButton).click();
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredName);
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAddressLine1);
    },
  );

  it('(AC.1) should be created as per the design artefact', () => {
    setupComponent(null, 'company');

    cy.get(L.pageHeader).should('contain', 'Company details');
    cy.get(L.companyNameLabel).should('contain', 'Company name');
    cy.get(L.addressLegend)
      .should('not.be.empty')
      .invoke('text')
      .then((txt) => expect(txt.trim()).to.contain('Address'));
    cy.get(L.addressLine1Label).should('contain', 'Address line 1');
    cy.get(L.addressLine2Label).should('contain', 'Address line 2');
    cy.get(L.addressLine3Label).should('contain', 'Address line 3');
    cy.get(L.postcodeLabel).should('contain', 'Postcode');
    cy.get(L.addAliasesCheckbox).should('exist');

    cy.get(L.companyNameInput).should('exist');
    cy.get(L.addressLine1Input).should('exist');
    cy.get(L.addressLine2Input).should('exist');
    cy.get(L.addressLine3Input).should('exist');
    cy.get(L.postcodeInput).should('exist');

    cy.get(L.submitButton).should('contain', 'Return to account details');
    cy.get(L.addContactDetailsButton).should('exist');
    cy.get(L.cancelLink).should('exist');
    cy.get(L.cancelLink).should('exist');
  });

  it('(AC.2) should register all fields for aliases correctly', { tags: ['@PO-345', '@PO-365'] }, () => {
    setupComponent(null, 'company');

    cy.get(L.addAliasesCheckbox).check();
    cy.get(L.aliasCompanyName1Label).should('contain', 'Alias 1');
    cy.get(L.aliasCompanyName1Input).prev().should('contain', 'Company name');
    cy.get(L.aliasCompanyName1Input).should('exist');

    cy.get(L.addAliasButton).should('exist');
  });

  it('(AC.3) should allow users to add another aliases', { tags: ['@PO-345', '@PO-365'] }, () => {
    setupComponent(null, 'company');

    cy.get(L.addAliasesCheckbox).check();

    cy.get(L.aliasRemoveLink).should('not.exist');
    cy.get(L.aliasCompanyName2Label).should('not.exist');
    cy.get(L.aliasCompanyName2Input).should('not.exist');

    cy.get(L.addAliasButton).first().click();

    cy.get(L.aliasCompanyName1Label).first().should('have.text', 'Alias 1');
    cy.get(L.aliasCompanyName1Input).should('exist');

    cy.get(L.aliasCompanyName2Label).should('have.text', 'Alias 2');
    cy.get(L.aliasCompanyName2Input).should('exist');

    cy.get(L.aliasRemoveLink).should('exist').and('not.have.attr', 'aria-label');

    cy.get(L.aliasCompanyName3Label).should('not.exist');
    cy.get(L.aliasCompanyName3Input).should('not.exist');
  });

  it('(AC.4) should allow users to add up to 5 aliases', { tags: ['@PO-345', '@PO-365'] }, () => {
    setupComponent(null, 'company');

    cy.get(L.addAliasesCheckbox).check();

    cy.get(L.aliasRemoveLink).should('not.exist');
    cy.get(L.aliasCompanyName1Label).should('have.text', 'Alias 1');
    cy.get(L.aliasCompanyName1Input).should('exist');

    cy.get(L.aliasCompanyName2Label).should('not.exist');
    cy.get(L.aliasCompanyName2Input).should('not.exist');

    cy.get(L.aliasCompanyName3Label).should('not.exist');
    cy.get(L.aliasCompanyName3Input).should('not.exist');

    cy.get(L.aliasCompanyName4Label).should('not.exist');
    cy.get(L.aliasCompanyName4Input).should('not.exist');

    cy.get(L.aliasCompanyName5Label).should('not.exist');
    cy.get(L.aliasCompanyName5Input).should('not.exist');

    //Add Alias 2
    cy.get(L.addAliasButton).first().click();
    cy.get(L.aliasRemoveLink).should('exist').and('not.have.attr', 'aria-label');

    cy.get(L.aliasCompanyName2Label).should('have.text', 'Alias 2');
    cy.get(L.aliasCompanyName2Input).should('exist');

    cy.get(L.aliasCompanyName3Label).should('not.exist');
    cy.get(L.aliasCompanyName3Input).should('not.exist');

    cy.get(L.aliasCompanyName4Label).should('not.exist');
    cy.get(L.aliasCompanyName4Input).should('not.exist');

    cy.get(L.aliasCompanyName5Label).should('not.exist');
    cy.get(L.aliasCompanyName5Input).should('not.exist');

    //Add Alias 3
    cy.get(L.addAliasButton).first().click();
    cy.get(L.aliasRemoveLink).should('exist').and('not.have.attr', 'aria-label');

    cy.get(L.aliasCompanyName3Label).should('have.text', 'Alias 3');
    cy.get(L.aliasCompanyName3Input).should('exist');

    cy.get(L.aliasCompanyName4Label).should('not.exist');
    cy.get(L.aliasCompanyName4Input).should('not.exist');

    cy.get(L.aliasCompanyName5Label).should('not.exist');
    cy.get(L.aliasCompanyName5Input).should('not.exist');

    //Add Alias 4
    cy.get(L.addAliasButton).first().click();
    cy.get(L.aliasRemoveLink).should('exist').and('not.have.attr', 'aria-label');

    cy.get(L.aliasCompanyName4Label).should('have.text', 'Alias 4');
    cy.get(L.aliasCompanyName4Input).should('exist');

    cy.get(L.aliasCompanyName5Label).should('not.exist');
    cy.get(L.aliasCompanyName5Input).should('not.exist');

    //Add Alias 5
    cy.get(L.addAliasButton).first().click();
    cy.get(L.aliasRemoveLink).should('exist').and('not.have.attr', 'aria-label');

    cy.get(L.aliasCompanyName1Label).first().should('have.text', 'Alias 1');
    cy.get(L.aliasCompanyName1Input).should('exist');

    cy.get(L.aliasCompanyName2Label).should('have.text', 'Alias 2');
    cy.get(L.aliasCompanyName2Input).should('exist');

    cy.get(L.aliasCompanyName3Label).should('have.text', 'Alias 3');
    cy.get(L.aliasCompanyName3Input).should('exist');

    cy.get(L.aliasCompanyName4Label).should('have.text', 'Alias 4');
    cy.get(L.aliasCompanyName4Input).should('exist');

    cy.get(L.aliasCompanyName5Label).should('have.text', 'Alias 5');
    cy.get(L.aliasCompanyName5Input).should('exist');

    cy.get(L.addAliasButton).should('not.exist');
  });

  it(
    '(AC.5) should allow users to remove an alias when an additional alias has been added for the first time',
    { tags: ['@PO-345', '@PO-365'] },
    () => {
      setupComponent(null, 'company');

      cy.get(L.addAliasesCheckbox).check();
      cy.get(L.addAliasButton).first().click();
      cy.get(L.aliasRemoveLink).should('exist').and('not.have.attr', 'aria-label');

      cy.get(L.aliasCompanyName1Label).first().should('have.text', 'Alias 1');
      cy.get(L.aliasCompanyName1Input).should('exist');

      cy.get(L.aliasCompanyName2Label).should('have.text', 'Alias 2');
      cy.get(L.aliasCompanyName2Input).should('exist');

      cy.get(L.aliasRemoveLink).click();

      cy.get(L.aliasCompanyName1Label).should('have.text', 'Alias 1');
      cy.get(L.aliasCompanyName1Input).should('exist');

      cy.get(L.aliasCompanyName2Label).should('not.exist');
      cy.get(L.aliasCompanyName2Input).should('not.exist');
    },
  );

  it(
    '(AC.6) should allow users to remove an alias when multiple additional aliases have been added',
    { tags: ['@PO-345', '@PO-365'] },
    () => {
      setupComponent(null, 'company');

      cy.get(L.addAliasesCheckbox).check();
      cy.get(L.addAliasButton).first().click();
      cy.get(L.addAliasButton).first().click();
      cy.get(L.addAliasButton).first().click();
      cy.get(L.addAliasButton).first().click();
      cy.get(L.aliasRemoveLink).should('exist').and('not.have.attr', 'aria-label');

      cy.get(L.aliasCompanyName5Label).should('have.text', 'Alias 5');
      cy.get(L.aliasCompanyName5Input).should('exist');

      cy.get(L.aliasRemoveLink).click();

      cy.get(L.aliasCompanyName1Label).first().should('have.text', 'Alias 1');
      cy.get(L.aliasCompanyName1Input).should('exist');

      cy.get(L.aliasCompanyName2Label).should('have.text', 'Alias 2');
      cy.get(L.aliasCompanyName2Input).should('exist');

      cy.get(L.aliasCompanyName3Label).should('have.text', 'Alias 3');
      cy.get(L.aliasCompanyName3Input).should('exist');

      cy.get(L.aliasCompanyName4Label).should('have.text', 'Alias 4');
      cy.get(L.aliasCompanyName4Input).should('exist');

      cy.get(L.aliasCompanyName5Label).should('not.exist');
      cy.get(L.aliasCompanyName5Input).should('not.exist');

      cy.get(L.aliasRemoveLink).click();

      cy.get(L.aliasCompanyName1Label).first().should('have.text', 'Alias 1');
      cy.get(L.aliasCompanyName1Input).should('exist');

      cy.get(L.aliasCompanyName2Label).should('have.text', 'Alias 2');
      cy.get(L.aliasCompanyName2Input).should('exist');

      cy.get(L.aliasCompanyName3Label).should('have.text', 'Alias 3');
      cy.get(L.aliasCompanyName3Input).should('exist');

      cy.get(L.aliasCompanyName4Label).should('not.exist');
      cy.get(L.aliasCompanyName4Input).should('not.exist');

      cy.get(L.aliasRemoveLink).click();

      cy.get(L.aliasCompanyName1Label).first().should('have.text', 'Alias 1');
      cy.get(L.aliasCompanyName1Input).should('exist');

      cy.get(L.aliasCompanyName2Label).should('have.text', 'Alias 2');
      cy.get(L.aliasCompanyName2Input).should('exist');

      cy.get(L.aliasCompanyName3Label).should('not.exist');
      cy.get(L.aliasCompanyName3Input).should('not.exist');

      cy.get(L.aliasRemoveLink).click();

      cy.get(L.aliasCompanyName1Label).should('have.text', 'Alias 1');
      cy.get(L.aliasCompanyName1Input).should('exist');

      cy.get(L.aliasCompanyName2Label).should('not.exist');
      cy.get(L.aliasCompanyName2Input).should('not.exist');
    },
  );

  it('(AC.7) should not retain alias information when checkbox is unticked', { tags: ['@PO-345', '@PO-365'] }, () => {
    setupComponent(null, 'company');

    cy.get(L.addAliasesCheckbox).check();
    cy.get(L.addAliasButton).first().click();

    finesMacState.companyDetails.formData.fm_company_details_aliases.push({
      fm_company_details_alias_company_name_0: 'Alias 1',
    });
    finesMacState.companyDetails.formData.fm_company_details_aliases.push({
      fm_company_details_alias_company_name_1: 'Alias 2',
    });

    cy.get(L.addAliasesCheckbox).uncheck();
    cy.get(L.aliasCompanyName1Input).should('not.exist');
    cy.get(L.aliasCompanyName2Input).should('not.exist');

    cy.get(L.addAliasesCheckbox).check();
    cy.get(L.aliasCompanyName1Input).should('have.value', '');
    cy.get(L.aliasCompanyName2Input).should('not.exist');
  });

  it('(AC.12) should allow form to be submitted with valid data', { tags: ['@PO-345', '@PO-365'] }, () => {
    const formSubmitSpy = Cypress.sinon.spy();
    setupComponent(formSubmitSpy);

    finesMacState.companyDetails.formData.fm_company_details_company_name = 'Company Name';
    finesMacState.companyDetails.formData.fm_company_details_address_line_1 = '123 Fake Street';
    finesMacState.companyDetails.formData.fm_company_details_postcode = 'AB12 3CD';

    cy.get(L.submitButton).first().click();

    cy.wrap(formSubmitSpy).should('have.been.called');
  });

  it(
    '(AC.9) should errors when form is submitted with empty aliases fields - Return to account details + Add contact details',
    { tags: ['@PO-345', '@PO-365'] },
    () => {
      setupComponent(null, 'company');

      cy.get(L.addAliasesCheckbox).check();

      cy.get(L.submitButton).contains('Return to account details').click();
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias1);

      cy.get(L.addContactDetailsButton).click();
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias1);
    },
  );

  it(
    '(AC.10) should error when submitted with many empty aliases fields - Return to account details + Add contact details',
    { tags: ['@PO-345', '@PO-365'] },
    () => {
      setupComponent(null, 'company');

      cy.get(L.addAliasesCheckbox).check();

      cy.get(L.addAliasButton).first().click();
      cy.get(L.addAliasButton).first().click();
      cy.get(L.addAliasButton).first().click();
      cy.get(L.addAliasButton).first().click();

      cy.get(L.submitButton).contains('Return to account details').click();
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias1);
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias2);
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias3);
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias4);
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias5);

      cy.get(L.aliasCompanyName3Input).type('Alias 3', { delay: 0 });

      cy.get(L.submitButton).contains('Return to account details').click();
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias1);
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias2);
      cy.get(L.errorSummary).should('not.contain', REQUIRED_VALIDATION.requiredAlias3);
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias4);
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias5);

      cy.get(L.addContactDetailsButton).click();
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias1);
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias2);
      cy.get(L.errorSummary).should('not.contain', REQUIRED_VALIDATION.requiredAlias3);
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias4);
      cy.get(L.errorSummary).should('contain', REQUIRED_VALIDATION.requiredAlias5);
    },
  );

  it(
    '(AC.1) should show maxlength errors when form fields exceed character limits',
    { tags: ['@PO-345', '@PO-365'] },
    () => {
      setupComponent(null, 'company');

      cy.get(L.addAliasesCheckbox).check();

      for (let i = 0; i < 4; i++) {
        cy.get(L.addAliasButton).first().click();
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
      cy.get(L.submitButton).first().click();

      for (const [, value] of Object.entries(MAX_LENGTH_VALIDATION)) {
        cy.get(L.errorSummary).should('contain', value);
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

      cy.get(L.submitButton).first().click();

      for (const [, value] of Object.entries(SPECIAL_CHARACTERS_PATTERN_VALIDATION)) {
        cy.get(L.errorSummary).should('contain', value);
      }
    },
  );

  it(
    '(AC.1) should validate type check to ensure name fields are only alphabetical letters A-Z',
    { tags: ['@PO-345', '@PO-365'] },
    () => {
      setupComponent(null, 'company');

      cy.get(L.addAliasesCheckbox).check();

      for (let i = 0; i < 4; i++) {
        cy.get(L.addAliasButton).first().click();
      }

      finesMacState.companyDetails.formData.fm_company_details_company_name = '123% Fake Street';
      for (let i = 0; i < 5; i++) {
        finesMacState.companyDetails.formData.fm_company_details_aliases.push({
          [`fm_company_details_alias_company_name_${i}`]: '123% Fake Street',
        });
      }

      cy.get(L.submitButton).first().click();

      for (const [, value] of Object.entries(ALPHABETICAL_TEXT_PATTERN_VALIDATION)) {
        cy.get(L.errorSummary).should('contain', value);
      }
    },
  );
  it(
    '(AC.11) should allow form to be submitted when validation errors are corrected - Return to account details + Add contact details',
    { tags: ['@PO-345', '@PO-365'] },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();
      setupComponent(formSubmitSpy, 'company');

      cy.get(L.submitButton).contains('Return to account details').click();
      cy.get(L.errorSummary).should('exist');
      cy.wrap(formSubmitSpy).should('not.have.been.called');
      cy.then(() => {
        setupComponent(formSubmitSpy, 'company');
        finesMacState.companyDetails.formData.fm_company_details_company_name = 'CNAME';
        finesMacState.companyDetails.formData.fm_company_details_address_line_1 = 'addr1';

        cy.get(L.submitButton).contains('Return to account details').click();
        cy.get(L.errorSummary).should('not.exist');
        cy.wrap(formSubmitSpy).should('have.been.called');

        cy.get(L.addContactDetailsButton).click();
        cy.get(L.errorSummary).should('not.exist');
        cy.wrap(formSubmitSpy).should('have.been.called');
      });
    },
  );

  it(
    '(AC.12) should allow form to be submitted with valid data with aliases - Return to account details + Add contact details',
    { tags: ['@PO-345', '@PO-365'] },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();
      setupComponent(formSubmitSpy, 'company');

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

      cy.get(L.submitButton).contains('Return to account details').click();
      cy.get(L.errorSummary).should('not.exist');

      cy.wrap(formSubmitSpy).should('have.been.called');

      cy.get(L.addContactDetailsButton).click();
      cy.get(L.errorSummary).should('not.exist');

      cy.wrap(formSubmitSpy).should('have.been.called');
    },
  );
  it(
    '(AC.1) should convert specified company details fields to uppercase on user input',
    { tags: ['@PO-345', '@PO-1450'] },
    () => {
      setupComponent(null, 'company');

      cy.get(L.companyNameInput).type('example company', { delay: 0 }).should('have.value', 'EXAMPLE COMPANY');
      cy.get(L.postcodeInput).type('ab12 3cd', { delay: 0 }).should('have.value', 'AB12 3CD');

      cy.get(L.addAliasesCheckbox).check();
      cy.get(L.aliasCompanyName1Input).type('alias company', { delay: 0 }).should('have.value', 'ALIAS COMPANY');

      // Add the remaining four aliases using a loop
      for (let i = 1; i < 5; i++) {
        cy.get(L.addAliasButton).click();
        cy.get(L.aliasInput(i))
          .type(`alias company ${i + 1}`, { delay: 0 })
          .should('have.value', `ALIAS COMPANY ${i + 1}`);
      }
    },
  );
});
