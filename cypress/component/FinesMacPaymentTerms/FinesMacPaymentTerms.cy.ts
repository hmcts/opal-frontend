import { mount } from 'cypress/angular';
import { FinesMacPaymentTermsComponent } from '../../../src/app/flows/fines/fines-mac/fines-mac-payment-terms/fines-mac-payment-terms.component';
import { ActivatedRoute } from '@angular/router';
import { FINES_PAYMENT_TERMS_MOCK } from './mocks/fines-payment-terms-mock';
import {
  ERROR_MESSAGES,
  LUMPSUM_ERRORS,
  INSTALLMENT_ERRORS,
  ENFORCEMENT_ERRORS,
} from './constants/fines_mac_payment_terms_errors';
import { DOM_ELEMENTS } from './constants/fines_mac_payment_terms_elements';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { OpalFines } from '../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { PermissionsService } from '@services/permissions-service/permissions.service';
import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';
import { DateService } from '@services/date-service/date.service';
import { mock } from 'node:test';
import { set } from 'cypress/types/lodash';

describe('FinesMacPaymentTermsComponent', () => {
  let MockFinesService = new FinesService(new DateService());

  MockFinesService.finesMacState = {
    ...FINES_PAYMENT_TERMS_MOCK,
  };

  // let mockPaymentState = {
  //   finesMacState: { ...FINES_PAYMENT_TERMS_MOCK },
  // };

  afterEach(() => {
    cy.then(() => {
      MockFinesService.finesMacState.paymentTerms.formData = {
        fm_payment_terms_payment_terms: '',
        fm_payment_terms_pay_by_date: '',
        fm_payment_terms_lump_sum_amount: null,
        fm_payment_terms_instalment_amount: null,
        fm_payment_terms_instalment_period: '',
        fm_payment_terms_start_date: '',
        fm_payment_terms_payment_card_request: null,
        fm_payment_terms_has_days_in_default: null,
        fm_payment_terms_suspended_committal_date: '',
        fm_payment_terms_default_days_in_jail: null,
        fm_payment_terms_add_enforcement_action: null,
        fm_payment_terms_hold_enforcement_on_account: null,
        fm_payment_terms_reason_account_is_on_noenf: '',
        fm_payment_terms_earliest_release_date: '',
        fm_payment_terms_prison_and_prison_number: '',
        fm_payment_terms_enforcement_action: '',
        fm_payment_terms_collection_order_made: null,
        fm_payment_terms_collection_order_date: '',
        fm_payment_terms_collection_order_made_today: null,
      };
    });
  });
  /**
   * Function to set up the component with mocked services and data.
   */
  const setupComponent = (formSubmit: any, defendantTypeMock: string | undefined = '') => {
    // Mock the state with data from multiple forms

    const mockPermissionService = new PermissionsService();

    mockPermissionService.getUniquePermissions(SESSION_USER_STATE_MOCK);

    // Mount the component with mocked services and data
    mount(FinesMacPaymentTermsComponent, {
      providers: [
        { provide: OpalFines, useValue: MockFinesService },
        { provide: FinesService, useValue: MockFinesService },
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

  it('should prefill the collection order date with the earliestDateOfSentence', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit, 'adultOrYouthOnly');

    cy.get(DOM_ELEMENTS['collectionOrderMadeTrue']).click();
    cy.get(DOM_ELEMENTS['collectionOrderDate']).should('have.value', '01/10/2022');
  });

  it('should render the component', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['finesMacPaymentTermsForm']).should('exist');
  });

  it('should handle "Pay in full" with past dates and submit form', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01/01/2022';
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['mojTicketPanel']).should('contain', ERROR_MESSAGES['dateInPast']);

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should handle "Pay in full" with future dates and submit form', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01/01/2033';
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['mojTicketPanel']).should('contain', ERROR_MESSAGES['dateInFuture']);

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should handle "Instalments only" with past dates', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'instalmentsOnly';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_instalment_amount = 1000;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '01/01/2022';
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['mojTicketPanel']).should('contain', ERROR_MESSAGES['startDateInPast']);
  });

  it('should handle "Instalments only" with future dates', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'instalmentsOnly';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_instalment_amount = 1000;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '01/01/2030';
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['mojTicketPanel']).should('contain', ERROR_MESSAGES['startDateInFuture']);
  });

  it('should handle "Lump sum plus instalments" with past dates', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'lumpSumPlusInstalments';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_lump_sum_amount = 500;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_instalment_amount = 1000;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '01/01/2022';
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['mojTicketPanel']).should('contain', ERROR_MESSAGES['startDateInPast']);
  });

  it('should handle "Lump sum plus instalments" with future dates', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'lumpSumPlusInstalments';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_lump_sum_amount = 500;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_instalment_amount = 1000;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '01/01/2030';
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['mojTicketPanel']).should('contain', ERROR_MESSAGES['startDateInFuture']);
  });

  it('should handle empty data for Pay by date', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['paymentTerms']);

    cy.get(DOM_ELEMENTS['payInFull']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['payByDate']);
  });

  it('should handle  for pay in full', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01,01.2022';
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['validDateFormat']);
  });

  it('should handle valid date for Pay in full', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '32/01/2022';
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['validDate']);
  });

  it('should handle errors for Installment', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['instalmentsOnly']).click({ multiple: true });

    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });

    for (const [, value] of Object.entries(INSTALLMENT_ERRORS)) {
      cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', value);
    }
  });

  it('should handle valid instalmentAmount error for installment', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'instalmentsOnly';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_instalment_amount = -1;
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['validInstalmentAmount']);
  });

  it('should handle valid InstalmentDateFormat error for installment', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'instalmentsOnly';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '01/21/12212';
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['validInstalmentDateFormat']);
  });

  it('should handle valid date error for installment', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'instalmentsOnly';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '32/09/2025';
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['validDate']);
  });

  it('should handle errors for Lump sum plus Installment', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['lumpSumPlusInstalments']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });

    for (const [, value] of Object.entries(LUMPSUM_ERRORS)) {
      cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', value);
    }
  });

  it('should have validations in place for validLumpSumAmount', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'lumpSumPlusInstalments';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_lump_sum_amount = -1;
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['validLumpSumAmount']);
  });

  it('should have validations in place for validLumpSuminstallmentAmount', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'lumpSumPlusInstalments';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_instalment_amount = -1;
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['validInstalmentAmount']);
  });

  it('should have validations in place for validLumpSumStartDateFormat', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'lumpSumPlusInstalments';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '32/09/202555';
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['validInstalmentDateFormat']);
  });

  it('should have validations in place for validLumpSumStartDate', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'lumpSumPlusInstalments';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '32/09/2025';
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['validDate']);
  });

  it('should have validations in place for days in default enter valid data ', () => {
    setupComponent(null, 'adultOrYouthOnly');

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_has_days_in_default = true;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_suspended_committal_date = '32/09/2025';
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage'])
      .should('contain', ERROR_MESSAGES['validDate'])
      .should('contain', ERROR_MESSAGES['defaultDays']);
  });

  it('should have validations in place for days in default future date', () => {
    setupComponent(null, 'adultOrYouthOnly');

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_has_days_in_default = true;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_suspended_committal_date = '20/09/2200';
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['futureDate']);
  });

  it('should have validations in place for days in default future date', () => {
    setupComponent(null, 'adultOrYouthOnly');

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_has_days_in_default = true;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_default_days_in_jail = -1;
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['defaultDaysTypeCheck']);
  });

  it('should have validations in place for enforcement action (pris)', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_add_enforcement_action = true;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_enforcement_action = 'PRIS';
    cy.get(DOM_ELEMENTS['earliestReleaseDate']).type('32/09/2025', { delay: 0 });
    cy.get(DOM_ELEMENTS['prisonAndPrisonNumber']).type('@', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });

    for (const [, value] of Object.entries(ENFORCEMENT_ERRORS)) {
      cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', value);
    }

    cy.get(DOM_ELEMENTS['earliestReleaseDate']).clear().type('29/09/2021', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['futureDateMust']);

    cy.get(DOM_ELEMENTS['earliestReleaseDate']).clear().type('29,09.2021', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['prisonDateFormat']);
  });

  it('should have validations in place for enforcement action (NOENF)', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_add_enforcement_action = true;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_enforcement_action = 'NOENF';
    cy.get(DOM_ELEMENTS['reasonAccountIsOnNoenf']).type('@', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['noenfTypeCheck']);
  });
});
