import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_MCI_ROUTING_PATHS } from 'src/app/flows/fines/fines-mci/routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from 'src/app/flows/fines/fines-mci/stores/fines-mci.store';
import { FINES_ROUTING_PATHS } from 'src/app/flows/fines/routing/constants/fines-routing-paths.constant';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IOpalFinesBusinessUnit } from 'src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { ManualCashInputLocators as Mci } from '../../../shared/selectors/finance.locators';
import { setupFinancePageComponent } from './setup/SetupComponent';

const TAGS = ['@JIRA-STORY:PO-3486', '@JIRA-LABEL:manual-cash-input', '@JIRA-EPIC:PO-2439', '@R1CFinancialMovements'];
const UNSAVED_CHANGES_MESSAGE =
  'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.';
const PAYMENT_CATEGORIES = [
  { label: 'Criminal', value: 'criminal' },
  { label: 'Court fee', value: 'courtFee' },
  { label: 'Suspense', value: 'suspense' },
] as const;
const openPaymentCategory = (businessUnit?: IOpalFinesBusinessUnit): void => {
  setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

  if (businessUnit) {
    cy.get('@finesMciStore').then((store) => {
      (store as InstanceType<typeof FinesMciStore>).setBusinessUnit(businessUnit);
    });
  }

  cy.get('@financeRouter')
    .then((router) =>
      (router as { navigate: (commands: string[]) => Promise<boolean> }).navigate([
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.children.create,
        FINES_MCI_ROUTING_PATHS.children.till,
        FINES_MCI_ROUTING_PATHS.children.paymentCategory,
      ]),
    )
    .should('be.true');
};

describe('Manual Cash Input - Payment Category', () => {
  it('(AC2) displays the Payment Category screen and its actions', { tags: TAGS }, () => {
    openPaymentCategory();

    cy.get(Mci.paymentCategoryPage).should('be.visible');
    cy.get(Mci.paymentCategoryHeading).should('have.text', 'Payment category');
    cy.get(Mci.paymentCategoryForm).within(() => {
      cy.get(Mci.continueButton).should('be.visible').and('have.text', 'Continue');
      cy.get(Mci.cancelLink).should('be.visible').and('have.text', 'Cancel');
    });
  });

  it('(AC2a) displays the business unit selected earlier in the journey', { tags: TAGS }, () => {
    const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];

    openPaymentCategory(businessUnit);

    cy.get(Mci.paymentCategoryBusinessUnit).should('have.text', businessUnit.business_unit_name);
  });

  it('(AC3) lets a user select one payment category', { tags: TAGS }, () => {
    openPaymentCategory();

    cy.get(Mci.paymentCategoryForm).within(() => {
      PAYMENT_CATEGORIES.forEach(({ label, value }) => {
        cy.contains('label', label).should('be.visible');
        cy.get(Mci.paymentCategoryRadio(value)).should('not.be.checked').check({ force: true }).should('be.checked');
      });

      cy.get(Mci.paymentCategoryRadio('criminal')).should('not.be.checked');
      cy.get(Mci.paymentCategoryRadio('courtFee')).should('not.be.checked');
      cy.get(Mci.paymentCategoryRadio('suspense')).should('be.checked');
    });
  });

  it('(AC7 RGAC1) warns before leaving after a category is selected', { tags: TAGS }, () => {
    openPaymentCategory();
    cy.get(Mci.paymentCategoryRadio('criminal')).check({ force: true });
    cy.window().then((window) => {
      const confirm = cy.stub(window, 'confirm');

      confirm.onFirstCall().returns(false);
      confirm.onSecondCall().returns(true);
      cy.wrap(confirm).as('leavePageConfirm');
    });

    const financeRoute = [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.finance,
    ];

    cy.get('@financeRouter')
      .then((router) => (router as { navigate: (commands: string[]) => Promise<boolean> }).navigate(financeRoute))
      .should('be.false');
    cy.get('@leavePageConfirm')
      .should('have.been.calledOnce')
      .and('have.been.calledWithExactly', UNSAVED_CHANGES_MESSAGE);
    cy.get(Mci.paymentCategoryPage).should('be.visible');

    cy.get('@financeRouter')
      .then((router) => (router as { navigate: (commands: string[]) => Promise<boolean> }).navigate(financeRoute))
      .should('be.true');
    cy.get('@leavePageConfirm').should('have.been.calledTwice');
    cy.contains('h1', 'Finance').should('be.visible');
  });

  it('(AC7 RGAC2, RGAC3) warns before browser exit or refresh with a category selected', { tags: TAGS }, () => {
    openPaymentCategory();
    cy.get(Mci.paymentCategoryRadio('criminal')).check({ force: true });

    cy.window().then((window) => {
      const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });

      expect(window.dispatchEvent(beforeUnloadEvent), 'beforeunload event dispatch').to.be.false;
      expect(beforeUnloadEvent.defaultPrevented, 'beforeunload warning').to.be.true;
    });
    cy.get(Mci.paymentCategoryRadio('criminal')).should('be.checked');
  });
});
