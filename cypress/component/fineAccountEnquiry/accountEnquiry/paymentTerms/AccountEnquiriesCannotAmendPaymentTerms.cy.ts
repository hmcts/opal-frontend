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
    'AC1: The Payment Terms tab is built as per the design artefact for pay in full - Adult or youth only',
    { tags: ['PO-1801'] },
    () => {
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
      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
    },
  );

  it.only(
    'AC1: Display Change link for users with Amend Payment Terms permission and show error screen if extend_ttp_disallow is TRUE',
    { tags: ['PO-1801'] },
    () => {
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
      setupAccountEnquiryComponent({
        ...componentProperties,
        accountId: accountId,
      });
      history.pushState(
        {
          accountStatusCode: 'CS',
          lastEnforcement: 'REM',
        },
        '',
        '',
      );
      cy.get('router-outlet').should('exist');

      cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Change').click();
      cy.get('div#root0').find('h1').contains(' You cannot amend the payment terms of this account.').should('exist');
      cy.get('div#root0')
        .find('p')
        .contains('This account has an enforcement action outstanding: REM.')
        .should('exist');
    },
  );
});
