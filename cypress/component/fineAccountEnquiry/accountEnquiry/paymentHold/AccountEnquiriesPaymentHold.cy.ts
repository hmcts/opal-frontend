import { ACCOUNT_ENQUIRY_HEADER_ELEMENTS as DOM } from '../../../../shared/selectors/account-enquiry/account.enquiry.header.locators';
import { DOM_ELEMENTS as VERSION_CONTROL } from '../../../../shared/selectors/account-enquiry/account.enquiry.version-control.locators';
import { USER_STATE_MOCK_NO_PERMISSION } from '../../../CommonIntercepts/CommonUserState.mocks';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import {
  interceptMinorCreditorAtAGlance,
  interceptMinorCreditorAtAGlanceSequence,
  interceptMinorCreditorHeader,
  interceptPatchMinorCreditorAccount,
} from '../intercept/defendantAccountIntercepts';
import { IComponentProperties } from '../setup/setupComponent.interface';
import { buildSeededAccountStore } from '../setup/SeededStores';
import { setupAccountEnquiryComponent } from '../setup/SetupComponent';
import {
  createMinorCreditorAtAGlanceWithoutDefendantMock,
  createMinorCreditorHeaderMock,
  createUserStateWithPaymentHoldPermission,
  createUserStateWithPaymentHoldPermissionInDifferentBusinessUnit,
  MINOR_CREDITOR_ACCOUNT_ID,
} from '../mocks/minor_creditor_at_a_glance.mock';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const ADD_PAYMENT_HOLD_STORY_TAG = '@JIRA-STORY:PO-1930';
const REMOVE_PAYMENT_HOLD_STORY_TAG = '@JIRA-STORY:PO-1934';
const PAYMENT_HOLD_EPIC_TAG = '@JIRA-EPIC:PO-2234';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

const componentProperties: IComponentProperties = {
  accountId: MINOR_CREDITOR_ACCOUNT_ID.toString(),
  routeRoot: 'minor-creditor',
  fragments: 'at-a-glance',
  interceptedRoutes: [
    '/access-denied',
    '../note/add',
    '../payment-hold/add',
    '../payment-hold/remove',
    '../payment-hold/denied',
  ],
};

const buildMinorCreditorPartyName = (header = createMinorCreditorHeaderMock()): string => {
  if (header.party.organisation_flag) {
    return header.party.organisation_details?.organisation_name ?? '';
  }

  return [
    header.party.individual_details?.title,
    header.party.individual_details?.forenames,
    header.party.individual_details?.surname,
  ]
    .filter(Boolean)
    .join(' ');
};

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

const setupPaymentHoldPage = (
  routeSegment: 'add' | 'remove',
  userState: typeof USER_STATE_MOCK_NO_PERMISSION,
  atAGlanceResponses: ReturnType<typeof createMinorCreditorAtAGlanceWithoutDefendantMock>[],
) => {
  const header = createMinorCreditorHeaderMock();

  interceptUserState(userState);
  interceptMinorCreditorHeader(MINOR_CREDITOR_ACCOUNT_ID, header, '1');
  interceptMinorCreditorAtAGlanceSequence(MINOR_CREDITOR_ACCOUNT_ID, atAGlanceResponses, '1');
  interceptPatchMinorCreditorAccount(MINOR_CREDITOR_ACCOUNT_ID);

  setupAccountEnquiryComponent({
    ...componentProperties,
    targetPath: `/minor-creditor/${MINOR_CREDITOR_ACCOUNT_ID}/payment-hold/${routeSegment}`,
    fragments: undefined,
    finesAccountStoreFactory: () =>
      buildSeededAccountStore(MINOR_CREDITOR_ACCOUNT_ID, {
        account_number: header.creditor.account_number,
        party_name: buildMinorCreditorPartyName(header),
        party_type: 'Minor Creditor',
        base_version: header.version ?? '1',
        business_unit_id: header.business_unit.business_unit_id,
      }),
  });
};

const setupAddPaymentHoldPage = (
  userState: typeof USER_STATE_MOCK_NO_PERMISSION,
  atAGlanceResponses: ReturnType<typeof createMinorCreditorAtAGlanceWithoutDefendantMock>[],
) => setupPaymentHoldPage('add', userState, atAGlanceResponses);

const setupRemovePaymentHoldPage = (
  userState: typeof USER_STATE_MOCK_NO_PERMISSION,
  atAGlanceResponses: ReturnType<typeof createMinorCreditorAtAGlanceWithoutDefendantMock>[],
) => setupPaymentHoldPage('remove', userState, atAGlanceResponses);

const assertPaymentHoldConfirmationScreen = (headingLabel: string, buttonSelector: string, buttonLabel: string) => {
  cy.get(DOM.headingWithCaption).should('exist');
  cy.get(DOM.headingName).should('contain.text', headingLabel);
  cy.get(buttonSelector).should('be.visible').and('contain.text', buttonLabel);
  cy.contains(DOM.cancelLink, DOM.labelNoCancel).should('be.visible');
};

describe('Minor Creditor Payment Hold', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });

  describe('Add Payment Hold', () => {
    it('AC1a, AC2a: displays Add payment hold and navigates to the Payment Hold Confirmation screen when the user has permission in the associated BU', { tags: buildTags(ADD_PAYMENT_HOLD_STORY_TAG, PAYMENT_HOLD_EPIC_TAG, '@JIRA-TEST-KEY:PO-4238') }, () => {
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
      });

    it('AC1b: displays Add payment hold and navigates to the denied screen when the user only has permission in a different BU', { tags: buildTags(ADD_PAYMENT_HOLD_STORY_TAG, PAYMENT_HOLD_EPIC_TAG, '@JIRA-TEST-KEY:PO-4239') }, () => {
        const userState = createUserStateWithPaymentHoldPermissionInDifferentBusinessUnit();
        const atAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();

        atAGlance.payment.hold_payment = false;

        setupMinorCreditorAtAGlance(userState, createMinorCreditorHeaderMock(), atAGlance);

        cy.contains(DOM.linkText, DOM.labelAddPaymentHold).should('be.visible').click();
        cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-hold/denied']);
      });

    it('AC1c: does not display Add payment hold when the user has no payment hold permission in any BU', { tags: buildTags(ADD_PAYMENT_HOLD_STORY_TAG, PAYMENT_HOLD_EPIC_TAG, '@JIRA-TEST-KEY:PO-4240') }, () => {
        const atAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();

        atAGlance.payment.hold_payment = false;

        setupMinorCreditorAtAGlance(USER_STATE_MOCK_NO_PERMISSION, createMinorCreditorHeaderMock(), atAGlance);

        cy.get(DOM.minorCreditorAtAGlanceTabComponent).should('not.contain.text', DOM.labelAddPaymentHold);
      });

    it('AC3a: renders the add payment hold confirmation screen with Yes - add hold and No - cancel actions', { tags: buildTags(ADD_PAYMENT_HOLD_STORY_TAG, PAYMENT_HOLD_EPIC_TAG, '@JIRA-TEST-KEY:PO-4241') }, () => {
        const initialAtAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();
        initialAtAGlance.payment.hold_payment = false;

        setupAddPaymentHoldPage(createUserStateWithPaymentHoldPermission(), [initialAtAGlance]);

        assertPaymentHoldConfirmationScreen(
          DOM.labelAddPaymentHoldConfirmation,
          DOM.addPaymentHoldButton,
          DOM.labelYesAddHold,
        );
      });

    it('AC3a: No - cancel returns to the At a Glance tab without saving any changes', { tags: buildTags(ADD_PAYMENT_HOLD_STORY_TAG, PAYMENT_HOLD_EPIC_TAG, '@JIRA-TEST-KEY:PO-4242') }, () => {
        const initialAtAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();
        initialAtAGlance.payment.hold_payment = false;

        setupAddPaymentHoldPage(createUserStateWithPaymentHoldPermission(), [initialAtAGlance, initialAtAGlance]);

        cy.contains(DOM.cancelLink, DOM.labelNoCancel).click();

        cy.get('@patchMinorCreditorAccount.all').should('have.length', 0);
        cy.get(DOM.minorCreditorAtAGlanceTabComponent).should('exist');
        cy.contains(DOM.linkText, DOM.labelAddPaymentHold).should('be.visible');
      });

    it('AC3a, AC3b: Yes - add hold posts the update, returns to At a Glance, shows Payments are on hold, and the banner persists after refresh', { tags: buildTags(ADD_PAYMENT_HOLD_STORY_TAG, PAYMENT_HOLD_EPIC_TAG, '@JIRA-TEST-KEY:PO-4243') }, () => {
        const initialAtAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();
        initialAtAGlance.payment.hold_payment = false;

        const updatedAtAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();
        updatedAtAGlance.payment.hold_payment = true;

        setupAddPaymentHoldPage(createUserStateWithPaymentHoldPermission(), [initialAtAGlance, updatedAtAGlance]);

        cy.get(DOM.addPaymentHoldButton).click();

        cy.wait('@patchMinorCreditorAccount').its('request.body.payment.hold_payment').should('equal', true);
        cy.get(DOM.minorCreditorAtAGlanceTabComponent).should('exist');
        cy.contains(VERSION_CONTROL.warningBannerText, VERSION_CONTROL.labelPaymentsOnHold).should('be.visible');

        setupMinorCreditorAtAGlance(
          createUserStateWithPaymentHoldPermission(),
          createMinorCreditorHeaderMock(),
          updatedAtAGlance,
        );

        cy.get(DOM.minorCreditorAtAGlanceTabComponent).should('exist');
        cy.contains(VERSION_CONTROL.warningBannerText, VERSION_CONTROL.labelPaymentsOnHold).should('be.visible');
      });
  });

  describe('Remove Payment Hold', () => {
    it('AC1a, AC2a: displays Remove payment hold and navigates to the Payment Hold Confirmation screen when the user has permission in the associated BU', { tags: buildTags(REMOVE_PAYMENT_HOLD_STORY_TAG, PAYMENT_HOLD_EPIC_TAG, '@JIRA-TEST-KEY:PO-4244') }, () => {
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
      });

    it('AC1b: displays Remove payment hold and navigates to the denied screen when the user only has permission in a different BU', { tags: buildTags(REMOVE_PAYMENT_HOLD_STORY_TAG, PAYMENT_HOLD_EPIC_TAG, '@JIRA-TEST-KEY:PO-4245') }, () => {
        const userState = createUserStateWithPaymentHoldPermissionInDifferentBusinessUnit();
        const atAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();

        atAGlance.payment.hold_payment = true;

        setupMinorCreditorAtAGlance(userState, createMinorCreditorHeaderMock(), atAGlance);

        cy.get(DOM.minorCreditorAtAGlanceTabComponent).should('not.contain.text', DOM.labelAddPaymentHold);
        cy.contains(DOM.linkText, DOM.labelRemovePaymentHold).should('be.visible').click();
        cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../payment-hold/denied']);
      });

    it('AC1c: does not display Remove payment hold when the user has no payment hold permission in any BU', { tags: buildTags(REMOVE_PAYMENT_HOLD_STORY_TAG, PAYMENT_HOLD_EPIC_TAG, '@JIRA-TEST-KEY:PO-4246') }, () => {
        const atAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();

        atAGlance.payment.hold_payment = true;

        setupMinorCreditorAtAGlance(USER_STATE_MOCK_NO_PERMISSION, createMinorCreditorHeaderMock(), atAGlance);

        cy.get(DOM.minorCreditorAtAGlanceTabComponent).should('not.contain.text', DOM.labelRemovePaymentHold);
      });

    it('AC3a: renders the remove payment hold confirmation screen with Yes - remove hold and No - cancel actions', { tags: buildTags(REMOVE_PAYMENT_HOLD_STORY_TAG, PAYMENT_HOLD_EPIC_TAG, '@JIRA-TEST-KEY:PO-4247') }, () => {
        const initialAtAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();
        initialAtAGlance.payment.hold_payment = true;

        setupRemovePaymentHoldPage(createUserStateWithPaymentHoldPermission(), [initialAtAGlance]);

        assertPaymentHoldConfirmationScreen(
          DOM.labelRemovePaymentHoldConfirmation,
          DOM.removePaymentHoldButton,
          DOM.labelYesRemoveHold,
        );
      });

    it('AC3a: No - cancel returns to the At a Glance tab without saving any changes', { tags: buildTags(REMOVE_PAYMENT_HOLD_STORY_TAG, PAYMENT_HOLD_EPIC_TAG, '@JIRA-TEST-KEY:PO-4248') }, () => {
        const initialAtAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();
        initialAtAGlance.payment.hold_payment = true;

        setupRemovePaymentHoldPage(createUserStateWithPaymentHoldPermission(), [initialAtAGlance, initialAtAGlance]);

        cy.contains(DOM.cancelLink, DOM.labelNoCancel).click();

        cy.get('@patchMinorCreditorAccount.all').should('have.length', 0);
        cy.get(DOM.minorCreditorAtAGlanceTabComponent).should('exist');
        cy.contains(DOM.linkText, DOM.labelRemovePaymentHold).should('be.visible');
      });

    it('AC3a, AC3b: Yes - remove posts the update, returns to At a Glance, shows Payment hold removed, and the banner does not persist after refresh', { tags: buildTags(REMOVE_PAYMENT_HOLD_STORY_TAG, PAYMENT_HOLD_EPIC_TAG, '@JIRA-TEST-KEY:PO-4249') }, () => {
        const initialAtAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();
        initialAtAGlance.payment.hold_payment = true;

        const updatedAtAGlance = createMinorCreditorAtAGlanceWithoutDefendantMock();
        updatedAtAGlance.payment.hold_payment = false;

        setupRemovePaymentHoldPage(createUserStateWithPaymentHoldPermission(), [initialAtAGlance, updatedAtAGlance]);

        cy.get(DOM.removePaymentHoldButton).click();

        cy.wait('@patchMinorCreditorAccount').its('request.body.payment.hold_payment').should('equal', false);
        cy.get(DOM.minorCreditorAtAGlanceTabComponent).should('exist');
        cy.get(VERSION_CONTROL.successBanner)
          .should('exist')
          .find(VERSION_CONTROL.successBannerText)
          .should('contain.text', VERSION_CONTROL.labelPaymentHoldRemoved);

        setupMinorCreditorAtAGlance(
          createUserStateWithPaymentHoldPermission(),
          createMinorCreditorHeaderMock(),
          updatedAtAGlance,
        );

        cy.get(DOM.minorCreditorAtAGlanceTabComponent).should('exist');
        cy.get(VERSION_CONTROL.successBanner).should('not.exist');
      });
  });
});
