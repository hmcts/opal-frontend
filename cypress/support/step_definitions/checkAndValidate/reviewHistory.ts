import { Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';

const locators = {
  timelineItem: '.moj-timeline__item',
  timelineItemTitle: '.moj-timeline__title',
  timelineItemByLine: '.moj-timeline__by-line',
  timelineItemDate: '.moj-timeline__date',
  timelineItemDescription: '.moj-timeline__description',
};

Then('I see the following in item {int} of the review history', (index: number, dataTable: DataTable) => {
  const expectedTexts = dataTable.rowsHash();
  cy.get(locators.timelineItem)
    .eq(index - 1)
    .within(() => {
      Object.entries(expectedTexts).forEach(([key, value]) => {
        switch (key) {
          case 'title':
            cy.get(locators.timelineItemTitle).should('contain', value);
            break;
          case 'byLine':
            cy.get(locators.timelineItemByLine).should('contain', value);
            break;
          case 'date':
            cy.get(locators.timelineItemDate).should('contain', value);
            break;
          case 'description':
            cy.get(locators.timelineItemDescription).should('contain', value);
            break;
          default:
            throw new Error(`Unexpected key: ${key}`);
        }
      });
    });
});
