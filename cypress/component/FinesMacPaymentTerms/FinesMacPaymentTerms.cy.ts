import { mount } from 'cypress/angular';
import { OpalFines } from '../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { FinesMacPaymentTermsComponent } from '../../../src/app/flows/fines/fines-mac/fines-mac-payment-terms/fines-mac-payment-terms.component';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { PermissionsService } from '@services/permissions-service/permissions.service';
import { DateService } from '@services/date-service/date.service';

describe('FinesMacPaymentTermsComponent', () => {
  /**
   * Function to set up the component with mocked services and data.
   */
  const setupComponent = (formSubmit: any, defendantTypeMock: string | undefined = '') => {
    // Mock the state with data from multiple forms
    const mockFinesService = {
      finesMacState: {
        ...FINES_MAC_STATE_MOCK,
        accountDetails: {
          formData: {
            fm_create_account_account_type: 'fine',
            fm_create_account_business_unit_id: 69,
            fm_create_account_defendant_type: defendantTypeMock,
          },
        },
        personalDetails: {
          formData: {
            fm_personal_details_title: 'Mr',
            fm_personal_details_forenames: 'Jack',
            fm_personal_details_surname: 'Sparrow',
            fm_personal_details_dob: '02/01/2002',
            fm_personal_details_address_line_1: '123 Main Street',
          },
        },
        offenceDetails: [
          {
            formData: {
              fm_offence_details_id: 0,
              fm_offence_details_date_of_sentence: '02/01/2020',
              fm_offence_details_offence_cjs_code: 'ABC123',
              fm_offence_details_offence_id: '001',
            },
          },
          {
            formData: {
              fm_offence_details_id: 1,
              fm_offence_details_date_of_sentence: '03/01/2020',
              fm_offence_details_offence_cjs_code: 'DEF456',
              fm_offence_details_offence_id: '002',
            },
          },
        ],
      },
      // Mock method to return the earliest offence date
      getEarliestOffenceDate: () => new Date('2020-01-02'),
    };

    // Mock permissions service
    const mockPermissionService = {
      hasPermission: () => true,
    };

    // Mount the component with mocked services and data
    mount(FinesMacPaymentTermsComponent, {
      providers: [
        { provide: OpalFines, useValue: mockFinesService },
        { provide: PermissionsService, useValue: mockPermissionService },
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
        handlePaymentTermsSubmit: formSubmit,
        defendantType: defendantTypeMock,
      },
    });
  };

  const ERROR_MESSAGES: { [key: string]: string } = {
    dateInPast: 'Pay by date is in the past',
    dateInFuture: 'Pay by date is more than 3 years in the future',
    startDateInPast: 'Start date is in the past',
    startDateInFuture: 'Start date is more than 3 years in the future',
    paymentTerms: 'Select payment terms',
    payByDate: 'Enter a pay by date',
    validDate: 'Enter a valid calendar date',
    validDateFormat: 'Pay by date must be in the format DD/MM/YYYY',
    startDate: 'Enter start date',
    instalmentAmount: 'Enter instalment amount',
    validInstalmentAmount: 'Enter valid instalment amount',
    paymentFrequency: 'Select frequency of payment',
    validInstalmentDateFormat: 'Start date must be in the format DD/MM/YYYY',
    lumpSum: 'Enter lump sum',
    validLumpSumAmount: 'Enter valid lump sum amount',
    defaultDays: 'Enter days in default',
    defaultDaysTypeCheck: 'Enter number of days in default',
    futureDate: 'Date must not be in the future',
    futureDateMust: 'Date must be in the future',
    prisonDateFormat: 'Date must be in the format DD/MM/YYYY',
    prisonTypeCheck:
      'Prison and prison number must only include letters a to z, numbers 0-9 and special characters such as hyphens, spaces and apostrophes',
    noenfTypeCheck:
      'Reason must only include letters a to z, numbers 0-9 and special characters such as hyphens, spaces and apostrophes',
  };

  it('should prefill the collection order date with the earliestDateOfSentence', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit, 'adultOrYouthOnly');

    cy.get('input[id="fm_payment_terms_collection_order_made_true"]').click();
    cy.get('input[id="fm_payment_terms_collection_order_date"]').should('have.value');
  });

  it('should render the component', () => {
    setupComponent(null);

    cy.get('app-fines-mac-payment-terms-form').should('exist');
  });

  it('should handle "Pay in full" with past dates and submit form', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    cy.get('input[id="payInFull"]').first().click();
    cy.get('input[id="fm_payment_terms_pay_by_date"]').type('01/01/2022', { delay: 0 });
    cy.get('button[type="submit"]').first().click();
    cy.get('.moj-ticket-panel').should('contain', ERROR_MESSAGES['dateInPast']);

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should handle "Pay in full" with future dates and submit form', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    cy.get('input[id="payInFull"]').first().click();
    cy.get('input[id="fm_payment_terms_pay_by_date"]').type('09/09/2030', { delay: 0 });
    cy.get('button[type="submit"]').first().click();
    cy.get('.moj-ticket-panel').should('contain', ERROR_MESSAGES['dateInFuture']);

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should handle "Instalments only" with past dates', () => {
    setupComponent(null);

    cy.get('input[id="instalmentsOnly"]').click();
    cy.get('input[id="fm_payment_terms_instalment_amount"]').type('1000', { delay: 0 });
    cy.get('input[id="fm_payment_terms_start_date"]').type('01/01/2022', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.moj-ticket-panel').should('contain', ERROR_MESSAGES['startDateInPast']);
  });

  it('should handle "Instalments only" with future dates', () => {
    setupComponent(null);

    cy.get('input[id="instalmentsOnly"]').click();
    cy.get('input[id="fm_payment_terms_instalment_amount"]').type('1000', { delay: 0 });
    cy.get('input[id="fm_payment_terms_start_date"]').type('01/01/2030', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.moj-ticket-panel').should('contain', ERROR_MESSAGES['startDateInFuture']);
  });

  it('should handle "Lump sum plus instalments" with past dates', () => {
    setupComponent(null);

    cy.get('input[id="lumpSumPlusInstalments"]').click();
    cy.get('input[id="fm_payment_terms_lump_sum_amount"]').type('500', { delay: 0 });
    cy.get('input[id="fm_payment_terms_instalment_amount"]').type('1000', { delay: 0 });
    cy.get('input[id="fm_payment_terms_start_date"]').type('01/01/2022', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.moj-ticket-panel').should('contain', ERROR_MESSAGES['startDateInPast']);
  });

  it('should handle "Lump sum plus instalments" with future dates', () => {
    setupComponent(null);

    cy.get('input[id="lumpSumPlusInstalments"]').click();
    cy.get('input[id="fm_payment_terms_lump_sum_amount"]').type('500', { delay: 0 });
    cy.get('input[id="fm_payment_terms_instalment_amount"]').type('1000', { delay: 0 });
    cy.get('input[id="fm_payment_terms_start_date"]').type('01/01/2030', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.moj-ticket-panel').should('contain', ERROR_MESSAGES['startDateInFuture']);
  });

  it('should handle error messages for Pay by date', () => {
    setupComponent(null);

    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['paymentTerms']);

    cy.get('input[id="payInFull"]').click({ multiple: true });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['payByDate']);

    cy.get('input[id="fm_payment_terms_pay_by_date"]').type('32/09/2025', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['validDate']);

    cy.get('input[id="fm_payment_terms_pay_by_date"]').clear().type('13.09.2023', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['validDateFormat']);
  });

  it('should handle errors for Installment', () => {
    setupComponent(null);

    cy.get('input[id="instalmentsOnly"]').click({ multiple: true });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message')
      .should('contain', ERROR_MESSAGES['startDate'])
      .should('contain', ERROR_MESSAGES['instalmentAmount'])
      .should('contain', ERROR_MESSAGES['paymentFrequency']);

    cy.get('input[id="fm_payment_terms_instalment_amount"]').type('-1', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['validInstalmentAmount']);

    cy.get('input[id="fm_payment_terms_start_date"]').clear().type('22.33.2222', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['validInstalmentDateFormat']);

    cy.get('input[id="fm_payment_terms_start_date"]').clear().type('32/09/2025', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['validDate']);
  });

  it('should handle errors for Lump sum plus Installment', () => {
    setupComponent(null);

    cy.get('input[id="lumpSumPlusInstalments"]').click({ multiple: true });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message')
      .should('contain', ERROR_MESSAGES['lumpSum'])
      .should('contain', ERROR_MESSAGES['startDate'])
      .should('contain', ERROR_MESSAGES['instalmentAmount'])
      .should('contain', ERROR_MESSAGES['paymentFrequency']);

    cy.get('input[id = "fm_payment_terms_lump_sum_amount"]').clear().type('-1', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['validLumpSumAmount']);

    cy.get('input[id="fm_payment_terms_instalment_amount"]').type('-1', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['validInstalmentAmount']);

    cy.get('input[id="fm_payment_terms_start_date"]').clear().type('22.33.2222', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['validInstalmentDateFormat']);

    cy.get('input[id="fm_payment_terms_start_date"]').clear().type('32/09/2025', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['validDate']);
  });

  it('should have validations in place for days in default ', () => {
    setupComponent(null, 'adultOrYouthOnly');

    cy.get('input[id = "fm_payment_terms_has_days_in_default"]').click();
    cy.get('input[id = "fm_payment_terms_suspended_committal_date"]').type('32/09/2025', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message')
      .should('contain', ERROR_MESSAGES['validDate'])
      .should('contain', ERROR_MESSAGES['defaultDays']);

    cy.get('input[id = "fm_payment_terms_suspended_committal_date"').clear().type('20/09/2100', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['futureDate']);

    cy.get('input[id = "fm_payment_terms_default_days_in_jail"').clear().type('-1', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['defaultDaysTypeCheck']);
  });

  it('should have validations in place for enforcement action (pris)', () => {
    setupComponent(null);

    cy.get('input[id = "fm_payment_terms_add_enforcement_action"]').click();
    cy.get('input[id = "PRIS"]').click();
    cy.get('input[id = "fm_payment_terms_earliest_release_date"]').type('32/09/2025', { delay: 0 });
    cy.get('textarea[id = "fm_payment_terms_prison_and_prison_number"]').type('@', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message')
      .should('contain', ERROR_MESSAGES['validDate'])
      .should('contain', ERROR_MESSAGES['prisonTypeCheck']);

    cy.get('input[id = "fm_payment_terms_earliest_release_date"]').clear().type('29/09/2021', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['futureDateMust']);

    cy.get('input[id = "fm_payment_terms_earliest_release_date"]').clear().type('29,09.2021', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['prisonDateFormat']);
  });

  it('should have validations in place for enforcement action (NOENF)', () => {
    setupComponent(null);

    cy.get('input[id = "fm_payment_terms_add_enforcement_action"]').click();
    cy.get('input[id = "NOENF"]').click();
    cy.get('textarea[id = "fm_payment_terms_reason_account_is_on_noenf"]').type('@', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['noenfTypeCheck']);
  });

  it('should have validations in place for enforcement action (NOENF)', () => {
    setupComponent(null, 'adultOrYouthOnly');

    cy.get('input[id = "fm_payment_terms_add_enforcement_action"]').click();
    cy.get('input[id = "NOENF"]').click();
    cy.get('textarea[id = "fm_payment_terms_reason_account_is_on_noenf"]').type('@', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES['noenfTypeCheck']);
  });
});
