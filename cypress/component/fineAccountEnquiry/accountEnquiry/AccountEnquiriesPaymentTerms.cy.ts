import { createDefendantHeaderMockWithName, DEFENDANT_HEADER_MOCK } from './mocks/defendant_details_mock';

import {
  USER_STATE_MOCK_NO_PERMISSION,
  USER_STATE_MOCK_PERMISSION_BU17,
  USER_STATE_MOCK_PERMISSION_BU77,
} from '../../CommonIntercepts/CommonUserState.mocks';

import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-latest.mock';
import { ACCOUNT_ENQUIRY_PAYMENT_TERMS_ELEMENTS as PAYMENT_TERMS_TAB } from '../../../shared/selectors/account-enquiry/account.enquiry.payment-terms.locators';
import { interceptDefendantHeader, interceptPaymentTerms } from './intercept/defendantAccountIntercepts';
import {
  interceptAuthenticatedUser,
  interceptResultByCode,
  interceptUserState,
} from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { IComponentProperties } from './setup/setupComponent.interface';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

describe('Account Enquiry Payment Terms', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });
  const componentProperties: IComponentProperties = {
    accountId: '77',
    fragments: 'payment-terms',
    interceptedRoutes: [
      '/access-denied',
      '../note/add',
      '../debtor/individual/amend',
      '../debtor/parentGuardian/amend',
      '../payment-terms/amend',
      '../payment-terms/amend-denied',
      '../payment-card/request',
      '../payment-card/denied/enforcement',
      // Add more routes here as needed
    ],
  };

  const setupPaymentTermsScreen = (
    headerMock: typeof DEFENDANT_HEADER_MOCK,
    paymentTermsMock: typeof OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK,
  ) => {
    const accountId = headerMock.defendant_account_party_id;

    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, '123');
    interceptPaymentTerms(accountId, paymentTermsMock, '123');
    interceptResultByCode('REM');
    setupAccountEnquiryComponent({ ...componentProperties, accountId });
    cy.get('router-outlet').should('exist');
  };

  const buildParentGuardianHeaderMock = () => {
    const headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
    headerMock.debtor_type = 'Parent/Guardian';
    headerMock.parent_guardian_party_id = '1770000001';

    return headerMock;
  };

  const buildCompanyHeaderMock = () => {
    const headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
    headerMock.party_details.organisation_flag = true;
    headerMock.party_details.organisation_details = {
      organisation_name: 'Test Org Ltd',
      organisation_aliases: [],
    };

    return headerMock;
  };

  it('AC1: The Payment Terms tab is built as per the design artefact for pay in full - Adult or youth only', { tags: [...buildTags('@JIRA-STORY:PO-1146'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4128'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.payment_terms.payment_terms_type.payment_terms_type_code = 'P';
      paymentTermsMock.payment_terms.lump_sum_amount = 200.0;
      paymentTermsMock.payment_terms.instalment_amount = 0.0;
      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.pageHeader).should('exist');
      cy.get(PAYMENT_TERMS_TAB.headingWithCaption).should('exist');
      cy.get(PAYMENT_TERMS_TAB.headingName).should('exist');
      cy.get(PAYMENT_TERMS_TAB.accountInfo).should('exist');
      cy.get(PAYMENT_TERMS_TAB.summaryMetricBar).should('exist');
      cy.get('input, textarea, select, [contenteditable="true"]').should('not.exist');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).should('exist').and('contain.text', 'Request payment card');
      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.tableTitle).should('exist').and('contain.text', 'Pay in full');
      cy.get(PAYMENT_TERMS_TAB.effectiveDate).should('exist').and('contain.text', '23 October 2025');
      cy.get(PAYMENT_TERMS_TAB.daysInDefault).should('exist').and('contain.text', '—');
      cy.get(PAYMENT_TERMS_TAB.dateDaysInDefaultImposed).should('exist').and('contain.text', '—');
      cy.get(PAYMENT_TERMS_TAB.paymentCardRequested).should('exist').and('contain.text', '11 October 2025');
    });

  it('AC1: The Payment Terms tab is built as per the design artefact for instalments only - Adult or youth only', { tags: [...buildTags('@JIRA-STORY:PO-1146'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4129'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.payment_terms.payment_terms_type.payment_terms_type_code = 'I';
      paymentTermsMock.payment_terms.payment_terms_type.payment_terms_type_display_name = 'Instalments';

      setupPaymentTermsScreen(headerMock, paymentTermsMock);

      cy.get('input, textarea, select, [contenteditable="true"]').should('not.exist');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).should('exist').and('contain.text', 'Request payment card');
      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.tableTitle).should('exist').and('contain.text', 'Instalments only');
      cy.get(PAYMENT_TERMS_TAB.instalmentAmount).should('exist').and('contain.text', '£20.00');
      cy.get(PAYMENT_TERMS_TAB.instalmentFrequency).should('exist').and('contain.text', 'Monthly');
      cy.get(PAYMENT_TERMS_TAB.effectiveDate).should('exist').and('contain.text', '23 October 2025');
      cy.get(PAYMENT_TERMS_TAB.daysInDefault).should('exist').and('contain.text', '—');
      cy.get(PAYMENT_TERMS_TAB.dateDaysInDefaultImposed).should('exist').and('contain.text', '—');
      cy.get(PAYMENT_TERMS_TAB.paymentCardRequested).should('exist').and('contain.text', '11 October 2025');
    });

  it('AC1: The Payment Terms tab is built as per the design artefact for lump sum plus instalments - Adult or youth only', { tags: [...buildTags('@JIRA-STORY:PO-1146'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4130'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.payment_terms.payment_terms_type.payment_terms_type_code = 'I';
      paymentTermsMock.payment_terms.payment_terms_type.payment_terms_type_display_name = 'Instalments';
      paymentTermsMock.payment_terms.lump_sum_amount = 10.0;
      paymentTermsMock.payment_terms.days_in_default = 9;
      paymentTermsMock.payment_terms.date_days_in_default_imposed = '2025-10-21';

      setupPaymentTermsScreen(headerMock, paymentTermsMock);

      cy.get('input, textarea, select, [contenteditable="true"]').should('not.exist');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).should('exist').and('contain.text', 'Request payment card');
      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.tableTitle).should('exist').and('contain.text', 'Lump sum plus instalments');
      cy.get(PAYMENT_TERMS_TAB.lumpSumAmount).should('exist').and('contain.text', '£10.00');
      cy.get(PAYMENT_TERMS_TAB.instalmentAmount).should('exist').and('contain.text', '£20.00');
      cy.get(PAYMENT_TERMS_TAB.instalmentFrequency).should('exist').and('contain.text', 'Monthly');
      cy.get(PAYMENT_TERMS_TAB.effectiveDate).should('exist').and('contain.text', '23 October 2025');
      cy.get(PAYMENT_TERMS_TAB.daysInDefault).should('exist').and('contain.text', '9');
      cy.get(PAYMENT_TERMS_TAB.dateDaysInDefaultImposed).should('exist').and('contain.text', '21 October 2025');
      cy.get(PAYMENT_TERMS_TAB.paymentCardRequested).should('exist').and('contain.text', '11 October 2025');
    });

  it('AC2: User with permission to amend payment terms, change link - Adult or youth only', { tags: [...buildTags('@JIRA-STORY:PO-1146'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4131'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-terms/amend']);
    });

  it('AC2: User with permission to amend payment terms in different BU, no change link - Adult or youth only', { tags: [...buildTags('@JIRA-STORY:PO-1146'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4132'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-terms/denied/permission']);
    });

  it('AC2: User without permission to amend payment terms, no change link - Adult or youth only', { tags: [...buildTags('@JIRA-STORY:PO-1146'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4133'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').should('not.exist');
    });

  it('AC2: User with permission to amend payment terms, but cannot make amendments - extend_ttp_disallow true', { tags: [...buildTags('@JIRA-STORY:PO-1146'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4134'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.last_enforcement = 'DW';

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('DW');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-terms/denied/enforcement']);
    });

  it('AC2: User with permission to amend payment terms, but cannot make amendments - account status CS', { tags: [...buildTags('@JIRA-STORY:PO-1146'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4135'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      headerMock.account_status_reference.account_status_code = 'CS';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-terms/denied/account-status']);
    });

  it('AC2: User with permission to amend payment terms, but cannot make amendments - account status WO', { tags: [...buildTags('@JIRA-STORY:PO-1146'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4136'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      headerMock.account_status_reference.account_status_code = 'WO';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-terms/denied/account-status']);
    });

  it('AC2: User with permission to amend payment terms, but cannot make amendments - account status TO', { tags: [...buildTags('@JIRA-STORY:PO-1146'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4137'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      headerMock.account_status_reference.account_status_code = 'TO';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-terms/denied/account-status']);
    });

  it('AC2: User with permission to amend payment terms, but cannot make amendments - account status TS', { tags: [...buildTags('@JIRA-STORY:PO-1146'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4138'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      headerMock.account_status_reference.account_status_code = 'TS';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-terms/denied/account-status']);
    });

  it('AC2: User with permission to amend payment terms, but cannot make amendments - account status TA', { tags: [...buildTags('@JIRA-STORY:PO-1146'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4139'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      headerMock.account_status_reference.account_status_code = 'TA';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-terms/denied/account-status']);
    });

  it('AC2: User with permission to amend payment terms, but cannot make amendments - extend_ttp_disallow true and account status CS', { tags: [...buildTags('@JIRA-STORY:PO-1146'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4140'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      headerMock.account_status_reference.account_status_code = 'CS';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.last_enforcement = 'DW';

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('DW');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-terms/denied/enforcement']);
    });

  it('AC3: Payment terms with amendments panel - Adult or youth only', { tags: [...buildTags('@JIRA-STORY:PO-1146'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4141'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.payment_terms.extension = true;
      paymentTermsMock.payment_terms.reason_for_extension = 'Payment delay reason';

      setupPaymentTermsScreen(headerMock, paymentTermsMock);

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.tableTitle).should('exist').and('contain.text', 'Payment terms amendments');
      cy.get(PAYMENT_TERMS_TAB.dateLastAmended).should('exist').and('contain.text', '21 October 2025');
      cy.get(PAYMENT_TERMS_TAB.lastAmendedBy).should('exist').and('contain.text', 'opal-test-2');
      cy.get(PAYMENT_TERMS_TAB.amendmentReason).should('exist').and('contain.text', 'Payment delay reason');
    });

  it('AC1: The Payment Terms tab is built as per the design artefact for pay in full - Parent or guardian', { tags: [...buildTags('@JIRA-STORY:PO-1636'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4142'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.payment_terms.payment_terms_type.payment_terms_type_code = 'P';
      paymentTermsMock.payment_terms.lump_sum_amount = 200.0;
      paymentTermsMock.payment_terms.instalment_amount = 0.0;
      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.pageHeader).should('exist');
      cy.get(PAYMENT_TERMS_TAB.headingWithCaption).should('exist');
      cy.get(PAYMENT_TERMS_TAB.headingName).should('exist');
      cy.get(PAYMENT_TERMS_TAB.accountInfo).should('exist');
      cy.get(PAYMENT_TERMS_TAB.summaryMetricBar).should('exist');
      cy.get('input, textarea, select, [contenteditable="true"]').should('not.exist');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).should('exist').and('contain.text', 'Request payment card');
      cy.get(PAYMENT_TERMS_TAB.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');
      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.tableTitle).should('exist').and('contain.text', 'Pay in full');
      cy.get(PAYMENT_TERMS_TAB.effectiveDate).should('exist').and('contain.text', '23 October 2025');
      cy.get(PAYMENT_TERMS_TAB.daysInDefault).should('exist').and('contain.text', '—');
      cy.get(PAYMENT_TERMS_TAB.dateDaysInDefaultImposed).should('exist').and('contain.text', '—');
      cy.get(PAYMENT_TERMS_TAB.paymentCardRequested).should('exist').and('contain.text', '11 October 2025');
    });

  it('AC1: The Payment Terms tab is built as per the design artefact for instalments only - Parent or guardian', { tags: [...buildTags('@JIRA-STORY:PO-1636'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4143'] }, () => {
      let headerMock = buildParentGuardianHeaderMock();
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.payment_terms.payment_terms_type.payment_terms_type_code = 'I';
      paymentTermsMock.payment_terms.payment_terms_type.payment_terms_type_display_name = 'Instalments';

      setupPaymentTermsScreen(headerMock, paymentTermsMock);

      cy.get('input, textarea, select, [contenteditable="true"]').should('not.exist');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).should('exist').and('contain.text', 'Request payment card');
      cy.get(PAYMENT_TERMS_TAB.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');
      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.tableTitle).should('exist').and('contain.text', 'Instalments only');
      cy.get(PAYMENT_TERMS_TAB.instalmentAmount).should('exist').and('contain.text', '£20.00');
      cy.get(PAYMENT_TERMS_TAB.instalmentFrequency).should('exist').and('contain.text', 'Monthly');
      cy.get(PAYMENT_TERMS_TAB.effectiveDate).should('exist').and('contain.text', '23 October 2025');
      cy.get(PAYMENT_TERMS_TAB.daysInDefault).should('exist').and('contain.text', '—');
      cy.get(PAYMENT_TERMS_TAB.dateDaysInDefaultImposed).should('exist').and('contain.text', '—');
      cy.get(PAYMENT_TERMS_TAB.paymentCardRequested).should('exist').and('contain.text', '11 October 2025');
    });

  it('AC1: The Payment Terms tab is built as per the design artefact for lump sum plus instalments - Parent or guardian', { tags: [...buildTags('@JIRA-STORY:PO-1636'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4144'] }, () => {
      let headerMock = buildParentGuardianHeaderMock();
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.payment_terms.payment_terms_type.payment_terms_type_code = 'I';
      paymentTermsMock.payment_terms.payment_terms_type.payment_terms_type_display_name = 'Instalments';
      paymentTermsMock.payment_terms.lump_sum_amount = 10.0;
      paymentTermsMock.payment_terms.days_in_default = 9;
      paymentTermsMock.payment_terms.date_days_in_default_imposed = '2025-10-21';

      setupPaymentTermsScreen(headerMock, paymentTermsMock);

      cy.get('input, textarea, select, [contenteditable="true"]').should('not.exist');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).should('exist').and('contain.text', 'Request payment card');
      cy.get(PAYMENT_TERMS_TAB.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');
      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.tableTitle).should('exist').and('contain.text', 'Lump sum plus instalments');
      cy.get(PAYMENT_TERMS_TAB.lumpSumAmount).should('exist').and('contain.text', '£10.00');
      cy.get(PAYMENT_TERMS_TAB.instalmentAmount).should('exist').and('contain.text', '£20.00');
      cy.get(PAYMENT_TERMS_TAB.instalmentFrequency).should('exist').and('contain.text', 'Monthly');
      cy.get(PAYMENT_TERMS_TAB.effectiveDate).should('exist').and('contain.text', '23 October 2025');
      cy.get(PAYMENT_TERMS_TAB.daysInDefault).should('exist').and('contain.text', '9');
      cy.get(PAYMENT_TERMS_TAB.dateDaysInDefaultImposed).should('exist').and('contain.text', '21 October 2025');
      cy.get(PAYMENT_TERMS_TAB.paymentCardRequested).should('exist').and('contain.text', '11 October 2025');
    });

  it('AC2: User with permission to amend payment terms, change link - Parent or guardian', { tags: [...buildTags('@JIRA-STORY:PO-1636'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4145'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-terms/amend']);
    });

  it('AC2: User with permission to amend payment terms in different BU, no change link - Parent or guardian', { tags: [...buildTags('@JIRA-STORY:PO-1636'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4146'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-terms/denied/permission']);
    });

  it('AC2: User without permission to amend payment terms, no change link - Parent or guardian', { tags: [...buildTags('@JIRA-STORY:PO-1636'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4147'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').should('not.exist');
    });

  it('AC3: Payment terms with amendments panel - Parent or guardian', { tags: [...buildTags('@JIRA-STORY:PO-1636'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4148'] }, () => {
      let headerMock = buildParentGuardianHeaderMock();
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.payment_terms.extension = true;
      paymentTermsMock.payment_terms.reason_for_extension = 'Payment delay reason';

      setupPaymentTermsScreen(headerMock, paymentTermsMock);

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');
      cy.get(PAYMENT_TERMS_TAB.tableTitle).should('exist').and('contain.text', 'Payment terms amendments');
      cy.get(PAYMENT_TERMS_TAB.dateLastAmended).should('exist').and('contain.text', '21 October 2025');
      cy.get(PAYMENT_TERMS_TAB.lastAmendedBy).should('exist').and('contain.text', 'opal-test-2');
      cy.get(PAYMENT_TERMS_TAB.amendmentReason).should('exist').and('contain.text', 'Payment delay reason');
    });

  it('AC1: The Payment Terms tab is built as per the design artefact for pay in full - Company', { tags: [...buildTags('@JIRA-STORY:PO-1637'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4149'] }, () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };

      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.payment_terms.payment_terms_type.payment_terms_type_code = 'P';
      paymentTermsMock.payment_terms.lump_sum_amount = 200.0;
      paymentTermsMock.payment_terms.instalment_amount = 0.0;

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, header, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.pageHeader).should('exist');
      cy.get(PAYMENT_TERMS_TAB.headingWithCaption).should('exist');
      cy.get(PAYMENT_TERMS_TAB.headingName).should('exist');
      cy.get(PAYMENT_TERMS_TAB.accountInfo).should('exist');
      cy.get(PAYMENT_TERMS_TAB.summaryMetricBar).should('exist');
      cy.get('input, textarea, select, [contenteditable="true"]').should('not.exist');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).should('exist').and('contain.text', 'Request payment card');
      cy.get(PAYMENT_TERMS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');
      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.tableTitle).should('exist').and('contain.text', 'Pay in full');
      cy.get(PAYMENT_TERMS_TAB.effectiveDate).should('exist').and('contain.text', '23 October 2025');
      cy.get(PAYMENT_TERMS_TAB.daysInDefault).should('exist').and('contain.text', '—');
      cy.get(PAYMENT_TERMS_TAB.dateDaysInDefaultImposed).should('exist').and('contain.text', '—');
      cy.get(PAYMENT_TERMS_TAB.paymentCardRequested).should('exist').and('contain.text', '11 October 2025');
    });

  it('AC1: The Payment Terms tab is built as per the design artefact for instalments only - Company', { tags: [...buildTags('@JIRA-STORY:PO-1637'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4150'] }, () => {
      const header = buildCompanyHeaderMock();
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.payment_terms.payment_terms_type.payment_terms_type_code = 'I';
      paymentTermsMock.payment_terms.payment_terms_type.payment_terms_type_display_name = 'Instalments';

      setupPaymentTermsScreen(header, paymentTermsMock);

      cy.get('input, textarea, select, [contenteditable="true"]').should('not.exist');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).should('exist').and('contain.text', 'Request payment card');
      cy.get(PAYMENT_TERMS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');
      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.tableTitle).should('exist').and('contain.text', 'Instalments only');
      cy.get(PAYMENT_TERMS_TAB.instalmentAmount).should('exist').and('contain.text', '£20.00');
      cy.get(PAYMENT_TERMS_TAB.instalmentFrequency).should('exist').and('contain.text', 'Monthly');
      cy.get(PAYMENT_TERMS_TAB.effectiveDate).should('exist').and('contain.text', '23 October 2025');
      cy.get(PAYMENT_TERMS_TAB.daysInDefault).should('exist').and('contain.text', '—');
      cy.get(PAYMENT_TERMS_TAB.dateDaysInDefaultImposed).should('exist').and('contain.text', '—');
      cy.get(PAYMENT_TERMS_TAB.paymentCardRequested).should('exist').and('contain.text', '11 October 2025');
    });

  it('AC1: The Payment Terms tab is built as per the design artefact for lump sum plus instalments - Company', { tags: [...buildTags('@JIRA-STORY:PO-1637'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4151'] }, () => {
      const header = buildCompanyHeaderMock();
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.payment_terms.payment_terms_type.payment_terms_type_code = 'I';
      paymentTermsMock.payment_terms.payment_terms_type.payment_terms_type_display_name = 'Instalments';
      paymentTermsMock.payment_terms.lump_sum_amount = 10.0;
      paymentTermsMock.payment_terms.days_in_default = 9;
      paymentTermsMock.payment_terms.date_days_in_default_imposed = '2025-10-21';

      setupPaymentTermsScreen(header, paymentTermsMock);

      cy.get('input, textarea, select, [contenteditable="true"]').should('not.exist');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).should('exist').and('contain.text', 'Request payment card');
      cy.get(PAYMENT_TERMS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');
      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.tableTitle).should('exist').and('contain.text', 'Lump sum plus instalments');
      cy.get(PAYMENT_TERMS_TAB.lumpSumAmount).should('exist').and('contain.text', '£10.00');
      cy.get(PAYMENT_TERMS_TAB.instalmentAmount).should('exist').and('contain.text', '£20.00');
      cy.get(PAYMENT_TERMS_TAB.instalmentFrequency).should('exist').and('contain.text', 'Monthly');
      cy.get(PAYMENT_TERMS_TAB.effectiveDate).should('exist').and('contain.text', '23 October 2025');
      cy.get(PAYMENT_TERMS_TAB.daysInDefault).should('exist').and('contain.text', '9');
      cy.get(PAYMENT_TERMS_TAB.dateDaysInDefaultImposed).should('exist').and('contain.text', '21 October 2025');
      cy.get(PAYMENT_TERMS_TAB.paymentCardRequested).should('exist').and('contain.text', '11 October 2025');
    });

  it('AC2: User with permission to amend payment terms, change link - Company', { tags: [...buildTags('@JIRA-STORY:PO-1637'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4152'] }, () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };

      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, header, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-terms/amend']);
    });

  it('AC2: User with permission to amend payment terms in different BU, no change link - Company', { tags: [...buildTags('@JIRA-STORY:PO-1637'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4153'] }, () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };

      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
      interceptDefendantHeader(accountId, header, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-terms/denied/permission']);
    });

  it('AC2: User without permission to amend payment terms, no change link - Company', { tags: [...buildTags('@JIRA-STORY:PO-1637'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4154'] }, () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };

      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, header, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').should('not.exist');
    });

  it('AC3: Payment terms with amendments panel - Company', { tags: [...buildTags('@JIRA-STORY:PO-1637'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4155'] }, () => {
      const header = buildCompanyHeaderMock();
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.payment_terms.extension = true;
      paymentTermsMock.payment_terms.reason_for_extension = 'Payment delay reason';

      setupPaymentTermsScreen(header, paymentTermsMock);

      cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
      cy.get(PAYMENT_TERMS_TAB.headingName).should('exist').and('contain.text', 'Test Org Ltd');
      cy.get(PAYMENT_TERMS_TAB.tableTitle).should('exist').and('contain.text', 'Payment terms amendments');
      cy.get(PAYMENT_TERMS_TAB.dateLastAmended).should('exist').and('contain.text', '21 October 2025');
      cy.get(PAYMENT_TERMS_TAB.lastAmendedBy).should('exist').and('contain.text', 'opal-test-2');
      cy.get(PAYMENT_TERMS_TAB.amendmentReason).should('exist').and('contain.text', 'Payment delay reason');
    });

  it('AC1: Individual with permission to amend payment terms can request a payment card', { tags: [...buildTags('@JIRA-STORY:PO-1700'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4156'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.last_enforcement = 'REM';

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.contains(PAYMENT_TERMS_TAB.paymentTermsLink, 'Request payment card').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-card/request']);
    });

  it('AC1b: Individual with permission to amend payment terms cannot request a payment card when enforcement prevents it', { tags: [...buildTags('@JIRA-STORY:PO-1700'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4157'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.last_enforcement = 'DW';

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('DW');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.contains(PAYMENT_TERMS_TAB.paymentTermsLink, 'Request payment card').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-card/denied/enforcement']);
    });

  it('AC1a: Individual without amend payment terms permission does not see Request payment card', { tags: [...buildTags('@JIRA-STORY:PO-1700'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4158'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.last_enforcement = 'REM';

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.contains(PAYMENT_TERMS_TAB.paymentTermsLink, 'Request payment card').should('not.exist');
    });

  it('AC1: Parent or guardian can request a payment card when enforcement allows', { tags: [...buildTags('@JIRA-STORY:PO-1701'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4159'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.last_enforcement = 'REM';

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.contains(PAYMENT_TERMS_TAB.paymentTermsLink, 'Request payment card').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-card/request']);
    });

  it('AC1b: Parent or guardian cannot request a payment card when enforcement prevents it', { tags: [...buildTags('@JIRA-STORY:PO-1701'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4160'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.last_enforcement = 'DW';
      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('DW');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.contains(PAYMENT_TERMS_TAB.paymentTermsLink, 'Request payment card').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-card/denied/enforcement']);
    });

  it('AC1a:  Parent or guardian without amend payment terms permission does not see Request payment card', { tags: [...buildTags('@JIRA-STORY:PO-1701'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4161'] }, () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'Parent/Guardian';
      headerMock.parent_guardian_party_id = '1770000001';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.last_enforcement = 'REM';

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.contains(PAYMENT_TERMS_TAB.paymentTermsLink, 'Request payment card').should('not.exist');
    });

  it('AC1: Company can request a payment card when enforcement allows', { tags: [...buildTags('@JIRA-STORY:PO-1702'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4162'] }, () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };

      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.last_enforcement = 'REM';

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, header, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.contains(PAYMENT_TERMS_TAB.paymentTermsLink, 'Request payment card').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-card/request']);
    });

  it('AC1b: Company cannot request a payment card when enforcement prevents it', { tags: [...buildTags('@JIRA-STORY:PO-1702'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4163'] }, () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.last_enforcement = 'DW';
      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, header, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('DW');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');
      cy.contains(PAYMENT_TERMS_TAB.paymentTermsLink, 'Request payment card').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-card/denied/enforcement']);
    });

  it('AC1a:  Company without amend payment terms permission does not see Request payment card', { tags: [...buildTags('@JIRA-STORY:PO-1702'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4164'] }, () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.last_enforcement = 'REM';

      const accountId = header.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(accountId, header, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.contains(PAYMENT_TERMS_TAB.paymentTermsLink, 'Request payment card').should('not.exist');
    });
});
