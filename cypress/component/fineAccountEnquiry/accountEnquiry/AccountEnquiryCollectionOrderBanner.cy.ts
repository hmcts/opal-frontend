import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-latest.mock';
import { ACCOUNT_ENQUIRY_HEADER_ELEMENTS as HEADER } from '../../../shared/selectors/account-enquiry/account.enquiry.header.locators';
import { DOM_ELEMENTS } from '../../../shared/selectors/account-enquiry/account.enquiry.version-control.locators';
import {
  interceptAuthenticatedUser,
  interceptResultByCode,
  interceptUserState,
} from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from '../../CommonIntercepts/CommonUserState.mocks';
import {
  DEFENDANT_HEADER_MOCK,
  DEFENDANT_HEADER_ORG_MOCK,
  DEFENDANT_HEADER_YOUTH_MOCK,
} from './mocks/defendant_details_mock';
import {
  interceptAtAGlance,
  interceptDefendantDetails,
  interceptDefendantHeader,
  interceptEnforcementStatus,
  interceptHistoryAndNotes,
  interceptPaymentTerms,
} from './intercept/defendantAccountIntercepts';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import { IComponentProperties } from './setup/setupComponent.interface';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

const componentProperties: IComponentProperties = {
  accountId: '77',
  fragments: 'at-a-glance',
  interceptedRoutes: ['/access-denied', '../note/add'],
};

const setupAccountDetails = (
  headerMock: typeof DEFENDANT_HEADER_MOCK,
  enforcementMock: typeof OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK,
) => {
  interceptAuthenticatedUser();
  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  interceptDefendantHeader(77, headerMock, '123');
  interceptDefendantDetails(
    77,
    {
      version: headerMock.version,
      defendant_account_party: structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK.defendant_account_party),
    },
    '123',
  );
  interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '123');
  interceptPaymentTerms(77, OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK, '123');
  interceptResultByCode('REM');
  interceptEnforcementStatus(77, enforcementMock, '123');
  interceptHistoryAndNotes(77, OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK, '123');

  setupAccountEnquiryComponent(componentProperties);
  cy.get(HEADER.pageHeader).should('exist');
};

describe('Account Enquiry Collection Order Banner', () => {
  it(
    'AC1a, AC1b, AC1c, AC4. Shows the adult collection order banner, keeps it across tabs, and passes axe',
    { tags: [...buildTags('@JIRA-LABEL:accessibility')] },
    () => {
      const enforcementMock = {
        ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK),
        defendant_account_type: 'adult',
        enforcement_overview: {
          ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK.enforcement_overview),
          collection_order: {
            collection_order_date: '2025-12-10',
            collection_order_flag: false,
          },
        },
      };

      setupAccountDetails(structuredClone(DEFENDANT_HEADER_MOCK), enforcementMock);

      cy.get(DOM_ELEMENTS.collectionOrderBanner).should('be.visible');
      cy.get(DOM_ELEMENTS.collectionOrderBannerIcon).should('have.attr', 'type', 'error');
      cy.get(DOM_ELEMENTS.collectionOrderBannerText).should('contain.text', 'Account has no Collection Order.');

      cy.get(DOM_ELEMENTS.defendantTab).click();
      cy.get(DOM_ELEMENTS.collectionOrderBannerText).should('contain.text', 'Account has no Collection Order.');

      cy.get(DOM_ELEMENTS.paymentTermsTab).click();
      cy.get(DOM_ELEMENTS.collectionOrderBannerText).should('contain.text', 'Account has no Collection Order.');

      cy.get(DOM_ELEMENTS.enforcementTab).click();
      cy.get(DOM_ELEMENTS.collectionOrderBannerText).should('contain.text', 'Account has no Collection Order.');

      cy.get(DOM_ELEMENTS.historyNotesTab).click();
      cy.get(DOM_ELEMENTS.collectionOrderBannerText).should('contain.text', 'Account has no Collection Order.');

      cy.injectAxe();
      cy.checkA11y('body');
    },
  );

  it('AC2a, AC2b, AC2c. Shows the youth collection order banner', { tags: [...buildTags()] }, () => {
    const enforcementMock = {
      ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK),
      defendant_account_type: 'youth',
      enforcement_overview: {
        ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK.enforcement_overview),
        collection_order: {
          collection_order_date: '2025-12-10',
          collection_order_flag: true,
        },
      },
    };

    setupAccountDetails(structuredClone(DEFENDANT_HEADER_YOUTH_MOCK), enforcementMock);

    cy.get(DOM_ELEMENTS.collectionOrderBannerText).should(
      'contain.text',
      'Account has a Collection Order but is a youth account.',
    );
  });

  it('AC3a, AC3b, AC3c. Shows the company collection order banner', { tags: [...buildTags()] }, () => {
    const enforcementMock = {
      ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK),
      defendant_account_type: 'company',
      enforcement_overview: {
        ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK.enforcement_overview),
        collection_order: {
          collection_order_date: '2025-12-10',
          collection_order_flag: true,
        },
      },
    };

    setupAccountDetails(structuredClone(DEFENDANT_HEADER_ORG_MOCK), enforcementMock);

    cy.get(DOM_ELEMENTS.collectionOrderBannerText).should(
      'contain.text',
      'Account has a Collection Order but is a company account.',
    );
  });
});
