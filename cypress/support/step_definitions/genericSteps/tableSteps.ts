import { DataTable, Then } from '@badeball/cypress-cucumber-preprocessor';

const getColumnIndex = (columnName: string): Cypress.Chainable<number> =>
  cy
    .get('table.govuk-table thead th button', { timeout: 20000 })
    .contains(columnName)
    .invoke('parent')
    .then(($th) => $th.index());

const goToFirstPaginationPageIfPresent = (): Cypress.Chainable => {
  return cy.get('body').then(($body) => {
    const firstPageLink = $body
      .find('nav.moj-pagination .moj-pagination__link')
      .filter((_, el) => (el.textContent ?? '').trim() === '1')
      .first();

    if (firstPageLink.length) {
      cy.wrap(firstPageLink).click({ force: true });
    }
  });
};

const scanColumnForValue = (
  columnIndex: number,
  predicate: (values: string[]) => boolean,
): Cypress.Chainable<boolean> =>
  cy.get(`table.govuk-table tbody tr td:nth-child(${columnIndex + 1})`, { timeout: 20000 }).then(($cells) => {
    const cellValues = [...$cells].map((el) => el.innerText.trim());
    return predicate(cellValues);
  });

Then('I sort the table by column {string} in descending order', (columnName: string) => {
  cy.get('table.govuk-table thead th button', { timeout: 20000 })
    .contains(columnName)
    .scrollIntoView()
    .then(($btn) => {
      cy.wrap($btn)
        .invoke('attr', 'aria-sort')
        .then((sort) => {
          if (sort !== 'descending') {
            cy.wrap($btn).click({ force: true });
            if (sort === 'ascending') {
              cy.wrap($btn).click({ force: true });
            }
          }
        });
    })
    .then(() => goToFirstPaginationPageIfPresent());
});

Then('I sort the table by column {string} in ascending order', (columnName: string) => {
  cy.get('table.govuk-table thead th button', { timeout: 20000 })
    .contains(columnName)
    .scrollIntoView()
    .then(($btn) => {
      cy.wrap($btn)
        .invoke('attr', 'aria-sort')
        .then((sort) => {
          if (sort !== 'ascending') {
            cy.wrap($btn).click({ force: true });
          }
        });
    })
    .then(() => goToFirstPaginationPageIfPresent());
});

Then('I see a table with the headings:', (headings: DataTable) => {
  const tableHeadings = headings.raw()[0];
  tableHeadings.forEach((heading: string) => {
    cy.get('th').contains(heading);
  });
});
Then(
  'I see the following data in position {int} of the rejected accounts table:',
  (position: number, data: DataTable) => {
    const tableData = data.raw()[0];
    tableData.forEach((cellData: string, index: number) => {
      cy.log('Cell data: ' + cellData);
      cy.log('Index: ' + index);
      cy.get('tr').eq(position).children('td').eq(index).contains(cellData);
    });
  },
);
Then(
  'I see the following data in position {int} of the approved accounts table:',
  (position: number, data: DataTable) => {
    const tableData = data.raw()[0];
    tableData.forEach((cellData: string, index: number) => {
      cy.log('Cell data: ' + cellData);
      cy.log('Index: ' + index);
      cy.get('tr').eq(position).children('td').eq(index).contains(cellData);
    });
  },
);

Then('I do not see {string} in column {string}', (unexpectedValue: string, columnName: string) => {
  getColumnIndex(columnName).then((colIndex) => {
    scanColumnForValue(colIndex, (values) => values.some((val) => val.includes(unexpectedValue))).then((found) => {
      cy.log(`Checked column "${columnName}" on current page for absence of "${unexpectedValue}"`);
      expect(found, `Expected NOT to find "${unexpectedValue}" in column "${columnName}", but it was present`).to.be
        .false;
    });
  });
});

Then('I see {string} is present in column {string}', (expectedValue: string, columnName: string) => {
  getColumnIndex(columnName).then((colIndex) => {
    scanColumnForValue(colIndex, (values) => values.some((val) => val.includes(expectedValue))).then((found) => {
      cy.log(`Column "${columnName}" values checked on current page`);
      expect(found, `Expected "${expectedValue}" to be found in column "${columnName}"`).to.be.true;
    });
  });
});
