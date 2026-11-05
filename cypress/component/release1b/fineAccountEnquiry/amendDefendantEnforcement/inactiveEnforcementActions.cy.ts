import { DOM_ELEMENTS as ENF_ACTION_SELECT } from '../../../../shared/selectors/account-enquiry/account.enquiry.enforcement-action-select.locators';
import { DOM_ELEMENTS as ENF_ACTION_ADD } from '../accountEnquiry/locators/account.enquiry.enforcement-action-add.locators';
import { ACCOUNT_ENQUIRY_ENFORCEMENT_STATUS_ELEMENTS as ENF } from '../../../../shared/selectors/account-enquiry/account.enquiry.enforcement.locators';
import { setupAccountEnquiryComponent } from '../accountEnquiry/setup/SetupComponent';
import { USER_STATE_MOCK_PERMISSION_BU77 } from 'cypress/component/CommonIntercepts/CommonUserState.mocks';
import { FINES_ACC_ENF_ACTION_ADD_RESULT_MOCK } from './mocks/add_enforcement_action_result.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { OPAL_FINES_NEXT_PERMITTED_ENFORCEMENT_ACTIONS_MOCK } from 'cypress/component/CommonIntercepts/referenceData/results/NextPermittedEnforcementActionsIntercept.mocks';
import { INACTIVE_ENFORCEMENT_ACTIONS_MOCK } from './mocks/inactive_enforcement_actions.mock';
import { buildSeededGlobalStore } from '../accountEnquiry/setup/SeededStores';
import {
  interceptAuthenticatedUser,
  interceptUserState,
  interceptCourtsByBU,
  interceptEnforcers,
} from 'cypress/component/CommonIntercepts/CommonIntercepts';
import {
  interceptDefendantHeader,
  interceptEnforcementStatus,
} from '../accountEnquiry/intercept/defendantAccountIntercepts';
import { createDefendantHeaderMockWithName } from '../accountEnquiry/mocks/defendant_details_mock';

describe(
  'Inactive enforcement actions',
  { tags: ['@JIRA-LABEL:Add_and_Remove_Defendant_Enforcement_Actions', '@R1B'] },
  () => {
    it(
      'excludes inactive PGPAY and NAWT when adding enforcement to an account without previous enforcement',
      { tags: ['@JIRA-STORY:PO-9761', '@JIRA-EPIC:PO-2821', '@R1B'] },
      () => {
        const headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        const enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
        enforcementMock.last_enforcement_action = null;
        enforcementMock.next_enforcement_action_data = null;
        const accountId = headerMock.defendant_account_party_id;

        interceptAuthenticatedUser();
        interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
        interceptDefendantHeader(accountId, headerMock, '123');
        interceptEnforcementStatus(accountId, enforcementMock, '123');
        interceptCourtsByBU(77);
        interceptEnforcers();

        const results = [
          ...OPAL_FINES_NEXT_PERMITTED_ENFORCEMENT_ACTIONS_MOCK.refData,
          ...INACTIVE_ENFORCEMENT_ACTIONS_MOCK,
        ];
        cy.intercept('GET', '/opal-fines-service/results?*', (req) => {
          const refData = req.query['active'] === 'true' ? results.filter((result) => result.active) : results;
          req.reply({ count: refData.length, refData });
        }).as('getActiveEnforcementActions');
        cy.intercept('GET', '/opal-fines-service/results/WOC', {
          ...FINES_ACC_ENF_ACTION_ADD_RESULT_MOCK,
          result_id: 'WOC',
          result_title: 'Warrant of Control',
          active: true,
          allow_payment_terms: false,
        }).as('getWarrantOfControlResult');

        setupAccountEnquiryComponent({
          accountId,
          fragments: 'enforcement',
          globalStoreFactory: () => buildSeededGlobalStore(USER_STATE_MOCK_PERMISSION_BU77),
        });
        cy.wait('@getEnforcementStatus').its('response.statusCode').should('eq', 200);
        cy.get(ENF.addEnforcementActionLink).click();

        cy.wait('@getActiveEnforcementActions').its('request.query').should('include', {
          active: 'true',
          enforcement: 'true',
          enforcement_override: 'false',
        });
        cy.get(ENF_ACTION_SELECT.actionDropdown).click();
        cy.get(ENF_ACTION_SELECT.actionDropdownOptions)
          .should('contain.text', 'Warrant of Control (WOC)')
          .and('contain.text', 'Warrant of Arrest (WOA)')
          .and('not.contain.text', 'PGPAY')
          .and('not.contain.text', 'NAWT');
        cy.get(ENF_ACTION_SELECT.actionDropdownOptions).contains('Warrant of Control').click();
        cy.get(ENF_ACTION_SELECT.continueButton).click();
        cy.wait('@getWarrantOfControlResult');
        cy.get(ENF_ACTION_SELECT.pageTitle).should('contain.text', 'Warrant of Control');
        cy.get(ENF_ACTION_ADD.reasonInput).should('be.visible');
      },
    );
  },
);
