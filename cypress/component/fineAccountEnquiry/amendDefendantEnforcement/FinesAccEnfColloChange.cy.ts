import { COLLECTION_ORDER_CHANGE_ELEMENTS as COLLECTION_ORDER_CHANGE } from '../../../shared/selectors/account-enquiry/account.enquiry.collection-order-change.locators';
import { ACCOUNT_ENQUIRY_ENFORCEMENT_STATUS_ELEMENTS as ENFORCEMENT_STATUS_TAB } from '../../../shared/selectors/account-enquiry/account.enquiry.enforcement.locators';
import { setupAccountEnquiryComponent } from '../accountEnquiry/setup/SetupComponent';
import { IComponentProperties } from '../accountEnquiry/setup/setupComponent.interface';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from 'cypress/component/CommonIntercepts/CommonUserState.mocks';
import {
  interceptDefendantHeader,
  interceptEnforcementStatus,
} from '../accountEnquiry/intercept/defendantAccountIntercepts';
import {
  createDefendantHeaderMockWithName,
  createParentGuardianHeaderMockWithName,
  DEFENDANT_HEADER_MOCK,
} from '../accountEnquiry/mocks/defendant_details_mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';

const componentProperties: IComponentProperties = {
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

function setupCollectionOrderChange(
  headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson')),
) {
  const enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
  const accountId = headerMock.defendant_account_party_id;

  interceptAuthenticatedUser();
  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  interceptDefendantHeader(accountId, headerMock, '123');
  interceptEnforcementStatus(accountId, enforcementMock, '123');

  setupAccountEnquiryComponent({ ...componentProperties, accountId });

  return { accountId };
}

function commonSetup() {
  const headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
  headerMock.debtor_type = 'individual';

  return setupCollectionOrderChange(headerMock);
}

function parentGuardianSetup() {
  const headerMock = structuredClone(createParentGuardianHeaderMockWithName('Robert', 'Thomson'));
  headerMock.debtor_type = 'Parent/Guardian';
  headerMock.parent_guardian_party_id = '1770000001';

  return setupCollectionOrderChange(headerMock);
}

function companySetup() {
  const headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
  headerMock.party_details.organisation_flag = true;
  headerMock.party_details.organisation_details = {
    organisation_name: 'Test Org Ltd',
    organisation_aliases: [],
  };
  headerMock.party_details.individual_details = null;
  headerMock.debtor_type = 'company';

  return setupCollectionOrderChange(headerMock);
}

function navigateToCollectionOrderChange() {
  cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('contain.text', 'Enforcement');

  cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus)
    .should('exist')
    .next()
    .should('contain.text', 'Collection Order')
    .next()
    .find('a')
    .contains('Change')
    .click();
}

function assertCollectionOrderChangeNavigation() {
  cy.get('@routerNavigate')
    .its('lastCall.args')
    .should(([commands, extras]) => {
      expect(commands).to.deep.equal(['../enforcement/collection-order/change']);
      expect(extras?.state).to.deep.equal({ currentCollectionOrderFlag: true });
    });
}

function assertCollectionOrderChangeTitle() {
  cy.get(COLLECTION_ORDER_CHANGE.pageHeading).should('contain.text', 'Change Collection Order status');
}

function assertCollectionOrderChangeCaption(expectedCaption: string) {
  cy.get(COLLECTION_ORDER_CHANGE.headingWithCaption).should('exist');
  cy.get(COLLECTION_ORDER_CHANGE.headingWithCaption).should('contain.text', expectedCaption);
}

function assertCollectionOrderChangeContent() {
  cy.get(COLLECTION_ORDER_CHANGE.introText).should(
    'contain.text',
    'If the status of a Collection Order is incorrect you can change it.',
  );
  cy.get(COLLECTION_ORDER_CHANGE.warningText).should('contain.text', 'This will not issue a new notice.');
  cy.get(COLLECTION_ORDER_CHANGE.goBackLink)
    .should('contain.text', 'go back')
    .parent()
    .should(
      'contain.text',
      'To add a new Collection Order and issue a notice you should go back and add an enforcement action.',
    );
}

function assertCollectionOrderChangeForm() {
  cy.get(COLLECTION_ORDER_CHANGE.form).should('exist');
  cy.get(COLLECTION_ORDER_CHANGE.collectionOrderLegend).should(
    'contain.text',
    'Is this account subject to a Collection Order?',
  );
  cy.get(COLLECTION_ORDER_CHANGE.yesRadio).should('exist');
  cy.get(COLLECTION_ORDER_CHANGE.yesRadioLabel).should('contain.text', 'Yes');
  cy.get(COLLECTION_ORDER_CHANGE.noRadio).should('exist');
  cy.get(COLLECTION_ORDER_CHANGE.noRadioLabel).should('contain.text', 'No');
  cy.get(COLLECTION_ORDER_CHANGE.submitButton).should('contain.text', 'Change');
}

function assertCollectionOrderChangeRequiredError() {
  cy.get(COLLECTION_ORDER_CHANGE.submitButton).click();

  cy.get(COLLECTION_ORDER_CHANGE.errorSummary).should('exist');
  cy.get(COLLECTION_ORDER_CHANGE.errorSummaryTitle).should('contain.text', 'There is a problem');
  cy.get(COLLECTION_ORDER_CHANGE.errorSummary).should(
    'contain.text',
    'Select whether the account is subject to a Collection Order',
  );
  cy.get(COLLECTION_ORDER_CHANGE.fieldError).should(
    'contain.text',
    'Select whether the account is subject to a Collection Order',
  );
}

function assertGoBackLinkNavigatesToEnforcementTab() {
  cy.get(COLLECTION_ORDER_CHANGE.goBackLink).click();

  cy.get('@routerNavigate').should((navigateStub) => {
    const matchingCall = navigateStub
      .getCalls()
      .find((call) => call.args[0]?.[0] === 'details' && call.args[1]?.fragment === 'enforcement');

    expect(matchingCall, 'go back navigation to details with enforcement fragment').to.exist;
  });

  cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('contain.text', 'Enforcement');
  cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
  cy.get(COLLECTION_ORDER_CHANGE.form).should('not.exist');
}

describe(
  'Account Enquiry Enforcement - Change Collection Order status - Adult or youth',
  { tags: ['@JIRA-LABEL:account-enquiry'] },
  () => {
    it('AC1, AC1a, AC2, AC2a, AC2b, AC2c, AC2d, AC2ci: navigates to and displays the change collection order screen', () => {
      commonSetup();

      // AC1, AC1a: clicking Change navigates from Enforcement to the Change Collection Order status screen.
      navigateToCollectionOrderChange();
      assertCollectionOrderChangeNavigation();

      // AC2, AC2a, AC2b, AC2c, AC2d: the screen shows the title, account identifier, explanatory content and collection order field.
      assertCollectionOrderChangeTitle();
      assertCollectionOrderChangeCaption('177A - Mr Robert THOMSON');
      assertCollectionOrderChangeContent();
      assertCollectionOrderChangeForm();

      // AC2ci: the go back link returns the user to the Enforcement tab.
      assertGoBackLinkNavigatesToEnforcementTab();
    });

    it('AC3, AC3a: displays an error when Change is selected without choosing a collection order option', () => {
      commonSetup();
      navigateToCollectionOrderChange();
      assertCollectionOrderChangeRequiredError();
    });
  },
);

describe(
  'Account Enquiry Enforcement - Change Collection Order status - Adult or youth with parent or guardian to pay',
  { tags: ['@JIRA-LABEL:account-enquiry'] },
  () => {
    it('AC1, AC1a, AC2, AC2a, AC2b, AC2c, AC2d, AC2ci: navigates to and displays the change collection order screen', () => {
      parentGuardianSetup();

      // AC1, AC1a: clicking Change navigates from Enforcement to the Change Collection Order status screen.
      navigateToCollectionOrderChange();
      assertCollectionOrderChangeNavigation();

      // AC2, AC2a, AC2b, AC2c, AC2d: the screen shows the title, account identifier, explanatory content and collection order field.
      assertCollectionOrderChangeTitle();
      assertCollectionOrderChangeCaption('177A - Mr Robert THOMSON');
      assertCollectionOrderChangeContent();
      assertCollectionOrderChangeForm();

      // AC2ci: the go back link returns the user to the Enforcement tab.
      assertGoBackLinkNavigatesToEnforcementTab();
    });

    it('AC3, AC3a: displays an error when Change is selected without choosing a collection order option', () => {
      parentGuardianSetup();
      navigateToCollectionOrderChange();
      assertCollectionOrderChangeRequiredError();
    });
  },
);

describe(
  'Account Enquiry Enforcement - Change Collection Order status - Company',
  { tags: ['@JIRA-LABEL:account-enquiry'] },
  () => {
    it('AC1, AC1a, AC2, AC2a, AC2b, AC2c, AC2d, AC2ci: navigates to and displays the change collection order screen', () => {
      companySetup();

      // AC1, AC1a: clicking Change navigates from Enforcement to the Change Collection Order status screen.
      navigateToCollectionOrderChange();
      assertCollectionOrderChangeNavigation();

      // AC2, AC2a, AC2b, AC2c, AC2d: the screen shows the title, account identifier, explanatory content and collection order field.
      assertCollectionOrderChangeTitle();
      assertCollectionOrderChangeCaption('177A - Test Org Ltd');
      assertCollectionOrderChangeContent();
      assertCollectionOrderChangeForm();

      // AC2ci: the go back link returns the user to the Enforcement tab.
      assertGoBackLinkNavigatesToEnforcementTab();
    });

    it('AC3, AC3a: displays an error when Change is selected without choosing a collection order option', () => {
      companySetup();
      navigateToCollectionOrderChange();
      assertCollectionOrderChangeRequiredError();
    });
  },
);
