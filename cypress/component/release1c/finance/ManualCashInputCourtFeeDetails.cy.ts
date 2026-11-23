import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_MCI_ROUTING_PATHS } from 'src/app/flows/fines/fines-mci/routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from 'src/app/flows/fines/fines-mci/stores/fines-mci.store';
import { FINES_ROUTING_PATHS } from 'src/app/flows/fines/routing/constants/fines-routing-paths.constant';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IOpalFinesBusinessUnit } from 'src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { ManualCashInputLocators as Mci } from '../../../shared/selectors/finance.locators';
import { setupFinancePageComponent } from './setup/SetupComponent';

const TAGS = ['@JIRA-STORY:PO-3669', '@JIRA-LABEL:manual-cash-input', '@JIRA-EPIC:PO-2439', '@R1CFinancialMovements'];
const COURT_FEES_ENDPOINT = '/opal-fines-service/court-fees';
const COURT_FEES_RESPONSE = {
  court_fees: [
    { court_fee_id: 101, court_fee_code: 'CF001', description: 'Application', amount: 12.5 },
    { court_fee_id: 102, court_fee_code: 'CF002', description: 'Issue', amount: 0.1 },
  ],
};
const COURT_FEE_OPTION = 'CF001 - Application (£12.50)';
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
const COURT_FEE_DETAILS_URL = '/fines/manual-cash-input/create/till/court-fee-details';
const TILL_DETAILS_URL = '/fines/manual-cash-input/create/till/details';
const TILL_DETAILS_ROUTE = [
  '/',
  FINES_ROUTING_PATHS.root,
  FINES_MCI_ROUTING_PATHS.root,
  FINES_MCI_ROUTING_PATHS.children.create,
  FINES_MCI_ROUTING_PATHS.children.till,
  FINES_MCI_ROUTING_PATHS.children.details,
];

const navigateToCourtFeeDetails = (): void => {
  cy.get('@financeRouter')
    .then((router) =>
      (router as { navigate: (commands: string[]) => Promise<boolean> }).navigate(COURT_FEE_DETAILS_ROUTE),
    )
    .should('be.true');
  cy.wait('@courtFees').its('response.statusCode').should('eq', 200);
};

const openCourtFeeDetails = (businessUnit: IOpalFinesBusinessUnit): void => {
  cy.intercept(
    {
      method: 'GET',
      pathname: COURT_FEES_ENDPOINT,
      query: { business_unit_id: String(businessUnit.business_unit_id) },
    },
    COURT_FEES_RESPONSE,
  ).as('courtFees');

  setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });
  cy.get('@finesMciStore').then((store) => {
    (store as InstanceType<typeof FinesMciStore>).setBusinessUnit(businessUnit);
  });
  navigateToCourtFeeDetails();
};

const selectCourtFee = (): void => {
  cy.get(Mci.courtFeeCodeInput).type('CF001');
  cy.get(Mci.courtFeeCodeSuggestions).contains('li', COURT_FEE_OPTION).click();
};

const selectCourtFeeAndEnterAmount = (): void => {
  selectCourtFee();
  cy.get(Mci.courtFeeAmountInput).type('12.50');
};

const selectCourtFeeAndEnterNumberOfItems = (): void => {
  selectCourtFee();
  cy.get(Mci.courtFeeNumberOfItemsInput).type('1');
};

const assertRouterUrl = (url: string): void => {
  cy.get('@financeRouter').its('url').should('eq', url);
};

describe('Manual Cash Input - Court Fee Details', () => {
  it('(AC1a, AC1b) displays the Court Fee Details page for the selected business unit', { tags: TAGS }, () => {
    const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];

    openCourtFeeDetails(businessUnit);

    assertRouterUrl(COURT_FEE_DETAILS_URL);
    cy.get(Mci.courtFeeDetailsPage).should('be.visible');
    cy.get(Mci.courtFeeDetailsHeading).should('have.text', 'Court fee');
    cy.get(Mci.courtFeeBusinessUnitCaption).should('have.text', businessUnit.business_unit_name);
    cy.get(Mci.courtFeeCodeLabel).should('contain.text', 'Court fee');
    cy.get(Mci.courtFeeCodeHint).should(($hint) => {
      expect($hint.text().trim()).to.eq('Search using court fee code or description');
    });
    cy.get(Mci.courtFeeCodeInput).should('be.visible');
    cy.get(Mci.courtFeeAmountLabel).should('contain.text', 'Amount');
    cy.get(Mci.courtFeeAmountInput).should('be.visible');
    cy.get(Mci.courtFeeNumberOfItemsLabel).should('contain.text', 'Number of items');
    cy.get(Mci.courtFeeNumberOfItemsInput).should('be.visible');
    cy.get(Mci.continueButton).should('be.visible').and('have.text', 'Continue');
    cy.get(Mci.cancelLink).should('be.visible').and('contain.text', 'Cancel');
  });

  it('filters court fees by a substring of the description', { tags: TAGS }, () => {
    openCourtFeeDetails(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);

    cy.get(Mci.courtFeeCodeInput).type('ppli');
    cy.get(Mci.courtFeeCodeSuggestions).contains('li', COURT_FEE_OPTION).should('be.visible');
  });

  it('(AC2) requires a court fee selection when Continue is selected', { tags: TAGS }, () => {
    openCourtFeeDetails(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);

    cy.get(Mci.continueButton).click();

    cy.get(Mci.courtFeeCodeErrorMessage).should('contain.text', 'Enter court fee code');
    assertRouterUrl(COURT_FEE_DETAILS_URL);
  });

  it('(AC2a) rejects a court fee value that was not selected from the suggestions', { tags: TAGS }, () => {
    openCourtFeeDetails(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);

    cy.get(Mci.courtFeeCodeInput).type('NOT_A_FEE');
    cy.get(Mci.courtFeeCodeSuggestions).should('contain.text', 'No results found');
    cy.get(Mci.courtFeeDetailsHeading).click();
    cy.get(Mci.continueButton).click();

    cy.get(Mci.courtFeeCodeErrorMessage).should('contain.text', 'Enter a valid court fee');
    cy.get(Mci.courtFeeAmountErrorMessage).should('contain.text', 'Enter an amount');
    cy.get(Mci.courtFeeNumberOfItemsErrorMessage).should('contain.text', 'Enter number of items');
    assertRouterUrl(COURT_FEE_DETAILS_URL);
  });

  it('(AC3) requires an amount when a court fee and item count are entered', { tags: TAGS }, () => {
    openCourtFeeDetails(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    selectCourtFeeAndEnterNumberOfItems();

    cy.get(Mci.continueButton).click();

    cy.get(Mci.courtFeeAmountErrorMessage).should('contain.text', 'Enter an amount');
    assertRouterUrl(COURT_FEE_DETAILS_URL);
  });

  it('(AC3a) rejects non-numeric amount characters', { tags: TAGS }, () => {
    openCourtFeeDetails(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    selectCourtFeeAndEnterNumberOfItems();
    cy.get(Mci.courtFeeAmountInput).type('12x');

    cy.get(Mci.continueButton).click();

    cy.get(Mci.courtFeeAmountErrorMessage).should('contain.text', 'Enter numbers only');
    assertRouterUrl(COURT_FEE_DETAILS_URL);
  });

  it('(AC4) requires a number of items when a court fee and amount are entered', { tags: TAGS }, () => {
    openCourtFeeDetails(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    selectCourtFeeAndEnterAmount();

    cy.get(Mci.continueButton).click();

    cy.get(Mci.courtFeeNumberOfItemsErrorMessage).should('contain.text', 'Enter number of items');
    assertRouterUrl(COURT_FEE_DETAILS_URL);
  });

  ['two', '1.5'].forEach((numberOfItems) => {
    it(`(AC4a) rejects non-integer number of items: ${numberOfItems}`, { tags: TAGS }, () => {
      openCourtFeeDetails(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
      selectCourtFeeAndEnterAmount();
      cy.get(Mci.courtFeeNumberOfItemsInput).type(numberOfItems);

      cy.get(Mci.continueButton).click();

      cy.get(Mci.courtFeeNumberOfItemsErrorMessage).should('contain.text', 'Enter numbers only');
      assertRouterUrl(COURT_FEE_DETAILS_URL);
    });
  });

  it('(AC6) cancels a blank Court Fee Details form without a warning', { tags: TAGS }, () => {
    openCourtFeeDetails(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    cy.window().then((window) => cy.wrap(cy.stub(window, 'confirm')).as('leavePageConfirm'));

    cy.get(Mci.cancelLink).click();

    assertRouterUrl(TILL_DETAILS_URL);
    cy.get('@leavePageConfirm').should('not.have.been.called');
  });

  it(
    '(AC6a, AC6ai, AC6aii) retains data when Cancel is declined and discards it when confirmed',
    { tags: TAGS },
    () => {
      openCourtFeeDetails(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
      selectCourtFeeAndEnterNumberOfItems();
      cy.get(Mci.courtFeeAmountInput).type('12.50');
      cy.window().then((window) => {
        const confirm = cy.stub(window, 'confirm');

        confirm.onFirstCall().returns(false);
        confirm.onSecondCall().returns(true);
        cy.wrap(confirm).as('leavePageConfirm');
      });

      cy.get(Mci.cancelLink).click();
      cy.get('@leavePageConfirm')
        .should('have.been.calledOnce')
        .and('have.been.calledWithExactly', UNSAVED_CHANGES_WARNING);
      assertRouterUrl(COURT_FEE_DETAILS_URL);
      cy.get(Mci.courtFeeCodeInput).should('have.value', COURT_FEE_OPTION);
      cy.get(Mci.courtFeeAmountInput).should('have.value', '12.50');
      cy.get(Mci.courtFeeNumberOfItemsInput).should('have.value', '1');

      cy.get(Mci.cancelLink).click();
      cy.get('@leavePageConfirm').should('have.been.calledTwice');
      assertRouterUrl(TILL_DETAILS_URL);

      navigateToCourtFeeDetails();
      cy.get(Mci.courtFeeCodeInput).should('have.value', '');
      cy.get(Mci.courtFeeAmountInput).should('have.value', '');
      cy.get(Mci.courtFeeNumberOfItemsInput).should('have.value', '');
    },
  );

  it('(AC7a EMAC1) shows linked field errors in the error summary', { tags: TAGS }, () => {
    openCourtFeeDetails(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);

    cy.get(Mci.continueButton).click();

    cy.get(Mci.courtFeeErrorSummaryTitle).should('have.text', 'There is a problem');
    [
      [Mci.courtFeeCodeInput, 'Enter court fee code'],
      [Mci.courtFeeAmountInput, 'Enter an amount'],
      [Mci.courtFeeNumberOfItemsInput, 'Enter number of items'],
    ].forEach(([field, message]) => {
      cy.get(Mci.errorSummary).contains('a', message).click();
      cy.focused().should('have.id', field.slice(1));
    });
  });

  it('(AC7b RGAC1) warns before route changes and retains data if leaving is declined', { tags: TAGS }, () => {
    openCourtFeeDetails(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    selectCourtFeeAndEnterNumberOfItems();
    cy.get(Mci.courtFeeAmountInput).type('12.50');
    cy.window().then((window) => {
      const confirm = cy.stub(window, 'confirm');

      confirm.onFirstCall().returns(false);
      confirm.onSecondCall().returns(true);
      cy.wrap(confirm).as('leavePageConfirm');
    });

    cy.get('@financeRouter')
      .then((router) => (router as { navigate: (commands: string[]) => Promise<boolean> }).navigate(TILL_DETAILS_ROUTE))
      .should('be.false');
    cy.get('@leavePageConfirm')
      .should('have.been.calledOnce')
      .and('have.been.calledWithExactly', UNSAVED_CHANGES_WARNING);
    cy.get(Mci.courtFeeCodeInput).should('have.value', COURT_FEE_OPTION);
    cy.get(Mci.courtFeeAmountInput).should('have.value', '12.50');
    cy.get(Mci.courtFeeNumberOfItemsInput).should('have.value', '1');

    cy.get('@financeRouter')
      .then((router) => (router as { navigate: (commands: string[]) => Promise<boolean> }).navigate(TILL_DETAILS_ROUTE))
      .should('be.true');
    cy.get('@leavePageConfirm').should('have.been.calledTwice');
    assertRouterUrl(TILL_DETAILS_URL);
  });

  it('(AC7b RGAC2, RGAC3) warns before browser exit or refresh and retains the entered values', { tags: TAGS }, () => {
    openCourtFeeDetails(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    selectCourtFeeAndEnterNumberOfItems();
    cy.get(Mci.courtFeeAmountInput).type('12.50');

    cy.window().then((window) => {
      const browserExitEvent = new Event('beforeunload', { cancelable: true });
      const refreshEvent = new Event('beforeunload', { cancelable: true });

      expect(window.dispatchEvent(browserExitEvent), 'browser-exit warning').to.be.false;
      expect(browserExitEvent.defaultPrevented, 'browser exit is prevented').to.be.true;
      expect(window.dispatchEvent(refreshEvent), 'refresh warning').to.be.false;
      expect(refreshEvent.defaultPrevented, 'refresh is prevented').to.be.true;
    });

    cy.get(Mci.courtFeeCodeInput).should('have.value', COURT_FEE_OPTION);
    cy.get(Mci.courtFeeAmountInput).should('have.value', '12.50');
    cy.get(Mci.courtFeeNumberOfItemsInput).should('have.value', '1');
  });

  it('(AC8) checks the Court Fee Details page and validation state with axe', { tags: TAGS }, () => {
    openCourtFeeDetails(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    cy.document().then((document) => {
      document.documentElement.lang = 'en';
    });
    cy.injectAxe({ axeCorePath: 'node_modules/axe-core/axe.min.js' });
    cy.checkA11y(Mci.courtFeeDetailsPage, {
      includedImpacts: ['critical', 'serious', 'moderate'],
    });

    cy.get(Mci.continueButton).click();
    cy.checkA11y(Mci.courtFeeDetailsPage, {
      includedImpacts: ['critical', 'serious', 'moderate'],
    });
  });
});
