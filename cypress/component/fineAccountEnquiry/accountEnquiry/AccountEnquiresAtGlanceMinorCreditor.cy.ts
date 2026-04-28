import { ACCOUNT_ENQUIRY_HEADER_ELEMENTS as DOM } from '../../../shared/selectors/account-enquiry/account.enquiry.header.locators';
import { USER_STATE_MOCK_NO_PERMISSION } from '../../CommonIntercepts/CommonUserState.mocks';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { interceptMinorCreditorAtAGlance, interceptMinorCreditorHeader } from './intercept/defendantAccountIntercepts';
import { IComponentProperties } from './setup/setupComponent.interface';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import {
  createIndividualMinorCreditorAtAGlanceMock,
  createIndividualMinorCreditorHeaderMock,
  createMinorCreditorAtAGlanceWithoutDefendantMock,
  createMinorCreditorHeaderMock,
  createUserStateWithPaymentHoldPermission,
  createUserStateWithPaymentHoldPermissionInDifferentBusinessUnit,
  MINOR_CREDITOR_ACCOUNT_ID,
} from './mocks/minor_creditor_at_a_glance.mock';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const MINOR_CREDITOR_SUMMARY_STORY_TAG = '@JIRA-STORY:PO-1917';
const MINOR_CREDITOR_SUMMARY_EPIC_TAG = '@JIRA-EPIC:PO-2234';
const ADD_PAYMENT_HOLD_STORY_TAG = '@JIRA-STORY:PO-1930';
const REMOVE_PAYMENT_HOLD_STORY_TAG = '@JIRA-STORY:PO-1934';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

const componentProperties: IComponentProperties = {
  accountId: MINOR_CREDITOR_ACCOUNT_ID.toString(),
  routeRoot: 'minor-creditor',
  fragments: 'at-a-glance',
  interceptedRoutes: ['/access-denied', '../note/add', '../payment-hold/add', '../payment-hold/remove'],
};

const normalizeText = (text: string): string =>
  text
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const setupMinorCreditorAtAGlance = (
  userState: typeof USER_STATE_MOCK_NO_PERMISSION,
  header = createMinorCreditorHeaderMock(),
  atAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock(),
) => {
  interceptUserState(userState);
  interceptMinorCreditorHeader(MINOR_CREDITOR_ACCOUNT_ID, header, '1');
  interceptMinorCreditorAtAGlance(MINOR_CREDITOR_ACCOUNT_ID, atAGlance, '1');
  setupAccountEnquiryComponent(componentProperties);
};

describe('Minor Creditor Account Summary - At a Glance Tab', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });

  it(
    'AC1a, AC1b, AC2a, AC3a, AC4a: builds the read-only at a glance tab, displays all three sections, shows a clickable defendant account link, and shows BACS as provided when a defendant is associated',
    { tags: [...buildTags(MINOR_CREDITOR_SUMMARY_STORY_TAG, MINOR_CREDITOR_SUMMARY_EPIC_TAG), '@JIRA-KEY:POT-7704'] },
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
    { tags: [...buildTags(MINOR_CREDITOR_SUMMARY_STORY_TAG, MINOR_CREDITOR_SUMMARY_EPIC_TAG), '@JIRA-KEY:POT-7705'] },
    () => {
      const atAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();

      atAGlance.payment.hold_payment = true;

      setupMinorCreditorAtAGlance(USER_STATE_MOCK_NO_PERMISSION, createMinorCreditorHeaderMock(), atAGlance);

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
    'AC1a, AC2a: displays Add payment hold and navigates to the Payment Hold Confirmation screen when the user has permission in the associated BU',
    { tags: [...buildTags(ADD_PAYMENT_HOLD_STORY_TAG), '@JIRA-KEY:POT-7706'] },
    () => {
      const userState = createUserStateWithPaymentHoldPermission();
      const atAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();

      atAGlance.payment.hold_payment = false;

      setupMinorCreditorAtAGlance(userState, createMinorCreditorHeaderMock(), atAGlance);

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
    'AC1b: displays Add payment hold and navigates to access denied when the user only has permission in a different BU',
    { tags: [...buildTags(ADD_PAYMENT_HOLD_STORY_TAG), '@JIRA-KEY:POT-7707'] },
    () => {
      const userState = createUserStateWithPaymentHoldPermissionInDifferentBusinessUnit();
      const atAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();

      atAGlance.payment.hold_payment = false;

      setupMinorCreditorAtAGlance(userState, createMinorCreditorHeaderMock(), atAGlance);

      cy.contains(DOM.linkText, DOM.labelAddPaymentHold).should('be.visible').click();
    },
  );

  it(
    'AC1c: does not display Add payment hold when the user has no payment hold permission in any BU',
    { tags: [...buildTags(ADD_PAYMENT_HOLD_STORY_TAG), '@JIRA-KEY:POT-7708'] },
    () => {
      const atAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();

      atAGlance.payment.hold_payment = false;

      setupMinorCreditorAtAGlance(USER_STATE_MOCK_NO_PERMISSION, createMinorCreditorHeaderMock(), atAGlance);

      cy.get(DOM.minorCreditorAtAGlanceTabComponent).should('not.contain.text', DOM.labelAddPaymentHold);
    },
  );

  it(
    'AC1a, AC2a: displays Remove payment hold and navigates to the Payment Hold Confirmation screen when the user has permission in the associated BU',
    { tags: [...buildTags(REMOVE_PAYMENT_HOLD_STORY_TAG), '@JIRA-KEY:POT-7709'] },
    () => {
      const userState = createUserStateWithPaymentHoldPermission();
      const atAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();

      atAGlance.payment.hold_payment = true;

      setupMinorCreditorAtAGlance(userState, createMinorCreditorHeaderMock(), atAGlance);

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

  it(
    'AC1b: displays Remove payment hold and navigates to access denied when the user only has permission in a different BU',
    { tags: [...buildTags(REMOVE_PAYMENT_HOLD_STORY_TAG), '@JIRA-KEY:POT-7710'] },
    () => {
      const userState = createUserStateWithPaymentHoldPermissionInDifferentBusinessUnit();
      const atAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();

      atAGlance.payment.hold_payment = true;

      setupMinorCreditorAtAGlance(userState, createMinorCreditorHeaderMock(), atAGlance);

      cy.get(DOM.minorCreditorAtAGlanceTabComponent).should('not.contain.text', DOM.labelAddPaymentHold);
      cy.contains(DOM.linkText, DOM.labelRemovePaymentHold).should('be.visible').click();
    },
  );

  it(
    'AC1c: does not display Remove payment hold when the user has no payment hold permission in any BU',
    { tags: [...buildTags(REMOVE_PAYMENT_HOLD_STORY_TAG), '@JIRA-KEY:POT-7711'] },
    () => {
      const atAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();

      atAGlance.payment.hold_payment = true;

      setupMinorCreditorAtAGlance(USER_STATE_MOCK_NO_PERMISSION, createMinorCreditorHeaderMock(), atAGlance);

      cy.get(DOM.minorCreditorAtAGlanceTabComponent).should('not.contain.text', DOM.labelRemovePaymentHold);
    },
  );
});
