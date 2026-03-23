import { AccountSearchLocators } from '../../../shared/selectors/consolidation/AccountSearch.locators';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-result/mocks/fines-con-search-result-defendant-accounts-formatting.mock';
import { setupConsolidationComponent as mountConsolidationComponent } from './setup/SetupComponent';
import { IComponentProperties } from './setup/setupComponent.interface';

const CONSOLIDATION_JIRA_LABEL = '@JIRA-LABEL:consolidation';

const buildTags = (...tags: string[]): string[] => [...tags, CONSOLIDATION_JIRA_LABEL];

describe('FinesConConsolidateAccComponent - Account Results', () => {
  const defaultComponentProperties: IComponentProperties = {
    defendantType: 'individual',
    fragments: 'results',
    initialResults: structuredClone(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK),
  };

  const setupComponent = (componentProperties: IComponentProperties = {}) => {
    return mountConsolidationComponent({
      ...defaultComponentProperties,
      ...componentProperties,
    });
  };

  it(
    'AC1, AC1a, AC1b. should render the individual account results tab with populated mock data',
    { tags: buildTags() },
    () => {
      setupComponent();

      cy.get(AccountSearchLocators.heading).should('contain', 'Consolidate accounts');
      cy.get(AccountSearchLocators.businessUnitKey).should('contain', 'Business unit');
      cy.get(AccountSearchLocators.businessUnitValue).should('contain', 'Historical Debt');
      cy.get(AccountSearchLocators.defendantTypeKey).should('contain', 'Defendant type');
      cy.get(AccountSearchLocators.defendantTypeValue).should('contain', 'Individual');
      cy.get(AccountSearchLocators.resultsTab).should('have.attr', 'aria-current', 'page');

      cy.get(AccountSearchLocators.resultsHeading).should('contain', 'Select accounts to consolidate');
      cy.get(AccountSearchLocators.addToListButton).should('contain', 'Add to list');
      cy.get(AccountSearchLocators.selectedAccountsHint).should('be.visible');
      cy.get(AccountSearchLocators.resultsTable).should('be.visible');
      cy.get(AccountSearchLocators.resultAccountLinkByNumber('ACC001')).should('be.visible');
      cy.get(AccountSearchLocators.resultRowWithAccount('ACC001'))
        .find(AccountSearchLocators.resultNameCell)
        .should('contain', 'SMITH, John James');
    },
  );
});
