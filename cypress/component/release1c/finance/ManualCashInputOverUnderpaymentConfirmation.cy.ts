import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_MCI_ROUTING_PATHS } from 'src/app/flows/fines/fines-mci/routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from 'src/app/flows/fines/fines-mci/stores/fines-mci.store';
import { FINES_ROUTING_PATHS } from 'src/app/flows/fines/routing/constants/fines-routing-paths.constant';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { ManualCashInputLocators as Mci } from '../../../shared/selectors/finance.locators';
import { setupFinancePageComponent } from './setup/SetupComponent';

const TAGS = ['@JIRA-STORY:PO-3670', '@JIRA-LABEL:manual-cash-input', '@JIRA-EPIC:PO-2439', '@R1CFinancialMovements'];
const COURT_FEES_ENDPOINT = '/opal-fines-service/court-fees';
const COURT_FEES_RESPONSE = {
  court_fees: [{ court_fee_id: 101, court_fee_code: 'CF001', description: 'Application', amount: 12.5 }],
};
const BUSINESS_UNIT = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
const COURT_FEE_DRAFT = { courtFeeId: 101, amountPaid: '30.00', numberOfItems: '2' };
const OVER_UNDERPAYMENT_CONFIRMATION_PATH = 'over-underpayment-confirmation';
const CONFIRMATION_URL = '/fines/manual-cash-input/create/till/over-underpayment-confirmation';
type CourtFeeDraftStoreAccess = {
  setCourtFeeDraft: (draft: typeof COURT_FEE_DRAFT | null) => void;
  courtFeeDraft: () => typeof COURT_FEE_DRAFT | null;
};
const UNSAVED_CHANGES_WARNING =
  'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.';
const COURT_FEE_DETAILS_ROUTE = [
  '/',
  FINES_ROUTING_PATHS.root,
  FINES_MCI_ROUTING_PATHS.root,
  FINES_MCI_ROUTING_PATHS.children.create,
  FINES_MCI_ROUTING_PATHS.children.till,
  FINES_MCI_ROUTING_PATHS.children.courtFeeDetails,
];
const CONFIRMATION_ROUTE = [
  '/',
  FINES_ROUTING_PATHS.root,
  FINES_MCI_ROUTING_PATHS.root,
  FINES_MCI_ROUTING_PATHS.children.create,
  FINES_MCI_ROUTING_PATHS.children.till,
  OVER_UNDERPAYMENT_CONFIRMATION_PATH,
];

const openOverpaymentConfirmation = (): void => {
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
    const finesMciStore = store as InstanceType<typeof FinesMciStore> & CourtFeeDraftStoreAccess;

    finesMciStore.setBusinessUnit(BUSINESS_UNIT);
    finesMciStore.setDraftJourney('courtFee');
    finesMciStore.setCourtFeeDraft(COURT_FEE_DRAFT);
  });
  cy.get('@financeRouter')
    .then((router) => (router as { navigate: (commands: string[]) => Promise<boolean> }).navigate(CONFIRMATION_ROUTE))
    .should('be.true');
  cy.wait('@courtFees').its('response.statusCode').should('eq', 200);
  cy.get(Mci.courtFeeOverUnderpaymentPage).should('be.visible');
};

const assertCourtFeeDraftIsPreserved = (): void => {
  cy.get('@finesMciStore').then((store) => {
    const finesMciStore = store as InstanceType<typeof FinesMciStore> & CourtFeeDraftStoreAccess;

    expect(finesMciStore.courtFeeDraft()).to.deep.equal(COURT_FEE_DRAFT);
  });
};

describe('Manual Cash Input - Overpayment/Underpayment Confirmation RGACs', () => {
  it(
    '(AC7a RGAC1) warns before a route change and retains the court fee draft if leaving is declined',
    { tags: TAGS },
    () => {
      openOverpaymentConfirmation();
      cy.window().then((window) => cy.wrap(cy.stub(window, 'confirm').returns(false)).as('leavePageConfirm'));

      cy.get('@financeRouter')
        .then((router) =>
          (router as { navigate: (commands: string[]) => Promise<boolean> }).navigate(COURT_FEE_DETAILS_ROUTE),
        )
        .should('be.false');
      cy.get('@leavePageConfirm')
        .should('have.been.calledOnce')
        .and('have.been.calledWithExactly', UNSAVED_CHANGES_WARNING);
      cy.get('@financeRouter').its('url').should('eq', CONFIRMATION_URL);
      cy.get(Mci.courtFeeOverUnderpaymentPage).should('be.visible');
      assertCourtFeeDraftIsPreserved();
    },
  );

  it('(AC7a RGAC2) warns before browser exit and retains the court fee draft', { tags: TAGS }, () => {
    openOverpaymentConfirmation();

    cy.window().then((window) => {
      const browserExitEvent = new Event('beforeunload', { cancelable: true });

      expect(window.dispatchEvent(browserExitEvent), 'browser-exit warning').to.be.false;
      expect(browserExitEvent.defaultPrevented, 'browser exit is prevented').to.be.true;
    });
    assertCourtFeeDraftIsPreserved();
  });

  it('(AC7a RGAC3) warns before refresh and retains the court fee draft', { tags: TAGS }, () => {
    openOverpaymentConfirmation();

    cy.window().then((window) => {
      const refreshEvent = new Event('beforeunload', { cancelable: true });

      expect(window.dispatchEvent(refreshEvent), 'refresh warning').to.be.false;
      expect(refreshEvent.defaultPrevented, 'refresh is prevented').to.be.true;
    });
    assertCourtFeeDraftIsPreserved();
  });
});
