import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_MCI_ROUTING_PATHS } from 'src/app/flows/fines/fines-mci/routing/constants/fines-mci-routing-paths.constant';
import { FINES_ROUTING_PATHS } from 'src/app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FinanceLocators, ManualCashInputLocators as Mci } from '../../../shared/selectors/finance.locators';
import { MANUAL_CASH_INPUT_TILLS_MOCK } from './mocks/manual-cash-input-tills.mock';
import { setupFinancePageComponent } from './setup/SetupComponent';

const MANUAL_CASH_INPUT_JIRA_LABEL = '@JIRA-LABEL:manual-cash-input';
const MANUAL_CASH_INPUT_JIRA_EPIC = '@JIRA-EPIC:PO-2439';
const MANUAL_CASH_INPUT_RELEASE_TAG = '@R1CFinancialMovements';
const UNSAVED_CHANGES_MESSAGE =
  'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.';

type ManualCashInputTillsResponse = {
  tills: ReadonlyArray<{
    till_id: number;
    till_number: number;
    payment_count: number;
    amount: number;
    business_unit_name: string;
    processed_by: string;
    date_processed: string;
  }>;
};

const buildTags = (...tags: string[]): string[] => [
  ...tags,
  '@JIRA-STORY:PO-3475',
  MANUAL_CASH_INPUT_JIRA_LABEL,
  MANUAL_CASH_INPUT_JIRA_EPIC,
  MANUAL_CASH_INPUT_RELEASE_TAG,
];

const assertTrimmedText = (selector: string, expectedText: string): void => {
  cy.get(selector)
    .invoke('text')
    .then((text) => expect(text.trim()).to.equal(expectedText));
};

const openManualCashInput = (
  tills: ManualCashInputTillsResponse = MANUAL_CASH_INPUT_TILLS_MOCK,
  captureBeforeUnloadListener = false,
): void => {
  cy.intercept({ method: 'GET', pathname: '/opal-fines-service/tills' }, tills).as('getManualCashInputTills');
  setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });
  if (captureBeforeUnloadListener) {
    cy.window().then((window) => cy.wrap(cy.stub(window, 'addEventListener').callThrough()).as('addEventListener'));
  }
  cy.get(FinanceLocators.manualCashInputLink).click();
  cy.wait('@getManualCashInputTills').then((interception) => {
    expect(interception.request.query).to.deep.include({
      statuses: ['CREATED', 'FAILED'],
      auto_payments: 'false',
    });
  });
};

describe('Manual Cash Input - Create and allocate tills', () => {
  it(
    '(AC1, AC1a, AC3, AC3a, AC3b) opens Manual Cash Input from Finance and displays eligible manual till data as text',
    { tags: buildTags() },
    () => {
      openManualCashInput();

      cy.contains('h1', 'Manual cash input').should('be.visible');
      cy.get(Mci.backLink).should('have.text', 'Back');
      cy.get(Mci.createTillButton).should('be.visible').and('contain.text', 'Create till');
      cy.get(Mci.allocateButton).should('be.visible').and('contain.text', 'Allocate');
      assertTrimmedText(Mci.selectedCount, '0 of 2 selected');
      cy.get(Mci.table).should('be.visible');
      ['Till number', 'Payments', 'Amount', 'Business unit', 'Created by', 'Date created'].forEach((heading) => {
        cy.contains(Mci.tableHeadings, heading).should('be.visible');
      });
      assertTrimmedText(Mci.tillNumberCell(9001), '9001');
      cy.get(Mci.tillNumberCell(9001)).find('a').should('not.exist');
      assertTrimmedText(Mci.paymentsCell(9001), '3');
      assertTrimmedText(Mci.amountCell(9001), '£125.50');
      assertTrimmedText(Mci.businessUnitCell(9001), 'Camden and Islington');
      assertTrimmedText(Mci.createdByCell(9001), 'Alex Smith');
      assertTrimmedText(Mci.dateCreatedCell(9001), '10 January 2026 at 13:30');
      assertTrimmedText(Mci.tillNumberCell(9002), '9002');
      assertTrimmedText(Mci.paymentsCell(9002), '1');
      assertTrimmedText(Mci.amountCell(9002), '£10.00');
      assertTrimmedText(Mci.businessUnitCell(9002), 'Westminster - North');
      assertTrimmedText(Mci.createdByCell(9002), 'Sam Jones');
      assertTrimmedText(Mci.dateCreatedCell(9002), '09 January 2026 at 09:05');
    },
  );

  it(
    '(AC2) navigates to Select Business Unit (Manual Payments In) when Create till is selected',
    { tags: buildTags() },
    () => {
      openManualCashInput();

      cy.get(Mci.createTillButton).click();
      cy.get('@financeRouter')
        .its('url')
        .should(
          'eq',
          [
            '',
            FINES_ROUTING_PATHS.root,
            FINES_ROUTING_PATHS.children.mci.root,
            FINES_MCI_ROUTING_PATHS.children.create,
            FINES_MCI_ROUTING_PATHS.children.till,
            FINES_MCI_ROUTING_PATHS.children.selectBusinessUnit,
          ].join('/'),
        );
      cy.contains('h1', 'Create till').should('be.visible');
      cy.contains('dt', 'Business unit').should('be.visible');
      cy.contains('dd', 'Camden and Islington').should('be.visible');
    },
  );

  it(
    '(AC3c, AC3d, AC3e) keeps Allocate non-functional and updates the selected-tills count for individual and all selections',
    { tags: buildTags() },
    () => {
      openManualCashInput();

      // AC3c: Allocate is visible but does not trigger a route change or allocation action.
      let allocationRequestMade = false;
      cy.intercept({ method: 'POST', url: '**' }, () => {
        allocationRequestMade = true;
      });
      cy.get(Mci.allocateButton).should('be.visible');
      cy.get(Mci.allocateButton).click();
      cy.get('@financeRouter').its('url').should('contain', FINES_MCI_ROUTING_PATHS.children.createAllocate);
      cy.then(() => expect(allocationRequestMade, 'allocation request').to.be.false);

      // AC3d: the selected-tills count starts at zero and changes as a till is selected or deselected.
      assertTrimmedText(Mci.selectedCount, '0 of 2 selected');

      // AC3e: an individual till can be selected and deselected with its row checkbox.
      cy.get(Mci.tillCheckbox(9001)).check({ force: true });
      assertTrimmedText(Mci.selectedCount, '1 of 2 selected');
      cy.get(Mci.tillCheckbox(9001)).uncheck({ force: true });
      assertTrimmedText(Mci.selectedCount, '0 of 2 selected');

      // AC3e: the Till number header checkbox selects and deselects every till.
      cy.get(Mci.selectAllCheckbox).check({ force: true });
      cy.get(Mci.tillCheckbox(9001)).should('be.checked');
      cy.get(Mci.tillCheckbox(9002)).should('be.checked');
      assertTrimmedText(Mci.selectedCount, '2 of 2 selected');

      // AC3d / AC3e edge case: deselecting one row after select-all keeps the other till selected and updates the count.
      cy.get(Mci.tillCheckbox(9001)).uncheck({ force: true });
      cy.get(Mci.tillCheckbox(9002)).should('be.checked');
      assertTrimmedText(Mci.selectedCount, '1 of 2 selected');

      // The header checkbox is indeterminate (and therefore unchecked) after a partial row selection.
      // Select all again before deselecting all, so both header-checkbox actions are exercised.
      cy.get(Mci.selectAllCheckbox).check({ force: true });
      assertTrimmedText(Mci.selectedCount, '2 of 2 selected');
      cy.get(Mci.selectAllCheckbox).uncheck({ force: true });
      cy.get(Mci.tillCheckbox(9001)).should('not.be.checked');
      cy.get(Mci.tillCheckbox(9002)).should('not.be.checked');
      assertTrimmedText(Mci.selectedCount, '0 of 2 selected');
    },
  );

  it(
    '(AC3, negative) displays a safe error state when the outstanding-tills request fails',
    { tags: buildTags() },
    () => {
      cy.intercept(
        { method: 'GET', pathname: '/opal-fines-service/tills' },
        { statusCode: 500, body: { detail: 'Temporary service failure' } },
      ).as('getManualCashInputTills');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });
      cy.get(FinanceLocators.manualCashInputLink).click();
      cy.wait('@getManualCashInputTills');

      cy.get(Mci.errorMessage).should('have.text', 'There was a problem loading tills. Try again later.');
      cy.get(Mci.table).should('not.exist');
      cy.get(Mci.allocateButton).should('not.exist');
    },
  );

  it(
    '(AC4, AC4a, AC4b) hides Allocate and the table when there are no outstanding tills',
    { tags: buildTags() },
    () => {
      // AC4: no tills meet the allocation criteria.
      openManualCashInput({ tills: [] });

      // AC4b: show the prescribed empty-state text instead of the table.
      cy.contains('There are no outstanding tills to allocate.').should('be.visible');
      cy.get(Mci.table).should('not.exist');
      cy.get(Mci.selectedCount).should('not.exist');

      // AC4a: Allocate is not displayed when there are no tills to allocate.
      cy.get(Mci.allocateButton).should('not.exist');
    },
  );

  it(
    '(AC5) returns to the Finance tab without a data-loss prompt when no tills are selected',
    { tags: buildTags() },
    () => {
      openManualCashInput();
      cy.window().then((window) => cy.wrap(cy.stub(window, 'confirm')).as('leavePageConfirm'));

      cy.get(Mci.backLink).click();

      cy.get('@leavePageConfirm').should('not.have.been.called');
      cy.contains('h1', 'Finance').should('be.visible');
    },
  );

  it(
    '(AC5a, AC5ai, AC5aii, AC6a RGAC1, RGAC1a, RGAC1b) preserves selections when staying and clears them when continuing to Finance',
    { tags: buildTags() },
    () => {
      openManualCashInput();

      // AC5a / AC6a RGAC1: selecting a till means Back must warn that the selection will be lost.
      cy.get(Mci.tillCheckbox(9001)).check({ force: true });
      cy.window().then((window) => {
        const leavePageConfirm = cy.stub(window, 'confirm');
        leavePageConfirm.onFirstCall().returns(false);
        leavePageConfirm.onSecondCall().returns(true);
        cy.wrap(leavePageConfirm).as('leavePageConfirm');
      });

      cy.get(Mci.backLink).click();
      cy.get('@leavePageConfirm').should('have.been.calledWithExactly', UNSAVED_CHANGES_MESSAGE);

      // AC5aii / AC6a RGAC1a: declining the warning retains the user on the page and preserves their selection.
      cy.get(Mci.tillCheckbox(9001)).should('be.checked');
      assertTrimmedText(Mci.selectedCount, '1 of 2 selected');

      cy.get(Mci.backLink).click();
      cy.get('@leavePageConfirm').should('have.been.calledTwice');

      // AC5ai / AC6a RGAC1b: accepting the warning returns the user to Finance and clears the selection.
      cy.contains('h1', 'Finance').should('be.visible');
      cy.get(FinanceLocators.manualCashInputLink).click();
      cy.wait('@getManualCashInputTills');
      cy.get(Mci.tillCheckbox(9001)).should('not.be.checked');
      assertTrimmedText(Mci.selectedCount, '0 of 2 selected');
    },
  );

  it(
    '(AC6a RGAC2, RGAC2a, RGAC3, RGAC3a) warns on browser exit or refresh and retains selected tills',
    { tags: buildTags() },
    () => {
      openManualCashInput(MANUAL_CASH_INPUT_TILLS_MOCK, true);
      cy.get(Mci.tillCheckbox(9001)).check({ force: true });

      // Invoke the registered listener directly: dispatching on window would display Edge's native dialog and pause Cypress.
      cy.get<Cypress.Agent<sinon.SinonStub>>('@addEventListener').then((addEventListener) => {
        const beforeUnloadListener = addEventListener
          .getCalls()
          .map((call) => call.args)
          .filter(([eventName]) => eventName === 'beforeunload')
          .at(-1)?.[1] as EventListener | undefined;

        expect(beforeUnloadListener, 'Manual Cash Input beforeunload listener').to.be.a('function');
        const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });

        beforeUnloadListener!(beforeUnloadEvent);

        expect(beforeUnloadEvent.defaultPrevented).to.be.true;
      });

      // RGAC2a / RGAC3a: cancelling the browser warning leaves the selected till in application memory.
      cy.get(Mci.tillCheckbox(9001)).should('be.checked');
      assertTrimmedText(Mci.selectedCount, '1 of 2 selected');
    },
  );

  it(
    '(AC6b CSAC1, CSAC1a, CSAC2, CSAC3) sorts one column at a time and resets sorting after returning to the screen',
    { tags: buildTags() },
    () => {
      openManualCashInput();

      // CSAC1: every data column exposes a sorting arrow/control.
      ['Till number', 'Payments', 'Amount', 'Business unit', 'Created by', 'Date created'].forEach((heading) => {
        cy.contains(Mci.tableHeadings, heading).find('button').should('be.visible');
      });

      // CSAC1 / CSAC1a: selecting a sorting arrow orders numeric payment counts in ascending order.
      cy.contains(Mci.tableHeadings, 'Payments').find('button').click();
      cy.contains(Mci.tableHeadings, 'Payments').should('have.attr', 'aria-sort', 'ascending');
      cy.get(Mci.paymentsCells).then(($cells) =>
        expect([...$cells].map((cell) => cell.textContent?.trim())).to.deep.equal(['1', '3']),
      );

      // CSAC1a edge case: selecting the same arrow again reverses numeric sorting.
      cy.contains(Mci.tableHeadings, 'Payments').find('button').click();
      cy.contains(Mci.tableHeadings, 'Payments').should('have.attr', 'aria-sort', 'descending');
      cy.get(Mci.paymentsCells).then(($cells) =>
        expect([...$cells].map((cell) => cell.textContent?.trim())).to.deep.equal(['3', '1']),
      );

      // AC3d / AC3e edge case: row identity and selection survive sorting.
      cy.get(Mci.tillCheckbox(9001)).check({ force: true });
      cy.get(Mci.tillCheckbox(9001)).should('be.checked');
      assertTrimmedText(Mci.selectedCount, '1 of 2 selected');

      // CSAC2: choosing another column clears the prior column's sorting state.
      cy.contains(Mci.tableHeadings, 'Business unit').find('button').click();
      cy.contains(Mci.tableHeadings, 'Payments').should('have.attr', 'aria-sort', 'none');
      cy.contains(Mci.tableHeadings, 'Business unit').should('have.attr', 'aria-sort', 'ascending');

      // CSAC3: returning to the screen creates a fresh table with the default, unsorted column state.
      // Clear the selection first: this scenario is validating sort reset, not the leave-page guard.
      cy.get(Mci.tillCheckbox(9001)).uncheck({ force: true });
      assertTrimmedText(Mci.selectedCount, '0 of 2 selected');
      cy.get('@financeRouter')
        .then((router) =>
          (router as { navigate: (commands: string[]) => Promise<boolean> }).navigate([
            '/',
            FINES_ROUTING_PATHS.root,
            FINES_DASHBOARD_ROUTING_PATHS.root,
            FINES_DASHBOARD_ROUTING_PATHS.children.finance,
          ]),
        )
        .should('be.true');
      cy.get(FinanceLocators.manualCashInputLink).click();
      cy.wait('@getManualCashInputTills');
      cy.contains(Mci.tableHeadings, 'Business unit').should('have.attr', 'aria-sort', 'none');
    },
  );
});
