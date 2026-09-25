import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from '../../../CommonIntercepts/CommonUserState.mocks';
import {
  getImpositionCreditorCell,
  getImpositionCreditorLink,
} from '../../../../shared/selectors/account-enquiry/account.enquiry.imposition-creditor-names.locators';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from './mocks/defendant_details_at_glance_mock';
import { DEFENDANT_HEADER_MOCK } from './mocks/defendant_details_mock';
import { IMPOSITION_CREDITOR_NAMES_MOCK } from './mocks/imposition-creditor-names.mock';
import {
  interceptAtAGlance,
  interceptDefendantHeader,
  interceptImpositions,
} from './intercept/defendantAccountIntercepts';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';

const ACCOUNT_ID = DEFENDANT_HEADER_MOCK.defendant_account_party_id;

const setupImpositionsScreen = () => {
  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  interceptDefendantHeader(ACCOUNT_ID, structuredClone(DEFENDANT_HEADER_MOCK), '123');
  interceptAtAGlance(Number(ACCOUNT_ID), structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK), '123');
  interceptImpositions(ACCOUNT_ID, structuredClone(IMPOSITION_CREDITOR_NAMES_MOCK), '123');

  setupAccountEnquiryComponent({
    accountId: ACCOUNT_ID,
    fragments: 'impositions',
    interceptedRoutes: ['/access-denied'],
  });
};

describe('Account Enquiry Imposition creditor names', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });

  it(
    'PO-10571: displays each creditor type from the revised creditor summary response',
    { tags: ['@PO-10571', '@R1B'] },
    () => {
      setupImpositionsScreen();
      cy.wait('@getImpositions');

      cy.get(getImpositionCreditorCell(0)).should('contain.text', 'Example Company Ltd');
      cy.get(getImpositionCreditorLink(0)).should('exist');

      cy.get(getImpositionCreditorCell(1)).should('contain.text', 'Example Individual');
      cy.get(getImpositionCreditorLink(1)).should('exist');

      cy.get(getImpositionCreditorCell(2)).should('contain.text', 'SurnameOnly');
      cy.get(getImpositionCreditorLink(2)).should('exist');

      cy.get(getImpositionCreditorCell(3)).should('contain.text', 'Example Major Creditor');
      cy.get(getImpositionCreditorLink(3)).should('exist');

      cy.get(getImpositionCreditorCell(4)).should('contain.text', 'Central Fund');
      cy.get(getImpositionCreditorLink(4)).should('not.exist');

      cy.get(getImpositionCreditorCell(5)).should('contain.text', 'Minor Creditor');
      cy.get(getImpositionCreditorLink(5)).should('exist');
    },
  );
});
