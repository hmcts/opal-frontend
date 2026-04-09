import { COLLECTION_ORDER_CHANGE_ELEMENTS as COLLECTION_ORDER_CHANGE } from '../../../shared/selectors/account-enquiry/account.enquiry.collection-order-change.locators';
import { ACCOUNT_ENQUIRY_ENFORCEMENT_STATUS_ELEMENTS as ENFORCEMENT_STATUS_TAB } from '../../../shared/selectors/account-enquiry/account.enquiry.enforcement.locators';
import { setupAccountEnquiryComponent } from '../accountEnquiry/setup/SetupComponent';
import { IComponentProperties } from '../accountEnquiry/setup/setupComponent.interface';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from 'cypress/component/CommonIntercepts/CommonUserState.mocks';
import { DOM_ELEMENTS as VERSION_CONTROL } from '../accountEnquiry/constants/global_version_control_elements';
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

function CollectionOrderChangedNavigatesToEnforcementTab(
  setupFn: (collectionOrderFlag?: boolean) => { accountId: string | number },
) {
  const { accountId } = setupFn(false);
  cy.wait('@getEnforcementStatus');

  const updatedEnforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
  updatedEnforcementMock.enforcement_overview.collection_order!.collection_order_flag = true;

  interceptEnforcementStatus(accountId, updatedEnforcementMock, '124');
  navigateToCollectionOrderChange('No collection order');

  cy.get(COLLECTION_ORDER_CHANGE.yesRadio).check({ force: true });
  cy.get(COLLECTION_ORDER_CHANGE.submitButton).click();

  assertChangeSelectionReturnsToEnforcementTab(true);
  assertCollectionOrderStatusChanged();
  cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus).parent().should('contain.text', 'Collection Order');
}

function CollectionOrderCancel(setupFn: (collectionOrderFlag?: boolean) => { accountId: string | number }) {
  it('AC5a: cancel without changes returns to the Enforcement tab without confirmation', () => {
    setupFn();
    navigateToCollectionOrderChange();

    cy.window().then((win) => {
      cy.stub(win, 'confirm').as('confirm');
    });

    cy.get(COLLECTION_ORDER_CHANGE.cancelLink).click();

    cy.get('@confirm').should('not.have.been.called');
    cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('contain.text', 'Enforcement');
    cy.get(COLLECTION_ORDER_CHANGE.form).should('not.exist');
  });

  it('AC5b: cancel after selecting a value shows confirmation before returning to the Enforcement tab', () => {
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
  });

  it('AC5c: dismissing the cancel confirmation keeps the user on the page', () => {
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
  });
}

function runCollectionOrderChangeSuite(
  tags: string[],
  suiteTitle: string,
  expectedCaption: string,
  setupFn: (collectionOrderFlag?: boolean) => { accountId: string | number },
) {
  describe(suiteTitle, { tags }, () => {
    it('AC1, AC1a, AC2, AC2a, AC2b, AC2c, AC2d, AC2ci: navigates to and displays the change collection order screen', () => {
      setupFn();

      // AC1, AC1a: clicking Change navigates from Enforcement to the Change Collection Order status screen.
      navigateToCollectionOrderChange();
      assertCollectionOrderChangeNavigation();

      // AC2, AC2a, AC2b, AC2c, AC2d: the screen shows the title, account identifier, explanatory content and collection order field.
      assertCollectionOrderChangeTitle(expectedCaption);
      assertCollectionOrderChangeContent();
      assertCollectionOrderChangeForm();

      // AC2ci: the go back link returns the user to the Enforcement tab.
      assertGoBackLinkNavigatesToEnforcementTab();
    });

    it('AC3, AC3a: displays an error when Change is selected without choosing a collection order option', () => {
      setupFn();
      navigateToCollectionOrderChange();
      assertCollectionOrderChangeRequiredError();
    });

    it('AC4a: selecting a different value returns the user to the Enforcement tab', () => {
      CollectionOrderChangedNavigatesToEnforcementTab(setupFn);
    });

    CollectionOrderCancel(setupFn);
  });
}

runCollectionOrderChangeSuite(
  ['@JIRA-STORY:PO-1848', '@JIRA-EPIC:PO-1675', '@JIRA-LABEL:Amend Defendant Enforcement Attributes'],
  'Account Enquiry Enforcement - Change Collection Order status - Adult or youth',
  '177A - Mr Robert THOMSON',
  commonSetup,
);

runCollectionOrderChangeSuite(
  ['@JIRA-STORY:PO-1860', '@JIRA-EPIC:PO-1675', '@JIRA-LABEL:Amend Defendant Enforcement Attributes'],
  'Account Enquiry Enforcement - Change Collection Order status - Adult or youth with parent or guardian to pay',
  '177A - Mr Robert THOMSON',
  parentGuardianSetup,
);

runCollectionOrderChangeSuite(
  ['@JIRA-STORY:PO-1861', '@JIRA-EPIC:PO-1675', '@JIRA-LABEL:Amend Defendant Enforcement Attributes'],
  'Account Enquiry Enforcement - Change Collection Order status - Company',
  '177A - Test Org Ltd',
  companySetup,
);
