import { FINES_ACCOUNT_TYPES } from 'src/app/flows/fines/constants/fines-account-types.constant';
import { FINES_ACC_DEBTOR_TYPES } from 'src/app/flows/fines/fines-acc/constants/fines-acc-debtor-types.constant';
import { ACCOUNT_ENQUIRY_HEADER_ELEMENTS as H } from '../../../../shared/selectors/account-enquiry/account.enquiry.header.locators';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from '../../../CommonIntercepts/CommonUserState.mocks';
import { interceptAtAGlance, interceptDefendantHeader } from './intercept/defendantAccountIntercepts';
import { DEFENDANT_HEADER_MOCK } from './mocks/defendant_details_mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from './mocks/defendant_details_at_glance_mock';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import { IComponentProperties } from './setup/setupComponent.interface';

const buildTags = (...tags: string[]): string[] => [...tags, '@JIRA-LABEL:account-enquiry', '@R1B'];

const componentProperties: IComponentProperties = {
  accountId: '77',
  fragments: undefined,
  interceptedRoutes: ['/access-denied'],
};

const mountHeader = (header: typeof DEFENDANT_HEADER_MOCK): void => {
  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  interceptDefendantHeader(77, header, '1');
  interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');
  setupAccountEnquiryComponent(componentProperties);
};

const assertPermanentWarning = (message: string): void => {
  cy.get(H.collectionOrderWarningBanner).should('be.visible').and('contain.text', message);
  cy.get(H.collectionOrderWarningAlert).should('be.visible');
  cy.get(H.collectionOrderWarningBanner).find('button').should('not.exist');
};

describe('Account Enquiry - Collection Order warnings', () => {
  beforeEach(() => interceptAuthenticatedUser());

  const collectionOrderAccounts = [
    [
      'Youth',
      'Account has a Collection Order but is a youth account.',
      (header: typeof DEFENDANT_HEADER_MOCK) => {
        header.is_youth = true;
      },
    ],
    [
      'Company',
      'Account has a Collection Order but is a company account.',
      (header: typeof DEFENDANT_HEADER_MOCK) => {
        header.party_details.organisation_flag = true;
      },
    ],
    [
      'Conditional Caution',
      'Account has a Collection Order but is a conditional caution account.',
      (header: typeof DEFENDANT_HEADER_MOCK) => {
        header.account_type = FINES_ACCOUNT_TYPES['Conditional Caution'];
      },
    ],
  ] as const;

  const alignedAccounts = [
    ['Adult', true, (header: typeof DEFENDANT_HEADER_MOCK) => undefined],
    [
      'Youth',
      false,
      (header: typeof DEFENDANT_HEADER_MOCK) => {
        header.is_youth = true;
      },
    ],
    [
      'Company',
      false,
      (header: typeof DEFENDANT_HEADER_MOCK) => {
        header.party_details.organisation_flag = true;
      },
    ],
    [
      'Conditional Caution',
      false,
      (header: typeof DEFENDANT_HEADER_MOCK) => {
        header.account_type = FINES_ACCOUNT_TYPES['Conditional Caution'];
      },
    ],
  ] as const;

  it(
    'AC1, AC3, AC4: warns permanently when an adult account has no Collection Order',
    { tags: buildTags('@JIRA-STORY:PO-3395', '@JIRA-EPIC:PO-2630') },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.collection_order = false;
      mountHeader(header);
      assertPermanentWarning('Account has no Collection Order.');
    },
  );

  it(
    'AC1, AC3: treats a parent or guardian to pay account as adult',
    { tags: buildTags('@JIRA-STORY:PO-3395', '@JIRA-EPIC:PO-2630') },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.collection_order = false;
      header.debtor_type = FINES_ACC_DEBTOR_TYPES.parentGuardian;
      header.is_youth = true;
      mountHeader(header);
      assertPermanentWarning('Account has no Collection Order.');
    },
  );

  collectionOrderAccounts.forEach(([accountType, message, configure]) => {
    it(
      `AC2, AC3, AC4: warns permanently when a ${accountType} account has a Collection Order`,
      { tags: buildTags('@JIRA-STORY:PO-3395', '@JIRA-EPIC:PO-2630') },
      () => {
        const header = structuredClone(DEFENDANT_HEADER_MOCK);
        header.collection_order = true;
        configure(header);
        mountHeader(header);
        assertPermanentWarning(message);
      },
    );
  });

  alignedAccounts.forEach(([accountType, collectionOrder, configure]) => {
    it(
      `AC5: does not warn when Collection Order status aligns with a ${accountType} account`,
      { tags: buildTags('@JIRA-STORY:PO-3395', '@JIRA-EPIC:PO-2630') },
      () => {
        const header = structuredClone(DEFENDANT_HEADER_MOCK);
        header.collection_order = collectionOrder;
        configure(header);
        mountHeader(header);
        cy.get(H.collectionOrderWarningBanner).should('not.exist');
      },
    );
  });

  it(
    'does not warn when collection_order is unavailable from the Header API',
    { tags: buildTags('@JIRA-STORY:PO-3395', '@JIRA-EPIC:PO-2630') },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.collection_order = null;
      mountHeader(header);
      cy.get(H.collectionOrderWarningBanner).should('not.exist');
    },
  );
});
