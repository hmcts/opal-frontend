/**
 * @file account-enquiry.change-links.steps.ts
 * @description
 * Additional Account Enquiry step definitions used only by the PO-2671 / PO-8248
 * Defendant tab section Change link scenarios.
 */

import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { AccountDetailsNavActions } from '../../../e2e/functional/opal/actions/account-details/details.nav.actions';
import { applyUniqPlaceholder } from '../../utils/stringUtils';
import { log } from '../../utils/log.helper';
import { AccountParentOrGuardianDetailsLocators as PG } from '../../../shared/selectors/account-details/account.parent-guardian.details.locators';
import { AccountPaymentTermsDetailsLocators as PT } from '../../../shared/selectors/account-details/account.payment-terms.details.locators';
import { PAYMENT_TERMS_AMEND_ELEMENTS as A } from '../../../shared/selectors/account-enquiry/account.enquiry.payment-terms-amend.locators';

const navActions = () => new AccountDetailsNavActions();

/**
 * @step Opens a specific Change link from the Defendant tab summary cards.
 * @param section - Visible summary card title to target.
 */
When('I open the {string} Change link on the Defendant tab', (section: string) => {
  const resolvedSection = applyUniqPlaceholder(section);
  log('step', 'Opening Defendant tab section Change link', { section: resolvedSection });

  navActions().goToDefendantTab();
  cy.contains('app-fines-acc-defendant-details-defendant-tab .govuk-summary-card', resolvedSection)
    .should('be.visible')
    .within(() => {
      cy.contains('a', 'Change').should('be.visible').click();
    });
});

/**
 * @step Opens a specific Change link from the Parent or guardian tab summary cards.
 * @param section - Visible summary card title to target.
 */
When('I open the {string} Change link on the Parent or guardian tab', (section: string) => {
  const resolvedSection = applyUniqPlaceholder(section);
  log('step', 'Opening Parent or guardian tab section Change link', { section: resolvedSection });

  navActions().goToParentGuardianTab();

  const cardSelectorBySection: Record<string, string> = {
    'Parent or guardian details': PG.parentOrGuardian.card,
    'Contact details': PG.contact.card,
    'Employer details': PG.employer.card,
  };

  const cardSelector = cardSelectorBySection[resolvedSection];
  if (!cardSelector) {
    throw new Error(`Unsupported Parent or guardian section "${resolvedSection}"`);
  }

  cy.get(cardSelector, { timeout: 10_000 })
    .should('be.visible')
    .within(() => {
      cy.contains('a', 'Change').should('be.visible').click();
    });
});

/**
 * @step Confirms the amend page route, fragment, and target section after opening a Change link.
 * @param partyType - `individual` or `company` amend route target.
 * @param fragment - Expected fragment inside the amend page.
 */
Then(
  'I should be on the {string} amend route with fragment {string}',
  (partyType: 'individual' | 'company' | 'parentGuardian', fragment: string) => {
    const resolvedFragment = applyUniqPlaceholder(fragment);
    const resolvedPartyType = applyUniqPlaceholder(partyType);
    const expectedHeader =
      resolvedPartyType === 'company'
        ? 'Company details'
        : resolvedPartyType === 'parentGuardian'
          ? 'Parent or guardian details'
          : 'Defendant details';
    const expectedPathSegment = `/party/${resolvedPartyType}/amend`;

    log('assert', 'Asserting amend route and fragment', {
      partyType: resolvedPartyType,
      fragment: resolvedFragment,
      expectedHeader,
    });

    cy.location('pathname', { timeout: 10_000 }).should('include', expectedPathSegment);
    cy.location('hash', { timeout: 10_000 }).should('eq', `#${resolvedFragment}`);
    cy.get('main h1.govuk-heading-l', { timeout: 10_000 }).should('be.visible').and('contain.text', expectedHeader);
    cy.get('app-fines-acc-debtor-add-amend-form', { timeout: 10_000 }).should('be.visible');
    cy.get(`#${resolvedFragment}`, { timeout: 10_000 }).scrollIntoView().should('be.visible');
  },
);

/**
 * @step Verifies the Payment terms Change link is scoped inside the payment terms panel.
 */
Then('I should only see one Change link inside the Payment terms panel', () => {
  log('assert', 'Asserting Payment terms Change link is scoped to the panel');

  cy.get(PT.tabRoot, { timeout: 10_000 }).should('be.visible').within(() => {
    cy.contains('a', 'Change').should('be.visible');
    cy.get('a')
      .filter((_, link) => link.textContent?.trim() === 'Change')
      .should('have.length', 1);
  });

  cy.get('main', { timeout: 10_000 })
    .find('a')
    .filter((_, link) => link.textContent?.trim() === 'Change')
    .should('have.length', 1);
});

/**
 * @step Verifies the Payment terms amend screen is displayed after selecting Change.
 */
Then('I should be on the Payment terms amend screen', () => {
  log('assert', 'Asserting Payment terms amend screen is visible');

  cy.location('pathname', { timeout: 10_000 }).should('include', '/payment-terms/amend');
  cy.location('hash', { timeout: 10_000 }).should('eq', `#select-payment-terms`);
  cy.get(A.form, { timeout: 10_000 }).should('be.visible');
  cy.get(A.pageHeading, { timeout: 10_000 }).should('contain.text', 'Payment terms');
});
