import { DOM_ELEMENTS as ENF_ACTION_SELECT } from '../../../shared/selectors/account-enquiry/account.enquiry.enforcement-action-select.locators';
import { ACCOUNT_ENQUIRY_ENFORCEMENT_STATUS_ELEMENTS as ENF } from '../../../shared/selectors/account-enquiry/account.enquiry.enforcement.locators';
import { setupAccountEnquiryComponent } from '../accountEnquiry/setup/SetupComponent';
import { IComponentProperties } from '../accountEnquiry/setup/setupComponent.interface';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from 'cypress/component/CommonIntercepts/CommonUserState.mocks';
import {
  interceptDefendantHeader,
  interceptEnforcementStatus,
} from '../accountEnquiry/intercept/defendantAccountIntercepts';
import {
  createDefendantHeaderMockWithName,
  DEFENDANT_HEADER_MOCK,
  DEFENDANT_HEADER_PARENT_GUARDIAN_MOCK,
} from '../accountEnquiry/mocks/defendant_details_mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';

const COMPONENT_PROPERTIES: IComponentProperties = {
  accountId: '77',
  fragments: 'enforcement',
  interceptedRoutes: [
    '/access-denied',
    '../note/add',
    '../debtor/individual/amend',
    '../debtor/parentGuardian/amend',
    '../enforcement/amend',
    '../enforcement/amend-denied',
  ],
};

const EMPTY_RESULTS_RESPONSE: IOpalFinesResultsRefData = {
  count: 0,
  refData: [],
};

describe('Add enforcement action in enforcement tab - Individual', () => {
  it('AC1,1a, AC2,2a,2b. Individual: navigates to the select enforcement action screen and displays the form incl details', () => {
    let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
    headerMock.debtor_type = 'individual';
    headerMock.account_status_reference.account_status_code = 'L';
    let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
    enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';
    enforcementMock.next_enforcement_action_data = null;
    const accountId = headerMock.defendant_account_party_id;
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, '123');
    interceptEnforcementStatus(accountId, enforcementMock, '123');

    cy.intercept('GET', '/opal-fines-service/results', EMPTY_RESULTS_RESPONSE).as('getNextPermittedEnfActions');
    setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

    cy.contains('h2', 'Actions').parent().contains('a', 'Add enforcement action').should('exist').click();
    cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../enforcement/action/select']);

    cy.get(ENF_ACTION_SELECT.pageTitle).should('contain.text', 'Add enforcement action');
    cy.get(ENF_ACTION_SELECT.actionDropdown).should('exist');

    cy.get(ENF_ACTION_SELECT.accountInfo).should('contain.text', '177A - Robert Thomson');
  });

  it('AC3,a,b,d,e. Individual: Account meets conditions to cause info banner update', () => {
    let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
    headerMock.debtor_type = 'individual';
    headerMock.is_youth = true;
    headerMock.account_status_reference.account_status_code = 'L';
    let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
    // enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';
    enforcementMock.enforcement_overview.collection_order!.collection_order_flag = false;
    const accountId = headerMock.defendant_account_party_id;
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, '123');
    interceptEnforcementStatus(accountId, enforcementMock, '123');

    cy.intercept('GET', '/opal-fines-service/results', EMPTY_RESULTS_RESPONSE).as('getNextPermittedEnfActions');
    setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

    cy.contains('h2', 'Actions').parent().contains('a', 'Add enforcement action').should('exist').click();
    cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../enforcement/action/select']);

    cy.get(ENF_ACTION_SELECT.pageTitle).should('contain.text', 'Add enforcement action');
    cy.get(ENF_ACTION_SELECT.actionDropdown).should('exist');
    cy.get(ENF_ACTION_SELECT.continueButton).should('exist');
    cy.get(ENF_ACTION_SELECT.cancelLink).should('exist');
    // tbc if needing to add a enforce action here to show can continue or fields being available is sufficient?

    cy.get(ENF_ACTION_SELECT.accountInfo).should('contain.text', '177A - Robert Thomson');
  });
});
