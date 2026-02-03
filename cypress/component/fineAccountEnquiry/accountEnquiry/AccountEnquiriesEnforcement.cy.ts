import { createDefendantHeaderMockWithName, DEFENDANT_HEADER_MOCK } from './mocks/defendant_details_mock';

import {
  USER_STATE_MOCK_NO_PERMISSION,
  USER_STATE_MOCK_PERMISSION_BU77,
} from '../../CommonIntercepts/CommonUserState.mocks';

import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { ACCOUNT_ENQUIRY_ENFORCEMENT_STATUS_ELEMENTS as ENFORCEMENT_STATUS_TAB } from './constants/account_enquiry_enforcement_status_elements';
import { interceptDefendantHeader, interceptEnforcementStatus } from './intercept/defendantAccountIntercepts';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { IComponentProperties } from './setup/setupComponent.interface';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';

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

  it(
    'AC1: The Enforcement Status tab is built as per the design artefact - Adult or youth only',
    { tags: ['PO-1647'] },
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
      cy.get('input, textarea, select, [contenteditable="true"]').should('not.exist');

      cy.get(ENFORCEMENT_STATUS_TAB.enforcementStatusLink).should('exist').and('contain.text', 'Request an HMRC check');
      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle)
        .should('contain.text', 'Enforcement overview')
        .and('contain.text', 'Last enforcement action');
      cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus)
        .should('exist')
        .and('contain.text', 'Collection Order status');
      cy.get(ENFORCEMENT_STATUS_TAB.daysInDefault).should('exist').and('contain.text', 'Days in default');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementCourt).should('exist').and('contain.text', 'Enforcement court');
    },
  );

  it(
    'AC1: The Enforcement Status tab is built as per the design artefact - Parent or guardian',
    { tags: ['PO-1647'] },
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
      cy.get('input, textarea, select, [contenteditable="true"]').should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementStatusLink).should('exist').and('contain.text', 'Request an HMRC check');
      cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('exist').and('contain.text', 'Enforcement overview');
      cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus)
        .should('exist')
        .and('contain.text', 'Collection Order status');
      cy.get(ENFORCEMENT_STATUS_TAB.daysInDefault).should('exist').and('contain.text', 'Days in default');
      cy.get(ENFORCEMENT_STATUS_TAB.enforcementCourt).should('exist').and('contain.text', 'Enforcement court');
    },
  );

  it('AC1: The Enforcement Status tab is built as per the design artefact - Company', { tags: ['PO-1647'] }, () => {
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
    cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
    cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
    cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
    cy.get('input, textarea, select, [contenteditable="true"]').should('not.exist');
    cy.get(ENFORCEMENT_STATUS_TAB.enforcementStatusLink).should('exist').and('contain.text', 'Request an HMRC check');
    cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');
    cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
    cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('exist').and('contain.text', 'Enforcement overview');
    cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus).should('exist').and('contain.text', 'Collection Order status');
    cy.get(ENFORCEMENT_STATUS_TAB.daysInDefault).should('exist').and('contain.text', 'Days in default');
    cy.get(ENFORCEMENT_STATUS_TAB.enforcementCourt).should('exist').and('contain.text', 'Enforcement court');
  });

  it(
    'AC2: Action column displayed and add enforcement action link visible when user has Enter Enforcement permission',
    { tags: ['PO-1647'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      let newUserState = structuredClone(USER_STATE_MOCK_NO_PERMISSION);
      newUserState.business_unit_users[0].permissions.push({
        permission_id: 10,
        permission_name: 'Enter Enforcement',
      });

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(newUserState);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('exist').and('contain.text', 'Enforcement overview');
      cy.contains('h2', 'Actions').parent().contains('a', 'Add enforcement action').should('exist');
    },
  );

  it(
    'AC2: Action column displayed when user has Account Maintenance permission and add enforcement action link not visible',
    { tags: ['PO-1647'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      let newUserState = structuredClone(USER_STATE_MOCK_NO_PERMISSION);
      newUserState.business_unit_users[0].permissions.push({
        permission_id: 7,
        permission_name: 'Account Maintenance',
      });

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(newUserState);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('exist').and('contain.text', 'Enforcement overview');
      cy.contains('h2', 'Actions').parent().contains('a', 'Add enforcement action').should('not.exist');
    },
  );

  it(
    'AC2: Action column displayed and add enforcement action link visible when user has both Account Maintenance and Enter Enforcement permissions',
    { tags: ['PO-1647'] },
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
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('exist').and('contain.text', 'Enforcement overview');
      cy.contains('h2', 'Actions').parent().contains('a', 'Add enforcement action').should('exist');
    },
  );

  it(
    'AC2: Add enforcement override link displayed when user has Account Maintenance permission and no enf_override_result_id',
    { tags: ['PO-1647'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      enforcementMock.enforcement_override.enforcement_override_result.enforcement_override_result_id = null;
      enforcementMock.enforcement_override.enforcement_override_result.enforcement_override_result_name = null;
      let newUserState = structuredClone(USER_STATE_MOCK_NO_PERMISSION);
      newUserState.business_unit_users[0].permissions.push({
        permission_id: 7,
        permission_name: 'Account Maintenance',
      });

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(newUserState);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('exist').and('contain.text', 'Enforcement overview');
      cy.contains('h2', 'Actions').parent().contains('a', 'Add enforcement override').should('exist');
    },
  );

  it(
    'AC2: Add enforcement override link not displayed when user has Account Maintenance permission and enf_override_result_id is not null',
    { tags: ['PO-1647'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
      let newUserState = structuredClone(USER_STATE_MOCK_NO_PERMISSION);
      newUserState.business_unit_users[0].permissions.push({
        permission_id: 7,
        permission_name: 'Account Maintenance',
      });

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(newUserState);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptEnforcementStatus(accountId, enforcementMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ENFORCEMENT_STATUS_TAB.pageHeader).should('exist');
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('exist').and('contain.text', 'Enforcement overview');
      cy.contains('h2', 'Actions').parent().contains('a', 'Add enforcement override').should('not.exist');
    },
  );

  it('AC2: Action column not displayed when user has no relevant permissions', { tags: ['PO-1647'] }, () => {
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
    cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('exist').and('contain.text', 'Enforcement overview');
    cy.get(ENFORCEMENT_STATUS_TAB.actionsColumnHeader).should('not.exist');
  });

  it(
    'AC1, AC2a: Enforcement overview panel and collection order flag true - Adult or youth only',
    { tags: ['PO-1648'] },
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
    'AC1, AC2b: Enforcement overview panel and collection order flag false - Adult or youth only',
    { tags: ['PO-1648'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
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
        .should('contain.text', 'No collection order');
    },
  );

  it(
    'AC1, AC2c: Enforcement overview panel and collection order row not displayed - Adult or youth only',
    { tags: ['PO-1648'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
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
    'AC3a: Enforcement overview panel and collection order change link displayed with permission - Adult or youth only',
    { tags: ['PO-1648'] },
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
    'AC3b: Enforcement overview panel and collection order change link not displayed without permission - Adult or youth only',
    { tags: ['PO-1648'] },
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
      cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
      cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus)
        .should('exist')
        .and('contain.text', 'Collection Order status')
        .next()
        .should('contain.text', 'Collection Order');
      cy.contains('a', 'Change').should('not.exist');
    },
  );

  it('AC4a: Enforcement overview panel and days in default true - Adult or youth only', { tags: ['PO-1648'] }, () => {
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
    cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
    cy.get(ENFORCEMENT_STATUS_TAB.daysInDefault)
      .should('exist')
      .and('contain.text', 'Days in default')
      .next()
      .should('contain.text', '30 days');
  });

  it('AC4b: Enforcement overview panel and days in default false - Adult or youth only', { tags: ['PO-1648'] }, () => {
    let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
    headerMock.debtor_type = 'individual';
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
  });

  it(
    'AC5, AC6a: Enforcement overview panel and enforcement court with permission - Adult or youth only',
    { tags: ['PO-1648'] },
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
    'AC5, AC6b: Enforcement overview panel and enforcement court without permission - Adult or youth only',
    { tags: ['PO-1648'] },
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
    'AC1, AC2a: Enforcement overview panel and collection order flag true - Parent or guardian',
    { tags: ['PO-1652'] },
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
    { tags: ['PO-1652'] },
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
        .should('contain.text', 'No collection order');
    },
  );

  it(
    'AC1, AC2c: Enforcement overview panel and collection order row not displayed - Parent or guardian',
    { tags: ['PO-1652'] },
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
    { tags: ['PO-1652'] },
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
    { tags: ['PO-1652'] },
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

  it('AC4a: Enforcement overview panel and days in default true - Parent or guardian', { tags: ['PO-1652'] }, () => {
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
  });

  it('AC4b: Enforcement overview panel and days in default false - Parent or guardian', { tags: ['PO-1652'] }, () => {
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
  });

  it(
    'AC5, AC6a: Enforcement overview panel and enforcement court with permission - Parent or guardian',
    { tags: ['PO-1652'] },
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
    { tags: ['PO-1652'] },
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

  it('AC1, AC3a: Enforcement overview panel and collection order flag true - Company', { tags: ['PO-1655'] }, () => {
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
    cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
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
  });

  it('AC1, AC3b: Enforcement overview panel and collection order flag false - Company', { tags: ['PO-1655'] }, () => {
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
    cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
    cy.get(ENFORCEMENT_STATUS_TAB.accountInfo).should('exist');
    cy.get(ENFORCEMENT_STATUS_TAB.summaryMetricBar).should('exist');
    cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');

    cy.get(ENFORCEMENT_STATUS_TAB.tabName).should('exist').and('contain.text', 'Enforcement');
    cy.get(ENFORCEMENT_STATUS_TAB.tableTitle).should('contain.text', 'Enforcement overview');
    cy.get(ENFORCEMENT_STATUS_TAB.collectionOrderStatus)
      .should('exist')
      .and('contain.text', 'Collection Order status')
      .next()
      .should('contain.text', 'No collection order');
  });

  it(
    'AC1, AC3c: Enforcement overview panel and collection order row not displayed - Company',
    { tags: ['PO-1655'] },
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
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
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
    { tags: ['PO-1655'] },
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
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
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
    { tags: ['PO-1655'] },
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
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
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
    { tags: ['PO-1649'] },
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
      cy.get(ENFORCEMENT_STATUS_TAB.enforcer)
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

  it('AC3: Last enforcement action panel, details link not shown - Adult or youth only', { tags: ['PO-1649'] }, () => {
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
    cy.get(ENFORCEMENT_STATUS_TAB.enforcer)
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
  });

  it(
    'AC1b: Last enforcement action panel does not display data when null - Adult or youth only',
    { tags: ['PO-1649'] },
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
      cy.get(ENFORCEMENT_STATUS_TAB.enforcer).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.warrantNumber).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.dateAdded).should('not.exist');
    },
  );

  it('AC4: Last enforcement action panel, remove action link true - Adult or youth only', { tags: ['PO-1649'] }, () => {
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
  });

  it(
    'AC4: Last enforcement action panel, remove action link false - Adult or youth only',
    { tags: ['PO-1649'] },
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

  //Parent or Guardian

  it(
    'AC1a, AC2, AC3: Last enforcement action panel displays data with all fields true - Parent or guardian',
    { tags: ['PO-1653'] },
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
      cy.get(ENFORCEMENT_STATUS_TAB.enforcer)
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

  it('AC3: Last enforcement action panel, details link not shown - Parent or guardian', { tags: ['PO-1653'] }, () => {
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
    cy.get(ENFORCEMENT_STATUS_TAB.enforcer)
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
  });

  it(
    'AC1b: Last enforcement action panel does not display data when null - Parent or guardian',
    { tags: ['PO-1653'] },
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
      cy.get(ENFORCEMENT_STATUS_TAB.enforcer).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.warrantNumber).should('not.exist');
      cy.get(ENFORCEMENT_STATUS_TAB.dateAdded).should('not.exist');
    },
  );

  it('AC4: Last enforcement action panel, remove action link true - Parent or guardian', { tags: ['PO-1653'] }, () => {
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
  });

  it('AC4: Last enforcement action panel, remove action link false - Parent or guardian', { tags: ['PO-1653'] }, () => {
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
  });

  //Company

  it(
    'AC1a, AC2, AC3: Last enforcement action panel displays data with all fields true - Company',
    { tags: ['PO-1656'] },
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
      cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
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
      cy.get(ENFORCEMENT_STATUS_TAB.enforcer)
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

  it('AC3: Last enforcement action panel, details link not shown - Company', { tags: ['PO-1656'] }, () => {
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
    cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
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
    cy.get(ENFORCEMENT_STATUS_TAB.enforcer)
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
  });

  it('AC1b: Last enforcement action panel does not display data when null - Company', { tags: ['PO-1656'] }, () => {
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
    cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
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
    cy.get(ENFORCEMENT_STATUS_TAB.enforcer).should('not.exist');
    cy.get(ENFORCEMENT_STATUS_TAB.warrantNumber).should('not.exist');
    cy.get(ENFORCEMENT_STATUS_TAB.dateAdded).should('not.exist');
  });

  it('AC4: Last enforcement action panel, remove action link true - Company', { tags: ['PO-1656'] }, () => {
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
    cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
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
  });

  it('AC4: Last enforcement action panel, remove action link false - Company', { tags: ['PO-1656'] }, () => {
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
    cy.get(ENFORCEMENT_STATUS_TAB.headingName).should('exist');
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
  });
});
