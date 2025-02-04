import { mount } from 'cypress/angular';
import { FinesMacOffenceDetailsMinorCreditorComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-minor-creditor/fines-mac-offence-details-minor-creditor.component';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MINOR_CREDITOR_MOCK } from './mocks/minor_creditor_fines_service_mock';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FinesMacOffenceDetailsService } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { provideHttpClient } from '@angular/common/http';
import { DateService } from '@services/date-service/date.service';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-minor-creditor/mocks/fines-mac-offence-details-minor-creditor-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/mocks/fines-mac-offence-details-draft-state.mock';
import { DOM_ELEMENTS } from './constants/minor_creditor_elements';
import { REQUIRED_FIELDS, FORMAT_CHECK, LENGTH_CHECK } from './constants/minor_creditor_errors';

describe('FinesMacMinorCreditor', () => {
  let mockFinesService = new FinesService(new DateService());
  mockFinesService.finesMacState = { ...FINES_MINOR_CREDITOR_MOCK };

  const mockOffenceDetailsService = {
    finesMacOffenceDetailsDraftState: FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
  } as FinesMacOffenceDetailsService;

  let currentoffenceDetails = 0;

  const formData = (mockOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[
    currentoffenceDetails
  ].childFormData = [
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
  ]);

  afterEach(() => {
    cy.then(() => {
      formData[0].formData = {
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
      };
    });
  });

  const setupComponent = (formSubmit: any, defendantType: string = '') => {
    return mount(FinesMacOffenceDetailsMinorCreditorComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        { provide: FinesMacOffenceDetailsService, useValue: mockOffenceDetailsService },
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
        handleMinorCreditorFormSubmit: formSubmit,
      },
    });
  };

  it('should render the form', () => {
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

    cy.get(DOM_ELEMENTS.form).should('exist');
  });

  it('should render all elements on the page corectly', () => {
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
    cy.get(DOM_ELEMENTS.payByBacsCheckbox).click();
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
  });

  it('should display length validation errors with individual type', () => {
    setupComponent(null).then(({ fixture }) => {
      cy.then(() => {
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
      });

      cy.wrap(fixture).invoke('detectChanges');

      cy.get(DOM_ELEMENTS.submitButton).click();

      for (const [, value] of Object.entries(LENGTH_CHECK)) {
        if (value != 'The company name must be 50 characters or fewer') {
          cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
        }
      }
    });
  });

  it('should display format validation errors', () => {
    setupComponent(null);
    formData[0].formData.fm_offence_details_minor_creditor_creditor_type = 'individual';
    formData[0].formData.fm_offence_details_minor_creditor_bank_account_name = '123';
    formData[0].formData.fm_offence_details_minor_creditor_bank_account_number = 'abc';
    formData[0].formData.fm_offence_details_minor_creditor_bank_sort_code = 'abc';
    formData[0].formData.fm_offence_details_minor_creditor_bank_account_ref = '123';
    formData[0].formData.fm_offence_details_minor_creditor_address_line_3 = '!@#';
    formData[0].formData.fm_offence_details_minor_creditor_address_line_2 = '!@#';
    formData[0].formData.fm_offence_details_minor_creditor_address_line_1 = '!@#';
    formData[0].formData.fm_offence_details_minor_creditor_company_name = '123';
    formData[0].formData.fm_offence_details_minor_creditor_surname = '123';
    formData[0].formData.fm_offence_details_minor_creditor_forenames = '123';
    cy.get(DOM_ELEMENTS.submitButton).click();

    for (const [, value] of Object.entries(FORMAT_CHECK)) {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
    }
  });

  it('should display required field validation errors', () => {
    setupComponent(null);
    cy.get(DOM_ELEMENTS.submitButton).click();
    for (const [, value] of Object.entries(REQUIRED_FIELDS)) {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
    }
  });
});
