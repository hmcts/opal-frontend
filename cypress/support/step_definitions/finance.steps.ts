import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { FinanceBankingInterfaceLink } from '../../e2e/functional/opal/actions/finance/finance.actions';
import { FinanceFlow } from '../../e2e/functional/opal/flows/finance.flow';
import { log } from '../utils/log.helper';

const financeFlow = () => new FinanceFlow();

Then('I see the External banking interfaces section and its available links', () => {
  log('assert', 'Checking Finance banking-interface links are visible');
  financeFlow().assertBankingInterfacesSectionAndLinks();
});

When('I open the Finance banking interface link {string}', (linkLabel: FinanceBankingInterfaceLink) => {
  log('step', 'Opening a Finance banking-interface link', { linkLabel });
  financeFlow().openBankingInterfaceLink(linkLabel);
});
