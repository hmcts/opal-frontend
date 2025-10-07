import { When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';

/**
 * SELECTORS
 */
const SELECTORS = {
  pageHeading: 'h1.govuk-heading-l',
  tabsLink: 'a.moj-sub-navigation__link',
  headerLabel: 'th .govuk-checkboxes__label',
  tableBody: 'table.govuk-table > tbody.govuk-table__body',
  row: 'tr.govuk-table__row',
  rowLabel: '.govuk-checkboxes__label',
  rowCheckbox: '.govuk-checkboxes__input',
  saveBtn: 'button#submitForm',
  cancelLink: 'a.govuk-link.button-link',
  errorSummary: '.govuk-error-summary',
  accountBUFilterSummary: '#accountDetailsLanguagePreferencesValue',
} as const;

/**
 * TEXT
 */
const TEXT = {
  pageTitle: 'Filter by business unit',
  finesTab: 'Fines',
  confTab: 'Confiscation',
  finesMaster: 'Fines business units',
  confMaster: 'Confiscation business units',
  mustSelectAtLeastOne: 'You must select at least one business unit',
} as const;

// Map known page titles to routes (extend as needed)
const PAGE_PATHS: Record<string, string> = {
  'Search for an account': '/fines/search-accounts',
  'Filter by business unit': '/fines/search-accounts/filter-business-units',
};

/** Reset selectedIds variable  */
Before(() => {
  Cypress.env('selectedIds', []);
});

/** Utility: remove whitespace for text matching. */
const textNorm = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Utility: data table - first column list */
const toNames = (table: DataTable): string[] => table.raw().map((r) => String(r[0]));

/** Click tab by its visible text.
 * @param {string} tabText - Visible text of the tab to click.
 */
const clickTab = (tabText: string) => cy.contains(SELECTORS.tabsLink, tabText).scrollIntoView().click();

/** Expect master header label to be visible (Fines / Confiscation). */
const expectMasterLabel = (text: string) => cy.contains(SELECTORS.headerLabel, text).should('be.visible');

/** DOM helpers */
const getAllRowInputs = () => cy.get(`${SELECTORS.tableBody} ${SELECTORS.row} ${SELECTORS.rowCheckbox}`);

/** Assert helpers */
const assertAllUncheckedOnCurrentTab = () => {
  getAllRowInputs().should(($inputs) => {
    const allUnchecked = [...$inputs].every((i) => !(i as HTMLInputElement).checked);
    expect(allUnchecked, 'all checkboxes are unchecked').to.be.true;
  });
};

const assertAllCheckedOnCurrentTab = () => {
  getAllRowInputs().should(($inputs) => {
    const allChecked = [...$inputs].every((i) => (i as HTMLInputElement).checked);
    expect(allChecked, 'all checkboxes are checked').to.be.true;
  });
};

/** Keep running selection across tabs to verify totals. */
const getSelectedIds = () => cy.wrap(null).then(() => (Cypress.env('selectedIds') as number[] | undefined) ?? []);
const setSelectedIds = (ids: number[]) =>
  cy.wrap(null).then(() => Cypress.env('selectedIds', Array.from(new Set(ids))));

/** Resolve the master-checkbox label for the tab name. */
const masterLabelForTab = (tab: string): string => {
  const t = textNorm(tab);
  if (t === textNorm(TEXT.finesTab)) return TEXT.finesMaster;
  if (t === textNorm(TEXT.confTab)) return TEXT.confMaster;
  throw new Error(`Unknown tab "${tab}". Expected "${TEXT.finesTab}" or "${TEXT.confTab}".`);
};

/** Find a checkbox input by its BU label text.
 * @param {string} name - Business unit name as shown in UI.
 * @returns {Cypress.Chainable<JQuery<HTMLInputElement>>}
 */
const findCheckboxByBUName = (name: string): Cypress.Chainable<JQuery<HTMLInputElement>> =>
  cy
    .contains(SELECTORS.rowLabel, name)
    .should('be.visible')
    .invoke('attr', 'for')
    .then((forId) => {
      if (!forId) throw new Error(`Label "${name}" has no 'for' attribute`);
      return cy.get<HTMLInputElement>(`#${forId}`);
    });

/** Select / unselect BU names and keep env state in sync. */
const selectBUNames = (names: string[], checked: boolean) => {
  getSelectedIds().then((current) => {
    const work = new Set<number>(current);

    cy.wrap(names).each((name: string) => {
      findCheckboxByBUName(name).then(($input) => {
        const idAttr = $input.attr('id');
        const id = Number(idAttr);
        if (!idAttr || Number.isNaN(id)) {
          throw new Error(`Expected numeric input id for "${name}" but got "${idAttr ?? 'undefined'}"`);
        }

        if (checked) {
          if (!$input.prop('checked')) cy.wrap($input).check({ force: true });
          work.add(id);
        } else {
          if ($input.prop('checked')) cy.wrap($input).uncheck({ force: true });
          work.delete(id);
        }

        setSelectedIds(Array.from(work));
      });
    });
  });
};

/** Assert the Save button shows the expected total count. */
const assertSaveCount = (n: number) => {
  cy.get(SELECTORS.saveBtn)
    .invoke('text')
    .then((t) => {
      const txt = textNorm(t);
      const re = new RegExp(`^Save selection(?: \\(\\s*${n}\\s*\\))?$`);
      expect(txt).to.match(re);
    });
};

/** Assert that the error summary is visible with expected text. */
const assertErrorSummaryVisible = () => {
  cy.get(SELECTORS.errorSummary).should('be.visible').and('contain.text', TEXT.mustSelectAtLeastOne);
};

// -------------------- Steps --------------------

/** @step Assert the page heading text exactly equals the expected string. */
Then('I see the page heading {string}', (heading: string) => {
  cy.get(SELECTORS.pageHeading).should(($h) => {
    expect(textNorm($h.text())).to.eq(textNorm(heading));
  });
});

/** @step Assert the master checkbox label text is visible. */
Then('I see the master checkbox label {string}', (label: string) => {
  expectMasterLabel(label);
});

/** Escape regex for literal matching */
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** @step Assert we are on a page with the given heading. */
Then('I am on the {string} page', (pageTitle: string) => {
  const titleRe = new RegExp(`^\\s*${escapeRegExp(pageTitle)}\\s*$`, 'i');

  // This will retry until heading with the expected text is visible
  cy.contains(SELECTORS.pageHeading, titleRe, { timeout: 15000 }).should('be.visible');
});

/** @step Assert no BUs are selected on a given tab. */
Then('no business units are selected on the {string} tab', (tab: string) => {
  clickTab(tab);
  assertAllUncheckedOnCurrentTab();
});

/** @step Assert all BUs are selected on a given tab. */
Then('all business units are selected on the {string} tab', (tab: string) => {
  clickTab(tab);
  assertAllCheckedOnCurrentTab();
});

/** @step Clear all selections on a tab by toggling the master checkbox. */
When('I unselect all business units on the {string} tab', (tab: string) => {
  clickTab(tab);
  cy.contains(SELECTORS.headerLabel, masterLabelForTab(tab)).click({ force: true });
  assertAllUncheckedOnCurrentTab();
});

/** @step Click the select-all (master) checkbox by its label text. */
When('I click the {string} select-all checkbox', (headerText: string) => {
  cy.contains(SELECTORS.headerLabel, headerText).click();
});

/** @step Select BUs on Fines by name. */
When('I select the business units on Fines:', (table: DataTable) => {
  clickTab(TEXT.finesTab);
  selectBUNames(toNames(table), true);
});

/** @step Select BUs on Confiscation by name. */
When('I select the business units on Confiscation:', (table: DataTable) => {
  clickTab(TEXT.confTab);
  selectBUNames(toNames(table), true);
});

/** @step Assert that specific BUs are selected on tab. */
Then('the following business units are selected on {string}:', (tabName: string, table: DataTable) => {
  clickTab(tabName);
  const names = toNames(table);
  cy.wrap(names).each((name: string) => {
    findCheckboxByBUName(name).should('be.checked');
  });
});

/** @step Generic assert for the Save button total. */
Then('the "Save selection" button shows a total of {int}', (count: number) => {
  assertSaveCount(count);
});

/** Helper for order-insensitive text comparisons. */
const tokens = (text: string) =>
  text
    .replace(/\u00A0/g, ' ')
    .trim()
    .split(/[,\s]+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

/** @step Assert the filter summary shows the expected combined list. */
Then('the business unit filter summary shows {string}', (expected: string) => {
  cy.get(SELECTORS.accountBUFilterSummary)
    .invoke('text')
    .then((text) => {
      expect(tokens(text)).to.deep.equal(tokens(expected));
    });
});

/** @step Assert navigation back to the Search page by heading. */
Then('I am taken back to the "Search for an account" page', () => {
  cy.contains(SELECTORS.pageHeading, 'Search for an account').should('be.visible');
});

/** @step Header checks via constants. */
Then('the Fines header is shown', () => expectMasterLabel(TEXT.finesMaster));
Then('the Confiscation header is shown', () => expectMasterLabel(TEXT.confMaster));

/** @step Error summary message for empty selection. */
Then('I see an error that I must select at least one business unit', () => {
  assertErrorSummaryVisible();
});

/** @step Assert all are still selected on a tab */
Then('all business units are still selected on the {string} tab', (tab: string) => {
  clickTab(tab);
  assertAllCheckedOnCurrentTab();
});
