import { AccountSearchCommonLocators as CommonLocators } from '../../../shared/selectors/account-search/account.search.common.locators';
import { AccountSearchMajorCreditorsLocators as MajorCreditorsLocators } from '../../../shared/selectors/account-search/account.search.major-creditors.locators';
import { AccountSearchNavLocators as NavLocators } from '../../../shared/selectors/account-search/account.search.nav.locators';
import { MAJOR_CREDITORS_SEARCH_STATE_MOCK } from './mocks/search_and_matches_major_creditors_mock';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { BehaviorSubject } from 'rxjs';
import { mountSearchAccount } from './support/mountSearchAccount';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const MajorAutocompleteLocators = MajorCreditorsLocators.autocomplete;
const MajorRequirementLocators = MajorCreditorsLocators.businessUnitRequirement;

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

describe('Search Account Component - Major Creditors', () => {
  type MajorCreditorsSearchState = typeof MAJOR_CREDITORS_SEARCH_STATE_MOCK;
  const fragment$ = new BehaviorSubject<string | null>('majorCreditors');

  const buildMajorCreditorsSearchState = (
    configure?: (searchState: MajorCreditorsSearchState) => void,
  ): MajorCreditorsSearchState => {
    const searchState = structuredClone(MAJOR_CREDITORS_SEARCH_STATE_MOCK);
    configure?.(searchState);
    return searchState;
  };

  const setupComponent = (configure?: (searchState: MajorCreditorsSearchState) => void) =>
    mountSearchAccount({
      activeTab: 'majorCreditors',
      fragment$,
      initialState: buildMajorCreditorsSearchState(configure),
      routeSnapshotData: {
        businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
        majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
      },
      useSpyRouter: true,
    });

  beforeEach(() => {
    fragment$.next('majorCreditors');

    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
  });

  it('AC1. should render the search for an account screen and major creditors tab', { tags: [...buildTags('@JIRA-STORY:PO-716'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4502'] }, () => {
      setupComponent();

      cy.get(CommonLocators.root).should('exist');
      cy.get(CommonLocators.pageHeader).should('contain', 'Search for an account');
      cy.get(NavLocators.tabsContainer).should('exist');
      cy.get(NavLocators.tabsList).should('exist');
      cy.get(NavLocators.individualsTab).should('exist');
      cy.get(NavLocators.companiesTab).should('exist');
      cy.get(NavLocators.minorCreditorsTab).should('exist');
      cy.get(NavLocators.majorCreditorsTab).should('exist');
      cy.get(MajorCreditorsLocators.panel.root).should('exist');
      cy.get(MajorCreditorsLocators.panel.heading).should('exist').contains('Major creditors');
      cy.get(MajorAutocompleteLocators.hint).should('exist').contains('Search using creditor name or code');
      cy.get(MajorAutocompleteLocators.input).should('exist');
      cy.get(CommonLocators.accountNumberLabel).should('exist').and('contain', 'Account number');
      cy.get(CommonLocators.referenceOrCaseNumberLabel).should('exist').and('contain', 'Reference or case number');
      cy.get(CommonLocators.referenceOrCaseNumberInput).should('exist');
      cy.get(CommonLocators.activeAccountsOnlyCheckbox).should('be.checked');
      cy.get(CommonLocators.searchButton).should('exist').and('contain', 'Search');

      cy.get(CommonLocators.businessUnitFilterChangeLink).click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['filter-business-units']);
    });

  it('AC2a, AC2b, AC2c. Single BU filtered and dropdown contents', { tags: [...buildTags('@JIRA-STORY:PO-716'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4503'] }, () => {
      setupComponent();

      cy.get(MajorCreditorsLocators.panel.heading).should('exist').contains('Major creditors');
      cy.get(MajorAutocompleteLocators.hint).should('exist').contains('Search using creditor name or code');
      cy.get(MajorAutocompleteLocators.input).click();
      cy.get(MajorAutocompleteLocators.listbox).find('li').should('have.length', 4);
      cy.get(MajorAutocompleteLocators.listbox).find('li').eq(0).should('contain', 'Abellio Greater Anglia (AGAL)');
      cy.get(MajorAutocompleteLocators.listbox).find('li').eq(1).should('contain', 'Aberdeen JP Court (ABJP)');
      cy.get(MajorAutocompleteLocators.listbox).find('li').eq(2).should('contain', 'Aldi Stores Ltd (ALDI)');
      cy.get(MajorAutocompleteLocators.listbox).find('li').eq(3).should('contain', 'Arriva Rail North (ARVA)');
    });

  it('AC2d. Type ahead and non-case sensitive search', { tags: [...buildTags('@JIRA-STORY:PO-716'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4504'] }, () => {
      setupComponent();

      cy.get(MajorAutocompleteLocators.input).click().type('ab');
      cy.get(MajorAutocompleteLocators.listbox).find('li').eq(0).should('contain', 'Abellio Greater Anglia (AGAL)');
      cy.get(MajorAutocompleteLocators.listbox).find('li').eq(1).should('contain', 'Aberdeen JP Court (ABJP)');
    });

  it('AC2f. Navigated to account enquiry when major creditor is selected and searched for', { tags: [...buildTags('@JIRA-STORY:PO-716'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4505'] }, () => {
      setupComponent();

      cy.get(MajorAutocompleteLocators.input).click();
      cy.get(MajorAutocompleteLocators.listbox).find('li').contains('Arriva Rail North').click();
      cy.get(MajorAutocompleteLocators.input).should('have.value', 'Arriva Rail North (ARVA)');

      cy.get(CommonLocators.searchButton).click();
      const accountId = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK.refData[3].major_creditor_id; //3858
      //The expected screen has not yet been developed, change URL once it has.
      cy.get('@urlTree').should('have.been.calledWithMatch', [`fines/account/${accountId}/defendant`]);

      //A stub is used here so a new tab is not actually opened
      cy.get('@windowOpen').should('have.been.calledOnce');
    });

  it('AC2h. Data cleared when another tab is selected', { tags: [...buildTags('@JIRA-STORY:PO-716'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4506'] }, () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_number = '12345678';
        searchState.fsa_search_account_reference_case_number = 'REF123';
      });

      cy.get(MajorAutocompleteLocators.input).click();
      cy.get(MajorAutocompleteLocators.listbox).find('li').contains('Abellio Greater Anglia').click();
      cy.get(MajorAutocompleteLocators.input).should('have.value', 'Abellio Greater Anglia (AGAL)');
      cy.get(NavLocators.minorCreditorsTab).click();
      cy.get(NavLocators.majorCreditorsTab).click();
      cy.get(MajorAutocompleteLocators.input).should('have.value', '');
    });

  it('AC3. Multiple BUs filtered unhappy path', { tags: [...buildTags('@JIRA-STORY:PO-716'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4507'] }, () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_business_unit_ids = [61, 67, 68, 69, 70, 71, 73];
      });
      cy.get(MajorCreditorsLocators.panel.heading).should('exist').contains('Major creditors');
      cy.get(MajorRequirementLocators.message)
        .should('exist')
        .contains('To search major creditors, filter by a single business unit');
      cy.get(MajorRequirementLocators.link).should('exist').contains('filter by a single business unit');
    });

  it('AC4, AC5. Major creditor tab error validation', { tags: [...buildTags('@JIRA-STORY:PO-716'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4508'] }, () => {
      setupComponent();

      cy.get(CommonLocators.searchButton).click();

      cy.get(MajorAutocompleteLocators.error).should('exist').and('contain', 'Enter a major creditor name or code');
    });

  it('AC6. Validation passes navigated to problem screen', { tags: [...buildTags('@JIRA-STORY:PO-716'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4509'] }, () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_number = '12345678';
        searchState.fsa_search_account_reference_case_number = 'REF123';
      });
      cy.get(MajorAutocompleteLocators.input).click();
      cy.get(MajorAutocompleteLocators.listbox).find('li').contains('Abellio Greater Anglia').click();
      cy.get(MajorAutocompleteLocators.input).should('have.value', 'Abellio Greater Anglia (AGAL)');

      cy.get(CommonLocators.searchButton).click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['problem']);
    });
});
