import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import * as dateUtils from '../../../support/utils/dateUtils';

Then('I enter {string} into the {string} date field', (date: string, field: string) => {
  cy.contains('opal-lib-moj-date-picker', field).find('input').clear().type(date);
});

Then('I see {string} hint text above the {string} date picker', (hintText: string, field: string) => {
  cy.contains('opal-lib-moj-date-picker', field).find('input').parent().parent().prev().should('contain', hintText);
});

Then('I enter a date {int} weeks into the future into the {string} date field', (weeks: number, field: string) => {
  const date = dateUtils.calculateWeeksInFuture(weeks);
  cy.contains('opal-lib-moj-date-picker', field).find('input').clear().type(date);
});

Then('I enter a date {int} weeks into the past into the {string} date field', (weeks: number, field: string) => {
  const date = dateUtils.calculateWeeksInPast(weeks);
  cy.contains('opal-lib-moj-date-picker', field).find('input').clear().type(date);
});

Then('I see a date {int} weeks into the future in the {string} date field', (weeks: number, field: string) => {
  const date = dateUtils.calculateWeeksInFuture(weeks);
  cy.contains('opal-lib-moj-date-picker', field).find('input').should('have.value', date);
});

Then('I see a date {int} weeks into the past in the {string} date field', (weeks: number, field: string) => {
  const date = dateUtils.calculateWeeksInPast(weeks);
  cy.contains('opal-lib-moj-date-picker', field).find('input').should('have.value', date);
});

Then('I see {string} in the {string} date field', (date: string, field: string) => {
  cy.contains('opal-lib-moj-date-picker', field).find('input').should('have.value', date);
});

Then('I see the error message {string} above the {string} date field', (errorMessage: string, field: string) => {
  cy.contains('opal-lib-moj-date-picker', field).find('.govuk-error-message').should('contain', errorMessage);
});
