import { mount } from 'cypress/angular';
import { FinesMacOffenceDetailsMinorCreditorComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-minor-creditor/fines-mac-offence-details-minor-creditor.component';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MINOR_CREDITOR_MOCK } from './mocks/minor_creditor_fines_service_mock';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FinesMacOffenceDetailsStore } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/stores/fines-mac-offence-details.store';
import { provideHttpClient } from '@angular/common/http';
import { DateService } from '@services/date-service/date.service';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-minor-creditor/mocks/fines-mac-offence-details-minor-creditor-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/mocks/fines-mac-offence-details-draft-state.mock';
import { DOM_ELEMENTS } from './constants/minor_creditor_elements';
import { REQUIRED_FIELDS, FORMAT_CHECK, LENGTH_CHECK } from './constants/minor_creditor_errors';

describe('FinesMacMinorCreditor', () => {
  let formData: any;
  let currentoffenceDetails = 0;
  let finesMacState = structuredClone(FINES_MINOR_CREDITOR_MOCK);
  let finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK;
  beforeEach(() => {
    const childForms = [
      {
        ...FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK,
        formData: {
          fm_offence_details_imposition_position: 0,
          fm_offence_details_minor_creditor_creditor_type: '',
          fm_offence_details_minor_creditor_title: '',
          fm_offence_details_minor_creditor_forenames: '',
          fm_offence_details_minor_creditor_surname: '',
          fm_offence_details_minor_creditor_company_name: '',
          fm_offence_details_minor_creditor_address_line_1: '',
          fm_offence_details_minor_creditor_address_line_2: '',
          fm_offence_details_minor_creditor_address_line_3: '',
          fm_offence_details_minor_creditor_post_code: '',
          fm_offence_details_minor_creditor_pay_by_bacs: true,
          fm_offence_details_minor_creditor_bank_account_name: '',
          fm_offence_details_minor_creditor_bank_sort_code: '',
          fm_offence_details_minor_creditor_bank_account_number: '',
          fm_offence_details_minor_creditor_bank_account_ref: '',
        },
      },
    ];

    finesMacOffenceDetailsDraftState.offenceDetailsDraft[currentoffenceDetails].childFormData = childForms;

    formData = childForms;
  });

  const setupComponent = (formSubmit: any, defendantType: string = '') => {
    mount(FinesMacOffenceDetailsMinorCreditorComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        DateService,
        {
          provide: FinesMacStore,
          useFactory: () => {
            const store = new FinesMacStore();
            store.setFinesMacStore(finesMacState);
            return store;
          },
        },
        {
          provide: FinesMacOffenceDetailsStore,
          useFactory: () => {
            const store = new FinesMacOffenceDetailsStore();
            store.setOffenceDetailsDraft(finesMacOffenceDetailsDraftState.offenceDetailsDraft);
            store.setRemoveMinorCreditor(0);
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
        handleMinorCreditorFormSubmit: formSubmit,
      },
    });
  };

  it('(AC.1 , AC.2) should render the form', { tags: ['@PO-412', '@PO-668', '@PO-669', '@PO-545'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.form).should('exist');
  });

  it(
    '(AC.2, AC.2a, AC.3, AC.4, AC.6) should render all elements on the page corectly',
    { tags: ['@PO-412', '@PO-668', '@PO-669', '@PO-545'] },
    () => {
      setupComponent(null);

      cy.get(DOM_ELEMENTS.pageHeading).should('contain.text', 'Minor creditor details');
      cy.get(DOM_ELEMENTS.legendS).should('contain.text', 'Select creditor type');
      cy.get(DOM_ELEMENTS.legendM).should('contain.text', 'Address');
      cy.get(DOM_ELEMENTS.legendM).should('contain.text', 'Payment details');

      cy.get(DOM_ELEMENTS.creditorTypeIndividual).should('exist');
      cy.get(DOM_ELEMENTS.creditorTypeCompany).should('exist');
      cy.get(DOM_ELEMENTS.creditorTypeIndividual).click();
      cy.get(DOM_ELEMENTS.titleSelect).should('exist');
      cy.get(DOM_ELEMENTS.forenamesInput).should('exist');
      cy.get(DOM_ELEMENTS.surnameInput).should('exist');
      cy.get(DOM_ELEMENTS.creditorTypeCompany).click();
      cy.get(DOM_ELEMENTS.companyNameInput).should('exist');
      cy.get(DOM_ELEMENTS.addressLine1Input).should('exist');
      cy.get(DOM_ELEMENTS.addressLine2Input).should('exist');
      cy.get(DOM_ELEMENTS.addressLine3Input).should('exist');
      cy.get(DOM_ELEMENTS.postCodeInput).should('exist');
      cy.get(DOM_ELEMENTS.payByBacsCheckbox).should('exist');
      cy.get(DOM_ELEMENTS.bankAccountNameInput).should('exist');
      cy.get(DOM_ELEMENTS.bankSortCodeInput).should('exist');
      cy.get(DOM_ELEMENTS.bankAccountNumberInput).should('exist');
      cy.get(DOM_ELEMENTS.bankPaymentRefInput).should('exist');

      cy.get(DOM_ELEMENTS.creditorTypeIndividual).click();
      cy.get(DOM_ELEMENTS.titleLabel).should('contain', 'Title');
      cy.get(DOM_ELEMENTS.forenamesLabel).should('contain', 'First names');
      cy.get(DOM_ELEMENTS.surnameLabel).should('contain', 'Last name');
      cy.get(DOM_ELEMENTS.creditorTypeCompany).click();
      cy.get(DOM_ELEMENTS.companyNameLabel).should('contain', 'Company');
      cy.get(DOM_ELEMENTS.addressLine1Label).should('contain', 'Address line 1');
      cy.get(DOM_ELEMENTS.addressLine2Label).should('contain', 'Address line 2');
      cy.get(DOM_ELEMENTS.addressLine3Label).should('contain', 'Address line 3');
      cy.get(DOM_ELEMENTS.postCodeLabel).should('contain', 'Postcode');
      cy.get(DOM_ELEMENTS.payByBacsLabel).should('contain', 'I have BACS payment details');
      cy.get(DOM_ELEMENTS.bankAccountNameLabel).should('contain', 'Name on the account');
      cy.get(DOM_ELEMENTS.bankSortCodeLabel).should('contain', 'Sort code');
      cy.get(DOM_ELEMENTS.bankAccountNumberLabel).should('contain', 'Account number');
      cy.get(DOM_ELEMENTS.bankPaymentRefLabel).should('contain', 'Payment reference');

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.cancelLink).should('exist');
    },
  );

  it(
    '(AC.2) should display length validation errors with individual type',
    { tags: ['@PO-412', '@PO-668', '@PO-669', '@PO-545'] },
    () => {
      setupComponent(null);
      formData[0].formData.fm_offence_details_minor_creditor_creditor_type = 'individual';
      formData[0].formData.fm_offence_details_minor_creditor_pay_by_bacs = true;
      formData[0].formData.fm_offence_details_minor_creditor_title = 'Mr';
      formData[0].formData.fm_offence_details_minor_creditor_forenames = 'a'.repeat(21);
      formData[0].formData.fm_offence_details_minor_creditor_surname = 'a'.repeat(31);
      formData[0].formData.fm_offence_details_minor_creditor_address_line_1 = 'a'.repeat(31);
      formData[0].formData.fm_offence_details_minor_creditor_address_line_2 = 'a'.repeat(31);
      formData[0].formData.fm_offence_details_minor_creditor_address_line_3 = 'a'.repeat(17);
      formData[0].formData.fm_offence_details_minor_creditor_post_code = 'a'.repeat(9);
      formData[0].formData.fm_offence_details_minor_creditor_bank_account_name = 'a'.repeat(19);
      formData[0].formData.fm_offence_details_minor_creditor_bank_sort_code = 'a'.repeat(7);
      formData[0].formData.fm_offence_details_minor_creditor_bank_account_number = 'a'.repeat(9);
      formData[0].formData.fm_offence_details_minor_creditor_bank_account_ref = 'a'.repeat(19);

      console.log(formData[0].formData);

      cy.get(DOM_ELEMENTS.submitButton).click();

      for (const [, value] of Object.entries(LENGTH_CHECK)) {
        if (value != 'The company name must be 50 characters or fewer') {
          cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
        }
      }
    },
  );

  it('(AC.2) should display format validation errors', { tags: ['@PO-412', '@PO-668', '@PO-669', '@PO-545'] }, () => {
    setupComponent(null);

    formData[0].formData.fm_offence_details_minor_creditor_creditor_type = 'individual';
    formData[0].formData.fm_offence_details_minor_creditor_bank_account_name = '!@#';
    formData[0].formData.fm_offence_details_minor_creditor_bank_account_number = 'abc';
    formData[0].formData.fm_offence_details_minor_creditor_bank_sort_code = 'abc';
    formData[0].formData.fm_offence_details_minor_creditor_bank_account_ref = '!@#';
    formData[0].formData.fm_offence_details_minor_creditor_address_line_3 = '!@#*';
    formData[0].formData.fm_offence_details_minor_creditor_address_line_2 = '!@#*';
    formData[0].formData.fm_offence_details_minor_creditor_address_line_1 = '!@#*';
    formData[0].formData.fm_offence_details_minor_creditor_company_name = '123$£!*';
    formData[0].formData.fm_offence_details_minor_creditor_surname = '123$£!*';
    formData[0].formData.fm_offence_details_minor_creditor_forenames = '123$£!*';

    cy.get(DOM_ELEMENTS.submitButton).click();

    for (const [, value] of Object.entries(FORMAT_CHECK)) {
      if (
        value != 'The company name must only contain alphabetical text' &&
        value != "Enter minor creditor's last name"
      ) {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
      }
    }
  });

  it(
    '( AC.9, AC.7 ) should display required field validation errors',
    { tags: ['@PO-412', '@PO-668', '@PO-669', '@PO-545'] },
    () => {
      setupComponent(null);
      cy.get(DOM_ELEMENTS.submitButton).click();
      for (const [, value] of Object.entries(REQUIRED_FIELDS)) {
        if (value != 'Enter company name' && value != "Enter minor creditor's last name") {
          cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
        }
      }
    },
  );

  it(
    '(AC.2) should have Length check in place for company creditor types',
    { tags: ['@PO-412', '@PO-668', '@PO-669', '@PO-545'] },
    () => {
      setupComponent(null);

      formData[0].formData.fm_offence_details_minor_creditor_creditor_type = 'company';
      formData[0].formData.fm_offence_details_minor_creditor_company_name = 'a'.repeat(51);

      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', LENGTH_CHECK.companyNameMaxLength);
    },
  );

  it(
    '(AC.2) should have Format check in place for company creditor types',
    { tags: ['@PO-412', '@PO-668', '@PO-669', '@PO-545'] },
    () => {
      setupComponent(null);

      formData[0].formData.fm_offence_details_minor_creditor_creditor_type = 'company';
      formData[0].formData.fm_offence_details_minor_creditor_company_name = '123@*';
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK.companyNameAlphabeticalTextPattern);
    },
  );

  it(
    '(AC.4ai , AC.8bii) should have Required check in place for company creditor types',
    { tags: ['@PO-412', '@PO-668', '@PO-669', '@PO-545'] },
    () => {
      setupComponent(null);

      formData[0].formData.fm_offence_details_minor_creditor_creditor_type = 'company';
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_FIELDS.companyNameRequired);
    },
  );

  it(
    '(AC.3)should have format check in place for individual creditor types',
    { tags: ['@PO-412', '@PO-668', '@PO-669', '@PO-545'] },
    () => {
      setupComponent(null);

      formData[0].formData.fm_offence_details_minor_creditor_creditor_type = 'individual';
      formData[0].formData.fm_offence_details_minor_creditor_title = 'Mr';
      formData[0].formData.fm_offence_details_minor_creditor_forenames = '123@*';
      formData[0].formData.fm_offence_details_minor_creditor_surname = '123@*';
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK.forenamesAlphabeticalTextPattern);
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_CHECK.surnameAlphabeticalTextPattern);
    },
  );

  it(
    ' (AC.8bi) Should check for required fields for individual creditor types',
    { tags: ['@PO-412', '@PO-668', '@PO-669', '@PO-545'] },
    () => {
      setupComponent(null);

      formData[0].formData.fm_offence_details_minor_creditor_creditor_type = 'individual';
      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', REQUIRED_FIELDS.individualLastNameRequired);
    },
  );

  it(
    '(AC.10) Should check when user reclicks on BACS payment details it clears the fields',
    { tags: ['@PO-412', '@PO-668', '@PO-669', '@PO-545'] },
    () => {
      setupComponent(null);

      formData[0].formData.fm_offence_details_minor_creditor_pay_by_bacs = true;
      formData[0].formData.fm_offence_details_minor_creditor_bank_account_name = 'John Doe';
      formData[0].formData.fm_offence_details_minor_creditor_bank_sort_code = '123456';
      formData[0].formData.fm_offence_details_minor_creditor_bank_account_number = '12345678';
      formData[0].formData.fm_offence_details_minor_creditor_bank_account_ref = 'Testing';

      cy.get(DOM_ELEMENTS.bankAccountNameInput).should('have.value', 'John Doe');
      cy.get(DOM_ELEMENTS.bankSortCodeInput).should('have.value', '123456');
      cy.get(DOM_ELEMENTS.bankAccountNumberInput).should('have.value', '12345678');
      cy.get(DOM_ELEMENTS.bankPaymentRefInput).should('have.value', 'Testing');

      cy.get(DOM_ELEMENTS.payByBacsCheckbox).click().click();

      cy.get(DOM_ELEMENTS.bankAccountNameInput).should('have.value', '');
      cy.get(DOM_ELEMENTS.bankSortCodeInput).should('have.value', '');
      cy.get(DOM_ELEMENTS.bankAccountNumberInput).should('have.value', '');
      cy.get(DOM_ELEMENTS.bankPaymentRefInput).should('have.value', '');
    },
  );

  it(
    ' (AC.11) should allow form submission with valid data for individual creditor',
    { tags: ['@PO-412', '@PO-668', '@PO-669', '@PO-545'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');
      setupComponent(mockFormSubmit);

      formData[0].formData.fm_offence_details_minor_creditor_creditor_type = 'individual';
      formData[0].formData.fm_offence_details_minor_creditor_title = 'Mr';
      formData[0].formData.fm_offence_details_minor_creditor_forenames = 'John';
      formData[0].formData.fm_offence_details_minor_creditor_surname = 'Doe';
      formData[0].formData.fm_offence_details_minor_creditor_address_line_1 = '1 Testing Lane';
      formData[0].formData.fm_offence_details_minor_creditor_address_line_2 = 'Test Town';
      formData[0].formData.fm_offence_details_minor_creditor_address_line_3 = 'Testing';
      formData[0].formData.fm_offence_details_minor_creditor_post_code = 'TE12 3ST';
      formData[0].formData.fm_offence_details_minor_creditor_pay_by_bacs = true;
      formData[0].formData.fm_offence_details_minor_creditor_bank_account_name = 'John Doe';
      formData[0].formData.fm_offence_details_minor_creditor_bank_sort_code = '123456';
      formData[0].formData.fm_offence_details_minor_creditor_bank_account_number = '12345678';
      formData[0].formData.fm_offence_details_minor_creditor_bank_account_ref = 'Testing';

      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get('@formSubmitSpy').should('have.been.calledOnce');
    },
  );

  it(
    '(AC.11) should allow form submission with valid data for company creditor',
    { tags: ['@PO-412', '@PO-668', '@PO-669', '@PO-545'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');
      setupComponent(mockFormSubmit);

      formData[0].formData.fm_offence_details_minor_creditor_creditor_type = 'company';
      formData[0].formData.fm_offence_details_minor_creditor_company_name = 'Test Company';
      formData[0].formData.fm_offence_details_minor_creditor_address_line_1 = '1 Testing Lane';
      formData[0].formData.fm_offence_details_minor_creditor_address_line_2 = 'Test Town';
      formData[0].formData.fm_offence_details_minor_creditor_address_line_3 = 'Testing';
      formData[0].formData.fm_offence_details_minor_creditor_post_code = 'TE12 3ST';
      formData[0].formData.fm_offence_details_minor_creditor_pay_by_bacs = true;
      formData[0].formData.fm_offence_details_minor_creditor_bank_account_name = 'Test Company';
      formData[0].formData.fm_offence_details_minor_creditor_bank_sort_code = '123456';
      formData[0].formData.fm_offence_details_minor_creditor_bank_account_number = '12345678';
      formData[0].formData.fm_offence_details_minor_creditor_bank_account_ref = 'Testing';

      cy.get(DOM_ELEMENTS.submitButton).click();
      cy.get('@formSubmitSpy').should('have.been.calledOnce');
    },
  );
});

//E-2-E Tests Required : Test Flow to Minor Creditor Screen through add offence page link (AC.1). Check Remove button works and Change button works (AC.11), Check Cancel button flow works (No AC) , Check Save button flow and it saves on add offence screen (AC.11) and check panel appears.
