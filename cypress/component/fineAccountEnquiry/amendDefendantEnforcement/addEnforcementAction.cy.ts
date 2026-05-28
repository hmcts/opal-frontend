import { DOM_ELEMENTS as ENF_ACTION_SELECT } from '../../../shared/selectors/account-enquiry/account.enquiry.enforcement-action-select.locators';
import { ACCOUNT_ENQUIRY_ENFORCEMENT_STATUS_ELEMENTS as ENF } from '../../../shared/selectors/account-enquiry/account.enquiry.enforcement.locators';
import { setupAccountEnquiryComponent } from '../accountEnquiry/setup/SetupComponent';
import { IComponentProperties } from '../accountEnquiry/setup/setupComponent.interface';
import {
  interceptAuthenticatedUser,
  interceptUserState,
  interceptNextPermittedEnforcementActionsEmpty,
  interceptNextPermittedEnforcementActions,
} from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from 'cypress/component/CommonIntercepts/CommonUserState.mocks';
import {
  interceptDefendantHeader,
  interceptEnforcementStatus,
} from '../accountEnquiry/intercept/defendantAccountIntercepts';
import {
  createDefendantHeaderMockWithName,
  DEFENDANT_HEADER_ORG_MOCK,
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

// Note: 'Adult or youth with Parent/Guardian' has not been incl - it uses the same common code and results as 'Adult/youth'
describe(
  'Add enforcement action in enforcement tab',
  {
    tags: ['@JIRA-EPIC:PO-1674', '@JIRA-LABEL:Add_and_Remove_Defendant_Enforcement_Actions'],
  },
  () => {
    it(
      'AC1,1a, AC2,2a,2b. Individual: navigates to the select enforcement action screen and displays the form incl details',
      { tags: ['@JIRA-STORY:PO-1780', '@JIRA-STORY:PO-1824', '@JIRA-EPIC:PO-1674', '@JIRA-TEST-KEY:PO-4439'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';
        enforcementMock.next_enforcement_action_data = null;
        const accountId = headerMock.defendant_account_party_id;
        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');

        interceptNextPermittedEnforcementActionsEmpty();
        setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

        cy.get(ENF.addEnforcementActionLink).should('exist').click();
        cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../enforcement/action/select']);

        cy.get(ENF_ACTION_SELECT.pageTitle).should('contain.text', 'Add enforcement action');
        cy.get(ENF_ACTION_SELECT.actionDropdown).should('exist');

        cy.get(ENF_ACTION_SELECT.accountInfo).should('contain.text', '177A - Mr Robert THOMSON');
      },
    );

    // it(
    //   'AC1,1a. Individual: Negative testing, account status code is Consolidated so hits error page.',
    //   { tags: ['@JIRA-STORY:PO-1780', '@JIRA-STORY:PO-1824'] },
    //   () => {
    //     let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
    //     headerMock.debtor_type = 'Defendant';
    //     headerMock.account_status_reference.account_status_code = 'CS';
    //     let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
    //     enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';
    //     enforcementMock.next_enforcement_action_data = null;
    //     const accountId = headerMock.defendant_account_party_id;
    //     interceptAuthenticatedUser();
    //     interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    //     interceptDefendantHeader(accountId, headerMock, '123');
    //     interceptEnforcementStatus(accountId, enforcementMock, '123');

    //     interceptNextPermittedEnforcementActionsEmpty();
    //     setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

    //     cy.get(ENF.addEnforcementActionLink).should('exist').click();

    //     //   cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../enforcement/action/cannot-add-enforcement-action']);

    //   cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../enforcement/action/<real-route-here>']);
    // });
    //   },
    // );

    it(
      'AC1,1a. Individual: Negative testing, result ID is DW so without NOENF the add enf action button does not appear.',
      { tags: ['@JIRA-STORY:PO-1780', '@JIRA-STORY:PO-1824', '@JIRA-EPIC:PO-1674', '@JIRA-TEST-KEY:PO-4440'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'DW';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Warrant of Control';
        enforcementMock.next_enforcement_action_data = null;
        const accountId = headerMock.defendant_account_party_id;
        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');

        interceptNextPermittedEnforcementActionsEmpty();
        setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

        cy.get(ENF.addEnforcementActionLink).should('not.exist');
      },
    );

    // it(
    //   'AC1,1a. Individual: Negative testing, action data is populated so hits error page.',
    //   { tags: ['@JIRA-STORY:PO-1780', '@JIRA-STORY:PO-1824'] },
    //   () => {
    //     let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
    //     headerMock.debtor_type = 'Defendant';
    //     headerMock.account_status_reference.account_status_code = 'L';
    //     let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
    //     enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';
    //     enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'No enforcement';
    //     enforcementMock.next_enforcement_action_data = 'WOC, WOA';
    //     const accountId = headerMock.defendant_account_party_id;
    //     interceptAuthenticatedUser();
    //     interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    //     interceptDefendantHeader(accountId, headerMock, '123');
    //     interceptEnforcementStatus(accountId, enforcementMock, '123');

    //     interceptNextPermittedEnforcementActionsEmpty();
    //     setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

    //     cy.get(ENF.addEnforcementActionLink).should('exist').click();

    //     //   cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../enforcement/action/cannot-add-enforcement-action']);

    //   cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../enforcement/action/<real-route-here>']);
    // });
    //   },
    // );

    it(
      'AC3,a,b,d, Individual: Account meets conditions to cause info banner update',
      { tags: ['@JIRA-STORY:PO-1780', '@JIRA-STORY:PO-1824', '@JIRA-EPIC:PO-1674', '@JIRA-TEST-KEY:PO-4441'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.is_youth = true;
        headerMock.account_status_reference.account_status_code = 'L';
        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'No enforcement';
        enforcementMock.next_enforcement_action_data = 'WOC, WOA';
        enforcementMock.enforcement_overview.collection_order!.collection_order_flag = false;
        const accountId = headerMock.defendant_account_party_id;
        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');

        interceptNextPermittedEnforcementActions(['WOC', 'WOA']);
        setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

        cy.get(ENF.addEnforcementActionLink).should('exist').click();
        cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../enforcement/action/select']);

        cy.get(ENF_ACTION_SELECT.pageTitle).should('contain.text', 'Add enforcement action');
        cy.get(ENF_ACTION_SELECT.actionDropdown).should('exist');
        cy.get(ENF_ACTION_SELECT.continueButton).should('exist');
        cy.get(ENF_ACTION_SELECT.cancelLink).should('exist');

        cy.get(ENF_ACTION_SELECT.accountInfo).should('contain.text', '177A - Mr Robert THOMSON');
        cy.get(ENF_ACTION_SELECT.informationBannerListItems).should('have.length', 2);
        cy.get(ENF_ACTION_SELECT.informationBannerListItems)
          .eq(0)
          .should('contain.text', 'There is no collection order on this account');
        cy.get(ENF_ACTION_SELECT.informationBannerListItems).eq(1).should('contain.text', 'This is a youth account');

        // AC3e which is not yet implemented. When PO-1782 completes could use this to confirm navigation upon continue.
        // cy.get(ENF_ACTION_SELECT.actionDropdown).click();
        // cy.get(ENF_ACTION_SELECT.actionDropdownOptions).contains('Warrant of Control').click();
        // cy.get(ENF_ACTION_SELECT.continueButton).click();

        // cy.get('@routerNavigate').should('have.been.calledWithMatch', ['details']);
        // cy.get(ENF.tabName).should('contain.text', 'Enforcement');
      },
    );

    it(
      'AC4,a,ai,aii, AC5,a, Individual: Enforcement actions dropdown confirmation',
      { tags: ['@JIRA-STORY:PO-1780', '@JIRA-STORY:PO-1824', '@JIRA-EPIC:PO-1674', '@JIRA-TEST-KEY:PO-4442'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'No enforcement';
        enforcementMock.next_enforcement_action_data = 'WOC, WOA';
        enforcementMock.enforcement_overview.collection_order!.collection_order_flag = true;
        const accountId = headerMock.defendant_account_party_id;
        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');

        interceptNextPermittedEnforcementActions(['WOC', 'WOA']);
        setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

        cy.get(ENF.addEnforcementActionLink).should('exist').click();
        cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../enforcement/action/select']);

        cy.get(ENF_ACTION_SELECT.actionDropdownLabel).should('contain.text', 'Select an enforcement action');
        cy.get(ENF_ACTION_SELECT.actionDropdown).should('have.value', '');
        cy.get(ENF_ACTION_SELECT.actionDropdown).click();
        cy.get(ENF_ACTION_SELECT.actionDropdownOptions)
          .should('contain.text', 'Warrant of Control (WOC)')
          .and('contain.text', 'Warrant of Arrest (WOA)');
        cy.get(ENF_ACTION_SELECT.actionDropdown).type('{esc}');

        cy.get(ENF_ACTION_SELECT.continueButton).click();
        cy.get(ENF_ACTION_SELECT.errorSummaryList).should('contain.text', 'Select an enforcement action');
        cy.get(ENF_ACTION_SELECT.actionDropdownError).should('contain.text', 'Select an enforcement action');

        // AC5c which is not yet implemented. When PO-1782 completes could use this to confirm navigation upon continue.
        // cy.get(ENF_ACTION_SELECT.actionDropdown).click();
        // cy.get(ENF_ACTION_SELECT.actionDropdownOptions).contains('Warrant of Control').click();
        // cy.get(ENF_ACTION_SELECT.continueButton).click();

        // cy.get('@routerNavigate').should('have.been.calledWithMatch', ['details']);
        // cy.get(ENF.tabName).should('contain.text', 'Enforcement');
      },
    );

    // Once route is established in PO 1781 then could uncomment and cover navigation coverage here.
    // it('AC5b, Individual: Enforcement actions continue no employment history', () => {
    //   let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
    //   headerMock.debtor_type = 'individual';
    //   headerMock.account_status_reference.account_status_code = 'L';
    //   let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
    //   enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';
    //   enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'No enforcement';
    //   enforcementMock.next_enforcement_action_data = 'WOC, WOA';
    //   enforcementMock.enforcement_overview.collection_order!.collection_order_flag = true;
    //   enforcementMock.employer_flag = false;

    //   const accountId = headerMock.defendant_account_party_id;
    //   interceptAuthenticatedUser();
    //   interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    //   interceptDefendantHeader(accountId, headerMock, '123');
    //   interceptEnforcementStatus(accountId, enforcementMock, '123');

    //   interceptNextPermittedEnforcementActions(['WOC', 'WOA']);
    //   setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

    //   cy.get(ENF.addEnforcementActionLink).should('exist').click();
    //   cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../enforcement/action/select']);

    //   cy.get(ENF_ACTION_SELECT.actionDropdown).click();
    //   cy.get(ENF_ACTION_SELECT.actionDropdownOptions).contains('Warrant of Control').click();
    //   cy.get(ENF_ACTION_SELECT.continueButton).click();

    //   cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../enforcement/action/cannot-add']);

    //   cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../enforcement/action/<real-route-here>']);
    // });

    it(
      'AC6,a Individual: Cancel path no warning',
      { tags: ['@JIRA-STORY:PO-1780', '@JIRA-STORY:PO-1824', '@JIRA-EPIC:PO-1674', '@JIRA-TEST-KEY:PO-4443'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'No enforcement';
        enforcementMock.next_enforcement_action_data = 'WOC, WOA';
        enforcementMock.enforcement_overview.collection_order!.collection_order_flag = true;
        const accountId = headerMock.defendant_account_party_id;
        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');

        interceptNextPermittedEnforcementActions(['WOC', 'WOA']);
        setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

        cy.get(ENF.addEnforcementActionLink).should('exist').click();
        cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../enforcement/action/select']);

        cy.get(ENF_ACTION_SELECT.cancelLink).click();
        cy.get('@routerNavigate').should('have.been.calledWithMatch', ['details']);
        cy.get(ENF.tabName).should('contain.text', 'Enforcement');
      },
    );

    it(
      'AC6,b Individual: Cancel path/warning',
      { tags: ['@JIRA-STORY:PO-1780', '@JIRA-STORY:PO-1824', '@JIRA-EPIC:PO-1674', '@JIRA-TEST-KEY:PO-4444'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'No enforcement';
        enforcementMock.next_enforcement_action_data = 'WOC, WOA';
        enforcementMock.enforcement_overview.collection_order!.collection_order_flag = true;
        const accountId = headerMock.defendant_account_party_id;
        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');

        interceptNextPermittedEnforcementActions(['WOC', 'WOA']);
        setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

        cy.get(ENF.addEnforcementActionLink).should('exist').click();
        cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../enforcement/action/select']);

        cy.get(ENF_ACTION_SELECT.actionDropdown).click();
        cy.get(ENF_ACTION_SELECT.actionDropdownOptions).contains('Warrant of Control').click();

        cy.window().then((win) => {
          cy.stub(win, 'confirm')
            .callsFake((message: string) => {
              expect(message.replace(/\s+/g, ' ')).to.match(/unsaved changes/i);
              return false;
            })
            .as('confirmDismiss');
        });

        cy.get(ENF_ACTION_SELECT.cancelLink).click();
        cy.get('@confirmDismiss').should('have.been.calledOnce');

        cy.get(ENF_ACTION_SELECT.pageTitle).should('contain.text', 'Add enforcement action');
      },
    );

    it(
      'AC2b, 3c. Company: navigates to the select enforcement action screen and displays the form incl details',
      { tags: ['@JIRA-STORY:PO-1834', '@JIRA-EPIC:PO-1674', '@JIRA-TEST-KEY:PO-4445'] },
      () => {
        let headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';
        enforcementMock.next_enforcement_action_data = null;
        const accountId = headerMock.defendant_account_party_id;
        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');

        interceptNextPermittedEnforcementActionsEmpty();
        setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

        cy.get(ENF.addEnforcementActionLink).should('exist').click();
        cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../enforcement/action/select']);

        cy.get(ENF_ACTION_SELECT.pageTitle).should('contain.text', 'Add enforcement action');
        cy.get(ENF_ACTION_SELECT.actionDropdown).should('exist');
        cy.get(ENF_ACTION_SELECT.informationBanner).should('contain.text', 'This is a company account');
        cy.get(ENF_ACTION_SELECT.accountInfo).should('contain.text', '177A - Sainsco');
      },
    );
  },
);
