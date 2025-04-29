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
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_EMPLOYER_DETAILS_MOCK } from './mocks/fines-employer-details-mock';

describe('FinesMacEmployerDetailsComponent', () => {
  let finesMacState = structuredClone(FINES_EMPLOYER_DETAILS_MOCK);

  const setupComponent = (formSubmit: any, defendantTypeMock: string = '') => {
    mount(FinesMacEmployerDetailsComponent, {
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
        handleEmployerDetailsSubmit: formSubmit,
        defendantType: defendantTypeMock,
      },
    });
  };

  afterEach(() => {
    cy.then(() => {
      finesMacState.employerDetails.formData = {
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

  it('should render the component for AY', { tags: ['@PO-272', '@PO-280'] }, () => {
    setupComponent(null, 'adultOrYouthOnly');

    // Verify the component is rendered
    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it('should not show the error summary on initial load for AY', { tags: ['@PO-272', '@PO-280'] }, () => {
    setupComponent(null, 'adultOrYouthOnly');

    // Verify the error summary is not visible
    cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');
  });

  it('(AC.1) should be created as per the design artefact', { tags: ['@PO-272', '@PO-280'] }, () => {
    setupComponent(null, 'adultOrYouthOnly');

    cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Employer details');
    cy.get(DOM_ELEMENTS.companyNameLabel).should('contain', 'Employer name');
    cy.get(DOM_ELEMENTS.referenceLabel).should('contain', 'Employee reference');
    cy.get(DOM_ELEMENTS.emailAddressLabel).should('contain', 'Employer email address');
    cy.get(DOM_ELEMENTS.telephoneNumberLabel).should('contain', 'Employer telephone');
    cy.get(DOM_ELEMENTS.addressLine1Label).should('contain', 'Address line 1');
    cy.get(DOM_ELEMENTS.addressLine2Label).should('contain', 'Address line 2');
    cy.get(DOM_ELEMENTS.addressLine3Label).should('contain', 'Address line 3');
    cy.get(DOM_ELEMENTS.addressLine4Label).should('contain', 'Address line 4');
    cy.get(DOM_ELEMENTS.addressLine5Label).should('contain', 'Address line 5');
    cy.get(DOM_ELEMENTS.postCodeLabel).should('contain', 'Postcode');

    cy.get(DOM_ELEMENTS.referenceHint).should(
      'contain',
      'If employee reference not known, add National Insurance number',
    );

    cy.get(DOM_ELEMENTS.companyNameInput).should('exist');
    cy.get(DOM_ELEMENTS.referenceInput).should('exist');
    cy.get(DOM_ELEMENTS.emailAddressInput).should('exist');
    cy.get(DOM_ELEMENTS.telephoneNumberInput).should('exist');
    cy.get(DOM_ELEMENTS.addressLine1Input).should('exist');
    cy.get(DOM_ELEMENTS.addressLine2Input).should('exist');
    cy.get(DOM_ELEMENTS.addressLine3Input).should('exist');
    cy.get(DOM_ELEMENTS.addressLine4Input).should('exist');
    cy.get(DOM_ELEMENTS.addressLine5Input).should('exist');
    cy.get(DOM_ELEMENTS.postCodeInput).should('exist');
  });
  it(
    '(AC.1) should display error messages for incorrect format and character limit',
    { tags: ['@PO-272', '@PO-280'] },
    () => {
      setupComponent(null, 'adultOrYouthOnly');

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

      finesMacState.employerDetails.formData = incorrectData;

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      for (const [, value] of Object.entries(LENGTH_VALIDATION)) {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
      }
    },
  );

  it(
    '(AC.1) should display error messages for incorrect format and special characters',
    { tags: ['@PO-272', '@PO-280'] },
    () => {
      setupComponent(null, 'adultOrYouthOnly');

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

      finesMacState.employerDetails.formData = incorrectData;

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      for (const [, value] of Object.entries(FORMAT_VALIDATION)) {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
      }
    },
  );

  it('(AC.1) should allow spaces in the telephone number fields', { tags: ['@PO-272', '@PO-280'] }, () => {
    setupComponent(null, 'adultOrYouthOnly');
    finesMacState.employerDetails.formData.fm_employer_details_employer_telephone_number = '0123 456 7890';

    cy.get(DOM_ELEMENTS.telephoneNumberInput).should('have.value', '0123 456 7890');
    cy.get(DOM_ELEMENTS.submitButton).contains('Return to account details').click();

    cy.get(DOM_ELEMENTS.errorSummary).should('not.contain', FORMAT_VALIDATION.employer_phone_pattern);
  });

  it('(AC.1) should not allow asterisks in the address line fields', { tags: ['@PO-272', '@PO-280'] }, () => {
    setupComponent(null, 'adultOrYouthOnly');
    finesMacState.employerDetails.formData.fm_employer_details_employer_address_line_1 = 'addr1*';
    finesMacState.employerDetails.formData.fm_employer_details_employer_address_line_2 = 'addr2*';
    finesMacState.employerDetails.formData.fm_employer_details_employer_address_line_3 = 'addr3*';
    finesMacState.employerDetails.formData.fm_employer_details_employer_address_line_4 = 'addr4*';
    finesMacState.employerDetails.formData.fm_employer_details_employer_address_line_5 = 'addr5*';
    cy.get(DOM_ELEMENTS.addressLine1Input).should('have.value', 'addr1*');
    cy.get(DOM_ELEMENTS.submitButton).contains('Return to account details').click();

    cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_VALIDATION.employer_address1_special_chars);
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_VALIDATION.employer_address2_special_chars);
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_VALIDATION.employer_address3_special_chars);
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_VALIDATION.employer_address4_special_chars);
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_VALIDATION.employer_address5_special_chars);
  });
  it('(AC.2) should error when mandatory fields contain no values', { tags: ['@PO-272', '@PO-280'] }, () => {
    setupComponent(null, 'adultOrYouthOnly');

    cy.get(DOM_ELEMENTS.submitButton).contains('Return to account details').click();

    Object.values(REQUIRED_FIELDS_VALIDATION).forEach((value) => {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
    });
    cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Employer details');
  });
  it(
    '(AC.3) should error when mandatory fields are empty and optional fields are not',
    { tags: ['@PO-272', '@PO-280'] },
    () => {
      setupComponent(null, 'adultOrYouthOnly');
      finesMacState.employerDetails.formData.fm_employer_details_employer_email_address = 'test@test.com';
      finesMacState.employerDetails.formData.fm_employer_details_employer_telephone_number = '01234567890';
      finesMacState.employerDetails.formData.fm_employer_details_employer_address_line_2 = 'Address Line 2';
      finesMacState.employerDetails.formData.fm_employer_details_employer_address_line_3 = 'Address Line 3';
      finesMacState.employerDetails.formData.fm_employer_details_employer_address_line_4 = 'Address Line 4';
      finesMacState.employerDetails.formData.fm_employer_details_employer_address_line_5 = 'Address Line 5';
      finesMacState.employerDetails.formData.fm_employer_details_employer_post_code = '12345';

      cy.get(DOM_ELEMENTS.submitButton).contains('Return to account details').click();

      Object.values(REQUIRED_FIELDS_VALIDATION).forEach((value) => {
        cy.get(DOM_ELEMENTS.errorSummary).should('contain', value);
      });
      cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Employer details');
    },
  );
  it('(AC.4) should error when email address fails validation', { tags: ['@PO-272', '@PO-280'] }, () => {
    const incorrectEmails: string[] = ['test-test-com', 'test@test', 'test.com', 'test@.com', 'test@com'];
    cy.wrap(incorrectEmails).each((email: string) => {
      cy.then(() => {
        finesMacState.employerDetails.formData.fm_employer_details_employer_email_address = email;
        setupComponent(null, 'adultOrYouthOnly');
      });
      cy.get(DOM_ELEMENTS.submitButton).contains('Return to account details').click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_VALIDATION.employer_email_pattern);
    });
  });

  it('(AC.5) should error when employee telephone number fails validation', { tags: ['@PO-272', '@PO-280'] }, () => {
    const incorrectTelephoneNumbers: string[] = ['notNums', '0123456789', '012345678911'];
    cy.wrap(incorrectTelephoneNumbers).each((telephone: string) => {
      cy.then(() => {
        finesMacState.employerDetails.formData.fm_employer_details_employer_telephone_number = telephone;
        setupComponent(null, 'adultOrYouthOnly');
      });
      cy.get(DOM_ELEMENTS.submitButton).contains('Return to account details').click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', FORMAT_VALIDATION.employer_phone_pattern);
    });
  });

  it('(AC.6) should allow for form submission with corrected data', { tags: ['@PO-272', '@PO-280'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit, 'adultOrYouthOnly');
    finesMacState.employerDetails.formData = {
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
    cy.get(DOM_ELEMENTS.submitButton).contains('Return to account details').click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');

    cy.then(() => {
      setupComponent(mockFormSubmit, 'adultOrYouthOnly');
      finesMacState.employerDetails.formData = {
        fm_employer_details_employer_company_name: 'Test Employer',
        fm_employer_details_employer_reference: '1234567890',
        fm_employer_details_employer_email_address: 'test@test.com',
        fm_employer_details_employer_telephone_number: '07700900982',
        fm_employer_details_employer_address_line_1: 'Addr1',
        fm_employer_details_employer_address_line_2: 'Addr2',
        fm_employer_details_employer_address_line_3: 'Addr3',
        fm_employer_details_employer_address_line_4: 'Addr4',
        fm_employer_details_employer_address_line_5: 'Addr5',
        fm_employer_details_employer_post_code: 'TE12 3ST',
      };

      cy.get(DOM_ELEMENTS.submitButton).contains('Return to account details').click();
      cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');
      cy.get('@formSubmitSpy').should('have.been.calledOnce');
    });
  });

  it('(AC.7) should allow for form submission with valid data', { tags: ['@PO-272', '@PO-280'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit, 'adultOrYouthOnly');

    finesMacState.employerDetails.formData = {
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

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('(AC.1) should load button for next page for AY Defendant', { tags: ['@PO-272', '@PO-434'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit, 'adultOrYouthOnly');

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Add offence details');
  });

  it('(AC.1) should load button for next page for AYPG Defendant', { tags: ['@PO-344', '@PO-435'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit, 'parentOrGuardianToPay');

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Add personal details');
  });

  it('(AC.1) (AC.2) Employer reference and postcode should capitalise - AYPG', { tags: ['@PO-344', '@PO-1449'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit, 'parentOrGuardianToPay');

    cy.get(DOM_ELEMENTS.companyNameInput).type('Company XYZ Ltd.', { delay: 0 });
    cy.get(DOM_ELEMENTS.companyNameInput).blur();
    cy.get(DOM_ELEMENTS.addressLine1Input).type('12 Street', { delay: 0 });
    cy.get(DOM_ELEMENTS.addressLine1Input).blur();
    cy.get(DOM_ELEMENTS.referenceInput).type('abd123fgt', { delay: 0 });
    cy.get(DOM_ELEMENTS.referenceInput).blur();
    cy.get(DOM_ELEMENTS.postCodeInput).type('ne129et', { delay: 0 });
    cy.get(DOM_ELEMENTS.postCodeInput).blur();

    cy.get(DOM_ELEMENTS.referenceInput).should('have.value', 'ABD123FGT');
    cy.get(DOM_ELEMENTS.postCodeInput).should('have.value', 'NE129ET');

    cy.get(DOM_ELEMENTS.submitButton).first().click();
  });
});
