import { ACCOUNT_ENQUIRY_HEADER_ELEMENTS as DOM } from '../../../shared/selectors/account-enquiry/account.enquiry.header.locators';
import { FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK } from 'src/app/flows/fines/fines-acc/fines-acc-major-creditor-details/mocks/fines-acc-major-creditor-details-header.mock';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from '../../CommonIntercepts/CommonUserState.mocks';
import { IComponentProperties } from './setup/setupComponent.interface';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import { interceptMajorCreditorHeader } from './intercept/defendantAccountIntercepts';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL, '@R1B'];

describe('Account Enquiry - Major Creditor Header', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });

  const majorCreditorAccountId = FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK.major_creditor.creditor_account_id;

  const componentProperties: IComponentProperties = {
    accountId: majorCreditorAccountId.toString(),
    targetPath: `/major-creditor/${majorCreditorAccountId}/details`,
    fragments: 'at-a-glance',
    interceptedRoutes: ['/access-denied', '../note/add'],
  };

  it(
    'AC1b: displays the Major Creditor Account Header Summary in line with the design artefact',
    { tags: [...buildTags('@JIRA-STORY:PO-2128'), '@JIRA-EPIC:PO-1286'] },
    () => {
      const header = structuredClone(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK);

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptMajorCreditorHeader(majorCreditorAccountId, header, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.pageHeader).should('exist');
      cy.get(DOM.headingWithCaption).should('exist');
      cy.get(DOM.headingName).should('contain.text', header.major_creditor.name);

      cy.get(DOM.accountInfo).should('exist');
      cy.get(DOM.summaryMetricBar).should('exist');
      cy.get(DOM.subnav).should('exist');
    },
  );

  it(
    'AC1c: displays header field values using the major creditor account data rules',
    { tags: [...buildTags('@JIRA-STORY:PO-2128'), '@JIRA-EPIC:PO-1286'] },
    () => {
      const header = structuredClone(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK);
      header.major_creditor.account_number = '12345678X';
      header.major_creditor.name = 'Test Major Creditor Account';
      header.awaiting_payout = 123.45;

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptMajorCreditorHeader(majorCreditorAccountId, header, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.headingWithCaption).should('contain.text', header.major_creditor.account_number);
      cy.get(DOM.headingName).should('contain.text', header.major_creditor.name);
      cy.get(DOM.majorCreditorAccountType).should('contain.text', header.major_creditor.account_reference.display_name);

      cy.get(DOM.majorCreditorBusinessUnit).should(
        'contain.text',
        `${header.business_unit_details.business_unit_name} (${header.business_unit_details.business_unit_id})`,
      );

      cy.get(DOM.summaryMetricBar).within(() => {
        cy.contains(DOM.labelAwaitingPayout)
          .should('be.visible')
          .closest(DOM.summaryMetricBarItem)
          .should('contain.text', '£123.45');
      });
    },
  );

  it(
    'AC1c: displays Central Fund as the account type when the header data identifies a Central Fund account',
    { tags: [...buildTags('@JIRA-STORY:PO-2128'), '@JIRA-EPIC:PO-1286'] },
    () => {
      const header = structuredClone(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK);
      header.major_creditor.account_number = '00000009C';
      header.major_creditor.account_reference.account_type = 'CFA';
      header.major_creditor.account_reference.display_name = 'Central Fund';
      header.major_creditor.name = 'Central Fund Main Account';

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptMajorCreditorHeader(majorCreditorAccountId, header, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.pageHeader).should('exist');
      cy.get(DOM.headingWithCaption).should('contain.text', header.major_creditor.account_number);
      cy.get(DOM.headingName).should('contain.text', header.major_creditor.name);

      cy.get(DOM.accountInfo).should('exist');
      cy.get(DOM.summaryMetricBar).should('exist');
      cy.get(DOM.subnav).should('exist');

      cy.get(DOM.majorCreditorAccountType).should('contain.text', 'Central Fund');
    },
  );
});
