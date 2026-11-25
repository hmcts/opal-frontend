import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_MCI_ROUTING_PATHS } from 'src/app/flows/fines/fines-mci/routing/constants/fines-mci-routing-paths.constant';
import { IFinesMciCourtFeePayment } from 'src/app/flows/fines/fines-mci/stores/interfaces/fines-mci-court-fee-payment.interface';
import { FinesMciStore } from 'src/app/flows/fines/fines-mci/stores/fines-mci.store';
import { FINES_ROUTING_PATHS } from 'src/app/flows/fines/routing/constants/fines-routing-paths.constant';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { ManualCashInputLocators as Mci } from '../../../shared/selectors/finance.locators';
import { setupFinancePageComponent } from './setup/SetupComponent';

const TAGS = ['@JIRA-STORY:PO-3672', '@JIRA-LABEL:manual-cash-input', '@JIRA-EPIC:PO-2439', '@R1CFinancialMovements'];
const BUSINESS_UNIT = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
const COURT_FEES_ENDPOINT = '/opal-fines-service/court-fees';
const COURT_FEES_RESPONSE = {
  court_fees: [{ court_fee_id: 101, court_fee_code: 'CF001', description: 'Application', amount: 12.5 }],
};
const CHECK_COURT_FEE_ROUTE = [
  '/',
  FINES_ROUTING_PATHS.root,
  FINES_MCI_ROUTING_PATHS.root,
  FINES_MCI_ROUTING_PATHS.children.create,
  FINES_MCI_ROUTING_PATHS.children.till,
  FINES_MCI_ROUTING_PATHS.children.checkCourtFee,
];
const CHECK_COURT_FEE_URL = '/fines/manual-cash-input/create/till/check-court-fee';
const COURT_FEE_DETAILS_URL = '/fines/manual-cash-input/create/till/court-fee-details';
const PAYMENT_DETAILS_URL = '/fines/manual-cash-input/create/till/court-fee-payment-details';
const PAYMENT_CATEGORY_URL = '/fines/manual-cash-input/create/till/payment-category';
const TILL_DETAILS_URL = '/fines/manual-cash-input/create/till/details';
const LEAVE_WARNING = 'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.';

type CheckScreenOptions = {
  amountPaid?: string;
  paymentMethod?: 'NC' | 'CT';
  suspenseNote?: string;
  existingPayment?: boolean;
};

const openCheckCourtFee = (options: CheckScreenOptions = {}): void => {
  const paymentMethod = options.paymentMethod ?? 'CT';

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
    const finesMciStore = store as InstanceType<typeof FinesMciStore>;

    finesMciStore.setBusinessUnit(BUSINESS_UNIT);
    const tillId = finesMciStore.ensureTill();
    finesMciStore.setDraftJourney('courtFee');
    finesMciStore.setCourtFeeDraft({
      courtFeeId: 101,
      amountPaid: options.amountPaid ?? '30.00',
      numberOfItems: '2',
    });
    finesMciStore.setCourtFeePaymentDetails({
      paymentReceivedFrom: 'thirdParty',
      paymentMethod,
      ...(paymentMethod === 'CT' && { paymentSource: 'ALLPAY' }),
      paymentReference: 'REF-100',
      payerType: 'individual',
      title: 'Ms',
      firstNames: 'Alex',
      lastName: 'Smith',
      addressLine1: '12 Example Street',
      addressLine2: null,
      addressLine3: 'London',
      postcode: 'SW1A 1AA',
    });
    finesMciStore.setCourtFeeSuspenseNote(options.suspenseNote ?? '');

    if (options.existingPayment) {
      const savedPayment: IFinesMciCourtFeePayment = {
        courtFeeId: 101,
        amountPaid: '25.00',
        numberOfItems: '2',
        courtFeeLabel: 'CF001 – Application (£12.50)',
        amountLabel: '£25.00',
        paymentDetails: {
          paymentReceivedFrom: 'applicant',
          paymentMethod: 'NC',
          payerType: 'company',
          companyName: 'Existing Ltd',
        },
        suspenseNote: 'Original note',
      };
      finesMciStore.saveCourtFeePayment(tillId, savedPayment);
      const paymentId = finesMciStore.tills()[0].payments[0].paymentId;

      finesMciStore.beginCourtFeePaymentEdit(tillId, paymentId);
      finesMciStore.setCourtFeeDraft({ courtFeeId: 101, amountPaid: '30.00', numberOfItems: '2' });
    }
  });
  cy.get('@financeRouter')
    .then((router) =>
      (router as { navigate: (commands: string[]) => Promise<boolean> }).navigate(CHECK_COURT_FEE_ROUTE),
    )
    .should('be.true');
};

describe('Manual Cash Input - Check Court Fee', () => {
  it('(AC1a, AC2, AC3, AC4) displays the overpayment and all payment details with Change links', { tags: TAGS }, () => {
    openCheckCourtFee();

    cy.get('@financeRouter').its('url').should('eq', CHECK_COURT_FEE_URL);
    cy.contains('h1', 'Check payment').should('be.visible');
    cy.get('.govuk-caption-l').should('contain.text', BUSINESS_UNIT.business_unit_name);
    cy.get(Mci.checkCourtFeeOverpaymentBanner).should('contain.text', '£5.00 overpayment');
    cy.get(Mci.checkCourtFeeSummaryRowValue('court-fee')).should('contain.text', 'CF001 – Application (£12.50)');
    cy.get(Mci.checkCourtFeeSummaryRowValue('amount')).should('contain.text', '£30.00');
    cy.get(Mci.checkCourtFeeSummaryRowValue('number-of-items')).should('contain.text', '2');
    cy.get(Mci.checkCourtFeeSummaryRowValue('payment-received-from')).should('contain.text', 'Third party');
    cy.get(Mci.checkCourtFeeSummaryRowValue('payment-method')).should('contain.text', 'Credit transfer');
    cy.get(Mci.checkCourtFeeSummaryRowValue('source')).should('contain.text', 'allpay');
    cy.get(Mci.checkCourtFeeSummaryRowValue('payment-reference')).should('contain.text', 'REF-100');
    cy.get(Mci.checkCourtFeeSummaryRowValue('payer-type')).should('contain.text', 'Individual');
    cy.get(Mci.checkCourtFeeSummaryRowValue('payer-name')).should('contain.text', 'Ms Alex Smith');
    cy.get(Mci.checkCourtFeeSummaryRowValue('address')).should('contain.text', '12 Example Street, London, SW1A 1AA');
    cy.get(Mci.checkCourtFeeSummaryRowActions('court-fee')).find('a').should('contain.text', 'Change Court fee');
    cy.get(Mci.checkCourtFeeSummaryRowActions('address')).find('a').should('contain.text', 'Change Address');
    cy.get(Mci.suspenseNote).should('have.attr', 'maxlength', '1000');
    cy.get('.govuk-character-count__message.govuk-character-count__status').should(
      'contain.text',
      '1000 characters remaining',
    );
  });

  it('(AC5) requires a suspense note for either save action', { tags: TAGS }, () => {
    openCheckCourtFee();

    cy.get(Mci.saveAndReviewTill).click();

    cy.get('.govuk-error-summary').should('contain.text', 'Enter a suspense note');
    cy.get(Mci.suspenseNoteError).should('contain.text', 'Enter a suspense note');
    cy.get('@financeRouter').its('url').should('eq', CHECK_COURT_FEE_URL);

    cy.get(Mci.saveAndAddAnotherPayment).click();

    cy.get('.govuk-error-summary').should('contain.text', 'Enter a suspense note');
    cy.get(Mci.suspenseNoteError).should('contain.text', 'Enter a suspense note');
    cy.get('@financeRouter').its('url').should('eq', CHECK_COURT_FEE_URL);
  });

  [
    { button: Mci.saveAndReviewTill, destination: TILL_DETAILS_URL },
    { button: Mci.saveAndAddAnotherPayment, destination: PAYMENT_CATEGORY_URL },
  ].forEach(({ button, destination }) => {
    it(`(AC6, AC7) saves the payment and navigates to ${destination}`, { tags: TAGS }, () => {
      openCheckCourtFee();
      cy.get(Mci.suspenseNote).type('Court fee payment note');

      cy.get(button).click();

      cy.get('@financeRouter').its('url').should('eq', destination);
      cy.get('@finesMciStore').should((store) => {
        const finesMciStore = store as InstanceType<typeof FinesMciStore>;
        const payments = finesMciStore.tills()[0].payments;

        expect(payments).to.have.length(1);
        expect(payments[0].courtFee).to.include({
          amountPaid: '30.00',
          numberOfItems: '2',
          suspenseNote: 'Court fee payment note',
        });
      });
    });
  });

  it('(AC7) updates the selected court fee payment instead of adding a duplicate', { tags: TAGS }, () => {
    openCheckCourtFee({ existingPayment: true });
    cy.get(Mci.suspenseNote).clear().type('Updated suspense note');

    cy.get(Mci.saveAndReviewTill).click();

    cy.get('@financeRouter').its('url').should('eq', TILL_DETAILS_URL);
    cy.get('@finesMciStore').should((store) => {
      const payments = (store as InstanceType<typeof FinesMciStore>).tills()[0].payments;

      expect(payments).to.have.length(1);
      expect(payments[0].courtFee).to.include({
        amountPaid: '30.00',
        suspenseNote: 'Updated suspense note',
      });
    });
  });

  it('(AC4a) Change for a court fee row returns to Court Fee Details', { tags: TAGS }, () => {
    openCheckCourtFee();

    cy.get(Mci.checkCourtFeeSummaryRowActions('number-of-items')).find('a').click();

    cy.get('@courtFees').its('response.statusCode').should('eq', 200);
    cy.get('@financeRouter').its('url').should('eq', COURT_FEE_DETAILS_URL);
    cy.get(Mci.courtFeeDetailsPage).should('be.visible');
  });

  it('(AC4b) Change for a payment row returns to Payment Details', { tags: TAGS }, () => {
    openCheckCourtFee();

    cy.get(Mci.checkCourtFeeSummaryRowActions('payment-method')).find('a').click();

    cy.get('@financeRouter').its('url').should('eq', PAYMENT_DETAILS_URL);
    cy.get(Mci.courtFeePaymentDetailsBusinessUnit).should('contain.text', BUSINESS_UNIT.business_unit_name);
  });

  it('(AC8, AC8a) Cancel retains the draft when declined and discards it when confirmed', { tags: TAGS }, () => {
    openCheckCourtFee({ suspenseNote: 'Retain this note' });
    cy.window().then((window) => {
      const confirm = cy.stub(window, 'confirm');

      confirm.onFirstCall().returns(false);
      confirm.onSecondCall().returns(true);
      cy.wrap(confirm).as('leavePageConfirm');
    });

    cy.get(Mci.cancelLink).click();

    cy.get('@leavePageConfirm').should('have.been.calledOnce').and('have.been.calledWithExactly', LEAVE_WARNING);
    cy.get('@financeRouter').its('url').should('eq', CHECK_COURT_FEE_URL);
    cy.get(Mci.suspenseNote).should('have.value', 'Retain this note');
    cy.get('@finesMciStore').should((store) => {
      expect((store as InstanceType<typeof FinesMciStore>).courtFeeDraft()).not.to.be.null;
    });

    cy.get(Mci.cancelLink).click();

    cy.get('@leavePageConfirm').should('have.been.calledTwice');
    cy.get('@financeRouter').its('url').should('eq', TILL_DETAILS_URL);
    cy.get('@finesMciStore').should((store) => {
      const finesMciStore = store as InstanceType<typeof FinesMciStore>;

      expect(finesMciStore.draftJourney()).to.be.null;
      expect(finesMciStore.courtFeeDraft()).to.be.null;
      expect(finesMciStore.courtFeePaymentDetails()).to.be.null;
      expect(finesMciStore.courtFeeSuspenseNote()).to.equal('');
      expect(finesMciStore.tills()[0].payments).to.be.empty;
    });
  });
});
