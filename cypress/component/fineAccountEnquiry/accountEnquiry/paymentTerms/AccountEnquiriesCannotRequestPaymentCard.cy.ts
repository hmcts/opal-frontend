import { createDefendantHeaderMockWithName } from '../mocks/defendant_details_mock';
import {
  USER_STATE_MOCK_PERMISSION_BU17,
  USER_STATE_MOCK_PERMISSION_BU77,
} from 'cypress/component/CommonIntercepts/CommonUserState.mocks';

import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-latest.mock';
import { ACCOUNT_ENQUIRY_PAYMENT_TERMS_ELEMENTS as PAYMENT_TERMS_TAB } from '../constants/account_enquiry_payment_terms_elements';
import { interceptDefendantHeader, interceptPaymentTerms } from '../intercept/defendantAccountIntercepts';
import {
  interceptAuthenticatedUser,
  interceptResultByCode,
  interceptUserState,
} from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { IComponentProperties } from '../setup/setupComponent.interface';
import { setupAccountEnquiryComponent } from '../setup/SetupComponent';

describe('Account Enquiry Payment Terms - Payment card', () => {
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

  it('Last enforcement action prevents the adding of a payment card', { tags: ['PO-1802'] }, () => {
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
    cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Request payment card').click();
    cy.get('h1').should('contain.text', 'You cannot request a payment card.');
    cy.get('p').should('contain.text', 'The last enforcement action prevents you from adding a payment card.');
    cy.get('p').should('contain.text', 'DW');
  });

  it('No permission in BU prevents the adding of a payment card', { tags: ['PO-1802'] }, () => {
    let headerMock = structuredClone(createDefendantHeaderMockWithName('John', 'Smith'));
    headerMock.debtor_type = 'individual';
    let paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
    paymentTermsMock.last_enforcement = 'REM';

    const accountId = headerMock.defendant_account_party_id;
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
    interceptDefendantHeader(accountId, headerMock, '123');
    interceptPaymentTerms(accountId, paymentTermsMock, '123');
    interceptResultByCode('REM');
    setupAccountEnquiryComponent({
      ...componentProperties,
      accountId: accountId,
    });
    cy.get('router-outlet').should('exist');

    cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Request payment card').click();
    cy.get('h1').contains('You cannot request a payment card.');
    cy.get('p').contains('Your business unit does not allow payment card requests.');
  });

  it('AC1a: User can request a payment card and sees the confirmation screen', { tags: ['PO-1700'] }, () => {
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
    setupAccountEnquiryComponent({
      ...componentProperties,
      accountId: accountId,
    });
    cy.get('router-outlet').should('exist');

    cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Request payment card').click();
    cy.get('h1').should('contain.text', 'Do you want to request a payment card for the defendant?');
    cy.contains('button', 'Yes - request a payment card').should('exist');
    cy.contains('a', 'No - cancel').should('exist');
  });

  it('AC1bi: Cancel returns to Payment terms with no changes made', { tags: ['PO-1700'] }, () => {
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
    setupAccountEnquiryComponent({
      ...componentProperties,
      accountId: accountId,
    });
    cy.get('router-outlet').should('exist');

    cy.get(PAYMENT_TERMS_TAB.paymentTermsLink).contains('Request payment card').click();
    cy.contains('a', 'No - cancel').click();

    cy.get(PAYMENT_TERMS_TAB.tabName).should('contain.text', 'Payment terms');
    cy.get('opal-lib-moj-alert[type="success"]').should('not.exist');
    cy.get(PAYMENT_TERMS_TAB.paymentCardRequested).should('contain.text', '11 October 2025');
  });
});
