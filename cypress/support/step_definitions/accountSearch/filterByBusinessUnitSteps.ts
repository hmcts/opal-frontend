// cypress/e2e/fines/filter-by-business-unit.steps.ts
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';

// -------------------- selectors / text --------------------
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
} as const;

const TEXT = {
  pageTitle: 'Filter by business unit',
  finesTab: 'Fines',
  confTab: 'Confiscation',
  finesMaster: 'Fines business units',
  confMaster: 'Confiscation business units',
  mustSelectAtLeastOne: 'You must select at least one business unit',
} as const;

const textNorm = (s: string) => s.replace(/\s+/g, ' ').trim();
const sortNums = (arr: number[]) => [...arr].sort((a, b) => a - b);
const toNames = (table: DataTable): string[] => table.raw().map((r) => String(r[0]));

// Click tab by its visible text
const clickTab = (tabText: string) => cy.contains(SELECTORS.tabsLink, tabText).scrollIntoView().click();

// Expect the master header label to be visible (Fines/Confiscation)
const expectMasterLabel = (text: string) => cy.contains(SELECTORS.headerLabel, text).should('be.visible');

// DOM helpers
const getAllRowInputs = () => cy.get(`${SELECTORS.tableBody} ${SELECTORS.row} ${SELECTORS.rowCheckbox}`);

const ensureAllSelectionsOnCurrentTab = () => {
  getAllRowInputs().each(($i) => {
    expect(($i[0] as HTMLInputElement).checked, 'row checked').to.eq(true);
  });
};

// Keep running selection across tabs
const getSelectedIds = () => cy.wrap(null).then(() => (Cypress.env('selectedIds') as number[] | undefined) ?? []);
const setSelectedIds = (ids: number[]) =>
  cy.wrap(null).then(() => Cypress.env('selectedIds', Array.from(new Set(ids))));

// Find checkbox input to its label
const findCheckboxByBUName = (name: string): Cypress.Chainable<JQuery<HTMLInputElement>> =>
  cy
    .contains(`${SELECTORS.tableBody} ${SELECTORS.row} ${SELECTORS.rowLabel}`, name)
    .should('be.visible')
    .then(($label) => {
      const forId = $label.attr('for'); // string | undefined (no cast)
      expect(forId, `label 'for' for "${name}"`).to.be.ok;
      return cy.get<HTMLInputElement>(`${SELECTORS.tableBody} ${SELECTORS.row} ${SELECTORS.rowCheckbox}#${forId!}`);
    });

const selectBUNames = (names: string[], checked: boolean) => {
  getSelectedIds().then((current) => {
    const work = [...current];
    cy.wrap(names).each((name: string) => {
      findCheckboxByBUName(name).then(($input) => {
        const idStr = $input.attr('id') ?? '';
        const id = Number(idStr);

        if (checked) {
          if (!$input.prop('checked')) cy.wrap($input).check({ force: true });
          work.push(id);
        } else {
          if ($input.prop('checked')) cy.wrap($input).uncheck({ force: true });
          const idx = work.indexOf(id);
          if (idx >= 0) work.splice(idx, 1);
        }

        setSelectedIds(work);
      });
    });
  });
};

const assertSaveCount = (n: number) => {
  cy.get(SELECTORS.saveBtn)
    .invoke('text')
    .then((t) => {
      const txt = textNorm(t);
      const re = new RegExp(`^Save selection(?: \\(\\s*${n}\\s*\\))?$`);
      expect(txt).to.match(re);
    });
};

const assertErrorSummaryVisible = () => {
  cy.get(SELECTORS.errorSummary).should('be.visible').and('contain.text', TEXT.mustSelectAtLeastOne);
};

// -------------------- Steps --------------------
Then('I see the page heading {string}', (heading: string) => {
  cy.get(SELECTORS.pageHeading).should('have.text', heading);
});

Then('I see the master checkbox label {string}', (label: string) => {
  expectMasterLabel(label);
});

Then('I am on the {string} page', (pageTitle: string) => {
  cy.get(SELECTORS.pageHeading)
    .first()
    .should('be.visible')
    .invoke('text')
    .then((t) => expect(t.trim()).to.eq(pageTitle));
});

Then('I remain on the {string} page', (pageTitle: string) => {
  cy.get(SELECTORS.pageHeading).should('have.text', pageTitle);
});

Then('no business units are selected on the {string} tab', (tab: string) => {
  // use the shared helper to switch tab
  clickTab(tab);

  cy.get('table.govuk-table > tbody.govuk-table__body .govuk-checkboxes__input').should(($inputs) => {
    const allUnchecked = [...$inputs].every((i) => !(i as HTMLInputElement).checked);
    expect(allUnchecked, `all checkboxes on ${tab} tab should be unchecked`).to.be.true;
  });
});

Then('all business units are selected on the {string} tab', (tab: string) => {
  clickTab(tab);
  ensureAllSelectionsOnCurrentTab();
});

When('I unselect all business units on the {string} tab', (tab: string) => {
  // switch to the tab
  cy.contains('a.moj-sub-navigation__link', tab).scrollIntoView().click({ force: true });

  // click the master to clear everything
  const masterText = tab === 'Fines' ? 'Fines business units' : 'Confiscation business units';
  cy.contains('th .govuk-checkboxes__label', masterText).click({ force: true });

  // one aggregate assertion
  cy.get('table.govuk-table > tbody.govuk-table__body .govuk-checkboxes__input').should(($inputs) => {
    const allUnchecked = [...$inputs].every((i) => !(i as HTMLInputElement).checked);
    expect(allUnchecked, 'all checkboxes are unchecked').to.be.true;
  });
});

When('I click the {string} select-all checkbox', (headerText: string) => {
  cy.contains(SELECTORS.headerLabel, headerText).click();
});

When('I select the business units on Fines:', (table: DataTable) => {
  clickTab(TEXT.finesTab);
  selectBUNames(toNames(table), true);
});

When('I select the business units on Confiscation:', (table: DataTable) => {
  clickTab(TEXT.confTab);
  selectBUNames(toNames(table), true);
});

Then('the following business units are selected on Fines:', (table: DataTable) => {
  clickTab(TEXT.finesTab);
  const names = toNames(table);

  cy.wrap(names).each((name: string) => {
    findCheckboxByBUName(name).then(($input) => {
      cy.wrap($input).should('be.checked');
    });
  });
});

Then('the "Save selection" button shows a total of {int}', (count: number) => {
  assertSaveCount(count);
});

When('I intercept the "save selected business units" API call', () => {
  cy.intercept('POST', '**/search-accounts/business-units').as('saveBusUnits');
});

When('I spy on the "save selected business units" API call', () => {
  cy.intercept('POST', '**/search-accounts/business-units').as('saveBusUnitsSpy');
});

const tokens = (text: string) =>
  text
    .replace(/\u00A0/g, ' ')
    .trim()
    .split(/[,\s]+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

Then('the business unit filter summary shows {string}', (expected: string) => {
  cy.get('#accountDetailsLanguagePreferencesValue')
    .invoke('text')
    .then((text) => {
      expect(tokens(text)).to.deep.equal(tokens(expected));
    });
});

Then('I am taken back to the "Search for an account" page', () => {
  cy.contains('h1', 'Search for an account').should('be.visible');
});

Then('the Fines header is shown', () => expectMasterLabel(TEXT.finesMaster));
Then('the Confiscation header is shown', () => expectMasterLabel(TEXT.confMaster));

Then('I see an error that I must select at least one business unit', () => {
  assertErrorSummaryVisible();
});
Then('all business units are still selected on the {string} tab', (tab: string) => {
  clickTab(tab);
  ensureAllSelectionsOnCurrentTab();
});
