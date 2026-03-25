/**
 * @file consolidation.steps.ts
 * @description Cucumber step definitions for Consolidation journeys.
 * Steps stay thin and delegate behaviour to flows/actions.
 */

import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { ConsolidationFlow } from '../../../e2e/functional/opal/flows/consolidation.flow';
import { ConsolidationDefendantType } from '../../../e2e/functional/opal/actions/consolidation/consolidation.actions';
import { log } from '../../utils/log.helper';

const consolidationFlow = () => new ConsolidationFlow();

When(
  'I continue to the consolidation account search as an {string} defendant',
  (defendantType: ConsolidationDefendantType) => {
    log('step', 'Continuing to consolidation account search', { defendantType });
    consolidationFlow().continueToConsolidationAccountSearch(defendantType);
  },
);

When('I click Search on consolidation account search', () => {
  log('step', 'Clicking Search on consolidation account search');
  consolidationFlow().clickConsolidationSearch();
});

When('I clear the consolidation search', () => {
  log('step', 'Clearing the consolidation search form');
  consolidationFlow().clearConsolidationSearch();
});

Then('I am on the consolidation Search tab for Individuals', () => {
  log('step', 'Verifying consolidation account search defaults for Individuals');
  consolidationFlow().assertSearchTabForIndividuals();
});

Then('I am on the consolidation Search tab for Companies', () => {
  log('step', 'Verifying consolidation account search defaults for Companies');
  consolidationFlow().assertSearchTabForCompanies();
});

Then('the consolidation page header back link is displayed', () => {
  log('step', 'Verifying consolidation page header back link is displayed');
  consolidationFlow().assertBackLinkIsDisplayed();
});

When('I click the consolidation page header back link', () => {
  log('step', 'Clicking the consolidation page header back link');
  consolidationFlow().clickBackLink();
});

When('I open the consolidation Results tab', () => {
  log('step', 'Opening the consolidation Results tab');
  consolidationFlow().openResultsTab();
});

Then('I am on the consolidation Results tab', () => {
  log('step', 'Verifying consolidation Results tab is active');
  consolidationFlow().assertResultsTab();
});

Then('I am on the consolidation Results tab for Individuals', () => {
  log('step', 'Verifying consolidation Results tab summary for Individuals');
  consolidationFlow().assertResultsTabForIndividuals();
});

Then('I am on the consolidation Results tab for Companies', () => {
  log('step', 'Verifying consolidation Results tab summary for Companies');
  consolidationFlow().assertResultsTabForCompanies();
});

Then('the created consolidation result account number is displayed as a hyperlink', () => {
  log('step', 'Verifying created consolidation result account number is displayed as a hyperlink');
  consolidationFlow().assertCreatedAccountLinkIsDisplayed();
});

Then('I see the consolidation no matching results state', () => {
  log('step', 'Verifying consolidation no matching results state');
  consolidationFlow().assertNoMatchingResultsState();
});

Then('the consolidation results exclude accounts with a balance of {string}', (balance: string) => {
  log('step', 'Verifying consolidation results exclude accounts with balance', { balance });
  consolidationFlow().assertResultsExcludeBalance(balance);
});

When('I click Check your search on consolidation no matching results', () => {
  log('step', 'Clicking Check your search on consolidation no matching results');
  consolidationFlow().clickCheckYourSearchFromNoMatchingResults();
});

When('I open the created consolidation result account in a new tab', () => {
  log('step', 'Opening created consolidation result account in a new tab');
  consolidationFlow().openCreatedAccountFromResultsInNewTab();
});

Then('I see the consolidation search error page for {string}', (defendantType: ConsolidationDefendantType) => {
  log('step', 'Verifying consolidation search error page', { defendantType });
  consolidationFlow().assertSearchErrorPage(defendantType);
});

When('I go back from the consolidation search error page', () => {
  log('step', 'Going back from the consolidation search error page');
  consolidationFlow().goBackFromSearchError();
});

When('I enter the following consolidation search details:', (table: DataTable) => {
  log('step', 'Entering consolidation search details');
  consolidationFlow().enterConsolidationSearchDetails(table);
});

When('I switch consolidation tabs and return to Search', () => {
  log('step', 'Switching consolidation tabs and returning to Search');
  consolidationFlow().switchTabsAndReturnToSearch();
});

Then('the consolidation search details are retained:', (table: DataTable) => {
  log('step', 'Asserting consolidation search details are retained');
  consolidationFlow().assertConsolidationSearchDetails(table);
});
