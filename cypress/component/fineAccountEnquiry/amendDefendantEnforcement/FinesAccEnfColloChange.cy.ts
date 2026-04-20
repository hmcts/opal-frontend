import { COLLECTION_ORDER_CHANGE_ELEMENTS as COLLECTION_ORDER_CHANGE } from '../../../shared/selectors/account-enquiry/account.enquiry.collection-order-change.locators';
import { ACCOUNT_ENQUIRY_ENFORCEMENT_STATUS_ELEMENTS as ENFORCEMENT_STATUS_TAB } from '../../../shared/selectors/account-enquiry/account.enquiry.enforcement.locators';
import { setupAccountEnquiryComponent } from '../accountEnquiry/setup/SetupComponent';
import { IComponentProperties } from '../accountEnquiry/setup/setupComponent.interface';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from 'cypress/component/CommonIntercepts/CommonUserState.mocks';
import { DOM_ELEMENTS as VERSION_CONTROL } from '../../../shared/selectors/account-enquiry/account.enquiry.version-control.locators';
import {
  interceptDefendantHeader,
  interceptEnforcementStatus,
  interceptPatchDefendantAccount,
} from '../accountEnquiry/intercept/defendantAccountIntercepts';
import {
  createDefendantHeaderMockWithName,
  createParentGuardianHeaderMockWithName,
  DEFENDANT_HEADER_MOCK,
} from '../accountEnquiry/mocks/defendant_details_mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const JIRA_EPIC = '@JIRA-EPIC:PO-1675';

const buildTags = (...tags: string[]): string[] => [...tags, JIRA_EPIC, ACCOUNT_ENQUIRY_JIRA_LABEL];

const ADULT_OR_YOUTH_TAGS = buildTags('@JIRA-STORY:PO-1848', '@JIRA-STORY:PO-3729');
const PARENT_GUARDIAN_TAGS = buildTags('@JIRA-STORY:PO-1860', '@JIRA-STORY:PO-3729');
const COMPANY_TAGS = buildTags('@JIRA-STORY:PO-1861', '@JIRA-STORY:PO-3729');

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
  collectionOrderFlag = true,
  headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson')),
) {
  const enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
  enforcementMock.enforcement_overview.collection_order!.collection_order_flag = collectionOrderFlag;
  const accountId = headerMock.defendant_account_party_id;

  interceptAuthenticatedUser();
  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  interceptDefendantHeader(accountId, headerMock, '123');
  interceptEnforcementStatus(accountId, enforcementMock, '123');
  interceptPatchDefendantAccount();

  setupAccountEnquiryComponent({ ...componentProperties, accountId });

  return { accountId };
}

function commonSetup(collectionOrderFlag = true) {
  const headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
  headerMock.debtor_type = 'individual';

  return setupCollectionOrderChange(collectionOrderFlag, headerMock);
}

function parentGuardianSetup(collectionOrderFlag = true) {
  const headerMock = structuredClone(createParentGuardianHeaderMockWithName('Robert', 'Thomson'));
  headerMock.debtor_type = 'Parent/Guardian';
  headerMock.parent_guardian_party_id = '1770000001';

  return setupCollectionOrderChange(collectionOrderFlag, headerMock);
}

function companySetup(collectionOrderFlag = true) {
  const headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
  headerMock.party_details.organisation_flag = true;
  headerMock.party_details.organisation_details = {
    organisation_name: 'Test Org Ltd',
    organisation_aliases: [],
  };
  headerMock.party_details.individual_details = null;
  headerMock.debtor_type = 'company';

  return setupCollectionOrderChange(collectionOrderFlag, headerMock);
}

function navigateToCollectionOrderChange(expectedStatus = 'Collection Order') {
  cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('contain.text', 'Enforcement');

  cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus)
    .should('exist')
    .parent()
    .should('contain.text', expectedStatus)
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

function assertCollectionOrderChangeTitle(expectedCaption: string) {
  cy.get(COLLECTION_ORDER_CHANGE.pageHeading).should('contain.text', 'Change Collection Order Status');
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

function assertCollectionOrderChangeLayout() {
  cy.get(COLLECTION_ORDER_CHANGE.pageHeading).should('have.class', 'govuk-!-margin-bottom-6');
  cy.get(COLLECTION_ORDER_CHANGE.contentParagraphs)
    .should('have.length', 3)
    .each(($paragraph) => {
      cy.wrap($paragraph).should('have.class', 'govuk-!-margin-bottom-6');
    });
  cy.get(COLLECTION_ORDER_CHANGE.buttonGroupRow).should('exist');
  cy.get(COLLECTION_ORDER_CHANGE.buttonGroupColumn)
    .should('exist')
    .and('have.class', 'govuk-grid-column-two-thirds')
    .and('have.class', 'govuk-!-margin-bottom-0');
  cy.get(COLLECTION_ORDER_CHANGE.buttonGroup)
    .should('exist')
    .and('have.class', 'govuk-button-group')
    .and('have.class', 'govuk-!-margin-bottom-0');
  cy.get(COLLECTION_ORDER_CHANGE.submitButton)
    .should('have.class', 'govuk-button')
    .and('have.class', 'govuk-!-margin-right-4');
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

  cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('contain.text', 'Enforcement');
  cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
  cy.get(COLLECTION_ORDER_CHANGE.form).should('not.exist');
}
function assertCollectionOrderStatusChanged() {
  cy.get(VERSION_CONTROL.successBanner).should('exist');
  cy.get(VERSION_CONTROL.successBannerText).should('contain.text', 'Collection Order status changed');
}

function assertCollectionOrderChangeScreen(
  setupFn: (collectionOrderFlag?: boolean) => { accountId: string | number },
  expectedCaption: string,
) {
  setupFn();

  // AC1, AC1a: clicking Change navigates from Enforcement to the Change Collection Order status screen.
  navigateToCollectionOrderChange();
  assertCollectionOrderChangeNavigation();

  // AC2, AC2a, AC2b, AC2c, AC2d: the screen shows the title, account identifier, explanatory content and collection order field.
  assertCollectionOrderChangeTitle(expectedCaption);
  assertCollectionOrderChangeContent();
  assertCollectionOrderChangeForm();
  assertCollectionOrderChangeLayout();

  // AC2ci: the go back link returns the user to the Enforcement tab.
  assertGoBackLinkNavigatesToEnforcementTab();
}

function assertCollectionOrderChangeRequiredErrorScenario(
  setupFn: (collectionOrderFlag?: boolean) => { accountId: string | number },
) {
  setupFn();
  navigateToCollectionOrderChange();
  assertCollectionOrderChangeRequiredError();
}

function assertCancelWithoutChanges(setupFn: (collectionOrderFlag?: boolean) => { accountId: string | number }) {
  setupFn();
  navigateToCollectionOrderChange();

  cy.window().then((win) => {
    cy.stub(win, 'confirm').as('confirm');
  });

  cy.get(COLLECTION_ORDER_CHANGE.cancelLink).click();

  cy.get('@confirm').should('not.have.been.called');
  cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('contain.text', 'Enforcement');
  cy.get(COLLECTION_ORDER_CHANGE.form).should('not.exist');
}

function assertCancelAfterSelectionShowsConfirmation(
  setupFn: (collectionOrderFlag?: boolean) => { accountId: string | number },
) {
  setupFn();
  navigateToCollectionOrderChange();

  cy.get(COLLECTION_ORDER_CHANGE.noRadio).check({ force: true }).blur();

  cy.window().then((win) => {
    cy.stub(win, 'confirm')
      .callsFake((message: string) => {
        expect(message.replace(/\s+/g, ' ')).to.match(/unsaved changes/i);
        return true;
      })
      .as('confirm');
  });

  cy.get(COLLECTION_ORDER_CHANGE.cancelLink).click();

  cy.get('@confirm').should('have.been.calledOnce');
  cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('contain.text', 'Enforcement');
  cy.get(COLLECTION_ORDER_CHANGE.form).should('not.exist');
}

function assertDismissingCancelConfirmationKeepsUserOnPage(
  setupFn: (collectionOrderFlag?: boolean) => { accountId: string | number },
) {
  setupFn();
  navigateToCollectionOrderChange();

  cy.get(COLLECTION_ORDER_CHANGE.noRadio).check({ force: true }).blur();

  cy.window().then((win) => {
    cy.stub(win, 'confirm')
      .callsFake((message: string) => {
        expect(message.replace(/\s+/g, ' ')).to.match(/unsaved changes/i);
        return false;
      })
      .as('confirm');
  });

  cy.get(COLLECTION_ORDER_CHANGE.cancelLink).click();

  cy.get('@confirm').should('have.been.calledOnce');
  cy.get(COLLECTION_ORDER_CHANGE.pageHeading).should('contain.text', 'Change Collection Order Status');
  cy.get(COLLECTION_ORDER_CHANGE.noRadio).should('be.checked');
}

describe(
  'Account Enquiry Enforcement - Change Collection Order status - Adult or youth',
  { tags: ADULT_OR_YOUTH_TAGS },
  () => {
    it(
      'AC1, AC1a, AC2, AC2a, AC2b, AC2c, AC2d, AC2ci. Adult or youth: navigates to and displays the change collection order screen',
      { tags: ['@JIRA-KEY:POT-5629'] },
      () => {
        assertCollectionOrderChangeScreen(commonSetup, '177A - Mr Robert THOMSON');
      },
    );

    it(
      'AC3, AC3a. Adult or youth: displays an error when Change is selected without choosing a collection order option',
      { tags: ['@JIRA-KEY:POT-5630'] },
      () => {
        assertCollectionOrderChangeRequiredErrorScenario(commonSetup);
      },
    );

    it(
      'AC4a. Adult or youth: selecting a different value returns the user to the Enforcement tab',
      { tags: ['@JIRA-KEY:POT-5631'] },
      () => {
        assertCollectionOrderChangedNavigatesToEnforcementTab(commonSetup);
      },
    );

    it(
      'AC5a. Adult or youth: cancel without changes returns to the Enforcement tab without confirmation',
      { tags: ['@JIRA-KEY:POT-5632'] },
      () => {
        assertCancelWithoutChanges(commonSetup);
      },
    );

    it(
      'AC5b. Adult or youth: cancel after selecting a value shows confirmation before returning to the Enforcement tab',
      { tags: ['@JIRA-KEY:POT-5633'] },
      () => {
        assertCancelAfterSelectionShowsConfirmation(commonSetup);
      },
    );

    it(
      'AC5c. Adult or youth: dismissing the cancel confirmation keeps the user on the page',
      { tags: ['@JIRA-KEY:POT-5634'] },
      () => {
        assertDismissingCancelConfirmationKeepsUserOnPage(commonSetup);
      },
    );
  },
);

describe(
  'Account Enquiry Enforcement - Change Collection Order status - Adult or youth with parent or guardian to pay',
  { tags: PARENT_GUARDIAN_TAGS },
  () => {
    it(
      'AC1, AC1a, AC2, AC2a, AC2b, AC2c, AC2d, AC2ci. Parent or guardian to pay: navigates to and displays the change collection order screen',
      { tags: ['@JIRA-KEY:POT-5635'] },
      () => {
        assertCollectionOrderChangeScreen(parentGuardianSetup, '177A - Mr Robert THOMSON');
      },
    );

    it(
      'AC3, AC3a. Parent or guardian to pay: displays an error when Change is selected without choosing a collection order option',
      { tags: ['@JIRA-KEY:POT-5636'] },
      () => {
        assertCollectionOrderChangeRequiredErrorScenario(parentGuardianSetup);
      },
    );

    it(
      'AC4a. Parent or guardian to pay: selecting a different value returns the user to the Enforcement tab',
      { tags: ['@JIRA-KEY:POT-5637'] },
      () => {
        assertCollectionOrderChangedNavigatesToEnforcementTab(parentGuardianSetup);
      },
    );

    it(
      'AC5a. Parent or guardian to pay: cancel without changes returns to the Enforcement tab without confirmation',
      { tags: ['@JIRA-KEY:POT-5638'] },
      () => {
        assertCancelWithoutChanges(parentGuardianSetup);
      },
    );

    it(
      'AC5b. Parent or guardian to pay: cancel after selecting a value shows confirmation before returning to the Enforcement tab',
      { tags: ['@JIRA-KEY:POT-5639'] },
      () => {
        assertCancelAfterSelectionShowsConfirmation(parentGuardianSetup);
      },
    );

    it(
      'AC5c. Parent or guardian to pay: dismissing the cancel confirmation keeps the user on the page',
      { tags: ['@JIRA-KEY:POT-5640'] },
      () => {
        assertDismissingCancelConfirmationKeepsUserOnPage(parentGuardianSetup);
      },
    );
  },
);

describe('Account Enquiry Enforcement - Change Collection Order status - Company', { tags: COMPANY_TAGS }, () => {
  it(
    'AC1, AC1a, AC2, AC2a, AC2b, AC2c, AC2d, AC2ci. Company: navigates to and displays the change collection order screen',
    { tags: ['@JIRA-KEY:POT-5641'] },
    () => {
      assertCollectionOrderChangeScreen(companySetup, '177A - Test Org Ltd');
    },
  );

  it(
    'AC3, AC3a. Company: displays an error when Change is selected without choosing a collection order option',
    { tags: ['@JIRA-KEY:POT-5642'] },
    () => {
      assertCollectionOrderChangeRequiredErrorScenario(companySetup);
    },
  );

  it(
    'AC4a. Company: selecting a different value returns the user to the Enforcement tab',
    { tags: ['@JIRA-KEY:POT-5643'] },
    () => {
      assertCollectionOrderChangedNavigatesToEnforcementTab(companySetup);
    },
  );

  it(
    'AC5a. Company: cancel without changes returns to the Enforcement tab without confirmation',
    { tags: ['@JIRA-KEY:POT-5644'] },
    () => {
      assertCancelWithoutChanges(companySetup);
    },
  );

  it(
    'AC5b. Company: cancel after selecting a value shows confirmation before returning to the Enforcement tab',
    { tags: ['@JIRA-KEY:POT-5645'] },
    () => {
      assertCancelAfterSelectionShowsConfirmation(companySetup);
    },
  );

  it(
    'AC5c. Company: dismissing the cancel confirmation keeps the user on the page',
    { tags: ['@JIRA-KEY:POT-5646'] },
    () => {
      assertDismissingCancelConfirmationKeepsUserOnPage(companySetup);
    },
  );
});

function assertChangeSelectionReturnsToEnforcementTab(updatedCollectionOrderFlag: boolean) {
  cy.wait('@patchDefendantAccount')
    .its('request.body')
    .should('deep.equal', {
      collection_order: {
        collection_order_date: null,
        collection_order_flag: updatedCollectionOrderFlag,
      },
    });

  cy.wait('@getEnforcementStatus');
  cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('contain.text', 'Enforcement');
  // cy.get(VERSION_CONTROL.successBanner).should('exist');
  // cy.get(VERSION_CONTROL.successBannerText).should('contain.text', 'Collection Order status changed');
}

function assertCollectionOrderChangedNavigatesToEnforcementTab(
  setupFn: (collectionOrderFlag?: boolean) => { accountId: string | number },
) {
  const { accountId } = setupFn(false);
  cy.wait('@getEnforcementStatus');

  const updatedEnforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
  updatedEnforcementMock.enforcement_overview.collection_order!.collection_order_flag = true;

  interceptEnforcementStatus(accountId, updatedEnforcementMock, '124');
  navigateToCollectionOrderChange('No Collection Order');

  cy.get(COLLECTION_ORDER_CHANGE.yesRadio).check({ force: true });
  cy.get(COLLECTION_ORDER_CHANGE.submitButton).click();

  assertChangeSelectionReturnsToEnforcementTab(true);
  assertCollectionOrderStatusChanged();
  cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus).parent().should('contain.text', 'Collection Order');
}
