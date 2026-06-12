import { DOM_ELEMENTS as ENF_ACTION_SELECT } from '../../../shared/selectors/account-enquiry/account.enquiry.enforcement-action-select.locators';
import { DOM_ELEMENTS as ENF_ACTION_ADD } from '../accountEnquiry/locators/account.enquiry.enforcement-action-add.locators';
import { ACCOUNT_ENQUIRY_ENFORCEMENT_STATUS_ELEMENTS as ENF } from '../../../shared/selectors/account-enquiry/account.enquiry.enforcement.locators';
import { setupAccountEnquiryComponent } from '../accountEnquiry/setup/SetupComponent';
import { buildSeededAccountStore, buildSeededGlobalStore } from '../accountEnquiry/setup/SeededStores';
import { IComponentProperties } from '../accountEnquiry/setup/setupComponent.interface';
import { Routes } from '@angular/router';
import { routing } from 'src/app/flows/fines/fines-acc/routing/fines-acc.routes';
import {
  interceptAuthenticatedUser,
  interceptUserState,
  interceptNextPermittedEnforcementActionsEmpty,
  interceptNextPermittedEnforcementActions,
  interceptResultByCode,
  interceptEnforcers,
} from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from 'cypress/component/CommonIntercepts/CommonUserState.mocks';
import {
  interceptDefendantHeader,
  interceptEnforcementStatus,
} from '../accountEnquiry/intercept/defendantAccountIntercepts';
import {
  createDefendantHeaderMockWithName,
  createParentGuardianHeaderMockWithName,
  DEFENDANT_HEADER_ORG_MOCK,
} from '../accountEnquiry/mocks/defendant_details_mock';
import { FINES_ACC_ENF_ACTION_ADD_RESULT_MOCK } from '@app/flows/fines/fines-acc/fines-acc-enf-action-add/mocks/fines-acc-enf-action-add-result.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { ADD_ENFORCEMENT_ACTION_ALL_FIELD_TYPES_RESULT_MOCK } from './mocks/add_enforcement_action_all_field_type_result.mock';

const finesAccountRoutes: Routes = [
  {
    path: 'fines/account',
    children: routing.filter((route) => route.path !== 'account'),
  },
];

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

function setupAddEnforcementActionDetailsRoute(
  accountId: string,
  targetPath: string,
  userState = USER_STATE_MOCK_PERMISSION_BU77,
  accountStateOverrides = {},
) {
  setupAccountEnquiryComponent({
    accountId,
    fragments: undefined,
    interceptedRoutes: [],
    routerConfig: finesAccountRoutes,
    targetPath,
    globalStoreFactory: () => buildSeededGlobalStore(userState),
    finesAccountStoreFactory: () =>
      buildSeededAccountStore(accountId, {
        party_name: 'Mr Robert THOMSON',
        party_type: 'Defendant',
        base_version: '1',
        business_unit_id: '77',
        business_unit_user_id: 'L077AO',
        welsh_speaking: 'No',
        ...accountStateOverrides,
      }),
  });
}

const statusScenarios = [
  { code: 'CS', reason: 'Consolidated' },
  { code: 'WO', reason: 'Written off' },
  { code: 'TO', reason: 'Transferred out' },
  { code: 'TS', reason: 'TFO Out Acknowledged' },
  { code: 'TA', reason: 'TFO to be Acknowledged' },
];

const EMPLOYMENT_REQUIRED_ACTION = {
  result_id: 'AEOC',
  result_title: 'Attachment of Earnings Order',
};

const interceptEmploymentRequiredAction = () => {
  cy.intercept('GET', `/opal-fines-service/results?result_ids=${EMPLOYMENT_REQUIRED_ACTION.result_id}`, {
    statusCode: 200,
    body: {
      count: 1,
      refData: [
        {
          result_id: EMPLOYMENT_REQUIRED_ACTION.result_id,
          result_title: EMPLOYMENT_REQUIRED_ACTION.result_title,
          result_title_cy: null,
          active: true,
          result_type: 'Result',
          imposition_creditor: '',
          imposition_allocation_order: null,
        },
      ],
    },
  }).as('getNextPermittedEnfActions');

  cy.intercept(
    {
      method: 'GET',
      pathname: `/opal-fines-service/results/${EMPLOYMENT_REQUIRED_ACTION.result_id}`,
    },
    {
      statusCode: 200,
      body: {
        result_id: EMPLOYMENT_REQUIRED_ACTION.result_id,
        result_title: EMPLOYMENT_REQUIRED_ACTION.result_title,
        requires_employment_data: true,
      },
    },
  ).as('getResultByCode');
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
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'WOC';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Warrant of Control';
        enforcementMock.next_enforcement_action_data = 'WOC';
        const accountId = headerMock.defendant_account_party_id;
        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');

        interceptNextPermittedEnforcementActions(['WOC']);
        setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

        cy.get(ENF.addEnforcementActionLink).should('exist').click();

        cy.get(ENF_ACTION_SELECT.pageTitle).should('contain.text', 'Add enforcement action');
        cy.get(ENF_ACTION_SELECT.actionDropdown).should('exist');

        cy.get(ENF_ACTION_SELECT.accountInfo).should('contain.text', '177A - Mr Robert THOMSON');
      },
    );

    statusScenarios.forEach(({ code, reason }) => {
      it(
        `Negative test: account status ${code} shows correct error page`,
        { tags: ['@JIRA-STORY:PO-1780', '@JIRA-STORY:PO-1824', '@JIRA-STORY:PO-1781', '@JIRA-STORY:PO-1825'] },
        () => {
          let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));

          headerMock.debtor_type = 'Defendant';
          headerMock.account_status_reference.account_status_code = code;

          let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

          enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';

          enforcementMock.next_enforcement_action_data = null;

          const accountId = headerMock.defendant_account_party_id;

          interceptAuthenticatedUser();
          interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
          interceptDefendantHeader(accountId, headerMock, '123');
          interceptEnforcementStatus(accountId, enforcementMock, '123');
          interceptNextPermittedEnforcementActionsEmpty();

          setupAccountEnquiryComponent({
            ...COMPONENT_PROPERTIES,
            accountId,
          });

          cy.get(ENF.addEnforcementActionLink).should('exist').click();

          cy.contains('Robert THOMSON').should('be.visible');

          // common error text
          cy.contains('You cannot add an enforcement action to an account that has a status of').should('be.visible');

          // status-specific text
          cy.contains(reason).should('be.visible');

          cy.contains('Go back').click();
        },
      );
    });

    it(
      'Negative test: NOENF with no next permitted actions shows error screen and Go back returns to enforcement tab',
      { tags: ['@JIRA-STORY:PO-1781', '@JIRA-STORY:PO-1825'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));

        headerMock.debtor_type = 'Defendant';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';

        enforcementMock.next_enforcement_action_data = null;

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');

        // No permitted next actions
        interceptNextPermittedEnforcementActionsEmpty();

        setupAccountEnquiryComponent({
          ...COMPONENT_PROPERTIES,
          accountId,
        });

        // Navigate to error page
        cy.get(ENF.addEnforcementActionLink).should('exist').click();

        // AC2a
        cy.contains('You cannot add an enforcement action').should('be.visible');

        // AC2b
        cy.contains('Robert THOMSON').should('be.visible');

        // AC2c
        cy.contains('You must first remove the enforcement hold on the account.').should('be.visible');

        // AC3 - Go back
        cy.contains('Go back').click();
      },
    );

    it(
      'Negative test: last enforcement has no next permitted actions shows error screen',
      { tags: ['@JIRA-STORY:PO-1781', '@JIRA-STORY:PO-1825'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));

        headerMock.debtor_type = 'Defendant';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

        // Example last enforcement with no next permitted actions
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'ENFHOLD';

        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Enforcement on hold';

        enforcementMock.next_enforcement_action_data = null;

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');

        // Empty permitted actions
        interceptNextPermittedEnforcementActionsEmpty();

        setupAccountEnquiryComponent({
          ...COMPONENT_PROPERTIES,
          accountId,
        });

        cy.get(ENF.addEnforcementActionLink).should('exist').click();

        // AC2a
        cy.contains('You cannot add an enforcement action').should('be.visible');

        // AC2b
        cy.contains('Robert THOMSON').should('be.visible');

        // AC2c
        cy.contains('You cannot add an enforcement action to an account that has a last enforcement action of:').should(
          'be.visible',
        );

        // AC2ci
        cy.contains('Enforcement on hold (ENFHOLD)').should('be.visible');

        // AC3
        cy.contains('Go back').click();
      },
    );

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
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'WOC';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Warrant of Control';
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
      'AC4,a,ai,aii, AC5,a,c Individual: Enforcement actions dropdown confirmation',
      { tags: ['@JIRA-STORY:PO-1780', '@JIRA-STORY:PO-1824', '@JIRA-EPIC:PO-1674', '@JIRA-TEST-KEY:PO-4442'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'WOC';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Warrant of Control';
        enforcementMock.next_enforcement_action_data = 'WOC, WOA';
        enforcementMock.enforcement_overview.collection_order!.collection_order_flag = true;
        const accountId = headerMock.defendant_account_party_id;
        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');

        interceptNextPermittedEnforcementActions(['WOC', 'WOA']);
        interceptEnforcers();

        const warrantOfControlResultMock = structuredClone(FINES_ACC_ENF_ACTION_ADD_RESULT_MOCK);
        warrantOfControlResultMock.result_id = 'WOC';
        warrantOfControlResultMock.result_title = 'Warrant of Control';
        warrantOfControlResultMock.allow_payment_terms = false;

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/WOC',
          },
          {
            statusCode: 200,
            body: warrantOfControlResultMock,
          },
        ).as('getWarrantOfControlResult');

        setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

        cy.get(ENF.addEnforcementActionLink).should('exist').click();

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

        // AC5c
        cy.get(ENF_ACTION_SELECT.actionDropdown).click();
        cy.get(ENF_ACTION_SELECT.actionDropdownOptions).contains('Warrant of Control').click();
        cy.get(ENF_ACTION_SELECT.continueButton).click();

        cy.wait('@getWarrantOfControlResult');

        cy.get('opal-lib-govuk-heading-with-caption > h1').should('contain.text', 'Warrant of Control');
        cy.get(ENF_ACTION_ADD.reasonInput).should('be.visible');
      },
    );

    it(
      'AC1,1a,2a,2b,2c,3. Individual: displays the employment details denied screen when the selected action requires employment data and Go back returns to select enforcement action',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-1674'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'WOC';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Warrant of Control';
        enforcementMock.next_enforcement_action_data = EMPLOYMENT_REQUIRED_ACTION.result_id;
        enforcementMock.enforcement_overview.collection_order!.collection_order_flag = true;
        enforcementMock.employer_flag = false;

        const accountId = headerMock.defendant_account_party_id;
        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEmploymentRequiredAction();

        setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

        cy.get(ENF.addEnforcementActionLink).should('exist').click();
        cy.get(ENF_ACTION_SELECT.actionDropdown).click();
        cy.get(ENF_ACTION_SELECT.actionDropdownOptions).contains(EMPLOYMENT_REQUIRED_ACTION.result_title).click();
        cy.get(ENF_ACTION_SELECT.continueButton).click();

        cy.get(ENF_ACTION_SELECT.pageTitle).should('contain.text', 'You cannot add this enforcement action');
        cy.get(ENF_ACTION_SELECT.accountInfo).should('contain.text', '177A - Mr Robert THOMSON');
        cy.contains(`${EMPLOYMENT_REQUIRED_ACTION.result_title} (${EMPLOYMENT_REQUIRED_ACTION.result_id})`).should(
          'be.visible',
        );
        cy.contains('The account has missing or incomplete employment details.').should('be.visible');

        cy.contains('Go back').click();
        cy.get(ENF_ACTION_SELECT.pageTitle).should('contain.text', 'Add enforcement action');
        cy.get(ENF_ACTION_SELECT.accountInfo).should('contain.text', '177A - Mr Robert THOMSON');
      },
    );

    it(
      'AC1,1a,2a,2b,2c,3. Parent/Guardian: displays the employment details denied screen when the selected action requires employment data and Go back returns to select enforcement action',
      { tags: ['@JIRA-STORY:PO-1831', '@JIRA-EPIC:PO-1674'] },
      () => {
        let headerMock = structuredClone(createParentGuardianHeaderMockWithName('Pat', 'Taylor'));
        headerMock.account_status_reference.account_status_code = 'L';
        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'WOC';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Warrant of Control';
        enforcementMock.next_enforcement_action_data = EMPLOYMENT_REQUIRED_ACTION.result_id;
        enforcementMock.enforcement_overview.collection_order!.collection_order_flag = true;
        enforcementMock.employer_flag = false;

        const accountId = headerMock.defendant_account_party_id;
        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEmploymentRequiredAction();

        setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

        cy.get(ENF.addEnforcementActionLink).should('exist').click();
        cy.get(ENF_ACTION_SELECT.actionDropdown).click();
        cy.get(ENF_ACTION_SELECT.actionDropdownOptions).contains(EMPLOYMENT_REQUIRED_ACTION.result_title).click();
        cy.get(ENF_ACTION_SELECT.continueButton).click();

        cy.get(ENF_ACTION_SELECT.pageTitle).should('contain.text', 'You cannot add this enforcement action');
        cy.get(ENF_ACTION_SELECT.accountInfo).should('contain.text', '177A - Mr Pat TAYLOR');
        cy.contains(`${EMPLOYMENT_REQUIRED_ACTION.result_title} (${EMPLOYMENT_REQUIRED_ACTION.result_id})`).should(
          'be.visible',
        );
        cy.contains('The account has missing or incomplete employment details.').should('be.visible');

        cy.contains('Go back').click();
        cy.get(ENF_ACTION_SELECT.pageTitle).should('contain.text', 'Add enforcement action');
        cy.get(ENF_ACTION_SELECT.accountInfo).should('contain.text', '177A - Mr Pat TAYLOR');
      },
    );

    it(
      'AC6,a Individual: Cancel path no warning',
      {
        tags: [
          '@JIRA-STORY:PO-1780',
          '@JIRA-STORY:PO-1782',
          '@JIRA-STORY:PO-1824',
          '@JIRA-EPIC:PO-1674',
          '@JIRA-TEST-KEY:PO-4443',
        ],
      },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'WOC';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Warrant of Control';
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
        cy.get(ENF_ACTION_SELECT.pageTitle).should('contain.text', 'Add enforcement action');

        cy.get(ENF_ACTION_SELECT.cancelLink).click();
        cy.get('@routerNavigate').should('have.been.calledWithMatch', ['details']);
        cy.get(ENF.tabName).should('contain.text', 'Enforcement');
      },
    );

    it(
      'AC6,b. Individual: Cancel path/warning',
      {
        tags: [
          '@JIRA-STORY:PO-1780',
          '@JIRA-STORY:PO-1782',
          '@JIRA-STORY:PO-1824',
          '@JIRA-EPIC:PO-1674',
          '@JIRA-TEST-KEY:PO-4444',
        ],
      },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'WOC';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Warrant of Control';
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
        cy.get(ENF_ACTION_SELECT.pageTitle).should('contain.text', 'Add enforcement action');

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
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'WOC';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Warrant of Control';
        enforcementMock.next_enforcement_action_data = 'WOC';
        const accountId = headerMock.defendant_account_party_id;
        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');

        interceptNextPermittedEnforcementActions(['WOC']);
        setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

        cy.get(ENF.addEnforcementActionLink).should('exist').click();

        cy.get(ENF_ACTION_SELECT.pageTitle).should('contain.text', 'Add enforcement action');
        cy.get(ENF_ACTION_SELECT.actionDropdown).should('exist');
        cy.get(ENF_ACTION_SELECT.informationBanner).should('contain.text', 'This is a company account');
        cy.get(ENF_ACTION_SELECT.accountInfo).should('contain.text', '177A - Sainsco');
      },
    );

    it(
      'AC1,1a,2a,2b,2c,3. Company: displays the employment details denied screen when the selected action requires employment data and Go back returns to select enforcement action',
      { tags: ['@JIRA-STORY:PO-1841', '@JIRA-EPIC:PO-1674'] },
      () => {
        let headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'WOC';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Warrant of Control';
        enforcementMock.next_enforcement_action_data = EMPLOYMENT_REQUIRED_ACTION.result_id;
        enforcementMock.enforcement_overview.collection_order!.collection_order_flag = true;
        enforcementMock.employer_flag = false;

        const accountId = headerMock.defendant_account_party_id;
        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEmploymentRequiredAction();

        setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

        cy.get(ENF.addEnforcementActionLink).should('exist').click();
        cy.get(ENF_ACTION_SELECT.actionDropdown).click();
        cy.get(ENF_ACTION_SELECT.actionDropdownOptions).contains(EMPLOYMENT_REQUIRED_ACTION.result_title).click();
        cy.get(ENF_ACTION_SELECT.continueButton).click();

        cy.get(ENF_ACTION_SELECT.pageTitle).should('contain.text', 'You cannot add this enforcement action');
        cy.get(ENF_ACTION_SELECT.accountInfo).should('contain.text', '177A - Sainsco');
        cy.contains(`${EMPLOYMENT_REQUIRED_ACTION.result_title} (${EMPLOYMENT_REQUIRED_ACTION.result_id})`).should(
          'be.visible',
        );
        cy.contains('The account has missing or incomplete employment details.').should('be.visible');

        cy.contains('Go back').click();
        cy.get(ENF_ACTION_SELECT.pageTitle).should('contain.text', 'Add enforcement action');
        cy.get(ENF_ACTION_SELECT.accountInfo).should('contain.text', '177A - Sainsco');
      },
    );

    statusScenarios.forEach(({ code, reason }) => {
      it(
        `Negative test: status ${code} shows correct error screen for company`,
        { tags: ['@JIRA-STORY:PO-1835'] },
        () => {
          let headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);

          headerMock.debtor_type = 'company';

          headerMock.account_status_reference.account_status_code = code;

          const enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

          enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';

          enforcementMock.next_enforcement_action_data = null;

          const accountId = headerMock.defendant_account_party_id;

          interceptAuthenticatedUser();
          interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
          interceptDefendantHeader(accountId, headerMock, '123');
          interceptEnforcementStatus(accountId, enforcementMock, '123');
          interceptNextPermittedEnforcementActionsEmpty();

          setupAccountEnquiryComponent({
            ...COMPONENT_PROPERTIES,
            accountId,
          });

          cy.get(ENF.addEnforcementActionLink).click();

          cy.contains('You cannot add an enforcement action to an account that has a status of').should('be.visible');

          cy.contains(reason).should('be.visible');

          cy.contains('177A - Sainsco').should('be.visible');

          cy.contains('Go back').click();
        },
      );
    });

    it('Negative test: NOENF shows remove hold error screen for company', { tags: ['@JIRA-STORY:PO-1835'] }, () => {
      let headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);

      headerMock.debtor_type = 'company';

      const enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';

      enforcementMock.next_enforcement_action_data = null;

      const accountId = headerMock.defendant_account_party_id;

      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      interceptNextPermittedEnforcementActionsEmpty();

      setupAccountEnquiryComponent({
        ...COMPONENT_PROPERTIES,
        accountId,
      });

      cy.get(ENF.addEnforcementActionLink).click();

      cy.contains('You must first remove the enforcement hold on the account.').should('be.visible');

      cy.contains('177A - Sainsco').should('be.visible');

      cy.contains('Go back').click();
    });

    it(
      'Negative test: No next permitted actions shows error screen for company',
      { tags: ['@JIRA-STORY:PO-1835'] },
      () => {
        let headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);

        headerMock.debtor_type = 'company';

        const enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'ENFHOLD';

        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Enforcement on hold';

        enforcementMock.next_enforcement_action_data = null;

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptNextPermittedEnforcementActionsEmpty();

        setupAccountEnquiryComponent({
          ...COMPONENT_PROPERTIES,
          accountId,
        });

        cy.get(ENF.addEnforcementActionLink).click();

        cy.contains('You cannot add an enforcement action to an account that has a last enforcement action of:').should(
          'be.visible',
        );

        cy.contains('Enforcement on hold (ENFHOLD)').should('be.visible');

        cy.contains('177A - Sainsco').should('be.visible');

        cy.contains('Go back').click();
      },
    );

    it(
      'AC1, AC1a. Selected enforcement action continues to the add enforcement action details screen',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'COLLO';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Collection order';
        enforcementMock.next_enforcement_action_data = 'COLLO';

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptNextPermittedEnforcementActions(['COLLO']);
        interceptEnforcers();

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/COLLO',
          },
          {
            statusCode: 200,
            body: FINES_ACC_ENF_ACTION_ADD_RESULT_MOCK,
          },
        ).as('getCollectionOrderResult');

        setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

        cy.get(ENF.addEnforcementActionLink).should('exist').click();

        cy.get(ENF_ACTION_SELECT.actionDropdown).click();
        cy.get(ENF_ACTION_SELECT.actionDropdownOptions).contains('Collection order').click();
        cy.get(ENF_ACTION_SELECT.continueButton).click();

        cy.wait('@getCollectionOrderResult');

        cy.get(ENF_ACTION_SELECT.pageTitle).should('contain.text', 'Collection order');
        cy.get(ENF_ACTION_SELECT.accountInfo).should('contain.text', '177A - Mr Robert THOMSON');
        cy.get(ENF_ACTION_ADD.reasonInput).should('be.visible');
        cy.get(ENF_ACTION_ADD.addEnforcementActionButton).should('be.visible');
      },
    );

    it(
      'AC2a, AC2b. Add enforcement action details screen shows the correct title and account identifier',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'COLLO';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Collection order';
        enforcementMock.next_enforcement_action_data = 'COLLO';

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEnforcers();

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/COLLO',
          },
          {
            statusCode: 200,
            body: FINES_ACC_ENF_ACTION_ADD_RESULT_MOCK,
          },
        ).as('getCollectionOrderResult');

        setupAddEnforcementActionDetailsRoute(
          accountId,
          `/fines/account/defendant/${accountId}/enforcement/action/add?resultId=COLLO`,
        );

        cy.wait('@getCollectionOrderResult');

        cy.get(ENF_ACTION_ADD.pageTitle).should('contain.text', 'Collection order (COLLO)');
        cy.get(ENF_ACTION_ADD.accountInfo).should('contain.text', '177A - Mr Robert THOMSON');
      },
    );

    it(
      'AC2a, AC2b. Company add enforcement action details screen shows the correct title and account identifier',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
      () => {
        let headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
        headerMock.debtor_type = 'company';
        headerMock.account_status_reference.account_status_code = 'L';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'COLLO';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Collection order';
        enforcementMock.next_enforcement_action_data = 'COLLO';

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEnforcers();

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/COLLO',
          },
          {
            statusCode: 200,
            body: FINES_ACC_ENF_ACTION_ADD_RESULT_MOCK,
          },
        ).as('getCollectionOrderResult');

        setupAddEnforcementActionDetailsRoute(
          accountId,
          `/fines/account/defendant/${accountId}/enforcement/action/add?resultId=COLLO`,
        );

        cy.wait('@getCollectionOrderResult');

        cy.get(ENF_ACTION_ADD.pageTitle).should('contain.text', 'Collection order (COLLO)');
        cy.get(ENF_ACTION_ADD.accountInfo).should('contain.text', '177A - Sainsco');
      },
    );

    it(
      'AC2d, AC2di. COLLO add enforcement action details screen displays payment terms section and days in default fields',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'COLLO';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Collection order';
        enforcementMock.next_enforcement_action_data = 'COLLO';

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEnforcers();

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/COLLO',
          },
          {
            statusCode: 200,
            body: FINES_ACC_ENF_ACTION_ADD_RESULT_MOCK,
          },
        ).as('getCollectionOrderResult');

        setupAddEnforcementActionDetailsRoute(
          accountId,
          `/fines/account/defendant/${accountId}/enforcement/action/add?resultId=COLLO`,
        );

        cy.wait('@getCollectionOrderResult');

        cy.contains(
          ENF_ACTION_ADD.changeExistingPaymentTermsLegend,
          'Do you want to change the existing payment terms?',
        ).should('be.visible');

        cy.get(ENF_ACTION_ADD.changeExistingPaymentTermsYesRadio).check({ force: true });

        cy.contains(ENF_ACTION_ADD.selectPaymentTermsLegend, 'Select payment terms').should('be.visible');
        cy.contains(ENF_ACTION_ADD.daysInDefaultLabel, 'Days in default').should('be.visible');
        cy.contains(ENF_ACTION_ADD.dateDaysInDefaultImposedLabel, 'Date days in default were last imposed').should(
          'be.visible',
        );
        cy.get(ENF_ACTION_ADD.daysInDefaultInput).should('exist');
      },
    );

    it(
      'AC2c. Add enforcement action details screen renders hint text, menu option copy and required versus optional behaviour from result parameters',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'COLLO';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Collection order';
        enforcementMock.next_enforcement_action_data = 'COLLO';

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEnforcers();

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/COLLO',
          },
          {
            statusCode: 200,
            body: ADD_ENFORCEMENT_ACTION_ALL_FIELD_TYPES_RESULT_MOCK,
          },
        ).as('getAllFieldTypesCollectionOrderResult');

        setupAddEnforcementActionDetailsRoute(
          accountId,
          `/fines/account/defendant/${accountId}/enforcement/action/add?resultId=COLLO`,
        );

        cy.wait('@getAllFieldTypesCollectionOrderResult');

        cy.contains('For example, account referred for enforcement').should('be.visible');
        cy.contains('For example, 31/01/2023').should('be.visible');
        cy.contains('legend', 'Collection type').should('be.visible');
        cy.contains('label', 'Standard').should('be.visible');
        cy.contains('label', 'Fast track').should('be.visible');
        cy.contains('legend', 'Select how it will be served').should('be.visible');
        cy.contains('label', 'Consecutive').should('be.visible');
        cy.contains('label', 'Concurrent').should('be.visible');

        cy.get(ENF_ACTION_ADD.addEnforcementActionButton).click();

        cy.get(ENF_ACTION_ADD.errorSummary).should('contain.text', 'Enter a/an Reason');
        cy.get(ENF_ACTION_ADD.errorSummary).should('contain.text', 'Enter a/an Days in custody');
        cy.get(ENF_ACTION_ADD.errorSummary).should('contain.text', 'Enter a/an Normal deduction rate');
        cy.get(ENF_ACTION_ADD.errorSummary).should('contain.text', 'Select a/an Collection type');
        cy.get(ENF_ACTION_ADD.errorSummary).should('not.contain.text', 'Hearing date');
        cy.get(ENF_ACTION_ADD.errorSummary).should('not.contain.text', 'Basis of committal');
      },
    );

    it(
      'AC3, AC3a, AC3ai. English and Welsh account shows Welsh companion field and Welsh hint text',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        headerMock.business_unit_summary.welsh_speaking = 'Y';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'COLLO';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Collection order';
        enforcementMock.next_enforcement_action_data = 'COLLO';

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEnforcers();

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/COLLO',
          },
          {
            statusCode: 200,
            body: ADD_ENFORCEMENT_ACTION_ALL_FIELD_TYPES_RESULT_MOCK,
          },
        ).as('getAllFieldTypesCollectionOrderResult');

        setupAddEnforcementActionDetailsRoute(
          accountId,
          `/fines/account/defendant/${accountId}/enforcement/action/add?resultId=COLLO`,
          USER_STATE_MOCK_PERMISSION_BU77,
          { welsh_speaking: 'Y' },
        );

        cy.wait('@getAllFieldTypesCollectionOrderResult');

        cy.get(ENF_ACTION_ADD.reasonLabel).should('contain.text', 'Reason');
        cy.get(ENF_ACTION_ADD.reasonWelshLabel).should('contain.text', 'Reason - Welsh version');
        cy.get(ENF_ACTION_ADD.reasonWelshHint).should('contain.text', 'Provide a Welsh version for the defendant');

        cy.get(ENF_ACTION_ADD.basisOfCommittalWelshLabel).should('contain.text', 'Basis of committal - Welsh version');
        cy.get(ENF_ACTION_ADD.basisOfCommittalWelshHint).should(
          'contain.text',
          'Provide a Welsh version for the defendant',
        );
      },
    );

    it(
      'AC3b, AC3bi, AC10a. If the English field is populated and the Welsh field is blank, the Welsh paired-field error is shown',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        headerMock.business_unit_summary.welsh_speaking = 'Y';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'COLLO';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Collection order';
        enforcementMock.next_enforcement_action_data = 'COLLO';

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEnforcers();

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/COLLO',
          },
          {
            statusCode: 200,
            body: ADD_ENFORCEMENT_ACTION_ALL_FIELD_TYPES_RESULT_MOCK,
          },
        ).as('getAllFieldTypesCollectionOrderResult');

        setupAddEnforcementActionDetailsRoute(
          accountId,
          `/fines/account/defendant/${accountId}/enforcement/action/add?resultId=COLLO`,
          USER_STATE_MOCK_PERMISSION_BU77,
          { welsh_speaking: 'Y' },
        );

        cy.wait('@getAllFieldTypesCollectionOrderResult');

        cy.get(ENF_ACTION_ADD.reasonInput).type('English reason');
        cy.get(ENF_ACTION_ADD.basisOfCommittalInput).type('English basis');
        cy.get(ENF_ACTION_ADD.addEnforcementActionButton).click();

        cy.get(ENF_ACTION_ADD.errorSummary).should('contain.text', 'Enter a/an Reason - Welsh version');
        cy.get(ENF_ACTION_ADD.reasonWelshError).should('contain.text', 'Enter a/an Reason - Welsh version');

        cy.get(ENF_ACTION_ADD.basisOCWelshError).should('contain.text', 'Enter a/an Basis of committal');
      },
    );

    it(
      'AC3b, AC3bii, AC10a. If the Welsh field is populated and the English field is blank, the English paired-field error is shown',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        headerMock.business_unit_summary.welsh_speaking = 'Y';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'COLLO';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Collection order';
        enforcementMock.next_enforcement_action_data = 'COLLO';

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEnforcers();

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/COLLO',
          },
          {
            statusCode: 200,
            body: ADD_ENFORCEMENT_ACTION_ALL_FIELD_TYPES_RESULT_MOCK,
          },
        ).as('getAllFieldTypesCollectionOrderResult');

        setupAddEnforcementActionDetailsRoute(
          accountId,
          `/fines/account/defendant/${accountId}/enforcement/action/add?resultId=COLLO`,
          USER_STATE_MOCK_PERMISSION_BU77,
          { welsh_speaking: 'Y' },
        );

        cy.wait('@getAllFieldTypesCollectionOrderResult');

        cy.get(ENF_ACTION_ADD.reasonWelshInput).type('Rheswm');
        cy.get(ENF_ACTION_ADD.basisOfCommittalWelshLabel).type('Rheswm');
        cy.get(ENF_ACTION_ADD.addEnforcementActionButton).click();

        cy.get(ENF_ACTION_ADD.errorSummary).should('contain.text', 'Enter a/an Reason');
        cy.get(ENF_ACTION_ADD.reasonError).should('contain.text', 'Enter a/an Reason');

        cy.get(ENF_ACTION_ADD.basisOCError).should('contain.text', 'Enter a/an Basis of committal');

        cy.contains('Enter a/an Basis of committal').should('be.visible');
      },
    );

    it(
      'AC4, AC4a, AC4d, AC10a. If the English & Welsh fields are blank, the English and Welsh field errors are shown',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        headerMock.business_unit_summary.welsh_speaking = 'Y';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'COLLO';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Collection order';
        enforcementMock.next_enforcement_action_data = 'COLLO';

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEnforcers();

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/COLLO',
          },
          {
            statusCode: 200,
            body: ADD_ENFORCEMENT_ACTION_ALL_FIELD_TYPES_RESULT_MOCK,
          },
        ).as('getAllFieldTypesCollectionOrderResult');

        setupAddEnforcementActionDetailsRoute(
          accountId,
          `/fines/account/defendant/${accountId}/enforcement/action/add?resultId=COLLO`,
          USER_STATE_MOCK_PERMISSION_BU77,
          { welsh_speaking: 'Y' },
        );

        cy.wait('@getAllFieldTypesCollectionOrderResult');

        cy.get(ENF_ACTION_ADD.addEnforcementActionButton).click();

        cy.get(ENF_ACTION_ADD.errorSummary).should('contain.text', 'Enter a/an Reason');
        cy.get(ENF_ACTION_ADD.errorSummary).should('contain.text', 'Enter a/an Reason - Welsh version');
        cy.get(ENF_ACTION_ADD.reasonError).should('contain.text', 'Enter a/an Reason');
        cy.get(ENF_ACTION_ADD.reasonWelshError).should('contain.text', 'Enter a/an Reason - Welsh version');
      },
    );

    it(
      'AC4b., AC4c, AC10a. If the user enters too many characters or invalid alpha/numerical',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        headerMock.business_unit_summary.welsh_speaking = 'Y';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'COLLO';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Collection order';
        enforcementMock.next_enforcement_action_data = 'COLLO';

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEnforcers();

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/COLLO',
          },
          {
            statusCode: 200,
            body: ADD_ENFORCEMENT_ACTION_ALL_FIELD_TYPES_RESULT_MOCK,
          },
        ).as('getAllFieldTypesCollectionOrderResult');

        setupAddEnforcementActionDetailsRoute(
          accountId,
          `/fines/account/defendant/${accountId}/enforcement/action/add?resultId=COLLO`,
          USER_STATE_MOCK_PERMISSION_BU77,
          { welsh_speaking: 'Y' },
        );

        cy.wait('@getAllFieldTypesCollectionOrderResult');

        cy.get(ENF_ACTION_ADD.reasonInput).type('a'.repeat(61), { delay: 0 });
        cy.get(ENF_ACTION_ADD.basisOfCommittalInput).type('©µ±ö€@');

        cy.get(ENF_ACTION_ADD.reasonWelshInput).type('a'.repeat(61), { delay: 0 });
        cy.get(ENF_ACTION_ADD.basisOfCommittalWelshLabel).type('©µ±ö€@');

        cy.get(ENF_ACTION_ADD.addEnforcementActionButton).click();

        cy.get(ENF_ACTION_ADD.errorSummary).should('contain.text', 'Reason must be 60 characters or fewer');
        cy.get(ENF_ACTION_ADD.reasonError).should('contain.text', 'Reason must be 60 characters or fewer');
        cy.get(ENF_ACTION_ADD.errorSummary).should(
          'contain.text',
          'Reason - Welsh version must be 60 characters or fewer',
        );
        cy.get(ENF_ACTION_ADD.reasonWelshError).should(
          'contain.text',
          'Reason - Welsh version must be 60 characters or fewer',
        );

        cy.get(ENF_ACTION_ADD.errorSummary).should(
          'contain.text',
          'Basis of committal must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)',
        );
        cy.get(ENF_ACTION_ADD.errorSummary).should(
          'contain.text',
          'Basis of committal - Welsh version must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)',
        );
      },
    );

    it(
      'AC5, AC5a, AC5b, AC5c, AC10a. If the user leaves the field blank, enters a invalid or incorrect format decimal value',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        headerMock.business_unit_summary.welsh_speaking = 'Y';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'COLLO';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Collection order';
        enforcementMock.next_enforcement_action_data = 'COLLO';

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEnforcers();

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/COLLO',
          },
          {
            statusCode: 200,
            body: ADD_ENFORCEMENT_ACTION_ALL_FIELD_TYPES_RESULT_MOCK,
          },
        ).as('getAllFieldTypesCollectionOrderResult');

        setupAddEnforcementActionDetailsRoute(
          accountId,
          `/fines/account/defendant/${accountId}/enforcement/action/add?resultId=COLLO`,
          USER_STATE_MOCK_PERMISSION_BU77,
          { welsh_speaking: 'Y' },
        );

        cy.wait('@getAllFieldTypesCollectionOrderResult');

        cy.get(ENF_ACTION_ADD.addEnforcementActionButton).click();
        cy.get(ENF_ACTION_ADD.errorSummary).should('contain.text', 'Enter a/an Normal deduction rate');
        cy.get(ENF_ACTION_ADD.normalDeductionRateError).should('contain.text', 'Enter a/an Normal deduction rate');

        cy.get(ENF_ACTION_ADD.normalDeductionRateInput).type('abc');
        cy.get(ENF_ACTION_ADD.addEnforcementActionButton).click();
        cy.get(ENF_ACTION_ADD.errorSummary).should('contain.text', 'Enter only numbers');

        cy.get(ENF_ACTION_ADD.normalDeductionRateInput).clear().type('10.123');
        cy.get(ENF_ACTION_ADD.addEnforcementActionButton).click();
        cy.get(ENF_ACTION_ADD.errorSummary).should('contain.text', 'Enter amount as 2 decimal places, such as 100.99');
      },
    );

    it(
      'AC6, AC6a, AC6b, AC6c, AC10a. If the user leaves the field blank, enters a invalid or incorrect format date',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        headerMock.business_unit_summary.welsh_speaking = 'Y';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'COLLO';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Collection order';
        enforcementMock.next_enforcement_action_data = 'COLLO';

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEnforcers();

        const mandatoryDateResultMock = structuredClone(ADD_ENFORCEMENT_ACTION_ALL_FIELD_TYPES_RESULT_MOCK);
        const resultParameters = JSON.parse(mandatoryDateResultMock.result_parameters!);
        const hearingDateField = resultParameters.find((field: { name: string }) => field.name === 'hearingdate');

        if (hearingDateField) {
          hearingDateField.mandatory = true;
        }

        mandatoryDateResultMock.result_parameters = JSON.stringify(resultParameters);

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/COLLO',
          },
          {
            statusCode: 200,
            body: mandatoryDateResultMock,
          },
        ).as('getMandatoryDateCollectionOrderResult');

        setupAddEnforcementActionDetailsRoute(
          accountId,
          `/fines/account/defendant/${accountId}/enforcement/action/add?resultId=COLLO`,
          USER_STATE_MOCK_PERMISSION_BU77,
          { welsh_speaking: 'Y' },
        );

        cy.wait('@getMandatoryDateCollectionOrderResult');

        cy.get(ENF_ACTION_ADD.addEnforcementActionButton).click();
        cy.get(ENF_ACTION_ADD.errorSummary).should('contain.text', 'Enter a/an Hearing date');
        cy.get(ENF_ACTION_ADD.hearingDateField)
          .contains(ENF_ACTION_ADD.inlineError, 'Enter a/an Hearing date')
          .should('be.visible');

        cy.get(ENF_ACTION_ADD.hearingDateInput).type('31/02/2026');
        cy.get(ENF_ACTION_ADD.addEnforcementActionButton).click();
        cy.get(ENF_ACTION_ADD.errorSummary).should('contain.text', 'Enter a valid date');

        cy.get(ENF_ACTION_ADD.hearingDateInput).type('1/1/24');
        cy.get(ENF_ACTION_ADD.addEnforcementActionButton).click();
        cy.get(ENF_ACTION_ADD.errorSummary).should('contain.text', 'Date must be in the format DD/MM/YYYY');
      },
    );

    it(
      'AC7, AC7a, AC10a. If the user leaves the field blank in a integer field it returns a error',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        headerMock.business_unit_summary.welsh_speaking = 'Y';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'COLLO';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Collection order';
        enforcementMock.next_enforcement_action_data = 'COLLO';

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEnforcers();

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/COLLO',
          },
          {
            statusCode: 200,
            body: ADD_ENFORCEMENT_ACTION_ALL_FIELD_TYPES_RESULT_MOCK,
          },
        ).as('getAllFieldTypesCollectionOrderResult');

        setupAddEnforcementActionDetailsRoute(
          accountId,
          `/fines/account/defendant/${accountId}/enforcement/action/add?resultId=COLLO`,
          USER_STATE_MOCK_PERMISSION_BU77,
          { welsh_speaking: 'Y' },
        );

        cy.wait('@getAllFieldTypesCollectionOrderResult');

        cy.get(ENF_ACTION_ADD.addEnforcementActionButton).click();
        cy.get(ENF_ACTION_ADD.errorSummary).should('contain.text', 'Enter a/an Days in custody');
        cy.get(ENF_ACTION_ADD.daysInCustodyError).should('contain.text', 'Enter a/an Days in custody');
      },
    );

    it(
      'AC7, AC7b, AC10a. If the user enteres a invalid input in the integer field it returns a error',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        headerMock.business_unit_summary.welsh_speaking = 'Y';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'COLLO';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Collection order';
        enforcementMock.next_enforcement_action_data = 'COLLO';

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEnforcers();

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/COLLO',
          },
          {
            statusCode: 200,
            body: ADD_ENFORCEMENT_ACTION_ALL_FIELD_TYPES_RESULT_MOCK,
          },
        ).as('getAllFieldTypesCollectionOrderResult');

        setupAddEnforcementActionDetailsRoute(
          accountId,
          `/fines/account/defendant/${accountId}/enforcement/action/add?resultId=COLLO`,
          USER_STATE_MOCK_PERMISSION_BU77,
          { welsh_speaking: 'Y' },
        );

        cy.wait('@getAllFieldTypesCollectionOrderResult');

        cy.get(ENF_ACTION_ADD.daysInCustodyInput).type('abc');
        cy.get(ENF_ACTION_ADD.addEnforcementActionButton).click();
        cy.get(ENF_ACTION_ADD.errorSummary).should('contain.text', 'Enter only numbers');
        cy.get(ENF_ACTION_ADD.daysInCustodyError).should('contain.text', 'Enter only numbers');
      },
    );

    it(
      'AC8, AC8a If the user leaves the field blank in a menu data type it returns a error',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        headerMock.business_unit_summary.welsh_speaking = 'Y';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'COLLO';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Collection order';
        enforcementMock.next_enforcement_action_data = 'COLLO';

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEnforcers();

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/COLLO',
          },
          {
            statusCode: 200,
            body: ADD_ENFORCEMENT_ACTION_ALL_FIELD_TYPES_RESULT_MOCK,
          },
        ).as('getAllFieldTypesCollectionOrderResult');

        setupAddEnforcementActionDetailsRoute(
          accountId,
          `/fines/account/defendant/${accountId}/enforcement/action/add?resultId=COLLO`,
          USER_STATE_MOCK_PERMISSION_BU77,
          { welsh_speaking: 'Y' },
        );

        cy.wait('@getAllFieldTypesCollectionOrderResult');

        cy.get(ENF_ACTION_ADD.addEnforcementActionButton).click();
        cy.get(ENF_ACTION_ADD.errorSummary).should('contain.text', 'Select a/an Collection type');
        cy.get(ENF_ACTION_ADD.collectionTypeError).should('contain.text', 'Select a/an Collection type');
      },
    );

    it(
      'AC9, AC9a If the user does not select whether to change payment terms or not a error is raised',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';
        headerMock.business_unit_summary.welsh_speaking = 'Y';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'COLLO';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Collection order';
        enforcementMock.next_enforcement_action_data = 'COLLO';

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEnforcers();

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/COLLO',
          },
          {
            statusCode: 200,
            body: ADD_ENFORCEMENT_ACTION_ALL_FIELD_TYPES_RESULT_MOCK,
          },
        ).as('getAllFieldTypesCollectionOrderResult');

        setupAddEnforcementActionDetailsRoute(
          accountId,
          `/fines/account/defendant/${accountId}/enforcement/action/add?resultId=COLLO`,
          USER_STATE_MOCK_PERMISSION_BU77,
          { welsh_speaking: 'Y' },
        );

        cy.wait('@getAllFieldTypesCollectionOrderResult');

        cy.get(ENF_ACTION_ADD.addEnforcementActionButton).click();
        cy.get(ENF_ACTION_ADD.errorSummary).should(
          'contain.text',
          'Select whether you want to change existing payment terms',
        );
        cy.get(ENF_ACTION_ADD.addPaymentTermsError).should(
          'contain.text',
          'Select whether you want to change existing payment terms',
        );
      },
    );

    it(
      'AC11, AC11a. Add enforcement action details screen cancel with no entered values returns to the Enforcement tab without confirmation',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'COLLO';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Collection order';
        enforcementMock.next_enforcement_action_data = 'COLLO';

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEnforcers();

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/COLLO',
          },
          {
            statusCode: 200,
            body: FINES_ACC_ENF_ACTION_ADD_RESULT_MOCK,
          },
        ).as('getCollectionOrderResult');

        setupAddEnforcementActionDetailsRoute(
          accountId,
          `/fines/account/defendant/${accountId}/enforcement/action/add?resultId=COLLO`,
        );

        cy.wait('@getCollectionOrderResult');

        cy.window().then((win) => {
          cy.stub(win, 'confirm').as('confirmLeave');
        });

        cy.get(ENF_ACTION_ADD.cancelLink).click();

        cy.get('@confirmLeave').should('not.have.been.called');
        cy.get('@routerNavigate').should('have.been.calledWithMatch', ['details']);
        cy.get(ENF.tabName).should('contain.text', 'Enforcement');
      },
    );

    it(
      'AC11, AC11b. Add enforcement action details screen cancel with entered values shows confirmation before navigating away',
      { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
      () => {
        let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        headerMock.debtor_type = 'Defendant';
        headerMock.account_status_reference.account_status_code = 'L';

        let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'COLLO';
        enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Collection order';
        enforcementMock.next_enforcement_action_data = 'COLLO';

        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptEnforcers();

        cy.intercept(
          {
            method: 'GET',
            pathname: '/opal-fines-service/results/COLLO',
          },
          {
            statusCode: 200,
            body: FINES_ACC_ENF_ACTION_ADD_RESULT_MOCK,
          },
        ).as('getCollectionOrderResult');

        setupAddEnforcementActionDetailsRoute(
          accountId,
          `/fines/account/defendant/${accountId}/enforcement/action/add?resultId=COLLO`,
        );

        cy.wait('@getCollectionOrderResult');

        cy.get(ENF_ACTION_ADD.reasonInput).type('Test reason');

        cy.window().then((win) => {
          cy.stub(win, 'confirm')
            .callsFake((message: string) => {
              expect(message.replace(/\s+/g, ' ')).to.match(/unsaved changes/i);
              return true;
            })
            .as('confirmLeave');
        });

        cy.get(ENF_ACTION_ADD.cancelLink).click();

        cy.get('@confirmLeave').should('have.been.calledOnce');
        cy.get('@routerNavigate').should('have.been.calledWithMatch', ['details']);
      },
    );

    // it(
    //   'AC10b. If the enforcement action allows an additional action, the user is taken to new page here',
    //   { tags: ['@JIRA-STORY:PO-1782', '@JIRA-EPIC:PO-2630'] },
    //   () => {
    //     let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
    //     headerMock.debtor_type = 'Defendant';
    //     headerMock.account_status_reference.account_status_code = 'L';
    //
    //     let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
    //     enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'WDN';
    //     enforcementMock.last_enforcement_action!.enforcement_action.result_title = 'Warrant of detention';
    //     enforcementMock.next_enforcement_action_data = 'COLLO';
    //
    //     const additionalActionResultMock = structuredClone(FINES_ACC_ENF_ACTION_ADD_RESULT_MOCK);
    //     additionalActionResultMock.result_id = 'WDN';
    //     additionalActionResultMock.result_title = 'Warrant of detention';
    //     additionalActionResultMock.allow_additional_action = true;
    //
    //     const accountId = headerMock.defendant_account_party_id;
    //
    //     interceptAuthenticatedUser();
    //     interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    //     interceptDefendantHeader(accountId, headerMock, '123');
    //     interceptEnforcementStatus(accountId, enforcementMock, '123');
    //     interceptEnforcers();
    //
    //     cy.intercept(
    //       {
    //         method: 'GET',
    //         pathname: '/opal-fines-service/results/WDN',
    //       },
    //       {
    //         statusCode: 200,
    //         body: additionalActionResultMock,
    //       },
    //     ).as('getWdnResult');
    //
    //     cy.intercept(
    //       {
    //         method: 'POST',
    //         pathname: `/opal-fines-service/defendant-accounts/${accountId}/enforcements`,
    //       },
    //       {
    //         statusCode: 200,
    //         body: {},
    //       },
    //     ).as('postAddEnforcementAction');
    //
    //     // new page here
    //     // intercept whatever API/data the dedicated additional-action page will need
    //     // cy.intercept(...).as('getAdditionalActionPageData');
    //
    //     setupAddEnforcementActionDetailsRoute(
    //       accountId,
    //       `/fines/account/defendant/${accountId}/enforcement/action/add?resultId=WDN`,
    //     );
    //
    //     cy.wait('@getWdnResult');
    //
    //     cy.get(ENF_ACTION_ADD.reasonInput).type('Valid reason');
    //     cy.get(ENF_ACTION_ADD.changeExistingPaymentTermsNoRadio).check({ force: true });
    //     cy.get(ENF_ACTION_ADD.addEnforcementActionButton).click();
    //
    //     cy.wait('@postAddEnforcementAction');
    //
    //     // TODO PO-1782:
    //     // Replace the assertions below when the dedicated "Add additional enforcement action"
    //     // page is implemented. The current app routes back to the existing select page.
    //
    //     // new page here
    //     // cy.wait('@getAdditionalActionPageData');
    //     //
    //     // cy.get('@router').then((router) => {
    //     //   expect((router as any).url).to.include(
    //     //     `/fines/account/defendant/${accountId}/enforcement/action/new-page-here`,
    //     //   );
    //     // });
    //     //
    //     // cy.get('new page here title selector').should('contain.text', 'Add additional enforcement action');
    //     // cy.get('new page here unique selector').should('be.visible');
    //   },
    // );
  },
);
