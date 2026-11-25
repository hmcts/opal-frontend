import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_MCI_ROUTING_PATHS } from 'src/app/flows/fines/fines-mci/routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from 'src/app/flows/fines/fines-mci/stores/fines-mci.store';
import { FINES_ROUTING_PATHS } from 'src/app/flows/fines/routing/constants/fines-routing-paths.constant';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IFinesMciCourtFeePaymentDetails } from 'src/app/flows/fines/fines-mci/stores/interfaces/fines-mci-court-fee-payment-details.interface';
import { IFinesMciCourtFeeDraft } from 'src/app/flows/fines/fines-mci/stores/interfaces/fines-mci.interface';
import { ManualCashInputLocators as Mci } from '../../../shared/selectors/finance.locators';
import { setupFinancePageComponent } from './setup/SetupComponent';

const TAGS = ['@JIRA-STORY:PO-3671', '@JIRA-LABEL:manual-cash-input', '@JIRA-EPIC:PO-2439', '@R1CFinancialMovements'];
const BUSINESS_UNIT = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
const PAYMENT_DETAILS_ROUTE = [
  '/',
  FINES_ROUTING_PATHS.root,
  FINES_MCI_ROUTING_PATHS.root,
  FINES_MCI_ROUTING_PATHS.children.create,
  FINES_MCI_ROUTING_PATHS.children.till,
  'court-fee-payment-details',
];
const PAYMENT_DETAILS_URL = '/fines/manual-cash-input/create/till/court-fee-payment-details';
const CHECK_COURT_FEE_URL = '/fines/manual-cash-input/create/till/check-court-fee';
const COURT_FEE_DETAILS_URL = '/fines/manual-cash-input/create/till/court-fee-details';
const OVERPAYMENT_CONFIRMATION_URL = '/fines/manual-cash-input/create/till/over-underpayment-confirmation';
const TILL_DETAILS_URL = '/fines/manual-cash-input/create/till/details';
const COURT_FEES_ENDPOINT = '/opal-fines-service/court-fees';
const COURT_FEES_RESPONSE = {
  court_fees: [{ court_fee_id: 101, court_fee_code: 'CF001', description: 'Application', amount: 12.5 }],
};
const COURT_FEE_DRAFT: IFinesMciCourtFeeDraft = { courtFeeId: 101, amountPaid: '30.00', numberOfItems: '2' };
const LEAVE_WARNING = 'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.';
const PAYMENT_RECEIVED_FROM_ERROR = 'Select who the payment was received from';
const METHODS_WITH_REFERENCES = [
  { code: 'PO', label: 'Postal order' },
  { code: 'CQ', label: 'Cheque' },
  { code: 'CT', label: 'Credit transfer' },
];
const PAYMENT_REFERENCE_PATTERN_ERROR =
  'Payment reference must only include letters a to z, numbers, hyphens, spaces and apostrophes';
const PAYMENT_REFERENCE_MAX_LENGTH_ERROR = 'Payment reference must be 50 characters or fewer';
const ALPHABETIC_CHARACTER_ERROR = 'must only include letters a to z, hyphens, spaces and apostrophes';
const ALPHANUMERIC_CHARACTER_ERROR = 'must only include letters a to z, numbers, hyphens, spaces and apostrophes';
const INDIVIDUAL_CREDIT_TRANSFER_DETAILS: IFinesMciCourtFeePaymentDetails = {
  paymentReceivedFrom: 'applicant',
  paymentMethod: 'CT',
  paymentSource: 'ALLPAY',
  paymentReference: 'REF-123',
  payerType: 'individual',
  title: 'Mr',
  firstNames: 'Alex James',
  lastName: 'Smith',
  addressLine1: '12 Example Street',
  addressLine2: 'Example District',
  addressLine3: 'Example Town',
  postcode: 'SW1A 1AA',
};
type CourtFeePaymentDetailsStoreAccess = {
  courtFeePaymentDetails: () => IFinesMciCourtFeePaymentDetails | null;
};
type CourtFeePaymentOrigin = 'court-fee-details' | 'over-underpayment-confirmation';
type CourtFeeNavigationStoreAccess = CourtFeePaymentDetailsStoreAccess & {
  setDraftJourney: (journey: 'courtFee' | null) => void;
  setCourtFeeDraft: (draft: IFinesMciCourtFeeDraft | null) => void;
  setCourtFeePaymentOrigin: (origin: CourtFeePaymentOrigin | null) => void;
  draftJourney: () => 'courtFee' | null;
  courtFeeDraft: () => IFinesMciCourtFeeDraft | null;
};

const openCourtFeePaymentDetails = (origin: CourtFeePaymentOrigin = 'court-fee-details'): void => {
  cy.intercept(
    {
      method: 'GET',
      pathname: COURT_FEES_ENDPOINT,
      query: { business_unit_id: String(BUSINESS_UNIT.business_unit_id) },
    },
    COURT_FEES_RESPONSE,
  ).as('courtFees');
  setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });
  cy.get('@finesMciStore').then((store) => {
    const finesMciStore = store as InstanceType<typeof FinesMciStore> & CourtFeeNavigationStoreAccess;

    finesMciStore.setBusinessUnit(BUSINESS_UNIT);
    finesMciStore.setDraftJourney('courtFee');
    finesMciStore.setCourtFeeDraft(COURT_FEE_DRAFT);
    finesMciStore.setCourtFeePaymentOrigin(origin);
  });
  cy.get('@financeRouter')
    .then((router) =>
      (router as { navigate: (commands: string[]) => Promise<boolean> }).navigate(PAYMENT_DETAILS_ROUTE),
    )
    .should('be.true');
};

const selectPaymentDetailsRadio = (name: string, value: string): void => {
  cy.get(`input[name="${name}"][value="${value}"]`).check();
};

const completeRequiredFieldsExcept = (method?: string): void => {
  selectPaymentDetailsRadio('paymentReceivedFrom', 'applicant');
  if (method) {
    selectPaymentDetailsRadio('paymentMethod', method);
    if (method === 'CT') selectPaymentDetailsRadio('paymentSource', 'ALLPAY');
  }
  selectPaymentDetailsRadio('payerType', 'company');
  cy.get('#companyName').type('Example Ltd');
};

const submitAndAssertErrors = (messages: string[]): void => {
  cy.get(Mci.continueButton).click();
  cy.get(Mci.errorSummary)
    .find('li')
    .should('have.length', messages.length)
    .then(($items) => {
      const summaryMessages = [...$items].map((item) => item.textContent?.trim());
      expect(summaryMessages).to.have.members(messages);
    });
  cy.get(Mci.errorMessage)
    .filter(':visible')
    .should('have.length', messages.length)
    .then(($errors) => {
      const fieldErrors = [...$errors].map((item) => item.textContent?.trim() ?? '').join(' ');
      messages.forEach((message) => expect(fieldErrors).to.include(message));
    });
  cy.get('@financeRouter').its('url').should('eq', PAYMENT_DETAILS_URL);
};

const submitAndAssertOnlyError = (message: string): void => submitAndAssertErrors([message]);

const fillRequiredPayerFields = (payerType: 'individual' | 'company', nameValue: string): void => {
  selectPaymentDetailsRadio('paymentReceivedFrom', 'applicant');
  selectPaymentDetailsRadio('paymentMethod', 'NC');
  selectPaymentDetailsRadio('payerType', payerType);
  if (payerType === 'individual') {
    cy.get('#lastName').type(nameValue);
  } else {
    cy.get('#companyName').type(nameValue);
  }
};

describe('Manual Cash Input - Court Fee Payment Details', () => {
  it(
    '(AC2a, AC8a EMAC1) requires Payment received from and links the error summary to its field',
    { tags: TAGS },
    () => {
      openCourtFeePaymentDetails();

      cy.contains('h1', 'Payment details').should('be.visible');
      cy.get(Mci.continueButton).click();

      cy.get(Mci.errorSummary).should('contain.text', PAYMENT_RECEIVED_FROM_ERROR);
      cy.get(Mci.errorMessage).filter(':visible').should('be.visible').and('contain.text', PAYMENT_RECEIVED_FROM_ERROR);
      cy.get(Mci.errorSummary).contains('a', PAYMENT_RECEIVED_FROM_ERROR).click();
      cy.focused().should('have.id', 'paymentReceivedFrom');
      cy.get('@financeRouter').its('url').should('eq', PAYMENT_DETAILS_URL);
    },
  );

  it('(AC3a) requires a method of payment', { tags: TAGS }, () => {
    openCourtFeePaymentDetails();
    completeRequiredFieldsExcept();

    submitAndAssertOnlyError('Select a method of payment');
  });

  it('(AC3b) requires a source for Credit transfer', { tags: TAGS }, () => {
    openCourtFeePaymentDetails();
    selectPaymentDetailsRadio('paymentReceivedFrom', 'applicant');
    selectPaymentDetailsRadio('paymentMethod', 'CT');
    selectPaymentDetailsRadio('payerType', 'company');
    cy.get('#companyName').type('Example Ltd');

    submitAndAssertOnlyError('Select a source');
  });

  METHODS_WITH_REFERENCES.forEach(({ code, label }) => {
    it(`(AC3c) rejects invalid characters in the ${label} payment reference`, { tags: TAGS }, () => {
      openCourtFeePaymentDetails();
      completeRequiredFieldsExcept(code);
      cy.get('#paymentReference').type('Invalid!');

      submitAndAssertOnlyError(PAYMENT_REFERENCE_PATTERN_ERROR);
    });

    it(`(AC3d) rejects a ${label} payment reference longer than 50 characters`, { tags: TAGS }, () => {
      openCourtFeePaymentDetails();
      completeRequiredFieldsExcept(code);
      cy.get('#paymentReference').type('A'.repeat(51));

      submitAndAssertOnlyError(PAYMENT_REFERENCE_MAX_LENGTH_ERROR);
    });
  });

  it('(AC4a) requires a payer type', { tags: TAGS }, () => {
    openCourtFeePaymentDetails();
    selectPaymentDetailsRadio('paymentReceivedFrom', 'applicant');
    selectPaymentDetailsRadio('paymentMethod', 'NC');

    submitAndAssertOnlyError('Select payer type');
  });

  it('(AC4b) requires a last name for an Individual payer', { tags: TAGS }, () => {
    openCourtFeePaymentDetails();
    selectPaymentDetailsRadio('paymentReceivedFrom', 'applicant');
    selectPaymentDetailsRadio('paymentMethod', 'NC');
    selectPaymentDetailsRadio('payerType', 'individual');

    submitAndAssertOnlyError('Enter last name');
  });

  it('(AC4c) requires a company name for a Company payer', { tags: TAGS }, () => {
    openCourtFeePaymentDetails();
    selectPaymentDetailsRadio('paymentReceivedFrom', 'applicant');
    selectPaymentDetailsRadio('paymentMethod', 'NC');
    selectPaymentDetailsRadio('payerType', 'company');

    submitAndAssertOnlyError('Enter company name');
  });

  it('(AC4d) rejects invalid characters in First names', { tags: TAGS }, () => {
    openCourtFeePaymentDetails();
    fillRequiredPayerFields('individual', 'Smith');
    cy.get('#firstNames').type('Jane1');

    submitAndAssertOnlyError(`First names ${ALPHABETIC_CHARACTER_ERROR}`);
  });

  it('(AC4d) rejects invalid characters in Last name', { tags: TAGS }, () => {
    openCourtFeePaymentDetails();
    fillRequiredPayerFields('individual', 'Smith1');

    submitAndAssertOnlyError(`Last name ${ALPHABETIC_CHARACTER_ERROR}`);
  });

  it('(AC4e) rejects invalid characters in Company name', { tags: TAGS }, () => {
    openCourtFeePaymentDetails();
    fillRequiredPayerFields('company', 'Example! Ltd');

    submitAndAssertOnlyError(`Company name ${ALPHANUMERIC_CHARACTER_ERROR}`);
  });

  [
    { field: 'addressLine1', label: 'Address line 1' },
    { field: 'addressLine2', label: 'Address line 2' },
    { field: 'addressLine3', label: 'Address line 3' },
    { field: 'postcode', label: 'Postcode' },
  ].forEach(({ field, label }) => {
    it(`(AC4e) rejects invalid characters in ${label}`, { tags: TAGS }, () => {
      openCourtFeePaymentDetails();
      fillRequiredPayerFields('company', 'Example Ltd');
      cy.get(`#${field}`).type('Invalid!');

      submitAndAssertOnlyError(`${label} ${ALPHANUMERIC_CHARACTER_ERROR}`);
    });
  });

  it('(AC4f) rejects overlong Individual and address fields', { tags: TAGS }, () => {
    openCourtFeePaymentDetails();
    fillRequiredPayerFields('individual', 'L'.repeat(31));
    cy.get('#firstNames').type('F'.repeat(21));
    cy.get('#addressLine1').type('A'.repeat(31));
    cy.get('#addressLine2').type('B'.repeat(31));
    cy.get('#addressLine3').type('C'.repeat(31));
    cy.get('#postcode').type('P'.repeat(9));

    submitAndAssertErrors([
      'First names must be 20 characters or fewer',
      'Last name must be 30 characters or fewer',
      'Address line 1 must be 30 characters or fewer',
      'Address line 2 must be 30 characters or fewer',
      'Address line 3 must be 30 characters or fewer',
      'Postcode must be 8 characters or fewer',
    ]);
  });

  it('(AC4f) rejects overlong Company and address fields', { tags: TAGS }, () => {
    openCourtFeePaymentDetails();
    fillRequiredPayerFields('company', 'C'.repeat(51));
    cy.get('#addressLine1').type('A'.repeat(31));
    cy.get('#addressLine2').type('B'.repeat(31));
    cy.get('#addressLine3').type('C'.repeat(31));
    cy.get('#postcode').type('P'.repeat(9));

    submitAndAssertErrors([
      'Company name must be 50 characters or fewer',
      'Address line 1 must be 30 characters or fewer',
      'Address line 2 must be 30 characters or fewer',
      'Address line 3 must be 30 characters or fewer',
      'Postcode must be 8 characters or fewer',
    ]);
  });

  it('(AC5) submits valid payment details and opens the temporary Check Court Fee screen', { tags: TAGS }, () => {
    openCourtFeePaymentDetails();
    fillRequiredPayerFields('company', 'Example Ltd');

    cy.get(Mci.continueButton).click();

    cy.get('@financeRouter').its('url').should('eq', CHECK_COURT_FEE_URL);
    cy.contains('h1', 'Check payment').should('be.visible');
    cy.get('@finesMciStore').should((store) => {
      expect((store as CourtFeePaymentDetailsStoreAccess).courtFeePaymentDetails()).to.include({
        paymentReceivedFrom: 'applicant',
        paymentMethod: 'NC',
        payerType: 'company',
        companyName: 'Example Ltd',
      });
    });
  });

  it('(AC5) persists all valid Individual Credit transfer payment details', { tags: TAGS }, () => {
    openCourtFeePaymentDetails();
    selectPaymentDetailsRadio('paymentReceivedFrom', INDIVIDUAL_CREDIT_TRANSFER_DETAILS.paymentReceivedFrom);
    selectPaymentDetailsRadio('paymentMethod', INDIVIDUAL_CREDIT_TRANSFER_DETAILS.paymentMethod);
    selectPaymentDetailsRadio('paymentSource', INDIVIDUAL_CREDIT_TRANSFER_DETAILS.paymentSource!);
    cy.get('#paymentReference').type(INDIVIDUAL_CREDIT_TRANSFER_DETAILS.paymentReference!);
    selectPaymentDetailsRadio('payerType', INDIVIDUAL_CREDIT_TRANSFER_DETAILS.payerType);
    cy.get('#title').select(INDIVIDUAL_CREDIT_TRANSFER_DETAILS.title!);
    cy.get('#firstNames').type(INDIVIDUAL_CREDIT_TRANSFER_DETAILS.firstNames!);
    cy.get('#lastName').type(INDIVIDUAL_CREDIT_TRANSFER_DETAILS.lastName!);
    cy.get('#addressLine1').type(INDIVIDUAL_CREDIT_TRANSFER_DETAILS.addressLine1!);
    cy.get('#addressLine2').type(INDIVIDUAL_CREDIT_TRANSFER_DETAILS.addressLine2!);
    cy.get('#addressLine3').type(INDIVIDUAL_CREDIT_TRANSFER_DETAILS.addressLine3!);
    cy.get('#postcode').type(INDIVIDUAL_CREDIT_TRANSFER_DETAILS.postcode!);

    cy.get(Mci.continueButton).click();

    cy.get('@financeRouter').its('url').should('eq', CHECK_COURT_FEE_URL);
    cy.get('@finesMciStore').should((store) => {
      expect((store as CourtFeePaymentDetailsStoreAccess).courtFeePaymentDetails()).to.deep.equal(
        INDIVIDUAL_CREDIT_TRANSFER_DETAILS,
      );
    });
  });

  [
    {
      origin: 'court-fee-details' as const,
      label: 'exact payment',
      destination: COURT_FEE_DETAILS_URL,
    },
    {
      origin: 'over-underpayment-confirmation' as const,
      label: 'overpayment',
      destination: OVERPAYMENT_CONFIRMATION_URL,
    },
  ].forEach(({ origin, label, destination }) => {
    it(
      `(AC6) Back from an ${label} returns to the previous screen without a warning when blank`,
      { tags: TAGS },
      () => {
        openCourtFeePaymentDetails(origin);
        cy.window().then((window) => cy.wrap(cy.stub(window, 'confirm').returns(false)).as('leavePageConfirm'));

        cy.get(Mci.backLink).click();

        cy.get('@leavePageConfirm').should('not.have.been.called');
        cy.wait('@courtFees').its('response.statusCode').should('eq', 200);
        cy.get('@financeRouter').its('url').should('eq', destination);
        cy.get(origin === 'court-fee-details' ? Mci.courtFeeDetailsPage : Mci.courtFeeOverUnderpaymentPage).should(
          'be.visible',
        );
      },
    );

    it(
      `(AC6a, AC6ai, AC6aii, AC8b RGAC1) Back from an ${label} asks before leaving and keeps or discards the entered details`,
      { tags: TAGS },
      () => {
        openCourtFeePaymentDetails(origin);
        fillRequiredPayerFields('company', 'Example Ltd');
        cy.window().then((window) => {
          const confirm = cy.stub(window, 'confirm');

          confirm.onFirstCall().returns(false);
          confirm.onSecondCall().returns(true);
          cy.wrap(confirm).as('leavePageConfirm');
        });

        cy.get(Mci.backLink).click();

        cy.get('@leavePageConfirm').should('have.been.calledOnce').and('have.been.calledWithExactly', LEAVE_WARNING);
        cy.get('@financeRouter').its('url').should('eq', PAYMENT_DETAILS_URL);
        cy.get('#companyName').should('have.value', 'Example Ltd');

        cy.get(Mci.backLink).click();

        cy.get('@leavePageConfirm').should('have.been.calledTwice');
        cy.wait('@courtFees').its('response.statusCode').should('eq', 200);
        cy.get('@financeRouter').its('url').should('eq', destination);
        cy.get(origin === 'court-fee-details' ? Mci.courtFeeDetailsPage : Mci.courtFeeOverUnderpaymentPage).should(
          'be.visible',
        );
        cy.get('@finesMciStore').should((store) => {
          expect((store as CourtFeePaymentDetailsStoreAccess).courtFeePaymentDetails()).to.be.null;
        });
      },
    );
  });

  it('(AC7) Cancel returns to Till Details without a warning when blank', { tags: TAGS }, () => {
    openCourtFeePaymentDetails();
    cy.window().then((window) => cy.wrap(cy.stub(window, 'confirm').returns(false)).as('leavePageConfirm'));

    cy.get(Mci.cancelLink).click();

    cy.get('@leavePageConfirm').should('not.have.been.called');
    cy.get('@financeRouter').its('url').should('eq', TILL_DETAILS_URL);
    cy.contains('h1', 'Till details').should('be.visible');
  });

  it('(AC7a, AC7ai, AC7aii, AC8b RGAC1) Cancel asks before discarding entered payment details', { tags: TAGS }, () => {
    openCourtFeePaymentDetails();
    fillRequiredPayerFields('company', 'Example Ltd');
    cy.window().then((window) => {
      const confirm = cy.stub(window, 'confirm');

      confirm.onFirstCall().returns(false);
      confirm.onSecondCall().returns(true);
      cy.wrap(confirm).as('leavePageConfirm');
    });

    cy.get(Mci.cancelLink).click();

    cy.get('@leavePageConfirm').should('have.been.calledOnce').and('have.been.calledWithExactly', LEAVE_WARNING);
    cy.get('@financeRouter').its('url').should('eq', PAYMENT_DETAILS_URL);
    cy.get('input[name="paymentReceivedFrom"][value="applicant"]').should('be.checked');
    cy.get('input[name="paymentMethod"][value="NC"]').should('be.checked');
    cy.get('input[name="payerType"][value="company"]').should('be.checked');
    cy.get('#companyName').should('have.value', 'Example Ltd');
    cy.get('@finesMciStore').should((store) => {
      const finesMciStore = store as CourtFeeNavigationStoreAccess;

      expect(finesMciStore.draftJourney()).to.equal('courtFee');
      expect(finesMciStore.courtFeeDraft()).to.deep.equal(COURT_FEE_DRAFT);
    });

    cy.get(Mci.cancelLink).click();

    cy.get('@leavePageConfirm').should('have.been.calledTwice');
    cy.get('@financeRouter').its('url').should('eq', TILL_DETAILS_URL);
    cy.contains('h1', 'Till details').should('be.visible');
    cy.get('@finesMciStore').should((store) => {
      const finesMciStore = store as CourtFeeNavigationStoreAccess;

      expect(finesMciStore.draftJourney()).to.be.null;
      expect(finesMciStore.courtFeeDraft()).to.be.null;
      expect(finesMciStore.courtFeePaymentDetails()).to.be.null;
    });
  });

  it('(AC8b RGAC2) warns before browser exit and retains entered payment details', { tags: TAGS }, () => {
    openCourtFeePaymentDetails();
    fillRequiredPayerFields('company', 'Example Ltd');

    cy.window().then((window) => {
      const browserExitEvent = new Event('beforeunload', { cancelable: true });

      expect(window.dispatchEvent(browserExitEvent), 'browser-exit warning').to.be.false;
      expect(browserExitEvent.defaultPrevented, 'browser exit is prevented').to.be.true;
    });

    cy.get('input[name="paymentReceivedFrom"][value="applicant"]').should('be.checked');
    cy.get('input[name="paymentMethod"][value="NC"]').should('be.checked');
    cy.get('input[name="payerType"][value="company"]').should('be.checked');
    cy.get('#companyName').should('have.value', 'Example Ltd');
    cy.get('@financeRouter').its('url').should('eq', PAYMENT_DETAILS_URL);
  });

  it('(AC8b RGAC3) warns before refresh and retains entered payment details', { tags: TAGS }, () => {
    openCourtFeePaymentDetails();
    fillRequiredPayerFields('company', 'Example Ltd');

    cy.window().then((window) => {
      const refreshEvent = new Event('beforeunload', { cancelable: true });

      expect(window.dispatchEvent(refreshEvent), 'refresh warning').to.be.false;
      expect(refreshEvent.defaultPrevented, 'refresh is prevented').to.be.true;
    });

    cy.get('input[name="paymentReceivedFrom"][value="applicant"]').should('be.checked');
    cy.get('input[name="paymentMethod"][value="NC"]').should('be.checked');
    cy.get('input[name="payerType"][value="company"]').should('be.checked');
    cy.get('#companyName').should('have.value', 'Example Ltd');
    cy.get('@financeRouter').its('url').should('eq', PAYMENT_DETAILS_URL);
  });
});
