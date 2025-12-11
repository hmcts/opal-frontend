import {
  createDefendantHeaderMockWithName,
  DEFENDANT_HEADER_MOCK,
  USER_STATE_MOCK_NO_PERMISSION,
  USER_STATE_MOCK_PERMISSION_BU17,
  USER_STATE_MOCK_PERMISSION_BU77,
} from '.././mocks/defendant_details_mock';

import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-latest.mock';
import { ACCOUNT_ENQUIRY_PAYMENT_TERMS_ELEMENTS as PAYMENT_TERMS_TAB } from '.././constants/account_enquiry_payment_terms_elements';
import { interceptDefendantHeader, interceptPaymentTerms } from '.././intercept/defendantAccountIntercepts';
import {
  interceptAuthenticatedUser,
  interceptResultByCode,
  interceptUserState,
} from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { IComponentProperties } from '.././setup/setupComponent.interface';
import { setupAccountEnquiryComponent } from '.././setup/SetupComponent';
import { DEFENDANT_HEADER_ORG_MOCK } from '.././mocks/defendant_details_mock';

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
      '../party/:partyId',
      '../party/:partyId/amend',
      '../',
      // Add more routes here as needed
    ],
  };

  it(
    'AC1: Display Change link for users with Amend Payment Terms permission and show error screen if extend_ttp_disallow is TRUE',
    { tags: ['PO-1801'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('John', 'Smith'));
      headerMock.debtor_type = 'individual';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.last_enforcement = 'DW';

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('DW');
      setupAccountEnquiryComponent({
        ...componentProperties,
        accountId: accountId,
      });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('h1').contains(' You cannot amend the payment terms of this account.').should('exist');
      cy.get('p').contains('This account has an enforcement action outstanding: DW.').should('exist');
    },
  );

  it('AC1.2ai: Display appropriate message based on defendant account status (CS)', { tags: ['PO-1801'] }, () => {
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
    cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
    cy.get('h1').contains(' You cannot amend the payment terms of this account.').should('exist');
    cy.get('p').contains('This account has been consolidated.').should('exist');
  });

  it('AC1.2ai: Display appropriate message based on defendant account status (WO)', { tags: ['PO-1801'] }, () => {
    let headerMock = structuredClone(createDefendantHeaderMockWithName('Alice', 'Smith'));
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
    cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
    cy.get('h1').contains(' You cannot amend the payment terms of this account.').should('exist');
    cy.get('p').contains('This account has been written-off.').should('exist');
  });

  it('AC1.2ai: Display appropriate message based on defendant account status (TO)', { tags: ['PO-1801'] }, () => {
    let headerMock = structuredClone(createDefendantHeaderMockWithName('Alice', 'Smith'));
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
    cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
    cy.get('h1').contains(' You cannot amend the payment terms of this account.').should('exist');
    cy.get('p').contains('This account has been transferred out.').should('exist');
  });

  it('AC1.2ai: Display appropriate message based on defendant account status (TA)', { tags: ['PO-1801'] }, () => {
    let headerMock = structuredClone(createDefendantHeaderMockWithName('Alice', 'Smith'));
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
    cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
    cy.get('h1').contains(' You cannot amend the payment terms of this account.').should('exist');
    cy.get('p').contains('This account has been transferred out.').should('exist');
  });

  it('AC1.2ai: Display appropriate message based on defendant account status (TS)', { tags: ['PO-1801'] }, () => {
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
    cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
    cy.get('h1').contains(' You cannot amend the payment terms of this account.').should('exist');
    cy.get('p').contains('This account has been transferred out.').should('exist');
  });

  it('AC1.2aii: If the account has a zero balance,', { tags: ['PO-1801'] }, () => {
    let headerMock = structuredClone(createDefendantHeaderMockWithName('Alice', 'Smith'));
    headerMock.payment_state_summary.account_balance = 0.0;
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
    cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
    cy.get('h1').contains(' You cannot amend the payment terms of this account.').should('exist');
    cy.get('p').contains('The account has a zero balance.').should('exist');
  });

  it(
    'AC1.2b: Navigate to error screen if user lacks Amend Payment Terms permission in account BU',
    { tags: ['PO-1801'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Alice', 'Smith'));
      headerMock.debtor_type = 'individual';
      headerMock.account_status_reference.account_status_code = 'TA';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('h1').contains(' You cannot amend the payment terms of this account.').should('exist');
      cy.get('p')
        .contains(
          'You do not have the required permissions to make changes to this account as it is outside your business unit.',
        )
        .should('exist');
    },
  );

  it(
    'AC1: Display Change link for users with Amend Payment Terms permission and show error screen if extend_ttp_disallow is TRUE for company defendant',
    { tags: ['PO-1801'] },
    () => {
      const headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
      headerMock.party_details.organisation_details = {
        organisation_name: 'Acme Corporation',
        organisation_aliases: [],
      };

      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
      paymentTermsMock.last_enforcement = 'DW';

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('DW');
      setupAccountEnquiryComponent({
        ...componentProperties,
        accountId: accountId,
      });
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('h1').contains(' You cannot amend the payment terms of this account.').should('exist');
      cy.get('p').contains('This account has an enforcement action outstanding: DW.').should('exist');
    },
  );

  it(
    'AC1.2ai: Display appropriate message based on defendant account status (CS) for company defendants',
    { tags: ['PO-1801'] },
    () => {
      const headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
      headerMock.party_details.organisation_details = {
        organisation_name: 'Acme Corporation',
        organisation_aliases: [],
      };
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
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('h1').contains(' You cannot amend the payment terms of this account.').should('exist');
      cy.get('p').contains('This account has been consolidated.').should('exist');
    },
  );

  it(
    'AC1.2ai: Display appropriate message based on defendant account status (WO) for company defendants',
    { tags: ['PO-1801'] },
    () => {
      const headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
      headerMock.party_details.organisation_details = {
        organisation_name: 'Acme Corporation',
        organisation_aliases: [],
      };
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
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('h1').contains(' You cannot amend the payment terms of this account.').should('exist');
      cy.get('p').contains('This account has been written-off.').should('exist');
    },
  );

  it(
    'AC1.2ai: Display appropriate message based on defendant account status (TO) for company defendants',
    { tags: ['PO-1801'] },
    () => {
      const headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
      headerMock.party_details.organisation_details = {
        organisation_name: 'Acme Corporation',
        organisation_aliases: [],
      };
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
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('h1').contains(' You cannot amend the payment terms of this account.').should('exist');
      cy.get('p').contains('This account has been transferred out.').should('exist');
    },
  );

  it(
    'AC1.2ai: Display appropriate message based on defendant account status (TA) for company defendants',
    { tags: ['PO-1801'] },
    () => {
      const headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
      headerMock.party_details.organisation_details = {
        organisation_name: 'Acme Corporation',
        organisation_aliases: [],
      };
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
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('h1').contains(' You cannot amend the payment terms of this account.').should('exist');
      cy.get('p').contains('This account has been transferred out.').should('exist');
    },
  );

  it(
    'AC1.2ai: Display appropriate message based on defendant account status (TS) for company defendants',
    { tags: ['PO-1801'] },
    () => {
      const headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
      headerMock.party_details.organisation_details = {
        organisation_name: 'Acme Corporation',
        organisation_aliases: [],
      };
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
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('h1').contains(' You cannot amend the payment terms of this account.').should('exist');
      cy.get('p').contains('This account has been transferred out.').should('exist');
    },
  );

  it('AC1.2aii: If the account has a zero balance for company defendants', { tags: ['PO-1801'] }, () => {
    const headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
    headerMock.party_details.organisation_details = {
      organisation_name: 'Acme Corporation',
      organisation_aliases: [],
    };
    headerMock.payment_state_summary.account_balance = 0.0;
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
    cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
    cy.get('h1').contains(' You cannot amend the payment terms of this account.').should('exist');
    cy.get('p').contains('The account has a zero balance.').should('exist');
  });

  it(
    'AC1.2b: Navigate to error screen if user lacks Amend Payment Terms permission in account BU',
    { tags: ['PO-1801'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Alice', 'Smith'));
      headerMock.debtor_type = 'individual';
      headerMock.account_status_reference.account_status_code = 'TA';
      let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptPaymentTerms(accountId, paymentTermsMock, '123');
      interceptResultByCode('REM');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('h1').contains(' You cannot amend the payment terms of this account.').should('exist');
      cy.get('p')
        .contains(
          'You do not have the required permissions to make changes to this account as it is outside your business unit.',
        )
        .should('exist');
    },
  );
});
