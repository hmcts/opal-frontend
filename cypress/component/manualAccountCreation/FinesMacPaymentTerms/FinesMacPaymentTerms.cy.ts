import { mount } from 'cypress/angular';
import { FinesMacPaymentTermsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-payment-terms/fines-mac-payment-terms.component';
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
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { PermissionsService } from '@services/permissions-service/permissions.service';
import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';
import { DateService } from '@services/date-service/date.service';

describe('FinesMacPaymentTermsComponent', () => {
  let MockFinesService = new FinesService(new DateService());
  const date = new Date();

  MockFinesService.finesMacState = {
    ...FINES_PAYMENT_TERMS_MOCK,
  };

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

  it('should render the component', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['finesMacPaymentTermsForm']).should('exist');
  });

  it('should load all elements on the screen correctly for no defendant type', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.pageTitle).should('exist');
    cy.get(DOM_ELEMENTS.legend).should('exist');
    cy.get(DOM_ELEMENTS.payInFullLabel).should('exist');
    cy.get(DOM_ELEMENTS.instalmentsOnlyLabel).should('exist');
    cy.get(DOM_ELEMENTS.lumpSumPlusInstalmentsLabel).should('exist');
    cy.get(DOM_ELEMENTS.addEnforcementActionLabel).should('exist');
    cy.get(DOM_ELEMENTS.payInFull).should('exist');
    cy.get(DOM_ELEMENTS.instalmentsOnly).should('exist');
    cy.get(DOM_ELEMENTS.lumpSumPlusInstalments).should('exist');
    cy.get(DOM_ELEMENTS.submitButton).should('exist');
    cy.get(DOM_ELEMENTS.addEnforcementAction).should('exist');
  });

  it('should load all elements for payInFull option and date picker', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.payInFull).click();
    cy.get(DOM_ELEMENTS.payByDateLabel).should('contain', 'Enter pay by date');
    cy.get(DOM_ELEMENTS.dateHint).should('contain', 'For example, 31/01/2023');
    cy.get(DOM_ELEMENTS.payByDate).should('exist');
    cy.get(DOM_ELEMENTS.datePickerButton).should('exist');
    cy.get(DOM_ELEMENTS.datePickerButton).click();
    cy.get(DOM_ELEMENTS.datePickerPayByDateElement).should('exist');
    cy.get(DOM_ELEMENTS.datePickerSubmitButton).should('exist');
    cy.get(DOM_ELEMENTS.datePickerCancelButton).should('exist');
    cy.get(DOM_ELEMENTS.datePickerDialogHead).should('exist');
  });

  it('should load all elements for instalmentsOnly option and date picker', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.instalmentsOnly).click();
    cy.get(DOM_ELEMENTS.instalmentAmountLabel).should('contain', 'Instalment');
    cy.get(DOM_ELEMENTS.instalmentAmount).should('exist');
    cy.get(DOM_ELEMENTS.legend).should('contain', 'Frequency');
    cy.get(DOM_ELEMENTS.frequencyWeeklyLabel).should('contain', 'Weekly');
    cy.get(DOM_ELEMENTS.frequencyFortnightlyLabel).should('contain', 'Fortnightly');
    cy.get(DOM_ELEMENTS.frequencyMonthlyLabel).should('contain', 'Monthly');
    cy.get(DOM_ELEMENTS.frequencyFortnightly).should('exist');
    cy.get(DOM_ELEMENTS.frequencyMonthly).should('exist');
    cy.get(DOM_ELEMENTS.frequencyWeekly).should('exist');
    cy.get(DOM_ELEMENTS.startDate).should('exist');
    cy.get(DOM_ELEMENTS.startDateLabel).should('contain', 'Start date');
    cy.get(DOM_ELEMENTS.dateHint).should('contain', 'For example, 31/01/2023');
    cy.get(DOM_ELEMENTS.datePickerButton).should('exist');
    cy.get(DOM_ELEMENTS.datePickerButton).click();
    cy.get(DOM_ELEMENTS.datePickerStartDateElement).should('exist');
    cy.get(DOM_ELEMENTS.datePickerSubmitButton).should('exist');
    cy.get(DOM_ELEMENTS.datePickerCancelButton).should('exist');
    cy.get(DOM_ELEMENTS.datePickerDialogHead).should('exist');
  });

  it('should load all elements for lumpSumPlusInstalments option and date picker', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.lumpSumPlusInstalments).click();
    cy.get(DOM_ELEMENTS.lumpSumAmountLabel).should('contain', 'Lump sum');
    cy.get(DOM_ELEMENTS.lumpSumAmount).should('exist');
    cy.get(DOM_ELEMENTS.instalmentAmountLabel).should('contain', 'Instalment');
    cy.get(DOM_ELEMENTS.instalmentAmount).should('exist');
    cy.get(DOM_ELEMENTS.legend).should('contain', 'Frequency');
    cy.get(DOM_ELEMENTS.frequencyWeeklyLabel).should('contain', 'Weekly');
    cy.get(DOM_ELEMENTS.frequencyFortnightlyLabel).should('contain', 'Fortnightly');
    cy.get(DOM_ELEMENTS.frequencyMonthlyLabel).should('contain', 'Monthly');
    cy.get(DOM_ELEMENTS.frequencyFortnightly).should('exist');
    cy.get(DOM_ELEMENTS.frequencyMonthly).should('exist');
    cy.get(DOM_ELEMENTS.frequencyWeekly).should('exist');
    cy.get(DOM_ELEMENTS.startDate).should('exist');
    cy.get(DOM_ELEMENTS.startDateLabel).should('contain', 'Start date');
    cy.get(DOM_ELEMENTS.dateHint).should('contain', 'For example, 31/01/2023');
    cy.get(DOM_ELEMENTS.datePickerButton).should('exist');
    cy.get(DOM_ELEMENTS.datePickerButton).click();
    cy.get(DOM_ELEMENTS.datePickerStartDateElement).should('exist');
    cy.get(DOM_ELEMENTS.datePickerSubmitButton).should('exist');
    cy.get(DOM_ELEMENTS.datePickerCancelButton).should('exist');
    cy.get(DOM_ELEMENTS.datePickerDialogHead).should('exist');
  });

  it('should load all elements for enforcement action (PRIS)', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.addEnforcementAction).click();
    cy.get(DOM_ELEMENTS.prisLabel).should('exist');
    cy.get(DOM_ELEMENTS.pris).should('exist');
    cy.get(DOM_ELEMENTS.pris).click();
    cy.get(DOM_ELEMENTS.earliestReleaseDateLabel).should('contain', 'Earliest release date (EDR)');
    cy.get(DOM_ELEMENTS.earliestReleaseDate).should('exist');
    cy.get(DOM_ELEMENTS.prisonAndPrisonNumberLabel).should('contain', 'Prison and prison number');
    cy.get(DOM_ELEMENTS.prisonAndPrisonNumber).should('exist');
    cy.get(DOM_ELEMENTS.prisHint).should('contain', 'Held as enforcement comment');
    cy.get(DOM_ELEMENTS.prisCharHint).should('contain', 'You have 28 characters remaining');
  });

  it('should load all elements for enforcement action (NOENF)', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.addEnforcementAction).click();
    cy.get(DOM_ELEMENTS.noenfLabel).should('exist');
    cy.get(DOM_ELEMENTS.noenf).should('exist');
    cy.get(DOM_ELEMENTS.noenf).click();
    cy.get(DOM_ELEMENTS.reasonAccountIsOnNoenfLabel).should('contain', 'Reason account is on NOENF');
    cy.get(DOM_ELEMENTS.reasonAccountIsOnNoenf).should('exist');
    cy.get(DOM_ELEMENTS.noenfCharHint).should('contain', 'You have 28 characters remaining');
  });

  it('should load collection order for adultOrYouthOnly Defendant', () => {
    setupComponent(null, 'adultOrYouthOnly');

    cy.get(DOM_ELEMENTS.collectionOrderMadeTrue).should('exist');
    cy.get(DOM_ELEMENTS.collectionOrderMadeTrue).click();
    cy.get(DOM_ELEMENTS.collectionOrderDate).should('exist');
  });

  it('should load collection order for AYPG Defendant', () => {
    setupComponent(null, 'parentOrGuardianToPay');

    cy.get(DOM_ELEMENTS.collectionOrderMadeTrue).should('exist');
    cy.get(DOM_ELEMENTS.collectionOrderMadeTrue).click();
    cy.get(DOM_ELEMENTS.collectionOrderDate).should('exist');
  });

  it('should not load collection order for company Defendant', () => {
    setupComponent(null, 'company');

    cy.get(DOM_ELEMENTS.collectionOrderMadeTrue).should('not.exist');
  });

  it('should allow payByDate to be entered via date picker', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.payInFull).click();
    cy.get(DOM_ELEMENTS.datePickerButton).click();
    cy.get(DOM_ELEMENTS.datePickerPayByDateElement).should('exist');
    cy.get(DOM_ELEMENTS.testDate).click();
    cy.get(DOM_ELEMENTS.payByDate).should(
      'have.value',
      `${date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`,
    );
  });

  it('should allow startDate to be entered via date picker', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.instalmentsOnly).click();
    cy.get(DOM_ELEMENTS.datePickerButton).click();
    cy.get(DOM_ELEMENTS.datePickerStartDateElement).should('exist');
    cy.get(DOM_ELEMENTS.testDate).click();
    cy.get(DOM_ELEMENTS.startDate).should(
      'have.value',
      `${date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`,
    );
  });

  it('should load button for next page for adultOrYouthOnly Defendant', () => {
    setupComponent(null, 'adultOrYouthOnly');

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Add account comments and notes');
  });

  it('should load button for next page for AYPG Defendant', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Add account comments and notes');
  });

  it('should load button for next page for Company Defendant', () => {
    setupComponent(null, 'company');

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Add account comments and notes');
  });

  it('should prefill the collection order date with the earliestDateOfSentence', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit, 'adultOrYouthOnly');

    cy.get(DOM_ELEMENTS.collectionOrderMadeTrue).click();
    cy.get(DOM_ELEMENTS.collectionOrderDate).should('have.value', '01/10/2022');
  });

  it('should handle "Pay in full" with past dates and submit form', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01/01/2022';
    cy.get(DOM_ELEMENTS.submitButton).first().click();
    cy.get(DOM_ELEMENTS.mojTicketPanel).should('contain', ERROR_MESSAGES.dateInPast);

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should handle "Pay in full" with future dates and submit form', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01/01/2033';
    cy.get(DOM_ELEMENTS.submitButton).first().click();
    cy.get(DOM_ELEMENTS.mojTicketPanel).should('contain', ERROR_MESSAGES.dateInFuture);

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should handle "Instalments only" with past dates', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'instalmentsOnly';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_instalment_amount = 1000;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '01/01/2022';
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.mojTicketPanel).should('contain', ERROR_MESSAGES.startDateInPast);
  });

  it('should handle "Instalments only" with future dates', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'instalmentsOnly';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_instalment_amount = 1000;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '01/01/2030';
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.mojTicketPanel).should('contain', ERROR_MESSAGES.startDateInFuture);
  });

  it('should handle "Lump sum plus instalments" with past dates', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'lumpSumPlusInstalments';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_lump_sum_amount = 500;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_instalment_amount = 1000;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '01/01/2022';
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.mojTicketPanel).should('contain', ERROR_MESSAGES.startDateInPast);
  });

  it('should handle "Lump sum plus instalments" with future dates', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'lumpSumPlusInstalments';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_lump_sum_amount = 500;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_instalment_amount = 1000;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '01/01/2030';
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.mojTicketPanel).should('contain', ERROR_MESSAGES.startDateInFuture);
  });

  it('should handle empty data for Pay by date', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.paymentTerms);

    cy.get(DOM_ELEMENTS.payInFull).click({ multiple: true });
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.payByDate);
  });

  it('should handle  for pay in full', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01,01.2022';
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validDateFormat);
  });

  it('should handle valid date for Pay in full', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '32/01/2022';
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validDate);
  });

  it('should handle errors for Installment', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.instalmentsOnly).click({ multiple: true });

    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });

    for (const [, value] of Object.entries(INSTALLMENT_ERRORS)) {
      cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', value);
    }
  });

  it('should handle valid instalmentAmount error for installment', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'instalmentsOnly';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_instalment_amount = -1;
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validInstalmentAmount);
  });

  it('should handle valid InstalmentDateFormat error for installment', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'instalmentsOnly';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '01/21/12212';
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validInstalmentDateFormat);
  });

  it('should handle valid date error for installment', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'instalmentsOnly';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '32/09/2025';
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validDate);
  });

  it('should handle errors for Lump sum plus Installment', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.lumpSumPlusInstalments).click({ multiple: true });
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });

    for (const [, value] of Object.entries(LUMPSUM_ERRORS)) {
      cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', value);
    }
  });

  it('should have validations in place for validLumpSumAmount', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'lumpSumPlusInstalments';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_lump_sum_amount = -1;
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validLumpSumAmount);
  });

  it('should have validations in place for validLumpSuminstallmentAmount', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'lumpSumPlusInstalments';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_instalment_amount = -1;
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validInstalmentAmount);
  });

  it('should have validations in place for validLumpSumStartDateFormat', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'lumpSumPlusInstalments';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '32/09/202555';
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validInstalmentDateFormat);
  });

  it('should have validations in place for validLumpSumStartDate', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'lumpSumPlusInstalments';
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '32/09/2025';
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validDate);
  });

  it('should have validations in place for days in default enter valid data ', () => {
    setupComponent(null, 'adultOrYouthOnly');

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_has_days_in_default = true;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_suspended_committal_date = '32/09/2025';
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.govukErrorMessage)
      .should('contain', ERROR_MESSAGES.validDate)
      .should('contain', ERROR_MESSAGES.defaultDays);
  });

  it('should have validations in place for days in default future date', () => {
    setupComponent(null, 'adultOrYouthOnly');

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_has_days_in_default = true;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_suspended_committal_date = '20/09/2200';
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.futureDate);
  });

  it('should have validations in place for days in default future date', () => {
    setupComponent(null, 'adultOrYouthOnly');

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_has_days_in_default = true;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_default_days_in_jail = -1;
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.defaultDaysTypeCheck);
  });

  it('should have validations in place for enforcement action (pris)', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_add_enforcement_action = true;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_enforcement_action = 'PRIS';
    cy.get(DOM_ELEMENTS.earliestReleaseDate).type('32/09/2025', { delay: 0 });
    cy.get(DOM_ELEMENTS.prisonAndPrisonNumber).type('@', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });

    for (const [, value] of Object.entries(ENFORCEMENT_ERRORS)) {
      cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', value);
    }

    cy.get(DOM_ELEMENTS.earliestReleaseDate).clear().type('29/09/2021', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.futureDateMust);

    cy.get(DOM_ELEMENTS.earliestReleaseDate).clear().type('29,09.2021', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.prisonDateFormat);
  });

  it('should have validations in place for enforcement action (NOENF)', () => {
    setupComponent(null);

    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_add_enforcement_action = true;
    MockFinesService.finesMacState.paymentTerms.formData.fm_payment_terms_enforcement_action = 'NOENF';
    cy.get(DOM_ELEMENTS.reasonAccountIsOnNoenf).type('@', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
    cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.noenfTypeCheck);
  });
});
