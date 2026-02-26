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

Then('I am on the consolidation Search tab for Individuals', () => {
  log('step', 'Verifying consolidation account search defaults for Individuals');
  consolidationFlow().assertSearchTabForIndividuals();
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
