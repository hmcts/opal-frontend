import { ACCOUNT_ENQUIRY_HEADER_ELEMENTS as DOM } from '../../../shared/selectors/account-enquiry/account.enquiry.header.locators';
import {
  USER_STATE_MOCK_NO_PERMISSION,
  USER_STATE_MOCK_PERMISSION_BU77,
} from '../../CommonIntercepts/CommonUserState.mocks';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { interceptMinorCreditorAtAGlance, interceptMinorCreditorHeader } from './intercept/defendantAccountIntercepts';
import { IComponentProperties } from './setup/setupComponent.interface';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK } from 'src/app/flows/fines/fines-acc/fines-acc-minor-creditor-details/mocks/fines-acc-minor-creditor-details-header.mock';
import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-minor-creditor-at-a-glance-with-defendant.mock';
import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITHOUT_DEFENDANT_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-minor-creditor-at-a-glance-without-defendant.mock';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const STORY_TAG = '@JIRA-STORY:PO-1917';
const EPIC_TAG = '@JIRA-EPIC:PO-2234';

const buildTags = (...tags: string[]): string[] => [...tags, STORY_TAG, EPIC_TAG, ACCOUNT_ENQUIRY_JIRA_LABEL];

const minorCreditorAccountId = FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK.creditor.account_id;

const componentProperties: IComponentProperties = {
  accountId: minorCreditorAccountId.toString(),
  routeRoot: 'minor-creditor',
  fragments: 'at-a-glance',
  interceptedRoutes: ['/access-denied', '../note/add', '../payment-hold/add', '../payment-hold/remove'],
};

const normalizeText = (text: string): string =>
  text
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const createUserStateWithPaymentHoldPermission = () => {
  const userState = structuredClone(USER_STATE_MOCK_PERMISSION_BU77);

  userState.business_unit_users[0].permissions.push({
    permission_id: 12,
    permission_name: 'Add and Remove Payment Hold',
  });

  return userState;
};

const createIndividualMinorCreditorHeaderMock = () => {
  const header = structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK);

  header.creditor.has_associated_defendant = true;
  header.party.organisation_flag = false;
  header.party.organisation_details = undefined;
  header.party.individual_details = {
    title: 'Mrs',
    forenames: 'Jane Amelia',
    surname: 'Bloggs',
  };

  return header;
};

const createIndividualMinorCreditorAtAGlanceMock = () => {
  const atAGlance = structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK);

  atAGlance.party.organisation_flag = false;
  atAGlance.party.organisation_details = null;
  atAGlance.party.individual_details = {
    title: 'Mrs',
    forenames: 'Jane Amelia',
    surname: 'Bloggs',
    date_of_birth: null,
    age: null,
    national_insurance_number: null,
    individual_aliases: null,
  };
  atAGlance.address = {
    address_line_1: '1 High Street',
    address_line_2: 'Town Centre',
    address_line_3: 'Westminster',
    address_line_4: null,
    address_line_5: null,
    postcode: 'sw1a 1aa',
  };
  atAGlance.defendant = {
    account_number: 'ACC-654321',
    account_id: 123456789,
    title: 'Mr',
    forenames: 'John',
    surname: 'Doe',
  };
  atAGlance.payment.is_bacs = true;
  atAGlance.payment.hold_payment = false;

  return atAGlance;
};

const setupMinorCreditorAtAGlance = (
  userState: typeof USER_STATE_MOCK_NO_PERMISSION,
  header = structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK),
  atAGlance = structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITHOUT_DEFENDANT_MOCK),
) => {
  interceptUserState(userState);
  interceptMinorCreditorHeader(minorCreditorAccountId, header, '1');
  interceptMinorCreditorAtAGlance(minorCreditorAccountId, atAGlance, '1');
  setupAccountEnquiryComponent(componentProperties);
};

describe('Minor Creditor Account Summary - At a Glance Tab', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });

  it(
    'AC1a, AC1b, AC2a, AC3a, AC4a: builds the read-only at a glance tab, displays all three sections, shows a clickable defendant account link, and shows BACS as provided when a defendant is associated',
    { tags: buildTags() },
    () => {
      const header = createIndividualMinorCreditorHeaderMock();
      const atAGlance = createIndividualMinorCreditorAtAGlanceMock();

      setupMinorCreditorAtAGlance(USER_STATE_MOCK_NO_PERMISSION, header, atAGlance);
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen');
      });

      cy.get(DOM.pageHeader).should('exist');
      cy.get(DOM.accountInfo).should('exist');
      cy.get(DOM.summaryMetricBar).should('exist');
      cy.get(DOM.subnav).should('exist');
      cy.get(DOM.minorCreditorAtAGlanceTabComponent).should('exist');

      // AC1a, AC1b, AC2a: the At a Glance tab is built as a read-only view with all three sections present.
      cy.get(DOM.minorCreditorAtAGlanceTabComponent).find(DOM.sectionHeading).should('have.length', 3);
      cy.contains(DOM.sectionHeading, DOM.labelMinorCreditor).should('be.visible');
      cy.contains(DOM.sectionHeading, DOM.labelDefendantAccount).should('be.visible');
      cy.contains(DOM.sectionHeading, DOM.labelPayoutStatus).should('be.visible');
      cy.get(DOM.readOnlyFields).should('not.exist');

      // AC1b: the Minor creditor section displays the configured read-only name and address fields.
      cy.contains(DOM.fieldHeading, DOM.labelName)
        .next(DOM.fieldValue)
        .invoke('text')
        .then((text) => {
          expect(normalizeText(text)).to.eq('Mrs Jane Amelia BLOGGS');
        });

      cy.contains(DOM.fieldHeading, DOM.labelAddress)
        .next(DOM.fieldValue)
        .invoke('text')
        .then((text) => {
          expect(normalizeText(text)).to.eq('1 High Street Town Centre Westminster SW1A 1AA');
        });

      // AC3a: the Defendant account number is rendered as a clickable link that navigates to the associated account.
      cy.contains(DOM.fieldHeading, DOM.labelDefendantAccount)
        .next(DOM.fieldValue)
        .find(DOM.linkText)
        .should('have.attr', 'href', '')
        .should('have.text', 'ACC-654321')
        .click();

      cy.get('@windowOpen').its('firstCall.args.0').should('contain', 'defendant/123456789/details');

      cy.contains(DOM.fieldHeading, DOM.labelDefendantName)
        .next(DOM.fieldValue)
        .invoke('text')
        .then((text) => {
          expect(normalizeText(text)).to.eq('Mr John DOE');
        });

      // AC1b, AC4a: the Payout status section includes the BACS details heading and the provided badge value.
      cy.contains(DOM.fieldHeading, DOM.labelBacsDetails).should('be.visible');
      cy.get(DOM.badgeBlue).should('contain.text', DOM.labelProvided).and('have.class', 'moj-badge--blue');
    },
  );

  it(
    'AC2b, AC4a: shows only the minor creditor and payout status sections when no defendant is associated, and shows BACS as not provided',
    { tags: buildTags() },
    () => {
      const atAGlance = structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITHOUT_DEFENDANT_MOCK);

      atAGlance.payment.hold_payment = true;

      setupMinorCreditorAtAGlance(
        USER_STATE_MOCK_NO_PERMISSION,
        structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK),
        atAGlance,
      );

      cy.get(DOM.pageHeader).should('exist');

      // AC2b: when no defendant is associated, only the Minor creditor and Payout status sections are displayed.
      cy.get(DOM.minorCreditorAtAGlanceTabComponent).should('exist');
      cy.get(DOM.minorCreditorAtAGlanceTabComponent).find(DOM.sectionHeading).should('have.length', 2);
      cy.contains(DOM.sectionHeading, DOM.labelMinorCreditor).should('be.visible');
      cy.contains(DOM.sectionHeading, DOM.labelPayoutStatus).should('be.visible');
      cy.get(DOM.minorCreditorAtAGlanceTabComponent).should('not.contain.text', DOM.labelDefendantAccount);

      // AC1b, AC4a: the Payout status section includes the BACS details heading and the not-provided badge value.
      cy.contains(DOM.fieldHeading, DOM.labelBacsDetails).should('be.visible');
      cy.get(DOM.badgeRed).should('contain.text', DOM.labelNotProvided).and('have.class', 'moj-badge--red');
      cy.get(DOM.minorCreditorAtAGlanceTabComponent).should('not.contain.text', DOM.labelAddPaymentHold);
      cy.get(DOM.minorCreditorAtAGlanceTabComponent).should('not.contain.text', DOM.labelRemovePaymentHold);
    },
  );

  it(
    'Permissions: shows Add payment hold when the user has add and remove payment hold permission',
    { tags: buildTags() },
    () => {
      const userState = createUserStateWithPaymentHoldPermission();
      const atAGlance = structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITHOUT_DEFENDANT_MOCK);

      atAGlance.payment.hold_payment = false;

      setupMinorCreditorAtAGlance(userState, structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK), atAGlance);

      cy.contains(DOM.linkText, DOM.labelAddPaymentHold).should('be.visible').click();
      cy.get('@routerNavigate')
        .its('lastCall.args.0')
        .should((arg0) => {
          const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0);
          expect(path).to.match(/payment-hold\/add/);
        });
    },
  );

  it(
    'Permissions: shows Remove payment hold when the user has add and remove payment hold permission and the account is on hold',
    { tags: buildTags() },
    () => {
      const userState = createUserStateWithPaymentHoldPermission();
      const atAGlance = structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITHOUT_DEFENDANT_MOCK);

      atAGlance.payment.hold_payment = true;

      setupMinorCreditorAtAGlance(userState, structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK), atAGlance);

      cy.get(DOM.minorCreditorAtAGlanceTabComponent).should('not.contain.text', DOM.labelAddPaymentHold);
      cy.contains(DOM.linkText, DOM.labelRemovePaymentHold).should('be.visible').click();
      cy.get('@routerNavigate')
        .its('lastCall.args.0')
        .should((arg0) => {
          const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0);
          expect(path).to.match(/payment-hold\/remove/);
        });
    },
  );
});
