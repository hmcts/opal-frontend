import { createDefendantHeaderMockWithName, DEFENDANT_HEADER_MOCK } from './mocks/defendant_details_mock';

import {
  ENTER_ENFORCEMENT_PERMISSION,
  MAINTENANCE_PERMISSION,
  USER_STATE_MOCK_NO_PERMISSION,
  USER_STATE_MOCK_PERMISSION_BU77,
} from '../../CommonIntercepts/CommonUserState.mocks';

import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { ACCOUNT_ENQUIRY_ENFORCEMENT_STATUS_ELEMENTS as ENFORCEMENT_STATUS_TAB } from '../../../shared/selectors/account-enquiry/account.enquiry.enforcement.locators';
import { interceptDefendantHeader, interceptEnforcementStatus } from './intercept/defendantAccountIntercepts';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { mount } from 'cypress/angular';
import { IComponentProperties } from './setup/setupComponent.interface';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import { FinesAccDefendantDetailsEnforcementTab } from 'src/app/flows/fines/fines-acc/fines-acc-defendant-details/fines-acc-defendant-details-enforcement-tab/fines-acc-defendant-details-enforcement-tab.component';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const NO_EDITABLE_FIELDS_SELECTOR = 'input, textarea, select, [contenteditable="true"]';
const COMPANY_NAME = 'Test Org Ltd';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

type HeaderMock = typeof DEFENDANT_HEADER_MOCK;
type EnforcementMock = typeof OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK;

interface ShellRenderOptions {
  header: HeaderMock;
  enforcement?: EnforcementMock;
  userState?: typeof USER_STATE_MOCK_PERMISSION_BU77;
}

interface EnforcementTabMountOptions {
  enforcement?: EnforcementMock;
  hasAccountMaintenancePermission?: boolean;
  hasEnterEnforcementPermission?: boolean;
  isCompanyAccount?: boolean;
}

const buildIndividualHeader = (): HeaderMock => {
  const header = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
  header.debtor_type = 'individual';
  return header;
};

const buildParentGuardianHeader = (): HeaderMock => {
  const header = buildIndividualHeader();
  header.debtor_type = 'Parent/Guardian';
  header.parent_guardian_party_id = '1770000001';
  return header;
};

const buildCompanyHeader = (): HeaderMock => {
  const header = structuredClone(DEFENDANT_HEADER_MOCK);
  header.party_details.organisation_flag = true;
  header.party_details.organisation_details = {
    organisation_name: COMPANY_NAME,
    organisation_aliases: [],
  };
  return header;
};

const buildEnforcementMock = (): EnforcementMock => {
  return structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
};

const clearEnforcementOverrideResult = (
  enforcementMock: typeof OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK,
): void => {
  if (!enforcementMock.enforcement_override) {
    throw new Error('Expected enforcement override data to be present in the enforcement mock.');
  }

  enforcementMock.enforcement_override.enforcement_override_result.enforcement_override_result_id = null;
  enforcementMock.enforcement_override.enforcement_override_result.enforcement_override_result_name = null;
};

describe('Account Enquiry Enforcement Status', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });
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
      // Add more routes here as needed
    ],
  };

  const renderEnforcementShell = ({
    header,
    enforcement = buildEnforcementMock(),
    userState = USER_STATE_MOCK_PERMISSION_BU77,
  }: ShellRenderOptions) => {
    const accountId = header.defendant_account_party_id;

    interceptUserState(userState);
    interceptDefendantHeader(accountId, header, '123');
    interceptEnforcementStatus(accountId, enforcement, '123');
    setupAccountEnquiryComponent({ ...componentProperties, accountId });

    cy.get('router-outlet').should('exist');
  };

  const mountEnforcementTab = ({
    enforcement = buildEnforcementMock(),
    hasAccountMaintenancePermission = false,
    hasEnterEnforcementPermission = false,
    isCompanyAccount = false,
  }: EnforcementTabMountOptions = {}) => {
    mount(FinesAccDefendantDetailsEnforcementTab, {
      componentProperties: {
        tabData: enforcement,
        hasAccountMaintenancePermission,
        hasEnterEnforcementPermission,
        isCompanyAccount,
        accountStatusCode: 'L',
      },
    });
  };

  const assertShellChrome = () => {
    cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
    cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
    cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
    cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
    cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
    cy.get(NO_EDITABLE_FIELDS_SELECTOR).should('not.exist');
    cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
  };

  const assertOverviewCardVisible = () => {
    cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
  };

  // Routed shell coverage: page chrome, account context, and tab selection.
  it(
    'AC1: The Enforcement Status tab is built as per the design artefact - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1647'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4063'] },
    () => {
      renderEnforcementShell({ header: buildIndividualHeader() });

      assertShellChrome();
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle)
        .should('contain.text', 'Enforcement overview')
        .and('contain.text', 'Last enforcement action');
    },
  );

  it(
    'AC1: The Enforcement Status tab is built as per the design artefact - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1647'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4064'] },
    () => {
      renderEnforcementShell({ header: buildParentGuardianHeader() });

      assertShellChrome();
      cy.get(ENFORCEMENT_STATUS_TAB.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');
      assertOverviewCardVisible();
    },
  );

  it(
    'AC1: The Enforcement Status tab is built as per the design artefact - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-1647'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4065'] },
    () => {
      renderEnforcementShell({ header: buildCompanyHeader() });

      assertShellChrome();
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('contain.text', COMPANY_NAME);
      assertOverviewCardVisible();
    },
  );

  it(
    'AC2: Action column displayed and add enforcement action link visible when user has Enter Enforcement permission',
    { tags: [...buildTags('@JIRA-STORY:PO-1647'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4066'] },
    () => {
      let userStateMock = structuredClone(USER_STATE_MOCK_NO_PERMISSION);
      userStateMock.business_unit_users[0].permissions.push(ENTER_ENFORCEMENT_PERMISSION);
      renderEnforcementShell({ header: buildIndividualHeader(), userState: userStateMock });

      assertOverviewCardVisible();
      cy.contains('h2', 'Actions').parent().contains('a', 'Add enforcement action').should('exist');
      cy.contains('h2', 'Actions').parent().contains('a', 'Request an HMRC check').should('exist');
    },
  );

  it(
    'AC2: Action column displayed when user has Account Maintenance permission and add enforcement action link not visible',
    { tags: [...buildTags('@JIRA-STORY:PO-1647'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4067'] },
    () => {
      mountEnforcementTab({ hasAccountMaintenancePermission: true });

      assertOverviewCardVisible();
      cy.contains('h2', 'Actions').parent().contains('a', 'Add enforcement action').should('not.exist');
    },
  );

  it(
    'AC2: Action column displayed and add enforcement action link visible when user has both Account Maintenance and Enter Enforcement permissions',
    { tags: [...buildTags('@JIRA-STORY:PO-1647'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4068'] },
    () => {
      let userStateMock = structuredClone(USER_STATE_MOCK_NO_PERMISSION);
      userStateMock.business_unit_users[0].permissions.push(ENTER_ENFORCEMENT_PERMISSION);
      userStateMock.business_unit_users[0].permissions.push(MAINTENANCE_PERMISSION);
      renderEnforcementShell({ header: buildIndividualHeader(), userState: userStateMock });

      assertOverviewCardVisible();
      cy.contains('h2', 'Actions').parent().contains('a', 'Add enforcement action').should('exist');
    },
  );

  it(
    'AC2: Add enforcement override link displayed when user has Account Maintenance permission and no enf_override_result_id',
    { tags: [...buildTags('@JIRA-STORY:PO-1647'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4069'] },
    () => {
      let enforcementMock = buildEnforcementMock();
      clearEnforcementOverrideResult(enforcementMock);

      mountEnforcementTab({
        enforcement: enforcementMock,
        hasAccountMaintenancePermission: true,
      });

      assertOverviewCardVisible();
      cy.contains('h2', 'Actions').parent().contains('a', 'Add enforcement override').should('exist');
    },
  );

  it(
    'AC2: Add enforcement override link not displayed when user has Account Maintenance permission and enf_override_result_id is not null',
    { tags: [...buildTags('@JIRA-STORY:PO-1647'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4070'] },
    () => {
      mountEnforcementTab({ hasAccountMaintenancePermission: true });

      assertOverviewCardVisible();
      cy.contains('h2', 'Actions').parent().contains('a', 'Add enforcement override').should('not.exist');
    },
  );

  it(
    'AC2: Action column not displayed when user has no relevant permissions',
    { tags: [...buildTags('@JIRA-STORY:PO-1647'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4071'] },
    () => {
      mountEnforcementTab();

      assertOverviewCardVisible();
      cy.get(ENFORCEMENT_STATUS_TAB.actionsColumnHeader).should('not.exist');
    },
  );

  it(
    'AC1, AC2a: Enforcement overview panel and collection order flag true - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1648'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4072'] },
    () => {
      mountEnforcementTab();

      assertOverviewCardVisible();
      cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus)
        .should('exist')
        .and('contain.text', 'Collection Order status')
        .next()
        .should('contain.text', 'Collection Order');
      cy.get(ENFORCEMENT_STATUS_TAB.daysInDefault)
        .should('exist')
        .and('contain.text', 'Days in default')
        .next()
        .should('contain.text', '30 days');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementCourt)
        .should('exist')
        .and('contain.text', 'Enforcement court')
        .next()
        .should('contain.text', 'Test Court (456)');
    },
  );

  it(
    'AC1, AC2b: Enforcement overview panel and collection order flag false - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1648'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4073'] },
    () => {
      let enforcementMock = buildEnforcementMock();
      enforcementMock.enforcement_overview.collection_order!.collection_order_flag = false;

      mountEnforcementTab({ enforcement: enforcementMock });

      assertOverviewCardVisible();
      cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus)
        .should('exist')
        .and('contain.text', 'Collection Order status')
        .next()
        .should('contain.text', 'No Collection Order');
    },
  );

  it(
    'AC1, AC2c: Enforcement overview panel and collection order row not displayed - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1648'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4074'] },
    () => {
      let enforcementMock = buildEnforcementMock();
      enforcementMock.enforcement_overview.collection_order = null;

      mountEnforcementTab({ enforcement: enforcementMock });

      assertOverviewCardVisible();
      cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus).should('not.exist');
    },
  );

  it(
    'AC3a: Enforcement overview panel and collection order change link displayed with permission - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1648'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4075'] },
    () => {
      mountEnforcementTab({ hasAccountMaintenancePermission: true });

      assertOverviewCardVisible();
      cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus)
        .should('exist')
        .and('contain.text', 'Collection Order status')
        .next()
        .should('contain.text', 'Collection Order')
        .next()
        .find('a')
        .should('contain.text', 'Change');
    },
  );

  it(
    'AC3b: Enforcement overview panel and collection order change link not displayed without permission - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1648'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4076'] },
    () => {
      mountEnforcementTab();

      assertOverviewCardVisible();
      cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus)
        .should('exist')
        .and('contain.text', 'Collection Order status')
        .next()
        .should('contain.text', 'Collection Order');
      cy.contains('a', 'Change').should('not.exist');
    },
  );

  it(
    'AC4a: Enforcement overview panel and days in default true - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1648'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4077'] },
    () => {
      mountEnforcementTab();

      assertOverviewCardVisible();
      cy.get(ENFORCEMENT_STATUS_TAB.daysInDefault)
        .should('exist')
        .and('contain.text', 'Days in default')
        .next()
        .should('contain.text', '30 days');
    },
  );

  it(
    'AC4b: Enforcement overview panel and days in default false - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1648'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4078'] },
    () => {
      let enforcementMock = buildEnforcementMock();
      enforcementMock.enforcement_overview.days_in_default = 0;

      mountEnforcementTab({ enforcement: enforcementMock });

      assertOverviewCardVisible();
      cy.get(ENFORCEMENT_STATUS_TAB.daysInDefault).should('not.exist');
    },
  );

  it(
    'AC5, AC6a: Enforcement overview panel and enforcement court with permission - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1648'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4079'] },
    () => {
      mountEnforcementTab({ hasAccountMaintenancePermission: true });

      assertOverviewCardVisible();
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementCourt)
        .should('exist')
        .and('contain.text', 'Enforcement court')
        .next()
        .should('contain.text', 'Test Court (456)')
        .next()
        .find('a')
        .should('contain.text', 'Change');
    },
  );

  it(
    'AC5, AC6b: Enforcement overview panel and enforcement court without permission - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1648'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4080'] },
    () => {
      mountEnforcementTab();

      assertOverviewCardVisible();
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementCourt)
        .should('exist')
        .and('contain.text', 'Enforcement court')
        .next()
        .should('contain.text', 'Test Court (456)');
      cy.contains('a', 'Change').should('not.exist');
    },
  );

  it(
    'AC1, AC2a: Enforcement overview panel and collection order flag true - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1652'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4081'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
      cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus)
        .should('exist')
        .and('contain.text', 'Collection Order status')
        .next()
        .should('contain.text', 'Collection Order');
      cy.get(ENFORCEMENT_STATUS_TAB.daysInDefault)
        .should('exist')
        .and('contain.text', 'Days in default')
        .next()
        .should('contain.text', '30 days');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementCourt)
        .should('exist')
        .and('contain.text', 'Enforcement court')
        .next()
        .should('contain.text', 'Test Court (456)');
    },
  );

  it(
    'AC1, AC2b: Enforcement overview panel and collection order flag false - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1652'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4082'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      enforcementMock.enforcement_overview.collection_order!.collection_order_flag = false;

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
      cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus)
        .should('exist')
        .and('contain.text', 'Collection Order status')
        .next()
        .should('contain.text', 'No Collection Order');
    },
  );

  it(
    'AC1, AC2c: Enforcement overview panel and collection order row not displayed - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1652'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4083'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      enforcementMock.enforcement_overview.collection_order = null;

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
      cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus).should('not.exist');
    },
  );

  it(
    'AC3a: Enforcement overview panel and collection order change link displayed with permission - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1652'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4084'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
      cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus)
        .should('exist')
        .and('contain.text', 'Collection Order status')
        .next()
        .should('contain.text', 'Collection Order')
        .next()
        .find('a')
        .should('contain.text', 'Change');
    },
  );

  it(
    'AC3b: Enforcement overview panel and collection order change link not displayed without permission - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1652'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4085'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
      cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus)
        .should('exist')
        .and('contain.text', 'Collection Order status')
        .next()
        .should('contain.text', 'Collection Order');
      cy.contains('a', 'Change').should('not.exist');
    },
  );

  it(
    'AC4a: Enforcement overview panel and days in default true - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1652'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4086'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
      cy.get(ENFORCEMENT_STATUS_TAB.daysInDefault)
        .should('exist')
        .and('contain.text', 'Days in default')
        .next()
        .should('contain.text', '30 days');
    },
  );

  it(
    'AC4b: Enforcement overview panel and days in default false - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1652'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4087'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      enforcementMock.enforcement_overview.days_in_default = 0;

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
      cy.get(ENFORCEMENT_STATUS_TAB.daysInDefault).should('not.exist');
    },
  );

  it(
    'AC5, AC6a: Enforcement overview panel and enforcement court with permission - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1652'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4088'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementCourt)
        .should('exist')
        .and('contain.text', 'Enforcement court')
        .next()
        .should('contain.text', 'Test Court (456)')
        .next()
        .find('a')
        .should('contain.text', 'Change');
    },
  );

  it(
    'AC5, AC6b: Enforcement overview panel and enforcement court without permission - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1652'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4089'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementCourt)
        .should('exist')
        .and('contain.text', 'Enforcement court')
        .next()
        .should('contain.text', 'Test Court (456)');
      cy.contains('a', 'Change').should('not.exist');
    },
  );

  it(
    'AC1, AC3a: Enforcement overview panel and collection order flag true - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-1655'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4090'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };

      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, header, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
      cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus)
        .should('exist')
        .and('contain.text', 'Collection Order status')
        .next()
        .should('contain.text', 'Collection Order');
      cy.get(ENFORCEMENT_STATUS_TAB.daysInDefault)
        .should('exist')
        .and('contain.text', 'Days in default')
        .next()
        .should('contain.text', '30 days');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementCourt)
        .should('exist')
        .and('contain.text', 'Enforcement court')
        .next()
        .should('contain.text', 'Test Court (456)');
    },
  );

  it(
    'AC1, AC3b: Enforcement overview panel and collection order flag false - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-1655'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4091'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };

      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      enforcementMock.enforcement_overview.collection_order!.collection_order_flag = false;

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, header, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
      cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus)
        .should('exist')
        .and('contain.text', 'Collection Order status')
        .next()
        .should('contain.text', 'No Collection Order');
    },
  );

  it(
    'AC1, AC3c: Enforcement overview panel and collection order row not displayed - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-1655'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4092'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };

      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      enforcementMock.enforcement_overview.collection_order = null;

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, header, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
      cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus).should('not.exist');
    },
  );

  it(
    'AC2, AC4a: Enforcement overview panel and enforcement court with permission - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-1655'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4093'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };

      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, header, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementCourt)
        .should('exist')
        .and('contain.text', 'Enforcement court')
        .next()
        .should('contain.text', 'Test Court (456)')
        .next()
        .find('a')
        .should('contain.text', 'Change');
    },
  );

  it(
    'AC2, AC4b: Enforcement overview panel and enforcement court without permission - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-1655'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4094'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };

      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, header, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementCourt)
        .should('exist')
        .and('contain.text', 'Enforcement court')
        .next()
        .should('contain.text', 'Test Court (456)');
      cy.contains('a', 'Change').should('not.exist');
    },
  );

  it(
    'AC1a, AC2, AC3: Last enforcement action panel displays data with all fields true - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1649'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4095'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      enforcementMock.last_enforcement_action!.result_responses[0] = {
        parameter_name: 'days in default',
        response: '15',
      };
      enforcementMock.last_enforcement_action!.result_responses[1] = {
        parameter_name: 'reason',
        response: 'Test reason for enforcement action',
      };

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Last enforcement action');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementAction)
        .should('exist')
        .and('contain.text', 'Enforcement action')
        .next()
        .should('contain.text', 'Enforcement Action Title(EA123)');
      cy.get(ENFORCEMENT_STATUS_TAB.reason)
        .should('exist')
        .and('contain.text', 'Reason')
        .next()
        .should('contain.text', 'Test reason for enforcement action');
      cy.get(ENFORCEMENT_STATUS_TAB.lastEnfEnforcer)
        .should('exist')
        .and('contain.text', 'Enforcer')
        .next()
        .should('contain.text', 'Test Enforcer');
      cy.get(ENFORCEMENT_STATUS_TAB.warrantNumber)
        .should('exist')
        .and('contain.text', 'Warrant number')
        .next()
        .should('contain.text', 'WN123456');
      cy.get(ENFORCEMENT_STATUS_TAB.dateAdded)
        .should('exist')
        .and('contain.text', 'Date added')
        .next()
        .should('contain.text', '10 December 2025');

      cy.get(ENFORCEMENT_STATUS_TAB.detailsLink).should('exist').and('contain.text', 'Details').click();
      cy.get(ENFORCEMENT_STATUS_TAB.detailsDaysInDefault)
        .should('exist')
        .and('contain.text', 'Days In Default')
        .next()
        .should('contain.text', '15 days');
      cy.get(ENFORCEMENT_STATUS_TAB.detailsReason)
        .should('exist')
        .and('contain.text', 'Reason')
        .next()
        .should('contain.text', 'Test reason for enforcement action');
    },
  );

  it(
    'AC3: Last enforcement action panel, details link not shown - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1649'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4096'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      (enforcementMock as any).last_enforcement_action.result_responses = null;

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Last enforcement action');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementAction)
        .should('exist')
        .and('contain.text', 'Enforcement action')
        .next()
        .should('contain.text', 'Enforcement Action Title(EA123)');
      cy.get(ENFORCEMENT_STATUS_TAB.lastEnfEnforcer)
        .should('exist')
        .and('contain.text', 'Enforcer')
        .next()
        .should('contain.text', 'Test Enforcer');
      cy.get(ENFORCEMENT_STATUS_TAB.warrantNumber)
        .should('exist')
        .and('contain.text', 'Warrant number')
        .next()
        .should('contain.text', 'WN123456');
      cy.get(ENFORCEMENT_STATUS_TAB.dateAdded)
        .should('exist')
        .and('contain.text', 'Date added')
        .next()
        .should('contain.text', '10 December 2025');

      cy.get(ENFORCEMENT_STATUS_TAB.detailsLink).should('not.exist');
    },
  );

  it(
    'AC1b: Last enforcement action panel does not display data when null - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1649'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4097'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      enforcementMock.last_enforcement_action = null;

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle)
        .should('contain.text', 'Last enforcement action')
        .closest('.govuk-summary-card')
        .find('.govuk-summary-card__content')
        .should('contain.text', 'There is no outstanding enforcement action.');

      cy.get(ENFORCEMENT_STATUS_TAB.enforcementAction).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.reason).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.lastEnfEnforcer).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.warrantNumber).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.dateAdded).should('not.exist');
    },
  );

  it(
    'AC4: Last enforcement action panel, remove action link true - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1649'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4098'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Last enforcement action');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementAction)
        .should('exist')
        .and('contain.text', 'Enforcement action')
        .next()
        .should('contain.text', 'Enforcement Action Title(NOENF)')
        .next()
        .find('a')
        .should('contain.text', 'Remove');
    },
  );

  it(
    'AC4: Last enforcement action panel, remove action link false - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1649'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4099'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Last enforcement action');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementAction)
        .should('exist')
        .and('contain.text', 'Enforcement action')
        .next()
        .should('contain.text', 'Enforcement Action Title(NOENF)');
      cy.contains('a', 'Remove').should('not.exist');
    },
  );

  it(
    'AC1a, AC2, AC3: Last enforcement action panel displays data with all fields true - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1653'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4100'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      enforcementMock.last_enforcement_action!.result_responses[0] = {
        parameter_name: 'days in default',
        response: '15',
      };
      enforcementMock.last_enforcement_action!.result_responses[1] = {
        parameter_name: 'reason',
        response: 'Test reason for enforcement action',
      };

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Last enforcement action');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementAction)
        .should('exist')
        .and('contain.text', 'Enforcement action')
        .next()
        .should('contain.text', 'Enforcement Action Title(EA123)');
      cy.get(ENFORCEMENT_STATUS_TAB.reason)
        .should('exist')
        .and('contain.text', 'Reason')
        .next()
        .should('contain.text', 'Test reason for enforcement action');
      cy.get(ENFORCEMENT_STATUS_TAB.lastEnfEnforcer)
        .should('exist')
        .and('contain.text', 'Enforcer')
        .next()
        .should('contain.text', 'Test Enforcer');
      cy.get(ENFORCEMENT_STATUS_TAB.warrantNumber)
        .should('exist')
        .and('contain.text', 'Warrant number')
        .next()
        .should('contain.text', 'WN123456');
      cy.get(ENFORCEMENT_STATUS_TAB.dateAdded)
        .should('exist')
        .and('contain.text', 'Date added')
        .next()
        .should('contain.text', '10 December 2025');

      cy.get(ENFORCEMENT_STATUS_TAB.detailsLink).should('exist').and('contain.text', 'Details').click();
      cy.get(ENFORCEMENT_STATUS_TAB.detailsDaysInDefault)
        .should('exist')
        .and('contain.text', 'Days In Default')
        .next()
        .should('contain.text', '15 days');
      cy.get(ENFORCEMENT_STATUS_TAB.detailsReason)
        .should('exist')
        .and('contain.text', 'Reason')
        .next()
        .should('contain.text', 'Test reason for enforcement action');
    },
  );

  it(
    'AC3: Last enforcement action panel, details link not shown - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1653'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4101'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      (enforcementMock as any).last_enforcement_action.result_responses = null;

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Last enforcement action');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementAction)
        .should('exist')
        .and('contain.text', 'Enforcement action')
        .next()
        .should('contain.text', 'Enforcement Action Title(EA123)');
      cy.get(ENFORCEMENT_STATUS_TAB.lastEnfEnforcer)
        .should('exist')
        .and('contain.text', 'Enforcer')
        .next()
        .should('contain.text', 'Test Enforcer');
      cy.get(ENFORCEMENT_STATUS_TAB.warrantNumber)
        .should('exist')
        .and('contain.text', 'Warrant number')
        .next()
        .should('contain.text', 'WN123456');
      cy.get(ENFORCEMENT_STATUS_TAB.dateAdded)
        .should('exist')
        .and('contain.text', 'Date added')
        .next()
        .should('contain.text', '10 December 2025');

      cy.get(ENFORCEMENT_STATUS_TAB.detailsLink).should('not.exist');
    },
  );

  it(
    'AC1b: Last enforcement action panel does not display data when null - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1653'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4102'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      enforcementMock.last_enforcement_action = null;

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle)
        .should('contain.text', 'Last enforcement action')
        .closest('.govuk-summary-card')
        .find('.govuk-summary-card__content')
        .should('contain.text', 'There is no outstanding enforcement action.');

      cy.get(ENFORCEMENT_STATUS_TAB.enforcementAction).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.reason).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.lastEnfEnforcer).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.warrantNumber).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.dateAdded).should('not.exist');
    },
  );

  it(
    'AC4: Last enforcement action panel, remove action link true - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1653'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4103'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Last enforcement action');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementAction)
        .should('exist')
        .and('contain.text', 'Enforcement action')
        .next()
        .should('contain.text', 'Enforcement Action Title(NOENF)')
        .next()
        .find('a')
        .should('contain.text', 'Remove');
    },
  );

  it(
    'AC4: Last enforcement action panel, remove action link false - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1653'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4104'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Last enforcement action');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementAction)
        .should('exist')
        .and('contain.text', 'Enforcement action')
        .next()
        .should('contain.text', 'Enforcement Action Title(NOENF)');
      cy.contains('a', 'Remove').should('not.exist');
    },
  );

  it(
    'AC1a, AC2, AC3: Last enforcement action panel displays data with all fields true - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-1656'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4105'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };

      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      enforcementMock.last_enforcement_action!.result_responses[0] = {
        parameter_name: 'days in default',
        response: '15',
      };
      enforcementMock.last_enforcement_action!.result_responses[1] = {
        parameter_name: 'reason',
        response: 'Test reason for enforcement action',
      };

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, header, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Last enforcement action');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementAction)
        .should('exist')
        .and('contain.text', 'Enforcement action')
        .next()
        .should('contain.text', 'Enforcement Action Title(EA123)');
      cy.get(ENFORCEMENT_STATUS_TAB.reason)
        .should('exist')
        .and('contain.text', 'Reason')
        .next()
        .should('contain.text', 'Test reason for enforcement action');
      cy.get(ENFORCEMENT_STATUS_TAB.lastEnfEnforcer)
        .should('exist')
        .and('contain.text', 'Enforcer')
        .next()
        .should('contain.text', 'Test Enforcer');
      cy.get(ENFORCEMENT_STATUS_TAB.warrantNumber)
        .should('exist')
        .and('contain.text', 'Warrant number')
        .next()
        .should('contain.text', 'WN123456');
      cy.get(ENFORCEMENT_STATUS_TAB.dateAdded)
        .should('exist')
        .and('contain.text', 'Date added')
        .next()
        .should('contain.text', '10 December 2025');

      cy.get(ENFORCEMENT_STATUS_TAB.detailsLink).should('exist').and('contain.text', 'Details').click();
      cy.get(ENFORCEMENT_STATUS_TAB.detailsDaysInDefault)
        .should('exist')
        .and('contain.text', 'Days In Default')
        .next()
        .should('contain.text', '15 days');
      cy.get(ENFORCEMENT_STATUS_TAB.detailsReason)
        .should('exist')
        .and('contain.text', 'Reason')
        .next()
        .should('contain.text', 'Test reason for enforcement action');
    },
  );

  it(
    'AC3: Last enforcement action panel, details link not shown - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-1656'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4106'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };

      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      (enforcementMock as any).last_enforcement_action.result_responses = null;

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, header, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Last enforcement action');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementAction)
        .should('exist')
        .and('contain.text', 'Enforcement action')
        .next()
        .should('contain.text', 'Enforcement Action Title(EA123)');
      cy.get(ENFORCEMENT_STATUS_TAB.lastEnfEnforcer)
        .should('exist')
        .and('contain.text', 'Enforcer')
        .next()
        .should('contain.text', 'Test Enforcer');
      cy.get(ENFORCEMENT_STATUS_TAB.warrantNumber)
        .should('exist')
        .and('contain.text', 'Warrant number')
        .next()
        .should('contain.text', 'WN123456');
      cy.get(ENFORCEMENT_STATUS_TAB.dateAdded)
        .should('exist')
        .and('contain.text', 'Date added')
        .next()
        .should('contain.text', '10 December 2025');

      cy.get(ENFORCEMENT_STATUS_TAB.detailsLink).should('not.exist');
    },
  );

  it(
    'AC1b: Last enforcement action panel does not display data when null - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-1656'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4107'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };

      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      enforcementMock.last_enforcement_action = null;

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, header, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle)
        .should('contain.text', 'Last enforcement action')
        .closest('.govuk-summary-card')
        .find('.govuk-summary-card__content')
        .should('contain.text', 'There is no outstanding enforcement action.');

      cy.get(ENFORCEMENT_STATUS_TAB.enforcementAction).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.reason).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.lastEnfEnforcer).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.warrantNumber).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.dateAdded).should('not.exist');
    },
  );

  it(
    'AC4: Last enforcement action panel, remove action link true - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-1656'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4108'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };

      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, header, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Last enforcement action');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementAction)
        .should('exist')
        .and('contain.text', 'Enforcement action')
        .next()
        .should('contain.text', 'Enforcement Action Title(NOENF)')
        .next()
        .find('a')
        .should('contain.text', 'Remove');
    },
  );

  it(
    'AC4: Last enforcement action panel, remove action link false - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-1656'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4109'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };

      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      enforcementMock.last_enforcement_action!.enforcement_action.result_id = 'NOENF';

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, header, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Last enforcement action');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementAction)
        .should('exist')
        .and('contain.text', 'Enforcement action')
        .next()
        .should('contain.text', 'Enforcement Action Title(NOENF)');
      cy.contains('a', 'Remove').should('not.exist');
    },
  );

  it(
    'AC1a, AC2: Enforcement override panel displays data with all fields true - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1650'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4110'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement override');

      cy.get(ENFORCEMENT_STATUS_TAB.enforcementOverride)
        .should('exist')
        .and('contain.text', 'Enforcement override')
        .next()
        .should('contain.text', 'Override Result Name (EOR123)');
      cy.get(ENFORCEMENT_STATUS_TAB.enfOverrideEnforcer)
        .should('exist')
        .and('contain.text', 'Enforcer')
        .next()
        .should('contain.text', 'Test Enforcer');
      cy.get(ENFORCEMENT_STATUS_TAB.localJusticeArea)
        .should('exist')
        .and('contain.text', 'Local Justice Area (LJA)')
        .next()
        .should('contain.text', 'Test LJA(1)');
    },
  );

  it(
    'AC1a, AC2: Enforcement override panel displays data with all fields false - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1650'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4111'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      clearEnforcementOverrideResult(enforcementMock);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('not.exist');

      cy.get(ENFORCEMENT_STATUS_TAB.enforcementAction)
        .should('exist')
        .and('contain.text', 'Enforcement action')
        .next()
        .should('contain.text', 'Enforcement Action Title(EA123)');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementOverride).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.enfOverrideEnforcer).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.localJusticeArea).should('not.exist');
    },
  );

  it(
    'AC3: Enforcement override panel remove link true - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1650'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4112'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle)
        .should('contain.text', 'Enforcement override')
        .next()
        .find('a')
        .should('contain.text', 'Remove');
    },
  );

  it(
    'AC3: Enforcement override panel remove link false - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1650'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4113'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement override');
      cy.contains('a', 'Remove').should('not.exist');
    },
  );

  it(
    'AC4: Enforcement override panel change link true - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1650'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4114'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement override');

      cy.get(ENFORCEMENT_STATUS_TAB.enforcementOverride)
        .should('exist')
        .and('contain.text', 'Enforcement override')
        .next()
        .should('contain.text', 'Override Result Name (EOR123)')
        .next()
        .find('a')
        .should('contain.text', 'Change');
    },
  );

  it(
    'AC4: Enforcement override panel change link false - Adult or youth only',
    { tags: [...buildTags('@JIRA-STORY:PO-1650'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4115'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement override');

      cy.get(ENFORCEMENT_STATUS_TAB.enforcementOverride)
        .should('exist')
        .and('contain.text', 'Enforcement override')
        .next()
        .should('contain.text', 'Override Result Name (EOR123)');
      cy.contains('a', 'Change').should('not.exist');
    },
  );

  it(
    'AC1a, AC2: Enforcement override panel displays data with all fields true - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1654'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4116'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement override');

      cy.get(ENFORCEMENT_STATUS_TAB.enforcementOverride)
        .should('exist')
        .and('contain.text', 'Enforcement override')
        .next()
        .should('contain.text', 'Override Result Name (EOR123)');
      cy.get(ENFORCEMENT_STATUS_TAB.enfOverrideEnforcer)
        .should('exist')
        .and('contain.text', 'Enforcer')
        .next()
        .should('contain.text', 'Test Enforcer');
      cy.get(ENFORCEMENT_STATUS_TAB.localJusticeArea)
        .should('exist')
        .and('contain.text', 'Local Justice Area (LJA)')
        .next()
        .should('contain.text', 'Test LJA(1)');
    },
  );

  it(
    'AC1a, AC2: Enforcement override panel displays data with all fields false - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1654'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4117'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      clearEnforcementOverrideResult(enforcementMock);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('not.exist');

      cy.get(ENFORCEMENT_STATUS_TAB.enforcementAction)
        .should('exist')
        .and('contain.text', 'Enforcement action')
        .next()
        .should('contain.text', 'Enforcement Action Title(EA123)');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementOverride).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.enfOverrideEnforcer).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.localJusticeArea).should('not.exist');
    },
  );

  it(
    'AC3: Enforcement override panel remove link true - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1654'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4118'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle)
        .should('contain.text', 'Enforcement override')
        .next()
        .find('a')
        .should('contain.text', 'Remove');
    },
  );

  it(
    'AC3: Enforcement override panel remove link false - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1654'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4119'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement override');
      cy.contains('a', 'Remove').should('not.exist');
    },
  );

  it(
    'AC4: Enforcement override panel change link true - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1654'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4120'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement override');

      cy.get(ENFORCEMENT_STATUS_TAB.enforcementOverride)
        .should('exist')
        .and('contain.text', 'Enforcement override')
        .next()
        .should('contain.text', 'Override Result Name (EOR123)')
        .next()
        .find('a')
        .should('contain.text', 'Change');
    },
  );

  it(
    'AC4: Enforcement override panel change link false - Parent or guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1654'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4121'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement override');

      cy.get(ENFORCEMENT_STATUS_TAB.enforcementOverride)
        .should('exist')
        .and('contain.text', 'Enforcement override')
        .next()
        .should('contain.text', 'Override Result Name (EOR123)');
      cy.contains('a', 'Change').should('not.exist');
    },
  );

  it(
    'AC1a, AC2: Enforcement override panel displays data with all fields true - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-1657'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4122'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, header, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement override');

      cy.get(ENFORCEMENT_STATUS_TAB.enforcementOverride)
        .should('exist')
        .and('contain.text', 'Enforcement override')
        .next()
        .should('contain.text', 'Override Result Name (EOR123)');
      cy.get(ENFORCEMENT_STATUS_TAB.enfOverrideEnforcer)
        .should('exist')
        .and('contain.text', 'Enforcer')
        .next()
        .should('contain.text', 'Test Enforcer');
      cy.get(ENFORCEMENT_STATUS_TAB.localJusticeArea)
        .should('exist')
        .and('contain.text', 'Local Justice Area (LJA)')
        .next()
        .should('contain.text', 'Test LJA(1)');
    },
  );

  it(
    'AC1a, AC2: Enforcement override panel displays data with all fields false - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-1657'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4123'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      clearEnforcementOverrideResult(enforcementMock);

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, header, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('not.exist');

      cy.get(ENFORCEMENT_STATUS_TAB.enforcementAction)
        .should('exist')
        .and('contain.text', 'Enforcement action')
        .next()
        .should('contain.text', 'Enforcement Action Title(EA123)');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementOverride).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.enfOverrideEnforcer).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.localJusticeArea).should('not.exist');
    },
  );

  it(
    'AC3: Enforcement override panel remove link true - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-1657'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4124'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, header, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle)
        .should('contain.text', 'Enforcement override')
        .next()
        .find('a')
        .should('contain.text', 'Remove');
    },
  );

  it(
    'AC3: Enforcement override panel remove link false - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-1657'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4125'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, header, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement override');
      cy.contains('a', 'Remove').should('not.exist');
    },
  );

  it(
    'AC4: Enforcement override panel change link true - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-1657'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4126'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, header, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement override');

      cy.get(ENFORCEMENT_STATUS_TAB.enforcementOverride)
        .should('exist')
        .and('contain.text', 'Enforcement override')
        .next()
        .should('contain.text', 'Override Result Name (EOR123)')
        .next()
        .find('a')
        .should('contain.text', 'Change');
    },
  );

  it(
    'AC4: Enforcement override panel change link false - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-1657'), '@JIRA-EPIC:PO-978', '@JIRA-TEST-KEY:PO-4127'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, header, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingWithCaption).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');

      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement override');

      cy.get(ENFORCEMENT_STATUS_TAB.enforcementOverride)
        .should('exist')
        .and('contain.text', 'Enforcement override')
        .next()
        .should('contain.text', 'Override Result Name (EOR123)');
      cy.contains('a', 'Change').should('not.exist');
    },
  );
});
