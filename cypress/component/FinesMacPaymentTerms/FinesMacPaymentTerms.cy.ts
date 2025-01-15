import { mount } from 'cypress/angular';
import { OpalFines } from '../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { FinesMacPaymentTermsComponent } from '../../../src/app/flows/fines/fines-mac/fines-mac-payment-terms/fines-mac-payment-terms.component';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { IFinesMacPaymentTermsForm } from 'src/app/flows/fines/fines-mac/fines-mac-payment-terms/interfaces/fines-mac-payment-terms-form.interface';


describe('FinesMacPaymentTermsComponent', () => {
  const setupComponent = (formSubmit: any) => {
    const mockFinesService = {
      finesMacState: { ...FINES_MAC_STATE_MOCK },
    };

    mount(FinesMacPaymentTermsComponent, {
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
        handlePaymentTermsSubmit: formSubmit,
        defendantType: 'adultOrYouthOnly',
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
  };

  it('should render the component', () => {
    setupComponent(null);

    cy.get('app-fines-mac-payment-terms-form').should('exist');
  });

  it('should handle "Pay in full" with past dates', () => {
    setupComponent(null);

    cy.get('input[id="payInFull"]').click();
    cy.get('input[id="fm_payment_terms_pay_by_date"]').type('01/01/2022', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.moj-ticket-panel').should('contain', ERROR_MESSAGES['dateInPast']);
  });

  it('should handle "Pay in full" with future dates', () => {
    setupComponent(null);

    cy.get('input[id="payInFull"]').click();
    cy.get('input[id="fm_payment_terms_pay_by_date"]').type('09/09/2030', { delay: 0 });
    cy.get('button[type="submit"]').click({ multiple: true });
    cy.get('.moj-ticket-panel').should('contain', ERROR_MESSAGES['dateInFuture']);
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
    setupComponent(null);

    cy.get('input[id = "fm_payment_terms_has_days_in_default"]').click();

  });

});
