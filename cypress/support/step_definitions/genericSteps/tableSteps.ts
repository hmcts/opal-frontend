import { DataTable, Then } from '@badeball/cypress-cucumber-preprocessor';

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
