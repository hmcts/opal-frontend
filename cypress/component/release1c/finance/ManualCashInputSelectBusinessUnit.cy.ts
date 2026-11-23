import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_MCI_ROUTING_PATHS } from 'src/app/flows/fines/fines-mci/routing/constants/fines-mci-routing-paths.constant';
import { FINES_ROUTING_PATHS } from 'src/app/flows/fines/routing/constants/fines-routing-paths.constant';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { FinanceLocators, ManualCashInputLocators as Mci } from '../../../shared/selectors/finance.locators';
import { setupFinancePageComponent } from './setup/SetupComponent';

const TAGS = ['@JIRA-STORY:PO-3476', '@JIRA-LABEL:manual-cash-input', '@JIRA-EPIC:PO-2439', '@R1CFinancialMovements'];
const TILLS_ENDPOINT = '/opal-fines-service/tills';
const UNSAVED_CHANGES_MESSAGE =
  'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.';

const BUSINESS_UNITS = {
  count: 3,
  refData: [
    {
      ...OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0],
      business_unit_id: 3,
      business_unit_name: 'Westminster - North',
    },
    { ...OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[1], business_unit_id: 1, business_unit_name: 'Alpha Court' },
    {
      ...OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[2],
      business_unit_id: 2,
      business_unit_name: 'Camden and Islington',
    },
  ],
};

const openSelectBusinessUnit = (businessUnits = BUSINESS_UNITS): void => {
  cy.intercept({ method: 'GET', pathname: TILLS_ENDPOINT }, { tills: [] }).as('getManualCashInputTills');
  setupFinancePageComponent({
    dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance,
    businessUnits,
  });
  cy.get(FinanceLocators.manualCashInputLink).click();
  cy.wait('@getManualCashInputTills');
  cy.get(Mci.createTillButton).click();
  cy.get(Mci.selectBusinessUnitHeading).should('have.text', 'Create till');
};

const selectBusinessUnit = (name: string): void => {
  cy.get(Mci.businessUnitInput).click();
  cy.get(Mci.businessUnitAutocomplete).contains('li', name).click();
};

describe('Manual Cash Input - Select Business Unit', () => {
  it(
    '(AC1, AC1a, AC2 and AC2a) navigates from Manual Cash Input and displays permitted business units alphabetically',
    { tags: TAGS },
    () => {
      // AC1: Create till opens Select a Business Unit (Manual Cash Input).
      // AC1a: The page presents the heading, business-unit control, Continue and Cancel actions.
      // AC2: Two or more permitted business units are presented in an autocomplete.
      // AC2a: The autocomplete options are in ascending alphabetical order.
      openSelectBusinessUnit();

      cy.get(Mci.businessUnitInput).should('be.visible').and('have.value', '');
      cy.get(Mci.singleBusinessUnitSummary).should('not.exist');
      cy.get(Mci.businessUnitInput).click();
      cy.get(Mci.businessUnitAutocomplete)
        .find('li')
        .then(($items) =>
          expect([...$items].map((item) => item.textContent?.trim())).to.deep.equal([
            'Alpha Court',
            'Camden and Islington',
            'Westminster - North',
          ]),
        );
      cy.get(Mci.continueButton).should('be.visible').and('contain.text', 'Continue');
      cy.get(Mci.cancelLink).should('be.visible').and('contain.text', 'Cancel');
    },
  );

  it('(AC3) displays the only permitted business unit in read-only format', { tags: TAGS }, () => {
    // AC3: Exactly one permitted business unit is read-only and cannot be amended.
    openSelectBusinessUnit({ count: 1, refData: [BUSINESS_UNITS.refData[1]] });

    cy.get(Mci.businessUnitInput).should('not.exist');
    cy.get(Mci.singleBusinessUnitSummary).should('contain.text', 'Business unit').and('contain.text', 'Alpha Court');
    cy.get(Mci.continueButton).click();
    cy.get('@financeRouter')
      .its('url')
      .should(
        'eq',
        ['', 'fines', 'manual-cash-input', 'create', 'till', FINES_MCI_ROUTING_PATHS.children.details].join('/'),
      );
    cy.get(Mci.tillDetails).should('contain.text', 'Till details').and('contain.text', 'Alpha Court');
  });

  it('(AC4) navigates to Till Details when a valid business unit is selected', { tags: TAGS }, () => {
    // AC4: A valid selected business unit takes the user to Till Details.
    openSelectBusinessUnit();
    selectBusinessUnit('Camden and Islington');
    cy.get(Mci.continueButton).click();

    cy.get(Mci.tillDetails).should('contain.text', 'Till details').and('contain.text', 'Camden and Islington');
  });

  it(
    '(AC5) remains on the page and displays "Select business unit" when no valid selection is made',
    { tags: TAGS },
    () => {
      // AC5: Continue without a valid business-unit selection stays on this page and displays "Select business unit".
      openSelectBusinessUnit();
      cy.get(Mci.continueButton).click();

      cy.get(Mci.errorSummary).should('contain.text', 'Select business unit');
      cy.get(Mci.businessUnitError).should('contain.text', 'Select business unit');
      cy.get(Mci.selectBusinessUnitHeading).should('have.text', 'Create till');
    },
  );

  it(
    '(AC6) returns to Manual Cash Input when Cancel is selected with no business unit selected',
    { tags: TAGS },
    () => {
      // AC6: Cancel with no selection returns to Manual Cash Input without validation or a data-loss prompt.
      openSelectBusinessUnit();
      cy.window().then((window) => cy.wrap(cy.stub(window, 'confirm')).as('leavePageConfirm'));
      cy.get(Mci.cancelLink).click();

      cy.get('@leavePageConfirm').should('not.have.been.called');
      cy.get('@financeRouter')
        .its('url')
        .should(
          'eq',
          [
            '',
            FINES_ROUTING_PATHS.root,
            FINES_MCI_ROUTING_PATHS.root,
            FINES_MCI_ROUTING_PATHS.children.createAllocate,
          ].join('/'),
        );
    },
  );

  it(
    '(AC6a, AC6ai and AC6aii) displays a data-loss warning and retains or clears the selection as chosen',
    { tags: TAGS },
    () => {
      // AC6a: Cancel after a selection shows the common data-loss route guard.
      // AC6aii: Declining the route guard retains the selection and remains on this page.
      // AC6ai: Confirming the route guard returns to Manual Cash Input and clears the selection.
      openSelectBusinessUnit();
      selectBusinessUnit('Camden and Islington');
      cy.window().then((window) => {
        const confirm = cy.stub(window, 'confirm');
        confirm.onFirstCall().returns(false);
        confirm.onSecondCall().returns(true);
        cy.wrap(confirm).as('leavePageConfirm');
      });

      cy.get(Mci.cancelLink).click();
      cy.get('@leavePageConfirm').should('have.been.calledWithExactly', UNSAVED_CHANGES_MESSAGE);
      cy.get(Mci.businessUnitInput).should('have.value', 'Camden and Islington');

      cy.get(Mci.cancelLink).click();
      cy.get('@leavePageConfirm').should('have.been.calledTwice');
      cy.get(Mci.createTillButton).should('be.visible');
      cy.get(Mci.createTillButton).click();
      cy.get(Mci.businessUnitInput).should('have.value', '');
    },
  );

  it(
    '(AC7a: RGAC2, RGAC2a, RGAC3 and RGAC3a) warns before browser exit or refresh and retains the selection when cancelled',
    { tags: TAGS },
    () => {
      // RGAC2: Closing the page or tab must display the browser's leave-site warning.
      // RGAC2a: Cancelling that warning retains the selected business unit in application memory.
      // RGAC3: Refreshing the page must display the browser's reload-site warning.
      // RGAC3a: Cancelling that warning retains the selected business unit in application memory.
      // Both native-browser scenarios are raised through the same beforeunload event, so one event assertion proves both.
      openSelectBusinessUnit();
      selectBusinessUnit('Camden and Islington');

      cy.window().then((window) => {
        const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });

        expect(window.dispatchEvent(beforeUnloadEvent), 'beforeunload event dispatch').to.be.false;
        expect(beforeUnloadEvent.defaultPrevented, 'beforeunload warning').to.be.true;
      });
      cy.get(Mci.businessUnitInput).should('have.value', 'Camden and Islington');
    },
  );
});
